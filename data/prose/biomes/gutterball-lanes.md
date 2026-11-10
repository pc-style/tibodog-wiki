## Overview

Gutterball Lanes is a landmark biome: a circle with a radius of 400 units placed on top of the climate biomes. The map is divided into 2400 × 2400 cells, and each cell holds one landmark of a randomly picked type, so the lanes are about as common as the other three landmarks. <small>[sim-CLUJ3aah.js: `i=r.pick(n),a=this.cfg.world`]</small> No landmark overlaps the starting area. Its hazard is slowing patches that cut Tibo's walking speed to 60% while he is on them. They do no damage.

[Bowling Pins](/enemies/bowling-pin) and [Crumb Ants](/enemies/crumb-ant) open, then [Bowling Balls](/enemies/bowling-ball) (tier 2), chargers whose dash (speed 210) is second only to the Grease Fiend's. Pins and balls are found only here. After them come fast [Field Rats](/enemies/field-rat) and charging [Field Crows](/enemies/field-crow) (tier 3), [Harvest Mice](/enemies/harvest-mouse) that split into three Field Rats (tier 4) and [Mud Golems](/enemies/mud-golem) (tier 5). Gold is ×1.2 and XP ×1.1.

Only five kinds of point of interest appear inside: [Potato Crates](/points-of-interest#potato-crate) (weight 5, about 41% of them), [Stray Dogs](/points-of-interest#stray-dog), [Moldy Shrines](/points-of-interest#moldy-shrine), [Fry Carts](/points-of-interest#fry-cart) and [Spud Shrines](/points-of-interest#spud-shrine). There are no Microwaves, Crop Patches, Beetle Nests, Boss Lairs or other special points of interest.

## How it works

### The Strike event

The first time Tibo enters a given bowling alley, [Strike](/events/strike) fires: “Strike! Bowling balls roll in from every side!” Each alley fires it once. If the pest pool is full at that moment, the game tries again while Tibo is still inside. <small>[sim-CLUJ3aah.js: `a!==void 0&&Mv(e,C.event(a))&&e.world.spendLandmark(r)`]</small> It places Bowling Balls evenly around a ring 200 units from Tibo, and they despawn after 16 s. The base count of 10 is multiplied by the difficulty's wall-pest share and rounded, with a minimum of 1: 2 balls on Easy, 3 on Normal and Hard, 6 on Nightmare. <small>[sim-CLUJ3aah.js: `s=Math.max(1,Math.round(t.count*e.cfg.level.wallPests))`]</small>

### Slow patches

Each chunk centred in the lanes gets 2 or 3 slow patches, each 0.8–1.3 times the base radius of 26; patches that would fall outside the alley are dropped. On a patch, Tibo's movement speed is multiplied by 1 − 0.4 = 0.6, the same `slow` effect as [Mash Swamp](/biomes/mash-swamp)'s mash but a little weaker. Overlapping patches do not stack. <small>[sim-CLUJ3aah.js: `` r.kind===`slow`||r.kind===`chill`?y=Math.min(y,1-r.strength):Cu(e,r.strength*t,vD[r.kind],!0,te) ``]</small> Pests are not slowed, and a dash still covers its full 48 units. <small>[sim-CLUJ3aah.js: `let t=Ol(e);_+=n.dashX[r]*t`]</small>

### Pests and loot

Inside the circle the landmark replaces the climate biome for spawn tables, loot multipliers and points of interest. <small>[sim-CLUJ3aah.js: `let r=this.landmarkAt(e,t);if(r!==null)return r.biome`]</small> Tiers follow the wave row of two minutes earlier (three on Easy; see [Wave schedule](/bosses#wave-schedule)). On Normal, pins and ants are most spawns until 5:00 and stop at 9:00; Bowling Balls lead from 5:00 to 8:00; rats and crows join at 6:00 and lead from 8:00 to 11:00; Harvest Mice join at 9:00 and lead until 18:00; Mud Golems join at 16:00 and are the only wave pest from 21:00.

Elites from the lanes are Bowling Balls until 5:00, rats or crows until 10:00, Harvest Mice until 15:00 and Mud Golems after that. Gold and XP multipliers use the biome where the pest dies.

## Tips

- **Keep off patches near fast pests.** On a patch Tibo walks at about 37 units per second at base speed, slower than Crumb Ants (46) and Field Rats (50). Avoid being caught on one by a crowd of them.
- A charger that gets within dash range stops for half a second (0.6 seconds from 20:00 in Standard) with its direction locked, then dashes in a straight line. <small>[sim-CLUJ3aah.js: `i.state[t]=1,i.timer[t]=.5,e.bigUpdate.lateGame&&(i.timer[t]=ri(e,.5)),i.tx[t]=r/s,i.ty[t]=a/s`]</small> When a Bowling Ball stops, step sideways out of its line rather than running straight away, especially on a slow patch.
- With crates making up 41% of the points of interest, the lanes are a good place to spend gold on items.
