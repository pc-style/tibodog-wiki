## Overview

Bonfire Spud is the evolved form of [Coal-Baked Spud](/items/coal-baked-spud). Hold Coal-Baked Spud with [Hot Sauce](/passives/hot-sauce) at level 5, and the next [chest](/chests) you open turns every Coal-Baked Spud copy into the same number of Bonfire Spud copies.

When one of Tibo's weapons hits, there is a 25% chance to ignite the target and every enemy within 40 units of it. The radius grows with the square root of your area multiplier. Each burning enemy takes 60% of the triggering hit's damage per second for 4 seconds, and the duration is multiplied by Tibo's duration stat (×1.25 with no bonuses). The spread draws a shockwave around the target.

## How it works

- Compared with Coal-Baked Spud, each fire is a little weaker (60% instead of 80% of the hit per second) but lasts longer, procs more often and spreads to a whole group. <small>[sim-DOWGQeHt.js: `` case`burn`:{if(Fl(r,i,a*n.share,n.seconds*e.loadout.stats.durationMult,t.src),n.spread===void 0)return; ``]</small>
- Burn rules are the same as for Coal-Baked Spud: an enemy keeps only its strongest burn and longest timer, and the 0.5 s burn ticks can crit.
- Only weapon hits trigger it, not burn ticks or other item effects, so fires do not chain into more fires.
- Copies stack: with *N* copies the chance is `1 − 0.75^N`, limited to 20 × *N* procs per second.
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added directly with `giveItem`, skipping the evolution; Peeler, Small Fry, Tot Toss, Chip Shuriken, Starch Chain and Seeker Sprouts each given 5 times with `give`; `warp(240)`; HP refilled every tick; Tibo walking a slow circle; later level-ups taking the first offer; 180 s on seeds `s1`–`s5`): 25.2% of 21,033 rolls ignited with one copy (expected 25%), and 57.3% of 19,201 with three (expected 57.8%). The 20-per-second limit was not reached: even with the chance set to 100% in the scenario, these weapons and a second set (Steam Vent, Whisk Vortex, Sprout Satellites, Gravy Boat, Salt Line, Butter Streak) gave only 15–18 procs per second. For a measurement of burns not stacking, see [Coal-Baked Spud](/items/coal-baked-spud#how-it-works).

## Tips

- **Hot Sauce crits keep growing the fires.** Hot Sauce stays in your build after the evolution. Its crit chance keeps making the igniting hits, and so the fires, bigger.
- Weapons that hit dense groups make the most of the spread, because a single proc can light a whole crowd.
