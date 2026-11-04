## Overview

Sack of Russets is the evolution of [Spud Lob](/weapons/spud-lob). To get it, have Spud Lob at level 8 and own [Butter Pat](/passives/butter-pat), then open a [chest](/chests). See [Evolutions](/evolutions).

Every 2.2 s it throws 4 heavy potatoes (0.1 s apart), each dealing 60 raw damage. They fly in the same up-and-down arc as Spud Lob, but higher and spread wider, and they pierce without limit. Each potato keeps going through every pest in its path for its full 3 s.

## How it works

- **Arc.** As with Spud Lob, potatoes are launched straight up the screen and pulled back down by `gravity` (420). At speed 230 a potato peaks about 63 units above Tibo after roughly 0.55 s and comes back level with him after about 1.1 s.
- **Scatter.** The sideways speed is random, up to `spreadX` (130) × (0.6 + 0.4 × area). With the base area of 1.6 that is up to about 160 units per second either way, so the four potatoes fan out into a wide spray.
- **Unlimited pierce.** A weapon pierce of 99 means unlimited pierce. <small>[sim-CrpXuTSY.js: `n.pierce=i.pierce>=99?-1:i.pierce+r.pierceBonus`]</small> In exchange, a pest can only be hit by this weapon once every 0.5 s, and that timer is shared by all four potatoes. <small>[sim-CrpXuTSY.js: `i=8*z(n)+Math.max(0,e.projectiles.slot[t]);return!(e.tick-r.hitStamp[i]<e.projectiles.rehit[t]`]</small> A potato that catches a pest on the way up can hit it again on the way down if at least 0.5 s has passed.

## Tips

- Against one tough target the shared timer caps the sack at 2 hits per second, however many potatoes pass through it. It does its best work on crowds that fill the wide column above and below Tibo.
- Spud Artillery also uses this arc. Sack of Russets still counts as Spud Lob for that union, so a level 8 [Spud Cannon](/weapons/spud-cannon) can later unite with it into [Spud Artillery](/weapons/spud-artillery), freeing a weapon slot.
