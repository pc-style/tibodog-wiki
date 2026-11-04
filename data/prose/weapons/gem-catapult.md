## Overview

Gem Catapult is the evolution of [Gem Sling](/weapons/gem-sling). A chest evolves Gem Sling into it once Gem Sling is at max level and Tibo owns [Potato Magnet](/passives/potato-magnet) (see [Evolutions](/evolutions)). Like the sling, it fires a potato wedge along Tibo's heading for every XP gem he picks up.

The only change from a max-level Gem Sling is damage. Each wedge deals 30.6 instead of 18, 1.7 times as much. Speed (240), flight time (0.9 s, about 216 units) and pierce 3 (up to four pests per wedge) stay the same.

## How it works

Firing is the same as on [Gem Sling](/weapons/gem-sling#how-it-works). Only XP gem pickups count. Gems wait in a queue of at most 40, and up to 2 are fired per tick. Each gem fires one wedge per point of amount, two with no amount bonuses, fanned about 9° apart. <small>[sim-CrpXuTSY.js: `for(let r=0;r<i.amount;r++)If(e,t,i,s+(r-.5*(i.amount-1))*n.fan+e.rng.range(-n.spread,n.spread),n.size)`]</small>

## Tips

- Damage still depends on how many gems Tibo collects. Pickup range and XP drops matter as much as damage bonuses.
- Extra amount multiplies the number of wedges per gem, so amount bonuses work well with this weapon.
