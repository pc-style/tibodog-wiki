## Overview

Hot Pepper is a Common item that adds 0.03 crit points per copy. Crit points become a crit chance through the curve `x / (1 + x)` ([Stats](/stats#diminishing-returns)). One Hot Pepper alone gives 2.9% crit chance, and a crit deals ×2 damage unless you add crit damage.

It has weight 10 out of 80 among Common items, about 7.4% of item rolls at luck 0, which makes it one of the items you will see most often. Copies stack with no cap. It has no evolution.

## How it works

Crit points add to [Hot Sauce](/passives/hot-sauce) (0.06 per level) before the curve is applied. Maxed Hot Sauce gives 0.30 points (23.1%), and one Hot Pepper on top raises that to 0.33 points (24.8%). The crit roll applies to every damage instance, including burn ticks and item blasts ([Stats](/stats#crit)).

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; copies added with `giveItem`): the game's `critChance` stat read 0.0291, 0.0566, 0.0826 and 0.1071 for 1 to 4 copies. Each copy adds less than the one before, as the curve predicts.

## Tips

- On its own, Hot Pepper is a small bonus. It is worth more when crits are already strong, for example with [Crit Chip](/items/crit-chip) or [Sour Cream](/passives/sour-cream).
