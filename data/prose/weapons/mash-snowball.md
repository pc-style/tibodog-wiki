## Overview

Mash Snowball has no timer. Movement drives it. While Tibo runs, a ball of mash rolls along his path behind him and grows with every step. When he stops, turns sharply or keeps running with a full ball, the ball surges forward along his heading, flattens pests in its path and splatters at the end of its roll.

A ball starts with radius 4 and grows by 0.22 per unit Tibo moves, up to a radius of 14 × area. At base move speed (62 units/s) it is big enough to release (radius 9) after about 0.4 s of running and full after about 0.75 s. A full ball deals the weapon's full damage, 35 at level 1. At max level the weapon's damage is 90 and its area 1.2, so a full ball deals 90 × 16.8 ÷ 14 = 108. It is a base weapon offered on level-up. At max level, with [Masher Grip](/passives/masher-grip) owned, a chest evolves it into [Mash Avalanche](/weapons/mash-avalanche) (see [Evolutions](/evolutions)).

## How it works

- **Release triggers.** The ball surges when Tibo stops for 4 ticks (about 0.07 s), when he turns more than 120° away from his recent heading, or once Tibo has kept moving with a full ball for 0.25 s × duration. A ball smaller than radius 9 is dropped without a surge.
- **Direction.** After a sharp turn the ball keeps going the way Tibo was running before the turn. After a stop or a full-ball release it goes along his smoothed recent heading.
- **The surge.** The ball starts from its spot behind Tibo, 8 + 6 × radius units back along his path. It rolls 70 + 9 × radius units at 220 units/s and hits each pest it touches. When it stops, it splatters everything within 2.5 × radius. Each pest is hit at most once per ball.
- **Damage scales with size.** Each ball deals damage × radius ÷ 14. A ball released at the minimum radius 9 deals about 64% of the weapon's damage. The size cap is 14 × area but the divisor stays at 14, so with area above 1 a full ball deals more than 100%. <small>[sim-eSpFSniv.js: `t.surgeLeft[d]=i.surgeBase+i.surgePerR*s,t.surgeR[d]=s,t.surgeDamage[d]=a.damage*s/i.maxR`]</small>
- Amount, cooldown, speed and pierce have no effect on this weapon. Duration only extends how long a full ball can roll before it releases on its own.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path): every hit at level 1 dealt 35, and every hit at level 8 dealt 108 (90 × 1.2), so each released ball was full size. All three seeds gave the same figures.

## Tips

- **Run straight, then turn by a crowd.** Run in straight lines, then stop or double back next to a crowd. A sharp turn launches the ball the way you were running, back across the ground you just covered.
- Area raises the ball's maximum size, and with it damage, roll distance, the width of its path and the splatter radius. Area bonuses work especially well with this weapon.
- Short movements that never reach radius 9 never release a ball. Constant small dodging can leave it doing nothing.
