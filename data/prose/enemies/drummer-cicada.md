## Overview

The Drummer Cicada is a support pest added in build 266. It does not rush Tibo. It holds a distance of about 100 units and drums every few seconds, and every pest close to it runs **35% faster for 3 seconds** while the cicada lives. Kill it first: the haste stops the moment it falls. It has 70 base HP, 8 contact damage and 38 speed.

It appears only on **Hard and Nightmare**, from **3:45** of the run clock, and **at most one is alive at a time**. Each ordinary pest spawn then has a 5% chance to become a Drummer Cicada instead, unless one is already alive. Easy, Normal and Story have none, because their drummer limit is 0. <small>[intro-shared-BYS92VL3.js: `maxDrummers:0,drummerShare:.05,drummersFromSec:d(1,4)`]</small> <small>[intro-shared-BYS92VL3.js: `alive:.75,floorShare:.25,drummers:1`]</small> <small>[intro-shared-BYS92VL3.js: `maxDrummers:t.spawns.maxDrummers+n.drummers`]</small> <small>[sim-Jx34lrNz.js: `if(n.maxDrummers<=0||e.runClock<n.drummersFromSec)return t;`]</small>

## How it works

- **Keeps its distance.** Within 115 units of Tibo it backs away when closer than 85 units, and otherwise circles him sideways at half speed. Farther out it closes in like an ordinary pest. <small>[sim-Jx34lrNz.js: `if(r<.85*n)return i.vx[t]=-a*s,void(i.vy[t]=-o*s);i.vx[t]=-o*s*.5,i.vy[t]=a*s*.5`]</small>
- **Drum cycle.** After 3 s of moving, and only while Tibo is within 150 units, it stops, lifts for 0.4 s, then beats for 0.6 s while standing still: one drum every 4 s. <small>[boot-DloEAWes.js: `keep:100,every:4,lift:.4,beat:.6,reach:80,haste:1.35,hasteSec:3`]</small> <small>[sim-Jx34lrNz.js: `i.timer[t]>0||r>1.5*n.keep||(i.state[t]=Qv.lift`]</small>
- **Haste.** The beat marks every other live pest within 80 units of the cicada for 3 s. A marked pest's movement is multiplied by 1.35 each tick, but only while the cicada that marked it is still alive. A reused pool slot does not inherit the mark. <small>[sim-Jx34lrNz.js: `u*u+d*d>s||(r.until[n]=o,r.by[n]=a,r.who[n]=i.pool.id(n),r.hasted++)`]</small> <small>[sim-Jx34lrNz.js: `n.pool.id(a)===t.who[a]&&n.pool.has(t.by[a])&&(n.vx[a]=n.vx[a]*r,n.vy[a]=n.vy[a]*r)`]</small>

**Measured** in the headless sim (`tools/play.mjs` on `main-FvRXriQY.js`, an undocumented build whose whole game is identical to build 266 `main-CXYinI0m.js` apart from its commit stamp; Standard, god mode, run clock warped to 3:20, then 240 s of play, seeds `s1`, `s2` and `s3`):
- On Hard and Nightmare, the first cicada appeared at 3:45.6–3:54, and never more than one was alive.
- On Easy and Normal, none appeared.
- On Hard, hasted pests moved at a median 1.35× their base speed, against 1.00× for unmarked pests, in all three seeds.

These were forced-clock runs, not naturally survived ones, and they did not measure damage taken.

## Tips

- **Kill it before the crowd reaches you.** It stands out of the swarm's centre and its haste ends as soon as it dies.
- **Ranged and seeking weapons reach it best.** It backs off when you approach, so a melee build has to chase it.
