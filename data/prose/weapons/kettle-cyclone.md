## Overview

Kettle Cyclone is the evolution of [Chip Shuriken](/weapons/chip-shuriken). It throws 9 kettle chips (raw amount 8 plus Tibo's base +1, see [Stats](/stats)) in an expanding spiral every 0.8 s, twice as often as the base weapon. Each chip has 42 base damage and passes through up to 4 pests (5 hits). The chips are larger (area 1.4), a little faster (130), live a little longer (1.8 s before duration bonuses) and spin slightly faster (3.4 rad/s).

It is made by opening a chest with Chip Shuriken at level 8 and [GPU](/passives/gpu) at any level (see [Evolutions](/evolutions) and [Chests](/chests)).

## How it works

Spiral behaviour is the same as on [Chip Shuriken](/weapons/chip-shuriken): all chips leave at once, evenly spaced, from where Tibo stood when the ring was thrown, and the ring's starting angle shifts by 0.4 rad per throw. With base speed 130 and duration 1.8 × 1.25, a chip's path ends roughly 6 + 130 × 2.25 ≈ 300 units from its centre.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): every throw released 9 chips on the same tick, every 0.8 s, each spawned with a 2.25 s lifetime and pierce 4. All three seeds gave the same figures.

## Tips

- **Keep levelling GPU alongside it.** GPU's heat applies to Kettle Cyclone like any weapon: firing builds heat, and at full heat weapons fire at half speed for 3 s (see [GPU](/passives/gpu)). Keep GPU levelling, since each level raises the heat cap and cooling rate.
- GPU's +1 projectile per level adds a chip to every ring.
