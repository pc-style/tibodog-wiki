// Plays tibo.dog headlessly: loads the game's own sim chunk in Node and drives it tick by tick,
// so agents can measure what weapons, items, bosses and events really do instead of reading code.
// See .claude/skills/playing-tibo/SKILL.md.
//
// Usage:
//   node tools/play.mjs [options] [scenario.mjs]
//     --build main-XXXXXXXX.js  game build to play (default: data/build.json main; mirrored on demand)
//     --seed S                  run seed (default "wiki")
//     --mode M --difficulty D   e.g. --mode story, --difficulty hard (defaults: standard, normal)
//     --minutes N               autoplay length without a scenario (default 5)
//     --god                     keep Tibo alive (refills HP every tick)
// A scenario is a module whose default export is `async (run, api) => result`; the result is printed as JSON.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mirror } from './fetch-build.mjs';
import { loadEndgame } from './load-endgame.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const TPS = 60;

// Loads a build's sim and boot chunks with the browser globals stubbed, like tools/dump-build.mjs.
export async function loadGame(main = JSON.parse(readFileSync(join(ROOT, 'data/build.json'), 'utf8')).main) {
  let dir = join(ROOT, '.cache', main.replace(/\.js$/, ''), 'assets');
  if (!existsSync(join(dir, main))) dir = (await mirror(undefined, main)).dir;
  const P = new Proxy(function () {}, {
    get: (_, k) => (k === Symbol.toPrimitive ? () => 0 : k === 'then' ? undefined : P),
    apply: () => P,
    construct: () => P,
  });
  for (const k of ['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'location', 'matchMedia', 'requestAnimationFrame', 'HTMLElement', 'HTMLCanvasElement', 'Image', 'AudioContext', 'addEventListener', 'CSS', 'OffscreenCanvas', 'Worker', 'screen', 'devicePixelRatio', 'indexedDB', 'ResizeObserver', 'PerformanceObserver', 'FontFace', 'history'])
    if (!(k in globalThis)) try { globalThis[k] = P; } catch {}
  const file = (re) => readdirSync(dir).find((f) => re.test(f));
  const sim = await import(pathToFileURL(join(dir, file(/^sim-[A-Za-z0-9_-]{8}\.js$/))).href);
  const boot = await import(pathToFileURL(join(dir, file(/^boot-[A-Za-z0-9_-]{8}\.js$/))).href);
  await loadEndgame(boot);
  const extrasFile = file(/^run-rules-[A-Za-z0-9_-]{8}\.js$/) ?? file(/^run-extras-[A-Za-z0-9_-]{8}\.js$/);
  const extras = extrasFile ? Object.values(await import(pathToFileURL(join(dir, extrasFile)).href)).find((v) => v?.rules && v?.areas) : undefined;
  const Game = Object.values(sim).find((v) => v && typeof v === 'object' && typeof v.Game === 'function')?.Game;
  if (!Game) throw new Error(`no Game class in the sim chunk of ${main}`);
  const registry = Object.values(boot).find((v) => v && typeof v === 'object' && typeof v.weapon === 'function' && Array.isArray(v.allWeapons));
  // The sim's "recompute stats" function (minified name changes per build); found by what it does.
  const recompute = Object.values(sim).find((v) => typeof v === 'function' && v.length === 1 && /\.loadout\.recompute\(/.test(String(v)) && /curseTicks/.test(String(v)));
  // Index of each final stat in loadout.stats.values (a const enum, so only its literal is in the source).
  const lit = readFileSync(join(dir, file(/^sim-[A-Za-z0-9_-]{8}\.js$/)), 'utf8').match(/\{damageMult:0,[^}]*\}/)?.[0];
  const STAT = lit ? new Function(`return ${lit}`)() : {};
  return { main, dir, sim, boot, Game, registry, recompute, STAT, extras };
}

// One run. The game pauses itself on every choice; `policy` answers them so time keeps moving.
export class Run {
  constructor(api, { seed = 'wiki', mode, difficulty, god = false, policy = Run.firstPick } = {}) {
    this.api = api;
    this.game = new api.Game({ seed, mode, difficulty, headless: true, legendary: api.extras?.rules, areas: api.extras?.areas });
    this.state.recordEvents = true;
    this.god = god;
    this.policy = policy;
    this.events = [];
    this.choices = [];
  }
  static firstPick = () => ({ type: 'pick', index: 0 });
  get state() { return this.game.state; }
  get me() { return this.state.me; }
  get time() { return this.state.runClock; }
  get hp() { return this.state.player.hp[this.me]; }
  get pos() { const p = this.state.player; return { x: p.x[this.me], y: p.y[this.me] }; }

  move(dx, dy) { this.game.setInput(dx, dy); return this; }
  stop() { this.game.setInput(0, 0); return this; }
  dash(dx, dy) { this.game.dash(dx, dy); return this; }

  // Advances by `seconds` of game time; `each(run)` runs before every tick (steer, record, stop early by returning true).
  step(seconds = 1 / TPS, each) {
    const end = this.state.tick + Math.max(1, Math.round(seconds * TPS));
    while (this.state.tick < end && !this.game.over) {
      this.answerChoices();
      if (this.game.over || each?.(this) === true) break;
      if (this.god) this.state.player.hp[this.me] = 1e9; // hits still land and are recorded
      const before = this.state.tick;
      this.game.step();
      this.collect();
      if (this.state.tick === before && !this.game.choice) break; // paused for a reason we cannot answer
    }
    return this;
  }
  answerChoices() {
    for (let guard = 0; this.game.choice && guard < 100; guard++) {
      const c = this.game.choice;
      const action = this.policy(c, this);
      this.choices.push({ t: this.time, kind: c.kind, offers: c.offers?.map(offerId), action });
      this.game.choose(action);
      if (this.game.choice === c && JSON.stringify(action) === JSON.stringify(Run.firstPick())) break;
    }
  }
  collect() {
    for (const e of this.game.drainEvents()) this.events.push({ t: Math.round(this.time * 100) / 100, ...e });
  }

  // Grants a weapon or passive (a level each call) through the game's own level-up pick.
  give(type, id) {
    if (type === 'item') return this.giveItem(id);
    this.state.choiceQueue.unshift({ kind: 'levelUp', level: this.state.loadout.level, offers: [{ type, id, level: 1, isNew: true }] });
    this.game.choose({ type: 'pick', index: 0 });
    return this;
  }
  // Grants one stack of an item the way chests do: bump the item count, then recompute stats and item effects.
  giveItem(id) {
    if (!this.api.recompute) throw new Error('stat recompute function not found in this build; update tools/play.mjs');
    const items = this.state.loadout.items;
    items.set(id, (items.get(id) ?? 0) + 1);
    this.api.recompute(this.state);
    return this;
  }
  // Jumps the run clock forward (bosses, events and spawn tiers follow it). Tibo does not move.
  warp(seconds) {
    this.state.clock.ticks += Math.round(seconds * TPS);
    this.state.runClock = this.state.clock.ticks / TPS;
    return this;
  }

  // Final (post-formula) stat by name, e.g. stat('critChance'), stat('cooldownMult'); all of them with stats().
  stat(name) {
    if (!(name in this.api.STAT)) throw new Error(`unknown stat ${name}; known: ${Object.keys(this.api.STAT).join(', ')}`);
    return this.state.loadout.stats.values[this.api.STAT[name]];
  }
  stats() { return Object.fromEntries(Object.keys(this.api.STAT).map((k) => [k, round(this.stat(k))])); }

  weapons() { return this.state.loadout.weapons.map((w) => ({ id: w.def.id, level: w.level, damage: round(w.damageDealt), kills: w.kills })); }
  summary() {
    const s = this.state, r = s.run, l = s.loadout;
    const count = (type) => this.events.filter((e) => e.type === type).length;
    return {
      build: this.api.main,
      seed: s.seed, mode: s.mode, difficulty: s.difficulty,
      time: round(this.time), over: this.game.over, killer: r.killer || null,
      level: l.level, hp: round(this.hp), gold: l.gold, kills: r.kills,
      weapons: this.weapons(),
      passives: l.passives.map((p) => ({ id: p.def.id, level: p.level })),
      items: Object.fromEntries(l.items),
      stats: this.stats(),
      damageBySource: Object.fromEntries([...r.damageBySource].map(([k, v]) => [k, round(v)])),
      damageTakenBySource: Object.fromEntries([...r.damageTakenBySource].map(([k, v]) => [k, round(v)])),
      biomes: r.biomes, bossesKilled: r.bossesKilled, elitesKilled: r.elitesKilled,
      events: Object.fromEntries([...new Set(this.events.map((e) => e.type))].map((t) => [t, count(t)])),
    };
  }
}

const offerId = (o) => (o.id ? `${o.type}:${o.id}` : o.type);
const round = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n);

// Autoplay: walk in a slow circle so pests trail behind, dash every few seconds, take the first offer.
export function autoplay(run, minutes) {
  let a = 0;
  return run.step(minutes * 60, (r) => {
    a += 0.004;
    r.move(Math.cos(a), Math.sin(a));
    if (r.state.tick % 240 === 0) r.dash(Math.cos(a), Math.sin(a));
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
  const valued = new Set(['--build', '--seed', '--mode', '--difficulty', '--minutes']);
  const scenario = args.find((a, i) => !a.startsWith('--') && !valued.has(args[i - 1]));
  const api = await loadGame(opt('--build'));
  const run = new Run(api, { seed: opt('--seed', 'wiki'), mode: opt('--mode'), difficulty: opt('--difficulty'), god: args.includes('--god') });
  const result = scenario
    ? await (await import(pathToFileURL(resolve(scenario)).href)).default(run, api)
    : autoplay(run, Number(opt('--minutes', 5))).summary();
  console.log(JSON.stringify(result, null, 1));
}
