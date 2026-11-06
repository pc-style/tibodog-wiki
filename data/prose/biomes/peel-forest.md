## Overview

Peel Forest is a climate biome covering mild, wet ground (the second-coldest of four temperature bands, wet side). It usually borders [Potato Field](/biomes/potato-field) on the dry side, [Compost Caves](/biomes/compost-caves) where it gets colder and [Mash Swamp](/biomes/mash-swamp) where it gets warmer. <small>[sim-DJfN0TyV.js: `e<-.22?0:e<.02?1:e<.24?2:3}(a),o<0?0:1)`]</small> Its hazard is thorny brambles that scratch Tibo for 6 HP per second while he stands in them, the weakest damaging hazard in the game.

The forest shares most of its pests with Potato Field. [Aphids](/enemies/aphid) and [Sprout Mites](/enemies/sprout-mite) open, then [Wireworm Larvae](/enemies/wireworm-larva) and [Potato Beetles](/enemies/potato-beetle) (tier 2), the ranged [Blight Spore](/enemies/blight-spore) and fast [Field Rats](/enemies/field-rat) (tier 3), [Harvest Mice](/enemies/harvest-mouse) that split into three Field Rats (tier 4) and [Mud Golems](/enemies/mud-golem) (tier 5). Gold is ×1 and XP ×1.05.

[Spud Shrines](/points-of-interest#spud-shrine) are common (weight 3), and [Crop Patches](/points-of-interest#crop-patch) and [Beetle Nests](/points-of-interest#beetle-nest) have weight 2. [Microwaves](/points-of-interest#microwave) and [Moldy Shrines](/points-of-interest#moldy-shrine) (1) and [Boss Lairs](/points-of-interest#boss-lair) (0.4) are rare.

## How it works

### Brambles

Each chunk centred in the forest gets 2 or 3 bramble patches, each 0.8–1.3 times the base radius of 18; patches that would fall outside the forest are dropped. <small>[sim-DJfN0TyV.js: `a=e.rng.int(Math.max(0,t.perChunk-1),t.perChunk)`]</small> Inside one, Tibo takes 6 damage per second, reduced by [armor](/stats#armor) as if from a level 10 + minutes attacker, so armor blocks less of it as the run goes on. Overlapping patches add up. <small>[sim-DJfN0TyV.js: `` r.kind===`slow`||r.kind===`chill`?ee=Math.min(ee,1-r.strength):ml(e,r.strength*t,HS[r.kind],!0,y) ``]</small>

Bramble damage is unavoidable: dodge is not rolled, dashing does not protect Tibo, and [Hash Brown Shield](/weapons/hash-brown-shield) guard charges are not spent. <small>[sim-DJfN0TyV.js: `if(!r&&s.evasion>0&&e.rng.chance(s.evasion))`]</small> It does not count as a hit, so on-hurt items like [Porcupine Spud](/items/porcupine-spud) do not fire, and its base amount does not change with difficulty or run time. A reset here is listed as “Reset by” “Brambles”.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, seed `wiki`, no `--god`; clock warped to 1:00, then Tibo teleported onto the centre of a bramble patch in this biome; every pest, boss and enemy bullet removed each tick, and HP refilled after each tick): Tibo lost 6 HP per second standing still, over 3 s, with no hit event. With the evasion stat forced to 1 it was still 6 per second, with no dodge event. With Tibo held on the centre during a dash, the dash ticks lost 6 per second too. In the same run, evasion 1 dodged every ordinary pest hit. Easy and Nightmare gave the same rates, and so did seeds `s1` and `s2`, except that on `s1` Tibo was invulnerable (just after a Grok Bot help event) during most of the Ketchup Bog evasion window and took almost no damage then.

### Pests and loot

Tiers follow the wave row of two minutes earlier (three on Easy; see [Wave schedule](/bosses#wave-schedule)). On Normal, aphids and mites are most spawns until 5:00 and stop at 9:00; larvae and beetles lead from 5:00 to 8:00; Blight Spores and Field Rats join at 6:00 and lead from 8:00 to 11:00; Harvest Mice join at 9:00 and lead until 18:00; Mud Golems join at 16:00 and are the only wave pest from 21:00. When the shooter cap is full (see [Crowd limits](/enemy-scaling#crowd-limits)), tier 3 rolls give Field Rats instead of Blight Spores. <small>[sim-DJfN0TyV.js: `if(um[i]===0||mm(e)<pm(e))return i`]</small>

Elites from the forest are larvae or beetles until 5:00, spores or rats until 10:00, Harvest Mice until 15:00 and Mud Golems after that. Gold and XP multipliers use the biome where the pest dies.

## Tips

- The brambles are small and do little damage, so they matter mostly when you are low on HP or cornered. Recovery can cover part of the 6 HP per second.
- Field Rats (base speed 50) are faster than most early pests and arrive in groups once Harvest Mice split. Keep space around Tibo from about 9:00 on.
- With common shrines and nests and no gold bonus, the forest is better for building up than for farming gold.
