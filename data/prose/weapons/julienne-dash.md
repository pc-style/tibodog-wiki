## Overview

Julienne Dash is a dash weapon: it cuts a straight line through every pest along Tibo's dash. Every dash fires it, whatever the cooldown. Between dashes it also fires on its 1 s cooldown, cutting along the path Tibo just walked. Each firing is 2 cuts (1 plus Tibo's built-in +1 amount, see [Stats](/stats)), for 30 damage each at level 1. With an interval of 0, both land on the same tick, so each pest on the line takes the hit twice.

It is offered as a level-up card. At level 8, with [Butter Socks](/passives/butter-socks) at any level, the next [chest](/chests) evolves it into [Waffle Cut](/weapons/waffle-cut).

## How it works

- **On a dash** the cut starts where the dash began and runs in the dash direction. It is `length` × √Area + 48 units long, which covers the 48-unit dash plus 40 more at level 1, and `size` × Area wide (20 units at level 1). It pierces everything in the line. <small>[sim-DA4RGMxM.js: `l=t.length*Math.sqrt(n.area)+e.cfg.dash.distance,u=t.size*n.area`]</small>
- **Between dashes**, once the cooldown is ready and a pest is within 224 units (0.7 × the 320-unit play field), it cuts from Tibo's current position straight backwards, opposite to the way he faces. <small>[sim-DA4RGMxM.js: `a.dx[r]=-i.fx[e.me],a.dy[r]=-i.fy[e.me]`]</small>
- A dash always fires the weapon and restarts the cooldown.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path, no dashes): between dashes it fired every 1.2 s and pests on the cut took both cuts on the same tick (44 at level 1, 140 at level 8). Dash cuts were not measured. All three seeds gave the same figures.

## Tips

- **Dash into pests, not away from them.** Dash through pests rather than away from them: the cut only covers the dash path and 40 units past it.
- [Butter Socks](/passives/butter-socks) adds dash charges and shortens the dash cooldown (see [Controls](/controls) for dash basics), so it means more cuts as well as unlocking the evolution.
- When you are not dashing, walking away from a crowd points the backward cut at the pests chasing Tibo.
