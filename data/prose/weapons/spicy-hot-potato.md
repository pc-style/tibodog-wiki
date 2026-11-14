## Overview

Spicy Hot Potato is the evolution of [Hot Potato](/weapons/hot-potato). Get Hot Potato to level 8 while you own [Hot Sauce](/passives/hot-sauce), then open a [chest](/chests).

Own [Permafrost Fries](/weapons/permafrost-fries) alongside it and the next chest unites them into [Baked Alaska](/weapons/baked-alaska), freeing a weapon slot.

Every 2 s it throws 3 potatoes (2 plus Tibo's built-in +1 amount, see [Stats](/stats)), 0.3 s apart. Each one hits up to 6 pests, hopping to targets up to 110 units away, and then explodes for 3× damage in a 39-unit radius (30 × its 1.3 Area). Each blast throws **two new potatoes** in opposite directions, so one throw can hit many more pests than the base weapon.

## How it works

- Hops, homing and the blast work as on [Hot Potato](/weapons/hot-potato): one pierce is used per hit, the potato turns to the nearest pest it has not hit yet within `hopRange` (110 here), and it explodes on the last pest or when its flight time runs out.
- **Respawn.** On exploding, the potato spawns `fuse.respawn` (2) copies, spaced evenly around a random angle. Each copy has the original's damage, the full hop count it was launched with and a full flight timer. <small>[sim-DvRnAb2l.js: `let i=r.fuseRespawn[t];if(i===0)return;let a=e.rng.angle();for(let n=0;n<i;n++)LO(e,t,a+n*A/i)`]</small>
- The copies do not respawn again: a new projectile starts with no respawn value and the copy does not inherit it. So each thrown potato makes at most three blasts: its own and one per copy.
- The copies start with an empty hit list, so they can hit pests the first potato already hit.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 40 to 110 units to Tibo's right): it threw 3 potatoes 0.3 s apart every 2 s, each spawned with a 3.75 s lifetime and pierce 5; respawned copies appeared away from Tibo. All three seeds gave the same figures.

## Tips

- **Use it on dense waves.** One volley can produce up to 9 blasts (3 potatoes plus 2 copies each). That makes the weapon best in dense waves, where the copies find new pests to hop to right away.
- Pierce bonuses help twice, since the copies also get the extra hops.
