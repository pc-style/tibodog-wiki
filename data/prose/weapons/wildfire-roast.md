## Overview

Wildfire Roast is the evolution of [Hot Streak](/weapons/hot-streak). A chest evolves Hot Streak into it once Hot Streak is at max level and Tibo owns [Thick Skin](/passives/thick-skin) (see [Evolutions](/evolutions)). It keeps the same streak: moving without being hit lights up to five flames, a hit puts out two and stopping puts out all of them.

The change is reach. Each flame adds 48% to the slash radius instead of 24%. With five flames the circle is 3.4 times its base size: 34 × 1.2 area × 3.4 ≈ 139 units before area bonuses, against about 90 for a max-level Hot Streak. The slash rate per flame is unchanged (every 1 s with no flames, every 0.45 s with five). Damage is 122 per slash, one less than a max-level Hot Streak's 123.

## How it works

Flames, hits and slashes work as described on [Hot Streak](/weapons/hot-streak#how-it-works). The radius is 34 × area × (1 + 0.48 × flames). <small>[sim-CM-5WO9_.js: `return t.size*n.area*(1+t.streak.area*r)`]</small> Dodged hits and hits that a shield soaks fully do not cost flames.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right the whole time, with pests held at fixed distances to his right): with no flames it reached the pest at 45 units and fired once per second; with five flames it fired every 0.45 s and reached the pest at 140 units but not the one at 145. All three seeds gave the same figures.

## Tips

- Almost all of the gain over Hot Streak depends on keeping flames lit. Without flames it is slightly weaker than the max-level base weapon.
- Thick Skin stays useful after the evolution because dodged hits do not put out flames.
