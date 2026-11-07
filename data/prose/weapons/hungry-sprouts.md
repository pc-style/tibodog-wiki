## Overview

Hungry Sprouts unites [Big Fry](/weapons/big-fry) and [Overgrowth](/weapons/overgrowth). Own both evolutions and open a [chest](/chests) to combine them and free one weapon slot. It fires splitting homing sprouts and keeps Big Fry's kill count.

## How it works

- **Send seven sprouts per volley.** Raw Amount 6 plus Tibo's base +1 gives seven, 0.07 s apart, every 0.6 s before cooldown bonuses. Each starts with 84 raw damage, speed 220, turn rate 8 and a 3 s lifetime (3.75 s with Tibo's base Duration). Pierce 2 allows three hits before extra Pierce.
- **Grow damage, not size.** Each credited kill adds 0.0011 raw damage, capped at +11 after 10,000 kills. The bonus is added before Tibo's damage multiplier. With 137 carried kills, that is 84.1507 raw damage, not Big Fry's old damage bonus. Hungry Sprouts has no kill-based size multiplier. <small>[sim-BKmk53sU.js: `return e.kind===`targetShot`||e.kind===`homing`?e.growOnKill:void 0`]</small> <small>[sim-BKmk53sU.js: `function uD(e,t){return Math.min(e.cap,t*e.perKill)}function dD(e,t){return!0===e.size?Math.min(3,1+t/600):1}`]</small>
- **Split on hits.** Like Overgrowth, each hit spawns two straight-flying shards with half the sprout's damage, 80% of its radius and a 0.8 s lifetime. Shards do not split again. With three hits, one sprout can produce six shards. <small>[sim-BKmk53sU.js: `r.radius[s]=.8*r.radius[t],r.damage[s]=.5*r.damage[t],r.life[s]=.8`]</small>

**Controlled checks:** original `main-CejfDMmT.js` → `main-mEUYCZvr.js`, Standard/Normal, seeds `s1/s2/s3`. Both partner orders combine only on the new engine; missing-partner controls do not combine. Big Fry's 137 kills survive even with 23 kills supplied to Overgrowth. Direct original-function checks cover 0, 1, 137, 9,999, 10,000 and 12,000 kills and confirm the +11 cap without size growth. Sixty-second combat fixtures deal damage; eight existing weapon controls have identical old/new damage and shots in each seed. Fixtures grant equipment, hold level-ups, refill HP and position durable pests; they are not natural acquisition or representative DPS. Stepped combat retains the original optional rules; direct stat probes disable the unregistered variety hook.

## Tips

- **Keep the kills, not the old bonus.** The count carries into the union, but its new formula grows much more slowly than Big Fry's.
- **Aim through crowds.** Extra Pierce gives each sprout more chances to split; Amount adds more sprouts, not more shards per hit.
