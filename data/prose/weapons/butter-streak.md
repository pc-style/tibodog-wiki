## Overview

Butter Streak is a dash weapon: instead of firing on a timer, it lays a strip of melted butter along the path of every dash Tibo makes. The strip is a row of small damaging pools that hit every pest standing in them every 0.3 s and halve their movement speed for 1 s. At level 1 each strip lasts 2.5 s (2 s plus Tibo's base +25% duration) and hits for 14; by level 8 it lasts 3.75 s, hits for 40 and its pools are 30% wider.

It also works without dashing. Whenever its 2 s cooldown is ready and Tibo is walking, it drops a strip behind him. Butter Streak is offered on level-up cards; it is not in the pool of random starting weapons. At level 8, a chest opened while Tibo holds [Spud Sneakers](/passives/spud-sneakers) evolves it into [Ghee Glide](/weapons/ghee-glide) (see [Evolutions](/evolutions)).

## How it works

- **Every dash places a strip, even if the cooldown is still running**, and each dash restarts the cooldown. <small>[sim-aoTT3npm.js: `e.player.dashedAt[e.me]===e.tick`]</small> The strip runs from where the dash started along the dash direction, covering the full 48-unit dash (see [Controls](/controls)).
- **Between dashes**, when the cooldown is ready and Tibo is moving, a strip of the same length is laid backwards from Tibo's position, along the path he just walked. <small>[sim-aoTT3npm.js: `a.dx[r]=-i.fx[e.me]`]</small> Standing still does not trigger it.
- **Strip shape**: the strip is made of `ceil(48 / pool radius) + 1` circular pools spaced evenly along the path. Each pool has radius `size × area` (9 at level 1), so a level-1 strip is 7 overlapping pools. <small>[sim-aoTT3npm.js: `Math.ceil(s/(n.size*r.area))+1`]</small>
- **Hits**: each pool ticks every 0.3 s (`hitInterval`). All butter pools of this weapon share one re-hit timer per pest, so a pest standing where pools overlap is still hit only once every 0.3 s. <small>[sim-aoTT3npm.js: `rehit[i]=n.trail===void 0?0:Ve(n.hitInterval)`]</small>
- **Slow**: each hit sets the pest's speed to ×0.5 for 1 s, scaled by Tibo's duration stat. The pool's lifetime also scales with duration (see [Stats](/stats)).
- The in-game text says the butter "burns" pests for 2 s. In the data that is the strip's own damage over its 2 s raw lifetime; Butter Streak applies no separate burn status, only the slow.
- Extra projectiles (`amount`) place extra strips in the same spot at the same moment. Tibo's base +1 amount already makes every firing two identical strips. Because of the shared re-hit timer the extra strips add no damage.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path, no dashes): every 2.5 s it laid 14 pools at once at level 1 (two strips of 7, radius 9), each with a 2.5 s lifetime, and a pest on the strip was hit every 0.3 s for 9; at level 8 it laid 12 pools (two strips of 6, radius 11.7) with a 3.75 s lifetime, hitting for 28. Dash strips were not measured. All three seeds gave the same figures.

## Tips

- **Pair it with Butter Socks.** Damage depends on dash frequency as well as the 2 s cooldown. Dash charges and dash cooldown from [Butter Socks](/passives/butter-socks) mean more strips.
- Dashing through or along a crowd puts the strip under the pests, and the slow keeps them in it. Dashing straight away from a chasing group leaves the strip between you and them.
- Projectile-count passives do nothing for this weapon; area and duration help it.
