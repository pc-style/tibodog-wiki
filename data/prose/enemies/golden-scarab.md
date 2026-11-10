## Overview

The Golden Scarab is a loot runner: a harmless pest that runs away from Tibo and pays out if caught. It comes only from the [Golden Scarab](/events/golden-scarab) event (“A Golden Scarab! Catch it!”), which the [wave schedule](/bosses#wave-schedule) fires at 3:00, 7:00, 10:00, 14:00 and 17:00. The scarab appears 40 units from Tibo in a random direction. The [Lost Saucer](/enemies/lost-saucer) of [Crop Circle](/biomes/crop-circle) is the other loot runner and works the same way with slightly different numbers.

It deals no damage at all. Its HP is high for its time (300 base) and scales with run time and difficulty, but not with [curse](/curse), and its speed is not scaled. On Normal that means about 230 HP at 3:00 and about 800 at 17:00. A caught scarab drops an item, a guaranteed coin and 10 XP. Every hit along the way can also shake loose extra gold.

## How it works

- **Running.** It moves directly away from Tibo. Within 70 units (`lootRunners.sprintRadius`) it flees at its full speed of 40; farther out it slows to 30% of that, 12. <small>[sim-C5oejjzh.js: `let n=r>e.cfg.lootRunners.sprintRadius?.3:1`]</small>
- **Escaping.** It vanishes, with no drops, 25 s after it appears (`escapeAfter`). Like other timed pests, it is also removed if Tibo gets more than 460 units away from it. <small>[sim-C5oejjzh.js: `` r.despawnAt[d]=e.time+(o.behavior.kind===`flee`?o.behavior.escapeAfter:25) ``]</small>
- **Gold per hit.** Each hit that lands has a 50% chance to drop a coin worth 2 (`goldPerHit`). <small>[sim-C5oejjzh.js: `` n>0&&e.lootRng.chance(.5)&&R(e,`gold` ``]</small>
- **Reward.** Killing it drops an item pickup, which Tibo opens by standing on it (see [Pickups](/pickups)), on top of its normal drops. <small>[sim-C5oejjzh.js: `` BC[n.def[t]]===1&&Sl(e,`item`,i,a,1,`lootRunner`) ``]</small>

## Tips

- **Chase it as soon as it appears.** Tibo's base speed of 62 beats the scarab's 40, so a straight chase closes the gap by about 22 units per second. When the event fires, head for it at once: 25 s is not much time at 3:00, when the scarab has about 230 HP.
- Weapons that hit many times pay out more gold along the way, because the coin roll happens on every hit.
- Its mass of 0.5 halves knockback, but knockback still pushes it away from Tibo. Heavy-knockback weapons can work against you during the chase.
