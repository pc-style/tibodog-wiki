## Overview

The Peeler is Tibo's kitchen tool. Its base level-up offer weight is 70, below [Tot Toss](/weapons/tot-toss)'s 80 and [Fry Knives](/weapons/fry-knives)' 100; [Potato Rain](/weapons/potato-rain) has the highest base weapon weight at 130. It is in the pool of starting weapons, one of which is picked from the run seed in Standard runs, and [Story mode](/story-mode)'s starting chest holds a level-4 Peeler. [poteto's gift chest](/visitors) can also hand it out.

Every 1 s it slashes sideways. At level 1 that is 2 slashes (1 plus Tibo's built-in +1 amount, see [Stats](/stats)), 0.1 s apart: one on the side Tibo faces, one on the other side. Level 2 adds a third slash, back on the facing side and one row lower. Each slash hits every pest in a 64 × 20 box (× Area) next to Tibo. From level 4, every slash also flings potato peels outward: 2 at level 4, one more per level, 6 at level 8.

At level 8, with [Gravy Heart](/passives/gravy-heart) at any level, the next [chest](/chests) evolves it into [Mandoline Fury](/weapons/mandoline-fury).

## How it works

- **Slashes.** Swings alternate sides, starting on the side Tibo faces (left or right). The 3rd and 4th swings sit 10 units lower than the first two. A slash damages everything in its box at once and has no pierce limit.
- **Peels.** The number of peels is `count + countPerLevel × (level − fromLevel)` from level 4 on, and zero before that. <small>[sim-ByUaSHJI.js: `return t<n?0:e.count+(e.countPerLevel??0)*(t-n)`]</small> They fan out over ±0.6 rad on the slash's side, move slowly (40 units/s) for 2.2 s × Duration, pass through pests and deal 0.45× the slash damage.
- **Peel hit limit.** The `rehit` timer for peels is kept per pest and per weapon slot, not per peel. A pest hit by one of this Peeler's peels cannot be hit by any of its peels for the next 6 s. <small>[sim-ByUaSHJI.js: `i=8*U(n)+Math.max(0,e.projectiles.slot[t]);return!(e.tick-r.hitStamp[i]<e.projectiles.rehit[t]`]</small>

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 28 units to each side of Tibo, at his height and 12 units lower): at level 1 it slashed right, then left 0.1 s later, every 1 s; at level 2 a third slash hit the right side 0.2 s after the first. At level 8 each volley flung 18 peels (6 per slash), each with a 2.75 s lifetime, and pests held 60 to 110 units to the left, beyond the slashes, took exactly one peel hit every 6 s. All three seeds gave the same figures.

## Tips

- **Slashes, not peels, do most damage.** The peels mostly add reach: they deal a little damage once to pests outside the slash boxes. Most of the damage comes from the slashes.
- The slash boxes are wide but short (20 units tall at level 1), so pests directly above or below Tibo are easy to miss. Area upgrades (levels 4 and 6) make the boxes taller as well as wider.
