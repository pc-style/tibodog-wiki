## Overview

The Grease Fiend is a tier-5 pest, the top tier, and the late-game threat of the hot biomes: [Chip Canyons](/biomes/chip-canyons), [Fry-Oil Desert](/biomes/fry-oil-desert), the [Fry Palace Drive-Thru](/biomes/fry-palace) and [Ketchup Bog](/biomes/ketchup-bog). In each it is the only tier-5 pest; every other biome uses the [Mud Golem](/enemies/mud-golem) instead. On Normal, tier-5 pests start spawning at 16:00 (17:00 on Easy), make up most spawns from 19:00, and from 21:00 they are the only tier left. In these four biomes, overtime is therefore a stream of Grease Fiends. From 15:00 the minute's [elite](/bosses#elites) can be a Grease Fiend too.

It is a charger and the deadliest one. It has 200 base HP and 22 contact damage, which ties the Mud Golem for the highest of any regular pest. It walks at 40 and launches from 130 units away with a dash speed of 220, the longest and fastest charge of any pest. It is also large (radius 9), and its mass of 0.5 halves knockback. A kill gives 12 XP and an 18% chance of a coin.

## How it works

The timings below are before 20:00. In Standard from 20:00, the windup is 0.6 s instead of 0.5 s; the dash and cooldown do not change. <small>[sim-dQVU-VqL.js: `return!Wr(e)||e.runClock<Rr?t:Math.max(t,.6)`]</small>

It uses the standard charger cycle. First comes a 0.5 s windup aimed at Tibo's position when the windup starts. Then it dashes in a straight line at 220 for 1.3 × 130 / 220 ≈ 0.77 s, about 169 units. After that it has 1.6 s of normal walking before it can charge again. <small>[sim-dQVU-VqL.js: `i.state[t]=2,i.timer[t]=1.3*n/r,i.windup[t]=0`]</small> The dash deals ordinary contact damage, but at 22 base and with late-game [enemy scaling](/enemy-scaling) applied, that is a heavy hit.

Compared with the Mud Golem it replaces, the fiend has less HP (200 against 260) but is much faster (40 against 28) and charges.

## Tips

- **Sidestep early and fully.** Its body is large: the dash connects if its path passes within 14 units of Tibo's centre (radius 9 + Tibo's 6, less 1). Sidestep early and fully during the windup rather than at the last moment.
- Several fiends charging from different sides is the main danger in overtime here. Keep moving so that they come from one direction rather than surrounding Tibo.
- A dash starts within 130 units and runs about 169, so a fiend that misses ends up at least 39 units past Tibo. Use the 1.6 s cooldown to hit it.
