## Overview

Thousand Fries is the evolution of [Fry Knives](/weapons/fry-knives): a near-continuous stream of knives in the direction Tibo faces. Its cooldown is 0.1 s and each volley throws 3 knives (raw amount 2 plus Tibo's base +1, see [Stats](/stats)) 0.03 s apart, 30 knives per second at base values. Each knife deals 24 damage, flies at 320 and hits up to 6 pests (pierce 5). The stream is wider than Fry Knives' (spread 0.25 rad instead of 0.08).

It is made by opening a chest with Fry Knives at level 8 and [Salt Shaker](/passives/salt-shaker) at any level (see [Evolutions](/evolutions) and [Chests](/chests)).

## How it works

- Aiming works as on [Fry Knives](/weapons/fry-knives): along Tibo's facing, first knife ±0.25 rad, later knives ±0.5 rad, no target needed.
- **Volley length can limit fire rate.** A new volley starts only when the cooldown is over and the previous volley has finished. <small>[sim-CvuJ2v0s.js: `t.cd<=0&&t.volleyLeft<=0`]</small> Each extra knife adds 0.03 s to a volley, so from about 5 knives per volley the volley itself takes longer than the 0.1 s cooldown and extra projectiles mostly lengthen the stream rather than adding knives per second. In the measured run below the rate peaked at about 40 knives per second.
- Cooldown reduction is capped at 60%, and the weapon cooldown floor is 0.05 s (see [Stats](/stats)).

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right; amount raised with 1–3 [Extra Eye](/items/extra-eye) items granted directly): it threw 30 knives per second with 3 per volley, then 40, 37.5 and 40 per second with 4, 5 and 6 per volley. In the line of 8 pests the 6 nearest took almost all hits (pierce 5), with a few stray hits on the 7th from knives that missed a nearer pest. All three seeds gave the same figures.

## Tips

- Salt Shaker's projectile speed bonus also extends how far each knife reaches within its 1.2 s lifetime.
- As with Fry Knives, the weapon only covers the direction Tibo faces.
