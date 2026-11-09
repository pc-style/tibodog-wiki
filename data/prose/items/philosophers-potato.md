## Overview

Philosopher's Potato is a legendary item that adds +0.1 to four stats at once: damage (`might`), area, projectile speed and duration. Copies stack additively. It is one of the rarest drops: with no luck, about 0.5% of random item rolls (2% Legendary × 1/4). On levels without revives, where [Second Spud](/items/second-spud) is removed from the pool, that rises to about 0.67%. Luck raises the Legendary weight by `(1 + luck)^4` (see [Chests](/chests#item-rarity)).

Each bonus is added to the same stat as passives and other items before conversion, so +0.1 damage is +10 percentage points on Tibo's damage multiplier, not ×1.1 on top of it. Duration already includes a built-in +0.25, so with no other duration bonus effects last 1.35× their listed time instead of 1.25×, about 8% longer (see [Stats](/stats#stat-conversion)).

## How it works

- **Damage** multiplies weapon damage and the fixed-damage item effects that use the damage multiplier, such as [Porcupine Spud](/items/porcupine-spud) fries.
- **Area** scales weapon area. Item blasts and chain ranges grow with the square root of the area multiplier, so +10% area makes them about 5% wider. <small>[sim-B2A63Zmq.js: `return Math.sqrt(e.loadout.stats.areaMult)`]</small>
- **Projectile speed** applies in full to most weapons, but orbiting weapons get only half of the bonus. <small>[sim-B2A63Zmq.js: `` n.speed=i.speed*(a===`orbit`?1+.5*(r.projSpeedMult-1):r.projSpeedMult) ``]</small>

## Tips

- **Take it in any build.** It has no weakness and suits any build. Area and duration help aura, pool and orbit weapons; projectile speed helps shots reach targets.
- You cannot rely on finding one, but if a Fry Cart's bumped third slot rolls it, it is usually worth buying.
