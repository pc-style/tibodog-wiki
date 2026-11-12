## Overview

Eclipse Scythe evolves [Comet Scythe](/weapons/comet-scythe). Max Comet Scythe to level 8, hold [Big Bowl](/passives/big-bowl) at any level, then open a [chest](/chests). Sun and moon blades orbit Tibo at opposite reaches: while one set cuts wide, the other cuts close, then they trade places.

## How it works

- Base stats are 52 damage, three blades, area 1.35 and speed 4.6. Tibo's built-in +1 amount makes four blades before other bonuses.
- Even-indexed blades use the ordinary reach cycle; odd-indexed blades reverse it. Base Comet Scythe keeps all blades on the same reach cycle. <small>[sim-CnCw_hkt.js: `return e.counterSwing&&t%2==1`]</small>
- Reach runs from 0.4 to 1.8 times `36 × √area`: about 16.73–75.29 units at base area 1.35, before Big Bowl or other bonuses. Its hit radius is `11 × area`, and a pest can be hit again after 0.25 s. <small>[start-rows-DPh6Cfxz.js: `size:11,orbitRadius:36,hitInterval:.25,reachIn:.4,reachOut:1.8,lapsPerSwing:2,counterSwing:!0`]</small>
- The damage check uses each blade's own reach, not just its visual position. <small>[sim-CnCw_hkt.js: `let i=t.angle+n/r.amount*N,f=n%2==1?c:s,p=K(e,a+k(i)*f,o+w(i)*f,l,d);`]</small>

**Controlled comparison:** original-engine Standard/Normal, seeds `s1`, `s2`, `s3`, builds `main-xLDa8uuE.js` and `main-BVRkD6XA.js`. Granted loadouts and inserted, charged single-reward chests evolved level-8 Comet Scythe with Big Bowl level 1 or 5 only in the new build; level 7 and missing-catalyst controls did not evolve. Single rewards were forced to keep a chest from first upgrading the weapon and then evolving it. Pose checks cover near/far phases and the blade-count boundary. Pinned-foe collision controls at area 1 and 1.5 confirm the odd blade switches from far hits to near hits only when counter-swing is enabled in the new engine. Ordinary-spawn combat with the granted weapon dealt damage in all three seeds; base Comet Scythe controls matched the old build. These fixtures establish recipe and collision behavior, not natural acquisition, drop odds or normal-run DPS.

## Tips

- **Keep both rings in play.** The blades cover close and wide arcs at once, but they are moving blades, not a continuous damage aura.
- **Keep Big Bowl after evolving.** The catalyst is not consumed, and its area bonus widens the orbit and the blade hit radius.
