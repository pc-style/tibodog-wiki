// Reproducible supplied-state checks on the original game, not natural drop/DPS evidence.
// Usage: node tools/probe-sprout-squad.mjs [main-XXXXXXXX.js]
import assert from 'node:assert/strict';
import { loadGame, Run } from './play.mjs';

const api = await loadGame(process.argv[2]);
const spawn = Object.values(api.sim).find((v) => typeof v === 'function' &&
  /^function \w+\(e,t,n,r\)\{return \w+\(e\),\w+\(e,t,n,r\)\}$/.test(String(v)));
assert.ok(spawn, 'original scaled-enemy spawner must be identifiable');
const rows = [];
for (const seed of ['s1', 's2', 's3']) {
  for (const [level, amount, expectedCap] of [[1, null, 6], [3, null, 9], [1, 20, 32]]) {
    const run = new Run(api, { seed, mode: 'standard', difficulty: 'normal' });
    const s = run.state;
    s.loadout.weapons.length = 0;
    run.give('weapon', 'peeler');
    for (let i = 0; i < level; i++) run.give('weapon', 'sprout-squad');
    const weapon = s.loadout.weapons.find((w) => w.def.id === 'sprout-squad');
    const support = s.loadout.weapons.find((w) => w.def.id === 'peeler');
    if (amount !== null) weapon.raw.amount = amount; // Deliberately supplied high-Amount control.
    const quiet = () => { s.enemies.pool.clear(); support.cd = 1e9; };
    run.step(1, quiet);
    const sprouts = s.gearWeapons.sprouts;
    assert.equal(sprouts.pool.count, 0, 'no idle seedlings without deaths');
    const burnBatch = () => {
      s.enemies.pool.clear();
      for (let j = 0; j < 400; j++) {
        const i = spawn(s, api.registry.enemyIndex('aphid'), run.pos.x + 80, run.pos.y);
        assert.ok(i >= 0, 'all supplied victims must spawn');
        s.enemies.hp[i] = 1;
        s.enemies.speed[i] = 0;
        s.enemies.xp[i] = 0;
        s.enemies.goldChance[i] = 0;
        s.enemies.burnT[i] = 2;
        s.enemies.burnDps[i] = 600;
        s.enemies.burnSrc[i] = support.src;
      }
      run.step(0.5, () => { support.cd = 1e9; });
    };
    burnBatch();
    const firstCap = sprouts.pool.count;
    assert.equal(firstCap, expectedCap, 'Amount scales the live squad, clamped to 32');
    burnBatch();
    assert.equal(sprouts.pool.count, expectedCap, 'further deaths cannot exceed the squad cap');
    assert.ok(s.run.kills >= 800, 'original death processing must actually run');
    const target = spawn(s, api.registry.enemyIndex('aphid'), run.pos.x + 80, run.pos.y);
    s.enemies.hp[target] = s.enemies.maxHp[target] = 1e9;
    s.enemies.speed[target] = 0;
    s.enemies.damage[target] = 0;
    const bites = [];
    let lastBite = sprouts.bitAt[0];
    run.step(1.5, () => {
      support.cd = 1e9;
      if (sprouts.bitAt[0] !== lastBite) { lastBite = sprouts.bitAt[0]; bites.push(s.tick); }
    });
    assert.ok(weapon.damageDealt > 0, 'seedlings bite a surviving target');
    assert.ok(bites.length >= 2, 'observe repeated bites from one seedling');
    assert.equal(bites[1] - bites[0], 24, 'level 1/3 interval is 0.4 s at 60 ticks/s');
    run.step(9, quiet);
    assert.equal(sprouts.pool.count, 0, 'seedlings expire without more kills');
    assert.equal(s.gearWeapons.rootSnares.pool.count, 0, 'base weapon leaves no root snares');
    rows.push({ seed, level, suppliedRawAmount: amount, cap: firstCap, furtherDeathsCap: expectedCap,
      biteIntervalTicks: bites[1] - bites[0], expired: true });
  }
}
console.log(JSON.stringify({ build: api.main, mode: 'standard', difficulty: 'normal',
  setup: 'Granted Peeler (attacks held) and Sprout Squad; 800 inserted one-HP burning aphids per case, burn attributed to Peeler; fixed high-HP bite target; no clock warp, gear or HP refill. High-Amount case supplies raw Amount 20.',
  cases: rows.length, rows }, null, 2));
