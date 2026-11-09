## Overview

Freezer Burn is a Rare item that makes frozen enemies shatter. When an enemy dies while frozen, it bursts for 30% of its own max HP, hitting every enemy within 34 units and freezing them for 1 second. The radius grows with the square root of your area multiplier, and the freeze time is multiplied by Tibo's duration stat (×1.25 with no bonuses).

It has weight 6 out of 131 among Rare items, about 0.46% of item rolls at luck 0 with the full pool eligible and no weapon-catalyst weight bonuses. With [Slow Cooker](/passives/slow-cooker) at level 5, the next chest turns it into [Glacier Spud](/items/glacier-spud).

## How it works

- Freezer Burn freezes nothing by itself. The enemy must still be frozen when it dies. <small>[sim-eSpFSniv.js: `o.frozenOnly&&t.freezeT[n]<=0`]</small>
- The proc chance is 100%, limited to 6 shatters per second per copy. Extra copies only raise that limit.
- Shatter damage comes from the dead enemy's max HP, not from Tibo's damage stat. It still gets the elite/boss bonus and can crit.
- The shatter freezes every enemy it hits, including the ones it kills, so those also count as frozen when they die. One frozen kill can chain through a packed group until the per-second limit runs out.
- Bosses cannot be frozen, so they never shatter, and the shatter's freeze does not affect them. <small>[sim-eSpFSniv.js: `` case`freeze`:r||(e.freezeT[t]=Math.max(e.freezeT[t],n.seconds*i)) ``]</small>

## Tips

- **Get a steady freeze source first.** You need a steady freeze source first: [Frozen Fries](/weapons/frozen-fries), [Root Cellar](/weapons/root-cellar), [Hash Bulwark](/weapons/hash-bulwark), [Cold Storage](/weapons/cold-storage) or [Permafrost Fries](/weapons/permafrost-fries). A [Spud Freezer](/points-of-interest#spud-freezer) freezes every pest on the map for 7.5 s, which makes a good moment to clear the screen.
- Slow Cooker is worth taking with this item even before the evolution, because longer freezes leave more time for frozen enemies to die.
