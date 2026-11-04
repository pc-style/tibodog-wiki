## Overview

Railfry is the evolution of [Fry Lance](/weapons/fry-lance). Every 1.6 s it fires 3 lances, 0.1 s apart, each dealing 58 damage to every pest on its line. The lances are far longer than Fry Lance's: base length 270 with area 1.8, about 362 units, more than the 320-unit width of the play field, which is what the in-game text "Three lances that cross the whole view" refers to. Each lance is about 11 units wide.

It is made by opening a chest with Fry Lance at level 8 and [Spud Sneakers](/passives/spud-sneakers) at any level (see [Evolutions](/evolutions) and [Chests](/chests)).

## How it works

- Aiming and the fan of extra lances work as on [Fry Lance](/weapons/fry-lance): the first lance goes at the nearest pest, the second 0.35 rad to one side, the third 0.35 rad to the other, about 40° of coverage in total. <small>[sim-CrpXuTSY.js: `hp(e,1.2*n.length)+(i>0?c*Math.ceil(i/2)*.35:0)`]</small>
- It fires only when a pest is within 224 units, even though the lances reach farther.
- Each lance hits every pest touching its line once, with no pierce limit.
- Extra projectiles add more lances to the fan, alternating sides at 0.35 rad steps.

## Tips

- Spud Sneakers is also the catalyst for [Ghee Glide](/weapons/ghee-glide), so one copy can unlock both if you carry [Butter Streak](/weapons/butter-streak) too.
