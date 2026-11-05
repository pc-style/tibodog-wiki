## Overview

Seeker Sprouts is a homing weapon. Every 2 s Tibo sends out a volley of 4 sprouts (raw amount 3 plus Tibo's base +1, see [Stats](/stats)), 0.12 s apart. Each sprout flies at speed 120 for 3.75 s (3 s plus the base +25% duration) and steers toward the nearest pest. At level 1 a sprout hits one pest and is gone; the level 7 upgrade adds 1 pierce, so it can hit two.

It is offered on level-up cards and is in the starting-weapon pool. At level 8 it has 42 raw damage, 6 sprouts per volley (raw amount 5 plus 1), a 1.5 s cooldown, speed 160 and 1 pierce. Owning [Fertilizer](/passives/fertilizer) at that point lets a [chest](/chests) evolve it into [Overgrowth](/weapons/overgrowth). Fertilizer is also the catalyst for [Big Fry](/weapons/big-fry).

## How it works

- **Launch direction.** Sprouts are not aimed at a pest. Each one leaves in the direction Tibo is facing, plus a random offset of up to 1.2 radians (about 69°) to either side. <small>[sim-34F7B_ih.js: `Rm(e,t,r,Im(e)+e.rng.range(-1.2,1.2),x.homing,n.size)`]</small> The weapon fires on cooldown even when no pests are around.
- **Steering.** In flight, a sprout picks the nearest pest within 200 units every 6 ticks (0.1 s) and turns toward it. <small>[sim-34F7B_ih.js: `if((e.tick+t)%6==0){let n=Fo(e,i,a,200);`]</small> The `turn` value (5) caps the turn rate in radians per second. At speed 120 that gives a turning circle of about 24 units radius. A sprout sent off in the wrong direction needs about 0.6 s to swing all the way around.
- **Targets.** Each sprout chases the pest nearest to itself, not to Tibo, and switches whenever a closer one appears.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it launched 4 sprouts 0.12 s apart every 2 s, each spawned with a 3.75 s lifetime and pierce 0; at level 8 it launched 6 every 1.5 s with pierce 1. All three seeds gave the same figures.

## Tips

- Sprouts leave in Tibo's facing direction, so walking toward a pack gets them to it fastest. Running away sends them off backwards first.
- The level 5 and level 8 upgrades (+1 sprout each) and the cooldown cuts at levels 5 and 7 add the most volume. [Pierce](/stats) bonuses matter more after level 7, once each sprout can hit two pests.
