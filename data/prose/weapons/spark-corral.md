## Overview

Spark Corral is the evolution of [Spud Fence](/weapons/spud-fence), made by opening a [chest](/chests) with Spud Fence at level 8 and [GPU](/passives/gpu) owned. It uses the same fence logic: a post every 60 units Tibo moves, with damaging arcs between consecutive posts. What changes are the numbers: each zap deals 85 damage instead of 50, arcs are wider, more posts stand at once and each lasts much longer.

Own Spark Corral and [Potato Patch](/weapons/potato-patch), then open a chest to unite them into [Starch Garden](/weapons/starch-garden), freeing a weapon slot. Its post plants strengthen the arcs as they ripen.

## How it works

The rules are the same as [Spud Fence](/weapons/spud-fence#how-it-works); here is what they work out to with Spark Corral's values.

- **Posts.** The limit is `live` (4) plus the extra Amount, capped at 8. Spark Corral's raw Amount of 4 gives 7 posts, and any +1 Amount, such as the one from GPU, reaches the cap of 8. <small>[sim-CJCEF4hP.js: `let r=n.amount-1-e.cfg.player.baseAmount;return Math.min(8,Math.max(2,t.live+r))`]</small>
- **Lifetime.** Duration 9 with Tibo's base +25% means each post lasts 11.25 s, longer than the 9 s in the in-game description. At base move speed Tibo plants about one post per second, so the post limit, not the lifetime, usually decides how long the fence is: 8 posts make 7 arcs, about 420 units of wire when walking straight.
- **Width.** Area 2.25 makes each arc 54 units wide (27 on each side of the line), against 30 for a level 8 Spud Fence.
- **Hit rate.** Unchanged: a pest touching any arc is zapped at most once every 0.2 s, so 85 damage up to five times a second.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path): a pest touching the wire was zapped every 0.2 s (12 ticks) for 85. All three seeds gave the same figures.

## Tips

- **Walk a loop to fence in a group.** With up to 8 posts you can walk a full loop around a group and close the fence on them; pests inside then cross an arc whichever way they move.
- Despite the GPU recipe, the fence ignores GPU heat: it neither builds heat nor slows down when the GPU throttles other weapons.
