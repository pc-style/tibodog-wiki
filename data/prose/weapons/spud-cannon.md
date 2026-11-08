## Overview

Spud Cannon fires 2 potato shells (its raw amount of 1 plus Tibo's base +1 amount, see [Stats](/stats)), 0.15 s apart, at the nearest pest every 2.2 s. The shell bursts on the first pest it touches and deals 20 raw damage to everything in a 22-unit blast radius. If it hits nothing, it bursts where it is when its flight time runs out: 2 s, or 2.5 s with Tibo's base +25% duration.

It is offered on level-up cards and is in the starting-weapon pool. At level 8 it fires 3 shells (raw amount 2 plus 1) every 1.9 s for 55 raw damage, and area 1.4 widens the blast to about 31 units. With [Hot Sauce](/passives/hot-sauce) owned, a [chest](/chests) evolves it into [Spudzooka](/weapons/spudzooka). Spudzooka then unites with [Sack of Russets](/weapons/sack-of-russets) into [Spud Artillery](/weapons/spud-artillery). See [Evolutions](/evolutions).

## How it works

- **Impact plus blast.** When the shell touches a pest, that pest takes the hit, and then the shell explodes and is removed. <small>[sim-wTU8O3Z8.js: `if(n.split[t]>0&&RD(e,t,a),n.explodeRadius[t]>0)LD(e,t),n.pool.kill(t)`]</small> The struck pest is also inside the blast, so it takes damage twice: once from the impact and once from the explosion. Other pests in the radius take the blast only. Pierce has no effect, since the shell always stops at its first target.
- **Burst on timeout.** A shell that runs out of flight time explodes in place. <small>[sim-wTU8O3Z8.js: `a<=0?(n.explodeRadius[r]>0&&LD(e,r)`]</small> At speed 170 and 2.5 s that is about 425 units away.
- **Blast size.** The blast radius is `explodeRadius × area`. <small>[sim-wTU8O3Z8.js: `o.explodeRadius[a]=n.explodeRadius*r.area,o.cluster[a]=n.cluster??0`]</small> [Area](/stats) bonuses grow it directly.
- **Aim.** It needs a pest within 224 units (70% of the 320-unit play area) to fire. Shells after the first in a volley get a little random spread.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it fired 2 shells 0.15 s apart every 2.2 s, each spawned with a 2.5 s lifetime, and the nearest pest took 20 from the impact and 20 from the blast; at level 8 it fired 3 shells every 1.9 s. All three seeds gave the same figures.

## Tips

- **Fire it into packed groups.** The blast covers everything around the target, so the shell does the most against packed groups. The pest closest to Tibo, which is the one it aims at, takes the most damage.
- Evolve both partners before aiming for Spud Artillery: a level-8 Spud Lob cannot unite with Spudzooka until it becomes Sack of Russets. A multi-reward chest can evolve it and then unite the pair automatically. See [Chests](/chests).
