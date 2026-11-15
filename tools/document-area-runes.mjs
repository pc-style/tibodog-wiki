// Reviewed beam/strike/pool walkthroughs, generated only from hash-bound successful original-client controls.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const read = (f) => readFileSync(f, 'utf8');
const hash = (v) => createHash('sha256').update(v).digest('hex');
assert.ok(process.argv[2], 'Pass the successful area-rune probe export');
const result = JSON.parse(read(process.argv[2])), build = JSON.parse(read('data/build.json'));
const script = 'tools/probe-area-runes.mjs';
assert.equal(result.main, build.main);
assert.equal(result.scriptSha256, hash(read(script)));
for (const s of result.sources) assert.equal(hash(readFileSync(`.cache/${build.main.replace('.js', '')}/assets/${new URL(s.url).pathname.split('/').pop()}`)), s.sha256);
assert.equal(result.rows.length, 72);
const registry = JSON.parse(read('data/registry.json')), evidence = JSON.parse(read('data/coverage-evidence.json'));
const cite = (q) => {
  assert.ok(read(`.cache/${build.main.replace('.js', '')}/assets/${build.sim}`).includes(q), q);
  return ` <small>[${build.sim}: \`\` ${q} \`\`]</small>`;
};
const notes = {
  'fry-lance-heavy-lance': 'Heavy Lance strengthens the **third beam volley**, not every third enemy pierced. All rays within that volley share the buff. Its ×1.5 Area makes the beam 1.5 times as wide but only √1.5 times as long; it is not a 1.5-times reach bonus.',
  'fry-lance-jouster': 'Jouster aims the lance toward the eligible pest with the highest **maximum HP**, even when that pest has much less current HP than a nearby one. It does not turn the beam into a homing projectile or make every extra ray converge on that pest.',
  'fry-lance-long-lance': 'Long Lance trades width for reach: the base definition changes from **170 long and 6 wide to 272 long and 5.1 wide**, before Area. Reshaping also extends the aim search to 1.2 times that definition length. Additional Area lengthens the beam through √Area but does not extend that search again.',
  'root-spikes-big-root': 'Big Root converts the entire computed Amount into **one larger, stronger delayed strike**, rather than leaving extra spikes hidden under the first. At level one, the ordinary three strikes already supply two spare Amount for conversion. The larger circle does not lengthen the warning.',
  'root-spikes-deep-roots': 'Deep Roots changes **which pest gets a strike center first**. Remaining Amount can pick other eligible pests, but the same pest cannot be chosen twice in one dispatch. It does not make all strikes chase the first target during their warning.',
  'root-spikes-root-quake': 'Root Quake buffs every **third strike volley**, not every third spike or warning completion. The whole dispatch shares the buff. Larger Area increases each strike circle linearly; the delay and distinct-target rule stay unchanged.',
  'starch-bolt-big-bolt': 'Big Bolt concentrates the computed Amount into **one stronger, wider immediate strike**. It gives up extra centers, not merely extra visual bolts. A bigger circle can still overlap several pests; one center is not a one-enemy damage cap.',
  'starch-bolt-lightning-rod': 'Lightning Rod chooses the highest-maximum-HP eligible pest **first**, then uses distinct targets for remaining strikes. That priority is not based on remaining HP and does not let one isolated pest absorb all the unused Amount.',
  'starch-bolt-storm-front': 'Storm Front triples strike Amount but cannot repeat a target center within the same dispatch. With only two separated eligible pests, this control lands **two strikes**, not six or fifteen. Spare Amount is unused; it is not queued for later. Its cooldown is ×2.25 after both the rune scale and salvo conversion.',
  'gravy-boat-big-spill': 'Big Spill chooses the highest-maximum-HP eligible pest as the **pool placement target**. The pool then stays at that position; it does not follow the pest or reselect it on every damage pulse. The rune boosts pulse damage, not pool duration or pulse frequency.',
  'gravy-boat-deep-dish': 'Deep Dish converts all Amount into **one stronger, larger pool**. Its initial ×0.45 damage scale means one total Amount produces a weaker pulse; spare Amount supplies additive conversion bonuses. The shape remains a splat, so its size parameter is not a circular hit radius.',
  'gravy-boat-full-pour': 'Full Pour places three ordinary volleys’ worth of pools **in the same tick**, followed by ×1.95 ordinary cooldown after both conversions. Each pool keeps its own lifetime and pulse timer. This verifies placement and an isolated pool’s pulses, not total damage from overlapping pools in a natural fight.',
};
const f = (n) => Number(n.toFixed(4));
const outputs = new Map();
for (const [id, note] of Object.entries(notes)) {
  const def = registry.runes.find((r) => r.id === id), key = `rune:${id}`;
  assert.ok(def);
  const rows = result.rows.filter((r) => r.keys.includes(key));
  assert.equal(rows.length, 6);
  assert.deepEqual(rows.map((r) => `${r.seed}/${r.amountBonus}`).sort(), ['s1/0', 's1/3', 's2/0', 's2/3', 's3/0', 's3/3']);
  assert.equal(result.definitions[key], hash(JSON.stringify(def)));
  const kind = rows[0].behavior.kind;
  let text = `## How it works\n\n${note}${cite(`id:\`${id}\``)}\n\n`;
  if (kind === 'beam') text += `The original attack checks a **line segment plus half the beam width and the enemy’s body radius**. It applies a hit immediately; the lingering beam graphic is not a damage-over-time field. Length is definition length × √Area; width is definition size × Area. Extra Amount rays alternate offsets of **+0.35, −0.35, +0.70 radians** around the chosen aim, with ordinary within-volley spacing.${cite('l=n.length*Math.sqrt(r.area),u=n.size*r.area')}${cite('mn(q(e,n),J(e,n),a,o,d,f)<=u/2+ud(e,n)&&Z(e,n)')}\n\n`;
  if (kind === 'strike') text += `The strike consumer handles Amount **inside one dispatch**, marking each picked target before choosing the next. It stops when no unpicked eligible target remains. Strike radius is definition size × Area, not √Area. This is a cap on selected centers, not on enemies caught by each circle.${cite('for(let o=0;o<r.amount;o++){let o=hk(e,t,n.range,i);if(o===void 0)return;dd(e,o,i)')}${cite('a=n.size*r.area')}\n\n`;
  if (def.weapon === 'root-spikes') text += `Root Spikes stores the target’s position when placing the warning. Only when its **nominal 0.3-second delay** ends does the original zone system resolve the circle against current enemy positions. In these 60 Hz fixtures, repeated floating-point timer subtraction completes on **tick 19 (about 0.317 s)**, not tick 18. Bodies moved just inside/outside the stored circle during the warning receive one hit/no hit respectively; the original hit resolver confirms HP loss.${cite('n.delay[i]=a-t,a-t<=0&&kM(e,i)')}${cite('wM(e,t),kd(e,r,i,n.radius[t])')}\n\n`;
  if (def.weapon === 'starch-bolt') text += `Starch Bolt has **no warning zone**: the selected circles queue hits during the attack, then the original hit processor applies HP loss. These two-target controls use separated circles, so the observed strike count is not inflated by overlapping explosions.${cite('else kd(e,s,c,a),L(e,`strike`,s,c,a,Od(e))')}\n\n`;
  if (kind === 'pool') text += `Gravy’s pool has a **rotated splat outline**, not a circle. Its size parameter is definition size × Area; the shape’s angular outline and the enemy’s body radius determine overlap. The first pulse occurs on the first zone tick, then every **0.4 s (24 ticks)**. The isolated level-one pool lasts 3.125 s in this fixture and hits on ticks **1, 25, 49, 73, 97, 121, 145, 169**; expiration prevents the next pulse. Damage is per pulse, not damage per second. The fixture checks bodies 0.25 units inside and outside the actual rotated outline, not a guessed circular boundary.${cite('o.radius[i]=n.size*r.area,o.life[i]=r.duration')}${cite('o.poolShape[i]=s,o.turn[i]=bo(s,o.pool.id(i))')}${cite('let n=e.zones,r=n.tickTimer[t]-1')}${cite('if(n.life[i]=o,o<=0)')}\n\n`;
  for (const effect of def.effects) {
    if (effect.kind === 'toughest') text += `Priority compares **maximum HP inside the search range**; equal maximum HP prefers the nearer eligible pest. Range exclusion still applies. The asymmetric control has max HP 1,000,000 / 3,000,000 but current HP 1,000,000 / 10,000, so maximum HP and remaining HP predict opposite choices.${cite('let f=u.maxHp[d]')}${cite('f<c||f===c&&h>=l')}\n\n`;
    if (effect.kind === 'focus') text += `After ordinary stats and rune scales, let N be computed Amount. Focus multiplies damage by **1 + ${effect.damage} × (N − 1)** and Area by **1 + ${effect.area} × (N − 1)**, then sets Amount to 1. These are additive bonuses per spare Amount, not repeated compounding.${cite('t.damage*=1+r.focusDamage*e,t.area*=1+r.focusArea*e,t.amount=1')}\n\n`;
    if (effect.kind === 'salvo') text += `Salvo multiplies **Amount and cooldown by ${effect.volleys}**, then sets the within-volley interval to zero, after applying ordinary scales. Strike Amount still cannot reuse a target in one dispatch; pool Amount creates separate pools.${cite('t.cooldown*=r.salvo,t.amount*=r.salvo,t.interval=0')}\n\n`;
    if (effect.kind === 'beat') text += `Each **${effect.every}-volley cycle** ends with **×${effect.damage} damage and ×${effect.area} Area**. Starting a volley increments the counter once; its remaining attacks keep that same beat. The control covers both third and sixth volleys, with ordinary fourth/fifth volleys in between.${cite('(e.volleyLeft>0?n.beats:n.beats+1)%r.beatEvery===0')}${cite('e.runes.beats++')}\n\n`;
    if (effect.kind === 'reshape') text += `Reshaping multiplies only ${Object.entries(effect.fields).map(([k, v]) => `**${k} ×${v}**`).join(', ')} in the original behavior definition. It does not scale every dimension equally.${cite('n.push([r,a*i])')}\n\n`;
  }
  if (def.scale) text += `Other computed-stat scales: ${Object.entries(def.scale).map(([k, v]) => `**${k} ×${v}**`).join(', ')}. These are not measured sustained-DPS ratios.${cite('t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area')}\n\n`;
  text += `Retained command: \`node ${script} ${build.main}\`. **Six supplied-state groups for this rune**, Standard/Normal, seeds \`s1/s2/s3\`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.\n\n`;
  text += `Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.\n\n| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |\n|---|---|---|---|---|\n`;
  for (const r of rows.filter((r) => r.seed === 's1')) {
    const a = r.volleys[0], b = r.volleys[2];
    const count = def.weapon === 'starch-bolt' ? a.payloads[0].hits : a.payloads.length;
    text += `| ${r.amountBonus} | ${a.stats.amount} / ${count} | ${f(a.stats.damage)} / ${f(b.stats.damage)} | ${f(a.stats.area)} / ${f(b.stats.area)} | ${f((r.starts[1] - r.starts[0]) / 60)} |\n`;
  }
  outputs.set(`data/prose/runes/${id}.md`, text);
  const record = { file: script, command: `node ${script} ${build.main}`, main: build.main, definitionSha256: result.definitions[key], scriptSha256: result.scriptSha256, source: result.sources[1], sources: result.sources, scope: result.setup };
  evidence.scenarios[key] = [...(evidence.scenarios[key] ?? []).filter((e) => e.main !== build.main || e.file !== script), record];
}
assert.equal(Object.keys(result.definitions).length, outputs.size);
outputs.set('data/coverage-evidence.json', JSON.stringify(evidence, null, 2) + '\n');
if (process.argv.includes('--write')) mkdirSync('data/prose/runes', { recursive: true });
for (const [file, text] of outputs) {
  if (process.argv.includes('--write')) writeFileSync(file, text);
  else assert.equal(read(file), text, `Regenerate ${file}`);
}
console.log(`Checked 72 original-client groups; ${process.argv.includes('--write') ? 'wrote' : 'verified'} 12 beam/strike/pool rune explanations`);
