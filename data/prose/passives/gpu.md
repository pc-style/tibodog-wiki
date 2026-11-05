## Overview

GPU gives +1 projectile at every level, plus 2% cooldown reduction per level (10% at level 5). The catch is heat: weapons build heat as they fire, and when it fills up they slow to half speed for 3 s. Higher levels raise the heat cap from 20 to 36 and cooling from 2.6 to 2.8 heat per second. The extra projectile does not grow with level; only the cooldown and heat values do.

It is the catalyst for [Kettle Cyclone](/weapons/kettle-cyclone) (from [Chip Shuriken](/weapons/chip-shuriken)) and [Spark Corral](/weapons/spark-corral) (from [Spud Fence](/weapons/spud-fence)). GPU has the lowest offer weight of any passive (40), so it shows up on level-up cards less often than the others.

## How it works

**Heat gain.** Each time a weapon starts an attack, heat rises by that weapon's current cooldown in seconds, at most 6. No heat is added while throttled.<small>[sim-DrUZpiNa.js: `function kp(e,t){let n=e.loadout.thermal;!n.on||e.player.throttleTicks[e.me]>0||(e.player.heat[e.me]=e.player.heat[e.me]+Math.min(t,n.maxVolleyHeat))}`]</small> Turret shots add heat too.

So a weapon that fires as soon as its cooldown is ready adds about 1 heat per second, whatever its cooldown: a 0.5 s weapon adds 0.5 heat twice a second. This also means cooldown reduction, from GPU itself or [Chives](/passives/chives), does not lower heat per second. Fire-rate boosts that are not cooldown, such as the [Frenzy Fryer](/points-of-interest#frenzy-fryer), do raise it. Weapons with no cooldown, such as [Steam Vent](/weapons/steam-vent), add no heat.

**Cooling.** Heat drops by 2.6–2.8 per second. If heat reaches the cap after cooling, GPU throttles.

**Throttle.** For 3 s, weapon timers run at half speed, and heat drains in a straight line from the cap to 0.<small>[sim-DrUZpiNa.js: `function Dp(e){return(e.player.throttleTicks[e.me]>0?e.loadout.thermal.throttleRate:1)*Dd(e)}`]</small> After the throttle, heat starts again from 0.

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; GPU and weapons given with `give`, HP refilled every tick, Tibo standing still, later level-ups taking the first offer):

- With GPU at level 1 or 5 and Peeler, Small Fry, Tot Toss, Chip Shuriken and Starch Chain given once each (seed `s1`, 240 s), the heat cap was 20 and 36, and heat fell by exactly 2.6 and 2.8 per second between attacks. Every throttle (23 and 13) started with heat at the cap and lasted exactly 3 s. Each heat jump was a weapon's base cooldown times the cooldown multiplier, such as 0.49 and 0.98 at ×0.98.
- On seed `s2`, where Peeler is the starting weapon, a lone Peeler added 1.00 heat per second both without Chives (cooldown ×0.98, 1.02 attacks per second) and with Chives at level 5 (×0.63, 1.58 attacks per second), over 180 s.
- With heat forced to the cap so that GPU stayed throttled, the same lone Peeler attacked 0.508 times per second instead of 1.017, exactly half (seed `s2`, 120 s each).

The +1 projectile goes through the normal amount stat, so it does not help `aura`, `cone`, `nuke` or `ring` weapons (see [Sprouting Eyes](/passives/sprouting-eyes#how-it-works)).

## Tips

- Cooling of 2.6–2.8 per second keeps pace with two weapons that fire constantly, but not with three. Measured at GPU level 1 over 180 s with Peeler and Small Fry given once each: Peeler + Small Fry (seed `s2`) added 2.0 heat per second and never throttled. The starting Seeker Sprouts + Peeler + Small Fry (seed `s3`) added 2.9–3.0 heat per second and throttled 3 times, or 2 with Chives at level 5. A full set of fast-firing weapons overheats; weapons that only fire when a target is in range add less.
- Each level raises the heat cap and the cooling rate, so levelling GPU makes throttles rarer. The throttle itself always lasts 3 s.
- GPU's +1 projectile stacks with [Sprouting Eyes](/passives/sprouting-eyes) and [Extra Eye](/items/extra-eye).
