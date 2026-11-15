// Isolated original-client slash, homing/fuse and summon controls; not full combat runs.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { mirror } from './fetch-build.mjs';
import { loadGame, Run } from './play.mjs';
const main = process.argv[2] ?? 'main-BDQvha6l.js';
assert.equal(main, 'main-BDQvha6l.js', 'Recheck consumers before rebinding');
const hash = (v) => createHash('sha256').update(v).digest('hex');
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
  writeFileSync(file, original + '\nexport { Uj as specialStats, Wj as specialAttack, id as specialHash, NM as specialSystems, FO as specialGold, Cj as specialSlash, Y as specialPayload, zk as specialMove, Ik as specialContact };');
  api = await loadGame(main);
} finally { writeFileSync(file, original); }
globalThis.fetch = async () => { throw new Error('Network forbidden in special rune fixtures'); };
const systems = api.sim.specialSystems, flush = systems[28];
assert.ok(String(systems[16]).includes('let n=e.summons'));
assert.ok(String(systems[22]).includes('let n=e.projectiles'));
const near = (a, b, why) => assert.ok(Math.abs(a - b) < 0.003, `${why}: ${a} != ${b}`);
const catalog = Object.values(api.sim).find((v) => Array.isArray(v?.all) && typeof v.of === 'function' && typeof v.byId === 'function');
const runes = catalog.all.filter((r) => ['peeler', 'seeker-sprouts', 'fry-sentry', 'tater-pup'].includes(r.weapon));
assert.equal(runes.length, 12);
const rows = [];
for (const seed of ['s1', 's2', 's3']) for (const amountBonus of [0, 3]) for (const rune of runes) {
  const run = new Run(api, { seed, mode: 'standard', difficulty: 'normal' }), s = run.state;
  s.fx = true; s.loadout.weapons.length = 0; run.give('weapon', rune.weapon);
  const w = s.loadout.weapon(rune.weapon), plain = structuredClone(w.def.behavior);
  s.loadout.stats.values[api.STAT.amountBonus] = amountBonus;
  s.loadout.stats.values[api.STAT.critChance] = 0;
  const baseline = { ...api.sim.specialStats(s, w, {}) };
  s.choiceQueue.unshift({ kind: 'levelUp', offers: [{ type: 'rune', slot: w.slot, rune: rune.id }] });
  run.game.choose({ type: 'pick', index: 0 }); assert.deepEqual(w.runes.fits, [true]);
  const behavior = w.def.behavior, kind = behavior.kind;
  const stat = () => ({ ...api.sim.specialStats(s, w, {}) });
  const expected = (beat) => {
    const a = { ...baseline };
    for (const [k, v] of Object.entries(rune.scale ?? {})) a[k] *= v;
    for (const f of rune.effects) {
      if (f.kind === 'focus') { a.damage *= 1 + f.damage * (baseline.amount - 1); a.area *= 1 + f.area * (baseline.amount - 1); a.amount = 1; }
      if (f.kind === 'salvo') { a.cooldown *= f.volleys; a.amount *= f.volleys; a.interval = 0; }
      if (f.kind === 'beat' && beat % f.every === 0) { a.damage *= f.damage; a.area *= f.area; }
    }
    return a;
  };
  const verifyStats = (a, beat) => { const b = expected(beat); for (const k of ['damage','area','amount','cooldown','interval','speed','duration']) near(a[k], b[k], `${rune.id}/${beat}/${k}`); };
  for (const effect of rune.effects) if (effect.kind === 'reshape') for (const [k, v] of Object.entries(effect.fields)) near(behavior[k], plain[k] * v, k);
  s.enemies.pool.clear(); s.bosses.pool.clear();
  const e = s.enemies, p = s.projectiles, summons = s.summons, slots = [];
  const aphid = api.registry.enemyIndex('aphid'); assert.equal(api.sim.specialGold[aphid] ?? 0, 0);
  const x = s.player.x[s.me], y = s.player.y[s.me];
  for (let j = 0; j < 4; j++) { const i = e.pool.spawn(); slots.push(i); e.def[i] = aphid; e.radius[i] = 4; e.hp[i] = j === 1 ? 1000000 : 10000000; e.maxHp[i] = j === 1 ? 30000000 : 10000000; }
  const place = (j, dx, dy) => { e.x[slots[j]] = x + dx; e.y[slots[j]] = y + dy; };
  const resolve = (expected) => {
    const hp = slots.map((i) => e.hp[i]); flush(s);
    const loss = slots.map((i, j) => hp[j] - e.hp[i]);
    if (expected) loss.forEach((v, j) => near(v, expected[j], `${rune.id} resolver body${j}`));
    assert.ok(slots.every((i) => e.hp[i] > 0)); assert.equal(s.pickups.pool.count, 0);
    return loss;
  };
  const advance = () => { s.tick++; s.time = s.tick / 60; api.sim.specialHash(s); };
  s.tick = 1000; s.time = s.tick / 60; w.cd = 0; w.volleyLeft = 0;
  const volleys = [], starts = [], emissions = [], impacts = [];
  let controls;
  if (kind === 'slash' || kind === 'homing' || kind === 'turret') {
    for (let tick = 0; tick < 6000 && volleys.length < 6; tick++) {
      const a = stat(), before = w.runes.beats, counter = w.counter;
      if (kind === 'slash') {
        place(0, 30, -3); place(1, -30, -3);
        place(2, behavior.size * a.area + 2 + 4 - 0.25, -3);
        place(3, behavior.size * a.area + 2 + 4 + 0.25, -3);
      } else slots.forEach((_, j) => place(j, 10000 + j * 100, 0));
      advance(); const pc = p.pool.count;
      api.sim.specialAttack(s, w, a, 1 / 60);
      if (before !== w.runes.beats) { starts.push(tick); verifyStats(a, w.runes.beats); }
      if (kind === 'slash' && (w.counter !== counter || before !== w.runes.beats)) {
        const from = before !== w.runes.beats ? 0 : counter;
        const expectedLoss = slots.map(() => 0);
        for (let i = from; i < w.counter; i++) {
          const side = i % 2 === 0 ? 1 : -1, width = behavior.size * a.area, height = behavior.height * a.area;
          const cx = x + side * (width / 2 + 2), cy = y - 3 + 10 * Math.floor(i / 2);
          slots.forEach((slot, j) => { if (Math.abs(e.x[slot] - cx) <= width / 2 + 4 && Math.abs(e.y[slot] - cy) <= height / 2 + 4) expectedLoss[j] += a.damage; });
          emissions.push({ tick, index: i, side, width, height });
        }
        impacts.push({ tick, hpLoss: resolve(expectedLoss) });
      } else if (kind === 'homing') {
        for (let j = pc; j < p.pool.count; j++) {
          const i = p.pool.slotAt(j); near(p.damage[i], a.damage, 'emission damage');
          near(p.radius[i], behavior.size * Math.sqrt(a.area), 'projectile radius');
          emissions.push({ tick, angle: p.angle[i], damage: p.damage[i], radius: p.radius[i], life: p.life[i], pierce: p.pierce[i] });
        }
      }
      if (w.runes.beats > volleys.length && w.volleyLeft === 0) {
        if (kind === 'turret') {
          assert.equal(summons.pool.count, a.amount);
          for (let j = 0; j < summons.pool.count; j++) { const i = summons.pool.slotAt(j); near(Math.hypot(summons.x[i] - x, summons.y[i] - y), 18, 'placement radius'); near(summons.life[i], a.duration, 'turret life'); }
          emissions.push({ tick, count: summons.pool.count, life: a.duration }); summons.pool.clear();
        } else assert.equal(emissions.length, a.amount);
        if (kind !== 'turret') for (let j = 1; j < emissions.length; j++) {
          const gap = (emissions[j].tick - emissions[j - 1].tick) / 60;
          assert.ok(Math.abs(gap - a.interval) <= 1 / 60 + 1e-6, 'within-volley spacing');
          if (a.interval === 0) assert.equal(gap, 0);
        }
        if (rune.effects.some((f) => f.kind === 'ring')) for (let j = 1; j < emissions.length; j++) near(emissions[j].angle - emissions[0].angle, j * 2 * Math.PI / a.amount, 'uniform ring around random first launch');
        volleys.push({ number: w.runes.beats, tick, stats: a, emissions: [...emissions] }); emissions.length = 0;
        p.pool.clear();
      }
      s.effects.pool.clear();
    }
    assert.equal(volleys.length, 6);
    for (let j = 1; j < starts.length; j++) assert.ok(Math.abs((starts[j] - starts[j - 1]) / 60 - volleys[j - 1].stats.cooldown) <= 1 / 60 + 1e-6);
  }
  if(kind==='slash'){
    const a=stat(),width=behavior.size*a.area,height=behavior.height*a.area,cx=x+width/2+2,cy=y-3;
    [height/2+4-.25,height/2+4+.25,-height/2-4+.25,-height/2-4-.25].forEach((dy,j)=>place(j,cx-x,cy-y+dy));
    api.sim.specialHash(s);api.sim.specialPayload(s,a.damage,w.src,w.slot,a.knockback);api.sim.specialSlash(s,w,behavior,a,0);
    controls={verticalBodyMargin:.25,verticalBoundaryLoss:resolve([a.damage,0,a.damage,0])};
  }
  if (kind === 'slash' && behavior.reflect) {
    const a = stat(); s.bullets.pool.clear(); p.pool.clear();
    const width = behavior.size * a.area, height = behavior.height * a.area, cx = x + width / 2 + 2, cy = y - 3;
    const bullets = [];
    for (let j = 0; j < 4; j++) {
      const i = s.bullets.pool.spawn(); bullets.push(i);
      s.bullets.x[i] = cx; s.bullets.y[i] = cy + (j < 2 ? 0 : 1.6 * height / 2 + 4 + (j === 2 ? -0.25 : 0.25));
      s.bullets.vx[i] = -80; s.bullets.vy[i] = j === 0 ? 20 : -30;
    }
    s.bullets.x[bullets[1]] = cx + width / 2 + 4 + 0.25;
    api.sim.specialPayload(s, a.damage, w.src, w.slot, a.knockback);
    api.sim.specialSlash(s, w, behavior, a, 0);
    assert.equal(p.pool.count, 2); assert.equal(s.bullets.pool.isAlive(bullets[0]), false); assert.equal(s.bullets.pool.isAlive(bullets[2]), false);
    assert.equal(s.bullets.pool.isAlive(bullets[1]), true); assert.equal(s.bullets.pool.isAlive(bullets[3]), true);
    for (let j = 0; j < p.pool.count; j++) {
      const i = p.pool.slotAt(j); near(p.damage[i], a.damage * 1.5, 'reflected damage uses weapon');
      near(Math.hypot(p.vx[i], p.vy[i]), a.speed, 'reflected speed uses weapon'); assert.equal(p.pierce[i], 2);
      near(p.life[i],Math.max(.2,a.duration),'reflection minimum lifetime');
      near(p.angle[i],Math.atan2(j===0?-20:30,80),'reversed incoming direction');
    }
    resolve(); const shot = p.pool.slotAt(0); p.pool.kill(p.pool.slotAt(1));
    slots.forEach((_,j)=>place(j,j===0?p.x[shot]-x:10000+j*100,j===0?p.y[shot]-y:0)); api.sim.specialHash(s);
    api.sim.specialContact(s,shot); const contactLoss = resolve([a.damage*1.5,0,0,0]);
    controls = { ...controls, reflected: 2, excluded: 2, damage: a.damage * 1.5, speed: a.speed, pierce: 2, life: Math.max(.2,a.duration), reflectionWidth: width + 8, reflectionHeight: 1.6 * height + 8, contactLoss };
  }
  if (kind === 'homing') {
    const launch = () => { p.pool.clear(); w.cd = 0; w.volleyLeft = 0; api.sim.specialAttack(s, w, stat(), 1 / 60); assert.ok(p.pool.count > 0); const i = p.pool.slotAt(0); for (let j = 1; j < p.pool.count; j++) p.pool.kill(p.pool.slotAt(j)); return i; };
    let i = launch(); place(0, 30, 0); place(1, 0, 70); place(2, 500, 0); place(3, 600, 0); api.sim.specialHash(s);
    p.x[i] = x; p.y[i] = y; p.vx[i] = stat().speed; p.vy[i] = 0;
    s.tick += (6 - (s.tick + i) % 6) % 6; api.sim.specialMove(s, i, 1 / 60);
    const toughest = rune.effects.some((f) => f.kind === 'toughest');
    near(p.ox[i], toughest ? x : x + 30, 'homing target X'); near(p.oy[i], toughest ? y + 70 : y, 'homing target Y');
    near(Math.atan2(p.vy[i], p.vx[i]), toughest ? behavior.turn / 60 : 0, 'bounded turn');
    near(Math.hypot(p.vx[i], p.vy[i]), stat().speed, 'steering preserves speed');
    place(1,220,0); api.sim.specialHash(s); s.tick+=6; api.sim.specialMove(s,i,1/60);
    near(p.ox[i],x+30,'out-of-range tougher target excluded on next refresh'); near(p.oy[i],y,'retarget to eligible pest');
    controls = { target: toughest ? 1 : 0, maxTurnPerTick: behavior.turn / 60, search: 200 };
    if (behavior.fuse) {
      const contactCases = [];
      for (const pierceBonus of [0, 2]) {
        s.loadout.stats.values[api.STAT.pierceBonus] = pierceBonus; i = launch();
        [0,20,60,120].forEach((dx,j) => place(j,dx,0)); api.sim.specialHash(s);
        const damage = stat().damage, losses = [];
        for (let step = 0; step <= pierceBonus; step++) {
          const j = step; p.x[i] = e.x[slots[j]]; p.y[i] = e.y[slots[j]];
          api.sim.specialContact(s, i);
          const expectedLoss = slots.map((_, k) => (k === j ? damage : 0) + (step === pierceBonus && Math.abs(e.x[slots[k]] - p.x[i]) <= behavior.fuse.radius * stat().area + 4 ? damage * behavior.fuse.blast : 0));
          losses.push(resolve(expectedLoss));
          assert.equal(p.pool.isAlive(i), step !== pierceBonus);
          if (step < pierceBonus) { assert.equal(p.pierce[i], pierceBonus - step - 1); assert.equal(p.fuseTarget[i], slots[step + 1], 'nearest unhit hop target'); }
        }
        contactCases.push({ pierceBonus, losses });
      }
      s.loadout.stats.values[api.STAT.pierceBonus] = 0; i = launch();
      p.x[i] = x; p.y[i] = y; p.life[i] = 1 / 120; api.sim.specialHash(s);
      systems[22](s, 1 / 60);
      const expiry = resolve(slots.map((_, j) => j < 2 ? stat().damage * behavior.fuse.blast : 0));
      assert.equal(p.pool.isAlive(i), false);
      s.loadout.stats.values[api.STAT.pierceBonus]=2; i=launch();
      place(0,0,0); [1,2,3].forEach(j=>place(j,500+j*100,0)); api.sim.specialHash(s);
      p.x[i]=x;p.y[i]=y;api.sim.specialContact(s,i);
      resolve([stat().damage,0,0,0]); assert.equal(p.pool.isAlive(i),true);assert.equal(p.fuseTarget[i],-1);assert.equal(p.pierce[i],1);
      controls = { ...controls, contactCases, expiry, noHopTarget: 'survives with one remaining pierce, no immediate blast' };
    }
  }
  if (kind === 'turret' || kind === 'familiar') {
    summons.pool.clear(); p.pool.clear(); w.cd = 0; w.volleyLeft = 0;
    systems[13](s, 1 / 60); const a = stat(); verifyStats(a, 1);
    assert.equal(summons.pool.count, a.amount);
    const count = summons.pool.count, unit = summons.pool.slotAt(0);
    const initialTimers = Array.from({ length: count }, (_, j) => summons.t[summons.pool.slotAt(j)]);
    assert.deepEqual(initialTimers,Array.from({length:count},(_,j)=>kind==='turret'?0:j*9),'new summon timers');
    for (let j = 1; j < count; j++) summons.pool.kill(summons.pool.slotAt(j));
    const shots = [], toughest = rune.effects.some((f) => f.kind === 'toughest');
    place(0, 30, 0); place(1, 0, 80); place(2, 500, 0); place(3, 600, 0);
    for (let t = 0; t < 600 && shots.length < 6; t++) {
      advance(); systems[16](s, 1 / 60);
      if (p.pool.count) {
        assert.equal(p.pool.count, 1); const i = p.pool.slotAt(0), target = slots[toughest ? 1 : 0];
        near(Math.atan2(p.vy[i],p.vx[i]), Math.atan2(e.y[target]-p.y[i],e.x[target]-p.x[i]), 'actual summon aim');
        near(p.damage[i], a.damage, 'summon current damage'); near(p.life[i], kind === 'turret' ? 1.2 : a.duration, 'shot lifetime');
        shots.push({ tick: t, x: p.x[i], y: p.y[i], damage: p.damage[i], life: p.life[i] });
        p.x[i] = e.x[target]; p.y[i] = e.y[target]; api.sim.specialContact(s, i);
        impacts.push({ tick: t, hpLoss: resolve(slots.map((_, j) => j === (toughest ? 1 : 0) ? a.damage : 0)) });
        p.pool.clear();
      }
    }
    assert.equal(shots.length, 6);
    for (let j = 1; j < shots.length; j++) assert.equal(shots[j].tick - shots[j - 1].tick, Math.round(60 * (kind === 'turret' ? Math.max(0.1, a.interval) : a.cooldown)));
    if (kind === 'turret') for (const shot of shots) { near(shot.x, shots[0].x, 'stationary turret X'); near(shot.y, shots[0].y, 'stationary turret Y'); }
    s.loadout.stats.values[api.STAT.damageMult] = 1.5; summons.t[unit] = 0; advance(); systems[16](s,1/60);
    assert.equal(p.pool.count,1); near(p.damage[p.pool.slotAt(0)],a.damage*1.5,'existing summon reads changed current damage'); p.pool.clear();
    slots.forEach((_,j)=>place(j,10000+j*100,0)); summons.t[unit]=0;advance();systems[16](s,1/60);
    assert.equal(p.pool.count,0);assert.equal(summons.t[unit],6,'no-target retry timer');
    place(0,30,0);place(1,0,80);
    for(let t=1;t<=6;t++){advance();systems[16](s,1/60);assert.equal(p.pool.count,t===6?1:0,'retry waits six ticks');}
    p.pool.clear();
    let lifetime;
    if (kind === 'turret') {
      const left = summons.life[unit]; let ticks = 0;
      while (summons.pool.isAlive(unit) && ticks < 1000) { advance(); systems[16](s,1/60); p.pool.clear(); ticks++; }
      assert.equal(summons.pool.isAlive(unit),false); assert.ok(Math.abs(ticks/60-left)<=1/60+1e-6); lifetime = { remainingSeconds:left,remainingTicks:ticks };
    } else {
      s.loadout.stats.values[api.STAT.amountBonus] = amountBonus + 1; systems[13](s,1/60);
      const alive = () => Array.from({length:summons.pool.count},(_,j)=>summons.pool.slotAt(j)).filter(i=>summons.pool.isAlive(i)).length;
      assert.equal(alive(),stat().amount,'familiar count reconciles to computed Amount');
      s.loadout.stats.values[api.STAT.amountBonus] = 0; systems[13](s,1/60); assert.equal(alive(),stat().amount,'removes excess familiars');
    }
    controls = { count, initialTimers, shots, lifetime, noTargetRetryTicks:6, stats:a };
  }
  rows.push({ keys: [`rune:${rune.id}`], seed, amountBonus, baseline, behavior, starts, volleys, controls, impacts });
}
console.log(JSON.stringify({ main, scriptSha256: hash(readFileSync(new URL(import.meta.url))),
  sources: Object.entries(sources).map(([file,sha256])=>({url:`https://tibo.dog/assets/${file}`,sha256})),
  definitions:Object.fromEntries(runes.map(r=>[`rune:${r.id}`,hash(JSON.stringify(r))])),
  setup:'Standard/Normal,s1/s2/s3,supplied level-one weapon+rune card,Amount0/3,crit0. Original attack/projectile/summon/hit consumers only. Six slash/homing/turret dispatches; slash boxes/beat/isolated bullet reflection; homing one-tick target+turn,ring emissions,Hopper forced contacts with Pierce0/2 and expiry; summon six shots/target/HP loss,live stat reread,lifetime/count. HighHP aphids,no deaths,pickups,reward handlers,full-world stepping or network. Not natural acquisition,maxlevel/evolved/union,autonomous trajectory/combat,status progression,DPS/survival,server/device proof.',rows },null,2));
