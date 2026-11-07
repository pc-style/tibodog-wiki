## Overview

Salt Shaker makes Tibo's projectiles fly faster. Each level adds 0.1 projectile speed, so projectiles move at ×1.1 speed at level 1 and ×1.5 at level 5. Orbiting weapons only get half of the bonus.

It is the catalyst for [Thousand Fries](/weapons/thousand-fries) (from [Fry Knives](/weapons/fry-knives)) and [Tater Twister](/weapons/tater-twister) (from [Tater Twirl](/weapons/tater-twirl)).

## How it works

The projectile speed multiplier is `max(0.2, 1 + total)` (see [Stats](/stats)). For `orbit` weapons the game uses `1 + 0.5 × (multiplier − 1)` instead, so their spin speed is ×1.05 at level 1 and ×1.25 at level 5.<small>[sim-CssMfSN7.js: ``n.speed=i.speed*(a===`orbit`?1+.5*(r.projSpeedMult-1):r.projSpeedMult)``]</small> Tater Twirl's wheels use the same half bonus for their spin.

The multiplier also speeds up projectiles fired by items, such as the fries from [Porcupine Spud](/items/porcupine-spud).

Other projectile speed sources are [Time Tuber](/items/time-tuber) (+0.08) and [Philosopher's Potato](/items/philosophers-potato) (+0.1).

## Tips

- **Skip it for zero-speed weapons.** The bonus multiplies each weapon's own speed, so weapons with a base speed of 0 gain nothing. That includes ground pools, auras, beams, chains, mines and strikes such as [Root Spikes](/weapons/root-spikes); check the speed on each weapon's page.
- Faster shots reach distant pests sooner, which may help against fast or spread-out pests.
