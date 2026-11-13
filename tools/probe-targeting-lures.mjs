// Controlled original-client fixtures plus full-Game integrations; not natural acquisition/DPS.
// Pinned bridge adds exports only: no game function bodies are changed.
// Usage: node tools/probe-targeting-lures.mjs [main-CrJIatJG.js]
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadGame, Run } from './play.mjs';
import { mirror } from './fetch-build.mjs';

const main = process.argv[2] ?? JSON.parse(readFileSync(new URL('../data/build.json', import.meta.url))).main;
assert.equal(main, 'main-CrJIatJG.js', 'this source-bound bridge needs review on another build');
const { dir } = await mirror(undefined, main);
const simFile = 'sim-lhAs_O8g.js';
const simPath = join(dir, simFile);
const source = readFileSync(simPath, 'utf8');
const sha = (s) => createHash('sha256').update(s).digest('hex');
assert.equal(sha(source), 'd379edc61c6a1451bb0ad62f8aa5606cdbdf8671c6d6b60d1de935aca5793376');
// Keep the original module URL: lazy chunks register callbacks against this instance.
// Restore archived bytes even if import/initialization fails.
writeFileSync(simPath, source + '\nexport { _y as select, yy as dive, qd as lure, Zd as steer, Kd as reach, Jd as active, Yd as expired, Bg as gate, Y as attack, Z as hit, PD as applyHit, Du as rehash, T as flags, xu as enemyRef, Su as bossRef, W as slot, Cu as isBoss };\n');
let api;
try { api = await loadGame(main); }
finally { writeFileSync(simPath, source); }
const original = api.sim;
const spawn = Object.values(api.sim).find((v) => typeof v === 'function' &&
  /^function \w+\(e,t,n,r\)\{return \w+\(e\),\w+\(e,t,n,r\)\}$/.test(String(v)));
