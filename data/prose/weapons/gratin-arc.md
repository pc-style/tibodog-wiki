## Overview

Gratin Arc is the evolution of [Starch Chain](/weapons/starch-chain). Every second it sends 3 cheesy arcs (a raw amount of 2 plus the +1 base amount bonus every non-aura weapon gets, see [Stats](/stats)), each starting at the nearest pest within 170 units and jumping up to 10 times, so a single arc can hit 11 enemies for 30 damage each. Jumps reach 85 units instead of Starch Chain's 70, and every hit gets +25% crit chance on top of Tibo's own.

You get it by opening a chest while Starch Chain is level 8 and you own [Hot Sauce](/passives/hot-sauce) at any level. Gratin Arc unites with [Thunder Tuber](/weapons/thunder-tuber) into [Starch Supercell](/weapons/starch-supercell). Both partners must be evolved first. See [Evolutions](/evolutions) and [Chests](/chests).

## How it works

The chaining follows the same rules as Starch Chain: pierce is the number of jumps (capped at 60), each jump goes to the nearest enemy not yet hit by that arc, and jump distance scales with the square root of area.

The crit bonus is added straight to the hit's crit chance, after Tibo's crit points have been converted into a chance (see [Stats](/stats#crit)). It is not subject to the diminishing returns that apply to crit points. <small>[sim-DSqbJT_O.js: `let g=o.critChance+a.critBonus[r];g>0&&e.rng.next()<g&&(l*=o.critMult,u=!0)`]</small> For example, with no other crit sources, Hot Sauce at level 5 gives 0.3 crit points, about a 23% crit chance, so Gratin Arc hits crit about 48% of the time. A crit multiplies damage by 2 plus Tibo's crit damage.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; 14 pests held in a line, 30 units apart, from 30 units to Tibo's right): three arcs 0.1 s apart every 1 s each hit the 11 nearest pests; some hits dealt 60, the crits. All three seeds gave the same figures.

## Tips

- **Keep levelling Hot Sauce after evolving.** Keep levelling Hot Sauce after the evolution: its crit chance stacks with the arc's flat +25%.
- Extra pierce turns into extra jumps here too, and extra amount adds whole arcs.
