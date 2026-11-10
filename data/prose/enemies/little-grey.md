## Overview

The Little Grey is a tier-1 pest of the [Crop Circle](/biomes/crop-circle) landmark, alongside the [Aphid](/enemies/aphid). The biome text suggests where it came from: “Something landed here and left its crew behind.” Tier 1 makes up most spawns in the opening minutes and leaves the wave table after minute 6; with Normal's two-minute [tier lag](/modes) that means up to about 8:59.

It walks straight at Tibo at speed 40, a little faster than most tier-1 pests, and has 9 HP and 3 contact damage. It gives 1 XP and has a 4% chance to drop gold. The Crop Circle multiplies XP drops by 1.2, the highest XP multiplier of any biome.

## How it works

It has no special behaviour: the `chase` kind just uses the default movement straight towards Tibo. <small>[sim-B1TRz8tn.js: `` case`chase`:case`tank`:case`splitter`:return; ``]</small> With mass 0 it takes full knockback.

When the shooter cap is full, tier-2 spawns in a Crop Circle fall back to tier 1, because the [Spittlebug](/enemies/spittlebug) is the only tier-2 pest there. Early in a run that can mean more Little Greys than the tier weights alone would give.

## Tips

- **Chase the Lost Saucer before it escapes.** It is frail; its threat is numbers. When Tibo first enters a Crop Circle, the [Lost Saucer](/events/lost-saucer) event also starts, and the saucer is worth chasing before it escapes.
