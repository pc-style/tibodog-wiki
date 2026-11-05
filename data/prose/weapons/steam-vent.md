## Overview

Steam Vent surrounds Tibo with a cloud of hot steam. It has no cooldown and fires no projectiles: every 0.5 seconds it damages every enemy within 32 units of Tibo for 5, with a light knockback. Levels raise the damage to 30 per pulse and more than double the radius, to about 67 units at level 8.

It is one of the 17 weapons a standard run can start with, and it is offered on level-up. At level 8 a chest evolves it into [Pressure Cooker](/weapons/pressure-cooker) if you own [Root Network](/passives/root-network). See [Evolutions](/evolutions).

## How it works

Each pulse hits everything inside the circle, then waits `hitInterval` (0.5 s) for the next one. <small>[sim-HQr6OS1G.js: `t.cd=l(n.hitInterval),K(e,r.damage,t.src,t.slot,r.knockback);let i=e.buf.weapon,a=V(e,e.player.x[e.me],e.player.y[e.me],n.size*r.area,i);`]</small>

Because it is an `aura` weapon, two common stats do nothing for it:

- **Cooldown** reduction does not speed up the pulses; the pulse timer uses `hitInterval` directly, and the weapon's cooldown is 0 (see [Stats](/stats)).
- **Amount** bonuses are ignored for aura weapons. <small>[sim-HQr6OS1G.js: ``return e!==`aura`&&e!==`cone`&&e!==`nuke`&&e!==`ring` ``]</small>

Area and damage do help: the radius is 32 × area, and damage bonuses apply to every pulse.

## Tips

- Steam Vent rewards staying close to enemies, so defensive passives such as [Starch Plating](/passives/starch-plating) (armor) or [Thick Skin](/passives/thick-skin) (dodge) help it, since you will be taking contact hits while it works.
- If Steam Vent is a main damage source, area ([Big Bowl](/passives/big-bowl)) and damage ([Butter Pat](/passives/butter-pat)) do more for it than cooldown or extra projectiles.
