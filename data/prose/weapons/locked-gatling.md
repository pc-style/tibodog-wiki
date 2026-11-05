## Overview

Locked Gatling fires tots in bursts. At the start of each 2 s burst it takes the angle to the nearest pest and then fires every tot of the burst at that same angle, even if Tibo moves or the pest dies. Between bursts there is a 0.35 s pause.

At level 1 it fires every 0.14 s during a burst, about 14 shots per burst. Each shot is two tots side by side: the weapon's amount of 1 plus Tibo's base +1 amount (see [Stats](/stats)). Each tot deals 6 damage, flies at 220 units/s for 1.2 s (about 264 units) and has pierce 1, so it can hit two pests. Levelling raises damage to 12, shortens the fire interval to 0.10 s and raises pierce to 2. It is a base weapon offered on level-up. At max level, with [Masher Grip](/passives/masher-grip) owned, a chest evolves it into [Tater Minigun](/weapons/tater-minigun) (see [Evolutions](/evolutions)).

## How it works

- **Locking on.** A burst starts only if a pest is within 220 units. If none is, the gatling checks again every 0.1 s. When it locks, it stores the angle from Tibo to that pest and starts a 2 s burst. The first tot fires immediately. <small>[sim-HQr6OS1G.js: `a.angle=k(a.lockY-r,a.lockX-n),a.lockAt=e.tick,a.left=l(t.burstSec)`]</small>
- **During the burst.** Tots fire at the weapon's cooldown from Tibo's current position, along the locked angle with up to ±0.03 rad of random spread. Moving Tibo moves the line of fire sideways but does not change its angle.
- **Lanes.** Each point of amount fires one more tot per shot, so two lanes with no amount bonuses. The tots fly side by side in parallel lanes 7 units apart instead of fanning out. <small>[sim-HQr6OS1G.js: `c=(i-.5*(r.amount-1))*n.lane`]</small>
- The tots look like [Tot Toss](/weapons/tot-toss) shots. Their damage, speed and pierce come from this weapon.

## Tips

- The lock is taken once per burst. If Tibo walks past the target or the crowd shifts, the rest of the burst keeps going the original way. Strafing sideways across the locked angle sweeps the stream over a wide line of pests.
- Cooldown bonuses shorten the time between tots within a burst. They do not change the 2 s burst length or the 0.35 s pause.
