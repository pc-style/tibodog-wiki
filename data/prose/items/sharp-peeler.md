## Overview

Sharp Peeler is a rare item that adds +1 pierce to Tibo's projectiles. Each copy adds another +1. With no luck it is about 0.9% of random item rolls (10% Rare × 5/53). It is the only Rare with weight 5 instead of 6, so it is slightly less common than the other Rares.

A projectile with pierce *p* hits *p* + 1 enemies before it disappears, so a shot with pierce 1 goes from 2 enemies to 3. <small>[sim-D6eyfxy3.js: `let e=n.pierce[t];e<=0?n.pool.kill(t):n.pierce[t]=e-1`]</small>

## How it works

- **Weapons.** The bonus is added to each weapon's base pierce, except weapons whose pierce is already unlimited (99 in the data), which stay unlimited. <small>[sim-D6eyfxy3.js: `n.pierce=i.pierce>=99?-1:i.pierce+r.pierceBonus`]</small>
- **Shots that explode on impact** are removed when they explode, whatever their pierce. <small>[sim-D6eyfxy3.js: `if(n.split[t]>0&&kp(e,t,a),n.explodeRadius[t]>0)Op(e,t),n.pool.kill(t)`]</small>
- **Items.** The fries from [Porcupine Spud](/items/porcupine-spud) and [Fry Volcano](/items/fry-volcano) also get the bonus. The eyes from [Wandering Eyes](/items/wandering-eyes) and [All-Seeing Spud](/items/all-seeing-spud) do not.

## Tips

- It is worth most with weapons that fire single-target shots with low pierce, such as [Fry Knives](/weapons/fry-knives) or [Tot Toss](/weapons/tot-toss), and with dense crowds. Check a weapon's pierce on its page first: for weapons with unlimited pierce it does nothing.
