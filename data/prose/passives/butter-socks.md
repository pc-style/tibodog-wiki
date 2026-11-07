## Overview

Butter Socks gives Tibo more dashes and makes them recharge faster. Tibo starts with 1 dash charge and a 5 s recharge. Butter Socks adds 1 charge at levels 1 and 2, 2 at levels 3 and 4, and 3 at level 5, so Tibo holds 2, 2, 3, 3 and then 4 charges. Each level also cuts the dash cooldown by 6%: 4.7 s at level 1, down to 3.5 s at level 5.

It is the catalyst for [Waffle Cut](/weapons/waffle-cut) (from [Julienne Dash](/weapons/julienne-dash)) and [Tot Cavalry](/weapons/tot-cavalry) (from [Tot Stampede](/weapons/tot-stampede)). [Spry Sprout](/passives/spry-sprout), [Spud Spring](/items/spud-spring) and gear can also improve dashing.

## How it works

The charge values per level are totals, not increments: the game reads the array entry for the current level.<small>[sim-sB5IBoT-.js: ``function di(e,t){return t<=0?0:typeof e==`number`?e*t:e[Math.min(t,e.length)-1]??0}``]</small>

Spent charges come back one at a time. When a charge finishes recharging, the next one starts only if Tibo is still below the maximum.<small>[sim-sB5IBoT-.js: `let a=t.dashCharges[n]+1;t.dashCharges[n]=a,t.dashCd[n]=a<r?pl(e):0`]</small> At level 5, refilling all 4 charges from empty takes 4 × 3.5 = 14 s.

Butter Socks alone reaches 30% dash-cooldown reduction. With the variety rules enabled, dash reduction uses the raw bonus up to 100%, with a 0.75 s minimum recharge, rather than the ordinary 60% stat cap. Butter Socks alone does not reach that floor.<small>[sim-sB5IBoT-.js: `let t=Math.min(e.loadout.totals.dashCooldown,1),n=T(e.cfg.dash.cooldownSec*(1-t));return Math.max(n,GS(e))`]</small>

During a dash Tibo ignores ordinary damage.<small>[sim-sB5IBoT-.js: `if(a.invuln[o]>0||a.stunTicks[o]>0||e.over||!r&&ul(e))return!1`]</small> A dash lasts 9 ticks (0.15 s at 60 ticks per second) and covers 48 units (see [Controls](/controls)).

## Tips

- **Pair it with Julienne Dash.** [Julienne Dash](/weapons/julienne-dash) and its evolution Waffle Cut attack on each dash, so extra charges mean more attacks in a burst.
- [Tot Stampede](/weapons/tot-stampede) counts distance walked and fires every 40 units. Dash movement counts toward that distance: each tick adds Tibo's movement up to 12 units.<small>[sim-sB5IBoT-.js: `Math.min(12,b(a.x[o]-a.px[o],a.y[o]-a.py[o]))`]</small> One 48-unit dash is enough for a tot.
