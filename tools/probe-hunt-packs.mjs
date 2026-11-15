// Reviewed original Hunt consumers with supplied states; no gameplay network writes.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mirror } from './fetch-build.mjs';
import { loadGame, Run } from './play.mjs';
const main = process.argv[2] ?? 'main-DwGb2BE_.js';
const reviewed = {
  'main-DwGb2BE_.js': ['endgame-sim-CefNBFg5.js', 'd78e5134bfbe144cfb38da9b10648d55d40119d47ac7f2b09b697193b182dd9b', 'shell-CHXbzErl.js'],
  'main-8zbhOvtE.js': ['endgame-sim-C0aS1dIG.js', 'd29a669e399399ae1414fdab2355f0fe43d65c5db70fd9f73ddd52fee2bf4920', 'shell-DMm1Ns3S.js'],
};
assert.ok(reviewed[main], 'review bridge on a new build');
const hash = (s) => createHash('sha256').update(s).digest('hex');
const { dir } = await mirror(undefined, main);
const [file, expected, sharedFile] = reviewed[main], path = join(dir, file), source = readFileSync(path, 'utf8');
assert.equal(hash(source), expected);
writeFileSync(path, source + '\nexport { vr as spawnPack, Dr as spawnHunt, U as kinds, zt as packs, Vr as tickPack, a as flags };\n');
let api;
try { api = await loadGame(main); } finally { writeFileSync(path, source); }
const client = await import(pathToFileURL(path));
const shared = await import(pathToFileURL(join(dir, sharedFile)));
const near = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-6, `${label}: ${a} != ${b}`);
const rows = [];
function setup(seed, kind, alpha = 'none', count = 1) {
  const run = new Run(api, { seed, mode: 'standard', difficulty: 'normal' });
  run.state.loadout.weapons.length = 0;
  run.step(1 / 60);
  const s = run.state, e = s.enemies;
  s.burrow = new shared.y();
  e.pool.clear(); s.bosses.pool.clear(); s.world.activeChunks = [];
  const pack = client.spawnPack(s, { kind, size: count, alpha, x: run.pos.x + 100, y: run.pos.y });
  assert.ok(pack >= 0);
  const h = client.packs(s);
  h.mode[pack] = 1; h.stepTick = s.tick;
  const slot = alpha === 'none' ? e.pool.slotAt(0) : h.alphaSlot[pack];
  return { run, s, e, h, pack, slot };
}
for (const seed of ['s1', 's2', 's3']) {
  for (const kind of client.kinds) for (const alpha of kind.alpha ? ['none', 'leader', 'elite'] : ['none']) {
    const { run, s, e, h, pack, slot: i } = setup(seed, kind, alpha);
    const id = alpha === 'none' ? kind.member : kind.alpha;
    const def = api.registry.enemies.find((x) => x.id === id), b = def.behavior.lunge;
    const steer = () => client.ENDGAME_SIM.steerPackMember(s, i, b);
    near(e.speed[i], alpha === 'none' ? kind.speed : kind.lead.speed, 'spawner speed');
    near(e.radius[i], def.radius * (alpha === 'none' ? kind.memberScale : kind.lead.scale), 'role body scale');
    if (alpha !== 'none') {
      near(h.nextLunge[i] - s.time, 3.5, 'alpha initial lunge delay');
      s.time = 4; h.nextLunge[i] = 4.1; h.patternNext[pack] = 1000;
      e.x[i] = run.pos.x + b.range; e.y[i] = run.pos.y;
      steer(); assert.equal(e.state[i], 0, 'alpha cooldown blocks lunge');
      h.nextLunge[i] = 4;
    }
    e.x[i] = run.pos.x + b.range + .001; e.y[i] = run.pos.y;
    steer(); assert.equal(e.state[i], 0, 'outside trigger control');
    if (alpha === 'none') {
      assert.ok(h.nextLunge[i] >= s.time && h.nextLunge[i] <= s.time + .35, 'initial close-mode stagger');
      s.time = h.nextLunge[i];
    }
    e.x[i] = run.pos.x + b.range;
    steer(); assert.equal(e.state[i], 1, `equality triggers crouch: ${id}/${alpha}, ${JSON.stringify({ time: s.time, role: h.role[i], mode: h.mode[pack], next: h.nextLunge[i], packNext: h.nextLungeAt[pack], crouching: h.crouching[pack] })}`);
    near(e.timer[i], b.crouch, 'Normal crouch'); near(e.vx[i], 0, 'crouch stops');
    near(h.leapLen[i], Math.min(b.range + 20, b.distance), 'range plus 20 clamped to lunge distance');
    near(e.tx[i], -1, 'locked direction X'); near(e.ty[i], 0, 'locked direction Y');
    s.player.x[s.me] += 250; s.player.y[s.me] += 60;
    e.timer[i] = .001; steer(); assert.equal(e.state[i], 1, 'no early leap');
    e.timer[i] = 0; steer(); assert.equal(e.state[i], 2, 'leap at deadline');
    assert.ok(e.has(i, client.flags.Invincible));
    near(e.damage[i], h.leapDmg[i], 'leap damage replaces touch damage');
    near(e.timer[i], h.leapLen[i] / b.speed, 'travel duration');
    steer(); near(e.vx[i], -b.speed, 'not homing after lock'); near(e.vy[i], 0, 'not homing Y');
    e.timer[i] = 0; steer(); assert.equal(e.state[i], 3, 'recover after leap');
    assert.ok(!e.has(i, client.flags.Invincible));
    near(e.damage[i], h.touchDmg[i], 'touch damage restored'); near(e.timer[i], b.recover, 'recovery timer');
    e.timer[i] = 0; steer(); assert.equal(e.state[i], 0, 'move after recovery');
    const delay = h.nextLunge[i] - s.time;
    if (alpha === 'none') assert.ok(delay >= 3.6 && delay <= 5.4);
    else near(delay, 3.5, 'alpha retry');
    // A second supplied leap distinguishes normal recovery from a rock interruption.
    e.state[i] = 2; e.timer[i] = 1; e.set(i, client.flags.Invincible); e.damage[i] = h.leapDmg[i];
    s.world.activeChunks = [{ props: [{ type: 'boulder', x: e.x[i] - 12, y: e.y[i], size: 1 }] }];
    s.tick++; h.stepTick = s.tick; steer();
    assert.equal(e.state[i], 3, 'solid stops a leap'); near(e.timer[i], .8, 'rock recovery');
    assert.ok(!e.has(i, client.flags.Invincible)); near(e.damage[i], h.touchDmg[i], 'rock restores contact damage');
    rows.push({ seed, keys: [`enemy:${id}`], checks: `${alpha} role: spawn stats, outside/equal range, crouch boundary, locked lane, invincibility and damage swap, duration/recovery, retry delay, supplied boulder interrupt with .8s recovery` });
  }
  // Alpha loss scatters surviving members; leaders never fire elite volleys.
  for (const kind of client.kinds.filter((k) => k.alpha)) {
    for (const alpha of ['leader', 'elite']) {
      const { run, s, e, h, pack, slot: i } = setup(seed, kind, alpha, 3);
      const b = api.registry.enemies.find((x) => x.id === kind.alpha).behavior.lunge;
      e.x[i] = run.pos.x + 120; e.y[i] = run.pos.y;
      h.nextLunge[i] = 1000; h.engagedAt[pack] = s.time; h.patternNext[pack] = s.time;
      client.ENDGAME_SIM.steerPackMember(s, i, b);
      assert.equal(h.stats.alphaVolleys, alpha === 'elite' ? 1 : 0);
      if (alpha === 'elite') {
        const emitter = s.emitters.pool.slotAt(0);
        near(s.emitters.telegraph[emitter], .8, 'elite warning');
        const expected = { 'rat-chief': [1, 3, 120], 'crow-elder': [4, 6, 66], 'raccoon-boss': [12, 1, 62] }[kind.alpha];
        near(s.emitters.count[emitter], expected[0], 'first pattern count');
        near(s.emitters.burstsLeft[emitter], expected[1], 'first pattern bursts');
        near(s.emitters.speed[emitter], expected[2], 'first pattern speed');
      }
      h.count[pack] = 3; e.pool.kill(i); client.tickPack(s, h, pack);
      assert.equal(h.mode[pack], 3, 'alpha death scatters pack');
      const member = e.pool.slotAt(0), start = s.time;
      client.ENDGAME_SIM.steerPackMember(s, member, api.registry.enemies.find((x) => x.id === kind.member).behavior.lunge);
      assert.ok(h.fleeUntil[member] >= start + 1.5 && h.fleeUntil[member] <= start + 2);
      rows.push({ seed, keys: [`enemy:${kind.alpha}`, `enemy:${kind.member}`], checks: `${alpha}: elite-only emitter creation/first pattern, alpha death scatters, member flee duration` });
    }
  }
}
console.log(JSON.stringify({ main, source: { url: `https://tibo.dog/assets/${file}`, sha256: hash(source) },
  definitions: Object.fromEntries([...new Set(rows.flatMap((r) => r.keys))].map((key) => [key, hash(JSON.stringify(api.registry.enemies.find((d) => `enemy:${d.id}` === key)))])),
  scriptSha256: hash(readFileSync(new URL(import.meta.url))), cases: rows.length, rows,
  setup: 'Standard/Normal s1/s2/s3; original pack spawners/steering with supplied member/leader/elite roles, positions, clocks, empty props and attack timers. No natural encounter, reward writes, survival/DPS/server/device or Nightmare claims.' }, null, 2));
