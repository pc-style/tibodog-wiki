## Overview

Starch Puddle places charged pools near pests. At level 1 a pool deals 8 raw damage every 0.4 s and slows pests to 55% speed for 0.6 s before Duration bonuses. Its raw lifetime is 2.4 s, or 3 s with Tibo's base +25% Duration. The raw cooldown is 3.2 s; raw amount 1 becomes two pools with Tibo's base +1 Amount.

At level 8 it has 16 raw damage, Area 1.4, duration 3.2 s and cooldown 2.8 s. Own [Butter Pat](/passives/butter-pat) and open a [chest](/chests) to evolve the maxed weapon into [Gratin Puddle](/weapons/gratin-puddle). Both are storm-class weapons, despite leaving pools like zone weapons.

## How it works

- **Placement and size.** It looks for pests within its 120-unit targeting range and leaves round pools. A pool's radius is `20 × Area`, not `20 × √Area`. The pool stays where it was placed. <small>[sim-Bt1MrMd3.js: `a=n.trail===void 0?fO(e,t,n.range,0):void 0`]</small> <small>[sim-Bt1MrMd3.js: `o.radius[i]=n.size*r.area,o.life[i]=r.duration,o.maxLife[i]=r.duration`]</small>
- **Damage and slow.** Pests touching the pool's edge count. Every hit applies the slow; Duration multiplies the status time as well as the pool's lifetime. <small>[boot-DWLgJ_Vk.js: `` kind:`slow`,factor:.55,seconds:.6 ``]</small>
- **Separate pools.** Ordinary, non-trail pools do not use the shared trail re-hit timer. Each pool has its own tick timer, so overlapping pools can both hit. <small>[sim-Bt1MrMd3.js: `o.rehit[i]=n.trail===void 0?0:S(n.hitInterval)`]</small>
- **Storm Sage forks.** Eligible pool hits now reach the set-rule callback. All original targets in a pool tick are marked before forks are selected, preventing a fork from simply choosing another pest already in that pool's primary hit list. Spark spending follows the weapon's firing-time volley, not every pool tick. <small>[sim-Bt1MrMd3.js: `for(let t=0;t<o;t++)Pu(e,U(a,t),n);for(let r=0;r<o;r++)vv(e,t,U(a,r),n,0)`]</small>

**Measured** with original old/new callbacks on equal supplied build-157 states, Standard/Normal, seeds `s1/s2/s3`: pool contact includes equality; two primary targets and a third outside the pool produce two ordinary hits plus one fork with a stored spark. Repeated ticks reuse the volley, a later firing time can spend another spark, and no-rule, empty-spark, dash-marked and invalid-slot controls do not spend one. A single unmodified primary hit reduces supplied HP from 1,000 to 992. Build 156 had no Starch Puddle; this is an isolated callback comparison, not natural availability, DPS or reward acceptance.

## Tips

- Area enlarges the damaging pool; Duration keeps it and its slow active longer.
- The slow can help keep pests in a pool, but it is not a stun or freeze.
