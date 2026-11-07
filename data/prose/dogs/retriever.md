## Overview

Biscuit the Golden Retriever is one of the eight ordinary breeds and one of the two most common (weight 12 of 80, tied with the [Jack Russell Terrier](/dogs/terrier)). Tibo recruits it by walking onto a [Stray Dog](/points-of-interest#stray-dog); another Retriever stray later levels it up.

Every 3 seconds Biscuit fetches. Every loose pickup within 120 units of Tibo starts flying to him, the same way pickups do when a magnet is collected. Chests and items are left alone. Its aura adds +10% pickup range (+40% at level 5). Training widens the fetch to about 203 units and shortens the interval to about 1.6 s at level 5.

## How it works

- The circle is centred on Tibo. Its radius grows with the square root of power (`120 × √power`).
- Everything except chests and items is fetched: XP gems, coins, snacks, magnets, rerolls, skips, banishes and Bot Beacons. <small>[sim-BEjq2fOA.js: `n===E.chest||n===E.item)continue`]</small>
- Fetched pickups fly to Tibo at 300 units per second and are collected on arrival. <small>[sim-BEjq2fOA.js: `n.x[o]=l+p/e*300*t`]</small>
- A fetch only counts if it moved at least one pickup. Otherwise Biscuit checks again every 0.25 s, so a new drop inside the circle is pulled in almost immediately once the interval has passed.

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; Biscuit added at Tibo's side and trained with the sim's own dog-join and dog-level-up functions; HP refilled every tick; Tibo standing still; level-ups taking the first offer; 150 s; fetches timed from the game's `dogAbility` events): Biscuit fetched every 3 s at level 1 (46 of 47 gaps) and every 1.55 s at level 5 (91 of 92), the 1.555 s interval rounded to whole ticks.

## Tips

- **Pick it for long-range pickups.** Tibo's base pickup range is 40 units, so even a level 1 fetch reaches three times as far. The pickup-range aura works like a smaller [Potato Magnet](/passives/potato-magnet) (+25% per level).
- A fetched magnet pickup still fires when it reaches Tibo, pulling in every gem and coin on the map.
- Snacks are fetched too, and a snack collected at full HP heals nothing. If you are saving a snack for later, keep Tibo more than Biscuit's radius away from it.
- Biscuit pairs well with dogs that drop loot on the ground: the [Dachshund](/dogs/dachshund) and the [Beagle](/dogs/beagle).
