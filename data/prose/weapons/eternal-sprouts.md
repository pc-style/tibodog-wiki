## Overview

Eternal Sprouts is the evolution of [Sprout Satellites](/weapons/sprout-satellites). To get it, have Sprout Satellites at level 8 and own [Slow Cooker](/passives/slow-cooker), then open a [chest](/chests). See [Evolutions](/evolutions).

Five sprouts circle Tibo all the time, with no off phase. Each hit deals 80 raw damage with knockback, and a pest can be hit by this weapon once every 0.35 s. The orbit is wider than Sprout Satellites' and the sprouts are bigger and faster.

## How it works

- **Always on.** The weapon is flagged `permanent`, so its active state is set every tick and the duration/cooldown cycle never runs. <small>[sim-CrpXuTSY.js: `if(!0===n.permanent)t.active=1;else if(t.active>0)--t.active,t.active<=0&&(t.cd=C(r.cooldown))`]</small> That is why its definition has 0 cooldown and 0 duration. [Duration](/stats) and cooldown bonuses do nothing for it.
- **Ring size.** The orbit radius is `54 × √area` and each sprout's hit radius is `6 × area`. With the base area of 1.3 that is about 62 units out, with a hit radius of about 7.8. [Area](/stats) bonuses widen the ring and enlarge the sprouts.
- **Rotation.** 4.4 radians per second, a lap about every 1.4 s. Orbit weapons get only half of the projectile speed bonus.
- **Hit timer.** As with Sprout Satellites, the 0.35 s timer is per pest for the whole weapon. Five sprouts cover more of the ring but do not hit one pest more often: at most about 2.9 hits per second.

## Tips

- Once the evolution is done, Slow Cooker has nothing more to do for this weapon, though it still lengthens other weapons' durations.
- The ring sits at a fixed distance. Pests that get inside it, right up against Tibo, are out of reach, so staying on the move and making pests walk through the ring gets the most out of it.
