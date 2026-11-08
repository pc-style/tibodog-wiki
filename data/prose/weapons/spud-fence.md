## Overview

Spud Fence is a base weapon that turns Tibo's path into an electric fence. Every 60 units he moves, he drops a starch post where he stands, and a live arc joins each new post to the previous one. Pests that touch an arc take damage; the posts themselves do nothing on their own. Because posts only appear while Tibo moves, the fence always trails behind him.

At base move speed (62 units per second, see [Stats](/stats)) Tibo plants about one post per second. At level 1 up to four posts stand, so the fence is a chain of three arcs, roughly 180 units long when he walks in a straight line. At level 8, with [GPU](/passives/gpu) owned at any level, it evolves into [Spark Corral](/weapons/spark-corral) on the next [chest](/chests).

## How it works

- **Planting.** The walk counter adds Tibo's movement each tick (at most 12 units per tick) and plants a post every 60 units (`every`). Standing still plants nothing, but posts already down keep zapping until they expire.
- **Post limit.** The number of posts is `live` (4) plus the weapon's extra Amount, clamped between 2 and 8. In practice that is 4 posts at levels 1–7, 5 at level 8, plus one per point of Amount from passives. When a new post would go over the limit, the oldest one is removed. <small>[sim-DA4RGMxM.js: `let r=n.amount-1-e.cfg.player.baseAmount;return Math.min(8,Math.max(2,t.live+r))`]</small>
- **Post lifetime.** Each post lasts the weapon's Duration, but never less than 0.5 s (`minLife`). Duration includes Tibo's base +25% (see [Stats](/stats)), so posts last 5 s at level 1 and 7.5 s at level 8. <small>[sim-DA4RGMxM.js: `r.end[a]=e.time+Math.max(t.minLife,n.duration)`]</small>
- **Arcs.** A new post links to the previous one only if it is 1–90 units away (`maxSpan`). A post planted further away starts a new, unconnected stretch of fence.
- **Arc width.** An arc hits pests within half of `arcWidth` × Area of the line (12 units at Area 1), plus the pest's own radius.
- **Hit rate.** A pest touching an arc is zapped at most once every 0.2 s (`zapSec`). The timer is shared by all arcs of the weapon, so a pest touching two arcs at once is not hit twice as often. <small>[sim-DA4RGMxM.js: `if(e.tick-h.hitStamp[g]<o)continue;h.hitStamp[g]=e.tick;`]</small> At level 1 that is 20 damage five times a second for as long as the pest stays on the wire.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path): a pest touching the wire was zapped every 0.2 s (12 ticks), for 20 at level 1 and 50 at level 8. All three seeds gave the same figures.

## Tips

- **Walk loops around the crowd.** Walk circles or zig-zags around a crowd instead of running straight away from it; a straight line leaves the fence behind the pests chasing you, while loops drag arcs back through them.
- Spud Fence is not fired on a cooldown, so cooldown reduction does nothing for it. Amount and Duration are the stats that make the fence longer.
- Spud Fence never adds or reacts to [GPU](/passives/gpu) heat, because it does not use the weapon cooldown timer.
