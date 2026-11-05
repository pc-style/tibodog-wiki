## Overview

All-Seeing Spud is the evolved form of [Wandering Eyes](/items/wandering-eyes). You get it by holding Wandering Eyes with [Four-Eyed Spud](/passives/four-eyed-spud) at level 5 and opening a [chest](/chests). Every Wandering Eyes you hold becomes an All-Seeing Spud, and Wandering Eyes then stops dropping.

Each eye still deals 40% of the max HP of the enemy that died, as with Wandering Eyes. The upgrade is in volume and reach: a 35% chance instead of 20%, 4 eyes instead of 2, and each eye pierces 2 enemies, so it can hit up to 3. The eyes also fly faster (170 instead of 140, before projectile speed), live 3 s instead of 2.5 s and steer more sharply.

## How it works

- **Trigger and stacking** work as for Wandering Eyes: any kill can trigger it, including kills by the eyes. It fires at most 8 times per second per copy, and with *n* copies the chance is `1 − 0.65^n`.
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added directly with `giveItem`, skipping the evolution; Peeler, Small Fry, Tot Toss, Chip Shuriken, Starch Chain and Seeker Sprouts each given 5 times with `give`; `warp(240)`; HP refilled every tick; Tibo walking a slow circle; later level-ups taking the first offer; 180 s per seed). With one copy, 34.6% of 60,501 kill rolls fired on seeds `s1`–`s15` (expected 35%; about two standard errors low). With three copies, 72.7% of 29,152 fired on seeds `s1`–`s5` (expected 72.5%). With the chance set to 100% in the scenario (120 s, seeds `s1`–`s3`), one copy fired 7.75–7.90 times per second and two copies 15.49–15.76.
- **Pierce** is fixed at 2. Pierce bonuses from [Sharp Peeler](/items/sharp-peeler) do not apply, and the eyes' lifetime ignores duration.
- One trigger can now deal up to 4 eyes × 3 hits × 40% of the dead enemy's max HP, 4.8× that HP in total, if every eye finds three targets.

## Tips

- Eyes from one kill can kill more enemies and trigger more eyes, so it snowballs best in dense crowds.
- Four-Eyed Spud at level 5 also gives +0.5 luck: a 50% chance of a fourth level-up card and better item rarity (see [Stats](/stats#luck)).
