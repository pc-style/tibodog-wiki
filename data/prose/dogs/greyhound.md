## Overview

Zoom the Greyhound is one of the eight ordinary breeds, and one of the two rarest (weight 8 of 80, tied with the [Saint Bernard](/dogs/saint-bernard)). Tibo recruits it by walking onto a [Stray Dog](/points-of-interest#stray-dog); another Greyhound stray later levels it up.

Every 4 seconds, if an enemy is within 150 units, Zoom sprints 150 units straight towards it. At the end of the sprint, every enemy along the path takes 30 damage, multiplied by Tibo's damage. Bosses can be hit. Its aura adds +6% move speed, the largest move-speed aura of any dog (+24% at level 5). Training raises the damage to about 105 and shortens the interval to about 2.3 s at level 5.

## How it works

- Zoom aims at the enemy nearest to itself, then always runs the full 150 units in that direction, overshooting the target.
- The sprint runs at twice Zoom's speed, 340 units per second, so it takes about 0.44 s. <small>[sim-FslaxQ7g.js: `r.length/(2*t.dogAt(a.breed[n]).speed)`]</small>
- Damage lands once, when the sprint ends. It hits every enemy whose centre is within 12 units (Zoom's size 6 + 6) of the line from start to finish. <small>[sim-FslaxQ7g.js: `Re(W(e,n),G(e,n),c,l,o,s)>u+6||J(e,n)`]</small>
- The damage is `30 × power × Tibo's damage multiplier`, so [Butter Pat](/passives/butter-pat) and other damage bonuses raise it. Each hit then goes through the normal hit rules: elite damage, [Zelda's](/dogs/pomchi) marks and crits all apply.
- If nothing is within 150 units, Zoom checks again every 0.25 s.

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; Zoom added at Tibo's side and trained with the sim's own dog-join and dog-level-up functions; HP refilled every tick; Tibo standing still; level-ups taking the first offer; 150 s; sprints timed from the game's `dogAbility` events): once enemies were around, Zoom sprinted every 4 s at level 1 (36 of 36 gaps) and at least 2.31 s apart at level 5, which is the 2.31 s interval rounded to whole ticks.

## Tips

- Zoom averages 7.5 damage per second at level 1 and about 46 at level 5, before Tibo's damage multiplier. Every enemy on the line takes the full hit, so Zoom is best against dense crowds and lines of pests walking at Tibo.
- Against a single target the [Jack Russell Terrier](/dogs/terrier) does far more: about 134 damage per second at level 5 against Zoom's 46.
- The move-speed aura at level 5 equals three levels of [Spud Sneakers](/passives/spud-sneakers) (+8% per level). That alone can justify keeping Zoom in a build that kites.
