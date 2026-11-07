## Overview

Moss the Border Collie is one of the eight ordinary breeds. Tibo recruits it by walking onto a [Stray Dog](/points-of-interest#stray-dog) that rolls Border Collie (weight 10 of 80). Another Collie stray later levels it up.

Every 2.5 seconds Moss shoves every pest within 46 units of Tibo straight away from him. The pest's own radius is added to that range. Bosses are never pushed. Its aura adds +3% move speed (+12% at level 5). Training widens the circle to about 72 units, raises the push from 260 to about 633, and cuts the interval to about 1.3 s at level 5.

## How it works

- The circle is centred on Tibo, not on Moss. Its radius grows with the square root of power (`46 × √power`); the push grows with power itself. <small>[sim-sB5IBoT-.js: `(e,n.radius*Oi(r),n.push*r,c,i.breed[t])`]</small>
- Each pest's push is scaled by `1 − mass`. Pests with mass 0, such as [Aphid](/enemies/aphid), take the full shove. [Mud Golem](/enemies/mud-golem) (mass 0.8) takes 20% of it, and [Hay Bale](/enemies/hay-bale) (mass 1) does not move at all. Tibo's knockback stat plays no part. <small>[sim-sB5IBoT-.js: `p=n*(1-c.mass[l])`]</small>
- If no pest is in range, Moss checks again every 0.25 s, and the interval only restarts after a shove that hit something. So after a quiet stretch, the first pest to step close is pushed almost at once. <small>[sim-sB5IBoT-.js: `Dw(e,s,c.ability,l)?(n.cd[s]=T(Ei(c,n.level[s])),kr(e,n.breed[s])):n.cd[s]=bw`]</small>

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; Moss added at Tibo's side and trained with the sim's own dog-join and dog-level-up functions; HP refilled every tick; Tibo standing still; level-ups taking the first offer; 150 s; shoves timed from the game's `dogAbility` events): the shortest gap between shoves was 2.5 s at level 1 (5 of 9 gaps) and 1.3 s at level 5 (21 of 39). The other gaps were longer. That is likely Moss waiting for a pest to come in range (inference; the run did not log pest distances).

## Tips

- **Use Moss against crowds pressing in.** The circle is small: 46 units is only slightly more than Tibo's base 40-unit pickup range. Moss is for crowds pressing against Tibo, not for keeping distance from ranged pests.
- The shove does nothing to bosses or very heavy pests. If those are the threat, a [Corgi](/dogs/corgi) or [Link](/dogs/pomeranian) fits better.
- At level 5 Moss's move-speed aura equals one and a half levels of [Spud Sneakers](/passives/spud-sneakers) (+8% per level). The [Greyhound](/dogs/greyhound) gives twice as much.
