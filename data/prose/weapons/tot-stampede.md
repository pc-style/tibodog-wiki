## Overview

Tot Stampede is a base weapon driven by walking instead of a cooldown. Every 40 units Tibo moves, tater tots pop out behind him and steer towards the nearest pest, bursting on the first one they hit. At base move speed (62 units per second, see [Stats](/stats)) that is a batch about every 0.65 s; a still Tibo makes no tots at all.

A batch has as many tots as the weapon's Amount, which includes Tibo's base +1 projectile: 2 tots at level 1, rising to 5 at level 8. At level 8, with [Butter Socks](/passives/butter-socks) owned at any level, it evolves into [Tot Cavalry](/weapons/tot-cavalry) on the next [chest](/chests).

## How it works

- **Walk counter.** Tibo's movement is added up each tick (at most 12 units per tick), and a batch is released every 40 units. Any change in position counts, including dashes.
- **Tot limit.** At most 12 of the weapon's tots can be on the field. A batch is cut down to the free room, and if there is none, the counter waits at 40 units and releases a batch as soon as a tot is gone. <small>[sim-CFo3ylXb.js: `Dw={every:40,live:12}`]</small>
- **Launch.** Tots leave 0.08 s apart, aimed backwards from Tibo's facing with up to 1.2 rad (about 69°) of random spread either way. <small>[sim-CFo3ylXb.js: `let n=e.projectiles,r=-n.vx[t],i=-n.vy[t];n.vx[t]=r,n.vy[t]=i`]</small>
- **Homing.** Every 0.1 s a tot looks for the nearest pest within 200 units of itself and turns towards it at up to 7 rad/s (`turn`). Until it first finds a pest it flies straight; if no pest is in range at a later check, it keeps steering towards the spot where it last saw one. <small>[sim-CFo3ylXb.js: `if((e.tick+t)%6!=0)return;let n=e.projectiles,r=Nl(e,n.x[t],n.y[t],200);`]</small>
- **Lifetime.** A tot that hits nothing disappears after its Duration, 3.75 s at level 1 and 5 s from level 4 (both include Tibo's base +25%). Tots fly at 120 units per second, 140 from level 4.
- **Pierce 0.** A tot bursts on the first pest it hits. Pierce bonuses let it carry on through more.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path): a batch appeared about every 39 ticks (0.65 s): 2 tots about 0.07 s apart at level 1, each spawned with a 3.75 s lifetime, and up to 5 at level 8 with a 5 s lifetime. All three seeds gave the same figures.

**Damage comparison:** original-engine `main-IizW8WLk.js` → `main-XeaRNUVr.js`, Standard/Normal, seeds `s1/s2/s3`, granted Stampede alone, refilled HP, 8 s warmup, then 20 s walking right and dashing every 4 s with six high-HP pests held 45–90 units behind Tibo. Level-1 damage per tot rose 16 → 19.2 and total damage 1,024 → 1,228.8. Level 8 rose 40 → 43.2 per tot and 6,360–6,400 → 6,868.8–6,912 total. The base gain is 20%, but level-up damage additions are unchanged. This is forced-target damage, not natural-run DPS or acquisition evidence.

## Tips

- **Run away from the crowd.** The tots come out behind Tibo, so pests chasing him are the closest targets. Running away from a crowd sends the tots straight into it.
- Because the trigger is distance, move-speed bonuses mean more tots per second; cooldown reduction does nothing for this weapon.
