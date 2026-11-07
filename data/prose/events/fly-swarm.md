## Overview

Fry Fly Swarm is the most frequent scheduled event. The [wave table](/bosses) fires it at 2:00, 5:00, 8:00, 11:00, 15:00, 18:00 and 20:00, and after 20:00 it alternates with [Ring of Hay Bales](/events/bale-ring), taking every even minute. At 8:00 and 15:00 it arrives together with [Harvest Moon](/events/harvest-moon).

After the announcement, 26 [Fry Fly Swarm](/enemies/swarm-fly) pests enter from beyond the edge of the view and fly straight across. They are fragile (10 base HP) but fast (speed 100). Each one deals 5 contact damage and gives 1 XP, with a 2% gold chance. Every fly disappears 14 seconds after it spawns. Don't confuse them with the ordinary [Fry Fly](/enemies/fry-fly) of [Fry-Oil Desert](/biomes/fry-oil-desert).

## How it works

- **Geometry.** The game picks a random direction. The flies spawn at the normal spawn distance on the opposite side, in a block 240 units wide (120 to each side of Tibo's position) and up to 60 units deep, and all fly the same way.
- **No homing.** Each fly keeps flying in a straight line at its own speed and never turns towards Tibo. <small>[sim-DnXbkcN3.js: ``case`swarm`:i.vx[t]=i.tx[t]*i.speed[t],i.vy[t]=i.ty[t]*i.speed[t]``]</small>
- **Count.** 26 × the enemy-count multiplier, capped at 2×. With Standard's active late-game scaling, the count multiplier stays 1, so the requested swarm size stays 26 after 20:00 too. Endgame encounters can affect the available enemy pool; this is not a guarantee that all 26 remain alive. <small>[sim-DnXbkcN3.js: `f=Math.round(t.count*Math.min(2,Dc(e.scale,e.cfg,e.runClock).count))`]</small> <small>[sim-DnXbkcN3.js: `e.speed=Math.min(i.maxSpeedMult,1),e.count=1,e.rate=1`]</small>
- **Despawn.** A fly is removed 14 seconds after it spawns, or as soon as it is about 460 units from Tibo, and drops nothing. <small>[sim-DnXbkcN3.js: `r.tx[f]=l,r.ty[f]=u,r.despawnAt[f]=e.time+14`]</small>
- **Full field.** The event is skipped (with no announcement) if spawn capacity is full. Before 20:00 the enemy hard cap is 550 on Easy/Normal, 700 on Hard and 850 on Nightmare; Standard late-game runs then count pests and bosses together against 500/650/800. If capacity runs out partway through, fewer flies spawn. See [crowd limits](/modes#late-crowds).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, `--god`, seed `wiki`; the clock warped to 1 s before each minute, with all pests removed every tick so the 550 cap could not cut a swarm short): the swarm fired at 2:00, 5:00, 8:00, 11:00, 15:00, 18:00, 20:00, 22:00 and 24:00. It had 26 flies every time before overtime, on all four difficulties. On Normal the 22:00 and 24:00 swarms had 52; on Easy they had 39 and 52. One run counted 25 at 8:00 because one fly was removed on the tick it spawned. Without the per-tick clearing, a stationary Tibo's field reached the 550 cap and the Normal 22:00 swarm stopped at 49.

## Tips

- **Move sideways out of the band.** The flies don't steer, so moving sideways to their path gets Tibo out of the band. At base speed, Tibo covers the 120 units to the edge of the band in about 2 seconds.
- With 10 base HP, the flies die quickly to area weapons. Standing your ground also works if your build already clears crowds.
