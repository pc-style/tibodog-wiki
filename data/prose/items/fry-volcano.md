## Overview

Fry Volcano is the evolved form of [Porcupine Spud](/items/porcupine-spud). When Tibo takes damage, he erupts in a blast around himself and fires 24 piercing fries, at most once every 0.5 seconds. You get it by holding Porcupine Spud with [Starch Plating](/passives/starch-plating) at level 5 and opening a [chest](/chests). It never drops on its own, and once you have it, Porcupine Spud stops dropping (see [Evolutions](/evolutions#item-evolutions)).

Compared with Porcupine Spud, each fry has the same base damage (30, +15% of base per minute) but adds 1.5× Tibo's thorns instead of 1×. The fries also pierce 5 enemies instead of 2 and fly faster and longer. The new part is the blast: it hits every enemy within 56 units of Tibo for twice the damage of one fry. <small>[sim-CteDA9xy.js: `n.blast!==void 0&&(Y(e,l*n.blast.share,t.src,-1,1),Zg(e,t,o,s,n.blast.radius*Hg(e)))`]</small>

## How it works

- **Trigger and cooldown** work as for Porcupine Spud: only hits that cost HP count (not dodges, invulnerability, fully absorbed guard hits or terrain damage), and it then waits 0.5 s.
- **Fry damage** = `(30 × (1 + 0.15 × minutes) + 1.5 × thorns) × damage multiplier`. With no bonuses that is 120 per fry at 20:00, and the blast deals 240.
- **Range.** Fries move at 260 × projectile speed for 0.8 s × duration, about 260 units at default duration. Each one hits up to 6 enemies (pierce 5, plus pierce bonuses). The blast radius grows with the square root of area.
- **Stacking.** Holding several copies does nothing extra. The effect does not use the item count.

## Tips

- **Pair it with Starch Plating.** Starch Plating at level 5 gives 100 armor, so a Fry Volcano build takes less damage per hit while still triggering on every hit that gets through.
- The blast centres on Tibo, so it clears enemies pressed against him, while the fries reach further out.
- [Thorny Jacket](/items/thorny-jacket) thorns count 1.5× in each fry and twice that in the blast.
