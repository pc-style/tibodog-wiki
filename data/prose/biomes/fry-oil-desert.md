## Overview

Fry-Oil Desert is a climate biome covering the hottest and driest parts of the map (the top of four temperature bands, dry side). It usually borders [Chip Canyons](/biomes/chip-canyons) on its cooler side and [Ketchup Bog](/biomes/ketchup-bog), the hot wet biome. <small>[sim-BrIYs-gn.js: `e<-.22?0:e<.02?1:e<.24?2:3}(a),o<0?0:1)`]</small> Its hazard is pools of fryer oil that burn Tibo for 10 HP per second while he stands in them.

The pests are the fryer set it shares with Chip Canyons, minus the crabs and crows. [Oil Drips](/enemies/oil-drip) and [Crumb Ants](/enemies/crumb-ant) start the run, then fast [Fry Flies](/enemies/fry-fly) (tier 2), [Sizzle Imps](/enemies/sizzle-imp) that stop and explode next to Tibo (tier 3, the only pest of that tier here), [Harvest Mice](/enemies/harvest-mouse) that split into three [Field Rats](/enemies/field-rat) (tier 4) and [Grease Fiends](/enemies/grease-fiend) (tier 5). Gold is ×1.25, the best of the climate biomes after Ketchup Bog; XP is ×1.

Points of interest lean towards spending: [Potato Crates](/points-of-interest#potato-crate) have weight 5 (the joint highest) and [Fry Carts](/points-of-interest#fry-cart) 3, with [Moldy Shrines](/points-of-interest#moldy-shrine) at 2. [Spud Shrines](/points-of-interest#spud-shrine) (2), [Beetle Nests](/points-of-interest#beetle-nest), [Microwaves](/points-of-interest#microwave) and [Crop Patches](/points-of-interest#crop-patch) (1 each) are rarer than in most climate biomes.

## How it works

### Burning pools

Each 256-unit chunk whose centre is in the desert gets 2 or 3 oil pools, each scaled to 0.8–1.3 times the base radius of 22; a pool that would land outside the desert is dropped. <small>[sim-BrIYs-gn.js: `a=e.rng.int(Math.max(0,t.perChunk-1),t.perChunk)`]</small> The pools are fixed parts of the map. While Tibo is inside one, he takes 10 damage per second, reduced by [armor](/stats#armor) as if from a level 10 + minutes attacker, so armor blocks less of it as the run goes on. Overlapping pools add up. <small>[sim-BrIYs-gn.js: `` r.kind===`slow`||r.kind===`chill`?ee=Math.min(ee,1-r.strength):Rl(e,r.strength*t,yC[r.kind],!0,te) ``]</small>

The damage is flagged unavoidable. Dodge is not rolled, the dash's damage shield does not block it, and guard charges from [Hash Brown Shield](/weapons/hash-brown-shield) are not used up. <small>[sim-BrIYs-gn.js: `if(!r&&s.evasion>0&&e.rng.chance(s.evasion))`]</small> It does not count as a hit either: no hurt flash, and items that fire when Tibo is hurt, such as [Porcupine Spud](/items/porcupine-spud) and [Fry Volcano](/items/fry-volcano), do not trigger. <small>[sim-BrIYs-gn.js: `a.hurtFlash[o]=8,e.lastHit.amount=d,e.itemFx.hurts++`]</small> The base amount does not change with difficulty or run time, and only invulnerability, such as the grace after a revive, stops it. Being [frozen by the Deep Freezer](/bosses/deep-freezer#ice-cube-fan) reduces the damage by another 25% after armor. If the oil finishes Tibo, the end-of-run stats show “Reset by” “Hot oil”. <small>[stats-panel-D_8GluSj.js: `` case`Hot oil`:return h._({id:`Qcw21b`,message:[`Hot oil`]}) ``]</small>

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, seed `wiki`, no `--god`; clock warped to 1:00, then Tibo teleported onto the centre of a oil pool in this biome; every pest, boss and enemy bullet removed each tick, and HP refilled after each tick): Tibo lost 10 HP per second standing still, over 3 s, with no hit event. With the evasion stat forced to 1 it was still 10 per second, with no dodge event. With Tibo held on the centre during a dash, the dash ticks lost 10 per second too. In the same run, evasion 1 dodged every ordinary pest hit. Easy and Nightmare gave the same rates, and so did seeds `s1` and `s2`, except that on `s1` Tibo was invulnerable (just after a Grok Bot help event) during most of the Ketchup Bog evasion window and took almost no damage then.

### Pests and loot

On Normal, Hard and Nightmare the tier weights come from the wave row of two minutes earlier, on Easy three (see [Wave schedule](/bosses#wave-schedule)). On Normal, drips and ants are most spawns until 5:00 and gone by 9:00; Fry Flies lead from 5:00 to 8:00; Sizzle Imps join at 6:00 and lead from 8:00 to 11:00; Harvest Mice join at 9:00 and lead until 18:00; Grease Fiends join at 16:00 and are the only wave pest from 21:00. Pests use the table of the biome just off screen where they spawn, so the desert's pests start arriving before Tibo crosses the border. <small>[sim-BrIYs-gn.js: `e.scratch.biomeX=n.x[r]+u*s,e.scratch.biomeY=n.y[r]+d*s`]</small> Elites drawn from here are Fry Flies until 5:00, Sizzle Imps until 10:00, Harvest Mice until 15:00 and Grease Fiends after that.

The ×1.25 gold applies to pests that die inside the desert, wherever Tibo is standing.

## Tips

- **Stay out of the oil pools.** Fight next to the pools, not in them. The burn ticks every frame Tibo is inside, and neither dodge nor a dash protects him.
- Sizzle Imps make up a large share of spawns from about 6:00 to 11:00. They slow down and explode next to Tibo, so keep moving instead of letting them reach you while you are cornered against a pool.
- With crates and carts common and gold at ×1.25, this is a good place to farm gold mid-run. Pull fights to the desert side of a border to get the multiplier.
