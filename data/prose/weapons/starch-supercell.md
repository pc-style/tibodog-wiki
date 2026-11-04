## Overview

Starch Supercell is the union of [Starch Bolt](/weapons/starch-bolt) and [Starch Chain](/weapons/starch-chain). Opening a [chest](/chests) when both qualify replaces them with this one weapon and frees a weapon slot (see [Evolutions](/evolutions#unions)). It calls down Starch Bolt's lightning strikes, and each strike then jumps between nearby pests like Starch Chain.

Every 1.6 s it strikes 6 different pests (raw Amount 5 plus Tibo's base +1 projectile, see [Stats](/stats)) picked at random within 190 units of Tibo. Each strike deals 80 damage to every pest within about 22 units of the target (12 × Area 1.8). From each struck pest, lightning then jumps up to 3 times to the nearest pest within 80 units, dealing 60% damage (48) per jump.

## How it works

- **Firing.** The weapon only fires when at least one pest is within 190 units; otherwise it checks again every 0.1 s. All strikes of a volley land in the same instant.
- **Targets.** Strike targets are picked at random from pests in range, and each pest can be picked only once per volley. If fewer pests are in range than the Amount, the extra strikes are lost. <small>[sim-CrpXuTSY.js: `let o=Qi(e,n.range,i);if(o===void 0)return;ea(e,o,i);`]</small>
- **Chains.** Each jump goes to the nearest pest within 80 units of the last one that has not yet been picked in this volley, so chains never return to a pest already struck or chained. A chain stops early when no such pest is in reach. The 80-unit jump is not affected by Area. <small>[sim-CrpXuTSY.js: `n.chain!==void 0&&(e.attack.damage=.6*r.damage,bp(e,s,c,n.chain,n.jump??70,i)`]</small>
- **Splash.** A strike circle hits every pest inside it, including pests already hit by another strike or chain in the same volley; only the choice of targets avoids repeats.

## Tips

- In a dense crowd one volley can reach 6 strike targets plus up to 18 chain jumps. Against a lone pest it is a single 80-damage strike every 1.6 s.
- Area widens the strike circles but not the chain range.
