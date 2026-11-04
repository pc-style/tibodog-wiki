## Overview

Salt Flats is the evolution of [Salt Line](/weapons/salt-line). A chest can evolve it once Salt Line is at max level and Tibo owns [Spud Sneakers](/passives/spud-sneakers) (see [Evolutions](/evolutions)). Tibo still trails salt while he walks, but the patches are bigger and stronger. A new patch drops every 0.12 s. Each patch has a radius of about 18.7 units (11 × 1.7 area) and lasts 3 s, or 3.75 s with Tibo's base +25% duration. Pests on the salt take 80 damage every 0.25 s and are slowed by 55% for 1.2 s (1.5 s with the base bonus). Patches also push pests outwards.

## How it works

- Like Salt Line, it lays salt only while Tibo is moving. A pest takes damage from the trail at most once per `hitInterval` (0.25 s), however many patches overlap.
- **Push.** Each time a patch ticks, every pest on it gets a knockback push of 60 away from the patch centre. The push is reduced by the pest's mass, and bosses are not pushed. Patches drop just behind Tibo, so pests that step onto his trail are shoved off it. <small>[sim-CrpXuTSY.js: `a.push[t]=n.trail.push??0`]</small>
- **Slow.** `factor` 0.55 means slowed pests and bosses move at 45% speed.

## Tips

- The push and slow together make the trail work as a wall. Circling a crowd leaves a ring of salt that damages pests and holds them back as they try to cross.
- Spud Sneakers levels make Tibo faster, so the trail covers more ground.
