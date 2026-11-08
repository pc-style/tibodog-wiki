## Overview

The Field Crow is one of the most widespread tier-3 pests. It appears in [Potato Field](/biomes/potato-field), [Crop Circle](/biomes/crop-circle), [Chip Canyons](/biomes/chip-canyons), [Frozen-Fries Tundra](/biomes/frozen-tundra) and [Gutterball Lanes](/biomes/gutterball-lanes), sharing the tier-3 slot with pests such as the [Blight Spore](/enemies/blight-spore), [Field Rat](/enemies/field-rat) and [Sizzle Imp](/enemies/sizzle-imp). On Normal, tier-3 pests spawn from 6:00 to 16:59 (from 7:00 on Easy), and between 5:00 and 9:59 the minute's [elite](/bosses#elites) can be a crow.

It is a charger with a quick approach. It moves at speed 40 between charges, which ties it with the [Grease Fiend](/enemies/grease-fiend) as the fastest charger, and it dives once Tibo is within 110 units. It has 38 base HP and hits for 12 on contact, a little less HP but almost the same damage as the [Bog Toad](/enemies/bog-toad). Its mass of 0.2 means knockback still pushes it most of the way. A kill gives 4 XP and an 8% chance of a coin.

## How it works

The timings below are before 20:00. In Standard from 20:00, the windup is 0.6 s instead of 0.5 s; the dash and cooldown do not change. <small>[sim-DwWYU7G5.js: `return!ii(e)||e.runClock<Qr?t:Math.max(t,.6)`]</small>

The charge cycle is the standard one. The crow stops for a 0.5 s windup aimed at Tibo's position when the windup starts, then dashes in a straight line at 190 for 1.3 × 110 / 190 ≈ 0.75 s, about 143 units. It then walks normally for 1.6 s before it can charge again. <small>[sim-DwWYU7G5.js: `i.state[t]=2,i.timer[t]=1.3*n/r,i.windup[t]=0`]</small> The dash only deals ordinary contact damage, and a newly spawned crow waits 0.5–2 s before its first charge can begin.

## Tips

- **Hit crows during their cooldown.** Because crows walk at 40, they recover the distance after a missed dive faster than slower chargers do. Their 1.6 s cooldown is the window to hit them.
- A sideways step during the windup is enough to dodge, since the dive cannot turn. Watch for several crows winding up at once from different directions.
- Knockback works well on crows, which resist only 20% of it, and buys time between their dives.
