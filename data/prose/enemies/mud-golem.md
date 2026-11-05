## Overview

The Mud Golem is the tier-5 pest of eight of the twelve biomes: [Potato Field](/biomes/potato-field), [Peel Forest](/biomes/peel-forest), [Compost Caves](/biomes/compost-caves), [Mash Swamp](/biomes/mash-swamp), [Frozen-Fries Tundra](/biomes/frozen-tundra), and the [Crop Circle](/biomes/crop-circle), [Coin Laundromat](/biomes/coin-laundromat) and [Gutterball Lanes](/biomes/gutterball-lanes) landmarks. The hot biomes use the [Grease Fiend](/enemies/grease-fiend) instead.

Tier 5 enters the wave table at minute 14 and is the only tier from minute 19 on. With Normal's two-minute [tier lag](/modes), Golems appear from about 16:00, and from about 21:00 every ordinary spawn in these biomes is a Mud Golem. <small>[sim-BfhgrRZL.js: `{minute:19,minEnemies:450,maxEnemies:480,interval:.16,batch:12,tiers:[0,0,0,0,1]`]</small> In [overtime](/enemy-scaling#formula) after 20:00 its HP and damage, like every pest's, multiply by 4 each minute.

It is the heaviest biome pest: 260 HP, 22 contact damage (tied with the Grease Fiend for the most), the largest body (radius 11) and mass 0.8. It is also slow, at speed 28. It gives 12 XP and has an 18% chance to drop gold.

## How it works

Its `tank` kind has no behaviour of its own: it walks straight at Tibo like a plain chaser. <small>[sim-BfhgrRZL.js: `` case`chase`:case`tank`:case`splitter`:return; ``]</small> Its mass of 0.8 means knockback moves it only 20% as far as a massless pest. <small>[sim-BfhgrRZL.js: `d=o*e.loadout.stats.knockbackMult*(1-s)*70`]</small>

Tier 5 is the elite tier from 15:00, so late elites in these biomes are Mud Golems, with 1.7× size and the elite HP curve (see [Elites](/enemy-scaling#elites)).

## Tips

- Its speed of 28 is far below Tibo's 62, so walking away always works before overtime. In overtime pest speed grows by ×1.15 per minute, capped at ×2.2 (see [Enemy scaling](/enemy-scaling)).
- Knockback barely moves it; damage per second matters more than crowd control here.
