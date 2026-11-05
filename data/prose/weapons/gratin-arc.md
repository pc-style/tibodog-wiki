## Overview

Gratin Arc is the evolution of [Starch Chain](/weapons/starch-chain). Every second it sends 3 cheesy arcs (a raw amount of 2 plus the +1 base amount bonus every non-aura weapon gets, see [Stats](/stats)), each starting at the nearest pest within 170 units and jumping up to 10 times, so a single arc can hit 11 enemies for 30 damage each. Jumps reach 85 units instead of Starch Chain's 70, and every hit gets +25% crit chance on top of Tibo's own.

You get it by opening a chest while Starch Chain is level 8 and you own [Hot Sauce](/passives/hot-sauce) at any level. Gratin Arc can still take part in the [Starch Supercell](/weapons/starch-supercell) union with a maxed [Starch Bolt](/weapons/starch-bolt). See [Evolutions](/evolutions) and [Chests](/chests).

## How it works

The chaining follows the same rules as Starch Chain: pierce is the number of jumps (capped at 60), each jump goes to the nearest enemy not yet hit by that arc, and jump distance scales with the square root of area.

The crit bonus is added straight to the hit's crit chance, after Tibo's crit points have been converted into a chance (see [Stats](/stats#crit)). It is not subject to the diminishing returns that apply to crit points. <small>[sim-HQr6OS1G.js: `let c=o.critChance+a.critBonus[r];c>0&&e.rng.next()<c&&(l*=o.critMult,u=!0)`]</small> For example, with no other crit sources, Hot Sauce at level 5 gives 0.3 crit points, about a 23% crit chance, so Gratin Arc hits crit about 48% of the time. A crit multiplies damage by 2 plus Tibo's crit damage.

## Tips

- Keep levelling Hot Sauce after the evolution: its crit chance stacks with the arc's flat +25%.
- Extra pierce turns into extra jumps here too, and extra amount adds whole arcs.
