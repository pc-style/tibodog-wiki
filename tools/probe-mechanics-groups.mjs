// Original-client supplied-state checks, not natural acquisition or representative DPS.
// Export-only bridge is pinned to reviewed bytes. Never sends a gameplay request.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { mirror } from './fetch-build.mjs';
import { loadGame, Run } from './play.mjs';

const main = process.argv[2] ?? 'main-DwGb2BE_.js';
assert.equal(main, 'main-DwGb2BE_.js', 'review bridge before another source revision');
const { dir } = await mirror(undefined, main);
const file = 'sim-QJ0yqR8B.js', path = join(dir, file), source = readFileSync(path, 'utf8');
const hash = (s) => createHash('sha256').update(s).digest('hex');
assert.equal(hash(source), '5c2767b8384ac256c5de8c2482520cf6a9835b9484723b4357aa11bcf976d1fb');
writeFileSync(path, source + '\nexport { NM as systems, xD as buildGear, Uj as parameters, jx as special, Mx as cast, id as rehash, Y as attack, LO as resolveHit, W as slot, U as isBoss, Wk as steer, Uh as event, iM as familiars, F as variety, Ty as swing };\n');
let api;
try { api = await loadGame(main); } finally { writeFileSync(path, source); }
const client = api.sim;
const spawn = Object.values(client).find((v) => typeof v === 'function' && /^function \w+\(e,t,n,r\)\{return \w+\(e\),\w+\(e,t,n,r\)\}$/.test(String(v)));
assert.ok(spawn);
const rows = [];
const near = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-6, `${label}: ${a} != ${b}`);
function setup(seed, weapon) {
  const run = new Run(api, { seed, mode: 'standard', difficulty: 'normal' });
  run.state.loadout.weapons.length = 0;
  if (weapon) run.give('weapon', weapon);
  run.state.gearWeapons = client.buildGear(run.state);
  run.state.enemies.pool.clear();
  return run;
}
function pest(run, x, y, id = 'aphid') {
  const s = run.state, i = spawn(s, api.registry.enemyIndex(id), x, y);
  assert.ok(i >= 0);
  s.enemies.hp[i] = s.enemies.maxHp[i] = 1e7;
  s.enemies.speed[i] = s.enemies.damage[i] = s.enemies.xp[i] = s.enemies.goldChance[i] = 0;
  return i;
}
function params(s, w) { return client.parameters(s, w, {}); }
function resolve(s) {
  for (let i = 0; i < s.hits.count; i++) {
    const ref = s.hits.target[i], boss = client.isBoss(ref);
    client.resolveHit(s, boss ? s.bosses : s.enemies, client.slot(ref), i, boss);
  }
  s.hits.count = 0;
}
function record(seed, keys, checks, measured = {}) { rows.push({ seed, keys, checks, ...measured }); }
for (const seed of ['s1', 's2', 's3']) {
  {
    const run = setup(seed, 'afterburner-fries'), s = run.state;
    run.step(.1, () => s.enemies.pool.clear());
    assert.equal(s.projectiles.pool.count, 0, 'idle cannot fire');
    run.dash(1, 0).step(1 / 60, () => s.enemies.pool.clear());
    const p = s.projectiles;
    assert.equal(p.pool.count, 5, 'raw four plus Tibo amount');
    const angles = [];
    for (let j = 0; j < p.pool.count; j++) {
      const i = p.pool.slotAt(j);
      assert.ok(p.vx[i] < 0, 'all fries oppose dash');
      near(Math.hypot(p.vx[i], p.vy[i]), 300, 'speed');
      near(p.radius[i], 3, 'radius');
      angles.push(Math.atan2(p.vy[i], -p.vx[i]));
    }
    near(Math.max(...angles) - Math.min(...angles), 1.1, 'total fan width, not width per shot');
    run.step(.7, () => s.enemies.pool.clear());
    assert.equal(p.pool.count, 0, 'fries expire without second fan or oil');
    assert.equal(s.zones.pool.count, 0);
    record(seed, ['weapon:afterburner-fries'], 'idle/dash control; five backwards fries; fan width; speed/radius; expiry; no evolution oil');
  }
  {
    const run = setup(seed, 'broadside'), s = run.state, w = s.loadout.weapons[0];
    s.player.fx[s.me] = 1; s.player.fy[s.me] = 0;
    const p = params(s, w);
    client.cast(s, w, w.def.behavior, p, 0);
    const shells = s.gearWeapons.broadsideShells;
    assert.equal(shells.pool.count, 2, 'each amount emits both sides');
    const a = shells.pool.slotAt(0), b = shells.pool.slotAt(1);
    near(shells.x[a], run.pos.x - 22, 'row offset uses final amount three');
    near(shells.vx[a], 0, 'perpendicular X');
    near(shells.vy[a], -170, 'left side'); near(shells.vy[b], 170, 'right side');
    near(shells.armAt[a], 32 / 170, 'arming distance'); near(shells.flight[a], 56 / 170, 'flight distance');
    p.area = 4; client.cast(s, w, w.def.behavior, p, 1);
    const wide = shells.pool.slotAt(2);
    near(shells.radius[wide], 6, 'shell radius sqrt Area'); near(shells.explodeRadius[wide], 72, 'blast radius linear Area');
    const full = setup(seed, 'broadside'); full.step(.15, () => full.state.enemies.pool.clear());
    assert.equal(full.state.gearWeapons.broadsideShells.pool.count, 6, 'three rows times two sides');
    record(seed, ['weapon:broadside'], 'original casts: paired perpendicular shots, asymmetric row offsets, arming/flight, distinct Area scalings; full Game six-shell volley');
  }
  {
    const run = setup(seed, 'comet-scythe'), s = run.state, w = s.loadout.weapons[0];
    const p = params(s, w), b = w.def.behavior;
    near(client.swing(b, -Math.PI, 0), .4, 'inner reach');
    near(client.swing(b, Math.PI, 1), 1.7, 'outer reach, no counter swing');
    s.tick = 100; w.angle = 0;
    const i = pest(run, run.pos.x + 34 * 1.05, run.pos.y);
    client.rehash(s);
    const hit = (tick) => { s.tick = tick; w.angle = 0; client.special(s, w, b, p, 0); const n = s.hits.count; s.hits.count = 0; return n; };
    assert.equal(hit(100), 1); assert.equal(hit(117), 0); assert.equal(hit(118), 1, '18-tick per-target gate');
    s.enemies.x[i] = run.pos.x + 200; client.rehash(s); assert.equal(hit(136), 0, 'outside orbit control');
    record(seed, ['weapon:comet-scythe'], '0.4/1.7 reach extremes; identical radial swing parity; 18-tick per-target cadence and outside control');
  }
  {
    const run = setup(seed, 'harvest-moon'), s = run.state, w = s.loadout.weapons[0], b = w.def.behavior, p = params(s, w);
    s.tick = 100; w.angle = 0;
    const i = pest(run, run.pos.x + 56, run.pos.y), heavy = pest(run, run.pos.x - 56, run.pos.y);
    s.enemies.mass[i] = .2; s.enemies.mass[heavy] = 1;
    client.rehash(s); client.special(s, w, b, p, 0); resolve(s);
    const c = s.gearWeapons.moonCarry;
    assert.equal(c.by[i], w.slot); assert.equal(c.by[heavy], -1, 'mass one cannot be carried');
    assert.equal(c.until[i], 168, '1.125 seconds rounded to 68 ticks');
    assert.equal(c.freeAt[i], 348, 'three-second regrab lock after carry');
    s.tick = 167; w.angle = .3; client.special(s, w, b, p, 0); resolve(s);
    assert.equal(c.by[i], w.slot); near(s.enemies.vx[i], 0, 'carried target not walking');
    near(s.enemies.x[i], run.pos.x + 56 * Math.cos(.3), 'carried target rotates X');
    near(s.enemies.y[i], run.pos.y + 56 * Math.sin(.3), 'carried target rotates Y');
    s.tick = 168; client.special(s, w, b, p, 0);
    assert.equal(c.by[i], -1); near(Math.hypot(s.enemies.kx[i], s.enemies.ky[i]), 192, 'fling reduced by mass');
    assert.ok(s.hits.count > 0, 'release queues damage');
    record(seed, ['weapon:harvest-moon'], 'light/heavy carry control; rounded lifetime; regrab lock; moving carry; release hit and mass-scaled fling');
  }
  {
    const run = setup(seed, 'mash-golem'), s = run.state;
    run.step(.2, () => s.enemies.pool.clear());
    assert.equal(s.gearWeapons.golems.pool.count, 0, 'no target, no golem');
    pest(run, run.pos.x + 60, run.pos.y);
    run.step(.3);
    const g = s.gearWeapons.golems;
    assert.equal(g.pool.count, 1, 'amount is staggered, not simultaneous');
    run.step(.2); assert.equal(g.pool.count, 2, 'second amount arrives after interval');
    assert.ok(g.walked[0] > 0, 'walking follows rise');
    run.step(2);
    assert.equal(g.pool.count, 0); assert.equal(g.slams, 2, 'each expires with one slam');
    const w = s.loadout.weapons[0], p = params(s, w);
    for (let i = 0; i < 12; i++) client.cast(s, w, w.def.behavior, p, i);
    assert.equal(g.pool.count, 8, 'fixed golem cap');
    record(seed, ['weapon:mash-golem'], 'target-required cast; staggered pair; rise then walk; two terminal slams; fixed eight-golem capacity');
  }
  {
    const run = setup(seed, 'mash-landing'), s = run.state;
    run.step(.1, () => s.enemies.pool.clear());
    assert.equal(s.counters.shots, 0, 'idle cannot slam');
    run.dash(1, 0).step(1 / 60, () => s.enemies.pool.clear());
    assert.equal(s.counters.shots, 0, 'dash start is not landing');
    run.step(.3, () => s.enemies.pool.clear());
    assert.equal(s.counters.shots, 1, 'dash end makes one slam, not amount slams');
    const l = s.gearWeapons.landings;
    near(l.r[0], 34, 'base radius');
    const w = s.loadout.weapons[0], p = params(s, w); p.area = 4; p.amount = 20;
    w.cd = 0; w.active = 1; client.special(s, w, w.def.behavior, p, 1 / 60);
    near(l.r[1], 68, 'sqrt Area'); assert.equal(s.counters.shots, 2, 'amount still one slam');
    record(seed, ['weapon:mash-landing'], 'idle/start/end timing; one slam irrespective of amount; radius sqrt Area');
  }
  {
    const run = setup(seed, 'gravy-pack'), s = run.state;
    s.player.hp[s.me] = 50;
    run.step(.2, () => s.enemies.pool.clear());
    assert.equal(s.summons.pool.count, 5); assert.equal(s.projectiles.pool.count, 0);
    const before = run.hp;
    pest(run, run.pos.x + 70, run.pos.y);
    run.step(.15);
    assert.ok(s.projectiles.pool.count > 0, 'familiars shoot at supplied target');
    assert.ok(run.hp > before, 'successful shot heals without waiting for kill');
    const w = s.loadout.weapons[0], p = params(s, w); p.amount = 2;
    client.familiars(s, w, w.def.behavior, p); s.summons.pool.release();
    assert.equal(s.summons.pool.count, 2, 'amount reduction removes excess familiars');
    record(seed, ['weapon:gravy-pack'], 'five persistent familiars; no target no shots; real Game shots and healing; amount-reduction control');
  }
  {
    const run = setup(seed), s = run.state;
    run.step(1 / 60, () => s.enemies.pool.clear());
    run.giveItem('midnight-fries');
    const baseline = run.stat('damageMult');
    const win = Math.floor(s.cfg.win.timeSec / s.waves.stepSec);
    for (const [steps, expected] of [[-1, 1], [0, 1], [1, 1.06], [2, 1.1236]]) {
      s.director.lastStep = win + steps; api.recompute(s);
      near(run.stat('damageMult') / baseline, expected, 'overtime completed-step factor');
    }
    run.giveItem('midnight-fries'); s.director.lastStep = win; api.recompute(s);
    const double = run.stat('damageMult'); s.director.lastStep = win + 2; api.recompute(s);
    near(run.stat('damageMult') / double, 1.2544, 'two stacks compound 1.12 twice, not 1.06 four times');
    record(seed, ['item:midnight-fries'], 'before/at/after win step; compounding; two-stack sum before exponentiation');
  }
  {
    const run = setup(seed), s = run.state;
    const movement = client.systems.find((f) => String(f).includes('terrainSlow'));
    assert.ok(movement);
    const put = (hazards) => { s.world.activeHazards = hazards; };
    const hazard = (kind, strength, x = run.pos.x) => ({ kind, strength, x, y: run.pos.y, radius: 20, poolShape: 0, turn: 0 });
    for (const [id, strength, expected] of [['russet-moor', .15, .85], ['vinegar-shoals', .4, .6]]) {
      put([hazard('slow', strength)]); const hp = run.hp; movement(s, 1 / 60);
      near(s.player.terrainSlow[s.me], expected, id); near(run.hp, hp, 'slow does no damage');
      put([hazard('slow', strength, run.pos.x + 20.01)]); movement(s, 1 / 60);
      near(s.player.terrainSlow[s.me], 1, 'outside center boundary, even though player body overlaps');
      record(seed, [`biome:${id}`], 'original movement system: inside slow, no damage, outside center control');
    }
    put([hazard('slow', .15), hazard('slow', .4)]); movement(s, 1 / 60);
    near(s.player.terrainSlow[s.me], .6, 'strongest slow, not product');
    for (const [id, kind, strength] of [['duchess-gardens', 'thorns', 6], ['roast-caldera', 'burn', 10]]) {
      put([hazard(kind, strength)]); s.player.hp[s.me] = 100; s.player.invuln[s.me] = 0;
      const before = run.hp; movement(s, 1 / 60);
      near(before - run.hp, strength / 60, 'continuous damage at zero armor');
      put([hazard(kind, strength, run.pos.x + 20.01)]); const outside = run.hp; movement(s, 1 / 60);
      near(run.hp, outside, 'outside damage control');
      record(seed, [`biome:${id}`], 'original movement system: one-tick continuous damage, outside control; not natural hazard layout or survival');
    }
  }
  {
    const run = setup(seed), s = run.state;
    client.event(s, api.registry.events.find((x) => x.id === 'crab-tide'));
    const e = s.enemies;
    assert.equal(s.cfg.level.wallPests, .3);
    assert.equal(e.pool.count, 9, 'raw 30 scaled by Normal wallPests .3');
    for (let j = 0; j < e.pool.count; j++) {
      const i = e.pool.slotAt(j);
      near(Math.hypot(e.x[i] - run.pos.x, e.y[i] - run.pos.y), 180, 'ring radius');
      near(e.tx[i], run.pos.x, 'fixed destination X'); near(e.despawnAt[i] - s.time, 20, 'life');
    }
    const i = e.pool.slotAt(0), oldX = run.pos.x;
    s.player.x[s.me] += 250;
    client.steer(s, i, { kind: 'wall' }, 100);
    assert.ok(e.vx[i] < 0, 'toward old center, not moved player'); near(e.tx[i], oldX, 'destination not retargeted');
    e.x[i] = e.tx[i] + 19.99; e.y[i] = e.ty[i]; client.steer(s, i, { kind: 'wall' }, 20);
    near(e.vx[i], 0, 'stops inside 20');
    e.x[i] = e.tx[i] + 20; client.steer(s, i, { kind: 'wall' }, 20);
    assert.ok(e.vx[i] < 0, 'equality still moves');
    record(seed, ['event:crab-tide'], 'nine-crab Normal ring (raw 30 × .3); radius/lifetime/fixed center; moved-player control; strict stopping boundary');
  }
  for (const d of api.registry.enemies.filter((x) => x.id.startsWith('armoured-'))) {
    const run = setup(seed), s = run.state, e = s.enemies, b = d.behavior;
    const i = pest(run, run.pos.x + b.dashRange, run.pos.y, d.id);
    e.timer[i] = 0; client.steer(s, i, b, b.dashRange); assert.equal(e.state[i], 0, 'range equality cannot trigger');
    e.x[i] -= .01; client.steer(s, i, b, b.dashRange - .01);
    assert.equal(e.state[i], 1); near(e.timer[i], .5, 'Normal windup');
    s.player.y[s.me] += 100; e.timer[i] = 0; client.steer(s, i, b, 100);
    assert.equal(e.state[i], 2); near(e.timer[i], 1.3 * b.dashRange / b.dashSpeed, 'charge duration');
    client.steer(s, i, b, 100); near(e.vx[i], -b.dashSpeed, 'locked direction'); near(e.vy[i], 0, 'no homing');
    e.timer[i] = 0; client.steer(s, i, b, 100); assert.equal(e.state[i], 0); near(e.timer[i], 1.6, 'retry delay');
    record(seed, [`enemy:${d.id}`], 'original charger: strict trigger range, windup, duration, moved-player locked-aim control, recovery');
  }
}
console.log(JSON.stringify({ main, source: { url: `https://tibo.dog/assets/${file}`, sha256: hash(source) },
  scriptSha256: hash(readFileSync(new URL(import.meta.url))), mode: 'standard', difficulty: 'normal',
  setup: 's1/s2/s3; granted level-one loadouts, supplied fixed enemies/HP/positions and director steps; isolated export-only original rules plus full Game casts. No gear, god mode, reward writes or natural-run claims. Hazard fixtures use circular patches to isolate the consumer, not natural splat/oval/clover generation.',
  cases: rows.length, rows }, null, 2));
