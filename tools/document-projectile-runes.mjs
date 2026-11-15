// Reviewed per-rune explanations plus reproducible original-client examples.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const read = (f) => readFileSync(f, 'utf8');
const hash = (v) => createHash('sha256').update(v).digest('hex');
const input = process.argv[2];
assert.ok(input, 'Pass the successful probe-projectile-runes export');
const result = JSON.parse(read(input)), build = JSON.parse(read('data/build.json'));
assert.equal(result.main, build.main);
const script = 'tools/probe-projectile-runes.mjs';
assert.equal(result.scriptSha256, hash(read(script)));
for (const source of result.sources) assert.equal(hash(readFileSync(`.cache/${build.main.replace('.js', '')}/assets/${new URL(source.url).pathname.split('/').pop()}`)), source.sha256);
assert.equal(result.rows.length, 108);
const registry = JSON.parse(read('data/registry.json'));
const evidence = JSON.parse(read('data/coverage-evidence.json'));
const cite = (q) => {
  assert.ok(read(`.cache/${build.main.replace('.js', '')}/assets/${build.sim}`).includes(q), q);
  return ` <small>[${build.sim}: \`\` ${q} \`\`]</small>`;
};
const notes = {
  'frozen-fries-big-chill': 'Big Chill changes **which enemy the freeze shot aims at**, not its freeze duration: a nearly defeated large pest can still be preferred over a healthy small one. The normal freeze payload remains attached to emitted shots; these controls do not resolve a freeze hit.',
  'frozen-fries-brain-freeze': 'Brain Freeze strengthens the **third volley**, not every third individual fry. Multiple shots inside that volley share the buff, while volleys four and five return to ordinary damage and size. The existing freeze payload is unchanged.',
  'frozen-fries-frost-fan': 'Frost Fan spreads a volley around Tibo instead of sending every fry toward the selected pest. The first shot captures the aimed direction; later shots use evenly spaced directions around that starting angle. With only one shot there is no fan to spread.',
  'fry-knives-back-knives': 'Back Knives alternates **forward, backward, forward, backward** within each volley. It does not search for a pest behind Tibo, and it does not double Amount by itself. Normal facing-shot spread is still applied before the alternating half-turn.',
  'fry-knives-carving-knife': 'Carving Knife trades a multi-knife volley for **one stronger, larger facing shot**. It still follows Tibo’s facing direction, not the toughest-pest selector; adding Amount feeds the single-knife conversion rather than restoring the discarded knives.',
  'fry-knives-knife-storm': 'Knife Storm sends three ordinary volleys’ worth of knives **together**, then waits three ordinary cooldowns. It does not produce three separately aimed rounds over that waiting period. Facing and spread remain the knife weapon’s normal rules.',
  'rosti-disc-big-rosti': 'Big Rösti changes the disc body, not the rules for choosing a bounce direction. Its definition radius grows from **6 to 10.2**, then the Area scale contributes a further square-root factor: at otherwise base Area the emitted radius is about **11.63**, not 13.26. Bounce travel and repeated hits were not simulated by these emission controls.',
  'rosti-disc-disc-wheel': 'Disc Wheel starts with the ordinary random bounce heading, then arranges the rest of that volley at equal angles around the circle. It does not independently roll every disc’s initial direction. With one disc the ring has no extra spokes; bounce trajectories are outside this fixture.',
  'rosti-disc-hard-toss': 'Hard Toss buffs each **third disc volley** rather than each third wall bounce or collision. The six-volley control checks ordinary volleys before and after both buffs; the Area boost changes the emitted body radius through a square root, not a linear radius multiplier.',
  'spud-cannon-big-blast': 'Big Blast enlarges the **explosion radius**, not the flying potato’s body. At base Area the blast radius changes from **22 to 35.2**, while the projectile’s radius remains 5. This trades direct projectile damage for blast reach; the control checks the attached blast radius, not enemies damaged by an explosion.',
  'spud-cannon-bullseye': 'Bullseye aims the cannon toward the in-range pest with highest maximum HP. That is not a guarantee that the explosion hits that pest, nor a preference for its current HP, elite tag or distance alone. The normal blast radius remains attached to the emitted projectile.',
  'spud-cannon-volley-fire': 'Volley Fire emits three ordinary volleys’ worth of cannon shots in one tick. Its separate cooldown scale means the new wait is **2.25 times** the old wait, not three times and not 0.75 times. Shot damage is scaled independently; overlapping blasts and actual hit totals were not measured.',
  'spud-lob-big-bounce': 'Big Bounce strengthens the **third lob volley**, not every third floor bounce. The increased Area enlarges the emitted projectile body and also enters the lob’s horizontal-velocity spread formula. These fixtures do not advance gravity, bounces or impact damage.',
  'spud-lob-hot-landing': 'Hot Landing adds an **explosion-radius field of 26** to a lob that normally has no such field. Dispatch stores 26 times Area on each emitted lob, while its body still uses the ordinary size-7 radius formula. The source routes that field into impact handling; this fixture does not resolve landings or claim an extra explosion on every subsequent bounce.',
  'spud-lob-wide-lob': 'Wide Lob doubles the horizontal launch range from **±90 to ±180**, before the lob’s Area-dependent spread factor. Despite its “target” axis, this is not toughest-pest aiming: lobs launch upward with randomized horizontal velocity. Gravity, vertical launch-speed randomness and pierce are unchanged.',
  'tot-toss-big-tot': 'Big Tot converts the volley into **one larger tot**. Its initial damage scale is below one, so at one total shot the conversion has no spare Amount to consume and damage is lower than without the rune. With extra Amount, the single projectile receives the conversion bonuses instead of adding more tots.',
  'tot-toss-tot-pile': 'Tot Pile emits three ordinary volleys’ worth of tots at once, each at **0.51 times** ordinary damage, then waits three ordinary cooldowns. It does not triple the sustained firing rate or remove the longer recovery. These controls measure emission timing, not damage dealt to moving targets.',
  'tot-toss-tot-sniper': 'Tot Sniper steers the first tot toward the highest-maximum-HP eligible pest even if that pest has only 1 current HP. It does not gain infinite range or remove ordinary spread on later shots. These controls use the base Tot Toss, not its evolved gatling or union forms.',
};
const fmt = (n) => Number(n.toFixed(4));
const outputs = new Map();
for (const [id, note] of Object.entries(notes)) {
  const def = registry.runes.find((r) => r.id === id); assert.ok(def);
  const key = `rune:${id}`, rows = result.rows.filter((r) => r.keys.includes(key));
  assert.equal(rows.length, 6);
  assert.deepEqual(rows.map((r) => `${r.seed}/${r.amountBonus}`).sort(), ['s1/0', 's1/3', 's2/0', 's2/3', 's3/0', 's3/3']);
  assert.equal(result.definitions[key], hash(JSON.stringify(def)));
  let text = `## How it works\n\n${note}${cite(`id:\`${id}\``)}\n\n`;
  for (const effect of def.effects) {
    if (effect.kind === 'toughest') text += `The original selector compares **maximum HP among eligible targets inside the weapon’s search range**, breaking equal-max-HP ties by distance. It does not compare remaining HP. If a larger pest is outside that range, the nearer eligible pest can still be chosen.${cite('let f=u.maxHp[d]')}${cite('f<c||f===c&&h>=l')}\n\n`;
    if (effect.kind === 'focus') text += `After ordinary stats and the rune’s scales, let N be the volley’s total Amount. Each spare shot adds **${effect.damage} times damage** and **${effect.area} times Area** to the single survivor: multiply by 1 + ${effect.damage} × (N − 1) and 1 + ${effect.area} × (N − 1), then set Amount to 1. The damage and Area conversions are additive per spare shot, not repeated compounding. Projectile radius uses the square root of final Area.${cite('t.damage*=1+r.focusDamage*e,t.area*=1+r.focusArea*e,t.amount=1')}\n\n`;
    if (effect.kind === 'salvo') text += `The salvo consumer multiplies both **Amount and cooldown by ${effect.volleys}**, and sets the interval between shots to zero. This happens after the rune’s ordinary scales, not instead of them.${cite('t.cooldown*=r.salvo,t.amount*=r.salvo,t.interval=0')}\n\n`;
    if (effect.kind === 'beat') text += `Every **${effect.every}th started volley** gets **×${effect.damage} damage and ×${effect.area} Area**. Starting a volley increments the beat counter once; its remaining shots keep that same beat. Larger Area means ×√${effect.area} body radius, not ×${effect.area} radius.${cite('(e.volleyLeft>0?n.beats:n.beats+1)%r.beatEvery===0')}${cite('e.runes.beats++')}\n\n`;
    if (effect.kind === 'ring') text += `The angle consumer ${effect.spokes ? `adds counter modulo ${effect.spokes} times a ${360 / effect.spokes}° turn to each shot’s ordinary heading` : 'captures the first heading and adds counter × 360° / total Amount for later shots'}. It changes launch angles, not Amount, cooldown or the projectile’s later collision rules.${cite('r.ringAngle+e.counter*A/Math.max(1,t.amount)')}\n\n`;
    if (effect.kind === 'reshape') text += `Reshaping multiplies the existing behavior fields ${Object.entries(effect.fields).map(([k, v]) => `\`${k}\` ×${v}`).join(', ')}; it does not multiply every Area-sensitive dimension.${cite('n.push([r,a*i])')}\n\n`;
    if (effect.kind === 'fields') text += `This adds a missing behavior field rather than multiplying an existing explosion radius.${cite('e.kind===`lob`?{...e,explodeRadius:t.explodeRadius}:e')}\n\n`;
  }
  if (def.scale) text += `Other rune scales: ${Object.entries(def.scale).map(([k, v]) => `**${k} ×${v}**`).join(', ')}. These apply to the computed weapon values before focus/salvo/beat conversion. They are not a measured DPS ratio.${cite('t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area')}\n\n`;
  text += `Controlled checks on \`${build.main}\`, Standard/Normal, seeds \`s1/s2/s3\`: \`node ${script} ${build.main}\` retained **six supplied-state groups for this rune**, with Amount bonus 0 and 3. The original choice handler applies the rune to a supplied **level-one** base weapon, deliberately bypassing natural max-level acquisition. Original stat, targeting and attack-tick/dispatch consumers emit six complete volleys, including third/sixth-beat controls, actual cooldown starts and within-volley spacing. The asymmetric target control uses maximum HP 100/300 versus current HP 100/1, range exclusion and equal-max-HP distance ties where applicable. Emission fixtures stop before projectile movement/collision: no measured freeze, wall bounce, landing/explosion hit, natural run, evolved/union equivalence, survival/DPS, private server or device claim. No reward writes; network forbidden.\n\n`;
  text += `Examples below are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Bonus is the supplied Amount bonus, replacing Tibo’s usual bonus for isolation. Shots counts the full volley; damage is per projectile on volleys 1 / 3; radius is the ordinary projectile body; gap is start-to-start seconds.\n\n| Bonus | Shots | Damage 1 / 3 | Radius | Gap (s) |\n|---|---|---|---|---|\n`;
  for (const r of rows.filter((r) => r.seed === 's1')) {
    const a = r.volleys[0], b = r.volleys[2];
    text += `| ${r.amountBonus} | ${a.shots.length} | ${fmt(a.stats.damage)} / ${fmt(b.stats.damage)} | ${fmt(a.shots[0].radius)} | ${fmt((r.starts[1] - r.starts[0]) / 60)} |\n`;
  }
  outputs.set(`data/prose/runes/${id}.md`, text);
  const record = { file: script, command: `node ${script} ${build.main}`, main: build.main, definitionSha256: result.definitions[key],
    scriptSha256: result.scriptSha256, source: result.sources[1], sources: result.sources, scope: result.setup };
  evidence.scenarios[key] = [...(evidence.scenarios[key] ?? []).filter((e) => e.main !== build.main || e.file !== script), record];
}
assert.equal(Object.keys(result.definitions).length, outputs.size);
outputs.set('data/coverage-evidence.json', JSON.stringify(evidence, null, 2) + '\n');
if (process.argv.includes('--write')) mkdirSync('data/prose/runes', { recursive: true });
for (const [file, text] of outputs) {
  if (process.argv.includes('--write')) writeFileSync(file, text);
  else assert.equal(read(file), text, `Regenerate ${file}`);
}
console.log(`Checked 108 original-client groups; ${process.argv.includes('--write') ? 'wrote' : 'verified'} 18 rune walkthroughs with source/definition/script-bound evidence`);
