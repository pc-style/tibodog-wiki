## Overview

Link the Pomeranian is a legendary dog. He is not in the ordinary breed pool. Each run Link has a one-in-three chance to be available, and he then appears as a [Stray Dog](/points-of-interest#stray-dog) in a map chunk whose centre is at least 1200 units from the start. See [Getting dogs](/dogs#getting-dogs).

Link grows a fluff charge every 10 seconds, holding one at a time (two from level 3). When something would hurt Tibo, a charge cancels the whole hit. Link then sneezes, pushing nearby pests away from Tibo; from level 5 the sneeze also freezes them for 0.5 s. His aura adds +0.15 HP per second of recovery (+0.6 at level 5). Training shortens the regrowth to about 6 s and makes the sneeze push harder.

If Tibo holds Link and finds [Zelda](/dogs/pomchi), the two fuse into [Zelda & Link](/dogs/zelda-and-link).

## How it works

- Order of checks when Tibo is hit: invulnerability first, then dodge, then fluff, then [Hash Brown Shield](/weapons/hash-brown-shield) guard charges, then armor. A dodged hit does not use up fluff, and a blocked hit is cancelled in full, however large. <small>[sim-CUTgHmYT.js: `if(!r&&c!==null&&e.legend.fluff>0)return c.sneeze(`]</small>
- Fluff does not block damage from biome terrain or hazard pools. Those skip dodge and guard as well.
- Charges: 1 at levels 1 and 2, 2 from level 3. <small>[run-rules-DJBE86Kj.js: `n.charges+ +((e.pets.level[t]??1)>=n.moreChargesAt)`]</small>
- While Link is full, he checks every 0.25 s for a free slot, and the regrowth interval only starts once a charge has grown. So after a quiet spell, a spent charge comes back within a quarter of a second; the interval only limits hits that come close together. <small>[sim-CUTgHmYT.js: `lD(e,o,s.ability,c)?(n.cd[o]=S(Fi(s,n.level[o])),Lr(e,n.breed[o])):n.cd[o]=nD`]</small>
- The sneeze hits pests within 50 units of Tibo; this radius does not grow with training. Push is `220 × power`, scaled down by each pest's mass as with the [Border Collie](/dogs/collie). Bosses are not pushed, and the 0.5 s freeze applies from level 5 only. <small>[run-rules-DJBE86Kj.js: `stun:l>=s.stunAt?s.stun:0`]</small>

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; legendary dogs enabled with the game's own `installLegendary` hook from the run-extras chunk; Link added at Tibo's side and trained with the sim's own dog-join and dog-level-up functions; HP refilled every tick, so hits still spent charges; Tibo standing still; level-ups taking the first offer; 150 s; charges timed from the game's `dogAbility` events): charges grew at least 10 s apart at level 1 and at least 6 s apart at level 5, where 6 of 8 gaps were exactly 6 s.

## Tips

- **Pick it to block boss hits.** Fluff blocks a hit regardless of its size, so it is worth most against boss attacks and other heavy hits. Armor, by contrast, loses value as enemy levels rise (see [Armor](/stats#armor)).
- Dodge from [Thick Skin](/passives/thick-skin) or [Ghost Skin](/items/ghost-skin) is rolled first, so dodge and fluff don't waste each other.
- The recovery aura stacks with [Root Network](/passives/root-network) and the [Saint Bernard](/dogs/saint-bernard).
- If Zelda turns up, fusing keeps Link's fluff, adds Zelda's marks and holds both in one pack slot.
