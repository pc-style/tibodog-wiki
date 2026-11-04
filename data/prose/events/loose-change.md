## Overview

Loose Change is the landmark event of the [Coin Laundromat](/biomes/coin-laundromat). It fires the first time Tibo walks into a laundromat (radius 400), once per laundromat, and never in [Story mode](/story-mode). For 20 seconds every gold coin Tibo collects is worth twice as much. No enemies spawn from it.

It is the same gold rush as the scheduled [Harvest Moon](/events/harvest-moon), 10 seconds shorter.

## How it works

- **Instant trigger.** A gold rush needs no free enemy slot, so it starts on the first tick Tibo is inside the laundromat. That laundromat is then used up.
- **Applied on pickup.** Coins are doubled when collected, after gold gain. Coins already on the ground count if you pick them up within the 20 seconds.
- **No stacking.** If Harvest Moon is already running, Loose Change only extends the window if it would end later. The multiplier stays ×2.
- **Laundromat gold.** A pest's coin is valued by the biome it dies in, and the laundromat's gold multiplier is 1.4. A pest killed inside therefore drops a coin worth 1.4, or 2.8 when collected during the rush (before gold gain). <small>[sim-CrpXuTSY.js: ``i.next()<r.goldChance[t]+r.killGold[t]&&G(e,`gold`,a+i.range(-4,4),o+i.range(-4,4),(s?10:1)*c.goldMult)``]</small>

## Tips

- Walking in starts the timer, so you choose when it happens. Entering with a crowd of pests to kill gets more out of the 20 seconds.
- Fighting inside the laundromat during the rush stacks its ×1.4 coin value with the ×2.
