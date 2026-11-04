## Overview

Thousand Fries is the evolution of [Fry Knives](/weapons/fry-knives): a near-continuous stream of knives in the direction Tibo faces. Its cooldown is 0.1 s and each volley throws 2 knives 0.03 s apart, about 20 knives per second at base values. Each knife deals 24 damage, flies at 320 and hits up to 6 pests (pierce 5). The stream is wider than Fry Knives' (spread 0.25 rad instead of 0.08).

It is made by opening a chest with Fry Knives at level 8 and [Salt Shaker](/passives/salt-shaker) at any level (see [Evolutions](/evolutions) and [Chests](/chests)).

## How it works

- Aiming works as on [Fry Knives](/weapons/fry-knives): along Tibo's facing, first knife ±0.25 rad, later knives ±0.5 rad, no target needed.
- **Volley length can limit fire rate.** A new volley starts only when the cooldown is over and the previous volley has finished. <small>[sim-CrpXuTSY.js: `t.cd<=0&&t.volleyLeft<=0`]</small> Each extra knife adds 0.03 s to a volley, so from about 5 knives per volley the volley itself takes longer than the 0.1 s cooldown and extra projectiles mostly lengthen the stream rather than adding knives per second.
- Cooldown reduction is capped at 60%, and the weapon cooldown floor is 0.05 s (see [Stats](/stats)).

## Tips

- Salt Shaker's projectile speed bonus also extends how far each knife reaches within its 1.2 s lifetime.
- As with Fry Knives, the weapon only covers the direction Tibo faces.
