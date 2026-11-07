## Overview

Golden Harvest is the evolution of [Potato Rain](/weapons/potato-rain). A chest can evolve it once Potato Rain is at max level and Tibo owns [Golden Fry](/passives/golden-fry) (see [Evolutions](/evolutions) and [Chests](/chests)). Every 2.6 seconds it calls 20 golden potatoes (21 with Tibo's base +1 amount). Each deals 130 damage in a blast of about 25 units (18 × 1.4 area), knocking pests back. It also adds a chance for each pest it kills to drop gold.

Compared with a max-level Potato Rain (14 potatoes, 64 damage, every 3.3 s), it drops more potatoes, hits about twice as hard and fires more often. Its landing area is also wider: a radius of about 146 units instead of 110.

## How it works

- Potatoes land the same way as Potato Rain's: random points around Tibo, each after 0.4 s plus a random time of up to the weapon's duration (2 s, or 2.5 s with Tibo's base +25% duration).
- **Gold on kill.** Each potato hit tags the pest with `goldOnKill` 0.1. When the pest dies, that value is added to its normal gold-drop chance, so a golden potato kill has a 10-percentage-point higher chance to drop a gold coin. <small>[sim-BMwZozX5.js: `r.next()<n.goldChance[t]+n.killGold[t]`]</small>
- The tag is overwritten by each later hit, so only the last hit before the pest dies decides whether the bonus applies. A pest that a golden potato damages but another weapon finishes off does not get it.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it called 21 potatoes on the same tick every 3 s, each with a blast radius of 25.2 and 110 damage. All three seeds gave the same figures.

## Tips

- **Golden Fry still raises gold after evolving.** Golden Fry raises gold gain, and it stays in your build after the evolution, so each extra coin from Golden Harvest is worth more.
