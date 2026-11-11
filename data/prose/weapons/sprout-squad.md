## Overview

Sprout Squad turns pest deaths into a small biting army. It needs kills to get started: unlike [Root Legion](/weapons/root-legion), it does not grow seedlings on a timer.

## How it works

- **A death can grow one seedling.** Each pest death has a 12% chance while the squad has room. The killing blow need not come from Sprout Squad. A successful roll places a seedling where the pest died; it is not a guaranteed reward for every kill. <small>[start-rows-D92Onif5.js: `chance:.12,perAmount:3,seekRange:110,reach:3,heel:22,riseSec:.3,wiltSec:.35`]</small> <small>[sim-BudLQwEM.js: `if(n.squad[q_.heldTick]!==e.tick||n.pool.count>=n.squad[q_.cap]||!e.rng.chance(n.squad[q_.chance]))return;`]</small> <small>[sim-BudLQwEM.js: `r<0||jC(e,r,e.enemies.x[t],e.enemies.y[t])`]</small>
- **Amount raises the cap.** The squad holds `min(32, round(3 × effective Amount))` seedlings, including rising and wilting ones. Level 1 has raw Amount 1 plus Tibo's built-in +1, so its cap is 6; level 3 raises raw Amount to 2 and the cap to 9 before other bonuses. Further deaths do not replace existing seedlings at the cap. <small>[sim-BudLQwEM.js: `return Math.min(n,Math.round(e.perAmount*t.amount))`]</small> <small>[sim-BudLQwEM.js: `J_=32,Y_=class{capacity=J_;pool=new Ii(J_)`]</small>
- **They seek and bite.** After a 0.3 s rise, each seedling seeks a nearby target within 110 units. It hops toward that target until within 3 units of its body, then bites for the weapon's damage. Its raw bite interval is 0.4 s, and each seedling has its own bite timer. Without a target it returns toward Tibo, stopping within 22 units. Hops repeat at 2.5 Hz, moving during 60% of each hop cycle; raw speed is 70. <small>[sim-BudLQwEM.js: `p=Ol(e,d,f,r.seekRange)`]</small> <small>[sim-BudLQwEM.js: `OC.stop=r.heel,void kC(e,t,r,i.speed,a)`]</small> <small>[sim-BudLQwEM.js: `g=r.reach+Al(e,p)`]</small> <small>[sim-BudLQwEM.js: `u>0||(o.biteIn[t]=A(i.interval),o.bitAt[t]=e.time`]</small>
- **They expire.** Raw duration is 6 s at level 1, or 7.5 s with Tibo's base duration bonus. Active life starts after the rise; afterward a 0.35 s wilt still occupies a squad slot. The base weapon leaves no root snare and has no automatic reinforcement timer. Those are evolution features, not hidden effects of its zero cooldown. <small>[sim-BudLQwEM.js: `if(c===K_.rise&&s<r.riseSec)return;let l=o.life[t]-a;`]</small> <small>[sim-BudLQwEM.js: `if(c===K_.wilt)return void(s>=r.wiltSec&&o.pool.kill(t));`]</small> <small>[start-rows-D92Onif5.js: `sproutSec:0,snareRadius:0,snareSec:0,snareBossSlow:0`]</small>

## Controlled checks

`node tools/probe-sprout-squad.mjs` passed nine original-engine cases on build `main-B4OnpBr8.js`, Standard/Normal, seeds `s1`, `s2` and `s3`. Level 1 capped at 6 seedlings, level 3 at 9, and a deliberately supplied raw Amount of 20 capped at 32. A second batch of deaths did not exceed those caps. All cases observed repeated bites 24 ticks apart and eventual expiry without root snares; idle controls grew no seedlings.

These cases grant Peeler and Sprout Squad, suppress Peeler's own attacks, and insert two batches of 400 one-HP burning aphids with burn damage attributed to Peeler, followed by a fixed high-HP bite target. They use no gear, clock warp or HP refill. They test original death handling, squad limits and isolated bites, not natural acquisition, measured drop rates, representative DPS or practical build strength. The 12% chance is read from source, not estimated by this cap-saturation test.

The earlier Update 1 short combat report recorded Sprout Squad damage **0 / 9.91 / 0**, not zero on every seed. Its setup and broader trigger tests remain in [version 76's evidence](/versions#evidence-76); those historical results are not relabeled as this build's measurements.

## Tips

- **Bring another damage source.** It can supply the first kills; waiting in an empty arena cannot start the squad.
- **Keep fights near the seedlings.** Their target search starts at their own position, not Tibo's. More Amount raises capacity, while Duration keeps existing seedlings alive longer.
