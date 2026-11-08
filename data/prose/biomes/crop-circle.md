## Overview

Crop Circle is a landmark biome: a circle with a radius of 460 units, the largest of the four landmarks, dropped on top of whatever climate biome is there. The map is divided into 2400 × 2400 cells, and each cell holds one landmark of a randomly picked type, so Crop Circles turn up about as often as the other three landmarks. <small>[sim-CUTgHmYT.js: `i=r.pick(n),a=this.cfg.world`]</small> No landmark overlaps the starting area. Crop Circle has no ground hazard.

[Little Greys](/enemies/little-grey), found only here, and [Aphids](/enemies/aphid) open. Tier 2 is the [Spittlebug](/enemies/spittlebug), which fires two pairs of orbiting froth bubbles. Then come charging [Field Crows](/enemies/field-crow) and the ranged [Blight Spore](/enemies/blight-spore) (tier 3), [Moles](/enemies/mole) (tier 4) and [Mud Golems](/enemies/mud-golem) (tier 5). XP is ×1.2, the highest of any biome, and gold ×1.1.

Only five kinds of point of interest appear inside the circle: [Crop Patches](/points-of-interest#crop-patch) (weight 6, about 40% of them), [Spud Shrines](/points-of-interest#spud-shrine) (4, about 26%), [Stray Dogs](/points-of-interest#stray-dog), [Potato Crates](/points-of-interest#potato-crate) and [Moldy Shrines](/points-of-interest#moldy-shrine). There are no Fry Carts, Microwaves, Beetle Nests, Boss Lairs or other special points of interest.

## How it works

### The Lost Saucer event

The first time Tibo enters a given Crop Circle, the [Lost Saucer](/events/lost-saucer) event fires: “A lost saucer! Shoot it down for gold!” Each circle fires it once. If the pest pool is full at that moment, the game tries again while Tibo is still inside. <small>[sim-CUTgHmYT.js: `a!==void 0&&Tv(e,g.event(a))&&e.world.spendLandmark(r)`]</small> A [Lost Saucer](/enemies/lost-saucer) appears 40 units from Tibo and runs away. Each hit has a 50% chance to drop a 2-gold coin, and the saucer escapes after 20 s. <small>[sim-CUTgHmYT.js: `` r.despawnAt[d]=e.time+(a.behavior.kind===`flee`?a.behavior.escapeAfter:25) ``]</small> Its HP grows with run time like other pests.

### Pests and loot

Inside the circle the landmark replaces the climate biome for everything: spawn tables, loot multipliers and points of interest. <small>[sim-CUTgHmYT.js: `let r=this.landmarkAt(e,t);if(r!==null)return r.biome`]</small> Pests use the table of the biome about 256–286 units from Tibo where they spawn, so near the middle of the circle every wave pest comes from the Crop Circle list.

Tiers follow the wave row of two minutes earlier (three on Easy; see [Wave schedule](/bosses#wave-schedule)). On Normal, Little Greys and Aphids are most spawns until 5:00 and stop at 9:00; Spittlebugs are around from the start and lead from 5:00 to 8:00; crows and spores join at 6:00 and lead from 8:00 to 11:00; Moles join at 9:00 and lead until 18:00; Mud Golems join at 16:00 and are the only wave pest from 21:00. Spittlebugs and Blight Spores are shooters, so the shooter cap (2 alive before 3:00, 4 before 6:00; see [Crowd limits](/enemy-scaling#crowd-limits)) swaps them for other pests. A capped Spittlebug roll becomes a tier 1 pest. <small>[sim-CUTgHmYT.js: `if(Uh[i]===0||qh(e)<Kh(e))return i`]</small>

Elites from the circle are Spittlebugs until 5:00, crows or spores until 10:00, Moles until 15:00 and Mud Golems after that. The ×1.2 XP applies to pests that die inside the circle. <small>[sim-CUTgHmYT.js: `a=n.y[t],o=n.has(t,f.Elite),s=e.world.biomeAt(i,a)`]</small> <small>[sim-CUTgHmYT.js: `n.xp[t]*s.xpMult`]</small> Standard's [late-run XP step](/enemy-scaling#late-run-xp-drops) multiplies pest XP before this biome bonus.

## Tips

- **Come here to farm XP.** Crop Circle is the best place in the game to earn XP: the highest XP multiplier and no hazard. Its many Spud Shrines add stat picks on top.
- Crop Patches are everywhere here. Break them for coins and the chance of a 30 HP snack when you need healing.
- For the saucer, fast-hitting weapons are what count: every hit is a coin flip for gold, not every point of damage. It escapes after 20 s, so chase it straight away.
- Spittlebugs can show up from the first minute here. Expect some ranged fire earlier than in the climate biomes.
