## Overview

Loose Change is the landmark event of the [Coin Laundromat](/biomes/coin-laundromat). It fires the first time Tibo walks into a laundromat (radius 400), once per laundromat, and never in [Story mode](/story-mode). For 20 seconds every gold coin Tibo collects is worth twice as much. No enemies spawn from it.

It is the same gold rush as the scheduled [Harvest Moon](/events/harvest-moon), 10 seconds shorter.

## How it works

- **Instant trigger.** A gold rush needs no free enemy slot, so it starts on the first tick Tibo is inside the laundromat. That laundromat is then used up.
- **Applied on pickup.** Coins are doubled when collected, after gold gain. Coins already on the ground count if you pick them up within the 20 seconds.
- **No stacking.** If Harvest Moon is already running, Loose Change only extends the window if it would end later. The multiplier stays ×2.
- **Laundromat gold.** A pest's coin is valued by the biome it dies in, and the laundromat's gold multiplier is 1.4. A pest killed inside therefore drops a coin worth 1.4, or 2.8 when collected during the rush (before gold gain). <small>[sim-Bt1MrMd3.js: ``r.next()<n.goldChance[t]+n.killGold[t]&&B(e,`gold`,i+r.range(-4,4),a+r.range(-4,4),(o?10:1)*s.goldMult)``]</small>

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, `--god`, Tibo teleported into the first laundromat found at about 1:09): the event was announced on entry, on all four difficulties, and spawned no pests. With `--mode story`, it did not fire.

## Tips

- **Enter with a crowd to kill.** Walking in starts the timer, so you choose when it happens. Entering with a crowd of pests to kill gets more out of the 20 seconds.
- Fighting inside the laundromat during the rush stacks its ×1.4 coin value with the ×2.
