## Overview

Ghost Skin is a Rare item that adds 0.05 dodge points per copy. Dodge points become a dodge chance through the curve `x / (1 + x)` ([Stats](/stats#diminishing-returns)). One Ghost Skin alone gives 4.8%. A successful dodge cancels the whole hit, not just part of it.

It has weight 6 out of 94 among Rare items, about 0.64% of item rolls at luck 0 with the full pool eligible. Copies stack with no cap. It has no evolution.

## How it works

Dodge points add to [Thick Skin](/passives/thick-skin) (0.05 per level) before the curve is applied, so each extra point is worth a little less than the one before. Maxed Thick Skin gives 0.25 points (20% dodge). Adding one Ghost Skin takes that to 0.30 points (23.1%). Dodge does not work against biome terrain or hazard pool damage ([Stats](/stats#dodge)).

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added with `giveItem`): the game's `evasion` stat read 0.0476, 0.0909 and 0.1304 for 1 to 3 copies (seed `wiki`). In play, with one copy, `warp(240)`, HP refilled every tick, Tibo standing still and later level-ups taking the first offer, 200 of 4,015 dodge rolls succeeded over 600 s on seeds `s1`–`s3` (4.98%, expected 4.76%).

## Tips

- **Pick it for defence that holds up late.** Unlike armor, dodge does not lose value as enemies level up over the run. Ghost Skin's 4.8% stays 4.8%, while the 10 armor from [Baked Buckler](/items/baked-buckler) drops from blocking 17% of a hit at 0:00 to 6% at 20:00.
