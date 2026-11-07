## Overview

Boom Spud is a Rare item that gives killed enemies a chance to explode. Each copy adds 0.12 to the explode-on-kill stat. The stat goes through the game's diminishing-returns curve `x / (1 + x)` ([Stats](/stats#diminishing-returns)), so one copy gives a 10.7% chance, two give 19.4% and three give 26.5%.

The explosion deals a flat 20 damage, multiplied by Tibo's damage stat, to every enemy within 22 units of the corpse. It works on pests and elites but not on bosses. <small>[sim-BEypEELT.js: `` n.explodeOnKillChance>0&&e.rng.next()<n.explodeOnKillChance&&(q(e,20*n.damageMult,N(e,`boom-spud`,Xi(`boom-spud`)),-1,1),nu(e,a,o,22)) ``]</small>

Boom Spud has weight 6 out of 94 among Rare items, about 0.64% of item rolls at luck 0 with the full pool eligible. With [Rotten Spud](/passives/rotten-spud) at level 5, the next chest turns it into [Kaboom Spud](/items/kaboom-spud).

## How it works

- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; copies added with `giveItem`): the game's `explodeOnKillChance` stat read 0.1071, 0.1935 and 0.2647 for 1 to 3 copies.
- The explosion radius is fixed at 22 units. Unlike most item blasts it does not grow with area.
- The damage scales only with the damage (`might`) stat. It does not grow with enemy HP or with run time.
- An enemy killed by an explosion dies like any other enemy, so it can roll its own explosion. This explosion is a plain stat roll with no per-second limit, unlike the procs of [Kaboom Spud](/items/kaboom-spud).
- Explosion hits are not weapon hits, so they do not trigger on-hit items such as [Coal-Baked Spud](/items/coal-baked-spud) or [Heavy Russet](/items/heavy-russet). They can still crit.

## Tips

- **Clear early crowds, then evolve it.** 20 damage is enough to finish most early pests, but pest HP grows over the run (about 3.4× by 20:00 on Normal, see [Enemy scaling](/enemy-scaling)). Treat Boom Spud as a way to clear crowds early and as a step towards Kaboom Spud.
- Holding Boom Spud makes [Rotten Spud](/passives/rotten-spud) four times as likely in level-up offers ([Level-up](/level-up#offer-weights)). If you plan to evolve it, accept the curse that comes with it.
