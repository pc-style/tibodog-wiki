## Overview

Spud Dynamo sends starch sparks around Tibo in a wide orbit. Its raw amount is 1; Tibo's base +1 Amount makes **two sparks**. At level 1 each hit deals 12 raw damage, the orbit lasts 3 s with Tibo's base duration bonus, and a 4.5 s cooldown follows the active phase. At level 8, raw damage is 15, duration 2.8 s, cooldown 4.1 s and Area 1.1.

At level 8, owning [Slow Cooker](/passives/slow-cooker) lets a [chest](/chests) evolve it into [Dynamo Coil](/weapons/dynamo-coil): a permanent, wider orbit with three sparks at Tibo's base Amount. Both belong to the storm class used by [Storm Sage](/modes#gear-set-rules), not the orbit class used by Space Farmer.

## How it works

- **A ring, not a disk.** Sparks orbit at `88 × √Area` units, with a hit radius of `16 × Area`. More Area widens the orbit and enlarges each spark. Pests well inside the ring can escape its reach. <small>[sim-CJCEF4hP.js: `s=n.orbitRadius*Math.sqrt(r.area),l=n.size*r.area,u=Math.round(60*n.hitInterval)`]</small>
- **Shared contact timer.** A pest can take a hit from this weapon every 0.3 s (18 ticks), regardless of how many sparks touch it. Touching the boundary counts. <small>[sim-CJCEF4hP.js: `if(e.tick-i.hitStamp[a]<u)continue;i.hitStamp[a]=e.tick`]</small>
- **Active phase, then recharge.** Duration lengthens the active orbit; cooldown shortens only the gap after it disappears. The base rotation speed is 2.4 radians per second, with half the projectile-speed bonus applied. <small>[sim-CJCEF4hP.js: `` t.active=S(Math.max(.5,r.duration)),Wx(e,r.cooldown),$a(t.def.id)===`storm`&&(t.firedAt=e.time) ``]</small>
- **Storm Sage.** An activation records a new volley. Its first eligible contact can spend a stored spark, allowing hits in that activation to fork to another nearby target. Repeated contact ticks do not each spend another spark. See [the set rule](/modes#gear-set-rules). <small>[sim-CJCEF4hP.js: `a.owner[n]!==r||a.volleyAt[n]!==i.firedAt`]</small>

**Measured** with original build-156/157 callbacks and supplied build-157 weapon states, Standard/Normal, seeds `s1/s2/s3`: contact just inside, exactly at and just outside the radius; the 17/18-tick re-hit boundary; activation/recharge and repeated-volley spark spending all pass. Original damage resolution takes a supplied 1,000-HP pest to 988 without bonuses. The old build did not contain this weapon: the callback comparison is not evidence it was obtainable then. Grants, fixed targets, clocks and held rotation are fixtures, not natural acquisition or representative DPS.

## Tips

- Keep pests crossing the ring rather than standing directly against Tibo.
- Amount covers more of the ring; it does not bypass the shared timer on one pest.
