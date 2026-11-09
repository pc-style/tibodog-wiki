## Overview

Waffle Cut is the evolution of [Julienne Dash](/weapons/julienne-dash). Get Julienne Dash to level 8 while you own [Butter Socks](/passives/butter-socks), then open a [chest](/chests).

Like Julienne Dash, it fires on every dash and, between dashes, on its 1.1 s cooldown along the path Tibo just walked. Each cut is a cross: one line along the path and a second line of the same length across its middle. Each firing cuts 3 times (2 plus Tibo's built-in +1 amount, see [Stats](/stats)), 0.5 s apart, on the same spot, for 150 damage per hit.

## How it works

- With its 1.6 Area, each line is about 99 units long (40 × √1.6 + the 48-unit dash) and about 26 units wide.
- `cross` adds the second line, perpendicular to the first and centred on its midpoint. A pest is hit if it touches either line, but only once per cut. <small>[sim-BtJ1ZXuM.js: `l=t.length*Math.sqrt(n.area)+e.cfg.dash.distance,u=t.size*n.area,d=l/2,f=a+s*d,p=o+c*d,m=-c*d,h=s*d,g=!0===t.cross`]</small>
- The follow-up cuts reuse the position and direction stored when the cut was first made. They do not follow Tibo, so they hit whatever is standing on the cross 0.5 s and 1 s later.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path, no dashes): each firing hit the pests on the cross 3 times, 0.5 s apart, for 110, and a new firing followed 1.3 s after the previous one began. Dash cuts were not measured. All three seeds gave the same figures.

## Tips

- **Dash through crowds to leave a cross.** The repeat cuts stay where the dash started, so dashing through a crowd leaves a cross that keeps cutting the pests that chase Tibo into it.
- Extra dash charges from [Butter Socks](/passives/butter-socks) mean more crosses, and the crosses can overlap.
