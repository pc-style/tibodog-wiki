## Overview

Lost Saucer is the landmark event of [Crop Circle](/biomes/crop-circle). It fires the first time Tibo walks into a crop circle (radius 460), once per crop circle, and never in [Story mode](/story-mode). After the announcement, a [Lost Saucer](/enemies/lost-saucer) appears 40 units from Tibo in a random direction and flees.

It is a loot runner, like the scheduled [Golden Scarab](/events/golden-scarab): harmless (0 damage), worth gold on every hit and an **item** pickup on the kill (see [Pickups](/pickups)), plus 10 XP and a coin. The saucer is a little weaker (260 base HP against 300) and gives up sooner, leaving after 20 seconds instead of 25.

## How it works

- **Trigger.** The landmark is only marked as used once the event actually fires. If spawn capacity is full, the game simply tries again while Tibo is still inside the circle. Before 20:00 the enemy hard cap is 550 on Easy/Normal, 700 on Hard and 850 on Nightmare; Standard late-game runs then count pests and bosses together against 500/650/800. See [crowd limits](/modes#late-crowds). <small>[sim-BY3r5cDe.js: `a!==void 0&&X_(e,c.event(a))&&e.world.spendLandmark(r)`]</small>
- **HP.** 260 × the current pest HP multiplier ([enemy scaling](/enemy-scaling)), so a crop circle found late gives a tougher saucer. Curse does not raise it.
- **Movement.** It runs straight away from Tibo, at its full speed of 40 within 70 units and at 30% beyond that. Tibo's base speed is 62. <small>[intro-shared-C4cXqQ8W.js: `lootRunners:{spawnDistance:40,sprintRadius:70}`]</small>
- **Gold per hit.** Each hit has a 50% chance to drop a coin worth 2 (× gold gain).
- **Escape.** It vanishes 20 seconds after appearing, or once it is about 460 units from Tibo, without dropping its item.
- **Coin value.** Coins from pests killed inside the circle use Crop Circle's own gold and XP multipliers (×1.1 gold, ×1.2 XP), which also apply to the saucer's kill coin and XP gem.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, `--god`, Tibo teleported into the first crop circle found at about 1:06 with pests removed first): one saucer spawned, set to vanish 20 s later, on all four difficulties. With `--mode story`, entering the circle fired no event.

## Tips

- **Chase it the moment you enter.** The event starts as soon as Tibo crosses the edge, so the clock is running from the moment you enter. Chase right away: the saucer starts only 40 units off and is slower than Tibo.
- Because the item is guaranteed on the kill, a crop circle is worth a detour when you see one, if your damage can take 260 × the current HP multiplier off a fleeing target within 20 seconds.
