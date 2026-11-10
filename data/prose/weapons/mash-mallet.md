## Overview

Mash Mallet pounds a nearby pest with a masher. It starts at 41 raw damage and a 2 s cooldown, with a small impact around the selected pest rather than a projectile flying out from Tibo.

At level 8, hold [Masher Grip](/passives/masher-grip) at any level and open a [chest](/chests) to evolve it into [Mash Crater](/weapons/crater-pound).

## How it works

The strike searches within 64 units of Tibo. Each pound selects a pest not already selected by that attack, then hits around that pest with radius 16 × modified Area. More Amount adds pounds, subject to having eligible targets; it does not enlarge each impact. Tibo's ordinary +1 Amount makes the raw Amount 1 become 2 before other bonuses. <small>[sim-CVTo8bBU.js: `let i=lu(e),a=n.size*r.area;for(let o=0;o<r.amount;o++){let o=ou(e,n.range,i);if(o===void 0)return;cu(e,o,i)`]</small>

The official description says “nearest”, but the strike picker uses seeded-random selection among nearby candidates, not distance ranking. In the supplied Amount-1 control on `main-CAVio-MR.js`, seed `s1` selected the pest 50 units away while the pest 20 units away remained untouched. The current `main-sYP4bxZZ.js` simulation is source-identical after normalizing asset filenames, so the same targeting contract applies; this is source-equivalence evidence, not a new current-build gameplay run.

Mash Mallet is melee-tagged, but the game's melee-restricted new-weapon offers and melee starter fill explicitly exclude it, Peel Lash and Skillet Flail. Ordinary offers, including Mech Pilot's unrestricted pool, can include it. See [Modes](/modes#new-melee-weapons-and-set-restrictions).

**Controlled checks:** original build `main-CAVio-MR.js`, Standard/Normal, seeds `wiki`, `s1`, `s2`, granted level-1 weapon, fixed high-HP targets and supplied Amount 1/2: the original strike consumer selected one/two nearby targets and left the out-of-range control untouched. Original old/new offer controls and chest controls verify eligibility and the recipe, not natural acquisition odds, practical DPS or survival.

## Tips

- **Stay close enough to start a strike.** Its initial search is short-ranged even when Area enlarges the impact.
- **Take Masher Grip before your next chest** once the mallet reaches level 8.
