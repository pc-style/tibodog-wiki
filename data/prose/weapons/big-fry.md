## Overview

Big Fry is the evolution of [Small Fry](/weapons/small-fry). To get it, have Small Fry at level 8 and own [Fertilizer](/passives/fertilizer), then open a [chest](/chests). See [Evolutions](/evolutions).

Every 0.45 s it fires 3 fries at the nearest pest, 0.06 s apart. The fries pierce without limit. Like Small Fry, it gains damage from its kills, now +0.08 raw damage per kill up to +25. The fries also get bigger as the kill count rises, up to three times their starting size.

## How it works

- **Kills carry over.** Evolving swaps the weapon's definition and resets its level, but keeps its kill counter. <small>[sim-CrpXuTSY.js: `r.def=n,r.src=I(e,n.id,jr(n.id)),r.level=1,r.raw=_s(n,1),r.cd=0`]</small> Big Fry's bonuses are worked out from the combined count. Example: a Small Fry that evolves at 240 kills becomes a Big Fry with 10 + 19.2 = 29.2 raw damage and fries 1.4× their base size.
- **Damage bonus.** The bonus is `min(25, 0.08 × kills)`, added before Tibo's damage multiplier. It is maxed at 313 kills, for 35 raw damage per fry.
- **Size bonus.** The fry's radius is multiplied by `min(3, 1 + kills / 600)`: double size at 600 kills, triple at 1200. <small>[sim-CrpXuTSY.js: `function Df(e,t){return Math.min(e.cap,t*e.perKill)}function Of(e,t){return!0===e.size?Math.min(3,1+t/600):1}`]</small>
- **Unlimited pierce and re-hits.** Weapons with 99 pierce get unlimited pierce, and pierce bonuses do not change that. <small>[sim-CrpXuTSY.js: `n.pierce=i.pierce>=99?-1:i.pierce+r.pierceBonus`]</small> In exchange, a pest can only be hit by this weapon once every 30 ticks (0.5 s). That timer is shared by all of Big Fry's fries. <small>[sim-CrpXuTSY.js: `i=8*z(n)+Math.max(0,e.projectiles.slot[t]);return!(e.tick-r.hitStamp[i]<e.projectiles.rehit[t]`]</small> If two fries reach the same pest within 0.5 s, only the first one damages it.
- **Aim.** It targets the same way as Small Fry: the nearest pest within 224 units, and it holds fire when none is in range.

## Tips

- Against one tough target such as a [boss](/bosses), the shared re-hit timer caps Big Fry at 2 hits per second, however many fries it fires. Its strength is long lines of pests, where every fry passes through all of them.
- Kill bonuses carry over, so a Small Fry with many kills makes a stronger Big Fry from the start. The damage cap is reached long before the size cap.
