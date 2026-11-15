// Reproducible, reviewed templates for shared consumers with per-entity parameters.
// Requires fresh successful probe exports. --write updates prose and evidence; otherwise checks.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const read = (p) => readFileSync(p, 'utf8');
const hash = (s) => createHash('sha256').update(s).digest('hex');
const build = JSON.parse(read('data/build.json'));
assert.equal(build.main, 'main-DwGb2BE_.js', 'templates require a consumer review on a new build');
const registry = JSON.parse(read('data/registry.json'));
const write = process.argv.includes('--write');
const inputs = process.argv.slice(2).filter((s) => s !== '--write');
assert.equal(inputs.length, 2, 'pass mechanics and endgame probe JSON results');
const outputs = new Map();
const assets = join('.cache', build.main.replace('.js', ''), 'assets');
const cite = (file, quote) => {
  assert.ok(read(join(assets, file)).includes(quote), `missing source quote: ${file}: ${quote}`);
  return ` <small>[${file}: \`\` ${quote} \`\`]</small>`;
};
const sim = (q) => cite('sim-QJ0yqR8B.js', q);
const end = (q) => cite('endgame-sim-CefNBFg5.js', q);
const shell = (q) => cite('shell-DIs0xeJm.js', q);
const court = (q) => cite('court-CdeOBUZA.js', q);
const controls = 'Controlled checks on `main-DwGb2BE_.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-endgame-roles.mjs` used original phase constructors, spawners and consumers with supplied roles, clocks, positions and HP. These are client-rule checks, not a naturally reached encounter, survival advice, Nightmare timing or server verification.';
const groups = { weapon: 'allWeapons', item: 'allItems', biome: 'biomes', event: 'events', enemy: 'enemies' };
const evidence = JSON.parse(read('data/coverage-evidence.json'));
const records = new Map();
for (const [index, input] of inputs.entries()) {
  const result = JSON.parse(read(input));
  const file = index === 0 ? 'tools/probe-mechanics-groups.mjs' : 'tools/probe-endgame-roles.mjs';
  assert.equal(result.main, build.main);
  assert.equal(result.scriptSha256, hash(read(file)), 'results must match retained script');
  assert.equal(result.cases, result.rows.length);
  const sources = result.sources ?? [result.source];
  for (const s of sources) assert.equal(hash(readFileSync(join(assets, new URL(s.url).pathname.split('/').pop()))), s.sha256);
  for (const key of new Set(result.rows.flatMap((r) => r.keys))) {
    const rows = result.rows.filter((r) => r.keys.includes(key));
    assert.deepEqual([...new Set(rows.map((r) => r.seed))].sort(), ['s1', 's2', 's3']);
    const [kind, id] = key.split(':');
    const def = registry[groups[kind]].find((e) => e.id === id); assert.ok(def, key);
    const entry = { file, command: `node ${file} ${build.main}`, main: build.main,
      definitionSha256: hash(JSON.stringify(def)), scriptSha256: result.scriptSha256,
      source: sources[0], sources, scope: `${result.setup} Checks for this entity: ${JSON.stringify(rows[0].checks)}` };
    const old = (evidence.scenarios[key] ?? []).filter((e) => e.main !== build.main || e.file !== file);
    evidence.scenarios[key] = [...old, entry];
    records.set(key, [...(records.get(key) ?? []), entry]);
  }
}
for (const b of registry.biomes.filter((b) => ['russet-moor', 'vinegar-shoals', 'duchess-gardens', 'roast-caldera'].includes(b.id))) {
  const h = b.hazard, slow = h.kind === 'slow';
  const effect = slow
    ? `Inside its ${h.shape} patches, Tibo's walking-speed factor becomes **${1 - h.strength}** (${Math.round(100 * h.strength)}% slower). This does not damage Tibo. Overlapping slows use the strongest reduction, not multiplication.`
    : `Its ${h.shape} patches apply **${h.strength} raw damage per second while Tibo's centre is inside**, before damage reduction. This is continuous terrain damage, not a single ${h.strength}-damage hit on entry or a weapon burn status. Overlapping damaging patches each call the damage consumer.`;
  const text = `## How it works\n\nThis is the terrain of the [${b.placement.phase.replace('endgame', '')} endgame phase](/endgame), not a climate biome to search for before 15:00. New chunks use the current phase's ground; previously explored chunks retain their terrain.\n\n${effect}${sim('r.kind===`slow`||r.kind===`chill`?y=Math.min(y,1-r.strength):Md(e,r.strength*t,dk[r.kind],!0,ne)')}\n\nThe hazard check uses **Tibo's centre**, not his body radius. It follows the patch's actual shape and rotation. Dash travel is added separately from slowed walking; a damaging patch can still hurt during a dash because terrain uses the continuous-damage path rather than ordinary dash-shielded contact. Homefield Boots replace the normal player-hazard list with an empty list and apply their separate pest-hazard rule; this is not universal immunity without that power.${sim('yo(r.poolShape,r.turn,ee-r.x,v-r.y,r.radius,0)')}${sim('te=!0===e.update2?.boots?E_:e.world.activeHazards')}\n\nAt base settings a chunk rolls ${h.perChunk - 1}–${h.perChunk} candidate patches, each radius ${h.radius} × a random 0.8–1.3 factor, dropping candidates outside this biome. Difficulty and active condition rules can alter hazard size, density or add drifting patches; the candidate count is not a guaranteed visible count.${sim('a=e.rng.int(Math.max(0,t.perChunk-1),t.perChunk)')}\n\nControlled checks on \`main-DwGb2BE_.js\`, Standard/Normal, seeds \`s1/s2/s3\`: \`node tools/probe-mechanics-groups.mjs\` called the original movement system with supplied circular patches to isolate centre-inside/outside behavior${slow ? ', no damage and strongest-slow selection' : ` and ${h.strength}/60 damage in one tick at zero armor`}. Natural ${h.shape} generation, device rendering, Homefield Boots and survival were not measured by these fixtures.\n`;
  outputs.set(`data/prose/biomes/${b.id}.md`, text);
}
const crowd = ['sea-serpent', 'jelly-wraith', 'dune-manticore', 'basilisk'];
const helpers = {
  'siren-harpy': ['banner', 'Moves as a helper and raises **other nearby Court members’ movement velocity to ×1.5** within 82 units. It does not boost itself; overlapping banners do not multiply the same member again in that tick. Killing the banner removes this moving aura.', 'bannerRadius:82,bannerSpeedMult:1.5'],
  'barnacle-troll': ['mender', 'Heals **other Court members within 76 units by 4% of their max HP per second**, capped at their max HP. It does not heal itself. Killing it drops a heal worth 25% of Tibo’s max HP, rather than directly awarding that health remotely.', 'menderRadius:76,menderHealPerSec:.04,menderDropHealShare:.25'],
  'coral-golem': ['brood', 'Spawns up to **two Court crowd pests every 5.6 seconds**, only while the phase can spawn and there is room below the 40-member Court cap. That count includes registered helpers and attendants, not just crowd pests. It checks the cap before spawning and limits its children to the remaining room. This is not an on-death split.', 'broodEverySec:e(7,1200),broodCount:2'],
  'mangrove-treant': ['shell', 'Gives **other Court members within 80 units a ×0.35 incoming-damage multiplier**. This protection is recomputed each tick; leaving the aura or killing its helper removes it. It does not shield itself and is not the Shell phase’s separate ×0.1 armour.', 'shellRadius:80,shellDamageMult:.35'],
};
const attendants = ['queen-herald', 'queen-seer', 'queen-warden'];
for (const d of registry.enemies.filter((d) => crowd.includes(d.id) || helpers[d.id] || attendants.includes(d.id))) {
  let detail, tests;
  if (crowd.includes(d.id)) {
    detail = `This is a **Court crowd member**, not its armoured Shell namesake. It walks toward Tibo and can route around Court maze walls; its catalog \`chase\` behavior adds no separate projectile, windup or charge. Court spawning replaces its catalog speed with **36**, base HP with **7200 × the spawn HP scale**, and XP with 18. Its body/contact damage still passes through the ordinary enemy systems.${end('c=A.crowdHp,l=A.crowdSpeed,u=A.crowdXp')}${court('crowdHp:7200,helperHp:18e3,attendantHp:12e3,crowdSpeed:36')}\n\nNearby banner, mender and shell helpers can speed it up, heal it or protect it. Those are roles of the nearby helper, not extra innate attacks for this species. Separating it from helpers removes their range-limited support; see [Court](/endgame#court).`;
    tests = 'The fixture checked original crowd spawning and the 36-speed override for this species; helper range interactions are checked separately. Maze navigation and natural crowd encounters are not measured.';
  } else if (helpers[d.id]) {
    const [role, explanation, quote] = helpers[d.id];
    detail = `This is the Court’s **${role} helper**. ${explanation}${court(quote)}\n\nIt still walks toward Tibo through the ordinary chase/maze movement path. The helper role replaces catalog stats with speed **30**, base HP **18000 × the spawn HP scale** and XP 60. Its advantage is the support rule above, not a separate ranged attack. Aura checks use centre-to-centre distance, include equality, and only apply to registered Court members.${end('c=A.helperHp,l=A.helperSpeed,u=A.helperXp')}${end('return a*a+o*o<=r*r')}`;
    tests = d.id === 'coral-golem' ? 'The fixture checked original helper spawning, speed override, both sides of its brood timer, exactly two children without repeated same-tick spawning, one remaining place and saturation at 40 registered members.' : 'The fixture checked original helper spawning, speed override and nearby versus outside-range support. Mender pickup collection and overlapping-helper combinations are source-audited, not measured here.';
  } else {
    const index = attendants.indexOf(d.id);
    detail = `This is **attendant ${index + 1} of the Queen**, not a standalone scheduled boss. The three attendants use the same protection role; their names do not confer banner, mender or shell-helper auras. Each spawns 48 units from the Queen at its own third of the circle, then uses the ordinary chase/maze movement path. Court spawning gives speed **34**, base HP **12000 × the spawn HP scale** and XP 120, so the catalog HP of 1 is not its encounter HP.${end('let i=n/3*v')}${court('attendantOrbitRadius:48')}${end('c=A.attendantHp,l=A.attendantSpeed,u=A.attendantXp')}\n\n**Any surviving attendant protects the Queen.** Killing only this one is not enough if either other attendant remains. Once all three are gone, the Queen is vulnerable. A defeated attendant schedules a return after 18.75 s; a warning is placed near the Queen before it reappears. This is a window to attack the Queen, not permanent removal.${end('for(let t=0;t<3;t++)if(la(e,n,t))return n.stats.queenBlocks++,!0;return!1')}${court('attendantReturnSec:e(1,48)')}`;
    tests = 'The fixture checked attendant spawning, speed override, real Queen protection with attendants alive versus all gone, and 18.75-second return scheduling. Warning placement and return animation were not exercised.';
  }
  outputs.set(`data/prose/enemies/${d.id}.md`, `## How it works\n\n${detail}\n\n${controls} ${tests}\n`);
}
for (const d of registry.enemies.filter((d) => d.id.startsWith('armoured-'))) {
  const b = d.behavior;
  outputs.set(`data/prose/enemies/${d.id}.md`, `## How it works\n\nThis is a **Shell beast**, not the Court version of this species. It chases until Tibo is strictly inside **${b.dashRange} units** and its attack timer is ready. It then stops for a 0.5-second Normal windup, locks the direction toward Tibo, and charges at **${b.dashSpeed} units/s** for about **${(1.3 * b.dashRange / b.dashSpeed).toFixed(3)} s**. Moving sideways after the lock does not turn the charge. The nominal charge travel is 1.3 times the trigger range (${1.3 * b.dashRange} units); it is not the trigger range itself. After charging, it returns to chasing with a 1.6-second attack retry timer.${sim('if(s>=n||o>0)return;')}${sim('i.timer[t]=1.3*n/r')}${sim('i.state[t]=0,i.timer[t]=1.6')}\n\nWhile registered and protected in Shell, it takes **10% of ordinary incoming damage**. The attack-state transition from charging back to chasing opens a **1.2-second full-damage window**, then armour returns; exactly at the closing deadline it is protected again. This is not permanent damage resistance attached to any enemy with the same catalog definition.${shell('protectedDamage:.1,beastOpeningSec:1.2')}${end('a===2&&o===0&&(t.openUntil[i]=e.runClock+Pt(e).beastOpeningSec,t.stats.openings++)')}\n\nControlled checks on \`main-DwGb2BE_.js\`, Standard/Normal, seeds \`s1/s2/s3\`: \`node tools/probe-mechanics-groups.mjs\` tested this species' strict range boundary, windup, charge duration, moved-player locked-aim control and recovery. \`node tools/probe-endgame-roles.mjs\` checked protected/open damage factors, the attack-end transition and both sides of armour expiry. These are supplied original-client fixtures, not naturally reached Shell fights, Nightmare timings, DPS or survival comparisons. Phase spawning can replace catalog HP; use [Shell](/endgame#shell), not the raw HP alone.\n`);
}
outputs.set('data/prose/enemies/fuse-totem.md', `## How it works\n\nFuse Totem is a stationary Shell hazard. Its phase spawner starts a **six-second fuse** and sets speed to zero; the catalog \`tank\` behavior is not a walking attack. At the fuse deadline it explodes once, then removes itself. Destroying the registered totem before that deadline cancels the explosion; a reused pool slot does not inherit its fuse.${cite('shell-CHXbzErl.js', 'n.fuseUntil[t]=e.runClock+X(e).fuseSec,r.speed[t]=0')}\n\nThe blast checks Tibo’s **centre within radius 180, including equality**, not his body radius. It attempts the totem’s scaled damage through the normal hit resolver, so avoidance and dash shielding still matter; this is not guaranteed damage or an unavoidable server effect. The warning begins before detonation, not at spawn.${shell('fuseSec:6,blastLeadSec:.8,blastRadius:180')}${cite('titan.hot-CjjRSbsl.js', 'a*a+s*s<=T.blastRadius*T.blastRadius')}\n\n${controls} The fixture checked original totem spawning, zero speed, no early blast, detonation at the six-second boundary and destroyed-totem cancellation. Blast damage, warning rendering and natural-run survival were not measured.\n`);
outputs.set('data/coverage-evidence.json', JSON.stringify(evidence, null, 2) + '\n');
for (const [file, text] of outputs) {
  if (write) writeFileSync(file, text);
  else assert.equal(existsSync(file) ? read(file) : null, text, `regenerate ${file}`);
}
console.log(`${write ? 'Wrote' : 'Checked'} ${outputs.size - 1} phase explanations; registered ${records.size} distinct entities without changing coverage classification`);
