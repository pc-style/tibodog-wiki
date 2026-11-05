## Overview

Beetle Brood never spawns on its own. It is the minion of the [Colorado Queen](/bosses/beetle-queen), the boss that arrives at 3:00 in the [wave schedule](/bosses#wave-schedule), and it can also turn up earlier if a [Boss Lair](/points-of-interest#boss-lair) wakes the Queen in the first minutes. Her main attack marks eight spots in a ring and, once the attack's 1 s telegraph runs out, each marker hatches into a Beetle Brood. She keeps doing this for the whole fight.

Brood are plain chasers: they walk straight at Tibo and hurt only on contact. They are much tougher than the tier-1 pests around them at 3:00. With 16 base HP and 7 damage they have more than twice an [Aphid](/enemies/aphid)'s HP and damage, and only the [Fry Fly](/enemies/fry-fly) among tier-2 chasers is faster than their speed of 46. Each one is worth 1 XP and has a 2% chance of dropping a coin.

## How it works

The in-game description says “Her brood hatches in a ring around Tibo.”, but the code places the ring 36 units around the Queen herself, not around Tibo. <small>[sim-FslaxQ7g.js: `Ka(e,o.x[n]+T(c)*a.ringRadius,o.y[n]+O(c)*a.ringRadius,6,r.telegraph,0)`]</small>

Hatched brood get the same time and [curse](/curse) scaling as ordinary pests. Any brood still alive 40 s after hatching disappears and drops nothing. <small>[sim-FslaxQ7g.js: `o>=0&&(e.enemies.despawnAt[o]=e.time+40)`]</small>

## Tips

- Because the brood hatch next to the Queen, staying at range keeps each new batch at a distance. Area weapons aimed at the Queen can catch the brood as they appear.
- The supply only stops when the Queen dies, so it usually pays to focus her down rather than chase brood that will despawn anyway.
