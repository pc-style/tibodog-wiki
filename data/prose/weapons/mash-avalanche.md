## Overview

Mash Avalanche is the evolution of [Mash Snowball](/weapons/mash-snowball). A chest evolves Mash Snowball into it once Mash Snowball is at max level and Tibo owns [Masher Grip](/passives/masher-grip) (see [Evolutions](/evolutions)). The mash ball still grows behind Tibo as he runs and surges forward when he stops or turns sharply. It now hits for 152 instead of the max-level 90; with its 1.2 area a full ball deals 182. When the ball first hits a pest, it breaks into three smaller balls.

## How it works

Growing, release triggers and size-based damage work as described on [Mash Snowball](/weapons/mash-snowball#how-it-works). A full ball deals 152 × radius ÷ 14, and the size cap is 14 × area (1.2 here).

- **The split.** As soon as the original ball hits at least one pest while rolling, it stops and splits into three balls. The new balls fan out at −30°, 0° and +30° from its heading and continue for the distance it had left. Each has 0.7 times its radius and therefore 0.7 times its damage. The original ball does not splatter. A ball that rolls its whole distance without touching a pest does not split and splatters normally. <small>[sim-CL_Cl1Ai.js: `r.split!==void 0&&t.surgeKid[o]===0&&t.surgeHits[o]>0`]</small>
- **Splatters.** Each of the three smaller balls splatters at the end of its roll, over 2.5 times its own radius. They do not split again.
- **No double hits.** The three balls share the original ball's hit record. A pest already hit by the original ball, or by one of the three, is not hit again by the others. The split spreads damage over a wider area. It does not hit the same pest several times.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path): hits were 182.4 (a full ball, 152 × 1.2) and 127.68 (a split ball, 0.7 × 182.4). All three seeds gave the same figures.

## Tips

- The first contact triggers the split, so the full-size, full-damage ball usually hits only the first pests in its path. The rest of the crowd takes the 70% balls and their splatters.
- Area still raises the ball's size cap, and with it the damage of the original ball and the three smaller ones.
