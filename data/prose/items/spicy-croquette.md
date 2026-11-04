## Overview

Spicy Croquette is a rare item that makes some of Tibo's weapon hits explode. Each weapon hit has a 12% chance to set off a blast at the enemy it hit. The blast deals 80% of that hit's damage to every enemy within 32 units. With no luck it is about 1.1% of random item rolls (10% Rare × 6/53).

Because the blast copies a share of the triggering hit, it grows with everything that makes the hit bigger: damage bonuses, elite damage and crits. The enemy that was hit is inside the blast, so it takes the extra 80% as well.

It evolves into [Magma Croquette](/items/magma-croquette) when [Big Bowl](/passives/big-bowl) is at level 5 and you open a chest (see [Evolutions](/evolutions#item-evolutions)).

## How it works

- **What can trigger it.** Only hits from Tibo's weapons. Hits from item effects (including other blasts), thorns and dogs never trigger it, so procs cannot chain into each other. <small>[sim-CrpXuTSY.js: `g=h>=0&&h<7&&u>0`]</small>
- **Rate limit.** Besides the 12% roll, the item can fire at most 12 times per second. It works like a token bucket: it refills at 12 per second and holds at most one second's worth, and every blast spends one. <small>[sim-CrpXuTSY.js: `n.rate>0&&(n.tokens=Math.min(n.rate,n.tokens+n.rate*t))`]</small> Fast, many-hit weapons can hit that cap; slow, heavy hits rarely do.
- **Stacking.** With *n* copies, the chance becomes `1 − 0.88^n` and the cap becomes 12 × *n* per second: 22.6% and 24/s with two, 31.9% and 36/s with three. <small>[sim-CrpXuTSY.js: `e.chance=function(e,t){return 1-x(1-Math.min(1,Math.max(0,e)),t)}(r.chance,t),e.rate=r.perSec*t`]</small>
- **Size.** The radius grows with the square root of Tibo's area multiplier. Blast hits roll crits on their own.

## Tips

- Copies are not wasted when it evolves: every Spicy Croquette you hold becomes a Magma Croquette.
- While you hold the croquette, Big Bowl is offered more often on level-up cards (×4 weight), which helps reach level 5 (see [Level-up](/level-up#offer-weights)).
