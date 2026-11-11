## Overview

Mash Mortar places stationary mortars that fire explosive globs at nearby pests. Bring [Big Bowl](/passives/big-bowl) and level the mortar to 8 to prepare its evolution, [Pestle Barrage](/weapons/pestle-barrage); the usual [chest evolution gates](/chests) still apply.

## How it works

- Each drop places mortars rather than firing that many globs. Raw Amount starts at 1; Tibo's built-in +1 makes two mortars before other bonuses. Raw cooldown is 8 s and duration is 7 s, before global stats.
- A mortar targets the nearest pest within 170 units and fires at a raw interval of 1.4 s. Its projectiles keep the turret path's 1.2-second lifetime, not the mortar's duration.
- Globs carry a burst radius of 24 × the weapon's current Area. This weapon is summon-class even though its projectiles explode. <small>[sim-BudLQwEM.js: `` c.kind===`turret`&&c.explodeRadius!==void 0 ``]</small><small>[sim-BudLQwEM.js: `e.projectiles.explodeRadius[h]=c.explodeRadius*jA.area`]</small>

## Tips

- **Circle back through your mortars.** They stay where placed; running far away leaves their firing range behind.
- Area widens the glob's burst. Big Bowl also supplies the evolution catalyst; it does not evolve the weapon by itself.
