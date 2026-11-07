## Overview

Russet Ricochet evolves [Skipping Cannonball](/weapons/skipping-cannonball). It fires two cannonballs in a fan along Tibo's facing direction. Each bounce bursts, then throws a smaller spud toward a nearby pest. The spud bursts once and does not throw another spud.

## How to get it

**Max Skipping Cannonball to level 8 and own [Sprouting Eyes](/passives/sprouting-eyes) at any level**, then open a [chest](/chests). Sprouting Eyes stays in your passive slots. <small>[start-rows-D9LqSxDr.js: `` from:`skipping-cannonball`,catalyst:`sprouting-eyes` ``]</small>

## How it works

- **Two balls, not one ball per amount.** The two parent shots point 14° to either side of Tibo's facing. Amount adds bounces to each ball, not more fan shots. The hop count is 3 plus the final amount above `1 + player.baseAmount`, with no negative extra hops. <small>[sim-DnXbkcN3.js: `return t.hops+Math.max(0,Math.round(n.amount)-r)`]</small>
- **Later bounces grow.** At bounce number n, starting at 1, the burst radius is `(23 + 5 × (n − 1)) × √area`, and damage is `weapon damage × (1 + 0.25 × (n − 1))`. The configured 0.28-second hop gap rounds to 17 simulation ticks, about 0.283 seconds. Speed controls the distance between bounces, with a minimum of 80 units/second. <small>[sim-DnXbkcN3.js: `return e.radius[t]+e.grow[t]*(n-1)`]</small> <small>[sim-DnXbkcN3.js: `return e.damage[t]*(1+e.damageGrow[t]*(n-1))`]</small>
- **Each burst throws one spud.** It aims at the nearest eligible pest or boss whose center is less than 110 units from that burst. The spud travels to that position in 15 ticks (0.25 seconds); it does not keep steering after launch. With no target in range, it travels 34 units at an alternating ±55° angle from its parent's path. <small>[sim-DnXbkcN3.js: `i=Xl(e,t.x,t.y,n.spudSeek[r])`]</small> <small>[sim-DnXbkcN3.js: `let a=t.k%2==1?n.side[r]:-n.side[r]`]</small>
- **The spud is a smaller second burst.** Its radius is `14 × √area` and its damage is 60% of the parent bounce's damage, including that bounce's growth. It has one hop and no spud-spawning behavior. Parent balls, spuds and ordinary cannonballs share a 64-entry pool; a full pool can prevent another shot or spud from spawning. <small>[sim-DnXbkcN3.js: `r.damage[i]=LS(r,t,n)*r.spudShare[t]`]</small> <small>[sim-DnXbkcN3.js: `r.hops[i]=1,r.burst[i]=0,r.kind[i]=g_.spud`]</small>

## Tips

- **Face into the crowd.** The fan follows where Tibo faces, not a separately chosen aim direction.
- **Keep Sprouting Eyes.** It is both the evolution catalyst and a source of extra bounces. Area enlarges the parent and spud bursts; it does not enlarge the 110-unit target search.

Original-engine controls on build 102 checked the fan, bounce timing, damage growth, target-range boundary, spud expiry and full pool. A three-seed combat fixture dealt damage with the evolved weapon while the base cannon's old/new results matched. These tests granted equipment and held level-ups; they are not natural acquisition, normal DPS or server-validation measurements.
