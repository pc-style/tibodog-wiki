## Overview

Potato Field is where every run starts. Everything within 380 units of the starting point is Potato Field, whatever the climate there would be. <small>[sim-lhAs_O8g.js: `if(e*e+t*t<r.safeStartRadius*r.safeStartRadius)return this.startBiome`]</small> Beyond that it is an ordinary climate biome covering mild, dry ground (the second-coldest of four temperature bands, dry side), so you also find it elsewhere on the map. It usually borders [Frozen-Fries Tundra](/biomes/frozen-tundra) where it gets colder, [Chip Canyons](/biomes/chip-canyons) where it gets warmer and [Peel Forest](/biomes/peel-forest) on the wet side. <small>[sim-lhAs_O8g.js: `e<-.22?0:e<.02?1:e<.24?2:3}(o),s<0?0:1)`]</small> It has no ground hazard.

[Sprout Mites](/enemies/sprout-mite) and [Aphids](/enemies/aphid) are the first pests most players see, followed by [Potato Beetles](/enemies/potato-beetle) (tier 2). Tier 3 has three pests: charging [Field Crows](/enemies/field-crow), the ranged [Blight Spore](/enemies/blight-spore) and the slow, tanky [Reset Zombie](/enemies/reset-zombie), which spawns in no other biome. [Moles](/enemies/mole) (tier 4) and [Mud Golems](/enemies/mud-golem) (tier 5) finish the list. Gold and XP are both ×1, the baseline.

[Crop Patches](/points-of-interest#crop-patch) are more common here than in any other climate biome (weight 4), and [Spud Shrines](/points-of-interest#spud-shrine) have weight 3. [Boss Lairs](/points-of-interest#boss-lair) are the rarest of any biome that has them (0.3). [Beetle Nests](/points-of-interest#beetle-nest), [Microwaves](/points-of-interest#microwave) and [Moldy Shrines](/points-of-interest#moldy-shrine) have weight 1.

## How it works

### The starting area

Points of interest near the start are limited by distance, measured from the start to the centre of the chunk. Within 500 units there are no [Beetle Nests](/points-of-interest#beetle-nest), Bot Docks, Spud Whetstones, Dinner Bells, Tater Slots, Seed Vaults, Tater Magnets, Root Tunnels, Tater Lanterns, Spud Freezers, Frenzy Fryers, Golden Spud Shrines or Dog Kennels, and Boss Lairs need 1200 units. The starting chunk gets neither. <small>[sim-lhAs_O8g.js: `` if(e.kind===`bossLair`&&e.dist<1200)return 0 ``]</small> So the first screens offer crates, shrines, Fry Carts, Microwaves, Crop Patches and stray dogs, plus the first [Stray Dog](/points-of-interest#stray-dog), placed about 110 units from the start. Landmark biomes are never placed over the starting area.

### Pests and loot

Tiers follow the wave row of two minutes earlier (three on Easy; see [Wave schedule](/bosses#wave-schedule)). On Normal, mites and aphids are most spawns until 5:00 and stop at 9:00; beetles lead from 5:00 to 8:00; crows, spores and zombies join at 6:00 and lead from 8:00 to 11:00; Moles join at 9:00 and lead until 18:00; Mud Golems join at 16:00 and are the only wave pest from 21:00. <small>[sim-lhAs_O8g.js: `let n=rt(Math.max(0,e.spawnRng.weightedIndex(t.tiers))+1)`]</small> Each pest in a tier is equally likely, except that the Blight Spore is skipped while the shooter cap is full (see [Crowd limits](/enemy-scaling#crowd-limits)).

Pests use the table of the biome just off screen where they spawn, so walking towards another biome brings in its pests before you cross the border. <small>[sim-lhAs_O8g.js: `e.scratch.biomeX=n.x[r]+l*s,e.scratch.biomeY=n.y[r]+u*s`]</small> Elites from the field are Potato Beetles until 5:00, a tier 3 pest until 10:00, Moles until 15:00 and Mud Golems after that.

## Tips

- **Use Crop Patches for early coins.** The start area has no hazards and only basic points of interest. Crop Patches here are a safe early source of coins and the occasional heal.
- Leaving the field is the quickest way to raise gold or XP income: every neighbour pays at least as much, and some pay more.
- Reset Zombies are slow (base speed 21) but have 80 base HP. You can usually walk away from them.
