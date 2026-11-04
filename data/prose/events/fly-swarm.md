## Overview

Fry Fly Swarm is the most frequent scheduled event. The [wave table](/bosses) fires it at 2:00, 5:00, 8:00, 11:00, 15:00, 18:00 and 20:00, and after 20:00 it alternates with [Ring of Hay Bales](/events/bale-ring), taking every even minute. At 8:00 and 15:00 it arrives together with [Harvest Moon](/events/harvest-moon).

After the announcement, 26 [Fry Fly Swarm](/enemies/swarm-fly) pests enter from beyond the edge of the view and fly straight across. They are fragile (10 base HP) but fast (speed 100). Each one deals 5 contact damage and gives 1 XP, with a 2% gold chance. Every fly disappears 14 seconds after it spawns. Don't confuse them with the ordinary [Fry Fly](/enemies/fry-fly) of [Fry-Oil Desert](/biomes/fry-oil-desert).

## How it works

- **Geometry.** The game picks a random direction. The flies spawn at the normal spawn distance on the opposite side, in a block 240 units wide (120 to each side of Tibo's position) and up to 60 units deep, and all fly the same way.
- **No homing.** Each fly keeps flying in a straight line at its own speed and never turns towards Tibo. <small>[sim-CrpXuTSY.js: ``case`swarm`:i.vx[t]=i.tx[t]*i.speed[t],i.vy[t]=i.ty[t]*i.speed[t]``]</small>
- **Count.** 26 × the enemy-count multiplier, capped at 2×. That multiplier stays 1 until overtime (after 20:00, or 21:00 on Easy; see [Enemy scaling](/enemy-scaling)). The swarm is therefore 26 flies for most of a run, 39 in the first overtime minute and 52 after that. <small>[sim-CrpXuTSY.js: `f=Math.round(t.count*Math.min(2,ma(e.scale,e.cfg,e.runClock).count))`]</small>
- **Despawn.** A fly is removed 14 seconds after it spawns, or as soon as it is about 460 units from Tibo, and drops nothing. <small>[sim-CrpXuTSY.js: `r.tx[f]=l,r.ty[f]=u,r.despawnAt[f]=e.time+14`]</small>
- **Full field.** The event is skipped (with no announcement) if the enemy pool is at its cap of 550. If the cap is reached partway through, fewer flies spawn.

## Tips

- The flies don't steer, so moving sideways to their path gets Tibo out of the band. At base speed, Tibo covers the 120 units to the edge of the band in about 2 seconds.
- With 10 base HP, the flies die quickly to area weapons. Standing your ground also works if your build already clears crowds.
