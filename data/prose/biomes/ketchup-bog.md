## Overview

Ketchup Bog is a climate biome covering the hottest wet parts of the map (top temperature band, wet side). It usually borders [Fry-Oil Desert](/biomes/fry-oil-desert) on its dry side and [Mash Swamp](/biomes/mash-swamp), the next cooler wet biome. <small>[sim-CrpXuTSY.js: `e<-.22?0:e<.02?1:e<.24?2:3}(a),o<0?0:1)`]</small> Its hazard is hot ketchup puddles that burn Tibo for 8 HP per second. The in-game description says they “burn and slow”, but in this build they only burn: the game treats them as `burn` pools, and only `slow` and `chill` ground changes Tibo's speed.

The opening pests, [Ketchup Drops](/enemies/ketchup-drop) and [Bog Slimes](/enemies/bog-slime), are slow chasers it shares with Mash Swamp. Then come [Tomato Leeches](/enemies/tomato-leech) (tier 2), charging [Bog Toads](/enemies/bog-toad) and exploding [Sizzle Imps](/enemies/sizzle-imp) (tier 3), the ranged [Ice Imp](/enemies/ice-imp) as the only tier 4 pest, and [Grease Fiends](/enemies/grease-fiend) (tier 5). Gold is ×1.3, the highest of any climate biome, and XP ×1.1.

[Potato Crates](/points-of-interest#potato-crate) are common (weight 5), and [Beetle Nests](/points-of-interest#beetle-nest) (2) and [Boss Lairs](/points-of-interest#boss-lair) (0.6) are at the top of the climate-biome range. [Moldy Shrines](/points-of-interest#moldy-shrine) and [Microwaves](/points-of-interest#microwave) have weight 2; [Crop Patches](/points-of-interest#crop-patch) are rare (1).

## How it works

### Burning puddles

Each chunk centred in the bog gets 3 or 4 puddles, each 0.8–1.3 times the base radius of 24; puddles that would fall outside the bog are dropped. <small>[sim-CrpXuTSY.js: `a=e.rng.int(Math.max(0,t.perChunk-1),t.perChunk)`]</small> Standing in one costs 8 HP per second, reduced by [armor](/stats#armor) as if from a level 10 + minutes attacker, so armor blocks less of it as the run goes on. Overlapping puddles add up. <small>[sim-CrpXuTSY.js: `` r.kind===`slow`||r.kind===`chill`?x=Math.min(x,1-r.strength):eo(e,r.strength*t,Vd[r.kind],!0,ee) ``]</small>

The damage is unavoidable: no dodge roll, no protection from the dash, and [Hash Brown Shield](/weapons/hash-brown-shield) guard charges are not used up. It does not count as a hit, so [Porcupine Spud](/items/porcupine-spud) and [Fry Volcano](/items/fry-volcano) do not fire. <small>[sim-CrpXuTSY.js: `r||(a.hurtFlash[o]=8,e.lastHit.amount=u,e.itemFx.hurts++`]</small> Its base amount does not change with difficulty or run time, and only invulnerability, such as the grace after a revive, stops it. The game files it under the same label as fryer oil, so a reset here reads “Reset by” “Hot oil”.

### Pests and loot

Tiers follow the wave row of two minutes earlier (three on Easy; see [Wave schedule](/bosses#wave-schedule)). On Normal, drops and slimes are most spawns until 5:00 and stop at 9:00; leeches lead from 5:00 to 8:00; toads and Sizzle Imps join at 6:00 and lead from 8:00 to 11:00; Ice Imps join at 9:00 and lead until 18:00; Grease Fiends join at 16:00 and are the only wave pest from 21:00.

Ice Imps are shooters. When the shooter cap is full (see [Crowd limits](/enemy-scaling#crowd-limits)), a tier 4 roll falls back to a tier 3 pest. <small>[sim-CrpXuTSY.js: `if(Ro[i]===0||Vo(e)<Bo(e))return i`]</small> Elites from the bog are leeches until 5:00, toads or imps until 10:00, Ice Imps until 15:00 and Grease Fiends after that.

The ×1.3 gold and ×1.1 XP apply to pests that die inside the bog. <small>[sim-CrpXuTSY.js: `` c=e.world.biomeAt(a,o);if(r.xp[t]>0&&G(e,`xp`,a,o,r.xp[t]*c.xpMult) ``]</small>

## Tips

- The puddles are dense (up to four per chunk), so plan your kiting route around them. They do not slow Tibo, so you can cross one quickly if you need to.
- From about 9:00 to 18:00 much of the crowd shoots. Keep moving across their line of fire rather than standing still to fight.
- For gold, this is the best climate biome. Its crates, nests and lairs also make it a good place to find chests.
