// Supplied phase-role fixtures on the original client. No gameplay network writes.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mirror } from './fetch-build.mjs';
import { loadGame, Run } from './play.mjs';
const main = process.argv[2] ?? 'main-DwGb2BE_.js';
assert.equal(main, 'main-DwGb2BE_.js');
const { dir } = await mirror(undefined, main);
const hash = (s) => createHash('sha256').update(s).digest('hex');
const sources = {
  'endgame-sim-CefNBFg5.js': 'd78e5134bfbe144cfb38da9b10648d55d40119d47ac7f2b09b697193b182dd9b',
  'shell-CHXbzErl.js': 'b64d49c1f14a85557015354c3cde2d2f694bba443c6499a9652ec1228211f585',
  'titan.hot-CjjRSbsl.js': 'f60c8400eb3d17492e7265fb11e3aa28df2781e759c72b894c05e894b8c2ad05',
};
for (const [file, expected] of Object.entries(sources)) assert.equal(hash(readFileSync(join(dir, file))), expected, file);
const path = join(dir, 'endgame-sim-CefNBFg5.js'), source = readFileSync(path, 'utf8');
writeFileSync(path, source + '\nexport { sa as spawnCourt, Ca as tickCourt, Ta as families };\n');
let api;
try { api = await loadGame(main); } finally { writeFileSync(path, source); }
const original = await import(pathToFileURL(path));
const shell = await import(pathToFileURL(join(dir, 'shell-CHXbzErl.js')));
const titan = await import(pathToFileURL(join(dir, 'titan.hot-CjjRSbsl.js')));
const state = await import(pathToFileURL(join(dir, 'shell-state-BH2BiELQ.js')));
const rows = [];
const near = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-6, `${label}: ${a} != ${b}`);
function setup(seed) {
  const run = new Run(api, { seed, mode: 'standard', difficulty: 'normal' });
  run.state.loadout.weapons.length = 0;
  run.step(1 / 60);
  run.state.enemies.pool.clear(); run.state.bosses.pool.clear();
  run.state.court = new shell.l(run.state.enemies.capacity);
  run.state.court.active = true; run.state.court.nextWaveAt = Infinity;
  run.state.shell = new state.t(run.state.enemies.capacity); run.state.shell.active = true;
  return run;
}
function spawnCourt(run, id, role, x = 0, y = 0) {
  return original.spawnCourt(run.state, { enemy: id, role, x: run.pos.x + x, y: run.pos.y + y });
}
for (const seed of ['s1', 's2', 's3']) {
  for (const [id, role] of [['sea-serpent', 1], ['jelly-wraith', 1], ['dune-manticore', 1], ['basilisk', 1],
    ['siren-harpy', 2], ['barnacle-troll', 3], ['coral-golem', 4], ['mangrove-treant', 5],
    ['queen-herald', 6], ['queen-seer', 6], ['queen-warden', 6]]) {
    const run = setup(seed), s = run.state, e = s.enemies;
    const i = spawnCourt(run, id, role);
    assert.ok(i >= 0); assert.equal(s.court.role[i], role);
    near(e.speed[i], role === 1 ? 36 : role === 6 ? 34 : 30, 'role speed overrides catalog');
    const checks = ['original phase spawning and role-specific speed'];
    if (role === 2 || role === 3 || role === 5) {
      const j = spawnCourt(run, 'sea-serpent', 1, 40);
      e.vx[j] = 10; e.vy[j] = -2; e.hp[j] = e.maxHp[j] / 2;
      e.hp[i] = e.maxHp[i] / 2;
      original.tickCourt(s, 1);
      if (role === 2) { near(e.vx[j], 15, 'banner X'); near(e.vy[j], -3, 'banner Y'); near(e.vx[i], 0, 'no self boost'); }
      if (role === 3) { near(e.hp[j] / e.maxHp[j], .54, 'mender max HP healing'); near(e.hp[i] / e.maxHp[i], .5, 'no self heal'); }
      if (role === 5) { near(original.ENDGAME_SIM.court.courtDamageMultiplier(s, j), .35, 'shell helper protection'); near(original.ENDGAME_SIM.court.courtDamageMultiplier(s, i), 1, 'no self protection'); }
      e.x[j] = e.x[i] + 83; e.vx[j] = 10; e.vy[j] = -2; const before = e.hp[j];
      original.tickCourt(s, 1);
      if (role === 2) near(e.vx[j], 10, 'outside banner');
      if (role === 3) near(e.hp[j], before, 'outside mender');
      if (role === 5) near(original.ENDGAME_SIM.court.courtDamageMultiplier(s, j), 1, 'outside shell');
      checks.push('inside/outside aura controls, self exclusion');
    }
    if (role === 4) {
      const before = e.pool.count;
      s.runClock = s.court.broodAt[i] - .001; original.tickCourt(s, 1 / 60);
      assert.equal(e.pool.count, before, 'no early brood');
      s.runClock += .001; original.tickCourt(s, 1 / 60);
      assert.equal(e.pool.count, before + 2, 'two crowd spawns when due');
      original.tickCourt(s, 1 / 60); assert.equal(e.pool.count, before + 2, 'not every tick');
      while (e.pool.count < 39) spawnCourt(run, 'sea-serpent', 1, 200);
      s.runClock = s.court.broodAt[i]; original.tickCourt(s, 1 / 60);
      assert.equal(e.pool.count, 40, 'one remaining place, counting helper as a member');
      s.runClock = s.court.broodAt[i]; original.tickCourt(s, 1 / 60);
      assert.equal(e.pool.count, 40, 'saturated member cap prevents brood');
      checks.push('brood due-time boundary, two-child count, no repeated tick spawn, one remaining place and saturated 40-member cap');
    }
    if (role === 6) {
      const b = original.families.court.spawnBoss(s, { bossDef: api.registry.bossIndex('queen') });
      assert.ok(b >= 0);
      assert.equal(original.ENDGAME_SIM.court.courtQueenProtected(s, b), true, 'attendants protect Queen');
      e.pool.kill(s.court.attendantSlot[0]);
      assert.equal(original.ENDGAME_SIM.court.courtQueenProtected(s, b), true, 'one defeated attendant is not enough');
      for (const slot of s.court.attendantSlot) e.pool.kill(slot);
      original.tickCourt(s, 1 / 60);
      assert.equal(original.ENDGAME_SIM.court.courtQueenProtected(s, b), false, 'all attendants gone opens Queen');
      const at = s.court.attendantReturnAt[0]; near(at - s.runClock, 18.75, 'return delay');
      checks.push('real Queen spawn; attendant death opens Queen; 18.75-second return scheduling (return animation not exercised)');
    }
    rows.push({ seed, keys: [`enemy:${id}`], checks });
  }
  for (const d of api.registry.enemies.filter((e) => e.id.startsWith('armoured-'))) {
    const run = setup(seed), s = run.state, e = s.enemies;
    const spawn = Object.values(api.sim).find((v) => typeof v === 'function' && /^function \w+\(e,t,n,r\)\{return \w+\(e\),\w+\(e,t,n,r\)\}$/.test(String(v)));
    const i = spawn(s, api.registry.enemyIndex(d.id), run.pos.x + 100, run.pos.y);
    s.shell.armorId[i] = e.pool.id(i); s.shell.armorState[i] = 2; e.state[i] = 2;
    near(titan.o(s, i), .1, 'protected during charge');
    original.families.shell.tick(s); near(titan.o(s, i), .1, 'no early opening');
    e.state[i] = 0; original.families.shell.tick(s);
    near(titan.o(s, i), 1, 'post-attack opening'); near(s.shell.openUntil[i] - s.runClock, 1.2, 'opening duration');
    s.runClock = s.shell.openUntil[i] - .001; near(titan.o(s, i), 1, 'just before close');
    s.runClock += .001; near(titan.o(s, i), .1, 'equality protected');
    rows.push({ seed, keys: [`enemy:${d.id}`], checks: ['phase protection .1 during attack, transition-driven opening, 1.2-second strict expiry'] });
  }
  {
    const run = setup(seed), s = run.state, e = s.enemies;
    const i = shell.r(s, s.shell); assert.ok(i >= 0);
    near(e.speed[i], 0, 'totem stationary'); near(s.shell.fuseUntil[i] - s.runClock, 6, 'fuse');
    s.runClock = s.shell.fuseUntil[i] - .001; titan.l(s); assert.ok(e.pool.isAlive(i));
    s.runClock += .001; titan.l(s); assert.ok(!e.pool.isAlive(i)); assert.equal(s.shell.stats.blasts, 1);
    const j = shell.r(s, s.shell); e.pool.kill(j); e.pool.release();
    s.runClock += 7; titan.l(s); assert.equal(s.shell.stats.blasts, 1, 'destroying totem cancels blast');
    rows.push({ seed, keys: ['enemy:fuse-totem'], checks: ['original totem spawn, stationary, six-second fuse boundary, destroyed-totem cancellation'] });
  }
}
console.log(JSON.stringify({ main, sources: Object.entries(sources).map(([file, sha256]) => ({ url: `https://tibo.dog/assets/${file}`, sha256 })),
  scriptSha256: hash(readFileSync(new URL(import.meta.url))), mode: 'standard', difficulty: 'normal',
  setup: 's1/s2/s3; original phase constructors, spawners and ticks with supplied roles, positions, clocks, armor generations and HP. No gear/god mode/reward writes. Not natural acquisition, survival, Nightmare timing, server behavior, complete maze pathfinding or attendant-return animation.',
  cases: rows.length, rows }, null, 2));
