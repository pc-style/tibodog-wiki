## Overview

Sprout Satellites puts potato sprouts in orbit around Tibo for a few seconds at a time. At level 1, 2 sprouts circle at a distance of 38 units for 4 s, then disappear for a 3 s cooldown. Any pest a sprout touches takes 14 raw damage with knockback. Each pest can be hit by this weapon at most once every 0.4 s.

It is offered on level-up cards and is in the starting-weapon pool. At level 8 it has 4 sprouts, 48 raw damage, area 1.4, a 5 s orbit and a 2 s cooldown. With [Slow Cooker](/passives/slow-cooker) owned, a [chest](/chests) evolves it into [Eternal Sprouts](/weapons/eternal-sprouts), which never stop orbiting.

## How it works

- **On/off cycle.** The orbit lasts for the weapon's duration (at least 0.5 s). The cooldown only starts after the sprouts disappear. <small>[sim-CrpXuTSY.js: `if(!0===n.permanent)t.active=1;else if(t.active>0)--t.active,t.active<=0&&(t.cd=C(r.cooldown))`]</small> One cycle is duration + cooldown: 4 s on and 3 s off at level 1, 5 s on and 2 s off at level 8. [Duration](/stats) bonuses lengthen the on-time and cooldown bonuses shorten the gap.
- **Orbit.** Sprouts are spaced evenly around Tibo. The orbit radius is `38 × √area` and each sprout's hit radius is `6 × area`. <small>[sim-CrpXuTSY.js: `c=n.orbitRadius*Math.sqrt(r.area),l=n.size*r.area,u=Math.round(60*n.hitInterval)`]</small> At level 8 (area 1.4) that is about 45 units out, with an 8.4-unit hit radius.
- **Rotation speed.** For this weapon the `speed` stat is in radians per second. At 3.2 a sprout completes a lap in about 2 s; the level 3 upgrade raises it to 3.8. Orbit weapons get only half of Tibo's projectile speed bonus. <small>[sim-CrpXuTSY.js: `1+.5*(r.projSpeedMult-1)`]</small>
- **Hit timer.** `hitInterval` (0.4 s) is tracked per pest for the whole weapon, not per sprout. <small>[sim-CrpXuTSY.js: `e.tick-i.hitStamp[a]<u||(i.hitStamp[a]=e.tick,J(e,r))`]</small> A pest touched by two sprouts within 0.4 s is only hit once.

## Tips

- Because of the shared hit timer, more sprouts mean more coverage around the ring rather than more damage on one pest. A single target takes at most 2.5 hits per second from this weapon.
- Pests standing closer to Tibo than the orbit, or farther out, are not touched. The ring works best on pests walking in toward Tibo, since they have to cross it.
