## Overview

Kaboom Spud is the evolved form of [Boom Spud](/items/boom-spud). Hold Boom Spud with [Rotten Spud](/passives/rotten-spud) at level 5, and the next [chest](/chests) you open turns every Boom Spud copy into the same number of Kaboom Spud copies. Boom Spud stops dropping after that.

The evolution replaces Boom Spud's flat explosion. When an enemy dies, Kaboom Spud has a 25% chance to blast everything within 48 units for half of that enemy's max HP. The blast radius grows with the square root of your area multiplier. <small>[sim-D_9pEFdy.js: `` case`blast`:{let t=r.radius*ed(e);J(e,o*r.share,n.src,-1,.5),cd(e,n,i,a,t);return} ``]</small>

## How it works

- Kaboom Spud has no stat mods, so the explode-on-kill stat from Boom Spud is gone after the evolution.
- Copies stack: with *N* copies the chance per kill is `1 − 0.75^N`, and the limit is 10 × *N* procs per second. The limit works as a token bucket. It starts full, holds at most 10 × *N* procs and refills at 10 × *N* per second. <small>[sim-D_9pEFdy.js: `e.chance=function(e,t){return 1-ke(1-Math.min(1,Math.max(0,e)),t)}(i.chance,n),e.rate=i.perSec*n`]</small>
- Blast damage comes from the dead enemy's max HP, not from Tibo's damage stat. It still gets the elite/boss bonus from [Boss Buster](/items/boss-buster) and [Bacon Bits](/passives/bacon-bits), and it can crit.
- Boss deaths roll for the effect too, and a boss blast deals half the boss's max HP to everything nearby. <small>[sim-D_9pEFdy.js: `e.itemFx.kill.length>0&&fd(e,t,r)`]</small>
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added directly with `giveItem`, skipping the evolution; Peeler, Small Fry, Tot Toss, Chip Shuriken, Starch Chain and Seeker Sprouts each given 5 times with `give`; `warp(240)`; HP refilled every tick; Tibo walking a slow circle; later level-ups taking the first offer). Over 180 s on seeds `s1`–`s5`, 24.5% of 17,717 kill rolls exploded with one copy (expected 25%), and 57.4% of 18,960 with three (expected 57.8%). With the chance set to 100% in the scenario (120 s, seeds `s1`–`s3`), one copy exploded 9.67–9.73 times per second. Two copies reached 18.0–18.7 per second, above one copy's limit, so the doubled limit of 20 was not reached in these runs.
- Enemies killed by a blast can trigger more blasts, up to the per-second limit.

## Tips

- Curse multiplies enemy HP ([Curse](/curse)), so the curse from Rotten Spud also makes every Kaboom blast bigger. The two scale together.
- Because the blast scales with enemy HP, Kaboom Spud stays useful late in a run, where Boom Spud's flat 20 damage falls off.
