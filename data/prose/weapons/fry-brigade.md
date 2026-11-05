## Overview

Fry Brigade is the union of [Tater Tot Pup](/weapons/tater-pup) and [Fry Cook Sentry](/weapons/fry-sentry). Opening a [chest](/chests) when both qualify replaces them with this one weapon and frees a weapon slot (see [Evolutions](/evolutions#unions)). It combines both ideas: tot pups circle Tibo and shoot, and every few seconds each pup leaves a fry turret on the ground.

There are 5 pups (raw Amount 4 plus Tibo's base +1 projectile, see [Stats](/stats)). Each pup shoots the nearest pest within 170 units every 0.3 s; the shots deal 22 damage, fly at 240 units per second and pass through two pests. Each pup also plants a turret every 5 s that lasts about 6 s and fires every 0.4 s.

## How it works

- **Pups.** The pups are spaced evenly on an ellipse around Tibo, 18 units out to the sides and 14 above and below, which turns slowly (0.8 rad/s). They follow him as he moves. Each pup has its own shot timer based on the weapon's Cooldown, which cooldown reduction shortens. When no pest is within range, a pup checks again every 0.1 s.
- **Turrets.** Each pup plants a turret at its own position every 5 s (`plant.everySec`). The first plants are staggered: with 5 pups, one turret goes down about every second. <small>[sim-CM-5WO9_.js: `a.plantIn[s]=n.plant===void 0?0:n.plant.everySec*(o+1)/r.amount`]</small>
- **Turret lifetime.** 5 s (`plant.lifeSec`) times Tibo's Duration multiplier, so 6.25 s with the base +25%. With 5 pups that means about 6 turrets standing at a time. <small>[sim-CM-5WO9_.js: `a.life[s]=n.lifeSec*e.loadout.stats.durationMult`]</small>
- **Turret fire.** Turrets shoot the nearest pest within 170 units every 0.4 s (the weapon's Interval), which cooldown reduction does not change. Turret shots use the same damage, speed and pierce as the pups' but disappear after 1.2 s. <small>[sim-CM-5WO9_.js: `let p=c?Math.max(.1*Dd(e),Km.interval):Km.cooldown;`]</small>

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): 5 pups existed; after the first pup's turret, a turret was planted about every 1 s, each lasting 375 ticks (6.25 s); in the line of 8 pests only the 3 nearest were hit (pierce 2). All three seeds gave the same figures.

## Tips

- Turrets stay where they were planted, so moving around a lot spreads them over a wide area, while staying near one spot stacks them.
- The union frees a slot, but you need both partner weapons at level 8 (or one evolved) first; see [Evolutions](/evolutions#unions) for the exact rule.
