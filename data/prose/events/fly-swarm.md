## Overview

Fry Fly Swarm is the most frequent scheduled event. The [wave table](/bosses) fires it at 2:00, 5:00, 8:00, 11:00, 15:00, 18:00 and 20:00, and after 20:00 it alternates with [Ring of Hay Bales](/events/bale-ring), taking every even minute. At 8:00 and 15:00 it arrives together with [Harvest Moon](/events/harvest-moon).

After the announcement, 26 [Fry Fly Swarm](/enemies/swarm-fly) pests enter from beyond the edge of the view and fly straight across. They are fragile (10 base HP) but fast (speed 100). Each one deals 5 contact damage and gives 1 XP, with a 2% gold chance. Every fly disappears 14 seconds after it spawns. Don't confuse them with the ordinary [Fry Fly](/enemies/fry-fly) of [Fry-Oil Desert](/biomes/fry-oil-desert).

## How it works

- **Geometry.** The game picks a random direction. The flies spawn at the normal spawn distance on the opposite side, in a block 240 units wide (120 to each side of Tibo's position) and up to 60 units deep, and all fly the same way.
- **No homing.** Each fly keeps flying in a straight line at its own speed and never turns towards Tibo. <small>[sim-CDZ7ikGI.js: ``case`swarm`:a.vx[n]=a.tx[n]*a.speed[n],a.vy[n]=a.ty[n]*a.speed[n]``]</small>
- **Count.** 26 × the enemy-count multiplier, capped at 2×. That multiplier stays 1 until overtime (after 20:00, or 21:00 on Easy; see [Enemy scaling](/enemy-scaling)). The multiplier is 1.5 one minute into overtime and reaches the 2× cap a minute later. <small>[sim-CDZ7ikGI.js: `function wa(e,t){return Math.max(0,(t-e.win.timeSec-e.level.overtimeHoldSec)/60)}`]</small> After 20:00 the swarm only comes on even minutes, so on Normal, Hard and Nightmare it goes straight from 26 at 20:00 to 52 at 22:00. Only Easy, whose overtime starts a minute later, gets a 39-fly swarm, at 22:00, then 52 from 24:00. <small>[sim-CDZ7ikGI.js: `f=Math.round(n.count*Math.min(2,Ta(e.scale,e.cfg,e.runClock).count))`]</small>
- **Despawn.** A fly is removed 14 seconds after it spawns, or as soon as it is about 460 units from Tibo, and drops nothing. <small>[sim-CDZ7ikGI.js: `i.tx[f]=l,i.ty[f]=u,i.despawnAt[f]=e.time+14`]</small>
- **Full field.** The event is skipped (with no announcement) if the enemy pool is at its cap of 550. If the cap is reached partway through, fewer flies spawn.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, `--god`, seed `wiki`; the clock warped to 1 s before each minute, with all pests removed every tick so the 550 cap could not cut a swarm short): the swarm fired at 2:00, 5:00, 8:00, 11:00, 15:00, 18:00, 20:00, 22:00 and 24:00. It had 26 flies every time before overtime, on all four difficulties. On Normal the 22:00 and 24:00 swarms had 52; on Easy they had 39 and 52. One run counted 25 at 8:00 because one fly was removed on the tick it spawned. Without the per-tick clearing, a stationary Tibo's field reached the 550 cap and the Normal 22:00 swarm stopped at 49.

## Tips

- The flies don't steer, so moving sideways to their path gets Tibo out of the band. At base speed, Tibo covers the 120 units to the edge of the band in about 2 seconds.
- With 10 base HP, the flies die quickly to area weapons. Standing your ground also works if your build already clears crowds.
