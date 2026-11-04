## Overview

Permafrost Fries is the evolution of [Frozen Fries](/weapons/frozen-fries). Every 1 s it fires a volley of 4 frozen fries at the nearest pest, 0.08 s apart. Each fry deals 48 damage, flies at 230 and hits up to 4 pests (pierce 3). Pests it hits are frozen for 2 s instead of 1, and its hits deal double damage to pests that are already frozen.

It is made by opening a chest with Frozen Fries at level 8 and [Thick Skin](/passives/thick-skin) at any level (see [Evolutions](/evolutions) and [Chests](/chests)).

## How it works

- Targeting, volley spread and freeze rules are the same as on [Frozen Fries](/weapons/frozen-fries). Bosses still cannot be frozen.
- **Shatter**: each fry carries a `shatter` multiplier of 2. <small>[sim-CrpXuTSY.js: `l.shatter[n]=i.shatter??0`]</small> When it hits a pest that is frozen at that moment, the damage is multiplied by 2. <small>[sim-CrpXuTSY.js: `o.shatter[i]>0&&t.freezeT[r]>0&&(u*=o.shatter[i])`]</small>
- Damage is applied before the hit's own freeze, so the first fry to hit an unfrozen pest deals normal damage and freezes it; the next fries of the volley, and any fry within the next 2 s, deal double.
- Only Permafrost Fries' own projectiles shatter. Pests frozen by other sources (for example [Waffles](/dogs/corgi)) also take double damage from it, because the check is on the pest's freeze, not on who froze it.

## Tips

- With 4 fries per volley, most of the volley hits already-frozen targets, so expect close to double damage against groups of ordinary pests and elites.
- Against bosses neither the freeze nor the shatter bonus applies; it deals its plain 48 per hit.
