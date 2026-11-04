## Overview

Julienne Dash is a dash weapon: it cuts a straight line through every pest along Tibo's dash. Every dash fires it, whatever the cooldown. Between dashes it also fires on its 1.2 s cooldown, cutting along the path Tibo just walked. Each firing is 2 cuts (1 plus Tibo's built-in +1 amount, see [Stats](/stats)). With an interval of 0, both land on the same tick, so each pest on the line takes the hit twice.

It is offered as a level-up card. At level 8, with [Butter Socks](/passives/butter-socks) at any level, the next [chest](/chests) evolves it into [Waffle Cut](/weapons/waffle-cut).

## How it works

- **On a dash** the cut starts where the dash began and runs in the dash direction. It is `length` × √Area + 48 units long, which covers the 48-unit dash plus 40 more at level 1, and `size` × Area wide (20 units at level 1). It pierces everything in the line. <small>[sim-CrpXuTSY.js: `u=t.length*Math.sqrt(n.area)+e.cfg.dash.distance,d=t.size*n.area`]</small>
- **Between dashes**, once the cooldown is ready and a pest is within 224 units (0.7 × the 320-unit play field), it cuts from Tibo's current position straight backwards, opposite to the way he faces. <small>[sim-CrpXuTSY.js: `a.dx[r]=-i.fx[e.me],a.dy[r]=-i.fy[e.me]`]</small>
- A dash always fires the weapon and restarts the cooldown.

## Tips

- Dash through pests rather than away from them: the cut only covers the dash path and 40 units past it.
- [Butter Socks](/passives/butter-socks) adds dash charges and shortens the dash cooldown (see [Controls](/controls) for dash basics), so it means more cuts as well as unlocking the evolution.
- When you are not dashing, walking away from a crowd points the backward cut at the pests chasing Tibo.
