## Overview

The Mole is the tier-4 pest of [Potato Field](/biomes/potato-field), [Compost Caves](/biomes/compost-caves), [Mash Swamp](/biomes/mash-swamp) and the [Crop Circle](/biomes/crop-circle) landmark, and the only tier-4 pest in each. Tier 4 is in the wave table from minute 7 to minute 18; with Normal's two-minute [tier lag](/modes) Moles spawn from about 9:00 to 20:59.

It is a slow, heavy pest. With 110 HP and 16 contact damage it has the most HP and damage of any tier-4 pest, but at speed 30 it moves at less than half Tibo's base speed of 62. It gives 7 XP and has a 12% chance to drop gold.

## How it works

Its `tank` kind has no behaviour of its own: in movement it is identical to a plain chaser and walks straight at Tibo. <small>[sim-BI7WLnza.js: `` case`chase`:case`tank`:case`splitter`:return; ``]</small> What makes it a tank is its stats, including mass 0.6: knockback moves it only 40% as far as a massless pest. <small>[sim-BI7WLnza.js: `d=o*e.loadout.stats.knockbackMult*(1-s)*70`]</small>

Tier 4 is the elite tier from 10:00 to 14:59, so elites in these biomes are Moles then (see [Elites](/enemy-scaling#elites)).

## Tips

- **Keep moving rather than relying on knockback.** It is easy to outwalk, and the danger is getting boxed in by a slow wall of them. Keep moving and don't rely on knockback to hold them off.
