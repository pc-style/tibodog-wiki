## Overview

The Bowling Ball is the only tier-2 pest of [Gutterball Lanes](/biomes/gutterball-lanes), so every tier-2 spawn in that landmark is a bowling ball. Tier-2 pests appear from the first minute at low odds, peak around 5:00 and stop spawning at 12:00 on Normal (13:00 on Easy). Between 1:00 and 4:59, the minute's [elite](/bosses#elites) can be a Bowling Ball if Tibo is in the lanes. Bowling balls are also the pests of [Strike](/events/strike), the lanes' landmark event (“Strike! Bowling balls roll in from every side!”).

It is a charger. It rolls towards Tibo at speed 26, the slowest of any charger, then winds up and dashes at 210 once Tibo is within 120 units. It has 28 base HP and 8 contact damage, and with mass 0.6 it shrugs off 60% of knockback. A kill gives 2 XP and a 6% chance of a coin.

## How it works

The charge follows the same cycle as every charger: a 0.5 s windup standing still and aimed at Tibo's position at that moment, then a straight dash of 1.3 × `dashRange`, here about 156 units in 0.74 s, then 1.6 s of normal movement before it can charge again. <small>[sim-HQr6OS1G.js: `i.state[t]=2,i.timer[t]=1.3*n/r,i.windup[t]=0`]</small> The dash only deals ordinary contact damage.

**Strike** spawns a ring of balls 200 units around Tibo. The number is 10 × the level's `wallPests` multiplier: 2 on Easy, 3 on Normal and Hard, 6 on Nightmare (see [Modes](/modes)). Their speed is reset to the base 26, so overtime speed scaling does not apply to them, and any still alive after 16 s vanish without drops. <small>[sim-HQr6OS1G.js: `r.speed[l]=w.enemyAt(n).speed,r.tx[l]=i,r.ty[l]=a,r.despawnAt[l]=e.time+t.life`]</small> Although Strike uses the same “wall” spawner as the [Ring of Hay Bales](/events/bale-ring), the balls do not roll to the ring's centre; they chase and charge Tibo like any other Bowling Ball.

## Tips

- A charge runs 156 units and starts within 120, so it ends at least 36 units past where Tibo stood. A sideways step during the windup leaves the ball rolling away with its charge on cooldown.
- Heavy mass makes knockback weapons poor at keeping balls away. Damage is a better answer.
- During Strike the balls come from all sides at once. Since the walking speed is only 26, moving steadily in one direction tends to string them out behind Tibo, so their charges come one after another rather than together.
