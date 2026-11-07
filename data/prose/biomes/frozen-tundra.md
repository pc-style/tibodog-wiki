## Overview

Frozen-Fries Tundra is a climate biome covering the coldest dry parts of the map (the bottom of four temperature bands, dry side). It usually borders [Potato Field](/biomes/potato-field) where it gets warmer and [Compost Caves](/biomes/compost-caves), the cold wet biome. <small>[sim-CbXtrX7h.js: `e<-.22?0:e<.02?1:e<.24?2:3}(a),o<0?0:1)`]</small> Its hazard is frost patches that cut Tibo's walking speed to 70% while he is on them. They do no damage.

[Frost Fleas](/enemies/frost-flea) open the run, then [Snow Molds](/enemies/snow-mold) that split in two (tier 2), fast [Field Rats](/enemies/field-rat) and charging [Field Crows](/enemies/field-crow) (tier 3), the ranged [Ice Imp](/enemies/ice-imp) as the only tier 4 pest, and [Mud Golems](/enemies/mud-golem) (tier 5). Gold is ×1, but XP is ×1.15, which only [Crop Circle](/biomes/crop-circle) beats.

[Potato Crates](/points-of-interest#potato-crate) (weight 4) and [Spud Shrines](/points-of-interest#spud-shrine) (3) are the most common points of interest, with [Fry Carts](/points-of-interest#fry-cart) and [Microwaves](/points-of-interest#microwave) at 2. [Beetle Nests](/points-of-interest#beetle-nest), [Crop Patches](/points-of-interest#crop-patch) and [Moldy Shrines](/points-of-interest#moldy-shrine) (1) and [Boss Lairs](/points-of-interest#boss-lair) (0.4) are rare.

## How it works

### Frost patches

Each chunk centred in the tundra gets 3 or 4 frost patches, each 0.8–1.3 times the base radius of 28; patches that would fall outside the tundra are dropped. <small>[sim-CbXtrX7h.js: `a=e.rng.int(Math.max(0,t.perChunk-1),t.perChunk)`]</small> On a patch, Tibo's movement speed is multiplied by 1 − 0.3 = 0.7. The simulation handles `chill` exactly like the mash in [Mash Swamp](/biomes/mash-swamp): it only slows, and overlapping patches do not stack. <small>[sim-CbXtrX7h.js: `` r.kind===`slow`||r.kind===`chill`?y=Math.min(y,1-r.strength):lu(e,r.strength*t,mE[r.kind],!0,te) ``]</small> Pests are not slowed, and a dash still covers its full distance. <small>[sim-CbXtrX7h.js: `let t=hl(e);_+=n.dashX[r]*t`]</small>

### Pests and loot

Tiers follow the wave row of two minutes earlier (three on Easy; see [Wave schedule](/bosses#wave-schedule)). On Normal, Frost Fleas are most spawns until 5:00 and stop at 9:00; Snow Molds lead from 5:00 to 8:00; rats and crows join at 6:00 and lead from 8:00 to 11:00; Ice Imps join at 9:00 and lead until 18:00; Mud Golems join at 16:00 and are the only wave pest from 21:00. When the shooter cap is full (see [Crowd limits](/enemy-scaling#crowd-limits)), a tier 4 roll falls back to a rat or crow. <small>[sim-CbXtrX7h.js: `if(kh[i]===0||Nh(e)<Mh(e))return i`]</small>

Elites from the tundra are Snow Molds until 5:00, rats or crows until 10:00, Ice Imps until 15:00 and Mud Golems after that. The ×1.15 XP applies to pests that die inside the tundra. <small>[sim-CbXtrX7h.js: `a=n.y[t],o=n.has(t,u.Elite),s=e.world.biomeAt(i,a)`]</small> <small>[sim-CbXtrX7h.js: `n.xp[t]*s.xpMult`]</small> Standard's [late-run XP step](/enemy-scaling#late-run-xp-drops) multiplies pest XP before this biome bonus.

## Tips

- **Keep off frost when chased.** On frost Tibo walks at about 43 units per second at base speed. That is slower than Field Rats (50) and only a little faster than Field Crows (40) between charges, so frost patches are bad places to be caught by tier 3 pests.
- The frost is mild compared with Mash Swamp, and the tundra's XP bonus makes it a good place to level, especially from about 9:00 to 18:00 when Ice Imps (7 XP each) make up a large share of spawns.
- Ice Imps fire a three-shot fan. Keep moving sideways to them rather than backing away in a straight line.
