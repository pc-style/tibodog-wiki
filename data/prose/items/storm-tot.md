## Overview

Storm Tot is the evolved form of [Static Tot](/items/static-tot). Each weapon hit has a 15% chance to arc lightning up to 6 jumps, reaching enemies within 90 units of the last one. Each enemy reached takes 80% of the original hit's damage, and a thunderclap at each one deals 40% of the hit to every enemy within 24 units. You get it by holding Static Tot with [Root Network](/passives/root-network) at level 5 and opening a [chest](/chests). Every Static Tot you hold becomes a Storm Tot, and Static Tot then stops dropping.

The enemy struck by a jump is also inside its own thunderclap, so it takes 1.2× the original hit in total. A full six-jump chain deals at least 7.2× the hit, more when the claps catch extra enemies. <small>[sim-CrpXuTSY.js: `K(e,a*c.share,t.src,-1,.3),Ml(e,i,f,n)`]</small>

## How it works

- **Targets and trigger** work as for Static Tot: each jump picks the nearest enemy not yet hit by this chain, only weapon hits can start a chain, and the chain stops when nothing is in range.
- **Rate limit.** At most 12 arcs per second per copy, compared with 16 for Static Tot. With *n* copies the chance is `1 − 0.85^n`.
- **Size.** Jump range and clap radius both grow with the square root of Tibo's area multiplier. Clap hits cause a little knockback; arc hits cause none.

## Tips

- The thunderclaps make it much better than Static Tot in tight crowds, where each clap hits several enemies.
- Root Network's recovery (+1.25 HP per second at level 5) is useful on its own, so the catalyst is rarely a wasted slot.
