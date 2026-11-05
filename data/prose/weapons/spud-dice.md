## Overview

Spud Dice throws a potato die at the nearest pest every 2 s. The die explodes like a [Spud Cannon](/weapons/spud-cannon) shell: it hits the first pest it touches, or bursts at the end of its 2 s flight, for 14 raw damage in a 20-unit radius. Before each throw it rolls a six-sided die, and the face changes the shot, as the in-game text says: “1 is a dud, 2 freezes, 3 burns, 4 splits, 5 pays gold, 6 blows up big.”

It is only offered on level-up cards and is not in the starting-weapon pool. At level 8 it throws 3 dice every 1.6 s for 25 raw damage, with area 1.2 (24-unit blast). With [Four-Eyed Spud](/passives/four-eyed-spud) owned, a [chest](/chests) evolves it into [Loaded Dice](/weapons/loaded-dice).

## How it works

Each die rolls a uniform 1–6 when thrown. [Luck](/stats) is not used in the roll.

| Face | Effect |
|---|---|
| 1 (dud) | Damage × 0.25 and blast radius × 0.4. <small>[sim-HQr6OS1G.js: `r.damage[t]=.25*r.damage[t],r.explodeRadius[t]=.4*r.explodeRadius[t]`]</small> |
| 2 (freeze) | Pests it hits are frozen for 1.5 s. |
| 3 (burn) | Pests it hits burn for 10 damage per second for 3 s. <small>[sim-HQr6OS1G.js: ``var ff={kind:`freeze`,seconds:1.5},pf={kind:`burn`,dps:10,seconds:3}``]</small> |
| 4 (split) | Two extra dice are fired 0.4 radians (about 23°) to either side, with the same blast radius and the weapon's normal damage. They have no face effect of their own. <small>[sim-HQr6OS1G.js: `vp(e,t,n,o+s*Dp,A.straight,i)`]</small> |
| 5 (gold) | Pests hit by the blast get +0.6 added to their chance of dropping gold if they die from it. <small>[sim-HQr6OS1G.js: `r.next()<n.goldChance[t]+n.killGold[t]`]</small> |
| 6 (blast) | Damage × 3 and blast radius × 1.6. <small>[sim-HQr6OS1G.js: `r.damage[t]=3*r.damage[t],r.explodeRadius[t]=1.6*r.explodeRadius[t]`]</small> |

Freeze and burn durations are multiplied by Tibo's [duration](/stats) stat. The gold bonus is stored on the pest by the last hit it took, so it only pays out if no other hit lands before the pest dies.

## Tips

- Averaged over the six faces, a die's damage multiplier is about 1.2 (0.25, four faces at 1, and 3). A split die adds two full-damage dice on top. Expect variety from this weapon rather than a steady single-target damage dealer.
- The gold face works best on pests the blast can kill outright, such as crowds of weak pests.
