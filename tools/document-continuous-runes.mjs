// Reviewed contact explanations generated from source/definition/script-bound original-client controls.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
const read = (f) => readFileSync(f, 'utf8');
const hash = (s) => createHash('sha256').update(s).digest('hex');
assert.ok(process.argv[2], 'Pass the successful contact probe export');
const result = JSON.parse(read(process.argv[2])), build = JSON.parse(read('data/build.json'));
const script = 'tools/probe-continuous-runes.mjs', registry = JSON.parse(read('data/registry.json'));
assert.equal(result.main, build.main); assert.equal(result.scriptSha256, hash(read(script)));
assert.equal(result.rows.length, 54);
const assets = `.cache/${build.main.replace('.js', '')}/assets`;
for (const s of result.sources) assert.equal(hash(readFileSync(`${assets}/${new URL(s.url).pathname.split('/').pop()}`)), s.sha256);
const cite = (q) => {
  assert.ok(read(`${assets}/${build.sim}`).includes(q), q);
  return ` <small>[${build.sim}: \`\` ${q} \`\`]</small>`;
};
const notes = {
  'deep-fryer-hot-seat': 'Hot Seat triples each spray hit and changes **aim priority**, not the list of pests that can be damaged. Every pulse aims at the eligible pest with the highest **maximum HP**; every pest inside that cone can still be hit. It is not a single-target damage cap. A farther pest with max HP 30 million but current HP 1 million beats a nearer pest with max/current HP 10 million. Lowering the supplied farther pest’s maximum HP before the next pulse makes the cone turn back immediately; the priority is not locked for the entire spray.',
  'deep-fryer-long-soak': 'Long Soak makes the **active spray twice as long**, each hit ×1.05 damage, and the subsequent rest ×1.3 as long. It does not double the pulse rate or make the entire start-to-start cycle exactly twice as long. In the supplied level-one fixture the spray grows from 68 to 135 ticks, rests for 187 ticks, and starts again after **322 ticks (about 5.367 s)**; there are 15 pulses in each complete spray, not 16.',
  'deep-fryer-wide-basket': 'Wide Basket widens the cone angle ×1.9 but shortens its reach ×0.85, while each hit gains ×1.2 damage. Its definition changes from angle 0.6 to **1.14 radians** and reach 70 to **59.5 units**, before Area. The consumer adds a fixed 0.1-radian tolerance on each side after halving the angle, so the effective half-angle is **0.67 radians**, not 1.9 times the ordinary 0.4. The shorter reach also shortens the trigger search.',
  'steam-vent-big-pot': 'Big Pot increases the steam’s **radius ×1.45** while reducing each pulse to ×0.25 damage. At level one that is a 46.4-unit radius and 1.25 damage per ordinary pest per pulse. It does not add projectiles, increase the pulse frequency, or apply a quarter-damage penalty once for every pest in the circle: each qualifying pest receives its own full scaled hit.',
  'steam-vent-rolling-boil': 'Rolling Boil changes the aura’s **hitInterval ×0.55**, not its cooldown stat, and scales each pulse’s damage ×0.7. The nominal interval becomes 0.275 s. The original 60 Hz timer rounds that to **17 ticks (about 0.2833 s)**, compared with 30 ticks ordinarily. Each hit is 3.5 raw damage in the supplied level-one fixture. Faster pulses are not proof of a natural-run DPS ratio.',
  'steam-vent-scald': 'Scald gives every steam hit **×1.15 damage**, then applies a separate **×2 elite multiplier** in the original hit resolver. Equal-position ordinary and elite aphids lose **5.75 and 11.5 HP** per pulse in the supplied level-one control. The elite multiplier is not a second hit, a faster pulse, or a rule based on maximum HP. Bosses share the elite branch in source, but this retained control uses elite enemies, not a boss encounter.',
  'sprout-satellites-big-sprout': 'Big Sprout concentrates computed Amount into **one larger satellite**, but first scales damage ×0.2. If N is Amount before focus, damage becomes ordinary damage ×0.2 × [1 + 0.3 × (N − 1)], and Area becomes ordinary Area × [1 + 0.25 × (N − 1)]. The bonuses add per spare satellite; they do not compound. With Amount bonus 0/3, the supplied level-one Amount is 2/5 and the result is one satellite with **3.64/6.16 damage** and **1.25/2 Area**. A single larger satellite is not a guarantee of higher single-target damage.',
  'sprout-satellites-spin-cycle': 'Spin Cycle doubles angular speed and scales each contact hit ×0.87 damage. The level-one orbit rotates at **6.4 radians per second**, rather than 3.2, while the damage lockout remains **0.4 s per pest for the whole weapon**. Faster rotation changes when a satellite reaches a pest; it does not halve the contact timer or cause each satellite to get a separate timer. The active/rest cycle stays unchanged.',
  'sprout-satellites-wide-orbit': 'Wide Orbit moves the satellite centers **1.6 times farther from Tibo**, but reduces contact damage to ×0.25. At level one and Area 1, the orbit radius becomes **60.8 units**, while each satellite’s own hit radius stays 6. It does not make each satellite 1.6 times wider or fill in the space between Tibo and the ring. Its hit timer, speed and active/rest cycle stay unchanged.',
};
const evidence = JSON.parse(read('data/coverage-evidence.json')), outputs = new Map();
const f = (v) => Number(v.toFixed(4));
for (const [id, note] of Object.entries(notes)) {
  const def = registry.runes.find((r) => r.id === id), key = `rune:${id}`, rows = result.rows.filter((r) => r.keys.includes(key));
  assert.equal(rows.length, 6); assert.equal(result.definitions[key], hash(JSON.stringify(def)));
  assert.deepEqual(rows.map((r) => `${r.seed}/${r.amountBonus}`).sort(), ['s1/0', 's1/3', 's2/0', 's2/3', 's3/0', 's3/3']);
  const kind = rows[0].behavior.kind;
  let text = `## How it works\n\n${note}${cite(`id:\`${id}\``)}\n\n`;
  if (kind === 'cone') text += `The original cone consumer searches out to **1.3 × reach** to start a spray, but applies damage only inside **reach plus the pest’s body radius** and the cone’s angular boundary. A supplied pest at 1.15 × reach starts a spray without receiving a hit. An empty search does not start one. Each pulse reselects its aim; half the definition angle plus **0.1 radians** sets the angular boundary. Area scales reach, not that angle. The controls distinguish angular offsets ±0.002 radians and body-overlap distances ±0.25 units.${cite('cd(e,i,a,1.3*o)!==void 0')}${cite('Math.abs(hn(t.angle,C(J(e,r)-a,q(e,r)-i)))<=l+.1&&Z(e,r)')}\n\nThe first pulse is **one tick after activation**, then every **9 ticks (0.15 s)**. The active timer finishes before the rest timer begins; extra Amount does not add simultaneous sprays or pulses. Three complete on/off cycles are retained per group. Hot Seat also verifies that out-of-range tougher pests cannot win the aim search.${cite('t.active=b(Math.max(.2,r.duration)),t.volleyTimer=0')}${cite('t.active<=0&&(t.cd=b(r.cooldown))')}\n\n`;
  if (kind === 'aura') text += `The original aura damages **every overlapping pest** in its circle on a pulse, including the body radius at the boundary. The supplied pests 0.25 units inside/outside that overlap boundary receive one hit/no hit. Radius is definition size × Area. The timer is reset from **behavior hitInterval**, not computed cooldown; ordinary cooldown reduction and extra Amount do not add pulses or extra hits to one pest.${cite('t.cd=b(n.hitInterval),Y(e,r.damage,t.src,t.slot,r.knockback)')}${cite('n.size*r.area,i)')}${cite('return e!==`aura`&&e!==`cone`&&e!==`nuke`&&e!==`ring`')}\n\n`;
  if (id === 'steam-vent-scald') text += `The original resolver, not a queue-size estimate, confirms the elite HP loss. The global elite multiplier is left at its ordinary value in these controls; other bonuses or game modes could change final damage.${cite('t.has(n,T.Elite)')}${cite('l*=o.eliteMult*a.eliteMult[r]')}\n\n`;
  if (kind === 'orbit') text += `Satellite centers rotate at **computed speed radians per second**, evenly spaced around an orbit of **definition orbitRadius × √Area**. Each satellite hits within **definition size × Area plus the pest’s body radius**. Area therefore changes orbit distance and contact width by different factors. The controls follow a satellite every tick, independently predict its angle, and put additional bodies 0.25 units inside/outside its outer contact boundary.${cite('t.angle+=r.speed*i')}${cite('s=n.orbitRadius*Math.sqrt(r.area),c=n.size*r.area')}\n\nEach pest shares one weapon-slot hit stamp across **all satellites**: the next eligible contact is **24 ticks later**, not 24 ticks per satellite. A separate, deliberately supplied **Area 400** overlap control makes all satellites touch four ordinary-sized bodies simultaneously; each body loses one hit’s damage on ticks 0 and 24, not one hit per satellite. This is a timer control, not an attainable-loadout claim. At ordinary fixture Area, three complete **300-tick active / 180-tick rest** cycles are retained. Rotation pauses during rest; the expiration tick still runs contact checks before the next call enters cooldown.${cite('a=8*W(r)+t.slot')}${cite('if(e.tick-i.hitStamp[a]<l)continue')}${cite('else if(t.active>0)--t.active,t.active<=0&&(t.cd=b(r.cooldown))')}\n\n`;
  text += `Retained command: \`node ${script} ${build.main}\`. **Six supplied-state groups per rune**, Standard/Normal, seeds \`s1/s2/s3\`, Amount bonus 0/3, crit chance 0. Level-one weapons and rune cards are supplied through the original choice handler; this bypasses ordinary max-level acquisition. Only the original weapon and hit systems advance; high-HP aphids do not die, no reward handlers or pickups run, and network access is forbidden. These controls do **not** establish natural acquisition, max-level/evolved/union equivalence, autonomous moving-pest combat, status progression, DPS/survival, server or device behavior. Existing older scenario evidence remains historical.\n\n`;
  text += `Examples below are the **s1 supplied level-one fixtures**, not ordinary max-level builds. Damage is HP loss per ordinary-pest pulse/contact; Bonus means the deliberately supplied Amount bonus.\n\n`;
  if (kind === 'cone') {
    text += `| Bonus | Damage | Reach | Pulses/spray | Cycle (s) |\n|---|---|---|---|---|\n`;
    for (const r of rows.filter((r) => r.seed === 's1')) text += `| ${r.amountBonus} | ${f(r.stats.damage)} | ${f(r.behavior.size * r.stats.area)} | ${r.pulses.filter((t) => t <= r.ends[0]).length} | ${f((r.starts[1] - r.starts[0]) / 60)} |\n`;
  } else if (kind === 'aura') {
    text += `| Bonus | Damage | Radius | Pulse gap (ticks) |\n|---|---|---|---|\n`;
    for (const r of rows.filter((r) => r.seed === 's1')) text += `| ${r.amountBonus} | ${f(r.stats.damage)} | ${f(r.behavior.size * r.stats.area)} | ${r.pulses[1] - r.pulses[0]} |\n`;
  } else {
    text += `| Bonus | Satellites | Damage | Orbit radius | Hit radius |\n|---|---|---|---|---|\n`;
    for (const r of rows.filter((r) => r.seed === 's1')) text += `| ${r.amountBonus} | ${r.stats.amount} | ${f(r.stats.damage)} | ${f(r.behavior.orbitRadius * Math.sqrt(r.stats.area))} | ${f(r.behavior.size * r.stats.area)} |\n`;
  }
  outputs.set(`data/prose/runes/${id}.md`, text);
  const record = { file: script, command: `node ${script} ${build.main}`, main: build.main, definitionSha256: result.definitions[key], scriptSha256: result.scriptSha256, source: result.sources[1], sources: result.sources, scope: result.setup };
  evidence.scenarios[key] = [...(evidence.scenarios[key] ?? []).filter((e) => e.main !== build.main || e.file !== script), record];
}
assert.equal(Object.keys(result.definitions).length, outputs.size);
outputs.set('data/coverage-evidence.json', JSON.stringify(evidence, null, 2) + '\n');
for (const [file, text] of outputs) {
  if (process.argv.includes('--write')) writeFileSync(file, text);
  else assert.equal(read(file), text, `Regenerate ${file}`);
}
console.log(`Checked 54 original-client groups; ${process.argv.includes('--write') ? 'wrote' : 'verified'} nine cone/aura/orbit rune explanations`);
