## Overview

Spud Cannon fires a potato shell at the nearest pest every 2.2 s. The shell bursts on the first pest it touches and deals 20 raw damage to everything in a 22-unit blast radius. If it hits nothing, it bursts where it is when its 2 s flight time runs out.

It is offered on level-up cards and is in the starting-weapon pool. At level 8 it fires 2 shells every 1.9 s for 55 raw damage, and area 1.4 widens the blast to about 31 units. With [Hot Sauce](/passives/hot-sauce) owned, a [chest](/chests) evolves it into [Spudzooka](/weapons/spudzooka). It also unites with [Spud Lob](/weapons/spud-lob) into [Spud Artillery](/weapons/spud-artillery). See [Evolutions](/evolutions).

## How it works

- **Impact plus blast.** When the shell touches a pest, that pest takes the hit, and then the shell explodes and is removed. <small>[sim-HQr6OS1G.js: `if(n.split[t]>0&&tf(e,t,a),n.explodeRadius[t]>0)ef(e,t),n.pool.kill(t)`]</small> The struck pest is also inside the blast, so it takes damage twice: once from the impact and once from the explosion. Other pests in the radius take the blast only. Pierce has no effect, since the shell always stops at its first target.
- **Burst on timeout.** A shell that runs out of flight time explodes in place. <small>[sim-HQr6OS1G.js: `a<=0?(n.explodeRadius[r]>0&&ef(e,r)`]</small> At speed 170 that is about 340 units away.
- **Blast size.** The blast radius is `explodeRadius × area`. <small>[sim-HQr6OS1G.js: `a.explodeRadius[o]=n.explodeRadius*r.area,a.cluster[o]=n.cluster??0`]</small> [Area](/stats) bonuses grow it directly.
- **Aim.** It needs a pest within 224 units (70% of the 320-unit play area) to fire. Shells after the first in a volley get a little random spread.

## Tips

- The blast covers everything around the target, so the shell does the most against packed groups. The pest closest to Tibo, which is the one it aims at, takes the most damage.
- Spudzooka and Spud Artillery both build on this weapon. If both are ready at the same chest, the game asks “Evolve or unite?” (see [Chests](/chests)). A union only needs one partner to be a max-level base weapon, so a Spudzooka can still unite later with a level 8 Spud Lob. <small>[sim-HQr6OS1G.js: `return Ys(n)||Ys(r)?[n,r]:void 0`]</small>
