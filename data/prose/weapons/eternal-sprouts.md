## Overview

Eternal Sprouts is the evolution of [Sprout Satellites](/weapons/sprout-satellites). To get it, have Sprout Satellites at level 8 and own [Slow Cooker](/passives/slow-cooker), then open a [chest](/chests). See [Evolutions](/evolutions).

Six sprouts (raw amount 5 plus Tibo's base +1, see [Stats](/stats)) circle Tibo all the time, with no off phase. Each hit deals 80 raw damage with knockback, and a pest can be hit by this weapon once every 0.35 s. The orbit is wider than Sprout Satellites' and the sprouts are bigger and faster.

## How it works

- **Always on.** The weapon is flagged `permanent`, so its active state is set every tick and the duration/cooldown cycle never runs. <small>[sim-DS2NHJj-.js: `if(!0===n.permanent)t.active=1;else if(t.active>0)--t.active,t.active<=0&&(t.cd=E(r.cooldown))`]</small> That is why its definition has 0 cooldown and 0 duration. [Duration](/stats) and cooldown bonuses do nothing for it.
- **Ring size.** The orbit radius is `54 × √area` and each sprout's hit radius is `6 × area`. With the base area of 1.3 that is about 62 units out, with a hit radius of about 7.8. [Area](/stats) bonuses widen the ring and enlarge the sprouts.
- **Rotation.** 4.4 radians per second, a lap about every 1.4 s. Orbit weapons get only half of the projectile speed bonus.
- **Hit timer.** As with Sprout Satellites, the 0.35 s timer is per pest for the whole weapon. Six sprouts cover more of the ring but do not hit one pest more often: at most about 2.9 hits per second.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still; for the ring test the clock was first warped 200 s and played 20 s to have enough pests): with 24 pests held in a ring on the 61.6-unit orbit, at most 6 separate spots were hit on the same tick, one per sprout. A pest moved along with a sprout every tick was hit exactly every 21 ticks (0.35 s). All three seeds gave the same figures.

## Tips

- Once the evolution is done, Slow Cooker has nothing more to do for this weapon, though it still lengthens other weapons' durations.
- The ring sits at a fixed distance. Pests that get inside it, right up against Tibo, are out of reach, so staying on the move and making pests walk through the ring gets the most out of it.
