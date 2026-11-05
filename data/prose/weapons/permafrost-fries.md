## Overview

Permafrost Fries is the evolution of [Frozen Fries](/weapons/frozen-fries). Every 1 s it fires a volley of 5 frozen fries (raw amount 4 plus Tibo's base +1, see [Stats](/stats)) at the nearest pest, 0.08 s apart. Each fry deals 48 damage, flies at 230 and hits up to 4 pests (pierce 3). Pests it hits are frozen for 2 s instead of 1 (2.5 s and 1.25 s with Tibo's base +25% duration), and its hits deal double damage to pests that are already frozen.

It is made by opening a chest with Frozen Fries at level 8 and [Thick Skin](/passives/thick-skin) at any level (see [Evolutions](/evolutions) and [Chests](/chests)).

## How it works

- Targeting, volley spread and freeze rules are the same as on [Frozen Fries](/weapons/frozen-fries). Bosses still cannot be frozen.
- **Shatter**: each fry carries a `shatter` multiplier of 2. <small>[sim-Bgf_4bDZ.js: `s.shatter[r]=n.shatter??0`]</small> When it hits a pest that is frozen at that moment, the damage is multiplied by 2. <small>[sim-Bgf_4bDZ.js: `o.shatter[i]>0&&t.freezeT[n]>0&&(u*=o.shatter[i])`]</small>
- Damage is applied before the hit's own freeze, so the first fry to hit an unfrozen pest deals normal damage and freezes it; the next fries of the volley, and any fry within the next 2 s, deal double.
- Only Permafrost Fries' own projectiles shatter. Pests frozen by other sources (for example [Waffles](/dogs/corgi)) also take double damage from it, because the check is on the pest's freeze, not on who froze it.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it fired 5 fries every 1 s and only the 4 nearest pests were ever hit. Hits dealt 48 or 96, the 96s landing on pests that were already frozen, and the freeze timer peaked at 2.5 s. With the clock warped to 9:58 and the Great Wireworm boss held 40 units away, the boss was hit 27–41 times in 21 s and never frozen, while over 100 ordinary pests were. All three seeds gave the same figures.

## Tips

- With 5 fries per volley, most of the volley hits already-frozen targets, so expect close to double damage against groups of ordinary pests and elites.
- Against bosses neither the freeze nor the shatter bonus applies; it deals its plain 48 per hit.
