## Overview

Small Fry is a single fry shot that gets stronger with each kill it makes, for the rest of the run. Every 0.5 s it fires 2 fries (its raw amount of 1 plus Tibo's base +1 amount, see [Stats](/stats)) at the nearest pest. At level 1 a fry deals only 5 raw damage and stops at the first pest it hits. Each kill credited to this weapon adds 0.05 raw damage, up to +12 after 240 kills.

It is only offered on level-up cards and is not in the starting-weapon pool. Levelling it mostly adds fries: 5 per volley at level 8 (raw amount 4 plus 1, 0.08 s apart), with 8 raw damage before kill bonuses and 1 pierce. With [Fertilizer](/passives/fertilizer) owned, a [chest](/chests) evolves a level 8 Small Fry into [Big Fry](/weapons/big-fry). The evolution keeps the kill count.

## How it works

- **Kill bonus.** The bonus is `min(12, 0.05 × kills)`. It is added to the fry's raw damage before Tibo's damage multiplier, so [might](/stats) multiplies it too. <small>[sim-Cn6iREtF.js: `function ww(e,t){return Math.min(e.cap,t*e.perKill)}function Tw(e,t){return!0===e.size?Math.min(3,1+t/600):1}`]</small> A fully grown level 8 Small Fry deals 20 raw damage per fry.
- **Which kills count.** A kill counts for the weapon that dealt the killing blow. Damage from other weapons does not add to the count. <small>[sim-Cn6iREtF.js: `for(let e=0;e<r.length;e++)r[e].src===t&&r[e].kills++`]</small>
- **Aim.** Each fry targets the nearest pest within 224 units: 70% of the larger side of the 320 × 320 play area. With no pest that close, the weapon holds its shot. <small>[sim-Cn6iREtF.js: `function mT(e){return .7*Math.max(e.field.width,e.field.height)}`]</small> Later fries in a volley get a little random spread: up to ±0.08 radians times the fry's position in the volley.
- **Size.** Small Fry's hit size does not change. Only Big Fry grows with kills.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it fired 2 fries every 0.5 s, each spawned with a 1.875 s lifetime, and only the nearest pest was hit; at level 8 it fired 5 per volley and the 2 nearest pests took the hits (pierce 1). All three seeds gave the same figures.

## Tips

- **Pick it up early.** The bonus depends on kills, not on time held, so picking it up early gives it more of the run to reach the 240-kill cap.
- Early on its hits are weak, so many of its kills will be finishing blows on pests other weapons have already damaged. Those count in full, because only the killing blow matters.
