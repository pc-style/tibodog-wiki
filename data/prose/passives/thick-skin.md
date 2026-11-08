## Overview

Thick Skin gives Tibo a chance to dodge hits completely. Each level adds 0.05 dodge points. Dodge has diminishing returns, so the actual dodge chance is 4.8% at level 1 and 20% at level 5, not 5% and 25%.

It is the catalyst for [Permafrost Fries](/weapons/permafrost-fries) (from [Frozen Fries](/weapons/frozen-fries)) and [Wildfire Roast](/weapons/wildfire-roast) (from [Hot Streak](/weapons/hot-streak)).

## How it works

Dodge points are converted with `x / (1 + x)` (see [Stats](/stats#diminishing-returns)): 4.8%, 9.1%, 13.0%, 16.7% and 20.0% for levels 1 to 5. When a hit would damage Tibo, the dodge roll comes right after the invulnerability checks, and a success cancels the hit entirely.<small>[sim-EYxKn8bh.js: `if(!r&&s.evasion>0&&e.rng.chance(s.evasion))`]</small> Damage from biome terrain and hazard pools cannot be dodged (see [Stats](/stats#dodge)).

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty): after Thick Skin was given 1 to 5 times with `give`, the game's `evasion` stat read 0.0476, 0.0909, 0.1304, 0.1667 and 0.2000. In play, with Thick Skin given 5 times, `warp(240)`, HP refilled every tick, Tibo standing still and later level-ups taking the first offer, 1,485 of 7,420 dodge rolls succeeded over 600 s on seeds `s1`–`s5` (20.0%). Every roll ended as either a dodge or a hit.

A dodged hit never counts as Tibo being hit. Effects that react to hits, such as Hot Streak losing flames, do not trigger.<small>[sim-EYxKn8bh.js: `e.bigUpdate.weapons&&function(e){e.hotStreak.hurts++}(e)`]</small>

The other dodge source is [Ghost Skin](/items/ghost-skin). Its points add to Thick Skin's before the curve, so both together at full value (0.30) give 23.1%.

## Tips

- **Use it to keep flame streaks alive.** Hot Streak and Wildfire Roast lose two flames each time Tibo is hit (“A hit puts out two flames”). Dodged hits do not count, so Thick Skin helps keep the streak going on top of being their catalyst.
- Unlike [Starch Plating](/passives/starch-plating), dodge chance does not weaken as enemies get stronger. It works the same against a boss at 20:00 as against a pest at 0:00.
- [Porcupine Spud](/items/porcupine-spud) and [Fry Volcano](/items/fry-volcano) fire when Tibo is hit, so a dodged hit does not trigger them.
