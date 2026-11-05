## Overview

Lunch Rush is the landmark event of the [Fry Palace Drive-Thru](/biomes/fry-palace). It fires the first time Tibo walks into a drive-thru (radius 420), once per drive-thru, and never in [Story mode](/story-mode). After the announcement, 24 [Gull Flock](/enemies/gull-flock) pests sweep across the screen in a straight band.

It is a swarm event, like the scheduled [Fry Fly Swarm](/events/fly-swarm), with slightly faster birds in a wider band. Each gull has 10 base HP, speed 105, 5 contact damage, 1 XP and a 2% gold chance, and disappears 14 seconds after it spawns. The gulls are separate from the drive-thru's resident [Parking Gull](/enemies/parking-gull).

## How it works

- **Geometry.** The gulls start beyond the edge of the view on one side, in a block 280 units wide (140 to each side of Tibo's position) and up to 60 deep. They fly in a fixed direction and never turn towards Tibo. <small>[sim-DrUZpiNa.js: `let s=n.range(-t.width,t.width),d=n.range(0,60),f=to(e,o,i-c*(u+d)-l*s,a-l*(u+d)+c*s)`]</small>
- **Count.** 24 × the enemy-count multiplier, capped at 2×. Before overtime the multiplier is 1 (see [Enemy scaling](/enemy-scaling)), so a drive-thru found before 20:00 always sends 24 gulls.
- **Trigger.** If the enemy pool is full (550), the drive-thru stays unused and the event tries again while Tibo is inside.
- **Despawn.** Gulls are removed after 14 seconds or once they are about 460 units from Tibo, and drop nothing.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, `--god`, Tibo teleported into the first Fry Palace Drive-Thru found at about 1:03 with pests removed first): every run spawned 24 gulls, on all four difficulties. In 5 of 10 runs (seeds `wiki` and `s1` to `s4`, Normal and Nightmare) one of them was gone again after the spawn tick, leaving 23. The band reaches about √(448² + 140²) ≈ 469 units from Tibo at its far corners, past the 460-unit despawn distance, so a gull placed there is probably removed at once (inference). <small>[sim-DrUZpiNa.js: `recycleDistance:460`]</small> With `--mode story`, entering the drive-thru fired no event.

## Tips

- Stepping sideways to the flight path clears the band. Tibo needs a little over 2 seconds at base speed to cover the 140 units to its edge.
- The drive-thru has burning pools on the ground (see [Fry Palace Drive-Thru](/biomes/fry-palace)), so watch where you sidestep.
