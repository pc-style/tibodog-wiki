## Overview

Tot Barrage is the union of [Tot Gatling](/weapons/tot-gatling) and [Tot Cavalry](/weapons/tot-cavalry). Open a [chest](/chests) while holding both evolutions to combine them and free one weapon slot. It throws a rapid stream at nearby pests, pops a charging tot from each thrown tot's first hit, and sends squads out behind Tibo as he walks.

The stream has 25 base damage, a 0.13 s cooldown, raw Amount 1, speed 230, Duration 2 and Pierce 2. With Tibo's base bonuses, that is two thrown tots per volley and 2.5 s lifetime. The volley timing rules on [Tot Gatling](/weapons/tot-gatling#how-it-works) still apply; the charging tots are additional projectiles, not another volley.

## How it works

- **First-hit pop.** Each thrown tot queues one charger at its first impact position. Later piercing hits do not create more, and chargers do not recursively pop chargers. The child excludes the pest that triggered it and looks for another within 200 units. <small>[sim-BEjq2fOA.js: `e.totBarrage.thrown[t]=0`]</small> <small>[sim-BEjq2fOA.js: `return Ml(e,n.x[t],n.y[t],200,r)??-1`]</small>
- **Walking squads.** Every 40 units moved releases a squad behind Tibo. Raw squad size is 4 plus Amount bonuses, giving 5 tots by default, with the weapon's 0.1 s interval. Movement counts at most 12 units per tick. At most 24 chargers from this weapon can be alive at once; the aimed stream is separate from this cap. <small>[sim-BEjq2fOA.js: `n.pool.isAlive(i)&&n.src[i]===t&&n.motion[i]===T.homing&&r++`]</small>
- **Charger stats.** A charger deals 1.48 times the stream's damage: 37 before bonuses. It has base speed 140, Duration 4 (5 s with Tibo's base bonus), Pierce 1 and turn rate 7 rad/s. Its radius scales with the square root of Area. Damage, speed, duration and pierce bonuses carry over. <small>[sim-BEjq2fOA.js: `o.radius[s]=i*Math.sqrt(n.area),o.damage[s]=n.damage*r.damage`]</small>
- **Targeting.** A charger follows its living target; after that target dies, it can reacquire on a six-tick (0.1 s) check. Previously hit pests remain excluded. <small>[sim-BEjq2fOA.js: `n.chaseRef[t]=-1,(e.tick+t)%6==0&&Mw(e,t,jw(e,t))`]</small>

**Measured** on original engines `main-4edEFzYp.js` → `main-DWExRg3k.js`, Standard/Normal, seeds `s1/s2/s3`: only the new build's union resolver combined Gatling and Cavalry, in either slot order, freeing a slot. Missing-partner and unevolved Tot Toss controls did not unite. Targeted new-engine controls checked distance 39.99/40/40.01, Amount 1/2/5, Area 1/2.25, Pierce −1/2/5, the 24-charger cap, first-hit-only/nonrecursive pops and dead-target reacquisition. Equipment, targets and stats were supplied; these are not naturally acquired unions or representative DPS. Sixty-second stepped combat retained the original optional rules; Tot Gatling, Tot Cavalry, Tot Stampede and Seeker Sprouts damage matched the old build in every seed.

## Tips

- **Keep walking.** Standing still keeps the aimed stream but loses the walking squads.
- **Let the stream find the first target.** A hit can send a charger toward a different pest; extra pierce does not make the same thrown tot pop again.
