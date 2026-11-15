// Supplied-state contact controls on the original BDQ client, not natural-run evidence.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { mirror } from './fetch-build.mjs';
import { loadGame, Run } from './play.mjs';

const main = process.argv[2] ?? 'main-BDQvha6l.js';
assert.equal(main, 'main-BDQvha6l.js', 'Review consumers before rebinding');
const hash = (s) => createHash('sha256').update(s).digest('hex');
const sources = {
  'main-BDQvha6l.js': 'beae5deefc4c95be49e17ead8d2c16152188fcb7bc974f8673697e4b64a6b5d8',
  'sim-BF7yetWo.js': '6eb5a335759b8ce4e6f75858ca2e658097fa0480b8b93fc90a204ba5158a689f',
  'boot-CRGHO9d3.js': 'b8d0847ab6499b53c12a4f27f0c04ecc8148c2d0f72d56168bc42647e965cc7d',
  'intro-shared-B31C189v.js': '3fa8a7357a23f6d3509b879f35609443d0ac9ad76ae9dc0833a4aa22c4c03f20',
};
const { dir } = await mirror(undefined, main);
for (const [file, sha] of Object.entries(sources)) assert.equal(hash(readFileSync(`${dir}/${file}`)), sha);
const file = `${dir}/sim-BF7yetWo.js`, original = readFileSync(file, 'utf8');
let api;
try {
  writeFileSync(file, original + '\nexport { Uj as contactStats, id as contactHash, mk as contactTarget, NM as contactSystems, FO as contactGold, T as contactFlags };');
  api = await loadGame(main);
} finally { writeFileSync(file, original); }
globalThis.fetch = async () => { throw new Error('Network forbidden in contact fixtures'); };
const tickWeapon = api.sim.contactSystems[13], flush = api.sim.contactSystems[28];
assert.ok(String(tickWeapon).includes('case`aura`:eM'));
assert.ok(String(flush).includes('let t=e.hits;'));
const near = (a, b, label) => assert.ok(Math.abs(a - b) < 0.003, `${label}: ${a} != ${b}`);
const catalog = Object.values(api.sim).find((v) => Array.isArray(v?.all) && typeof v.of === 'function' && typeof v.byId === 'function');
const runes = catalog.all.filter((r) => ['deep-fryer', 'steam-vent', 'sprout-satellites'].includes(r.weapon));
assert.equal(runes.length, 9);
const rows = [];
for (const seed of ['s1', 's2', 's3']) for (const amountBonus of [0, 3]) for (const rune of runes) {
  const run = new Run(api, { seed, mode: 'standard', difficulty: 'normal' }), s = run.state;
  s.fx = true; s.loadout.weapons.length = 0;
  run.give('weapon', rune.weapon);
  const w = s.loadout.weapon(rune.weapon), plain = structuredClone(w.def.behavior);
  s.loadout.stats.values[api.STAT.amountBonus] = amountBonus;
  s.loadout.stats.values[api.STAT.critChance] = 0;
  const baseline = { ...api.sim.contactStats(s, w, {}) };
  s.choiceQueue.unshift({ kind: 'levelUp', offers: [{ type: 'rune', slot: w.slot, rune: rune.id }] });
  run.game.choose({ type: 'pick', index: 0 });
  assert.deepEqual(w.runes.fits, [true]);
  const behavior = w.def.behavior, kind = behavior.kind;
  const stats = { ...api.sim.contactStats(s, w, {}) }, expected = { ...baseline };
  for (const [k, scale] of Object.entries(rune.scale ?? {})) expected[k] *= scale;
  for (const effect of rune.effects) {
    if (effect.kind === 'focus') {
      expected.damage *= 1 + effect.damage * (baseline.amount - 1);
      expected.area *= 1 + effect.area * (baseline.amount - 1); expected.amount = 1;
    }
    if (effect.kind === 'reshape') for (const [k, scale] of Object.entries(effect.fields)) near(behavior[k], plain[k] * scale, k);
  }
  for (const k of ['damage', 'cooldown', 'amount', 'area', 'speed', 'duration']) near(stats[k], expected[k], k);
  if (kind !== 'orbit') assert.equal(stats.amount, baseline.amount, 'contact weapons ignore bonus Amount');
  s.enemies.pool.clear(); s.bosses.pool.clear();
  const e = s.enemies, slots = [], x = s.player.x[s.me], y = s.player.y[s.me];
  const aphid = api.registry.enemyIndex('aphid');
  assert.equal(api.sim.contactGold[aphid] ?? 0, 0);
  for (let j = 0; j < 4; j++) {
    const i = e.pool.spawn(); slots.push(i); e.def[i] = aphid;
    e.radius[i] = 4; e.hp[i] = j === 1 ? 1000000 : 10000000;
    e.maxHp[i] = j === 1 ? 30000000 : 10000000;
  }
  const place = (j, dx, dy) => { e.x[slots[j]] = x + dx; e.y[slots[j]] = y + dy; };
  const radius = behavior.size * stats.area;
  const toughest = rune.effects.some((v) => v.kind === 'toughest');
  if (kind === 'cone') {
    place(0, 20, 0); place(1, 0, 35);
    api.sim.contactHash(s);
    assert.equal(api.sim.contactTarget(s, w, x, y, radius * 1.3), slots[toughest ? 1 : 0]);
    assert.equal(api.sim.contactTarget(s, w, x, y, 25), slots[0], 'range still excludes tougher pest');
  }
  if (rune.effects.some((v) => v.kind === 'elite')) e.set(slots[1], api.sim.contactFlags.Elite);
  s.tick = 1000; s.time = s.tick / 60; w.cd = 0; w.active = 0;
  const starts = [], ends = [], pulses = [], impacts = [], angles = [], crowded = [], stamps = [-Infinity, -Infinity, -Infinity, -Infinity];
  // Three full active/cooldown cycles; auras instead run for three seconds.
  for (let t = 0; t < (kind === 'aura' ? 181 : 2200); t++) {
    s.tick++; s.time = s.tick / 60;
    const before = { active: w.active, cd: w.cd, angle: w.angle, hp: slots.map((i) => e.hp[i]) };
    let predicted = slots.map(() => 0), shouldPulse = false;
    if (kind === 'aura') {
      // Asymmetric body-overlap boundary, including equal ordinary/elite positions.
      place(0, 10, 0); place(1, 10, 0);
      place(2, radius + 4 - 0.25, 0); place(3, radius + 4 + 0.25, 0);
      shouldPulse = before.cd <= 1;
      if (shouldPulse) predicted = [stats.damage, stats.damage, stats.damage, 0];
    } else if (kind === 'cone') {
      // First two pests disagree on nearest vs highest maxHP. Flip the tougher target after the first hit.
      const aim = toughest && pulses.length === 0 ? Math.PI / 2 : 0;
      if (pulses.length > 0) { e.maxHp[slots[1]] = 5000000; }
      const edge = aim + behavior.angle / 2 + 0.1;
      place(2, 45 * Math.cos(edge - 0.002), 45 * Math.sin(edge - 0.002));
      place(3, 45 * Math.cos(edge + 0.002), 45 * Math.sin(edge + 0.002));
      shouldPulse = before.active > 0 && w.volleyTimer <= 1;
      if (shouldPulse) {
        for (let j = 0; j < 4; j++) {
          const dx = e.x[slots[j]] - x, dy = e.y[slots[j]] - y;
          const delta = Math.atan2(Math.sin(Math.atan2(dy, dx) - aim), Math.cos(Math.atan2(dy, dx) - aim));
          if (Math.hypot(dx, dy) <= radius + 4 && Math.abs(delta) <= behavior.angle / 2 + 0.1) predicted[j] = stats.damage;
        }
      }
    } else {
      const rotates = before.active > 0 || before.cd <= 1;
      const angle = before.angle + (rotates ? stats.speed / 60 : 0), orbit = behavior.orbitRadius * Math.sqrt(stats.area);
      // Two co-located moving contacts follow a satellite; separate bodies straddle its outside edge.
      place(0, Math.cos(angle) * orbit, Math.sin(angle) * orbit);
      place(1, Math.cos(angle) * orbit, Math.sin(angle) * orbit);
      place(2, Math.cos(angle) * (orbit + radius + 4 - 0.25), Math.sin(angle) * (orbit + radius + 4 - 0.25));
      place(3, Math.cos(angle) * (orbit + radius + 4 + 0.25), Math.sin(angle) * (orbit + radius + 4 + 0.25));
      if (rotates) for (let j = 0; j < 4; j++) {
        let touches = false;
        for (let n = 0; n < stats.amount; n++) {
          const a = angle + n / stats.amount * 2 * Math.PI;
          touches ||= Math.hypot(e.x[slots[j]] - x - Math.cos(a) * orbit, e.y[slots[j]] - y - Math.sin(a) * orbit) <= radius + 4;
        }
        if (touches && s.tick - stamps[j] >= Math.round(60 * behavior.hitInterval)) {
          predicted[j] = stats.damage; stamps[j] = s.tick;
        }
      }
    }
    api.sim.contactHash(s); tickWeapon(s, 1 / 60);
    if (before.active === 0 && w.active > 0) starts.push(t);
    if (before.active > 0 && w.active === 0) ends.push(t);
    if (kind === 'orbit') near(w.angle, before.angle + ((before.active > 0 || before.cd <= 1) ? stats.speed / 60 : 0), 'rotation freezes during cooldown');
    if (shouldPulse) {
      pulses.push(t);
      if (kind === 'cone') { near(w.angle, toughest && pulses.length === 1 ? Math.PI / 2 : 0, 'retarget at each cone pulse'); angles.push(w.angle); }
    }
    flush(s);
    if (e.has(slots[1], api.sim.contactFlags.Elite)) predicted[1] *= 2;
    const loss = slots.map((i, j) => before.hp[j] - e.hp[i]);
    loss.forEach((v, j) => near(v, predicted[j], `${rune.id} tick${t} body${j}`));
    if (loss.some((v) => v > 0)) impacts.push({ tick: t, hpLoss: loss });
    assert.equal(s.pickups.pool.count, 0); assert.ok(slots.every((i) => e.hp[i] > 0));
    s.effects.pool.clear();
    if (starts.length === 4) break;
  }
  if (kind === 'aura') {
    assert.equal(pulses[0], 0);
    for (let j = 1; j < pulses.length; j++) assert.equal(pulses[j] - pulses[j - 1], Math.round(60 * behavior.hitInterval));
  } else {
    assert.equal(starts.length, 4); assert.equal(ends.length, 3);
    const duration = Math.round(60 * Math.max(kind === 'cone' ? 0.2 : 0.5, stats.duration));
    for (let j = 0; j < 3; j++) {
      assert.equal(ends[j] - starts[j], duration);
      assert.equal(starts[j + 1] - ends[j], Math.round(60 * stats.cooldown));
    }
    if (kind === 'cone') for (let j = 0; j < 3; j++) {
      const hits = pulses.filter((p) => p > starts[j] && p <= ends[j]);
      assert.equal(hits[0], starts[j] + 1);
      for (let n = 1; n < hits.length; n++) assert.equal(hits[n] - hits[n - 1], Math.round(60 * behavior.hitInterval));
    }
    if (kind === 'orbit') {
      const first = impacts.filter((p) => p.tick <= ends[0]);
      for (let j = 1; j < first.length; j++) assert.equal(first[j].tick - first[j - 1].tick, 24, 'per-enemy weapon timer');
      // A separate supplied Area=400 control overlaps all satellites at the player.
      // Keep ordinary body radius: broad-phase queries are not a giant-body simulation.
      w.active = 100; s.loadout.stats.values[api.STAT.areaMult] = 400; e.hitStamp.fill(0);
      for (let t = 0; t < 25; t++) {
        s.tick++; slots.forEach((_, j) => place(j, 0, 0)); api.sim.contactHash(s);
        const hp = slots.map((i) => e.hp[i]);
        tickWeapon(s, 1 / 60);
        assert.ok(s.hits.count === 0 || s.hits.count === 4);
        if (s.hits.count) crowded.push(t);
        flush(s);
        slots.forEach((i, j) => near(hp[j] - e.hp[i], t % 24 === 0 ? stats.damage : 0, 'shared contact resolver'));
        assert.equal(s.pickups.pool.count, 0);
      }
      assert.deepEqual(crowded, [0, 24], JSON.stringify({ rune: rune.id, stats: api.sim.contactStats(s, w, {}), active: w.active, slots }));
    }
  }
  let trigger;
  if (kind === 'cone') {
    w.active = 0; w.cd = 0; slots.forEach((_, j) => place(j, 10000 + j * 100, 0));
    api.sim.contactHash(s); tickWeapon(s, 1 / 60);
    assert.equal(w.active, 0, 'empty cone search does not start a cycle');
    place(0, radius * 1.15, 0); api.sim.contactHash(s); tickWeapon(s, 1 / 60);
    assert.ok(w.active > 0, 'search beyond hit reach can trigger spray');
    tickWeapon(s, 1 / 60); assert.equal(s.hits.count, 0, 'trigger reach is not damage reach');
    place(0, 20, 0); place(1, radius + 4 - 0.25, 0); place(2, radius + 4 + 0.25, 0);
    w.volleyTimer = 0; api.sim.contactHash(s);
    const hp = slots.map((i) => e.hp[i]); tickWeapon(s, 1 / 60); flush(s);
    slots.forEach((i, j) => near(hp[j] - e.hp[i], j < 2 ? stats.damage : 0, 'cone radial body boundary'));
    trigger = { searchFactor: 1.3, suppliedDistance: radius * 1.15, damageAtTriggerDistance: 0, radialBodyMargin: 0.25 };
  }
  rows.push({ keys: [`rune:${rune.id}`], seed, amountBonus, baseline, stats, behavior, starts, ends, pulses, angles, impacts, crowded, trigger });
}
console.log(JSON.stringify({ main, scriptSha256: hash(readFileSync(new URL(import.meta.url))),
  sources: Object.entries(sources).map(([file, sha256]) => ({ url: `https://tibo.dog/assets/${file}`, sha256 })),
  definitions: Object.fromEntries(runes.map((r) => [`rune:${r.id}`, hash(JSON.stringify(r))])),
  setup: 'Standard/Normal,s1/s2/s3,supplied level-one weapon+rune card,Amount bonus0/3,crit0. Original weapon and hit systems only. Cone retarget/angular boundary/three on-off cycles; aura body boundary,pulse timer,ordinary-vs-elite HP loss; orbit tracked contact,body boundary,rotation,three on-off cycles; separate supplied Area400 coincident-satellite shared lockout. High-HP aphids,no deaths,pickups,reward handlers,full-world stepping or network. Not natural acquisition,max-level/evolved/union,status progression,DPS,survival,server/device proof.', rows }, null, 2));
