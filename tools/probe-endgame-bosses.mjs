// Supplied-state controls on original endgame consumers; never contacts gameplay services.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mirror } from './fetch-build.mjs';
import { loadGame, Run } from './play.mjs';
const main = process.argv[2] ?? 'main-8zbhOvtE.js';
assert.equal(main, 'main-8zbhOvtE.js', 'review consumers before using another build');
const hash = (s) => createHash('sha256').update(s).digest('hex');
const sources = {
  'main-8zbhOvtE.js': '7ff8520c6503b9052f8b53013c30af37b5c452ecea7a0d0ed5584eb4f2010478',
  'intro-shared-BzGhBf9a.js': '24beb3e16e8da35dea12ed278b80cc83ede70173b8052d97b77c96592421483e',
  'sim-DpazMjS2.js': 'f6bc620d2ea311a52f90cc280b32c73a2769707859ea1e33c20943b74588677e',
  'endgame-sim-C0aS1dIG.js': 'd29a669e399399ae1414fdab2355f0fe43d65c5db70fd9f73ddd52fee2bf4920',
  'shell-DMm1Ns3S.js': 'bd531b4b4ec2317fe4133e8d31c9c4279375631123b5ea63fd42da1c8da9638c',
  'titan.hot-BQuNhy4d.js': '7504a096b5f07edf68439770874d57f467abf856e6a255a7629fdb48d1bd2983',
  'shell-state-C9zMbdgQ.js': 'd7dea47a4dca86d955298480a04093368282d9d653851603cd7f1e4d87b6b9ba',
  'court-BZmFCheB.js': '2796f7087ac198b5de71b315f85b1700092bc073a147ce8f02bad329dc702d5b',
  'shell-CR6f_8vs.js': 'afb04ee679c9726686c827bc3767708e0f44b235fcf63d3604a8105c1bb675c6',
};
const { dir } = await mirror(undefined, main);
for (const [f, sha] of Object.entries(sources)) assert.equal(hash(readFileSync(join(dir, f))), sha, f);
const bridges = {
  'sim-DpazMjS2.js': 'export { HD as beginBossAttack, UD as windupBoss, WD as activeBoss };',
  'endgame-sim-C0aS1dIG.js': 'export { Ta as families, a as flags, Ii as spawnHead, ta as tickHead, X as headSpot };',
};
const originals = Object.fromEntries(Object.keys(bridges).map((f) => [f, readFileSync(join(dir, f), 'utf8')]));
let api;
try {
  for (const [f, text] of Object.entries(bridges)) writeFileSync(join(dir, f), originals[f] + '\n' + text);
  api = await loadGame(main);
} finally {
  for (const [f, text] of Object.entries(originals)) writeFileSync(join(dir, f), text);
}
const end = await import(pathToFileURL(join(dir, 'endgame-sim-C0aS1dIG.js')));
const shared = await import(pathToFileURL(join(dir, 'shell-DMm1Ns3S.js')));
const state = await import(pathToFileURL(join(dir, 'shell-state-C9zMbdgQ.js')));
const titan = await import(pathToFileURL(join(dir, 'titan.hot-BQuNhy4d.js')));
const bosses = Object.values(api.sim).find((v) => typeof v?.bossAt === 'function');
const rows = [];
const near = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-6, `${label}: ${a} != ${b}`);
function setup(seed, family, id) {
  const run = new Run(api, { seed, mode: 'standard', difficulty: 'normal' });
  run.state.loadout.weapons.length = 0; run.step(1 / 60);
  const s = run.state;
  s.enemies.pool.clear(); s.bosses.pool.clear(); s.world.activeChunks = [];
  s.burrow = new shared.y(); s.court = new shared.l(s.enemies.capacity);
  s.shell = new state.t(s.enemies.capacity);
  const f = end.families[family], context = { phaseStart: s.runClock, bossStatus: 0, bossSlot: -1, familyLive: true, bossDef: api.registry.bossIndex(id) };
  f.start(s, context);
  const slot = f.spawnBoss(s, context); assert.ok(slot >= 0, id);
  const b = s.bosses;
  b.x[slot] = run.pos.x + 100; b.y[slot] = run.pos.y;
  const def = bosses.bossAt(b.def[slot]);
  return { run, s, f, b, slot, def };
}
function attack(c) {
  const { s, b, slot, def } = c;
  b.state[slot] = 0; b.timer[slot] = 0;
  api.sim.beginBossAttack(s, slot, def, -100, 0, 0);
  assert.equal(b.state[slot], 1); near(b.timer[slot], def.telegraph, 'windup duration');
  near(b.tx[slot], -1, 'attack direction captured');
  s.player.y[s.me] += 90;
  b.timer[slot] = .001; api.sim.windupBoss(s, slot, def, 1 / 60);
  assert.equal(b.state[slot], 1, 'no early windup completion');
  b.timer[slot] = 0; api.sim.windupBoss(s, slot, def, 1 / 60);
  near(b.tx[slot], -1, 'moving player does not retarget captured direction');
}
for (const seed of ['s1', 's2', 's3']) {
  for (const [family, id] of [['hunt', 'pack-lord'], ['court', 'queen'], ['shell', 'shell-titan']]) {
    const c = setup(seed, family, id), { s, f, b, slot, def } = c;
    s.court.nextWaveAt = Infinity; s.shell.nextBeastAt = Infinity; s.shell.nextTotemAt = Infinity;
    attack(c);
    const checks = ['original family boss spawn; attack windup boundary and moved-player captured-direction control'];
    if (id !== 'queen') {
      assert.equal(b.state[slot], 2); near(b.timer[slot], def.attack.dashTime, 'charge duration');
      b.timer[slot] = .001; api.sim.activeBoss(s, slot, def, 1 / 60);
      near(b.vx[slot], -def.attack.dashSpeed, 'charge follows captured heading');
      near(b.vy[slot], 0, 'not homing'); assert.equal(b.state[slot], 2);
      f.tick(s, { dt: 1 / 60 });
      b.timer[slot] = 0; api.sim.activeBoss(s, slot, def, 1 / 60);
      assert.equal(b.state[slot], 0);
      f.tick(s, { dt: 1 / 60 });
      checks.push('charge speed/duration and attack-end transition through original consumers');
    }
    if (id === 'pack-lord') {
      near(b.timer[slot], .3, 'first chain gap');
      for (const expected of [.3, 3.4]) {
        b.state[slot] = 2; f.tick(s, { dt: 1 / 60 });
        b.state[slot] = 0; f.tick(s, { dt: 1 / 60 });
        near(b.timer[slot], expected, 'three charges then full cooldown');
      }
      // A supplied recognised prop ahead of an active charge uses the same chain completion.
      s.world.activeChunks = [{ props: [{ type: 'boulder', x: b.x[slot] - 5, y: b.y[slot], size: 1 }] }];
      s.tick++; b.state[slot] = 2; b.tx[slot] = -1; b.ty[slot] = 0;
      f.tick(s, { dt: 1 / 60 });
      assert.equal(b.state[slot], 0, 'boulder stops charge'); near(b.timer[slot], .3, 'rock consumes chain leap');
      checks.push('three-charge chain (.3/.3/3.4 recovery) and supplied-boulder charge interruption');
    } else if (id === 'queen') {
      assert.equal(b.state[slot], 0); near(b.timer[slot], 4, 'sweep cooldown');
      const z = s.zones, lanes = [];
      for (let j = 0; j < z.pool.count; j++) { const i = z.pool.slotAt(j); if (z.length[i] === 320) lanes.push(i); }
      assert.equal(lanes.length, 3, 'three sweep lane zones');
      near(Math.abs(z.x[lanes[2]] - z.x[lanes[0]]), 218.4, 'lane centre spacing');
      near(Math.abs(z.delay[lanes[2]] - z.delay[lanes[0]]), .3, 'staggered lane warnings');
      assert.equal(end.ENDGAME_SIM.court.courtQueenProtected(s, slot), true);
      for (let j = 0; j < 2; j++) s.enemies.pool.kill(s.court.attendantSlot[j]);
      f.tick(s, { dt: 1 / 60 });
      assert.equal(end.ENDGAME_SIM.court.courtQueenProtected(s, slot), true, 'last attendant protects');
      s.enemies.pool.kill(s.court.attendantSlot[2]); f.tick(s, { dt: 1 / 60 });
      assert.equal(end.ENDGAME_SIM.court.courtQueenProtected(s, slot), false);
      assert.equal(b.has(slot, end.flags.Invincible), false, 'invincibility flag removed');
      const at = s.court.attendantReturnAt[2]; near(at - s.runClock, 18.75, 'return schedule');
      s.runClock = at - .801; f.tick(s, { dt: 1 / 60 });
      assert.equal(s.court.attendantWarnZone[2], -1, 'not yet warning');
      s.runClock += .001; f.tick(s, { dt: 1 / 60 });
      assert.ok(s.court.attendantWarnZone[2] >= 0, 'return warning at lead boundary');
      const deadline = s.court.attendantReturnAt[2];
      s.runClock = deadline - .001; f.tick(s, { dt: 1 / 60 });
      assert.equal(end.ENDGAME_SIM.court.courtQueenProtected(s, slot), false, 'warning not itself attendant protection');
      s.runClock = deadline; f.tick(s, { dt: 1 / 60 });
      assert.equal(end.ENDGAME_SIM.court.courtQueenProtected(s, slot), true, 'return closes vulnerability');
      checks.push('three staggered sweep lanes; one/all attendants protection;18.75s return/.8s warning boundaries and protection restored');
    } else {
      near(titan.n(s, slot), 1, 'post-charge full damage');
      near(s.shell.titanOpenUntil - s.runClock, 3, 'three-second plate opening');
      for (let plate = 0; plate < 3; plate++) {
        assert.equal(s.shell.titanPlate, plate);
        const deadline = s.shell.titanOpenUntil;
        s.runClock = deadline - .001; near(titan.n(s, slot), 1, 'before opening expiry');
        s.runClock = deadline; near(titan.n(s, slot), .1, 'equality protected');
        f.tick(s, { dt: 1 / 60 }); assert.equal(s.shell.titanPlate, (plate + 1) % 3);
        near(s.shell.titanOpenUntil, 0, 'opening cleared once');
        f.tick(s, { dt: 1 / 60 }); assert.equal(s.shell.titanPlate, (plate + 1) % 3, 'no repeated plate advance');
        b.state[slot] = 2; f.tick(s, { dt: 1 / 60 });
        b.state[slot] = 0; f.tick(s, { dt: 1 / 60 });
      }
      s.shell.active = false; near(titan.n(s, slot), 1, 'unregistered/inactive phase has no protection');
      checks.push('post-charge 3s full-damage gate; strict expiry/.1 protection; all three plate transitions and wrap; inactive control');
    }
    rows.push({ seed, keys: [`boss:${id}`], checks });
  }
  const chain = ['root-hydra', 'root-hydra-mire', 'root-hydra-stump', 'root-hydra-frenzy'];
  for (const trigger of ['hp', 'time']) {
    const c = setup(seed, 'burrow', 'root-hydra'), { s, f, b, slot } = c;
    const rhythm = s.burrow.rhythm;
    rhythm.stage = shared.C.done;
    const context = { bossSlot: slot, bossId: b.pool.id(slot), dt: 0 };
    const maxHp = b.maxHp[slot], speed = b.speed[slot], damage = b.damage[slot], radius = b.radius[slot];
    for (let form = 0; form < 4; form++) {
      assert.equal(b.def[slot], api.registry.bossIndex(chain[form]));
      near(b.maxHp[slot], maxHp, 'form does not load catalog HP');
      near(b.speed[slot], speed, 'form retains stored speed');
      near(b.radius[slot], radius, 'form retains radius'); assert.equal(b.pool.id(slot), context.bossId, 'same body generation');
      if (trigger === 'hp') near(b.damage[slot] / damage, [1, 1, 3, 4.25][form], 'same-clock shared-base contact damage multiplier');
      const def = bosses.bossAt(b.def[slot]);
      s.zones.pool.clear();
      attack({ ...c, def });
      if (def.attack.kind === 'pools') {
        assert.equal(s.zones.pool.count, 6, 'Mire six pool warnings');
        const z = s.zones, first = z.pool.slotAt(0);
        near(z.afterLife[first], 7, 'pool lifetime');
        near(z.afterDps[first], 14 * b.damage[slot] / def.damage, 'pool damage inherits form multiplier');
      } else if (def.attack.kind === 'summon') {
        assert.equal(s.zones.pool.count, 2, 'Stump two summon warnings');
        for (let j = 0; j < 2; j++) assert.equal(s.zones.spawnDef[s.zones.pool.slotAt(j)], api.registry.enemyIndex('mud-golem'));
      } else if (def.attack.kind === 'charge') {
        assert.equal(b.state[slot], 2); near(b.timer[slot], .9, 'frenzy charge duration');
        api.sim.activeBoss(s, slot, def, 1 / 60); near(b.vx[slot], -330, 'frenzy charge speed');
      } else assert.equal(s.zones.pool.count, 3, 'base Hydra three sweep lanes');
      rows.push({ seed, keys: [`boss:${chain[form]}`], checks: `${trigger}-driven original form sequence; persistent HP/slot/stored speed and damage factors1/1/3/4.25; original ${def.attack.kind} attack construction and windup boundary (not actual hits or summon completion)` });
      if (form === 3) break;
      b.state[slot] = 0;
      s.player.x[s.me] = b.x[slot] - 50; s.player.y[s.me] = b.y[slot];
      if (trigger === 'hp') {
        b.hp[slot] = maxHp * [.7, .45, .3][form] + .01;
      } else s.runClock = rhythm.stats.hydraAt + (form + 1) * 10.5 - .001;
      f.tick(s, context); assert.equal(b.def[slot], api.registry.bossIndex(chain[form]), 'not before form boundary');
      if (trigger === 'hp') b.hp[slot] -= .01;
      else s.runClock += .001;
      const hp = b.hp[slot];
      f.tick(s, context);
      assert.equal(b.def[slot], api.registry.bossIndex(chain[form + 1]), 'equality changes form');
      near(b.hp[slot], hp, 'no form heal'); near(b.timer[slot], 1.5, 'form attack pause');
      near(b.patternT[slot], 1.5, 'form pattern pause');
    }
  }
  {
    const { s, b } = setup(seed, 'burrow', 'root-hydra');
    const h = s.burrow.heads;
    h.windowStart = 0; h.chipOf = 1000; h.chipCap = .25;
    end.headSpot.x = s.player.x[s.me] + 130; end.headSpot.y = s.player.y[s.me];
    const head = end.spawnHead(s, { delay: 0, moves: 1, sweep: false, req: { level: 2.5, hpMult: 1.2, damageMult: 1 } });
    assert.ok(head >= 0);
    h.plan[3 * head] = 0; // Select Mud Bloom explicitly, not a natural pattern-frequency sample.
    h.clock = .999; end.tickHead(s, h, head); assert.equal(h.slot[head], -1, 'splash before spawn');
    h.clock = 1; end.tickHead(s, h, head);
    const slot = h.slot[head]; assert.ok(slot >= 0); assert.ok(b.has(slot, end.flags.Hidden));
    near(b.speed[slot], 0, 'head stationary');
    h.clock = 1.599; end.tickHead(s, h, head); assert.ok(b.has(slot, end.flags.Hidden));
    h.clock = 1.6; end.tickHead(s, h, head); assert.ok(!b.has(slot, end.flags.Hidden), 'head appears after rise');
    // Keep this a bookkeeping-only scenario, never a head-defeat/reward scenario.
    h.hpStart[head] = b.maxHp[slot] = b.hp[slot] = 1000;
    b.hp[slot] -= 100; h.clock += .001; end.tickHead(s, h, head); near(h.chipped, .1, 'head damage contributes chip share');
    const emitter = s.emitters.pool.slotAt(s.emitters.pool.count - 1);
    assert.ok(s.emitters.pool.count > 0, 'head first move creates original emitter');
    near(s.emitters.count[emitter], 14, 'first-tier ring count'); near(s.emitters.speed[emitter], 62, 'first-tier ring speed');
    near(s.emitters.telegraph[emitter], 1, 'first-move warning extended to one second');
    end.tickHead(s, h, head); near(h.chipped, .1, 'same damage not counted twice');
    b.hp[slot] = h.hpStart[head] - 300; end.tickHead(s, h, head); near(h.chipped, .25, 'chip share capped');
    assert.ok(b.pool.isAlive(slot) && b.hp[slot] > 1, 'bookkeeping control does not enter reward/defeat path');
    // Spawn a fresh body at the supplied accumulated chip, not a reward/completion path.
    const f = end.families.burrow, context = { bossDef: api.registry.bossIndex('root-hydra') };
    const next = f.spawnBoss(s, context); assert.ok(next >= 0);
    near(s.burrow.rhythm.stats.hydraChip, .25, 'spawn consumes prior head chip');
    assert.equal(h.slot[head], -1, 'main Hydra clears temporary heads');
    const chippedHp = b.maxHp[next];
    h.chipped = 0;
    const unchipped = f.spawnBoss(s, context); assert.ok(unchipped >= 0);
    near(chippedHp / b.maxHp[unchipped], .75, 'chip actually reduces spawned HP by one quarter');
    rows.push({ seed, keys: ['boss:root-hydra-head', 'boss:root-hydra'], checks: 'original head schedule;1s splash/.6s rise and stationary body;first-tier original14shot/speed62/1swarning emitter;supplied1000headHP/1000chip basis;HP-delta counted once/capped .25;main Hydra consumes chip/removes heads;spawnedHP75%of unchipped control (not hit resolver or reward defeat)' });
  }
}
const ids = [...new Set(rows.flatMap((r) => r.keys))];
console.log(JSON.stringify({ main, sources: Object.entries(sources).map(([file, sha256]) => ({ url: `https://tibo.dog/assets/${file}`, sha256 })),
  scriptSha256: hash(readFileSync(new URL(import.meta.url))),
  definitions: Object.fromEntries(ids.map((key) => [key, hash(JSON.stringify(bosses.bossAt(api.registry.bossIndex(key.split(':')[1]))))])),
  setup: 'Standard/Normal,s1/s2/s3; original spawners and attack/family consumers with supplied clocks,timers,positions,roles,boulder and selected first-tier Mud Bloom plan;1000headHP/1000chip basis. Starting weapon removed;no give/god/warp,reward-service writes or natural encounter claims. Only selected head emitter parameters,not bullet travel/other volleys,natural plan frequencies,full movement integration,damage-hit resolver,Nightmare,survival/DPS/server/device behavior.',
  cases: rows.length, rows }, null, 2));
