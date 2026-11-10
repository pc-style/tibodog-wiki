## Overview

Starch Chain fires a spark at the nearest pest within 150 units of Tibo, which then jumps from enemy to enemy. Each arc hits the first target and then makes 3 more jumps, so it damages up to 4 enemies for 14 each. Every 1.8 seconds it fires 2 arcs: a raw amount of 1 plus the +1 base amount bonus every non-aura weapon gets (see [Stats](/stats)). Levels add jumps (7 jumps, or 8 enemies per arc, at level 8), raise damage to 38 and add a third arc.

It is offered on level-up and can be given by [poteto's](/visitors#poteto) gift chest. At level 8 a chest evolves it into [Gratin Arc](/weapons/gratin-arc) if you own [Hot Sauce](/passives/hot-sauce). Gratin Arc then unites with [Thunder Tuber](/weapons/thunder-tuber) into [Starch Supercell](/weapons/starch-supercell). See [Evolutions](/evolutions).

## How it works

- **Pierce is the jump count.** After the first hit, the spark jumps once per point of pierce, capped at 60, so pierce bonuses from passives and items lengthen the chain. <small>[sim-CJbdqtVr.js: `aA(e,c,l,r.pierce===-1?60:Math.min(60,r.pierce),n.jump*Math.sqrt(r.area),s)`]</small>
- **Each jump goes to the nearest enemy not yet hit by this arc**, as long as it is within 70 units of the previous target. If nothing is close enough, the chain stops early. The jump distance grows with the square root of area: double area gives about 1.4 times the jump distance.
- **Every link deals full damage.** There is no falloff along the chain.
- **Arcs are separate.** The arcs of one cast fire 0.2 s apart and each starts again from the nearest enemy, so later arcs can hit the same pests as the first.
- Like [Starch Bolt](/weapons/starch-bolt), the weapon only fires when an enemy is within its 150-unit range.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; 14 pests held in a line, 30 units apart, from 30 units to Tibo's right): at level 1 two arcs 0.2 s apart every 1.8 s each hit the 4 nearest pests; at level 8 three arcs each hit the 8 nearest pests. All three seeds gave the same figures.

## Tips

- **Use it on tightly packed pests.** Starch Chain does most of its work when pests are packed within 70 units of each other. Against spread-out enemies the chain ends early.
- Pierce bonuses are worth more here than on most weapons, because each point is a whole extra target per arc.
