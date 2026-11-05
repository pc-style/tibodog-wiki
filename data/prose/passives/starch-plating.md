## Overview

Starch Plating adds 20 armor per level, up to 100 at level 5. Armor cuts the damage of each hit Tibo takes. As the in-game text warns, “Stronger enemies get through more”: the same armor blocks less as the run goes on, and less against elites and bosses.

It is the catalyst for three evolutions: [Cast Iron](/weapons/cast-iron) (from [Frying Pan](/weapons/frying-pan)), [Hash Bulwark](/weapons/hash-bulwark) (from [Hash Brown Shield](/weapons/hash-brown-shield)) and [Rösti Storm](/weapons/rosti-storm) (from [Rösti Disc](/weapons/rosti-disc)). At level 5 it also evolves [Porcupine Spud](/items/porcupine-spud) into [Fry Volcano](/items/fry-volcano).

## How it works

Damage taken is multiplied by `1 − min(0.85, armor / (5 × attacker level + armor))` (see [Stats](/stats#armor)).<small>[sim-D8sW_hhq.js: `d=l*(1-Ya(s.armor,i,e.cfg))*(u?1-e.cfg.player.freezeDamageCut:1)`]</small> Being [frozen by the Deep Freezer](/bosses/deep-freezer#ice-cube-fan) then cuts the remaining damage by another 25%. An attacker's level is 10 plus the run's minutes, +5 for elites and +10 for bosses (see [Enemy scaling](/enemy-scaling#enemy-level-and-armor)). Damage reduction with Starch Plating alone:

| Armor | Pest at 0:00 (level 10) | Pest at 10:00 (level 20) | Pest at 20:00 (level 30) | Boss at 20:00 (level 40) |
|---|---|---|---|---|
| 20 (level 1) | 28.6% | 16.7% | 11.8% | 9.1% |
| 60 (level 3) | 54.5% | 37.5% | 28.6% | 23.1% |
| 100 (level 5) | 66.7% | 50.0% | 40.0% | 33.3% |

Computed from the formula. The 85% cap is out of reach with Starch Plating alone.

Armor applies after dodge and after guard weapons such as Hash Brown Shield soak part of a hit. Other armor sources are [Baked Buckler](/items/baked-buckler), the aura of the dog [Waffles](/dogs/corgi) and [Spud Shrine](/points-of-interest#spud-shrine) blessings.

## Tips

- Armor is strongest early. If you take Starch Plating for defence, take it early rather than late.
- Fry Volcano fires when Tibo is hit, and armor lowers what each of those hits costs, so the two fit together.
