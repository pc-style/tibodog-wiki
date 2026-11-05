## Overview

Wide Ladle is an uncommon item that adds 0.06 area. Copies stack additively. With no luck it is about 2.6% of random item rolls (25% Uncommon × 8/78).

Area bonuses are summed and applied as `1 + total` (see [Stats](/stats#stat-conversion)). One ladle makes weapon areas 6% bigger. [Big Bowl](/passives/big-bowl) gives +0.1 per level.

## How it works

- **Weapons** use the area multiplier for the size of their attacks.
- **Item effects** such as [Spicy Croquette](/items/spicy-croquette) blasts and [Static Tot](/items/static-tot) arc range grow with the square root of the area multiplier, so one ladle makes them only about 3% larger. <small>[sim-JoUvrIFk.js: `function Iu(e){return Math.sqrt(e.loadout.stats.areaMult)}`]</small>

## Tips

- Area is most useful for weapons that hit everything in a zone, such as auras, pools and novas.
