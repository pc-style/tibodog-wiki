## Overview

Pip the Jack Russell Terrier is one of the eight ordinary breeds and one of the two most common (weight 12 of 80, tied with the [Golden Retriever](/dogs/retriever)). Tibo recruits it by walking onto a [Stray Dog](/points-of-interest#stray-dog); another Terrier stray later levels it up.

About once a second, Pip darts at the nearest enemy within 110 units of itself and bites for 22 damage, multiplied by Tibo's damage. Bosses can be bitten. Its aura adds +3% damage (+12% at level 5). The first two training levels multiply bite damage by 1.5 and shorten the interval; the last two only add damage. At level 5 Pip bites for about 77 every 0.58 s.

## How it works

- Pip picks a target and runs at twice its speed (280 units per second) to where the target stood, for at most 0.6 s.
- On arrival it bites the enemy nearest to itself within 16 units. If the target has moved away and nothing else is that close, the bite misses. <small>[sim-eSpFSniv.js: `let n=Ql(e,a,o,16);if(n===void 0)return;let u=l.damage*s*e.loadout.stats.damageMult`]</small> The special move-speed lunge multiplier is for [Gale](/dogs/saluki); Pip keeps the ordinary bite damage.
- The bite counts as a normal hit with knockback: elite damage, [Zelda's](/dogs/pomchi) marks and crits all apply.
- The interval timer keeps running during the dash. Once Pip has bitten, it can start the next dash from where it stands. Like every dog, it is put back at Tibo's side if it ends up more than 260 units away.
- Training: power ×1.5, ×1.5, ×1.25, ×1.25 gives 22, 33, 49.5, 62 and 77 damage per bite. The interval goes 0.9, 0.72, then 0.576 s from level 3; levels 4 and 5 have an `every` multiplier of 1.

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; Pip added at Tibo's side and trained with the sim's own dog-join and dog-level-up functions; HP refilled every tick; Tibo standing still; level-ups taking the first offer; 150 s; bites timed from the game's `dogAbility` events): bites were at least 0.9 s apart at level 1 (102 of 129 gaps exactly 0.9 s) and at least 0.58 s apart at level 5 (88 of 159 exactly 0.58 s). 0.58 s is the 0.576 s interval rounded to 35 ticks.

## Tips

- **Pick Pip for single-target damage.** Pip is the strongest single-target dog. Bite damage divided by the interval gives about 24 damage per second at level 1 and about 134 at level 5, before Tibo's damage multiplier and misses.
- Because bites scale with Tibo's damage, Pip suits damage builds. The +3% damage aura per level adds a little more.
- Zelda's marks add 25% to every bite on a marked elite or loot runner, which makes Pip with Zelda a strong elite-hunting pair.
