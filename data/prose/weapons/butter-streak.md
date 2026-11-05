## Overview

Butter Streak is a dash weapon: instead of firing on a timer, it lays a strip of melted butter along the path of every dash Tibo makes. The strip is a row of small damaging pools that hit every pest standing in them every 0.3 s and halve their movement speed for 1 s. At level 1 each strip lasts 2 s and hits for 9; by level 8 it lasts 3 s, hits for 28 and its pools are 30% wider.

It also works without dashing. Whenever its 2.5 s cooldown is ready and Tibo is walking, it drops a strip behind him. Butter Streak is offered on level-up cards; it is not in the pool of random starting weapons. At level 8, a chest opened while Tibo holds [Spud Sneakers](/passives/spud-sneakers) evolves it into [Ghee Glide](/weapons/ghee-glide) (see [Evolutions](/evolutions)).

## How it works

- **Every dash places a strip, even if the cooldown is still running**, and each dash restarts the cooldown. <small>[sim-HQr6OS1G.js: `e.player.dashedAt[e.me]===e.tick`]</small> The strip runs from where the dash started along the dash direction, covering the full 48-unit dash (see [Controls](/controls)).
- **Between dashes**, when the cooldown is ready and Tibo is moving, a strip of the same length is laid backwards from Tibo's position, along the path he just walked. <small>[sim-HQr6OS1G.js: `a.dx[r]=-i.fx[e.me]`]</small> Standing still does not trigger it.
- **Strip shape**: the strip is made of `ceil(48 / pool radius) + 1` circular pools spaced evenly along the path. Each pool has radius `size × area` (9 at level 1), so a level-1 strip is 7 overlapping pools. <small>[sim-HQr6OS1G.js: `Math.ceil(s/(n.size*r.area))+1`]</small>
- **Hits**: each pool ticks every 0.3 s (`hitInterval`). All butter pools of this weapon share one re-hit timer per pest, so a pest standing where pools overlap is still hit only once every 0.3 s. <small>[sim-HQr6OS1G.js: `rehit[a]=n.trail===void 0?0:C(n.hitInterval)`]</small>
- **Slow**: each hit sets the pest's speed to ×0.5 for 1 s, scaled by Tibo's duration stat. The pool's lifetime also scales with duration (see [Stats](/stats)).
- The in-game text says the butter "burns" pests for 2 s. In the data that is the strip's own damage over its 2 s lifetime; Butter Streak applies no separate burn status, only the slow.
- Extra projectiles (`amount`) place extra strips in the same spot at the same moment. Because of the shared re-hit timer they add no damage.

## Tips

- Damage depends on dash frequency more than on the 2.5 s cooldown. Dash charges and dash cooldown from [Butter Socks](/passives/butter-socks) mean more strips.
- Dashing through or along a crowd puts the strip under the pests, and the slow keeps them in it. Dashing straight away from a chasing group leaves the strip between you and them.
- Projectile-count passives do nothing for this weapon; area and duration help it.
