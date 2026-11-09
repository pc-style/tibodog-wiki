## Overview

Sharp Peeler is a rare item that adds +1 pierce to Tibo's projectiles. Each copy adds another +1. With no luck, the full pool eligible and no weapon-catalyst weight bonuses, it is about 0.38% of random item rolls (10% Rare × 5/131). Its weight of 5 is below the usual Rare weight of 6 and [Boom Spud](/items/boom-spud)'s 16, but above [Copper Tot](/items/copper-tot)'s 4.

A projectile with pierce *p* hits *p* + 1 enemies before it disappears, so a shot with pierce 1 goes from 2 enemies to 3. <small>[sim-CE9PZlJN.js: `let r=n.pierce[t];r<=0?n.pool.kill(t):n.pierce[t]=r-1`]</small>

## How it works

- **Weapons.** The bonus is added to each weapon's base pierce, except weapons whose pierce is already unlimited (99 in the data), which stay unlimited. <small>[sim-CE9PZlJN.js: `n.pierce=i.pierce>=99?-1:i.pierce+r.pierceBonus`]</small>
- **Shots that explode on impact** are removed when they explode, whatever their pierce. <small>[sim-CE9PZlJN.js: `if(n.split[t]>0&&UD(e,t,a),n.explodeRadius[t]>0)HD(e,t),n.pool.kill(t)`]</small>
- **Items.** The fries from [Porcupine Spud](/items/porcupine-spud) and [Fry Volcano](/items/fry-volcano) also get the bonus. The eyes from [Wandering Eyes](/items/wandering-eyes) and [All-Seeing Spud](/items/all-seeing-spud) do not.

## Tips

- **Pair it with low-pierce shots.** It is worth most with weapons that fire single-target shots with low pierce, such as [Fry Knives](/weapons/fry-knives) or [Tot Toss](/weapons/tot-toss), and with dense crowds. Check a weapon's pierce on its page first: for weapons with unlimited pierce it does nothing.
