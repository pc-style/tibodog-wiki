## Overview

The Potato Beetle is the tier-2 pest of [Potato Field](/biomes/potato-field), where every run starts, and shares tier 2 of [Peel Forest](/biomes/peel-forest) with the [Wireworm Larva](/enemies/wireworm-larva). Tier 2 is in the wave table from the start, at one pick in nine, and becomes the main tier from minute 3 until it leaves after minute 9. With Normal's two-minute [tier lag](/modes) that means up to about 11:59. <small>[intro-shared-D7wrQHl9.js: `{minute:3,minEnemies:90,maxEnemies:150,interval:.6,batch:5,tiers:[1,2,0,0,0]`]</small>

It is a plain chaser, about twice as tough as the tier-1 pests around it: speed 36, 20 HP, 6 contact damage. It gives 2 XP and has a 5% chance to drop gold.

## How it works

It has no special behaviour: the `chase` kind just uses the default movement straight towards Tibo. <small>[sim-BtjJ7SxK.js: `` case`chase`:case`tank`:case`splitter`:return; ``]</small> Its mass of 0.2 means knockback moves it 80% as far as a massless pest. <small>[sim-BtjJ7SxK.js: `f=o*e.loadout.stats.knockbackMult*(1-s)*70`]</small>

Tier 2 is also the elite tier from 1:00 to 4:59, so an elite that spawns in Potato Field before 5:00 is a Potato Beetle, with the elite's much higher HP and 1.6× damage (see [Elites](/enemy-scaling#elites)).

## Tips

- **Weak weapons need two or more hits.** On its own it is not dangerous. With more than twice the HP of the tier-1 pests, it is where weak early weapons first start to need two or more hits per kill.
