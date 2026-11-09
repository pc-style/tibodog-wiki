## Overview

Picnic starts at minutes 9 and 16 with the active more-variety rules. It creates eight 30-HP snacks over a 10-second window. One appears immediately, then another every 1.25 seconds when allocation succeeds.

## How it works

- **Look around Tibo, not the event's starting point.** Each snack is placed 110 units from Tibo's current position in a random direction. It is an ordinary heal pickup that must be collected. <small>[sim-eSpFSniv.js: `n+k(i)*t.picnicRadius,r+S(i)*t.picnicRadius,30`]</small>
- **The window can end before all eight spawn.** A full pickup pool can reject a snack; failed spawns retry without spending the remaining count, but no snack spawns at or after the 10-second deadline. These snacks do not inherit weapon Duration scaling.
- **Full HP changes their use.** Already-full snacks can give [Second Helping](/items/second-helping) stacks. A snack that merely heals Tibo to full does not qualify.

## Tips

- **Collect snacks you need before chasing surplus ones.** Picnic creates healing around your current route, not an automatic 240-HP heal or a guarantee that all snacks will be collected.
