## Overview

Kaboom Spud is the evolved form of [Boom Spud](/items/boom-spud). Hold Boom Spud with [Rotten Spud](/passives/rotten-spud) at level 5, and the next [chest](/chests) you open turns every Boom Spud copy into the same number of Kaboom Spud copies. Boom Spud stops dropping after that.

The evolution replaces Boom Spud's flat explosion. When an enemy dies, Kaboom Spud has a 25% chance to blast everything within 48 units for half of that enemy's max HP. The blast radius grows with the square root of your area multiplier. <small>[sim-CrpXuTSY.js: `` case`blast`:{let o=n.radius*El(e);K(e,a*n.share,t.src,-1,.5),Pl(e,t,r,i,o);return} ``]</small>

## How it works

- Kaboom Spud has no stat mods, so the explode-on-kill stat from Boom Spud is gone after the evolution.
- Copies stack: with *N* copies the chance per kill is `1 − 0.75^N`, and the limit is 10 × *N* procs per second. The limit works as a token bucket. It starts full, holds at most 10 × *N* procs and refills at 10 × *N* per second. <small>[sim-CrpXuTSY.js: `e.chance=function(e,t){return 1-x(1-Math.min(1,Math.max(0,e)),t)}(r.chance,t),e.rate=r.perSec*t`]</small>
- Blast damage comes from the dead enemy's max HP, not from Tibo's damage stat. It still gets the elite/boss bonus from [Boss Buster](/items/boss-buster) and [Bacon Bits](/passives/bacon-bits), and it can crit.
- Boss deaths roll for the effect too, and a boss blast deals half the boss's max HP to everything nearby. <small>[sim-CrpXuTSY.js: `` Zl(e,a,o,Xl(e,t,i),`boss`),xl(e,i),e.itemFx.kill.length>0&&Rl(e,t,i) ``]</small>
- Enemies killed by a blast can trigger more blasts, up to the per-second limit.

## Tips

- Curse multiplies enemy HP ([Curse](/curse)), so the curse from Rotten Spud also makes every Kaboom blast bigger. The two scale together.
- Because the blast scales with enemy HP, Kaboom Spud stays useful late in a run, where Boom Spud's flat 20 damage falls off.
