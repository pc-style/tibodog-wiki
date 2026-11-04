## Overview

Mezzaluna is a melee chopper that gets stronger as Tibo gets hurt. Every 1.5 s it chops twice (1 plus Tibo's built-in +1 amount, see [Stats](/stats)), 0.12 s apart: first on the side Tibo faces, then behind him. Each chop hits every pest in a 58 × 26 box (× Area) beside Tibo. The damage multiplier depends on missing HP: 0.8× at full HP, 1.5× at half HP, up to 2.2× near 0 HP.

From level 5 the chop behind Tibo also flicks shreds back through the crowd: 1 at level 5, one more each level, 4 at level 8. It is offered as a level-up card. At level 8, with [Rotten Spud](/passives/rotten-spud) at any level, the next [chest](/chests) evolves it into [Moon Cleaver](/weapons/moon-cleaver).

## How it works

- **Low-HP bonus.** Damage is multiplied by `0.8 + (lowHpBonus + 0.2) × missing HP fraction`, where 0.2 is the game's `hpEdge.fullHpPenalty`. With `lowHpBonus` 1.2, that runs from 0.8× to 2.2×. The shreds inherit the multiplied damage. <small>[sim-CrpXuTSY.js: `return 1-r+(t.hpEdge.lowHpBonus+r)*n`]</small>
- **Sides.** Slash weapons alternate sides within a volley: the 1st and 3rd swings go to the side Tibo faces, the 2nd and 4th to the other side. Only left or right counts here, so "front" is whichever side Tibo faces horizontally. <small>[sim-CrpXuTSY.js: `u=a%2==0?l:-l`]</small>
- **Shreds.** With `fling.back`, only the rear chop flings. The shreds fly backwards, fanned over ±0.3 rad, at 150 units/s for 0.7 s × Duration, pass through pests and deal 0.4× the chop's damage. A pest can be hit by this weapon's shreds once per second. <small>[sim-CrpXuTSY.js: `n.fling===void 0||!0===n.fling.back&&u===l||vf(`]</small>

## Tips

- At full HP Mezzaluna does 20% less than its listed damage. It only beats the listed number once Tibo is below about 86% HP.
- Healing works against the bonus, so the weapon rewards playing at low HP. [Rotten Spud](/passives/rotten-spud), the catalyst, adds [curse](/curse), which makes pests stronger and more numerous, so the evolution is a risky build.
