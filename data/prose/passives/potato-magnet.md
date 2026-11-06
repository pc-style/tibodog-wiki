## Overview

Potato Magnet widens the range at which Tibo pulls in pickups. The base pickup range is 40 units, and each level adds 25%: 50 units at level 1 and 90 units at level 5. XP gems, gold and snacks inside the range fly to Tibo on their own.

It is the catalyst for [Gravy Flood](/weapons/gravy-flood) (from [Gravy Boat](/weapons/gravy-boat)) and [Gem Catapult](/weapons/gem-catapult) (from [Gem Sling](/weapons/gem-sling)).

## How it works

Pickup range is `40 × max(0.2, 1 + pickup range bonus)` (see [Stats](/stats)). Once a pickup enters the range it is marked and flies toward Tibo at 300 units per second, even if he moves away again.<small>[sim-Begj1yyi.js: `if(r.vacuum[s]===1||p&&g<c){r.vacuum[s]=1;let e=Math.max(.001,Math.sqrt(g));r.x[s]=u+m/e*300*t`]</small> Chests and items are never pulled; Tibo has to walk onto them (see [Pickups](/pickups)).

Pickup range also sets how close Tibo must be to harvest a [Seed Potato](/weapons/seed-potato) or [Potato Patch](/weapons/potato-patch) plant: 24 units plus a quarter of the range above 40, up to 34.<small>[sim-Begj1yyi.js: `return Math.min(t.maxReach,t.reach+t.reachK*n)`]</small> That is 26.5 units at Potato Magnet level 1 and the full 34 from level 4.

Other sources are [Copper Spoon](/items/copper-spoon) (+0.1), the aura of the dog [Biscuit](/dogs/retriever) and [Spud Shrine](/points-of-interest#spud-shrine) blessings.

## Tips

- **Pair it with Gem Sling.** [Gem Sling](/weapons/gem-sling) and Gem Catapult fire a wedge for each XP gem Tibo picks up, so a wider pickup range keeps them firing while Tibo stays away from the crowd.
- A larger range lets Tibo collect XP without walking into pests to reach it. It pairs naturally with [Fertilizer](/passives/fertilizer).
