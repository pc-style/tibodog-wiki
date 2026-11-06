## Overview

Railfry is the evolution of [Fry Lance](/weapons/fry-lance). Every 1.4 s it fires 4 lances (raw amount 3 plus Tibo's base +1, see [Stats](/stats)), 0.1 s apart, each dealing 68 damage to every pest on its line. The lances are far longer than Fry Lance's: base length 270 with area 1.8, about 362 units, more than the 320-unit width of the play field, which is what the in-game text "Three lances that cross the whole view" refers to. Each lance is about 11 units wide.

It is made by opening a chest with Fry Lance at level 8 and [Spud Sneakers](/passives/spud-sneakers) at any level (see [Evolutions](/evolutions) and [Chests](/chests)).

## How it works

- Aiming and the fan of extra lances work as on [Fry Lance](/weapons/fry-lance): the first lance goes at the nearest pest, the second 0.35 rad to one side, the third 0.35 rad to the other and the fourth 0.7 rad to the first side, about 60° of coverage in total. <small>[sim-DOWGQeHt.js: `Xw(e,1.2*n.length)+(i>0?s*Math.ceil(i/2)*.35:0)`]</small>
- It fires only when a pest is within 224 units, even though the lances reach farther.
- Each lance hits every pest touching its line once, with no pierce limit.
- Extra projectiles add more lances to the fan, alternating sides at 0.35 rad steps.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): the nearest pest was hit 3 times per firing, 0.1 s apart (in one seed the second-nearest too), and the rest of the line once, every 1.6 s. Three of the four lances reaching the nearest pest is consistent with the fan rule above; the in-game text's “Three lances” counts the raw amount. All three seeds gave the same figures.

## Tips

- **Carry Butter Streak to share Spud Sneakers.** Spud Sneakers is also the catalyst for [Ghee Glide](/weapons/ghee-glide), so one copy can unlock both if you carry [Butter Streak](/weapons/butter-streak) too.
