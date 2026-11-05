## Overview

Butter Socks gives Tibo more dashes and makes them recharge faster. Tibo starts with 1 dash charge and a 5 s recharge. Butter Socks adds 1 charge at levels 1 and 2, 2 at levels 3 and 4, and 3 at level 5, so Tibo holds 2, 2, 3, 3 and then 4 charges. Each level also cuts the dash cooldown by 6%: 4.7 s at level 1, down to 3.5 s at level 5.

It is the catalyst for [Waffle Cut](/weapons/waffle-cut) (from [Julienne Dash](/weapons/julienne-dash)) and [Tot Cavalry](/weapons/tot-cavalry) (from [Tot Stampede](/weapons/tot-stampede)). No other passive, item, dog aura or shrine blessing raises either dash stat.

## How it works

The charge values per level are totals, not increments: the game reads the array entry for the current level.<small>[sim-NFTWJMcM.js: ``function dr(e,t){return t<=0?0:typeof e==`number`?e*t:e[Math.min(t,e.length)-1]??0}``]</small>

Spent charges come back one at a time. When a charge finishes recharging, the next one starts only if Tibo is still below the maximum.<small>[sim-NFTWJMcM.js: `let a=t.dashCharges[n]+1;t.dashCharges[n]=a,t.dashCd[n]=a<r?gs(e):0`]</small> At level 5, refilling all 4 charges from empty takes 4 × 3.5 = 14 s.

Dash cooldown uses the same 60% cap as weapon cooldown (see [Stats](/stats)), but Butter Socks only reaches 30%, so the cap does not matter here. The game also enforces a 0.75 s minimum recharge; neither the normal stat cap (2 s minimum from a 5 s base) nor Butter Socks reaches that floor.<small>[sim-NFTWJMcM.js: `function gs(e){let t=j(e.cfg.dash.cooldownSec*e.loadout.stats.dashCooldownMult);return Math.max(t,function(e){return j(e.cfg.dash.minCooldownSec)}(e))}`]</small>

During a dash Tibo ignores ordinary damage.<small>[sim-NFTWJMcM.js: `if(a.invuln[o]>0||a.stunTicks[o]>0||e.over||!r&&ms(e))return!1`]</small> A dash lasts 9 ticks (0.15 s at 60 ticks per second) and covers 48 units (see [Controls](/controls)).

## Tips

- [Julienne Dash](/weapons/julienne-dash) and its evolution Waffle Cut attack on each dash, so extra charges mean more attacks in a burst.
- [Tot Stampede](/weapons/tot-stampede) counts distance walked and fires every 40 units. Dash movement counts toward that distance: each tick adds Tibo's movement up to 12 units.<small>[sim-NFTWJMcM.js: `Math.min(12,w(a.x[o]-a.px[o],a.y[o]-a.py[o]))`]</small> One 48-unit dash is enough for a tot.
