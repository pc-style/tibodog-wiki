## Overview

The Dumpster Raccoon is a tier-2 charger found only at the [Fry Palace Drive-Thru](/biomes/fry-palace) landmark, where it shares the tier-2 slot with the [Fry Fly](/enemies/fry-fly). Tier-2 pests trickle in from the first minute, peak around 5:00 and stop spawning at 12:00 on Normal (13:00 on Easy). Between 1:00 and 4:59 the minute's [elite](/bosses#elites) can be a raccoon if Tibo is at the drive-thru.

It walks towards Tibo at speed 34, the fastest of the tier-2 chargers, and lunges once Tibo is within 100 units. It has 24 base HP, 7 contact damage and mass 0.3 (30% less knockback). A kill gives 2 XP, and its 8% coin chance is the best of any tier-2 pest.

## How it works

The timings below are before 20:00. In Standard from 20:00, the windup is 0.6 s instead of 0.5 s; the dash and cooldown do not change. <small>[sim-NFTWJMcM.js: `return!Fn(e)||e.runClock<kn?t:Math.max(t,.6)`]</small>

Its charge works like every charger's. It stops for a 0.5 s windup aimed at Tibo's position when the windup starts, then dashes in a straight line at 170 for about 0.76 s (1.3 × its 100-unit `dashRange`, so about 130 units). After that it walks normally for 1.6 s before it can charge again. <small>[sim-NFTWJMcM.js: `i.state[t]=2,i.timer[t]=1.3*n/r,i.windup[t]=0`]</small> The dash deals ordinary contact damage, no more.

It uses the same charge numbers as the tier-3 [Bog Toad](/enemies/bog-toad), with about half its HP and a little over half its damage.

## Tips

- Sidestep during the windup. The dash cannot turn, and it ends at least 30 units past Tibo's old position.
- At the drive-thru the raccoons come mixed with fast Fry Flies (speed 54). Dodging a charge can steer Tibo into the flies, so leave yourself room on the side you step to.
