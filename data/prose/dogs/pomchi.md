## Overview

Zelda the Chihuahua-Pomeranian is a legendary dog, outside the ordinary breed pool. Each run Zelda has a one-in-three chance to be available, and then appears as a [Stray Dog](/points-of-interest#stray-dog) in a map chunk whose centre is at least 1200 units from the start. See [Getting dogs](/dogs#getting-dogs).

Every 5 seconds Zelda marks the nearest unmarked elite or loot runner ([Golden Scarab](/enemies/golden-scarab), [Lost Saucer](/enemies/lost-saucer)) within 600 units of Tibo. A marked enemy takes 25% more damage from every hit for 8 seconds. Bosses are never marked. Zelda's aura adds +6% luck (+24% at level 5). Training lengthens the mark to about 19.5 s and shortens the interval to 3 s at level 5. From level 3 Zelda marks two targets at once, and three at level 5.

If Tibo holds Zelda and finds [Link](/dogs/pomeranian), the two fuse into [Zelda & Link](/dogs/zelda-and-link).

## How it works

- Targets are chosen by distance from Tibo, not from Zelda. Only elites and pests that flee (the loot runners) qualify, and a pest that is already marked is skipped. <small>[run-extras-WdUSXZiZ.js: `(r&M)===0&&j[n.def[t]??0]!==1`]</small>
- Marks at once by level are 1, 1, 2, 2 and 3. If fewer targets are in range, Zelda marks as many as there are. <small>[run-extras-WdUSXZiZ.js: `return n.marks[Math.min(r,n.marks.length)-1]??1`]</small>
- With no target in range, Zelda checks again every 0.25 s and the interval does not start. An elite that comes within 600 units is marked almost immediately.
- The mark multiplies damage after elite damage and before crits, so it stacks multiplicatively with both. It applies to every source, including the [Jack Russell Terrier's](/dogs/terrier) bites and the [Greyhound's](/dogs/greyhound) sprint. <small>[sim-CrpXuTSY.js: `return t.markT[n]>e.time?1+t.markB[n]:1`]</small>

## Tips

- Zelda is an elite killer. Elite damage from [Bacon Bits](/passives/bacon-bits) or [Boss Buster](/items/boss-buster) and the mark multiply each other.
- Taking curse adds extra elites (see [Curse](/curse)), which gives Zelda more targets.
- The +25% can help kill a loot runner before it escapes.
- Zelda does nothing against bosses. For the boss HP steps late in a run, look elsewhere for damage.
- If Link turns up, fusing them keeps Zelda's marks, adds Link's fluff and uses only one pack slot.
