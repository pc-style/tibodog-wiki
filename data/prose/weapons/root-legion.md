## Overview

Root Legion evolves [Sprout Squad](/weapons/sprout-squad). Max Sprout Squad to level 8, hold [Root Network](/passives/root-network) at any level, then open a [chest](/chests). It raises seedlings beside Tibo without waiting for kills; each wilted seedling leaves a short-lived root snare.

## How it works

- **More seedlings.** A kill has a 20% seedling chance, up from Sprout Squad's 12%. The squad cap is four times amount, rounded and capped at 32, rather than three times amount. Raw amount 5 plus Tibo's built-in +1 gives a cap of 24 before other bonuses. <small>[sim-SY4MKKFC.js: `return Math.min(n,Math.round(e.perAmount*t.amount))`]</small>
- **Steady reinforcements.** When there is room, one seedling rises 22 units from Tibo every 0.5 s. A full squad pauses this timer's spawning; it is not a promise of two extra seedlings every second at the cap. <small>[sim-SY4MKKFC.js: `if(t.sproutSec<=0||e.time<n.squad[kg.sproutAt]||n.pool.count>=n.squad[kg.cap])return;`]</small>
- **Longer-lived bites.** Raw damage is 80, speed 80, duration 11 s and bite interval 0.35 s. Tibo's base duration bonus makes 13.75 s of active life, after the 0.3 s rise. Seedlings seek pests within 130 units and return toward Tibo when no target is nearby. <small>[start-rows-Cb8FMH09.js: `damage:80,cooldown:0,amount:5,area:1,speed:80,duration:11,pierce:0,knockback:.5,interval:.35`]</small>
- **Root snares.** Expiring seedlings leave a snare for 1.2 s with radius `26 × area`. It refreshes a 0.1 s slow while a pest's body overlaps it: ordinary pests are held still, bosses are slowed by 30%, not rooted. At most 16 snares exist at once. <small>[sim-SY4MKKFC.js: `i.radius[a]=n.snareRadius*r.area,i.bornAt[a]=e.time,i.endAt[a]=e.time+n.snareSec`]</small> <small>[sim-SY4MKKFC.js: `s=Tl(r)?n.snareBossSlow:1;a.slowF[o]=Math.max(a.slowF[o],s),a.slowT[o]=Math.max(a.slowT[o],.1)`]</small>

**Controlled comparison:** Standard/Normal, seeds `s1`, `s2`, `s3`, original engines `main-BVRkD6XA.js` and `main-T9nqT8ni.js`. Granted loadouts and inserted charged single-reward chests evolved only level-8 Sprout Squad with Root Network level 1 or 5 in the new build; level 7, no catalyst and old-engine controls did not evolve. Empty-arena controls isolate the new half-second spawning from kill triggers. Original-function fixtures check snare radius at area 1 and 1.5, overlap on both sides of the boundary, ordinary versus boss slowing, expiry and capacity. Granted-weapon combat with a supporting Fry Sentry deals damage in all three seeds. These are fixtures, not natural acquisition, drop odds, representative DPS or server acceptance.

## Tips

- **Keep pests near the seedlings.** Snares appear where seedlings wilt, not automatically under Tibo. Kiting past that patch can keep ordinary pests in biting range.
- **Add amount for a larger squad.** It raises the cap, while duration keeps existing seedlings alive longer. Neither removes the 32-seedling or 16-snare ceiling.
