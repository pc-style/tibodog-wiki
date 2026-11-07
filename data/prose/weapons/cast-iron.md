## Overview

Cast Iron is the evolution of [Frying Pan](/weapons/frying-pan). You get it by opening a [chest](/chests) with a max-level Frying Pan and [Starch Plating](/passives/starch-plating) at any level. It keeps the pan's two tricks, swatting enemy bullets back and charging on elite kills, and improves both. Its base stats are also higher: 34 damage, a 1.1 s cooldown and 1.3 area.

## How it works

- **Swings.** Cast Iron's own Amount is 2, and Tibo's built-in +1 amount (see [Stats](/stats#stat-conversion)) adds one more, for 3 swings per volley. They go front, back, then front again 10 units lower, 0.12 s apart. The swing box is 50 × Area wide and 34 × Area tall (Frying Pan: 46 × 30).
- **Swatted bullets.** A returned bullet deals 2.5 × Cast Iron's damage (Frying Pan: 1.5×). It passes through 4 pests instead of 2, flies at speed 240 for its Duration, and homes in on pests instead of flying straight back.<small>[sim-DluAnNp6.js: `f=!0===n.homing?E.homing:E.straight`]</small>
- **Elite charge.** It works as on the Frying Pan: each elite death adds a charge (cap 3), and the next volley spends it. Each charge gives +35% size and +75% damage (the pan gives +60%), so a full charge means 2.05× size and 3.25× damage on every swing of that volley.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 28 units to each side of Tibo): it swung right, left and right again, 0.12 s apart, every 1.1 s, for 34. Bullet swatting and elite charge were not measured. All three seeds gave the same figures.

## Tips

- **Swat bullets without lining up.** Homing swats are the main change from the pan: you don't need to be lined up with the shooter for a swatted bullet to hit something.
- Cast Iron and [Hash Bulwark](/weapons/hash-bulwark) share the Starch Plating catalyst, so one passive slot can serve both evolutions.
