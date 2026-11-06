## Overview

Hot Sauce adds 0.06 crit points per level, which become a chance for each hit to be a critical hit. Crit chance has diminishing returns, so the actual chance is 5.7% at level 1 and 23.1% at level 5, not 6% and 30%. A crit multiplies the hit's damage by ×2, or more with [Sour Cream](/passives/sour-cream).

It is the catalyst for [Gratin Arc](/weapons/gratin-arc) (from [Starch Chain](/weapons/starch-chain)), [Spicy Hot Potato](/weapons/spicy-hot-potato) (from [Hot Potato](/weapons/hot-potato)) and [Spudzooka](/weapons/spudzooka) (from [Spud Cannon](/weapons/spud-cannon)). At level 5 it also evolves [Coal-Baked Spud](/items/coal-baked-spud) into [Bonfire Spud](/items/bonfire-spud).

## How it works

Crit points are converted with `x / (1 + x)` (see [Stats](/stats#diminishing-returns)):

| Level | Crit points | Crit chance |
|---|---|---|
| 1 | 0.06 | 5.7% |
| 2 | 0.12 | 10.7% |
| 3 | 0.18 | 15.3% |
| 4 | 0.24 | 19.4% |
| 5 | 0.30 | 23.1% |

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty): after Hot Sauce was given 1 to 5 times with `give`, the game's own `critChance` stat read 0.0566, 0.1071, 0.1525, 0.1935 and 0.2308. In play, with Hot Sauce given 5 times, Peeler, Small Fry and Tot Toss each given 5 times, `warp(240)`, HP refilled every tick, Tibo standing still and later level-ups taking the first offer, 4,065 of 17,724 hits were crits over 180 s on seeds `s1`–`s5` (22.9%, expected 23.1%). A control run without Hot Sauce (seed `s1`) had 0 crits in 3,817 hits, so those weapons have no crit bonus of their own.

Each hit then rolls against that chance plus the weapon's own crit bonus.<small>[sim-Davaqo7b.js: `let l=s.critChance+o.critBonus[r];l>0&&e.rng.next()<l&&(u*=s.critMult,d=!0)`]</small> The weapon bonus is added after the curve, so it is not reduced. Gratin Arc has a crit bonus of 0.25 (“crits often”), so with Hot Sauce at level 5 its hits crit 48.1% of the time.

Other crit sources are [Hot Pepper](/items/hot-pepper) and [Spud Shrine](/points-of-interest#spud-shrine) blessings. Their points are added to Hot Sauce's before the curve.

## Tips

- **Pair it with Sour Cream.** With a ×2 crit multiplier, a 23.1% crit chance raises average damage by 23.1%. With Sour Cream at level 5 (×3), the same chance gives +46%. The two passives are worth more together than apart.
- Because of the curve, extra crit points from items add less once you already have Hot Sauce.
