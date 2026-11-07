## Overview

Lunch Rush is the landmark event of the [Fry Palace Drive-Thru](/biomes/fry-palace). It fires the first time Tibo walks into a drive-thru (radius 420), once per drive-thru, and never in [Story mode](/story-mode). After the announcement, 24 [Gull Flock](/enemies/gull-flock) pests sweep across the screen in a straight band.

It is a swarm event, like the scheduled [Fry Fly Swarm](/events/fly-swarm), with slightly faster birds in a wider band. Each gull has 10 base HP, speed 105, 5 contact damage, 1 XP and a 2% gold chance, and disappears 14 seconds after it spawns. The gulls are separate from the drive-thru's resident [Parking Gull](/enemies/parking-gull).

## How it works

- **Geometry.** The gulls start beyond the edge of the view on one side, in a block 280 units wide (140 to each side of Tibo's position) and up to 60 deep. They fly in a fixed direction and never turn towards Tibo. <small>[sim-BKmk53sU.js: `let s=n.range(-t.width,t.width),c=n.range(0,60),d=Yc(e,o,i-l*(f+c)-u*s,a-u*(f+c)+l*s)`]</small>
- **Count.** 24 × the enemy-count multiplier, capped at 2×. Standard's active late-game curve keeps the count multiplier at 1, so it requests 24 gulls even after 20:00 (see [Enemy scaling](/enemy-scaling)). Newly explored endgame terrain is no longer a drive-thru, and a full pool can still cut the event short.
- **Trigger.** If spawn capacity is full, the drive-thru stays unused and the event tries again while Tibo is inside. Before 20:00 the enemy hard cap is 550 on Easy/Normal, 700 on Hard and 850 on Nightmare; Standard late-game runs then count pests and bosses together against 500/650/800. See [crowd limits](/modes#late-crowds).
- **Despawn.** Gulls are removed after 14 seconds or once they are about 460 units from Tibo, and drop nothing.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, `--god`, Tibo teleported into the first Fry Palace Drive-Thru found at about 1:03 with pests removed first): every run spawned 24 gulls, on all four difficulties. In 5 of 10 runs (seeds `wiki` and `s1` to `s4`, Normal and Nightmare) one of them was gone again after the spawn tick, leaving 23. The band reaches about √(448² + 140²) ≈ 469 units from Tibo at its far corners, past the 460-unit despawn distance, so a gull placed there is probably removed at once (inference). <small>[intro-shared-C0Wm1Dc1.js: `recycleDistance:460`]</small> With `--mode story`, entering the drive-thru fired no event.

## Tips

- **Move across the flight path.** Stepping sideways to the flight path clears the band. Tibo needs a little over 2 seconds at base speed to cover the 140 units to its edge.
- The drive-thru has burning pools on the ground (see [Fry Palace Drive-Thru](/biomes/fry-palace)), so watch where you sidestep.
