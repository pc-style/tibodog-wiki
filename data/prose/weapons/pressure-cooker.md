## Overview

Pressure Cooker is the evolution of [Steam Vent](/weapons/steam-vent): a much larger steam cloud that also heals Tibo. Every 0.3 seconds it deals 45 damage to every enemy within about 84 units of Tibo (a `size` of 44 times its base area of 1.9), and each enemy it hits restores 0.12 HP, up to 2 HP per pulse. A maxed Steam Vent pulses for 30 every 0.5 s in a radius of about 67.

You get it by opening a chest while Steam Vent is level 8 and you own [Root Network](/passives/root-network) at any level. See [Evolutions](/evolutions) and [Chests](/chests).

## How it works

The damage pulse works exactly like Steam Vent's, on its own 0.3 s timer, so cooldown and amount bonuses still do nothing for it, while area and damage bonuses do (see [Steam Vent](/weapons/steam-vent#how-it-works)).

The heal is counted per pulse: 0.12 HP for each enemy inside the cloud, capped at 2 HP. <small>[sim-CrpXuTSY.js: `n.heal!==void 0&&a>0&&to(e,Math.min(n.heal*a,n.healCap??2))`]</small> The cap is reached at 17 enemies, which works out to at most about 6.7 HP per second. The heal is added directly to Tibo's HP, up to max HP, and no stat modifies it.

## Tips

- The heal scales with how many pests are in the cloud, so Pressure Cooker heals most when you are surrounded and nothing when the area is clear. [Root Network](/passives/root-network)'s regeneration (+0.25 HP per second per level) covers the quiet moments.
- Area bonuses grow both the damage zone and the number of enemies that count toward the heal.
