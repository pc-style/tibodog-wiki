## Overview

Wandering Eyes is a rare item. When an enemy dies there is a 20% chance that 2 homing eyes fly out from where it died. With no luck and the full pool eligible it is about 0.64% of random item rolls (10% Rare × 6/94).

Each eye's damage is 40% of the **max HP of the enemy that died**, not of Tibo's hit. <small>[sim-BjSybi87.js: `zy(e,a,o.proc,t.x[n],t.y[n],t.maxHp[n])`]</small> Enemies get tougher over the run, so the eyes grow with them. Killing an elite or boss can send out very strong eyes.

It evolves into [All-Seeing Spud](/items/all-seeing-spud) when [Four-Eyed Spud](/passives/four-eyed-spud) is at level 5 and you open a chest (see [Evolutions](/evolutions#item-evolutions)).

## How it works

- **Trigger.** Any kill counts, including kills by other items and by the eyes themselves, so eyes can set off more eyes. Besides the 20% roll it fires at most 8 times per second.
- **Stacking.** With *n* copies the chance is `1 − 0.8^n` and the cap is 8 × *n* per second: 36% with two copies. The number of eyes does not change.
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added with `giveItem`; Peeler, Small Fry, Tot Toss, Chip Shuriken, Starch Chain and Seeker Sprouts each given 5 times with `give`; `warp(240)`; HP refilled every tick; Tibo walking a slow circle; later level-ups taking the first offer). Over 180 s on seeds `s1`–`s5`, 20.0% of 17,369 kill rolls released eyes with one copy (expected 20%), and 48.7% of 18,315 with three (expected 48.8%). With the chance set to 100% in the scenario (120 s, seeds `s1`–`s3`), one copy fired 7.74–7.81 times per second and two copies 15.43–15.54.
- **The eyes** start in evenly spaced directions from a random angle and steer towards enemies. Speed (140) scales with projectile speed, but lifetime (2.5 s) is fixed and does not use duration. Each eye stops at the first enemy it hits; pierce bonuses such as [Sharp Peeler](/items/sharp-peeler) do not apply. <small>[sim-BjSybi87.js: `o.damage[u]=a,o.pierce[u]=n.pierce??0,o.life[u]=n.life`]</small>
- Damage bonuses do not raise eye damage directly; crits and elite damage still apply when an eye hits.

## Tips

- **Take it for crowd-killing builds.** Builds that kill large crowds trigger it most. Because eye damage follows the dead enemy's HP, it keeps up with late-game enemies better than flat-damage items.
- While you hold it, Four-Eyed Spud is offered more often on level-up cards (×4 weight), and its luck is useful on its own.
