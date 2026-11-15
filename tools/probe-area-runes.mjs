// Supplied-state original-client beam, strike and pool controls, never a natural-run benchmark.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { mirror } from './fetch-build.mjs';
import { loadGame, Run } from './play.mjs';

const main = process.argv[2] ?? 'main-C0RlIzyD.js';
assert.equal(main, 'main-C0RlIzyD.js', 'Recheck consumers before rebinding');
const hash = (v) => createHash('sha256').update(v).digest('hex');
const sources = {
  'main-C0RlIzyD.js': '41f1628ed0f8b91ea3d137e62d7b3b624ded1fc1943ab730568b23e9be8d08e5',
  'sim-DfBcZSG3.js': 'de06b7796c62b4151d54923f0ecce9865da302c7eb72cda63d8e78aa23ce0334',
  'boot-CBEpjPO8.js': 'fa499d669a1af6f87231bd67b018e386bd070d24c12c36309a5af4409fb17680',
  'intro-shared-BR4uNCoI.js': '6756ce430f6a64fe60f129d9b995cf9216d1f3606055ff4f2ad4feea38f8f38f',
};
const { dir } = await mirror(undefined, main);
for (const [file, sha] of Object.entries(sources)) assert.equal(hash(readFileSync(`${dir}/${file}`)), sha);
const file = `${dir}/sim-DfBcZSG3.js`, original = readFileSync(file, 'utf8');
let api;
try {
  writeFileSync(file, original + '\nexport { Uj as areaStats, Wj as areaTick, id as areaHash, mk as areaTarget, NM as areaSystems, FO as areaHitGold, no as areaShapes };');
  api = await loadGame(main);
} finally { writeFileSync(file, original); }
globalThis.fetch = async () => { throw new Error('Network forbidden in area fixtures'); };
// These exact indices are bound to the four verified source hashes above. Neither system runs death/drop processing.
const zoneTick = api.sim.areaSystems[25], hitFlush = api.sim.areaSystems[28];
assert.ok(zoneTick.toString().includes('n.delay[i]=a-t'));
assert.ok(hitFlush.toString().includes('let t=e.hits;'));
const near = (a, b, label) => assert.ok(Math.abs(a - b) < 0.002, `${label}: ${a} != ${b}`);
const catalog = Object.values(api.sim).find((v) => Array.isArray(v?.all) && typeof v.of === 'function' && typeof v.byId === 'function');
const runes = catalog.all.filter((r) => ['fry-lance', 'root-spikes', 'starch-bolt', 'gravy-boat'].includes(r.weapon));
assert.equal(runes.length, 12);
const rows = [];
for (const seed of ['s1', 's2', 's3']) for (const amountBonus of [0, 3]) for (const rune of runes) {
  const run = new Run(api, { seed, mode: 'standard', difficulty: 'normal' }), s = run.state;
  s.fx = true;
  s.loadout.weapons.length = 0;
  run.give('weapon', rune.weapon);
  const w = s.loadout.weapon(rune.weapon), kind = w.def.behavior.kind;
  s.loadout.stats.values[api.STAT.amountBonus] = amountBonus;
  s.loadout.stats.values[api.STAT.critChance] = 0;
  const baseline = { ...api.sim.areaStats(s, w, {}) };
  s.choiceQueue.unshift({ kind: 'levelUp', offers: [{ type: 'rune', slot: w.slot, rune: rune.id }] });
  run.game.choose({ type: 'pick', index: 0 });
  assert.deepEqual(w.runes.fits, [true]);
  s.enemies.pool.clear(); s.bosses.pool.clear();
  const e = s.enemies, slots = [];
  const aphid = api.registry.enemyIndex('aphid');
  assert.ok(Number.isInteger(aphid) && aphid >= 0);
  assert.equal(api.sim.areaHitGold[aphid] ?? 0, 0, 'no on-hit gold for fixture enemy');
  for (const [dx, dy, hp, maxHp] of [[30, 0, 1000000, 1000000], [0, 70, 10000, 3000000]]) {
    const i = e.pool.spawn(); slots.push(i); e.def[i] = aphid;
    e.x[i] = s.player.x[s.me] + dx; e.y[i] = s.player.y[s.me] + dy;
    e.radius[i] = 4; e.hp[i] = hp; e.maxHp[i] = maxHp;
  }
  api.sim.areaHash(s);
  const toughest = rune.effects.some((e) => e.kind === 'toughest');
  assert.equal(api.sim.areaTarget(s, w, s.player.x[s.me], s.player.y[s.me], 100), slots[toughest ? 1 : 0]);
  assert.equal(api.sim.areaTarget(s, w, s.player.x[s.me], s.player.y[s.me], 40), slots[0]);
  assert.equal(api.sim.areaTarget(s, w, 10000, 10000, 10), undefined);
  if (toughest) {
    e.maxHp[slots[0]] = 3000000;
    assert.equal(api.sim.areaTarget(s, w, s.player.x[s.me], s.player.y[s.me], 100), slots[0]);
    e.maxHp[slots[0]] = 1000000;
  }
  const volleys = [], starts = [], emissions = [], impacts = [];
  const flush = () => {
    const hp = slots.map((i) => e.hp[i]), expected = slots.map(() => 0);
    for (let h = 0; h < s.hits.count; h++) {
      const target = s.hits.target[h];
      const index = slots.indexOf(target);
      assert.ok(index >= 0, `unexpected hit target ${target}`);
      expected[index] += s.hits.amount[h];
    }
    hitFlush(s);
    const loss = slots.map((i, j) => hp[j] - e.hp[i]);
    slots.forEach((i, j) => { near(loss[j], expected[j], 'original resolver HP loss'); assert.ok(e.hp[i] > 0); });
    if (loss.some((n) => n > 0)) impacts.push({ tick: s.tick, hpLoss: loss });
    assert.equal(s.pickups.pool.count, 0, 'no pickups created');
    return loss;
  };
  w.cd = 0; w.volleyLeft = 0;
  for (let tick = 0; tick < 12000 && volleys.length < 6; tick++) {
    s.tick++; s.time += 1 / 60;
    const stat = { ...api.sim.areaStats(s, w, {}) }, before = w.runes.beats;
    const zoneCount = s.zones.pool.count, effectCount = s.effects.pool.count;
    api.sim.areaTick(s, w, stat, 1 / 60);
    if (before !== w.runes.beats) {
      starts.push(tick);
      const expected = { ...baseline };
      for (const [k, mult] of Object.entries(rune.scale ?? {})) expected[k] *= mult;
      for (const effect of rune.effects) {
        if (effect.kind === 'focus') {
          expected.damage *= 1 + effect.damage * (baseline.amount - 1);
          expected.area *= 1 + effect.area * (baseline.amount - 1); expected.amount = 1;
        } else if (effect.kind === 'salvo') {
          expected.cooldown *= effect.volleys; expected.amount *= effect.volleys; expected.interval = 0;
        } else if (effect.kind === 'beat' && w.runes.beats % effect.every === 0) {
          expected.damage *= effect.damage; expected.area *= effect.area;
        }
      }
      for (const k of ['damage', 'cooldown', 'area', 'amount', 'duration', 'interval']) near(stat[k], expected[k], `${rune.id} ${k}`);
    }
    const payloads = [];
    if (kind === 'beam') {
      const fx = s.effects;
      for (let j = effectCount; j < fx.pool.count; j++) {
        const i = fx.pool.slotAt(j);
        near(fx.length[i], w.def.behavior.length * Math.sqrt(stat.area), 'beam length');
        near(fx.width[i], w.def.behavior.size * stat.area, 'beam width');
        payloads.push({ tick, angle: fx.angle[i], length: fx.length[i], width: fx.width[i] });
      }
      // Independent capsule/segment distance, including body radius, not merely counting queued hits.
      const expected = slots.map(() => 0);
      for (const p of payloads) slots.forEach((i, j) => {
        const x = e.x[i] - s.player.x[s.me], y = e.y[i] - s.player.y[s.me];
        const along = Math.max(0, Math.min(p.length, x * Math.cos(p.angle) + y * Math.sin(p.angle)));
        if (Math.hypot(x - along * Math.cos(p.angle), y - along * Math.sin(p.angle)) <= p.width / 2 + 4) expected[j] += stat.damage;
      });
      const applied = flush(); expected.forEach((v, i) => near(applied[i], v, `beam geometry HP loss ${JSON.stringify({ rune: rune.id, tick, payloads, expected, applied })}`));
    } else {
      const z = s.zones;
      for (let j = zoneCount; j < z.pool.count; j++) {
        const i = z.pool.slotAt(j);
        near(z.radius[i], w.def.behavior.size * stat.area, 'linear zone radius');
        near(z.damage[i], stat.damage, 'stored zone damage');
        payloads.push({ tick, slot: i, x: z.x[i], y: z.y[i], radius: z.radius[i], delay: z.delay[i], life: z.life[i], every: z.tickEvery[i] });
      }
      if (rune.weapon === 'starch-bolt') {
        const count = Math.min(stat.amount, slots.length);
        if (before !== w.runes.beats) {
          // Two non-overlapping circles: each target can be picked only once per dispatch, even in salvo.
          assert.ok(w.def.behavior.size * stat.area + 4 < Math.hypot(30, 70));
          assert.equal(s.hits.count, count);
          assert.equal(new Set(Array.from(s.hits.target.slice(0, s.hits.count))).size, count);
          if (toughest) assert.equal(s.hits.target[0], slots[1], 'actual toughest strike first');
          payloads.push({ tick, hits: count });
        }
      } else assert.equal(s.hits.count, 0, 'warning/pool creation does not immediately apply damage');
      flush();
    }
    emissions.push(...payloads);
    if (w.runes.beats > volleys.length && w.volleyLeft === 0) {
      const expectedCount = kind === 'strike' ? Math.min(stat.amount, slots.length) : stat.amount;
      if (rune.weapon === 'starch-bolt') assert.equal(emissions[0].hits, expectedCount);
      else assert.equal(emissions.length, expectedCount);
      if (kind === 'strike' && rune.weapon !== 'starch-bolt') assert.equal(new Set(emissions.map((p) => `${p.x}/${p.y}`)).size, expectedCount, 'distinct Root strike centers');
      if (kind === 'beam') {
        near(emissions[0].angle, toughest ? Math.PI / 2 : 0, 'actual first beam aim');
        for (let j = 1; j < emissions.length; j++) near(emissions[j].angle - emissions[0].angle, (j % 2 ? 1 : -1) * Math.ceil(j / 2) * 0.35, 'alternating extra rays');
      }
      if (kind !== 'strike') for (let j = 1; j < emissions.length; j++) {
        const gap = (emissions[j].tick - emissions[j - 1].tick) / 60;
        assert.ok(Math.abs(gap - stat.interval) <= 1 / 60 + 1e-6, 'original within-volley spacing');
        if (stat.interval === 0) assert.equal(gap, 0);
      }
      if (toughest && emissions[0]?.x !== undefined) {
        near(emissions[0].x, e.x[slots[1]], 'actual toughest center X');
        near(emissions[0].y, e.y[slots[1]], 'actual toughest center Y');
      }
      volleys.push({ number: w.runes.beats, tick, stats: stat, payloads: [...emissions] });
      emissions.length = 0;
      s.zones.pool.clear(); s.effects.pool.clear();
    }
  }
  assert.equal(volleys.length, 6);
  for (let i = 1; i < starts.length; i++) assert.ok(Math.abs((starts[i] - starts[i - 1]) / 60 - volleys[i - 1].stats.cooldown) <= 1 / 60 + 1e-6, 'tick-quantized original cooldown');
  let lifecycle;
  if (kind === 'pool' || rune.weapon === 'root-spikes') {
    // A fresh actual attack after volley six, then only original zone/hit systems, never spawns/death/rewards.
    w.cd = 0; w.volleyLeft = 0;
    const stat = { ...api.sim.areaStats(s, w, {}) };
    api.sim.areaTick(s, w, stat, 1 / 60);
    const z = s.zones, i = z.pool.slotAt(0);
    assert.ok(z.pool.isAlive(i));
    for (let j = 1; j < z.pool.count; j++) z.pool.kill(z.pool.slotAt(j));
    const radius = z.radius[i], delay = z.delay[i], life = z.life[i], every = z.tickEvery[i];
    assert.equal(z.poolShape[i], kind === 'pool' ? 3 : 0);
    const terms = api.sim.areaShapes[kind === 'pool' ? 'splat' : 'round'].terms;
    // Orthogonality gives the area-normalizing factor independently of the client's 4096-sample table.
    const norm = 1 / Math.sqrt(1 + terms.reduce((sum, t) => sum + t.amp ** 2 / 2, 0));
    const edge = radius * norm * (1 + terms.reduce((sum, t) => sum + t.amp * Math.cos(-t.k * z.turn[i] * Math.PI / 2 + t.phase), 0));
    // Move both supplied bodies to opposite sides of the overlap boundary, retaining radius four.
    e.x[slots[0]] = z.x[i] + edge + 4 - 0.25; e.y[slots[0]] = z.y[i];
    e.x[slots[1]] = z.x[i] + edge + 4 + 0.25; e.y[slots[1]] = z.y[i];
    api.sim.areaHash(s);
    const pulses = [];
    for (let tick = 1; tick < 2000 && z.pool.isAlive(i); tick++) {
      s.tick++; s.time += 1 / 60;
      zoneTick(s, 1 / 60);
      const hits = s.hits.count;
      if (hits) {
        assert.equal(hits, 1, 'inside body alone overlaps the zone');
        assert.equal(s.hits.target[0], slots[0]); near(s.hits.amount[0], stat.damage, 'zone pulse damage');
        pulses.push(tick);
      }
      flush();
    }
    assert.ok(!z.pool.isAlive(i), 'zone completes/expires');
    if (delay > 0) {
      near(delay, 0.3, 'Root warning definition');
      assert.deepEqual(pulses, [19], 'original repeated floating-point subtraction resolves the nominal 18-tick warning on tick 19');
    } else {
      assert.equal(pulses[0], 1, 'first pool pulse on first zone tick');
      for (let j = 1; j < pulses.length; j++) assert.equal(pulses[j] - pulses[j - 1], Math.round(every * 60));
      assert.ok(pulses.at(-1) / 60 < life);
      assert.ok((pulses.at(-1) + Math.round(every * 60)) / 60 >= life);
    }
    lifecycle = { radius, shape: kind === 'pool' ? 'splat' : 'round', turn: z.turn[i], edge, delay, life, every, pulses, boundaryMargin: 0.25, damagePerPulse: stat.damage };
  }
  rows.push({ seed, amountBonus, keys: [`rune:${rune.id}`], behavior: w.def.behavior, baseline, starts, volleys, impacts, lifecycle });
}
console.log(JSON.stringify({ main, scriptSha256: hash(readFileSync(new URL(import.meta.url))),
  sources: Object.entries(sources).map(([file, sha256]) => ({ url: `https://tibo.dog/assets/${file}`, sha256 })),
  definitions: Object.fromEntries(runes.map((r) => [`rune:${r.id}`, hash(JSON.stringify(r))])),
  setup: 'Standard/Normal,s1/s2/s3; supplied level-one rune cards,Amount bonus0/3,crit0. Six original attack volleys; stationary aphids,maxHP1m/3m,currentHP1m/10k,radius4. Original resolver,beam geometry,distinct strike picks,Root warning and Gravy pulse/expiration/both body-overlap boundaries. Zone lifetime fixtures isolate one emitted zone. No full-world stepping,natural acquisition,max-level/evolved/union equivalence,moving-target combat,status advancement,DPS,survival,server/device or reward claims. Network blocked; no deaths,pickups or reward handling.', rows }, null, 2));
