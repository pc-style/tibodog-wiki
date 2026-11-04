## Overview

Sour Cream makes critical hits hit harder. A crit normally multiplies damage by ×2. Each level of Sour Cream adds 0.2, so crits deal ×2.2 at level 1 and ×3.0 at level 5. It does nothing on its own if Tibo rarely crits.

It is the catalyst for [Hashnado](/weapons/hashnado), the evolution of [Hash Boomerang](/weapons/hash-boomerang).

## How it works

The crit multiplier is `2 + crit damage` (see [Stats](/stats#crit)), with no cap. It applies only to hits that roll a crit, so the average gain depends on crit chance. With crit chance *p*, average damage is multiplied by `1 + p × (crit multiplier − 1)`:

| Crit chance | No Sour Cream (×2) | Sour Cream level 5 (×3) |
|---|---|---|
| 0% | ×1.00 | ×1.00 |
| 2.9% ([Hot Pepper](/items/hot-pepper) only) | ×1.03 | ×1.06 |
| 23.1% ([Hot Sauce](/passives/hot-sauce) level 5) | ×1.23 | ×1.46 |
| 48.1% ([Gratin Arc](/weapons/gratin-arc) with Hot Sauce level 5) | ×1.48 | ×1.96 |

These values are computed from the crit formula.

The other crit damage source is [Crit Chip](/items/crit-chip) (+0.25).

## Tips

- Take Sour Cream after you have a real crit chance, usually from Hot Sauce. Before that it mainly serves as the catalyst for Hashnado.
- Crit damage has no diminishing returns, unlike crit chance, so once you crit often it keeps its full value per level.
