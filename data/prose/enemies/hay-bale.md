## Overview

Hay Bales come only from the [Ring of Hay Bales](/events/bale-ring) event (“Hay bales close in!”). The [wave schedule](/bosses#wave-schedule) fires it at 6:00, 9:00, 13:00, 16:00 and 19:00, and at every odd minute from 21:00 on. The event surrounds Tibo with a ring of bales that slowly closes in.

A bale is a moving wall, not a hunter. It has 400 base HP, the most of any pest, and before [curse](/curse) that works out to about 390 HP at 6:00 and 1,250 at 19:00 on Normal. It deals 14 contact damage and crawls at speed 9. With mass 1 it ignores knockback completely. <small>[sim-BtxK0PMC.js: `if(o<=0||i||s>=1)return`]</small> A destroyed bale gives 3 XP and a 5% chance of a coin.

## How it works

- **Count.** The ring has 36 × the level's `wallPests` multiplier bales: 5 on Easy, 11 on Normal and Hard, 22 on Nightmare (see [Modes](/modes)). They are spaced evenly on a circle of radius 170 around Tibo. <small>[sim-BtxK0PMC.js: `a=Math.max(1,Math.round(t.count*e.cfg.level.wallPests))`]</small>
- **Movement.** Each bale heads for the ring's centre, which is where Tibo stood when the event fired, not Tibo's current position. A bale stops once it is within 20 units of that point. Its speed is reset to the base 9, so overtime speed scaling does not apply, and it needs about 17 s to close the ring. <small>[sim-BtxK0PMC.js: `a=Rt(r,i),o=a<20?0:n.speed[t]`]</small>
- **Lifetime.** Bales disappear without drops 22 s after the event. <small>[sim-BtxK0PMC.js: `r.speed[u]=g.enemyAt(n).speed,r.tx[u]=i,r.ty[u]=o,r.despawnAt[u]=e.time+t.life`]</small>

## Tips

- **Walk out through a gap early.** Simply walk out. On Normal the 11 bales start about 97 units apart, centre to centre. A bale touches Tibo within 13 units (8 + 6, less 1), so that leaves a gap of roughly 70 units to pass through. On Nightmare the gaps start at only about 23 units and shrink as the ring closes, so leave early.
- Once Tibo is outside, the bales keep crawling towards the old centre and ignore Tibo. They are only a problem if Tibo walks into them.
- Breaking a bale costs a lot of damage for 3 XP, and they vanish on their own after 22 s, so destroying them is rarely worth it unless one blocks the only way out.
