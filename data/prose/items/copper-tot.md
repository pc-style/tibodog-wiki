## Overview

Copper Tot rolls a 25% chance each time Tibo collects a gold pickup. On success it hits one random eligible pest on screen for 48 damage per copy at the start of a run, growing with run time, before the normal hit rules such as crits and elite bonuses. Extra copies increase damage, not the 25% chance.

## How it works

- **Pick up gold, rather than just earn it.** The trigger is in the gold-pickup path, not the generic gold balance update. [Spud Purse](/items/spud-purse) coins qualify when collected; directly credited chest gold is not a gold pickup. <small>[sim-CIRjlckB.js: `e.counters.coins++,e.moreVariety!==void 0&&Bc().gold(e)`]</small>
- **It needs a visible pest.** Bosses are excluded. Hidden, invalid and off-screen targets are filtered before the chance roll. One successful pickup hits one target, not every pest, and the coin's value does not increase the number of rolls. <small>[sim-CIRjlckB.js: `!U(r)&&kd(e,r)&&Vd(e,q(e,r),J(e,r),Id(e,r))`]</small>
- **Its zap grows during the run.** Since build 266 the queued damage is `48 × copies × damage multiplier × (1 + 0.2 × run minutes)` in Open World (0.15 per minute in Story), the shared item-time scaling: 48 per copy at 0:00, 144 at 10:00 and 192 at 15:00 with no damage bonus. Later shared hit modifiers still apply. <small>[sim-CIRjlckB.js: `Y(e,n.damage*r*yb(e)`]</small> <small>[sim-CIRjlckB.js: `function yb(e){let t=e.cfg.items.powerPerMinute;return e.loadout.stats.damageMult*(1+t*e.runClock/60)}`]</small>

## Tips

- **Collect a coin trail while pests are visible.** [Big Gust](/events/big-gust) can bring distant coins to Tibo, but Copper Tot still chooses from the pests on screen when each coin is collected.
