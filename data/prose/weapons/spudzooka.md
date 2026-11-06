## Overview

Spudzooka is the evolution of [Spud Cannon](/weapons/spud-cannon). To get it, have Spud Cannon at level 8 and own [Hot Sauce](/passives/hot-sauce), then open a [chest](/chests). See [Evolutions](/evolutions).

Every 1.4 s it fires 3 potato rockets (raw amount 2 plus Tibo's base +1, see [Stats](/stats)) at the nearest pest, 0.12 s apart. Each rocket bursts like a Spud Cannon shell, for 50 raw damage. Base area 1.8 gives a main blast radius of about 40 units. After the main blast, four smaller **cluster bursts** go off around it at random angles.

## How it works

- **Main blast.** As with Spud Cannon, the rocket hits the first pest it touches, then explodes. It also explodes if it reaches the end of its flight, 2 s or 2.5 s with Tibo's base +25% duration. The struck pest takes the impact and the blast.
- **Cluster bursts.** After the main blast, the rocket triggers `cluster` (4) extra explosions. Each one is centred 1.1 × the blast radius from the impact point in a random direction, has 0.6 × the blast radius, and deals half damage with half knockback. <small>[sim-ieBkQqL1.js: `e.attack.damage=.5*o,e.attack.kb=.5;for(let t=0;t<s;t++){let t=e.rng.angle();Gl(e,r+b(t)*a*1.1,i+x(t)*a*1.1,.6*a)}`]</small> At area 1.8 that means four 25-damage bursts of about 24-unit radius, centred about 44 units out. They reach from roughly 20 to 67 units from the impact.
- **Overlap.** The bursts overlap the edge of the main blast and can overlap each other, since the angles are random. A pest in an overlap is hit by each explosion that covers it.
- **Scaling.** [Area](/stats) bonuses enlarge the main blast, the cluster bursts and their distance from the centre together.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it fired 3 rockets 0.12 s apart every 1.4 s, each spawned with a 2.5 s lifetime; hits of 25 (cluster bursts) to 125 (overlapping blasts) were recorded. All three seeds gave the same figures.

## Tips

- **Use it on large, spread-out crowds.** The cluster ring makes the danger zone about 1.7 times as wide as the main blast, so it is at its best against large spread-out crowds.
- Hold [Sack of Russets](/weapons/sack-of-russets) too, then open a chest to unite both evolutions into [Spud Artillery](/weapons/spud-artillery), freeing a weapon slot. A base Spud Lob does not qualify.
