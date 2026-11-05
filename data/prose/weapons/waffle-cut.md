## Overview

Waffle Cut is the evolution of [Julienne Dash](/weapons/julienne-dash). Get Julienne Dash to level 8 while you own [Butter Socks](/passives/butter-socks), then open a [chest](/chests).

Like Julienne Dash, it fires on every dash and, between dashes, on its 1.3 s cooldown along the path Tibo just walked. Each cut is a cross: one line along the path and a second line of the same length across its middle. Each firing cuts 3 times (2 plus Tibo's built-in +1 amount, see [Stats](/stats)), 0.5 s apart, on the same spot, for 110 damage per hit.

## How it works

- With its 1.6 Area, each line is about 99 units long (40 × √1.6 + the 48-unit dash) and about 26 units wide.
- `cross` adds the second line, perpendicular to the first and centred on its midpoint. A pest is hit if it touches either line, but only once per cut. <small>[sim-HQr6OS1G.js: `l=t.length*Math.sqrt(n.area)+e.cfg.dash.distance,u=t.size*n.area,d=l/2,f=a+s*d,p=o+c*d,m=-c*d,h=s*d,g=!0===t.cross`]</small>
- The follow-up cuts reuse the position and direction stored when the cut was first made. They do not follow Tibo, so they hit whatever is standing on the cross 0.5 s and 1 s later.

## Tips

- The repeat cuts stay where the dash started, so dashing through a crowd leaves a cross that keeps cutting the pests that chase Tibo into it.
- Extra dash charges from [Butter Socks](/passives/butter-socks) mean more crosses, and the crosses can overlap.
