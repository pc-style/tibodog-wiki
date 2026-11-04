## Overview

Frozen Fries shoots frozen fries at the nearest pest, freezing each pest it hits in place for 1 s. At level 1 it fires one fry every 1.6 s for 9 damage; the fry passes through one pest and hits a second. Levels add fries and pierce: by level 8 it fires 4 fries per volley (0.12 s apart) every 1.3 s, each dealing 21 damage and hitting up to 4 pests.

Frozen Fries is one of the possible starting weapons of a standard run (see [Level-up](/level-up)) and is also offered on level-up cards. At level 8, a chest opened while Tibo holds [Thick Skin](/passives/thick-skin) evolves it into [Permafrost Fries](/weapons/permafrost-fries).

## How it works

- **Targeting**: it fires only when a pest is within 0.7 × the larger side of the play field (224 units on the 320 × 320 field) and aims at the nearest one. <small>[sim-CrpXuTSY.js: `function pp(e){return .7*Math.max(e.field.width,e.field.height)}`]</small>
- **Volley spread**: the first fry of a volley flies straight at the target; each later fry gets a random angle offset that grows with its place in the volley (up to ±0.08 rad × its index), so bigger volleys fan out. <small>[sim-CrpXuTSY.js: `hp(e,pp(e))+e.rng.range(-.08,.08)*c`]</small>
- **Freeze**: a frozen pest stops moving. The freeze lasts 1 s times Tibo's duration stat, and a new freeze never shortens one already running. **Bosses cannot be frozen**: the freeze status is skipped for them. <small>[sim-CrpXuTSY.js: ``case`freeze`:r||(e.freezeT[t]=Math.max(e.freezeT[t],n.seconds*i))``]</small>
- **Pierce**: a fry with pierce N hits N + 1 pests, as with other projectiles.

## Tips

- The freeze is crowd control, not boss control. Against a [boss](/bosses) it is just a projectile.
- Pierce makes the freeze spread through a line of pests, which matters more than raw damage early on.
