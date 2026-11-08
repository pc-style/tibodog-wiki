## Overview

The Sock Pile is the only tier-2 pest of the [Coin Laundromat](/biomes/coin-laundromat) landmark. Tier 2 is in the wave table from the start until minute 9, which with Normal's two-minute [tier lag](/modes) means up to about 11:59.

It walks straight at Tibo at speed 30, with 24 HP and 6 contact damage. When killed it bursts into three [Lint Bunnies](/enemies/lint-bunny). The pile gives 2 XP and each bunny gives its normal 1 XP, so a Sock Pile is worth 5 XP in total. Each of the four can also drop gold: 6% for the pile, 5% for each bunny, and the Laundromat's coins are worth ×1.4.

## How it works

On death the pile spawns three Lint Bunnies in a ring around the spot, pushed outward. Unlike a [Snow Mold](/enemies/snow-mold), which splits into weaker copies of itself, a splitter with a named child spawns full Lint Bunnies. The bunnies take over the pile's HP, damage and speed scaling, applied to the Lint Bunny's own base stats (8 HP, 3 damage). <small>[sim-BhFUkOts.js: `sl(e,o?r:a,l+6*_(d),u+6*c(d))`]</small>

An elite Sock Pile (tier 2 is the elite tier from 1:00 to 4:59) releases ordinary Lint Bunnies, not elite ones. No bunnies are made once the spawn capacity is full: before 20:00, the enemy hard cap is 550 on Easy/Normal, 700 on Hard and 850 on Nightmare; Standard late-game runs then count pests and bosses together against 500/650/800. See [crowd limits](/modes#late-crowds). The XP figures above are before the [late-run XP step](/enemy-scaling#late-run-xp-drops).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, Normal, `--god`, seeds `wiki` and `s2`; Tibo teleported into the first Coin Laundromat found at 0:58 and left standing for 150 s): every Sock Pile that died released three Lint Bunnies. Each new pest was matched to the nearest death on the same tick, within 30 units. Each bunny had a third of the pile's max HP (16.18 → 5.39, the ratio of their base HP, 8 to 24), radius 4 and 1 XP. Over 400 bunnies died across the two runs, and none of them spawned anything. The 1:00 and 3:00 elites were Sock Piles (195 and 253.5 HP), and each released three ordinary bunnies of about 5.5 and 6.2 HP.

## Tips

- **Kill piles at a distance.** Each pile turns into three more pests, so killing piles at a distance gives the bunnies time to be caught by area weapons before they reach Tibo.
