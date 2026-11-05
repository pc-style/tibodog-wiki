## Overview

Mash Swamp is a climate biome covering warm, wet ground (the second-hottest of four temperature bands, wet side). It usually borders [Chip Canyons](/biomes/chip-canyons) on the dry side, [Peel Forest](/biomes/peel-forest) where it gets cooler and [Ketchup Bog](/biomes/ketchup-bog) where it gets hotter. <small>[sim-8NBhUDBM.js: `e<-.22?0:e<.02?1:e<.24?2:3}(a),o<0?0:1)`]</small> Its hazard is patches of knee-deep mash that cut Tibo's walking speed to 55% while he is in them. They do no damage.

The swamp's pests are slow and sturdy. [Bog Slimes](/enemies/bog-slime) and [Ketchup Drops](/enemies/ketchup-drop) open, followed by [Garden Slugs](/enemies/garden-slug) (tier 2), charging [Bog Toads](/enemies/bog-toad) (tier 3, the only pest of that tier here), [Moles](/enemies/mole) (tier 4) and [Mud Golems](/enemies/mud-golem) (tier 5, 260 base HP). Slugs, moles and golems are all tank-type pests. Gold is ×1.1 and XP ×1.05.

Points of interest are spread evenly. [Crop Patches](/points-of-interest#crop-patch), [Microwaves](/points-of-interest#microwave) and [Moldy Shrines](/points-of-interest#moldy-shrine) are a little more common than in most climate biomes (weight 2 each). [Beetle Nests](/points-of-interest#beetle-nest) (1) and [Boss Lairs](/points-of-interest#boss-lair) (0.4) are on the rare side.

## How it works

### Mash patches

Each chunk centred in the swamp gets 3 or 4 patches, each 0.8–1.3 times the base radius of 30 (the largest hazard patches in the game); patches that would fall outside the swamp are dropped. <small>[sim-8NBhUDBM.js: `a=e.rng.int(Math.max(0,t.perChunk-1),t.perChunk)`]</small> While Tibo is inside one, his movement speed is multiplied by 1 − 0.45 = 0.55. Overlapping slow patches do not stack; the strongest one applies. <small>[sim-8NBhUDBM.js: `` r.kind===`slow`||r.kind===`chill`?y=Math.min(y,1-r.strength):ls(e,r.strength*t,$f[r.kind],!0,ee) ``]</small> Ground hazards only affect Tibo, so pests cross the mash at full speed.

A dash covers its full distance even in the mash, because dash movement is added separately from walking speed. <small>[sim-8NBhUDBM.js: `let t=ts(e);_+=n.dashX[r]*t`]</small>

### Pests and loot

Tiers follow the wave row of two minutes earlier (three on Easy; see [Wave schedule](/bosses#wave-schedule)). On Normal, slimes and drops are most spawns until 5:00 and stop at 9:00; slugs lead from 5:00 to 8:00; Bog Toads join at 6:00 and lead from 8:00 to 11:00; Moles join at 9:00 and lead until 18:00; Mud Golems join at 16:00 and are the only wave pest from 21:00. Elites from the swamp are slugs until 5:00, toads until 10:00, Moles until 15:00 and Mud Golems after that.

Pests use the table of the biome just off screen where they spawn, so the swamp's pests start appearing before Tibo crosses the border. <small>[sim-8NBhUDBM.js: `e.scratch.biomeX=n.x[r]+l*s,e.scratch.biomeY=n.y[r]+u*s`]</small> Gold and XP multipliers use the biome where the pest dies.

## Tips

- At base speed Tibo walks at 62 units per second, or about 34 in the mash. That is still faster than the swamp's own walkers (22–30 base speed), but much slower than pests coming in from neighbouring biomes, such as [Field Rats](/enemies/field-rat) (50). Elite speed bonuses and overtime also close the gap.
- Bog Toads dash at 170 regardless of terrain. Avoid standing still in a mash patch when one is lining up.
- Use the dash to cross a patch. It covers the same 48 units in or out of the mash.
