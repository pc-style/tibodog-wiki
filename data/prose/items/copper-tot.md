## Overview

Copper Tot rolls a 25% chance each time Tibo collects a gold pickup. On success it hits one random eligible pest on screen for 48 damage per copy, before the normal hit rules such as crits and elite bonuses. Extra copies increase damage, not the 25% chance.

## How it works

- **Pick up gold, rather than just earn it.** The trigger is in the gold-pickup path, not the generic gold balance update. [Spud Purse](/items/spud-purse) coins qualify when collected; directly credited chest gold is not a gold pickup. <small>[sim-DgGsJ7U5.js: `e.counters.coins++,e.moreVariety!==void 0&&Ai().gold(e)`]</small>
- **It needs a visible pest.** Bosses are excluded. Hidden, invalid and off-screen targets are filtered before the chance roll. One successful pickup hits one target, not every pest, and the coin's value does not increase the number of rolls. <small>[sim-DgGsJ7U5.js: `!Wl(r)&&ql(e,r)&&au(e,K(e,r),q(e,r),eu(e,r))`]</small>
- **Its base hit is not item-time scaling.** The queued damage is `48 × copies`, without the time/global-damage factor used by Spark Spud. Later shared hit modifiers still apply. <small>[sim-DgGsJ7U5.js: `n.damage*r`]</small>

## Tips

- **Collect a coin trail while pests are visible.** [Big Gust](/events/big-gust) can bring distant coins to Tibo, but Copper Tot still chooses from the pests on screen when each coin is collected.
