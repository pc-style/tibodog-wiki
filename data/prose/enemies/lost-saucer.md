## Overview

The Lost Saucer is a loot runner: a harmless pest that flees from Tibo and pays out gold when shot. It never spawns as an ordinary pest. It appears only through the [Lost Saucer](/events/lost-saucer) event (“A lost saucer! Shoot it down for gold!”), which is the landmark event of the [Crop Circle](/biomes/crop-circle): each Crop Circle fires it once, when Tibo first walks into it. Landmark events are switched off in [Story mode](/story-mode). It works the same way as the [Golden Scarab](/enemies/golden-scarab), the loot runner of the timed [Golden Scarab](/events/golden-scarab) event.

The saucer spawns 40 units from Tibo in a random direction and has 20 seconds before it escapes. It deals no damage. Its 260 base HP scales with run time like other pests, but curse does not add to it. When killed it drops 10 XP, a gold coin every time (gold chance 100%), and an item (see [Pickups](/pickups)).

## How it works

- **Fleeing**: it moves directly away from Tibo. Within 70 units it runs at its full speed of 40; farther out it slows to 30% (12 units per second). Tibo's base speed is 62, so he can always close the gap. <small>[sim-BT0LZ3Va.js: `let n=r>e.cfg.lootRunners.sprintRadius?.3:1;i.vx[t]=-i.vx[t]*n,i.vy[t]=-i.vy[t]*n`]</small>
- **Gold per hit**: every hit has a 50% chance to drop a coin worth 2, before Tibo's gold gain. <small>[sim-BT0LZ3Va.js: ``n>0&&e.lootRng.chance(.5)&&z(e,`gold`,e.enemies.x[t],e.enemies.y[t],n)``]</small>
- **Escape**: it despawns 20 s after spawning (its `escapeAfter`), or earlier if it gets more than 460 units from Tibo. Either way it drops nothing. <small>[sim-BT0LZ3Va.js: ``r.despawnAt[d]=e.time+(s.behavior.kind===`flee`?s.behavior.escapeAfter:25)``]</small>
- **Item on kill**: killing a loot runner adds an item pickup to the normal drops. <small>[sim-BT0LZ3Va.js: ``$b[n.def[t]]===1&&$c(e,`item`,i,a,1,`lootRunner`)``]</small>
- **Knockback**: its mass of 0.5 halves knockback. Knockback pushes it away from where the hit came from, which for most of Tibo's weapons is also away from him.

## Tips

- **Use many fast hits.** Many fast hits beat a few big ones, because each hit rolls separately for its 2-gold coin.
- Chase it at once: it starts only 40 units away, and while Tibo stays close it can only manage speed 40 against his 62.
- Knockback can push it further away; weapons without knockback keep it in reach.
