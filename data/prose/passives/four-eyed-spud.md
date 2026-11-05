## Overview

Four-Eyed Spud raises luck by 0.1 per level, up to 0.5 at level 5. The in-game tooltip for luck sums up its main uses: “Better odds of a fourth level-up card, bigger chests and rarer items.”

It is the catalyst for [Factory Reset](/weapons/factory-reset) (from [Reset Button](/weapons/reset-button)) and [Loaded Dice](/weapons/loaded-dice) (from [Spud Dice](/weapons/spud-dice)). At level 5 it also evolves [Wandering Eyes](/items/wandering-eyes) into [All-Seeing Spud](/items/all-seeing-spud).

## How it works

Luck changes these rolls, and nothing else in the simulation code. Values assume Four-Eyed Spud is the only luck source:

| Effect | Formula | Level 1 | Level 5 |
|---|---|---|---|
| 4th level-up card | chance `min(1, luck)` | 10% | 50% |
| 5-reward chest | `0.02 × (1 + luck)` | 2.2% | 3% |
| 3- or 5-reward chest | `0.20 × (1 + luck)` | 22% | 30% |
| Item rarity | weight of rarity *n* × `(1 + luck)^n` | Legendary 2.7% | Legendary 7.1% |
| [Seed Potato](/weapons/seed-potato) golden harvest | `0.5 × luck`, fully grown plants only | 5% | 25% |
| [Reset Button](/weapons/reset-button) drops kept | `min(0.95, 0.15 + 0.5 × luck)` | 20% | 40% |

The rarity numbers are the Legendary share of item rolls, computed from the weights on [Chests](/chests#item-rarity). The golden harvest roll is in the Seed Potato code.<small>[sim-NFTWJMcM.js: `s=n.luckK*e.loadout.stats.luck,c=o===3&&s>0&&e.rng.next()<s`]</small> A golden harvest also drops gold coins. Reset Button normally erases most pickups on screen when it fires, and each one survives with the chance above.<small>[sim-NFTWJMcM.js: `Math.min(.95,e.cfg.reset.dropSaveChance+.5*e.loadout.stats.luck)`]</small> Factory Reset keeps all drops (“Clears the screen, keeps the drops, heals Tibo.”), so luck no longer matters for it.

Luck does **not** change the dice. Spud Dice and Loaded Dice roll a plain 1–6 with the run's random generator.<small>[sim-NFTWJMcM.js: `let r=e.projectiles,i=e.rng.int(1,6),a=!1`]</small>

Other luck sources are [Lucky Peel](/items/lucky-peel) (+0.05), [Cursed Crown](/items/cursed-crown) (+0.2), the auras of the dogs [Scout](/dogs/beagle), [Zelda](/dogs/pomchi) and [Zelda & Link](/dogs/zelda-and-link), and [Spud Shrine](/points-of-interest#spud-shrine) blessings. Luck has no cap, but the 4th-card chance stops improving at 1.0 luck.

## Tips

- Take Four-Eyed Spud for Loaded Dice or All-Seeing Spud, not to improve the dice themselves.
- The 4th card is the most visible gain. Each extra card gives you more choice on every level-up for the rest of the run.
