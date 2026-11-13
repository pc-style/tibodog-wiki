## Overview

Fry Palace Drive-Thru is a landmark biome: a circle with a radius of 420 units placed on top of the climate biomes. The map is divided into 2400 × 2400 cells, and each cell holds one landmark of a randomly picked type, so drive-thrus are about as common as the other three landmarks. <small>[sim-CteDA9xy.js: `i=r.pick(n),a=this.cfg.world`]</small> No landmark overlaps the starting area. Its hazard is a few small patches of hot oil that burn Tibo for 8 HP per second.

[Parking Lot Gulls](/enemies/parking-gull) and [Crumb Ants](/enemies/crumb-ant) open. Tier 2 has charging [Dumpster Raccoons](/enemies/dumpster-raccoon) and fast [Fry Flies](/enemies/fry-fly), tier 3 [Field Rats](/enemies/field-rat) and exploding [Sizzle Imps](/enemies/sizzle-imp), tier 4 [Harvest Mice](/enemies/harvest-mouse) (which split into three Field Rats) and tier 5 [Grease Fiends](/enemies/grease-fiend). Gulls and raccoons spawn only here. Gold is ×1.2 and XP ×1.15.

Only six kinds of point of interest appear inside: [Microwaves](/points-of-interest#microwave) (weight 3), [Fry Carts](/points-of-interest#fry-cart) (2.3, about 20% of them, a bigger share than in any other biome), [Stray Dogs](/points-of-interest#stray-dog), [Potato Crates](/points-of-interest#potato-crate), [Spud Shrines](/points-of-interest#spud-shrine) and [Moldy Shrines](/points-of-interest#moldy-shrine). There are no Crop Patches, Beetle Nests, Boss Lairs or other special points of interest.

## How it works

### The Lunch Rush event

The first time Tibo enters a given drive-thru, [Lunch Rush](/events/lunch-rush) fires: “Lunch rush! Gulls dive across the lot!” Each drive-thru fires it once. If the pest pool is full at that moment, the game tries again while Tibo is still inside. <small>[sim-CteDA9xy.js: `a!==void 0&&ph(e,b.event(a))&&e.world.spendLandmark(r)`]</small> It sends 24 [Gull Flocks](/enemies/gull-flock) from just off screen on one side, spread across a band 280 units wide. They fly straight across in one direction at speed 105 and despawn after 14 s. <small>[sim-CteDA9xy.js: `let s=n.range(-t.width,t.width),d=n.range(0,60)`]</small> Standard's late-game count multiplier stays 1. From 20:00, newly explored ground uses the [current endgame biome](/endgame), rather than generating new drive-thrus.

### Hot oil patches

Each chunk centred in the drive-thru gets 1 or 2 patches, each 0.8–1.3 times the base radius of 18; patches that would fall outside it are dropped. While Tibo stands in one he takes 8 damage per second, reduced by [armor](/stats#armor) as if from a level 10 + minutes attacker, so armor blocks less of it as the run goes on. <small>[sim-CteDA9xy.js: `` r.kind===`slow`||r.kind===`chill`?b=Math.min(b,1-r.strength):nd(e,r.strength*n,cO[r.kind],!0,te) ``]</small> As with all damaging ground, this is unavoidable: no dodge roll, no dash protection, no guard charges spent, and no on-hurt item triggers. Its base amount does not change with difficulty or run time. A reset here reads “Reset by” “Hot oil”.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, seed `wiki`, no `--god`; clock warped to 1:00, then Tibo teleported onto the centre of a grease patch in this biome; every pest, boss and enemy bullet removed each tick, and HP refilled after each tick): Tibo lost 8 HP per second standing still, over 3 s, with no hit event. With the evasion stat forced to 1 it was still 8 per second, with no dodge event. With Tibo held on the centre during a dash, the dash ticks lost 8 per second too. In the same run, evasion 1 dodged every ordinary pest hit. Easy and Nightmare gave the same rates, and so did seeds `s1` and `s2`, except that on `s1` Tibo was invulnerable (just after a Grok Bot help event) during most of the Ketchup Bog evasion window and took almost no damage then.

### Pests and loot

Inside the circle the landmark replaces the climate biome for spawn tables, loot multipliers and points of interest. <small>[sim-CteDA9xy.js: `let i=this.landmarkAt(e,t);if(i!==null)return i.biome`]</small> Tiers follow the wave row of two minutes earlier (three on Easy; see [Wave schedule](/bosses#wave-schedule)). On Normal, gulls and ants are most spawns until 5:00 and stop at 9:00; raccoons and flies lead from 5:00 to 8:00; rats and imps join at 6:00 and lead from 8:00 to 11:00; Harvest Mice join at 9:00 and lead until 18:00; Grease Fiends join at 16:00 and are the only wave pest from 21:00.

Elites from the drive-thru are raccoons or flies until 5:00, rats or imps until 10:00, Harvest Mice until 15:00 and Grease Fiends after that. Gold and XP multipliers use the biome where the pest dies.

## Tips

- **Step out of the gull band.** The gulls only cross the screen once and do not turn, so you can step out of their band instead of fighting them. Area weapons can turn the flock into a burst of XP gems, though.
- The oil patches are small and sparse (at most two per chunk), so they are easy to keep away from.
- This is the best landmark for shopping and item copying, with Fry Carts and Microwaves making up nearly half of its points of interest.
