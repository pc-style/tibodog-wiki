## Overview

The Oil Drip is a tier-1 pest of [Chip Canyons](/biomes/chip-canyons) and [Fry-Oil Desert](/biomes/fry-oil-desert), sharing the tier with the [Crumb Ant](/enemies/crumb-ant) in both. Tier 1 makes up most spawns in the opening minutes and leaves the wave table after minute 6; with Normal's two-minute [tier lag](/modes) that means up to about 8:59.

It is slow fodder: it walks straight at Tibo at speed 30 and has 9 HP and 4 contact damage. It gives 1 XP and has a 3% chance to drop gold; coins are worth ×1.1 in Chip Canyons and ×1.25 in Fry-Oil Desert. Its stats are identical to the [Ketchup Drop](/enemies/ketchup-drop).

## How it works

It has no special behaviour: the `chase` kind just uses the default movement straight towards Tibo. <small>[sim-BtJ1ZXuM.js: `` case`chase`:case`tank`:case`splitter`:return; ``]</small> With mass 0 it takes full knockback.

## Tips

- **Crumb Ants reach Tibo before drips.** At speed 30 it is less than half Tibo's base speed of 62. The faster Crumb Ants (speed 46) next to it tend to reach Tibo first.
