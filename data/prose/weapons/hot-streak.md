## Overview

Hot Streak rewards Tibo for moving without being hit. It slashes every pest within a circle around him. Each full second of uninterrupted movement lights one flame, up to five. Each flame makes the circle bigger and the slashes faster. Being hit puts out two flames, and stopping puts out all of them.

With no flames the slash covers a radius of 34 and fires once per second. With five flames the radius is 2.2 times larger (about 75) and it fires every 0.45 s. Each slash hits every pest in the circle for 45 damage at level 1 (123 at max level, where area is also 1.2). It is a base weapon offered on level-up. At max level, with [Thick Skin](/passives/thick-skin) owned, a chest evolves it into [Wildfire Roast](/weapons/wildfire-roast) (see [Evolutions](/evolutions)).

## How it works

- **Lighting flames.** A flame is added after each full second in which Tibo moves and is not hurt. Stopping or being hurt restarts that second.
- **Stopping.** Any tick in which Tibo is not moving puts out every flame.
- **Getting hit.** Each hit removes two flames. Only hits that deal damage count. A dodged hit (from evasion) returns before the hit is counted, so it costs no flames. <small>[sim-HQr6OS1G.js: `!r&&s.evasion>0&&e.rng.chance(s.evasion)`]</small> The same is true of a hit that [Hash Brown Shield](/weapons/hash-brown-shield) soaks fully. Damage from ground hazards is applied without the hit bookkeeping, so it does not put out flames either.
- **Size and speed.** The radius is 34 × area × (1 + 0.24 × flames), and the time between slashes is 1 s × cooldown multiplier ÷ (1 + 0.24 × flames). <small>[sim-HQr6OS1G.js: `return t.size*n.area*(1+t.streak.area*r)`]</small> <small>[sim-HQr6OS1G.js: `t.cd=l(n.hitInterval*e.loadout.stats.cooldownMult/f)`]</small>
- **No target, no slash.** If no pest is inside the circle the slash waits and the timer does not restart. The next slash fires as soon as a pest enters.
- Amount, speed, duration and pierce have no effect on this weapon.

## Tips

- Keep moving. Stopping for a single tick costs every flame, while a hit costs only two.
- [Thick Skin](/passives/thick-skin), the catalyst, raises dodge chance. Dodged hits do not cost flames, so it protects the streak as well as Tibo.
- Area multiplies the whole radius, flames included, so area bonuses work well with this weapon.
