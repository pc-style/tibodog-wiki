## Overview

Crit Chip is a Rare item that adds 0.25 to the crit damage multiplier per copy. Crits normally deal ×2 damage, so one chip makes them deal ×2.25. Crit damage has no diminishing returns: each copy adds the same flat 0.25, and copies stack with [Sour Cream](/passives/sour-cream) (0.2 per level).

It has weight 6 out of 53 among Rare items, about 1.1% of item rolls at luck 0. It has no evolution.

## How it works

Crit chance and crit damage both apply to every damage instance, not just weapon hits. Burn ticks, item blasts and Boom Spud explosions can crit too. Tibo starts with no crit chance. It comes from [Hot Sauce](/passives/hot-sauce), [Hot Pepper](/items/hot-pepper) and weapons with their own crit bonus, such as [Gratin Arc](/weapons/gratin-arc) ([Stats](/stats#crit)).

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; copies added with `giveItem`): the game's `critMult` stat read 2.25, 2.5 and 2.75 for 1 to 3 copies. Each copy adds the same 0.25.

## Tips

- Crit Chip does nothing without crit chance. Each chip raises average damage by crit chance × 0.25 of a normal hit. With maxed Hot Sauce (23.1% crit) that is +5.8% of a normal hit, or about 4.7% more than Tibo dealt before.
- It is best once crit chance is already high, because the value of crit damage grows with how often you crit.
