## Overview

Mashquake is the evolution of [Mash Wave](/weapons/mash-wave). Get Mash Wave to level 8 while you own [Big Bowl](/passives/big-bowl), then open a [chest](/chests).

Every 2.2 s it sends 3 rings (2 plus Tibo's built-in +1 amount, see [Stats](/stats)), 0.3 s apart. Each ring rolls out to 144 units (90 × its 1.6 Area) at 180 units/s and hits each pest once for 20 damage with knockback 2.5. Pests hit are slowed by 40% (to 60% speed) for 1 s × Duration. Each ring also flings 6 clumps of mash in an even circle, so a volley throws 18 clumps.

## How it works

- The rings work like [Mash Wave](/weapons/mash-wave)'s: each stays centred where Tibo was when it was released, its edge band is 12 × √Area + 6 units deep, and it hits each pest once.
- The slow uses the game's `slow` status, which multiplies speed by 1 − `factor`. A factor of 0.4 is a 40% slow. While [Panic Fry](/items/panic-fry) is active, this stronger slow wins rather than adding its 5% slow. <small>[sim-CoEKDEz3.js: `let u=t.slowT[a]>0?t.slowF[a]:0,d=1-(u>i?u:i)`]</small>
- **Clumps.** The 6 clumps start at Tibo and fly outward in a full circle (`spread` π on each side), starting from a different angle each time. Each deals the full wave damage (`damageMult` 1), passes through every pest, and flies at 90 units/s for 1.4 s × Duration. Clumps that hit one pest share a 0.3 s cooldown per weapon (`rehit`). <small>[sim-CoEKDEz3.js: `return!(e.tick-r.hitStamp[i]<e.projectiles.rehit[t]||(r.hitStamp[i]=e.tick,0))`]</small>

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): every 2.2 s it released 3 rings 0.3 s apart and 18 clumps, the clumps with a 1.75 s lifetime; each hit slowed the pest by 40% for 1.25 s. All three seeds gave the same figures.

## Tips

- **Use it on pests beyond the ring.** The clumps travel past the edge of the ring, so they reach pests outside its 144-unit radius.
- The slow keeps pests inside the next ring and in the path of the clumps a little longer.
