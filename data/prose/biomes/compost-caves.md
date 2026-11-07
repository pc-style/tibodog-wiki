## Overview

Compost Caves is a climate biome covering the coldest wet parts of the map (the bottom of four temperature bands, wet side). It usually borders [Frozen-Fries Tundra](/biomes/frozen-tundra) on the dry side and [Peel Forest](/biomes/peel-forest) where it gets warmer. <small>[sim-BUcaJmpn.js: `e<-.22?0:e<.02?1:e<.24?2:3}(a),o<0?0:1)`]</small> Its hazard is spore vents that sting Tibo for 8 HP per second while he stands in them.

[Compost Maggots](/enemies/compost-maggot) open the run, then [Cave Grubs](/enemies/cave-grub) (tier 2); both are found only here. After them come fast [Field Rats](/enemies/field-rat) and the ranged [Blight Spore](/enemies/blight-spore) (tier 3), tanky [Moles](/enemies/mole) (tier 4) and [Mud Golems](/enemies/mud-golem) (tier 5). Gold and XP are both ×1.15.

The caves favour risky points of interest. [Moldy Shrines](/points-of-interest#moldy-shrine) have weight 3, more than in any other biome, and [Boss Lairs](/points-of-interest#boss-lair) (0.6) and [Beetle Nests](/points-of-interest#beetle-nest) (2) are at the top of the climate-biome range. [Potato Crates](/points-of-interest#potato-crate) are common (5) and [Microwaves](/points-of-interest#microwave) have weight 2. [Fry Carts](/points-of-interest#fry-cart) and [Crop Patches](/points-of-interest#crop-patch) are rare (1).

## How it works

### Spore vents

Each chunk centred in the caves gets 2 or 3 vents, each 0.8–1.3 times the base radius of 20; vents that would fall outside the caves are dropped. <small>[sim-BUcaJmpn.js: `a=e.rng.int(Math.max(0,t.perChunk-1),t.perChunk)`]</small> Inside one, Tibo takes 8 damage per second, reduced by [armor](/stats#armor) as if from a level 10 + minutes attacker, so armor blocks less of it as the run goes on. Overlapping vents add up. <small>[sim-BUcaJmpn.js: `` r.kind===`slow`||r.kind===`chill`?y=Math.min(y,1-r.strength):ru(e,r.strength*t,mw[r.kind],!0,te) ``]</small>

The damage is unavoidable: dodge is not rolled, dashing does not protect Tibo, and [Hash Brown Shield](/weapons/hash-brown-shield) guard charges are not spent. It does not count as a hit, so on-hurt items like [Porcupine Spud](/items/porcupine-spud) and [Fry Volcano](/items/fry-volcano) do not fire. <small>[sim-BUcaJmpn.js: `a.hurtFlash[o]=8,e.lastHit.amount=d,e.itemFx.hurts++`]</small> The base amount does not change with difficulty or run time, and only invulnerability, such as the grace after a revive, stops it. Being [frozen by the Deep Freezer](/bosses/deep-freezer#ice-cube-fan) reduces the damage by another 25% after armor. A reset here is listed as “Reset by” “Spore vent”.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, seed `wiki`, no `--god`; clock warped to 1:00, then Tibo teleported onto the centre of a spore vent in this biome; every pest, boss and enemy bullet removed each tick, and HP refilled after each tick): Tibo lost 8 HP per second standing still, over 3 s, with no hit event. With the evasion stat forced to 1 it was still 8 per second, with no dodge event. With Tibo held on the centre during a dash, the dash ticks lost 8 per second too. In the same run, evasion 1 dodged every ordinary pest hit. Easy and Nightmare gave the same rates, and so did seeds `s1` and `s2`, except that on `s1` Tibo was invulnerable (just after a Grok Bot help event) during most of the Ketchup Bog evasion window and took almost no damage then.

### Pests and loot

Tiers follow the wave row of two minutes earlier (three on Easy; see [Wave schedule](/bosses#wave-schedule)). On Normal, maggots are most spawns until 5:00 and stop at 9:00; grubs lead from 5:00 to 8:00; rats and spores join at 6:00 and lead from 8:00 to 11:00; Moles join at 9:00 and lead until 18:00; Mud Golems join at 16:00 and are the only wave pest from 21:00. While the shooter cap is full (see [Crowd limits](/enemy-scaling#crowd-limits)), tier 3 rolls give Field Rats instead of Blight Spores.

Pests use the table of the biome just off screen where they spawn, so the caves' pests start arriving before Tibo crosses the border. <small>[sim-BUcaJmpn.js: `e.scratch.biomeX=n.x[r]+l*s,e.scratch.biomeY=n.y[r]+d*s`]</small> Elites from the caves are Cave Grubs until 5:00, rats or spores until 10:00, Moles until 15:00 and Mud Golems after that. Gold and XP multipliers use the biome where the pest dies.

## Tips

- **Stay here if you can handle tanks.** The caves pay well in both gold and XP, and the late pests (Moles and Mud Golems) are slow tanks. If you can handle their HP, this is a good place to spend the middle and late game.
- Moldy Shrines are common here. Each one trades +0.1 curse for a pile of gold, and curse brings extra elites and bosses, so take them when your build can handle the extra pressure (see [Curse](/curse)).
- The vents are small. Keep track of them when kiting a crowd, because dodge will not save you while you stand in one.
