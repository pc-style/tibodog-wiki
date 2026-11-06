## Overview

Chive Charm is an Uncommon item that reduces weapon cooldowns by 3% per copy. Copies stack additively with [Chives](/passives/chives) (7% per level) and [GPU](/passives/gpu) (2% per level), and the total cooldown reduction is capped at 60% ([Stats](/stats#stat-conversion)).

It has weight 8 out of 78 among Uncommon items, about 2.6% of item rolls at luck 0. It has no evolution.

## Tips

- **Stack it only below the cooldown cap.** Maxed Chives and GPU together give 45% cooldown reduction, so you would need five more Chive Charms to reach the 60% cap. Below the cap each charm is a small but reliable bonus. At the cap it does nothing. **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; passives given with `give`, charms with `giveItem`): with Chives and GPU at level 5 the game's `cooldownMult` stat read 0.55, then 0.43 with 4 charms and 0.40 with 5, 6 or 20. One to three charms alone read 0.97, 0.94 and 0.91, and 25 charms alone read 0.40.
- The cap does not include fire-rate bonuses such as [Frenzy Fryer](/points-of-interest#frenzy-fryer), which work separately ([Stats](/stats#weapon-details)).
