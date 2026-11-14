## Overview

Mezzaluna is a melee chopper that gets stronger as Tibo gets hurt. Every 1.3 s it chops twice (1 plus Tibo's built-in +1 amount, see [Stats](/stats)), 0.12 s apart: first on the side Tibo faces, then behind him. Each chop hits every pest in a 58 × 26 box (× Area) beside Tibo. Its base damage is 24. The damage multiplier depends on missing HP: 0.8× at full HP, 1.5× at half HP, up to 2.2× near 0 HP.

From level 5 the chop behind Tibo also flicks shreds back through the crowd: 1 at level 5, one more each level, 4 at level 8. It is offered as a level-up card. At level 8, with [Rotten Spud](/passives/rotten-spud) at any level, the next [chest](/chests) evolves it into [Moon Cleaver](/weapons/moon-cleaver).

## How it works

- **Low-HP bonus.** Damage is multiplied by `0.8 + (lowHpBonus + 0.2) × missing HP fraction`, where 0.2 is the game's `hpEdge.fullHpPenalty`. With `lowHpBonus` 1.2, that runs from 0.8× to 2.2×. The shreds inherit the multiplied damage. <small>[sim-hRkN1bXa.js: `return 1-r+(t.hpEdge.lowHpBonus+r)*n`]</small>
- **Sides.** Slash weapons alternate sides within a volley: the 1st and 3rd swings go to the side Tibo faces, the 2nd and 4th to the other side. Only left or right counts here, so "front" is whichever side Tibo faces horizontally. <small>[sim-hRkN1bXa.js: `o=i%2==0?a:-a`]</small>
- **Shreds.** With `fling.back`, only the rear chop flings. The shreds fly backwards, fanned over ±0.3 rad, at 150 units/s for 0.7 s × Duration, pass through pests and deal 0.4× the chop's damage. A pest can be hit by this weapon's shreds once per second. <small>[sim-hRkN1bXa.js: `r===void 0||!0===r.back&&i===a||gk(e,t,n,r,(i>0?0:Math.PI)+.2*E(mk(e)))`]</small>

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 28 units to each side of Tibo): at level 1 it chopped right, then left 0.12 s later, every 1.5 s, for 14.4 (0.8 × 18, Tibo at full HP). At level 8 it chopped every 1.35 s for 48 and the rear chop flung 4 shreds with a 0.875 s lifetime. All three seeds gave the same figures.

## Tips

- **It pays off once Tibo is hurt.** At full HP Mezzaluna does 20% less than its listed damage. It only beats the listed number once Tibo is below about 86% HP.
- Healing works against the bonus, so the weapon rewards playing at low HP. [Rotten Spud](/passives/rotten-spud), the catalyst, adds [curse](/curse), which makes pests stronger and more numerous, so the evolution is a risky build.
