## Overview

Spicy Croquette is a rare item that makes some of Tibo's weapon hits explode. Each weapon hit has a 12% chance to set off a blast at the enemy it hit. The blast deals 80% of that hit's damage to every enemy within 32 units. With no luck, the full pool eligible and no weapon-catalyst weight bonuses, it is about 0.46% of random item rolls (10% Rare × 6/131).

Because the blast copies a share of the triggering hit, it grows with everything that makes the hit bigger: damage bonuses, elite damage and crits. The enemy that was hit is inside the blast, so it takes the extra 80% as well.

It evolves into [Magma Croquette](/items/magma-croquette) when [Big Bowl](/passives/big-bowl) is at level 5 and you open a chest (see [Evolutions](/evolutions#item-evolutions)).

## How it works

- **What can trigger it.** Only hits from Tibo's weapons. Hits from item effects (including other blasts), thorns and dogs never trigger it, so procs cannot chain into each other. <small>[sim-ByUaSHJI.js: `h=m>=0&&m<7&&l>0`]</small>
- **Rate limit.** Besides the 12% roll, the item can fire at most 12 times per second. It works like a token bucket: it refills at 12 per second and holds at most one second's worth, and every blast spends one. <small>[sim-ByUaSHJI.js: `n.rate>0&&(n.tokens=Math.min(n.rate,n.tokens+n.rate*t))`]</small> Fast, many-hit weapons can hit that cap; slow, heavy hits rarely do.
- **Stacking.** With *n* copies, the chance becomes `1 − 0.88^n` and the cap becomes 12 × *n* per second: 22.6% and 24/s with two, 31.9% and 36/s with three. <small>[sim-ByUaSHJI.js: `e.chance=function(e,t){return 1-Ke(1-Math.min(1,Math.max(0,e)),t)}(r.chance,t),e.rate=r.perSec*t`]</small>
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added with `giveItem`; Peeler, Small Fry, Tot Toss, Chip Shuriken, Starch Chain and Seeker Sprouts each given 5 times with `give`; `warp(240)`; HP refilled every tick; Tibo walking a slow circle; later level-ups taking the first offer). Over 180 s on seeds `s1`–`s5`, 11.7% of 22,789 rolls set off a blast with one copy (expected 12%), and 31.9% of 20,501 with three (expected 31.9%). With the chance set to 100% in the scenario (120 s, seeds `s1`–`s3`), one copy fired 11.8–11.9 blasts per second. In single one-second windows it fired up to 22, which a full bucket plus one second of refill (24) allows. Two copies fired 14.3–14.7 per second, above one copy's limit, so the doubled limit of 24 was not reached in these runs.
- **Size.** The radius grows with the square root of Tibo's area multiplier. Blast hits roll crits on their own.

## Tips

- **Take extra copies; none are wasted.** Copies are not wasted when it evolves: every Spicy Croquette you hold becomes a Magma Croquette.
- While you hold the croquette, Big Bowl is offered more often on level-up cards (×4 weight), which helps reach level 5 (see [Level-up](/level-up#offer-weights)).
