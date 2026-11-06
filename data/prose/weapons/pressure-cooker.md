## Overview

Pressure Cooker is the evolution of [Steam Vent](/weapons/steam-vent): a much larger steam cloud that also heals Tibo. Every 0.3 seconds it deals 45 damage to every enemy within about 84 units of Tibo (a `size` of 44 times its base area of 1.9), and each enemy it hits restores 0.12 HP, up to 2 HP per pulse. A maxed Steam Vent pulses for 30 every 0.5 s in a radius of about 67.

You get it by opening a chest while Steam Vent is level 8 and you own [Root Network](/passives/root-network) at any level. See [Evolutions](/evolutions) and [Chests](/chests).

## How it works

The damage pulse works exactly like Steam Vent's, on its own 0.3 s timer, so cooldown and amount bonuses still do nothing for it, while area and damage bonuses do (see [Steam Vent](/weapons/steam-vent#how-it-works)).

The heal is counted per pulse: 0.12 HP for each enemy inside the cloud, capped at 2 HP. <small>[sim-ieBkQqL1.js: `n.heal!==void 0&&a>0&&Yl(e,Math.min(n.heal*a,n.healCap??2))`]</small> The cap is reached at 17 enemies, which works out to at most about 6.7 HP per second. The heal is added directly to Tibo's HP, up to max HP, and no stat modifies it.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it pulsed every 0.3 s for 45 and hit every pest out to 80 units but not the one at 90. All three seeds gave the same figures.

## Tips

- **Pair it with Root Network.** The heal scales with how many pests are in the cloud, so Pressure Cooker heals most when you are surrounded and nothing when the area is clear. [Root Network](/passives/root-network)'s regeneration (+0.25 HP per second per level) covers the quiet moments.
- Area bonuses grow both the damage zone and the number of enemies that count toward the heal.
