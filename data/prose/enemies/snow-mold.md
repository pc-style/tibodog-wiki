## Overview

The Snow Mold is the only tier-2 pest of [Frozen-Fries Tundra](/biomes/frozen-tundra). Tier 2 is in the wave table from the start until minute 9, which with Normal's two-minute [tier lag](/modes) means up to about 11:59.

It walks straight at Tibo at speed 30 and has 22 HP and 6 contact damage, ordinary numbers for tier 2. What sets it apart is that it splits in two when killed. The mold gives 2 XP and each of its two pieces gives 1, so one Snow Mold is worth 4 XP in total. The pieces roll their own drops, including the 5% gold chance.

## How it works

When a Snow Mold dies, two copies of it appear in a small ring around the spot, pushed outward. Each copy has 35% of the parent's maximum HP, 70% of its size and 1 XP, and keeps the parent's damage and speed scaling. Copies cannot split again. <small>[sim-B_Q9zCqI.js: `e.scratch.hp=n.maxHp[t]/i.hp*(o?.35:1)`]</small> <small>[sim-B_Q9zCqI.js: `o&&(n.set(d,k.NoSplit),n.radius[d]=.7*n.radius[d],n.xp[d]=Math.max(1,Math.floor(i.xp/2)))`]</small>

At base stats that is two 7.7-HP pieces, so the whole mold takes 22 + 15.4 = 37.4 damage to clear. An **elite** Snow Mold (tier 2 is the elite tier from 1:00 to 4:59) splits into ordinary pieces: 35% of a normal pest's HP at that time, not 35% of the elite's.

No new pieces are made once the enemy limit (550) is reached.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, Normal, `--god`, seed `wiki`; Tibo teleported deep into Frozen-Fries Tundra at 0:55 and left standing for 240 s): 63 Snow Molds died and released 126 pieces, two per mold. Each new pest was matched to the nearest death on the same tick, within 30 units. Each piece had 35% of its parent's max HP (14.75 → 5.16), radius 4.2 instead of 6 and 1 XP. None of the 126 pieces split when it died. In separate 150 s runs from 0:58 (seeds `wiki` and `s2`), the 1:00 elite was a Snow Mold with 195 HP. When it died, it released two pieces of about 5.3 HP: 35% of an ordinary mold's HP at that moment, not of the elite's.

## Tips

- Weapons that hit an area or pierce clean up the pieces well, because they appear together right where the mold died.
- Expect each mold to come back as two smaller pests; killing one right next to Tibo puts the pieces in contact range.
