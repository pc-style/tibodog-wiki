## Overview

Spud Dice throws 2 potato dice (its raw amount of 1 plus Tibo's base +1 amount, see [Stats](/stats)), 0.2 s apart, at the nearest pest every 2 s. The die explodes like a [Spud Cannon](/weapons/spud-cannon) shell: it hits the first pest it touches, or bursts at the end of its flight (2 s, 2.5 s with Tibo's base +25% duration), for 14 raw damage in a 20-unit radius. Before each throw it rolls a six-sided die, and the face changes the shot, as the in-game text says: “1 is a dud, 2 freezes, 3 burns, 4 splits, 5 pays gold, 6 blows up big.”

It is only offered on level-up cards and is not in the starting-weapon pool. At level 8 it throws 4 dice (raw amount 3 plus 1) every 1.6 s for 25 raw damage, with area 1.2 (24-unit blast). With [Four-Eyed Spud](/passives/four-eyed-spud) owned, a [chest](/chests) evolves it into [Loaded Dice](/weapons/loaded-dice).

## How it works

Each die rolls a uniform 1–6 when thrown. [Luck](/stats) is not used in the roll.

| Face | Effect |
|---|---|
| 1 (dud) | Damage × 0.25 and blast radius × 0.4. <small>[sim-CQWK9k-D.js: `r.damage[t]=.25*r.damage[t],r.explodeRadius[t]=.4*r.explodeRadius[t]`]</small> |
| 2 (freeze) | Pests it hits are frozen for 1.5 s. |
| 3 (burn) | Pests it hits burn for 10 damage per second for 3 s. <small>[sim-CQWK9k-D.js: ``var xC={kind:`freeze`,seconds:1.5},SC={kind:`burn`,dps:10,seconds:3}``]</small> |
| 4 (split) | Two extra dice are fired 0.4 radians (about 23°) to either side, with the same blast radius and the weapon's normal damage. They have no face effect of their own. <small>[sim-CQWK9k-D.js: `Mw(e,t,n,s+c*Vw,w.straight,i)`]</small> |
| 5 (gold) | Pests hit by the blast get +0.6 added to their chance of dropping gold if they die from it. <small>[sim-CQWK9k-D.js: `r.next()<n.goldChance[t]+n.killGold[t]`]</small> |
| 6 (blast) | Damage × 3 and blast radius × 1.6. <small>[sim-CQWK9k-D.js: `r.damage[t]=3*r.damage[t],r.explodeRadius[t]=1.6*r.explodeRadius[t]`]</small> |

Freeze and burn durations are multiplied by Tibo's [duration](/stats) stat. The gold bonus is stored on the pest by the last hit it took, so it only pays out if no other hit lands before the pest dies.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 40 to 110 units to Tibo's right): at level 1 it threw 2 dice every 2 s, each spawned with a 2.5 s lifetime, and volleys that rolled a split had 2 extra dice; at level 8 it threw 4 dice every 1.6 s. All three seeds gave the same figures.

## Tips

- **It gives variety, not steady damage.** Averaged over the six faces, a die's damage multiplier is about 1.2 (0.25, four faces at 1, and 3). A split die adds two full-damage dice on top. Expect variety from this weapon rather than a steady single-target damage dealer.
- The gold face works best on pests the blast can kill outright, such as crowds of weak pests.
