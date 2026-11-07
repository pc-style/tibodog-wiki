## Overview

Root Cellar puts a permanent cold ring around Tibo. The band runs from 28 to 40 units from Tibo at area 1. A pest that touches it takes 8 damage and freezes in place for 0.7 s. A boss slows by 40% for 1 s instead, because bosses cannot be frozen. The ring is always active and does not fire in pulses. The 2.4 s cooldown is how long each pest must wait before the ring can hit it again.

You get it from a level-up card. At level 8 it deals 38 damage, the band runs to 56 units (area 1.4) and pests can be hit again every 1.6 s. With a max-level Root Cellar and [Slow Cooker](/passives/slow-cooker), a chest can evolve it into [Cold Storage](/weapons/cold-storage).

## How it works

- **A ring, not a disc.** The outer edge is `size` × area and the inner edge is (`size` − `width`) × area. A pest standing entirely inside the inner edge is skipped, so pests that have already reached Tibo are not hit. <small>[sim-BEjq2fOA.js: `if(v(K(e,r)-i,q(e,r)-a)+Fl(e,r)<s)continue`]</small>
- **Per-pest cooldown.** Every frame, each pest touching the band is hit unless this weapon has hit it within the last cooldown period. Cooldown reduction makes repeat hits on the same pest come sooner. <small>[sim-BEjq2fOA.js: `let u=Math.max(1,Math.round(60*r.cooldown/ky(e)))`]</small>
- **Freeze and slow.** `onHit` freezes a normal pest, which stops it moving. `bossOnHit` slows a boss instead: `factor` 0.4 means the boss moves at 60% speed. Both durations are multiplied by Tibo's duration stat, so with the base +25% duration the freeze lasts 0.875 s and the boss slow 1.25 s.
- The ring has no knockback, and amount bonuses do not affect it.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right, then one pest held 32 units away (48 at level 8)): in the line only the pests at 30 and 40 units were hit at level 1, each every 2.4 s, and at level 8 those at 40 to 60 units, each every 1.6 s; the single pest's freeze timer was set to 0.875 s by each hit. With the clock warped to 9:58 and the Great Wireworm boss held 40 units away, the boss was hit 7–9 times in 21 s, its freeze timer never left 0, and each hit slowed it by 40% for 1.25 s. All three seeds gave the same figures.

## Tips

- **Pair it with area weapons.** The ring catches pests as they walk in towards Tibo, and the freeze holds them at the band's edge for a moment. That gives other area weapons time to hit them before they reach you.
- Its damage is low until the last levels, so treat it mainly as crowd control.
