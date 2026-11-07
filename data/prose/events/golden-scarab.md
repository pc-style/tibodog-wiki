## Overview

Golden Scarab is a scheduled loot-runner event. The [wave table](/bosses) fires it at 3:00, 7:00, 10:00, 14:00 and 17:00. It is not part of the rotation after 20:00. After the announcement, a [Golden Scarab](/enemies/golden-scarab) appears 40 units from Tibo in a random direction and tries to get away.

The scarab is harmless (0 damage). It escapes after 25 seconds. Hitting it can shake loose gold, and killing it drops an **item** pickup (see [Pickups](/pickups)), plus 10 XP and a gold coin. The [Lost Saucer](/events/lost-saucer) at [Crop Circle](/biomes/crop-circle) works the same way.

## How it works

- **HP.** 300 × the current pest HP multiplier from [enemy scaling](/enemy-scaling) (curse is not applied). On Normal that is about 230 HP at 3:00 and about 800 at 17:00. <small>[sim-BIASVETB.js: `e.scratch.hp=yc(e.scale,e.cfg,e.runClock).hp,e.scratch.dmg=1,e.scratch.speed=1`]</small>
- **Movement.** It runs directly away from Tibo. Within 70 units it sprints at its full speed of 40. Farther out it slows to 30% (12 units/s). Tibo's base speed is 62, so it cannot outrun him. <small>[sim-BIASVETB.js: `let n=r>e.cfg.lootRunners.sprintRadius?.3:1;i.vx[t]=-i.vx[t]*n,i.vy[t]=-i.vy[t]*n`]</small>
- **Gold per hit.** Each hit has a 50% chance to drop a coin worth 2. Like all coins, it is multiplied by gold gain when picked up. <small>[sim-BIASVETB.js: ``n>0&&e.lootRng.chance(.5)&&z(e,`gold`,e.enemies.x[t],e.enemies.y[t],n)``]</small>
- **Kill reward.** The item pickup drops on top of the usual kill drops. <small>[sim-BIASVETB.js: ``$b[n.def[t]]===1&&$c(e,`item`,i,a,1,`lootRunner`)``]</small>
- **Escape.** The scarab vanishes 25 seconds after it appears, or as soon as it is about 460 units from Tibo, and leaves no item. <small>[sim-BIASVETB.js: ``r.despawnAt[d]=e.time+(s.behavior.kind===`flee`?s.behavior.escapeAfter:25)``]</small>
- **Full field.** If the enemy pool is at its hard cap (550 on Easy/Normal, 700 on Hard, 850 on Nightmare), the event is skipped with no announcement. See [crowd limits](/modes#late-crowds).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, `--god`, seed `wiki`; the clock warped to 1 s before each minute with pests removed first): the scarab appeared at 3:00, 7:00, 10:00, 14:00 and 17:00 with 228.3, 321.9, 429, 620.9 and 801.6 HP on Normal. Easy gave 175.7 to 616.7 and Nightmare 421.6 to 1480. The Nightmare values match the pest HP multiplier alone, without Nightmare's starting curse.

## Tips

- **Chase the scarab at once.** Chase it right away. It always starts close, and it only slows down once it is more than 70 units ahead, so Tibo catches up quickly.
- Weapons that hit often roll the 50% coin chance more times before the kill, so they may be worth keeping on it.
- Every Golden Scarab minute also brings a boss (the [Colorado Queen](/bosses/beetle-queen) at 3:00), and 3:00, 7:00 and 17:00 add an elite. Weigh the item against the risk of chasing the scarab with those around.
