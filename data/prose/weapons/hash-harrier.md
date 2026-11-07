## Overview

Hash Harrier evolves [Hash Hawk](/weapons/hash-hawk). Max Hash Hawk to level 8, hold [Bacon Bits](/passives/bacon-bits) at any level, then open a [chest](/chests). It replaces Hash Hawk with ember-winged birds whose dives leave burning crumbs on the ground.

Its base stats are 125 damage, three birds, a 1.6 s cooldown after each strike and 2.5 s crumb duration. Tibo's starting +1 amount makes four birds; his starting +25% duration makes crumbs last 3.125 s. A max-level Hash Hawk has 68 base damage, three birds and a 1.8 s cooldown, but leaves no crumbs.

## How it works

- Birds circle Tibo and look for targets within 170 units. Selection uses **current HP × target weight**: ×100 for bosses, ×10 for elites and ×1 for ordinary pests. Bosses are strongly favored, not guaranteed first: a healthier pest can outrank a nearly defeated boss. <small>[sim-CJ_9Wh4W.js: `d=(c?e.bosses.hp[a]:e.enemies.hp[a])*Bx(r,c,l)`]</small> <small>[sim-CJ_9Wh4W.js: `function Bx(e,t,n){return t?e.bossWeight:n?e.eliteWeight:1}`]</small>
- Dives follow the target while it remains valid. Impact damages enemies in a small area and leaves crumbs with radius `20 × √area`; at base area 1.2 this is about 21.91 units.
- Crumbs hit every 0.25 s for 30% of the bird's damage per second: 9.375 per tick before other damage modifiers at base damage 125. They also apply a burn with base 14 damage per second for 1.5 s. <small>[sim-CJ_9Wh4W.js: `o.damage[s]=r.damage*n.dpsShare*c*Oe,o.status[s]=Ui(e,n.burn)`]</small> Overlapping crumb patches can damage the same pest; the burn is a status effect, not an extra bird.
- Crumbs expire at their recorded end time and require their owning weapon slot to remain a Hash Hawk-type weapon. <small>[sim-CJ_9Wh4W.js: `return t.pool.isAlive(n)&&e.time<t.until[n]&&Ix(e,t.slot[n])`]</small>

**Measured** in the original headless engine, build `main-Dk11gw6T.js`, Standard/Normal, seeds `s1`, `s2`, `s3`: only the selected weapon was granted, HP was refilled, and after 4 s of warmup six high-HP pests were held 45–90 units to Tibo's right for 20 s with new spawning suppressed. Harrier had four birds, up to eight crumb patches, radius 21.91, lifetime 3.125 s and 9.375 damage per 15-tick pulse. Total weapon damage was 53,093.75 in each seed, versus 13,600 for level-8 Hash Hawk. Hash Hawk and Peeler controls matched the previous build. This concentrated-target setup is not a normal-run DPS comparison.

Controlled chest tests across three seeds evolved level-8 Hash Hawk with Bacon Bits in every new-build case, and never without Bacon Bits or in the previous build. A multi-reward chest could first upgrade level-7 Hash Hawk and then evolve it (two of three seeds). These granted loadouts and inserted fully charged chests verify recipe behavior, not naturally earned acquisition or chest drop odds.

## Tips

- **Keep pests in the crumbs.** Circling back past a recent impact can bring pursuing pests through its lingering damage instead of leaving the patch behind.
- Bacon Bits also increases damage against elites and bosses after the evolution; it is not consumed by the recipe.
