## Overview

Root Network makes Tibo regenerate HP over time. Each level adds 0.25 HP per second: 0.25 HP/s (15 HP per minute) at level 1 and 1.25 HP/s (75 HP per minute) at level 5. Healing stops at max HP.

It is the catalyst for [Pressure Cooker](/weapons/pressure-cooker) (from [Steam Vent](/weapons/steam-vent)), [Spud Grid](/weapons/spud-grid) (from [Potato Battery](/weapons/potato-battery)) and [Root Legion](/weapons/root-legion) (from [Sprout Squad](/weapons/sprout-squad)). At level 5 it also evolves [Static Tot](/items/static-tot) into [Storm Tot](/items/storm-tot).

## How it works

Recovery is applied every tick as `recovery × elapsed time`, capped at max HP.<small>[sim-r66zS6bG.js: `i.recovery>0&&au(e,i.recovery*t)`]</small> It is a flat amount, so it does not scale with max HP, difficulty or the run clock.

Other recovery sources are [Pickle Jar](/items/pickle-jar) (+0.1) and the auras of the dogs [Link](/dogs/pomeranian), [Barrel](/dogs/saint-bernard) and [Zelda & Link](/dogs/zelda-and-link).

## Tips

- **Take it early, not late.** Enemy damage grows over the run (see [Enemy scaling](/enemy-scaling)) while recovery stays the same, so Root Network matters most early. Late in a run, armor or dodge is likely to do more for survival.
- Pressure Cooker also heals (“Each enemy it burns heals Tibo.”), which suits a sustain build built around Root Network.