assert.ok(spawn, 'original scaled-enemy spawner');
const rows = [];
const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-7, `${message}: ${actual} vs ${expected}`);
function setup(seed, id) {
  const run = new Run(api, { seed, mode: 'standard', difficulty: 'normal' });
  run.state.loadout.weapons.length = 0;
  run.give('weapon', id);
  run.state.enemies.pool.clear();
  return run;
}
function pest(run, x, y, hp = 1e6) {
  const s = run.state, i = spawn(s, api.registry.enemyIndex('aphid'), x, y);
  assert.ok(i >= 0);
  s.enemies.hp[i] = s.enemies.maxHp[i] = hp;
  s.enemies.speed[i] = s.enemies.damage[i] = s.enemies.xp[i] = s.enemies.goldChance[i] = 0;
  return i;
}
function applyQueued(s) {
  // Use the original hit resolver, including any hits appended by an item proc.
  for (let i = 0; i < s.hits.count; i++) {
    const ref = s.hits.target[i], boss = original.isBoss(ref);
    original.applyHit(s, boss ? s.bosses : s.enemies, original.slot(ref), i, boss);
  }
  s.hits.count = 0;
}
for (const seed of ['s1', 's2', 's3']) {
  // Weighted current HP, not distance or max HP; body-overlap range boundary.
  {
    const run = setup(seed, 'hash-hawk'), s = run.state, w = s.loadout.weapons[0];
    run.step(1 / 60, () => s.enemies.pool.clear());
    const h = s.gearWeapons.hawks, bird = h.pool.slotAt(0), rule = w.def.behavior.rule;
    const x = run.pos.x, y = run.pos.y;
    const normal = pest(run, x + 20, y, 500), elite = pest(run, x + 100, y, 60);
    s.enemies.set(elite, original.flags.Elite);
    const choose = () => { h.t[bird] = 0; h.target[bird] = -1; original.rehash(s); original.select(s, bird, rule, { amount: 2, area: 1 }, 1 / 60); return h.target[bird]; };
    assert.equal(choose(), original.enemyRef(elite), '600 elite score beats nearer 500');
    s.enemies.hp[elite] = 40;
    assert.equal(choose(), original.enemyRef(normal), 'current HP, not max HP, changes winner');
    // A supplied boss pool entry isolates the boss weight without advancing the clock.
    const b = s.bosses.pool.spawn();
    s.bosses.x[b] = x + 80; s.bosses.y[b] = y; s.bosses.hp[b] = 7; s.bosses.radius[b] = 8; s.bosses.flags[b] = 0;
    assert.equal(choose(), original.bossRef(b), 'boss score 700 beats normal 500');
    s.bosses.set(b, original.flags.Hidden);
    assert.equal(choose(), original.enemyRef(normal), 'hidden boss excluded');
    s.bosses.pool.clear(); s.enemies.pool.clear();
    const edge = pest(run, x + 150 + 8, y); s.enemies.radius[edge] = 8;
    assert.equal(choose(), original.enemyRef(edge), 'range includes target body at equality');
    s.enemies.x[edge] += 0.01;
    assert.equal(choose(), -1, 'outside body-overlap range has no target');
    s.enemies.x[edge] = x + 90; choose();
    const oldX = h.tx[bird]; s.enemies.x[edge] += 10;
    original.dive(s, bird, w, rule, { speed: 1, damage: 30, area: 1, cooldown: 2.2, knockback: 0 }, 1 / 60);
    assert.equal(h.tx[bird], oldX + 10, 'dive follows a living locked target');
    s.enemies.pool.kill(edge); s.enemies.pool.release();
    const replacement = pest(run, x - 90, y);
    assert.equal(replacement, edge, 'reused pool slot control');
    original.dive(s, bird, w, rule, { speed: 1, damage: 30, area: 1, cooldown: 2.2, knockback: 0 }, 1 / 60);
    assert.equal(h.target[bird], -1, 'generation check rejects replacement in reused slot');
    assert.equal(h.tx[bird], oldX + 10, 'lost target retains last destination');
    rows.push({ seed, mechanic: 'hash-hawk', checks: 'weighted current HP; elite/boss/hidden; inclusive body range; tracked target; reused-slot rejection' });
  }
  {
    const run = setup(seed, 'hash-hawk'), s = run.state;
    pest(run, run.pos.x + 100, run.pos.y, 1e9);
    run.step(1.3);
    const h = s.gearWeapons.hawks;
    assert.equal(h.pool.count, 2, 'base Amount includes Tibo +1');
    near(h.diveAt[0] * 60, 36, 'first bird stagger');
    near(h.diveAt[1] * 60, 72, 'second bird stagger');
    assert.ok(h.struckAt[0] > 0, 'real Game dive lands');
    const struck = h.struckAt[0], firstDive = h.diveAt[0];
    run.step(2);
    near((h.diveAt[0] - struck) * 60, 132, 'cooldown starts after impact, not launch');
    assert.ok(h.diveAt[0] > firstDive);
    assert.equal(s.gearWeapons.crumbs.pool.count, 0, 'base hawks leave no burning crumbs');
    s.loadout.weapons[0].raw.amount = 30;
    run.step(1 / 60);
    assert.equal(h.pool.count, 16, 'supplied excessive Amount saturates hawk pool');
    rows.push({ seed, mechanic: 'hash-hawk', checks: 'full Game two birds; 36/72-tick stagger; impact; 132-tick post-impact cooldown; no crumbs; supplied Amount pool cap 16' });
  }
  // Real dash/cast and expiry integration for both base lure weapons.
  for (const id of ['peel-phantom', 'spud-decoy']) {
    const run = setup(seed, id), s = run.state, w = s.loadout.weapons[0];
    if (id === 'peel-phantom') {
      run.step(0.1, () => s.enemies.pool.clear());
      assert.equal(s.gearWeapons.lures.pool.count, 0, 'idle Phantom cannot plant');
      run.dash(1, 0);
    }
    run.step(1 / 60, () => s.enemies.pool.clear());
    const l = s.gearWeapons.lures;
    assert.equal(l.pool.count, id === 'peel-phantom' ? 1 : 2, 'Tibo base Amount: one husk or two decoys');
    const first = l.pool.slotAt(0), born = l.placedAt[first], end = l.endsAt[first];
    if (id === 'peel-phantom') {
      near(l.x[first], s.player.dashFromX[s.me], 'husk at dash start X');
      near(l.y[first], s.player.dashFromY[s.me], 'husk at dash start Y');
      assert.equal(end - born, 113, '1.5 s × base duration 1.25 rounded to ticks');
    } else {
      for (let n = 0; n < l.pool.count; n++) {
        const i = l.pool.slotAt(n);
        near(Math.hypot(l.x[i] - run.pos.x, l.y[i] - run.pos.y), 26, 'decoy distance');
        assert.ok((l.x[i] - run.pos.x) * s.player.fx[s.me] + (l.y[i] - run.pos.y) * s.player.fy[s.me] < 0, 'decoys behind facing');
      }
      assert.equal(end - born, 300, '4 s × base duration 1.25');
    }
    const target = pest(run, l.x[first], l.y[first]);
    const before = s.enemies.hp[target];
    w.cd = 1e9; // No replacement cast while checking this generation.
    run.step((end - s.tick - 1) / 60);
    assert.equal(s.tick, end - 1);
    assert.ok(l.pool.isAlive(first));
    assert.equal(s.enemies.hp[target], before, 'lure contact does not deal early damage');
    run.step(1 / 60);
    assert.equal(s.tick, end);
    assert.ok(!l.pool.isAlive(first), 'expires on exact end tick');
    assert.ok(s.enemies.hp[target] < before, 'expiry explosion damages target');
    assert.equal(s.gearWeapons.crumbs.pool.count, 0);
    assert.equal(s.projectiles.pool.count, 0, 'base lures do not throw evolution peels');
    rows.push({ seed, mechanic: id, checks: 'idle/dash or behind-facing cast; base Amount; duration; no contact damage; exact expiry explosion; no evolution projectiles', lifeTicks: end - born });
    // Original steering fixtures, asymmetric distances and strict boundary.
    l.pool.clear();
    const reach = original.reach({ reach: id === 'peel-phantom' ? 64 : 80 }, 4);
    assert.equal(reach, id === 'peel-phantom' ? 128 : 160, 'reach scales by sqrt(Area)');
    const px = run.pos.x, py = run.pos.y;
    const e = pest(run, px, py); s.enemies.speed[e] = 30;
    original.lure(s, px + reach, py, reach, 10, w.slot);
    const steer = () => { s.enemies.vx[e] = -11; s.enemies.vy[e] = 3; original.steer(s, e); };
    steer(); assert.equal(s.enemies.vx[e], -11, 'equality outside lure reach');
    s.enemies.x[e] += 0.01; steer(); assert.ok(s.enemies.vx[e] > 0, 'strictly inside attracted');
    original.lure(s, px, py + 20, reach, 10, w.slot);
    steer(); assert.ok(s.enemies.vy[e] > 29, 'nearest eligible lure wins');
    s.enemies.x[e] = px; s.enemies.y[e] = py + 14;
    steer(); assert.equal(s.enemies.vy[e], 0, 'within seven units stops');
    s.tick += 10; steer(); assert.equal(s.enemies.vy[e], 3, 'expired lures do not steer');
    rows.push({ seed, mechanic: id, checks: 'sqrt Area reach; strict boundary; nearest lure; inner stop; expired control' });
  }
  {
    const run = setup(seed, 'peeler'), s = run.state, w = s.loadout.weapons[0];
    run.giveItem('lightning-spud');
    const fx = s.itemFx.all.find((f) => f.id === 'lightning-spud');
    near(fx.chance, 0.06, 'single-stack chance'); assert.equal(fx.rate, 2); assert.equal(fx.tokens, 2);
    const rng = s.rng.next;
    try {
      s.rng.next = () => fx.chance;
      assert.equal(original.gate(s, fx), false, 'chance equality fails'); assert.equal(fx.tokens, 2, 'failed roll spends no token');
      s.rng.next = () => fx.chance - 1e-8;
      assert.equal(original.gate(s, fx), true); assert.equal(original.gate(s, fx), true);
      assert.equal(original.gate(s, fx), false, 'third immediate proc blocked');
    } finally { s.rng.next = rng; }
    w.cd = 1e9;
    run.step(29 / 60, () => s.enemies.pool.clear());
    assert.ok(fx.tokens < 1, 'not ready after 29 ticks');
    run.step(1 / 60, () => s.enemies.pool.clear()); near(fx.tokens, 1, 'nominal one token after 30 ticks');
    const tokenAtTick30 = fx.tokens;
    s.rng.next = () => 0;
    try {
      assert.equal(original.gate(s, fx), false, 'floating-point sum remains just below one at tick 30');
      run.step(1 / 60, () => s.enemies.pool.clear());
      assert.equal(original.gate(s, fx), true, 'first usable refill token at tick 31 in this empty-bucket fixture');
    } finally { s.rng.next = rng; }
    run.step(2, () => s.enemies.pool.clear()); assert.equal(fx.tokens, 2, 'idle refill capped');
    run.giveItem('lightning-spud').giveItem('lightning-spud');
    near(fx.chance, 0.169416, 'three stacks use 1 - .94^3'); assert.equal(fx.rate, 6);
    run.step(1, () => s.enemies.pool.clear()); assert.equal(fx.tokens, 6);
    const p = pest(run, run.pos.x + 80, run.pos.y), neighbor = pest(run, run.pos.x + 90, run.pos.y);
    const edge = pest(run, s.enemies.x[p] + 42, s.enemies.y[p]); s.enemies.radius[edge] = 8;
    const outside = pest(run, s.enemies.x[p] + 42.01, s.enemies.y[p]); s.enemies.radius[outside] = 8;
    original.rehash(s);
    const hit = (slot, damage) => { original.attack(s, damage, w.src, slot, 0); original.hit(s, original.enemyRef(p)); applyQueued(s); };
    s.rng.next = () => 0; // Deliberately force successful rolls; not an estimate of natural proc rate.
    try {
      const before = s.enemies.hp[neighbor];
      hit(-1, 100); assert.equal(s.enemies.hp[neighbor], before, 'item/nonweapon hit cannot trigger');
      hit(w.slot, 0); assert.equal(s.enemies.hp[neighbor], before, 'zero damage cannot trigger');
      const tokens = fx.tokens;
      hit(w.slot, 100);
      near(before - s.enemies.hp[neighbor], 90, 'blast uses 90% resolved hit damage');
      near(1e6 - s.enemies.hp[edge], 90, '34-unit blast includes body overlap at equality');
      assert.equal(s.enemies.hp[outside], 1e6, 'just outside blast untouched');
      near(1e6 - s.enemies.hp[p], 290, 'original victim also takes the splash');
      assert.equal(fx.tokens, tokens - 1, 'blast hits do not recursively trigger Lightning Spud');
    } finally { s.rng.next = rng; }
    rows.push({ seed, mechanic: 'lightning-spud', checks: '6% boundary; failed-roll tokens; initial burst; 29/30/31-tick refill boundary; idle cap; three-stack chance/rate; weapon/zero controls; 90% splash/body range; no recursive proc', tokenAtTick30, firstUsableRefillTick: 31 });
    // Full Game hit/proc wiring, unmodified seeded RNG, supplied fixed targets.
    const live = setup(seed, 'peeler'); live.giveItem('lightning-spud');
    pest(live, live.pos.x + 14, live.pos.y, 1e9);
    pest(live, live.pos.x + 20, live.pos.y + 4, 1e9);
    live.step(20);
    assert.ok((live.state.run.damageBySource.get('lightning-spud') ?? 0) > 0, 'full Game produces item damage');
    rows.push({ seed, mechanic: 'lightning-spud', checks: '20-second full Game seeded fixed-target integration', itemDamage: live.state.run.damageBySource.get('lightning-spud') });
  }
}
console.log(JSON.stringify({ main: api.main, source: { url: `https://tibo.dog/assets/${simFile}`, sha256: sha(source) },
  scriptSha256: sha(readFileSync(new URL(import.meta.url))), mode: 'standard', difficulty: 'normal',
  setup: 'Granted named level-1 weapons/items, inserted aphids and one boss-pool fixture, fixed HP/speed, no gear/clock warp/god mode. Export-only pinned bridge for isolated rules; real Game stepping for casts, expiry, token refill and seeded proc integration. Forced RNG only in explicitly marked gate/hit fixtures. Not natural acquisition, server behavior or representative DPS.',
  cases: rows.length, rows }, null, 2));
