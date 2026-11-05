## Overview

Starch Supercell is the union of [Starch Bolt](/weapons/starch-bolt) and [Starch Chain](/weapons/starch-chain). Opening a [chest](/chests) when both qualify replaces them with this one weapon and frees a weapon slot (see [Evolutions](/evolutions#unions)). It calls down Starch Bolt's lightning strikes, and each strike then jumps between nearby pests like Starch Chain.

Every 1.6 s it strikes 6 different pests (raw Amount 5 plus Tibo's base +1 projectile, see [Stats](/stats)) picked at random within 190 units of Tibo. Each strike deals 80 damage to every pest within about 22 units of the target (12 × Area 1.8). From each struck pest, lightning then jumps up to 3 times to the nearest pest within 80 units, dealing 60% damage (48) per jump.

## How it works

- **Firing.** The weapon only fires when at least one pest is within 190 units; otherwise it checks again every 0.1 s. All strikes of a volley land in the same instant.
- **Targets.** Strike targets are picked at random from pests in range, and each pest can be picked only once per volley. If fewer pests are in range than the Amount, the extra strikes are lost. <small>[sim-ByXinCYv.js: `let o=Yo(e,n.range,i);if(o===void 0)return;Zo(e,o,i);`]</small>
- **Chains.** Each jump goes to the nearest pest within 80 units of the last one that has not yet been picked in this volley, so chains never return to a pest already struck or chained. A chain stops early when no such pest is in reach. The 80-unit jump is not affected by Area. <small>[sim-ByXinCYv.js: `n.chain!==void 0&&(e.attack.damage=.6*r.damage,nh(e,s,c,n.chain,n.jump??70,i)`]</small>
- **Splash.** A strike circle hits every pest inside it, including pests already hit by another strike or chain in the same volley; only the choice of targets avoids repeats.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held on a ring 75 units from Tibo, then in a second run on rings at 60 and 150 units (clock warped 240 s first, to have enough pests)): with 12 pests in range a volley struck only 3 or 4 of them for 80 and the chains hit the rest for 48, because each chain claims its pests before the next strike picks a target, so later strikes find nothing left. With 32 pests in range, 6–7 pests took 80 each volley (6 strikes plus splash) and 16–21 took chain hits, every 1.6 s. All three seeds gave the same figures.

## Tips

- In a dense crowd one volley can reach 6 strike targets plus up to 18 chain jumps. Against a lone pest it is a single 80-damage strike every 1.6 s.
- Area widens the strike circles but not the chain range.
