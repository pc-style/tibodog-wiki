## Overview

Overgrowth is the evolution of [Seeker Sprouts](/weapons/seeker-sprouts). To get it, have Seeker Sprouts at level 8 and own [Fertilizer](/passives/fertilizer) at any level, then open a [chest](/chests). See [Evolutions](/evolutions).

It fires 6 homing sprouts (raw amount 5 plus Tibo's base +1, see [Stats](/stats)) every 1 s, 0.08 s apart. Each deals 40 raw damage and flies at speed 200 for 3.75 s (3 s plus the base +25% duration). Sprouts steer the same way as Seeker Sprouts but turn faster (8 radians per second instead of 5). Each sprout has 1 pierce, so it can hit two pests, and **every hit splits off two smaller shards**.

## How it works

- **Launch and steering.** These work as on [Seeker Sprouts](/weapons/seeker-sprouts#how-it-works): sprouts leave in Tibo's facing direction with up to about 69° of random spread, then chase the nearest pest within 200 units. Fast turning keeps the turning circle at about 25 units even at speed 200.
- **Split shards.** When a sprout hits a pest, it spawns 2 shards angled 0.6 radians (about 34°) to each side of its own heading. <small>[sim-DSqbJT_O.js: `let l=u(a,i)+(c===0?.6:-.6);`]</small> A shard has 80% of the sprout's size and half its damage, and lasts 0.8 s. <small>[sim-DSqbJT_O.js: `r.radius[s]=.8*r.radius[t],r.damage[s]=.5*r.damage[t],r.life[s]=.8`]</small> Shards fly straight, do not home, hit one pest each and do not split again. They ignore the pest that spawned them.
- **Per sprout.** The sprout splits on each of its two hits, so one sprout can produce up to 4 shards. A full volley is 6 sprouts, up to 12 sprout hits and up to 24 shards.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 40 to 110 units to Tibo's right): it launched 6 sprouts from Tibo every 1 s, each with a 3.75 s lifetime; the shards appeared away from Tibo with a 0.8 s lifetime, about 240 of them in 10 s. All three seeds gave the same figures.

## Tips

- **Use it on dense crowds.** Shards fan out forward from the pest that was hit, so they do the most in dense crowds where something is behind the first target.
- Extra [pierce](/stats) adds one more hit per sprout, and each extra hit also makes two more shards.
