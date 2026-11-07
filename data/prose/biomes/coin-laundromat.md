## Overview

Coin Laundromat is a landmark biome: a circle with a radius of 400 units placed on top of the climate biomes. The map is divided into 2400 × 2400 cells, and each cell holds one landmark of a randomly picked type, so laundromats are about as common as the other three landmarks. <small>[sim-DnXbkcN3.js: `i=r.pick(n),a=this.cfg.world`]</small> No landmark overlaps the starting area. There is no ground hazard.

The pests are laundry-themed at first. [Lint Bunnies](/enemies/lint-bunny) open, then [Sock Piles](/enemies/sock-pile) that split into three Lint Bunnies (tier 2); both appear only here. After them come fast [Field Rats](/enemies/field-rat) and the ranged [Blight Spore](/enemies/blight-spore) (tier 3), the ranged [Ice Imp](/enemies/ice-imp) as the only tier 4 pest, and [Mud Golems](/enemies/mud-golem) (tier 5). Gold is ×1.4, the highest of any biome, and XP ×1.05.

Only five kinds of point of interest appear inside: [Microwaves](/points-of-interest#microwave) (weight 6, about 45% of them), [Potato Crates](/points-of-interest#potato-crate) (3), [Stray Dogs](/points-of-interest#stray-dog), [Fry Carts](/points-of-interest#fry-cart) and [Spud Shrines](/points-of-interest#spud-shrine). There are no Crop Patches, Moldy Shrines, Beetle Nests, Boss Lairs or other special points of interest.

## How it works

### The Loose Change event

The first time Tibo enters a given laundromat, [Loose Change](/events/loose-change) fires: “Loose change in the dryers: double gold for 20 s”. Each laundromat fires it once. <small>[sim-DnXbkcN3.js: `a!==void 0&&xv(e,g.event(a))&&e.world.spendLandmark(r)`]</small> For the next 20 s, every coin Tibo picks up is worth double, wherever it was dropped. <small>[sim-DnXbkcN3.js: `let t=1*a*i.greedMult*(e.time<e.goldRushUntil?e.goldRushMult:1)`]</small> A coin's base value is already set by the biome the pest died in, so coins from pests killed inside the laundromat and collected during the rush are worth 1.4 × 2 = 2.8 times normal, before greed.

### Pests and loot

Inside the circle the landmark replaces the climate biome for spawn tables, loot multipliers and points of interest. <small>[sim-DnXbkcN3.js: `let r=this.landmarkAt(e,t);if(r!==null)return r.biome`]</small> Pests use the table of the biome about 256–286 units from Tibo where they spawn, so near the middle of the laundromat every wave pest comes from its list.

Tiers follow the wave row of two minutes earlier (three on Easy; see [Wave schedule](/bosses#wave-schedule)). On Normal, Lint Bunnies are most spawns until 5:00 and stop at 9:00; Sock Piles lead from 5:00 to 8:00; rats and spores join at 6:00 and lead from 8:00 to 11:00; Ice Imps join at 9:00 and lead until 18:00; Mud Golems join at 16:00 and are the only wave pest from 21:00. When the shooter cap is full (see [Crowd limits](/enemy-scaling#crowd-limits)), Blight Spore rolls become Field Rats and Ice Imp rolls fall back to tier 3.

Elites from the laundromat are Sock Piles until 5:00, rats or spores until 10:00, Ice Imps until 15:00 and Mud Golems after that. Gold and XP multipliers use the biome where the pest dies. <small>[sim-DnXbkcN3.js: `a=n.y[t],o=n.has(t,f.Elite),s=e.world.biomeAt(i,a)`]</small> <small>[sim-DnXbkcN3.js: `n.xp[t]*s.xpMult`]</small> Standard's [late-run XP step](/enemy-scaling#late-run-xp-drops) multiplies pest XP before this biome bonus.

## Tips

- **Sweep up coins during Loose Change.** Use the 20 s of Loose Change to sweep up coins: walk through dropped gold, or save a magnet pickup for it, before the timer runs out.
- Stay and fight inside the laundromat when you want gold. Every coin dropped there is worth 40% more than in a ×1 biome.
- The microwaves make this the place to copy a key item. Remember that each copy melts another item of the same rarity.
- From about 9:00 to 18:00 Ice Imps dominate the spawns, so expect a lot of incoming fire here.
