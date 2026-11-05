## Overview

Bonfire Spud is the evolved form of [Coal-Baked Spud](/items/coal-baked-spud). Hold Coal-Baked Spud with [Hot Sauce](/passives/hot-sauce) at level 5, and the next [chest](/chests) you open turns every Coal-Baked Spud copy into the same number of Bonfire Spud copies.

When one of Tibo's weapons hits, there is a 25% chance to ignite the target and every enemy within 40 units of it. The radius grows with the square root of your area multiplier. Each burning enemy takes 60% of the triggering hit's damage per second for 4 seconds, and the duration is multiplied by Tibo's duration stat (×1.25 with no bonuses). The spread draws a shockwave around the target.

## How it works

- Compared with Coal-Baked Spud, each fire is a little weaker (60% instead of 80% of the hit per second) but lasts longer, procs more often and spreads to a whole group. <small>[sim-HQr6OS1G.js: `` case`burn`:{if(Qa(r,i,a*n.share,n.seconds*e.loadout.stats.durationMult,t.src),n.spread===void 0)return; ``]</small>
- Burn rules are the same as for Coal-Baked Spud: an enemy keeps only its strongest burn and longest timer, and the 0.5 s burn ticks can crit.
- Only weapon hits trigger it, not burn ticks or other item effects, so fires do not chain into more fires.
- Copies stack: with *N* copies the chance is `1 − 0.75^N`, limited to 20 × *N* procs per second.

## Tips

- Hot Sauce stays in your build after the evolution. Its crit chance keeps making the igniting hits, and so the fires, bigger.
- Weapons that hit dense groups make the most of the spread, because a single proc can light a whole crowd.
