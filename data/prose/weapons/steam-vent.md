## Overview

Steam Vent surrounds Tibo with a cloud of hot steam. It has no cooldown and fires no projectiles: every 0.5 seconds it damages every enemy within 32 units of Tibo for 5, with a light knockback. Levels raise the damage to 30 per pulse and more than double the radius, to about 67 units at level 8.

It is one of the 17 weapons a standard run can start with, and it is offered on level-up. At level 8 a chest evolves it into [Pressure Cooker](/weapons/pressure-cooker) if you own [Root Network](/passives/root-network). See [Evolutions](/evolutions).

## How it works

Each pulse hits everything inside the circle, then waits `hitInterval` (0.5 s) for the next one. <small>[sim-09V9QVjL.js: `t.cd=E(n.hitInterval),J(e,r.damage,t.src,t.slot,r.knockback);let i=e.buf.weapon,a=G(e,e.player.x[e.me],e.player.y[e.me],n.size*r.area,i);`]</small>

Because it is an `aura` weapon, two common stats do nothing for it:

- **Cooldown** reduction does not speed up the pulses; the pulse timer uses `hitInterval` directly, and the weapon's cooldown is 0 (see [Stats](/stats)).
- **Amount** bonuses are ignored for aura weapons. <small>[sim-09V9QVjL.js: ``return e!==`aura`&&e!==`cone`&&e!==`nuke`&&e!==`ring` ``]</small>

Area and damage do help: the radius is 32 × area, and damage bonuses apply to every pulse.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it pulsed every 0.5 s and hit the pests at 20 and 30 units but never the one at 40; at level 8 it pulsed every 0.5 s and hit every pest out to 70 units but not the one at 80. All three seeds gave the same figures.

## Tips

- **Add armor or dodge passives.** Steam Vent rewards staying close to enemies, so defensive passives such as [Starch Plating](/passives/starch-plating) (armor) or [Thick Skin](/passives/thick-skin) (dodge) help it, since you will be taking contact hits while it works.
- If Steam Vent is a main damage source, area ([Big Bowl](/passives/big-bowl)) and damage ([Butter Pat](/passives/butter-pat)) do more for it than cooldown or extra projectiles.
