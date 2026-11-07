## Overview

Mash Colossus evolves [Mash Golem](/weapons/mash-golem). Reach level 8 with Mash Golem, hold [Stuffed Skin](/passives/stuffed-skin) at any level, then open a [chest](/chests). The larger golems leave slowing mash and finish with an expanding shockwave.

## How it works

- Base stats are 13.5 damage, two golems per summon, a 3.6 s cooldown, area 1.3, speed 55 and 1.6 s walking duration. Tibo's built-in +1 amount makes three golems before other bonuses.
- Walking golems leave patches every 14 units. Each patch has radius `16 × √area` (about 18.24 at base area) and lasts 3 s; Duration does not extend that patch lifetime. Patches refresh a 50% slow every 0.1 s, with each application lasting `0.4 s × duration multiplier`. <small>[sim-BtxK0PMC.js: `t.patchEnd[a]=e.tick+S(r.sec)`]</small>
- The final slam deals five times the golem damage. An additional ring expands at 135 units/s to `105 × √area` (about 119.72 units), dealing twice the golem damage once per target. The ring starts outside the initial slam's radius rather than hitting its center again. <small>[sim-BtxK0PMC.js: `t.ringDamage[o]=t.damage[n]*r.mult`]</small>

**Controlled comparison:** original-engine Standard/Normal on seeds `s1`, `s2`, `s3`, selected weapon granted alone, HP refilled, 8 s warmup and six high-HP pests held 45–90 units to the right for 20 s with other spawning culled. Colossus dealt 6,777–7,249.5 damage; patches lasted 180 ticks with radius 18.24, the ring reached 119.72 with 27 base damage, and slow factor 0.5 was observed. Base Mash Golem controls matched the old build. This is not natural-run DPS. Inserted charged chests evolved level-8 Mash Golem with Stuffed Skin in all three seeds, never without it or in the old build; these tests do not establish natural acquisition or drop odds.

## Tips

- **Lead pests across the mash.** The patches hold pursuers in the golems' path, while the ending ring reaches enemies outside the slam.
- Area widens patches and the finishing ring. Duration extends the golem's walk and slow applications, not the patch's fixed 3 s lifetime.
