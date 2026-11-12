## Overview

Glacier Spud is the evolved form of [Freezer Burn](/items/freezer-burn). Hold Freezer Burn with [Slow Cooker](/passives/slow-cooker) at level 5, and the next [chest](/chests) you open turns every Freezer Burn copy into the same number of Glacier Spud copies.

Glacier Spud no longer needs frozen enemies. Any kill has a 30% chance to shatter, dealing 40% of the dead enemy's max HP to every enemy within 48 units and freezing them for 1.5 s. A wider frost ring of 84 units then slows every enemy inside it to half speed for 2 s. Both radii grow with the square root of your area multiplier, and both durations are multiplied by Tibo's duration stat.

## How it works

- The frost ring deals no damage. It sets the enemy's slow factor to 0.5, which halves its movement speed. If [Panic Fry](/items/panic-fry) is active, the stronger slow wins; its 5% slow does not add to this one. <small>[sim-CnCw_hkt.js: `let u=t.slowT[a]>0?t.slowF[a]:0,d=1-(u>i?u:i)`]</small>
- Bosses are immune to the freeze, but the frost ring slows them too.
- Boss deaths also roll for a shatter, which deals 40% of the boss's max HP to everything nearby.
- Copies stack: with *N* copies the chance per kill is `1 − 0.7^N`, limited to 10 × *N* shatters per second.
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added directly with `giveItem`, skipping the evolution; Peeler, Small Fry, Tot Toss, Chip Shuriken, Starch Chain and Seeker Sprouts each given 5 times with `give`; `warp(240)`; HP refilled every tick; Tibo walking a slow circle; later level-ups taking the first offer). Over 180 s on seeds `s1`–`s5`, 29.7% of 16,145 kill rolls shattered with one copy (expected 30%), and 65.7% of 15,952 with three (expected 65.7%). With the chance set to 100% in the scenario (120 s, seeds `s1`–`s3`), one copy shattered 9.57–9.72 times per second.
- Shatter damage scales with enemy max HP rather than Tibo's damage stat. It still gets the elite/boss bonus and can crit.

## Tips

- **Max Slow Cooker for longer freezes.** With Slow Cooker maxed, the duration multiplier is 1.75 (1 + 0.5 + the base 0.25), so the freeze lasts about 2.6 s and the slow 3.5 s even with no other duration sources.
- Large groups of frozen and slowed enemies bunch up and are easy targets for area weapons. Glacier Spud is as much crowd control as damage.
