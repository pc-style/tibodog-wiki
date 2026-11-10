## Overview

Spud Purse drops a 1-value coin ahead of Tibo as he travels. The distance per coin is 100 / 84 / 68 / 52 / 36 units at one through five copies. Unlike [Spark Spud](/items/spark-spud), it follows the run's distance counter, which includes dash movement.

## How it works

- **Collect the coin after it drops.** It appears 24 units along Tibo's facing direction; creating it does not directly credit gold. <small>[sim-DBEflSqk.js: `` R(e,`gold`,r.x[i]+a*n,r.y[i]+o*n,1) ``]</small>
- **Extra copies shorten the gap.** The five-entry distance table is used directly, not a percentage reduction. Existing partial progress carries into the next coin. The module records distance continuously, so travel before obtaining the purse is not paid out retroactively. <small>[sim-DBEflSqk.js: `let n=e.run.distance-t.purseMarked;t.purseMarked=e.run.distance`]</small>
- Its coins are ordinary gold pickups. Picking them up can trigger [Copper Tot](/items/copper-tot); [Big Gust](/events/big-gust) can pull them in.

## Tips

- **Walk through the coins you create.** The purse generates pickups, not instant spending money. Extra copies make the trail denser without increasing each coin's raw value.
