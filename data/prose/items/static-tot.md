## Overview

Static Tot is an uncommon item that makes some of Tibo's weapon hits arc lightning. Each weapon hit has a 10% chance to jump to the nearest other enemy within 70 units, then on from there, up to 3 jumps. Each enemy the arc reaches takes 90% of the original hit's damage. With no luck it is about 2.6% of random item rolls (25% Uncommon × 8/78).

The damage does not fall off along the chain: every jump copies 90% of the triggering hit. So a full chain adds up to 2.7× that hit, spread over three extra enemies.

It evolves into [Storm Tot](/items/storm-tot) when [Root Network](/passives/root-network) is at level 5 and you open a chest (see [Evolutions](/evolutions#item-evolutions)).

## How it works

- **Targets.** Each jump goes to the nearest enemy within range of the previous one that this chain has not hit yet. The enemy that was originally hit is excluded. The chain stops early when nothing is in range. <small>[sim-HQr6OS1G.js: `let r=Xi(e,l,u,s,o);if(r===void 0)break;d=!0,ea(e,r,o)`]</small>
- **What can trigger it.** Only hits from Tibo's weapons. Item effects, thorns and dogs cannot trigger it, so arcs do not set off further arcs or [Spicy Croquette](/items/spicy-croquette) blasts.
- **Rate limit.** Besides the 10% roll, it can fire at most 16 times per second. The limit refills continuously and holds at most one second's worth.
- **Stacking.** With *n* copies the chance is `1 − 0.9^n` and the cap is 16 × *n* per second: 19% with two, 27.1% with three. Jumps, range and damage do not change.
- **Range** grows with the square root of Tibo's area multiplier. Arc hits cause no knockback and can crit on their own.

## Tips

- It needs other enemies nearby, so it is strongest against crowds and weak against a lone boss.
- While you hold it, Root Network is offered more often on level-up cards (×4 weight) (see [Level-up](/level-up#offer-weights)).
