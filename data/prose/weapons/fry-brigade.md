## Overview

Fry Brigade is the union of [Tater Tot Pup](/weapons/tater-pup) and [Fry Cook Sentry](/weapons/fry-sentry). Opening a [chest](/chests) when both qualify replaces them with this one weapon and frees a weapon slot (see [Evolutions](/evolutions#unions)). It combines both ideas: tot pups circle Tibo and shoot, and every few seconds each pup leaves a fry turret on the ground.

There are 5 pups (raw Amount 4 plus Tibo's base +1 projectile, see [Stats](/stats)). Each pup shoots the nearest pest within 170 units every 0.3 s; the shots deal 22 damage, fly at 240 units per second and pass through two pests. Each pup also plants a turret every 5 s that lasts about 6 s and fires every 0.4 s.

## How it works

- **Pups.** The pups are spaced evenly on an ellipse around Tibo, 18 units out to the sides and 14 above and below, which turns slowly (0.8 rad/s). They follow him as he moves. Each pup has its own shot timer based on the weapon's Cooldown, which cooldown reduction shortens. When no pest is within range, a pup checks again every 0.1 s.
- **Turrets.** Each pup plants a turret at its own position every 5 s (`plant.everySec`). The first plants are staggered: with 5 pups, one turret goes down about every second. <small>[sim-HQr6OS1G.js: `i.plantIn[o]=n.plant===void 0?0:n.plant.everySec*(a+1)/r.amount`]</small>
- **Turret lifetime.** 5 s (`plant.lifeSec`) times Tibo's Duration multiplier, so 6.25 s with the base +25%. With 5 pups that means about 6 turrets standing at a time. <small>[sim-HQr6OS1G.js: `i.life[o]=n.lifeSec*e.loadout.stats.durationMult`]</small>
- **Turret fire.** Turrets shoot the nearest pest within 170 units every 0.4 s (the weapon's Interval), which cooldown reduction does not change. Turret shots use the same damage, speed and pierce as the pups' but disappear after 1.2 s. <small>[sim-HQr6OS1G.js: `let p=s?Math.max(.1*_u(e),Op.interval):Op.cooldown;`]</small>

## Tips

- Turrets stay where they were planted, so moving around a lot spreads them over a wide area, while staying near one spot stacks them.
- The union frees a slot, but you need both partner weapons at level 8 (or one evolved) first; see [Evolutions](/evolutions#unions) for the exact rule.
