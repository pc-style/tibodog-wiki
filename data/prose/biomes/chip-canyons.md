## Overview

Chip Canyons is a climate biome: it fills the parts of the map that are warm (the second-hottest of four temperature bands) and dry. Because temperature and moisture change smoothly across the map, it usually sits between [Potato Field](/biomes/potato-field) (cooler) and [Fry-Oil Desert](/biomes/fry-oil-desert) (hotter), with [Mash Swamp](/biomes/mash-swamp) on its wet side. <small>[sim-CrpXuTSY.js: `e<-.22?0:e<.02?1:e<.24?2:3}(a),o<0?0:1)`]</small> It has no ground hazard, so nothing on the floor slows or burns Tibo.

The pest list leans on chargers and the fryer crowd it shares with the desert. [Crumb Ants](/enemies/crumb-ant) and [Oil Drips](/enemies/oil-drip) open the run, [Sand Crabs](/enemies/sand-crab) (tier 2) are the canyon's own pest, then come dashing [Field Crows](/enemies/field-crow) and exploding [Sizzle Imps](/enemies/sizzle-imp) (tier 3), [Harvest Mice](/enemies/harvest-mouse) that split into three [Field Rats](/enemies/field-rat) on death (tier 4), and finally the [Grease Fiend](/enemies/grease-fiend), a 200 HP charger (tier 5). Gold is ×1.1 and XP ×1.05.

Compared with the other climate biomes, Chip Canyons has more [Fry Carts](/points-of-interest#fry-cart) (weight 3, tied with the desert for the most), plenty of [Spud Shrines](/points-of-interest#spud-shrine) (3) and [Beetle Nests](/points-of-interest#beetle-nest) (2, the joint highest), and fewer [Crop Patches](/points-of-interest#crop-patch), [Microwaves](/points-of-interest#microwave) and [Moldy Shrines](/points-of-interest#moldy-shrine) (1 each).

## How it works

Wave pests pick a tier from the wave table row of two minutes earlier on Normal, Hard and Nightmare, three on Easy (see [Wave schedule](/bosses#wave-schedule)). On Normal, Crumb Ants and Oil Drips make up most spawns until 5:00 and stop at 9:00; Sand Crabs lead from 5:00 to 8:00; crows and imps join at 6:00 and lead from 8:00 to 11:00; Harvest Mice join at 9:00 and lead until 18:00; Grease Fiends join at 16:00 and are the only wave pest from 21:00. <small>[sim-CrpXuTSY.js: `let n=Bt(Math.max(0,e.spawnRng.weightedIndex(t.tiers))+1)`]</small>

The table used is that of the biome about 256–286 units from Tibo in the direction the pest spawns, just off screen, not the biome under Tibo. Near a border you get a mix of both sides. <small>[sim-CrpXuTSY.js: `e.scratch.biomeX=n.x[i]+d*l,e.scratch.biomeY=n.y[i]+f*l`]</small> Elites use the same table at the elite tier (2 until 5:00, 3 until 10:00, 4 until 15:00, then 5), so an elite spawned from here is a Sand Crab, then a crow or imp, then a Harvest Mouse, then a Grease Fiend. <small>[sim-CrpXuTSY.js: `let a=ja(e,zo(e,i,t.biomeX,t.biomeY),t.x,t.y)`]</small>

The gold and XP multipliers use the biome where the pest dies, not where Tibo stands. <small>[sim-CrpXuTSY.js: `` c=e.world.biomeAt(a,o);if(r.xp[t]>0&&G(e,`xp`,a,o,r.xp[t]*c.xpMult) ``]</small>

## Tips

- With no hazard, this is a comfortable place to fight. The danger is dashes: Sand Crabs, Field Crows and Grease Fiends all charge. A charger in range stops for half a second with its direction locked, then dashes in a straight line, so step sideways when one stops. <small>[sim-CrpXuTSY.js: `i.state[t]=1,i.timer[t]=.5,i.tx[t]=r/s,i.ty[t]=a/s`]</small>
- Kill Harvest Mice where your area weapons can catch the three rats they leave behind.
- The extra Fry Carts make Chip Canyons a good place to shop once you have gold.
