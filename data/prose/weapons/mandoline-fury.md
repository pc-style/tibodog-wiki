## Overview

Mandoline Fury is the evolution of the [Peeler](/weapons/peeler). Get the Peeler to level 8 while you own [Gravy Heart](/passives/gravy-heart), then open a [chest](/chests).

Every 0.8 s it slashes 3 times (2 plus Tibo's built-in +1 amount, see [Stats](/stats)), 0.1 s apart: to the side Tibo faces, to the other side, then to the facing side again, one row lower. Each slash deals 72 damage to every pest in a 102 × 54 box (64 × 34 × its 1.6 Area). Every slash heals Tibo 0.25 HP per pest it hits, up to 4 HP per slash, and flings 4 potato slices out on its side.

## How it works

- **Healing.** The heal is `min(0.25 × pests hit, 4)` per slash, so it reaches the cap at 16 pests. A full volley heals up to 12 HP every 0.8 s, before cooldown bonuses. <small>[sim-DRV1ehYp.js: `n.heal!==void 0&&l>0&&wu(e,Math.min(n.heal*l,n.healCap??4))`]</small>
- **Slices.** As with the Peeler's peels, slices fan out over ±0.6 rad, move at 40 units/s for 2.2 s × Duration and pierce everything, here for 0.5× the slash damage. A volley throws 12. The 6 s `rehit` timer is shared by all of this weapon's slices, so any one pest takes slice damage at most once every 6 s.
- Unlike [Moon Cleaver](/weapons/moon-cleaver), every slash flings, not only the rear one.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 28 units to each side of Tibo): it slashed right, left and right again, 0.1 s apart, every 0.8 s, and each volley flung 12 slices with a 2.75 s lifetime. A pest beyond the slashes took a slice hit only once in about 6.4 s. All three seeds gave the same figures.

## Tips

- **Stand in crowds to heal more.** The healing scales with how many pests are in the boxes, so standing in a crowd pays off. [Gravy Heart](/passives/gravy-heart) raises max HP, which gives the healing more room to work.
- The boxes are 54 units tall, so the Peeler's weak spot above and below Tibo is much smaller here.
