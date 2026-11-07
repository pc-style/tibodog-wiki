## Overview

Tater Twister is the evolution of [Tater Twirl](/weapons/tater-twirl), made by opening a [chest](/chests) with Tater Twirl at level 8 and [Salt Shaker](/passives/salt-shaker) owned. It keeps the same movement-driven wheels but has 5 of them (raw Amount 4 plus Tibo's base +1 projectile), each hitting for 204 instead of 120, on a wider orbit.

Like Tater Twirl, it is strongest while Tibo runs: at walking pace a pest touched by a wheel is hit every 0.2 s, and standing still slows that to about once every 1.7 s.

## How it works

The pace, hit-rate and spin rules are the same as [Tater Twirl](/weapons/tater-twirl#how-it-works). With Tater Twister's values:

- **Orbit.** 36 units × √Area, about 41 units at its Area of 1.3 (Tater Twirl at level 8: about 34).
- **Wheel size.** Hit circle of 8 × Area, about 10.4 units.
- **Spin.** 5.6 rad/s (about 0.9 turns per second) at walking pace, up to twice that at maximum pace. Salt Shaker's projectile speed counts at half strength for the spin. <small>[sim-SY4MKKFC.js: `return t.raw.speed*(1+.5*(e.loadout.stats.projSpeedMult-1))}(e,t)*a.pace`]</small>
- **Hit rate.** Still shared across all wheels: five wheels sweep more ground, but each pest is limited to one hit per `hitInterval` ÷ pace.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP): 5 wheels on a 41-unit orbit. A pest moved along with a wheel every tick was hit every 12 ticks (0.2 s) while Tibo walked and every 100 ticks (1.67 s) while he stood still. All three seeds gave the same figures.

## Tips

- **Stack move-speed bonuses.** Move-speed bonuses are the main way to speed it up, since they raise the pace (up to double) and with it both spin and hit rate.
- The wheels only reach about 41 units out, so consider pairing it with a ranged weapon for pests that keep their distance.
