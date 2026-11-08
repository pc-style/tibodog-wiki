## Overview

Salt Flats is the evolution of [Salt Line](/weapons/salt-line). A chest can evolve it once Salt Line is at max level and Tibo owns [Spud Sneakers](/passives/spud-sneakers) (see [Evolutions](/evolutions)). Tibo still trails salt while he walks, but the patches are bigger and stronger. Every 0.12 s it drops 2 patches 0.1 s apart (raw amount 1 plus Tibo's base +1, see [Stats](/stats)), so new salt appears almost every 0.06 s. Each patch has a radius of 22 units (11 × 2 area) and lasts 3 s, or 3.75 s with Tibo's base +25% duration. Pests on the salt take 110 damage every 0.2 s and are slowed by 55% for 1.2 s (1.5 s with the base bonus). Patches also push pests outwards.

## How it works

- Like Salt Line, it lays salt only while Tibo is moving. A pest takes damage from the trail at most once per `hitInterval` (0.2 s), however many patches overlap.
- **Push.** Each time a patch ticks, every pest on it gets a knockback push of 60 away from the patch centre. The push is reduced by the pest's mass, and bosses are not pushed. Patches drop just behind Tibo, so pests that step onto his trail are shoved off it. <small>[sim-DA4RGMxM.js: `a.push[t]=n.trail.push??0`]</small>
- **Slow.** `factor` 0.55 means slowed pests and bosses move at 45% speed.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path): patches appeared in pairs 6 ticks apart, one pair every 7 ticks (0.12 s), each with radius 18.7 and a 3.75 s lifetime, and a pest on the salt was hit every 0.25 s (15 ticks) for 80. All three seeds gave the same figures.

## Tips

- **Unite with Ghee Glide.** A chest can combine both evolutions into [Salted Butter](/weapons/salted-butter): a slowing, burning trail with dash strips and a walking-speed bonus.
- **Circle a crowd to wall it in.** The push and slow together make the trail work as a wall. Circling a crowd leaves a ring of salt that damages pests and holds them back as they try to cross.
- Spud Sneakers levels make Tibo faster, so the trail covers more ground.
