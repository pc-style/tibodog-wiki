## Overview

The Maggot (internal id `maggot-swarm`) is the minion of the [Compost Titan](/bosses/compost-titan) boss: “A heap of rotting leaves and mulch. Maggots pour out of it.” It does not appear in any biome's spawn table. It is a different enemy from the [Compost Maggot](/enemies/compost-maggot), the tier-1 pest of Compost Caves.

The Compost Titan arrives at 17:00 in the [wave schedule](/bosses#wave-schedule) and returns in the boss cycle of overtime. Its main attack summons 14 Maggots at a time. Each one walks straight at Tibo at speed 50, faster than most pests, with 30 HP and 10 contact damage. That is a lot for a pest worth only 1 XP, with a 2% chance to drop gold.

## How it works

The summon places 14 small warning circles in a ring 44 units around the Titan. After the attack's 1 s telegraph, each circle turns into a Maggot. <small>[sim-C59Bg0bk.js: `e.zones.spawnDef[l]=o`]</small> Maggots get the normal pest scaling for the current time (see [Enemy scaling](/enemy-scaling)).

Each Maggot despawns 40 s after it appears, and earlier if it ends up more than 460 units from Tibo. <small>[sim-C59Bg0bk.js: `e.enemies.despawnAt[o]=e.time+40`]</small> It has no behaviour beyond the plain chase. With mass 0 it takes full knockback.

## Tips

- **Treat maggots as obstacles.** Maggots pay almost nothing, so they are best treated as an obstacle rather than an XP source. Staying away from the Titan when the ring of circles appears keeps Tibo from being surrounded the moment they hatch.
- At speed 50 they are close to Tibo's 62, so they are hard to shake off, but they all expire 40 s after hatching.
