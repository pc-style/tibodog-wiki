## Overview

The Sprout Mite is a tier-1 pest of [Potato Field](/biomes/potato-field), where every run starts, and of [Peel Forest](/biomes/peel-forest). It shares the tier with the [Aphid](/enemies/aphid) in both, so it is among the first pests of most runs. Tier 1 makes up most spawns in the opening minutes and leaves the wave table after minute 6; with Normal's two-minute [tier lag](/modes) that means up to about 8:59. <small>[intro-shared-DMVdMMzj.js: `{minute:0,minEnemies:22,maxEnemies:35,interval:.75,batch:3,tiers:[8,1,0,0,0]}`]</small>

It walks straight at Tibo at speed 34 and has 8 HP and 3 contact damage. It gives 1 XP and has a 3% chance to drop gold.

## How it works

It has no special behaviour: the `chase` kind just uses the default movement straight towards Tibo. <small>[sim-ieBkQqL1.js: `` case`chase`:case`tank`:case`splitter`:return; ``]</small> With mass 0 it takes full knockback.

## Tips

- **Treat mites as a crowd.** With 8 base HP (about 5 at the start of a Normal run, after the ×0.65 [pest HP](/enemy-scaling) multiplier), most weapons kill it in one or two hits. Its threat is numbers: the opening wave rows pick tier 1 for 8 of every 9 spawns.
