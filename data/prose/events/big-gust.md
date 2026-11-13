## Overview

Big Gust starts at minutes 4 and 12 with the active more-variety rules. It marks every existing XP gem, coin and snack on the map to fly towards Tibo. It is a one-shot pull, not a timed magnet buff for future drops.

## How it works

- **Supplies other than snacks stay put.** Magnets, rerolls, chests and items are not included. Unlike the ordinary magnet effect, Big Gust explicitly includes heal pickups. <small>[sim-lhAs_O8g.js: `t.pool.isAlive(n)&&t.kind[n]===C.heal&&(t.vacuum[n]=1)`]</small>
- Vacuumed pickups still travel and must reach Tibo to be collected; the event does not immediately credit the whole map's gold or XP. Coins can trigger [Copper Tot](/items/copper-tot) on arrival, and full-HP snacks can feed [Second Helping](/items/second-helping).

## Tips

- **Expect old snacks to arrive with the loot.** If you want Second Helping stacks, try to be full before they reach Tibo. The gust does not pull unopened chests out of danger for you.
