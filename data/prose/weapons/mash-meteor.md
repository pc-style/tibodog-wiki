## Overview

Mash Meteor evolves [Mash Landing](/weapons/mash-landing). Max Mash Landing at level 8, hold the **item** [Mash Splat](/items/mash-splat), then open a [chest](/chests). Each dash ends in a larger mash shockwave; a second, wider blast follows at the same spot.

## How it works

- **Land the first hit.** The dash-end blast deals **750 base damage** in radius `52 × √Area`: about **65.8 units** with the weapon's Area 1.6 and no Area bonus. Its cooldown is 0.6 s; this is the weapon cooldown, not an extra dash charge. <small>[start-rows-BZ3sFsnw.js: `damage:750,cooldown:.6,amount:1,area:1.6`]</small> <small>[sim-BYbipzJm.js: `return e.radius*Math.sqrt(t.area)`]</small>
- **Leave room for the echo.** After **0.35 s** (21 ticks), the second blast deals **90% damage**—675 base—and reaches **1.75× farther**, about **115.1 units** at those stats. It stays at the landing position, not Tibo's new position. Both blasts can hit the same pest; the echo does not create another echo. <small>[start-rows-BZ3sFsnw.js: `` kind:`mashLanding`,radius:52,echo:{delay:.35,reach:1.75,share:.9} ``]</small> <small>[sim-BYbipzJm.js: `i.due[a]=-1,J(e,r.damage*n.share,t.src,t.slot,r.knockback),MS(e,i.x[a],i.y[a],i.r[a])`]</small>
- **Find the item catalyst.** Mash Splat is not a passive, so the level-up's passive guarantee cannot supply it. When you hold Mash Landing but lack Mash Splat, eligible item rolls give it **double its usual item weight**, not twice the rarity chance. That bonus ends once you own the catalyst. poteto's gift can supply the missing item even when all passive slots are full. <small>[sim-BYbipzJm.js: `return Cd(e,t)?e.cfg.economy.catalystItemWeight:1`]</small> <small>[intro-shared-C842JKPa.js: `catalystItemWeight:2`]</small>

**Controlled tests:** original `main-BEITxKNf.js` and `main-B5vmsjVi.js`, Standard/Normal, seeds `s1/s2/s3`, weapon grants, one-second initialization and HP refill. Original chest rewards evolved only new level-8 Mash Landing with Mash Splat; level 7 and missing-item controls did not. Clockwork Spud's passive recipe still worked. Real Game.dash/Game.step with three high-HP original pests held at horizontal offsets 0, 80 and 125 units gave Mash Meteor 750 damage on landing and another 1,350 from two echo hits 21 ticks later, for 2,100 total; Mash Landing stayed at 90 on both builds. Original poteto gift controls supplied Mash Splat on the new build, including with six passive slots full. With two supplied equal-weight, same-rarity item candidates, the original seeded selector chose missing Mash Splat 612–614 times in 900 draws; held controls excluded it because it has a one-stack limit. These are controlled acquisition, target and candidate-pool fixtures, not natural drop odds, practical DPS or server acceptance.

## Tips

- **Dash where the pack will be.** The wider blast is delayed, so leave a crowd chasing through your landing spot.
- **Check your items, not passive slots.** Mash Splat is the recipe's item catalyst; filling a passive slot will not replace it.
