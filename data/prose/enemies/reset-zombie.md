## Overview

The Reset Zombie is one of three tier-3 pests of [Potato Field](/biomes/potato-field), alongside the [Field Crow](/enemies/field-crow) and the [Blight Spore](/enemies/blight-spore). Tier 3 is in the wave table from minute 4 to minute 14; with Normal's two-minute [tier lag](/modes) that means about 6:00 to 16:59.

It is also the pest of [Story mode](/story-mode). The story's wave table names the Reset Zombie as the enemy of every row, so it replaces the biome pests as the ordinary spawn there. <small>[sim-BudLQwEM.js: ``case`story`:return Zt.waves``]</small> <small>[sim-BudLQwEM.js: ``tiers:[1,0,0,0,0],enemy:`reset-zombie`}``]</small>

It is the slowest regular pest (speed 21; only the [Hay Bale](/enemies/hay-bale) of the Bale Ring event is slower), with 80 HP and 12 contact damage. It gives 5 XP and has a 10% chance to drop gold.

## How it works

Its `tank` kind has no behaviour of its own: it walks straight at Tibo like a plain chaser. <small>[sim-BudLQwEM.js: `` case`chase`:case`tank`:case`splitter`:return; ``]</small> Its mass of 0.5 halves the knockback it takes.

In Story mode the usual rules for its stats are changed by the story phases: pests have ×3 HP in the first rush, and ×0.3 HP and no XP in the second rush (see [Story mode](/story-mode)).

## Tips

- **Avoid getting boxed in.** At speed 21 it is about a third of Tibo's base speed, so it only catches Tibo when he is boxed in. In a normal run, the faster Field Crows beside it tend to reach Tibo first.
