// Original-client emission fixtures, not projectile travel, hit-rate or DPS measurements.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { mirror } from './fetch-build.mjs';
import { loadGame, Run } from './play.mjs';

const main = process.argv[2] ?? 'main-8zbhOvtE.js';
assert.equal(main, 'main-8zbhOvtE.js', 'Recheck original consumers before rebinding');
const hash = (v) => createHash('sha256').update(v).digest('hex');
const sources = {
  'main-8zbhOvtE.js': '7ff8520c6503b9052f8b53013c30af37b5c452ecea7a0d0ed5584eb4f2010478',
  'sim-DpazMjS2.js': 'f6bc620d2ea311a52f90cc280b32c73a2769707859ea1e33c20943b74588677e',
  'boot-BnSaTwvC.js': '41750d41565912ea467fded28ab76b0bf04e4b53a121072de902522550efd4fd',
  'intro-shared-BzGhBf9a.js': '24beb3e16e8da35dea12ed278b80cc83ede70173b8052d97b77c96592421483e',
};
const { dir } = await mirror(undefined, main);
for (const [file, sha] of Object.entries(sources)) assert.equal(hash(readFileSync(`${dir}/${file}`)), sha);
const file = `${dir}/sim-DpazMjS2.js`, original = readFileSync(file, 'utf8');
let api;
try {
  writeFileSync(file, original + '\nexport { Uj as runeStats, Wj as runeTick, id as runeHash, mk as runeTarget };');
  api = await loadGame(main);
} finally { writeFileSync(file, original); }
// No gameplay services can be contacted after loading the archived original client.
globalThis.fetch = async () => { throw new Error('Network forbidden in rune fixtures'); };
const weapons = ['frozen-fries', 'fry-knives', 'rosti-disc', 'spud-cannon', 'spud-lob', 'tot-toss'];
const catalog = Object.values(api.sim).find((v) => Array.isArray(v?.all) && typeof v.of === 'function' && typeof v.byId === 'function');
const runes = catalog.all.filter((r) => weapons.includes(r.weapon));
assert.equal(runes.length, 18);
const near = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-4, `${label}: ${a} != ${b}`);
const rows = [];
for (const seed of ['s1', 's2', 's3']) for (const amountBonus of [0, 3]) for (const rune of runes) {
  const run = new Run(api, { seed, mode: 'standard', difficulty: 'normal' });
  const s = run.state;
  s.loadout.weapons.length = 0;
  run.give('weapon', rune.weapon);
  const w = s.loadout.weapon(rune.weapon);
  s.loadout.stats.values[api.STAT.amountBonus] = amountBonus;
  const baseline = { ...api.sim.runeStats(s, w, {}) };
  s.choiceQueue.unshift({ kind: 'levelUp', offers: [{ type: 'rune', slot: w.slot, rune: rune.id }] });
  run.game.choose({ type: 'pick', index: 0 });
  assert.deepEqual(w.runes.fits, [true]);
  assert.equal(s.run.runes.at(-1).id, rune.id);
  s.enemies.pool.clear(); s.bosses.pool.clear();
  const e = s.enemies, slots = [];
  for (const [dx, dy, hp, max] of [[30, 0, 100, 100], [0, 70, 1, 300]]) {
    const i = e.pool.spawn(); slots.push(i);
    e.x[i] = s.player.x[s.me] + dx; e.y[i] = s.player.y[s.me] + dy;
    e.radius[i] = 4; e.hp[i] = hp; e.maxHp[i] = max;
  }
  api.sim.runeHash(s);
  const toughest = rune.effects.some((e) => e.kind === 'toughest');
  assert.equal(api.sim.runeTarget(s, w, s.player.x[s.me], s.player.y[s.me], 100), slots[toughest ? 1 : 0]);
  assert.equal(api.sim.runeTarget(s, w, s.player.x[s.me], s.player.y[s.me], 40), slots[0], 'out-of-range high max HP excluded');
  assert.equal(api.sim.runeTarget(s, w, 10000, 10000, 10), undefined);
  if (toughest) {
    e.maxHp[slots[0]] = 300;
    assert.equal(api.sim.runeTarget(s, w, s.player.x[s.me], s.player.y[s.me], 100), slots[0], 'max-HP tie prefers nearer');
    e.maxHp[slots[0]] = 100;
  }
  const volleys = [], starts = [], shotTicks = [];
  w.cd = 0; w.volleyLeft = 0;
  for (let tick = 0; tick < 12000 && volleys.length < 6; tick++) {
    s.tick++; s.time += 1 / 60;
    const stat = { ...api.sim.runeStats(s, w, {}) }, before = w.runes.beats;
    const count = s.projectiles.pool.count;
    api.sim.runeTick(s, w, stat, 1 / 60);
    for (let j = count; j < s.projectiles.pool.count; j++) shotTicks.push(tick);
    if (w.runes.beats !== before) {
      starts.push(tick);
      const expected = { ...baseline };
      for (const [key, mult] of Object.entries(rune.scale ?? {})) expected[key] *= mult;
      for (const effect of rune.effects) {
        if (effect.kind === 'focus') {
          expected.damage *= 1 + effect.damage * (baseline.amount - 1);
          expected.area *= 1 + effect.area * (baseline.amount - 1);
          expected.amount = 1;
        } else if (effect.kind === 'salvo') {
          expected.cooldown *= effect.volleys; expected.amount *= effect.volleys; expected.interval = 0;
        } else if (effect.kind === 'beat' && w.runes.beats % effect.every === 0) {
          expected.damage *= effect.damage; expected.area *= effect.area;
        }
      }
      for (const key of ['damage', 'cooldown', 'area', 'amount', 'speed', 'duration', 'interval']) near(stat[key], expected[key], `${rune.id} volley ${w.runes.beats} ${key}`);
    }
    if (w.runes.beats > volleys.length && w.volleyLeft === 0) {
      const shots = [];
      const p = s.projectiles;
      for (let j = 0; j < p.pool.count; j++) {
        const i = p.pool.slotAt(j);
        if (p.slot[i] !== w.slot) continue;
        near(p.damage[i], stat.damage, 'emitted damage');
        near(p.radius[i], w.def.behavior.size * Math.sqrt(stat.area), 'emitted radius');
        if (w.def.behavior.explodeRadius !== undefined) near(p.explodeRadius[i], w.def.behavior.explodeRadius * stat.area, 'emitted blast radius');
        shots.push({ angle: p.angle[i], vx: p.vx[i], vy: p.vy[i], damage: p.damage[i], radius: p.radius[i], blast: p.explodeRadius[i] });
      }
      assert.equal(shots.length, stat.amount, 'entire original volley emitted');
      const ring = rune.effects.find((e) => e.kind === 'ring');
      if (ring && shots.length > 1) {
        for (let i = 1; i < shots.length; i++) {
          if (ring.spokes === 0) near(shots[i].angle - shots[0].angle, i * 2 * Math.PI / shots.length, 'even ring ignores subsequent random aim');
          else assert.ok(Math.cos(shots[i].angle - shots[0].angle) * (i % 2 ? -1 : 1) >= Math.cos(3 * w.def.behavior.spread) - 1e-6, 'alternating forward/back with normal facing spread');
        }
      }
      if (toughest) near(shots[0].angle, Math.PI / 2, 'actual first projectile aims at high max HP, not low current HP');
      assert.equal(shotTicks.length, shots.length);
      for (let i = 1; i < shotTicks.length; i++) {
        const gap = (shotTicks[i] - shotTicks[i - 1]) / 60;
        if (stat.interval === 0) assert.equal(gap, 0, 'salvo emitted in one tick');
        else assert.ok(Math.abs(gap - stat.interval) <= 1 / 60 + 1e-6 && gap > 0, 'ordinary shots retain their tick-quantized spacing');
      }
      volleys.push({ number: w.runes.beats, tick, stats: stat, shotTicks: [...shotTicks], shots });
      shotTicks.length = 0;
      p.pool.clear();
    }
  }
  assert.equal(volleys.length, 6, 'six actual volleys, including third and sixth beat');
  for (let i = 1; i < starts.length; i++) near((starts[i] - starts[i - 1]) / 60, volleys[i - 1].stats.cooldown, 'natural attack cooldown between volley starts');
  const reshape = rune.effects.find((e) => e.kind === 'reshape');
  const baseDef = api.registry.weapon(rune.weapon);
  if (reshape) for (const [field, mult] of Object.entries(reshape.fields)) near(w.def.behavior[field], baseDef.behavior[field] * mult, `reshaped ${field}`);
  if (rune.id === 'spud-lob-hot-landing') near(w.def.behavior.explodeRadius, 26, 'added blast field');
  if (rune.id === 'spud-lob-wide-lob') assert.ok(volleys.flatMap((v) => v.shots).some((p) => Math.abs(p.vx) > baseDef.behavior.spreadX), 'original emission reaches beyond unmodified horizontal spread');
  rows.push({ seed, amountBonus, keys: [`rune:${rune.id}`], baseline, starts, volleys });
}
console.log(JSON.stringify({ main, scriptSha256: hash(readFileSync(new URL(import.meta.url))),
  sources: Object.entries(sources).map(([file, sha256]) => ({ url: `https://tibo.dog/assets/${file}`, sha256 })),
  definitions: Object.fromEntries(runes.map((r) => [`rune:${r.id}`, hash(JSON.stringify(r))])),
  setup: 'Standard/Normal,s1/s2/s3; supplied level-one base weapon and rune card; Amount bonus0/3; two static targets at30/70 with maxHP100/300,currentHP100/1. Original selection, stat computation and tick/dispatch consumers; six volleys each, original cooldowns. Not natural acquisition,max-level/evolved/union behavior,projectile movement/collision/status/bounce/landing hits,DPS,survival,server or device validation. No reward writes; network forbidden.', rows }, null, 2));
