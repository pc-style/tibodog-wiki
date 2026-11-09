## Overview

Mash Wave sends rings of mashed potato rolling out from Tibo. Every 3.2 s it releases 2 rings (1 plus Tibo's built-in +1 amount, see [Stats](/stats)), 0.35 s apart. Each ring grows from Tibo's position out to 90 units × Area and hits every pest it passes once, for 15 damage and strong knockback (2). Mash Wave always fires on cooldown, even with no pests nearby.

It is offered as a level-up card, and it is on the list of new weapons [poteto's gift chest](/visitors) can hand out. At level 8, with [Big Bowl](/passives/big-bowl) at any level, the next [chest](/chests) evolves it into [Mashquake](/weapons/mashquake).

## How it works

- Each ring is centred where Tibo stood when it was released and does not move with him. It starts at a radius of 4 and grows at the weapon's speed (160 units/s, at least 60, scaled by projectile speed), so a level-1 ring reaches its edge in about 0.55 s. <small>[sim-B6dlvQvf.js: `i.maxRadius[a]=n.size*r.area,i.growSpeed[a]=Math.max(60,r.speed)`]</small>
- The ring's edge is a band `thickness` × √Area + 6 units deep (16 at level 1). A pest is hit when the band reaches it, and each ring hits each pest only once.
- Area scales the final radius directly, so +15% Area means a 15% wider ring.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it released 2 rings 0.35 s apart every 3.2 s, and each ring hit each pest once. All three seeds gave the same figures.

## Tips

- **Pair it with Big Bowl.** Area upgrades on the weapon (levels 3 and 7) and from passives make the ring wider. Since [Big Bowl](/passives/big-bowl) adds Area and is also the catalyst, it is a natural pick with this weapon.
- The knockback pushes pests out of the ring, which gives Tibo room in a crowd. It also moves pests away from melee weapons such as the [Peeler](/weapons/peeler).
