## Overview

GPU gives +1 projectile at every level, plus 2% cooldown reduction per level (10% at level 5). The catch is heat: weapons build heat as they fire, and when it fills up they slow to half speed for 3 s. Higher levels raise the heat cap from 20 to 36 and cooling from 2.6 to 2.8 heat per second. The extra projectile does not grow with level; only the cooldown and heat values do.

It is the catalyst for [Kettle Cyclone](/weapons/kettle-cyclone) (from [Chip Shuriken](/weapons/chip-shuriken)) and [Spark Corral](/weapons/spark-corral) (from [Spud Fence](/weapons/spud-fence)). GPU has the lowest offer weight of any passive (40), so it shows up on level-up cards less often than the others.

## How it works

**Heat gain.** Each time a weapon starts an attack, heat rises by that weapon's current cooldown in seconds, at most 6. No heat is added while throttled.<small>[sim-CrpXuTSY.js: `function df(e,t){let n=e.loadout.thermal;!n.on||e.player.throttleTicks[e.me]>0||(e.player.heat[e.me]=e.player.heat[e.me]+Math.min(t,n.maxVolleyHeat))}`]</small> Turret shots add heat too.

So a weapon that fires as soon as its cooldown is ready adds about 1 heat per second, whatever its cooldown: a 0.5 s weapon adds 0.5 heat twice a second. This also means cooldown reduction, from GPU itself or [Chives](/passives/chives), does not lower heat per second. Fire-rate boosts that are not cooldown, such as the [Frenzy Fryer](/points-of-interest#frenzy-fryer), do raise it. Weapons with no cooldown, such as [Steam Vent](/weapons/steam-vent), add no heat.

**Cooling.** Heat drops by 2.6–2.8 per second. If heat reaches the cap after cooling, GPU throttles.

**Throttle.** For 3 s, weapon timers run at half speed, and heat drains in a straight line from the cap to 0.<small>[sim-CrpXuTSY.js: `function lf(e){return(e.player.throttleTicks[e.me]>0?e.loadout.thermal.throttleRate:1)*_u(e)}`]</small> After the throttle, heat starts again from 0.

The +1 projectile goes through the normal amount stat, so it does not help `aura`, `cone`, `nuke` or `ring` weapons (see [Sprouting Eyes](/passives/sprouting-eyes#how-it-works)).

## Tips

- By the rule above, cooling of 2.6–2.8 per second roughly keeps pace with two or three weapons that fire constantly. A full set of fast-firing weapons will overheat; weapons that only fire when a target is in range add less. This is an estimate from the heat rule, not a measured value.
- Each level raises the heat cap and the cooling rate, so levelling GPU makes throttles rarer. The throttle itself always lasts 3 s.
- GPU's +1 projectile stacks with [Sprouting Eyes](/passives/sprouting-eyes) and [Extra Eye](/items/extra-eye).
