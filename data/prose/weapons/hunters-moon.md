## Overview

Hunter's Moon evolves [Harvest Moon](/weapons/harvest-moon). Max Harvest Moon to level 8, hold [Potato Magnet](/passives/potato-magnet) at any level, then open a [chest](/chests). Its orbiting moons grab pests, fling them away and add a delayed burst.

## How it works

- Base stats are 93 damage, two moons, area 1.3 and speed 2.8. Tibo's built-in +1 amount makes three moons before other bonuses.
- A grabbed pest is carried for at least 0.4 s, then flung with base force 300. The burst follows the flung pest for 0.25 s before exploding; if the pest dies first, it uses its last recorded position. <small>[sim-DO61yIsl.js: `i.x[o]=a.x[e],i.y[o]=a.y[e]`]</small>
- The burst deals 40% of the weapon damage in radius `30 × √area`, about 34.21 units at base area 1.3. It is separate from the fling's direct hit.

**Controlled comparison:** original-engine Standard/Normal, seeds `s1`, `s2`, `s3`, only the selected weapon granted, HP refilled, 8 s warmup, then six high-HP pests held 45–90 units to the right for 20 s with other spawning culled. Hunter's Moon dealt 15,772.8–17,465.4 damage and produced burst radius 34.21; base Harvest Moon controls matched the old build. Pinned pests do not reproduce natural flinging trajectories or normal-run DPS. Inserted charged chests evolved level-8 Harvest Moon with Potato Magnet in all three seeds, never without it or in the old build; this is recipe behavior, not natural acquisition or drop odds.

## Tips

- **Keep pursuing pests near the fling path.** The delayed explosion happens around the flung pest, not around Tibo, so nearby pursuers can share the burst.
- Potato Magnet remains useful for collecting XP after the evolution; the catalyst is not consumed.
