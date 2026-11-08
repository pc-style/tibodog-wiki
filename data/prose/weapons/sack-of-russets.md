## Overview

Sack of Russets is the evolution of [Spud Lob](/weapons/spud-lob). To get it, have Spud Lob at level 8 and own [Butter Pat](/passives/butter-pat), then open a [chest](/chests). See [Evolutions](/evolutions).

Every 2.2 s it throws 5 heavy potatoes (raw amount 4 plus Tibo's base +1, see [Stats](/stats), 0.1 s apart), each dealing 60 raw damage. They fly in the same up-and-down arc as Spud Lob, but higher and spread wider, and they pierce without limit. Each potato keeps going through every pest in its path for its full life, 3 s or 3.75 s with Tibo's base +25% duration.

## How it works

- **Arc.** As with Spud Lob, potatoes are launched straight up the screen and pulled back down by `gravity` (420). At speed 230 a potato peaks about 63 units above Tibo after roughly 0.55 s and comes back level with him after about 1.1 s.
- **Scatter.** The sideways speed is random, up to `spreadX` (130) × (0.6 + 0.4 × area). With the base area of 1.6 that is up to about 160 units per second either way, so the five potatoes fan out into a wide spray.
- **Unlimited pierce.** A weapon pierce of 99 means unlimited pierce. <small>[sim-pcti3OIT.js: `n.pierce=i.pierce>=99?-1:i.pierce+r.pierceBonus`]</small> In exchange, a pest can only be hit by this weapon once every 0.5 s, and that timer is shared by all five potatoes. <small>[sim-pcti3OIT.js: `i=8*U(n)+Math.max(0,e.projectiles.slot[t]);return!(e.tick-r.hitStamp[i]<e.projectiles.rehit[t]`]</small> A potato that catches a pest on the way up can hit it again on the way down if at least 0.5 s has passed.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it threw 5 potatoes 0.1 s apart every 2.2 s, each spawned with a 3.75 s lifetime and unlimited pierce. All three seeds gave the same figures.

## Tips

- **Use it on crowds above and below.** Against one tough target the shared timer caps the sack at 2 hits per second, however many potatoes pass through it. It does its best work on crowds that fill the wide column above and below Tibo.
- Hold [Spudzooka](/weapons/spudzooka) too, then open a chest to unite both evolutions into [Spud Artillery](/weapons/spud-artillery), freeing a weapon slot. A base Spud Cannon does not qualify.
