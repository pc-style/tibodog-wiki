## Overview

Aged Russet adds damage based on levels Tibo has gained in this run, including levels gained before taking the passive. Each passive level adds +0.5% damage per player level above level 1, capped at +10% per passive level. It has five levels, for a maximum +50% damage.

## How it works

- **Count gained levels, not the displayed level.** At player level 1 the bonus is zero; at level 2 it is +0.5% per passive level. The cap arrives at player level 21. <small>[sim-rGD56OmB.js: `let t=Math.max(0,e.loadout.level-1),n=0`]</small> At passive level 2, player level 20 gives +19%, while 21 and 22 both give +20%.
- **It adds to the damage multiplier.** This is a conditional bonus, not the zero `perLevel` value in the raw definition and not a separate ×1.5 multiplier on all other damage bonuses. <small>[sim-rGD56OmB.js: `n+=Math.min(e.perLevel*i*t,e.capPerLevel*i)`]</small>

## Tips

- **Take it for levels already earned.** You do not need to collect it early to count earlier levels. Once Tibo reaches level 21, further player levels do not raise this passive's bonus.
