## Overview

Hash Boomerang throws a crispy hash brown toward the nearest pest. It slows down, turns around and flies back along the same line. It passes through every pest in its path both ways, so one throw can hit a whole line of pests twice.

It is offered as a level-up card. At max level, with [Sour Cream](/passives/sour-cream) owned, a [chest](/chests) evolves it into [Hashnado](/weapons/hashnado), which throws more and harder-hitting hash browns.

## How it works

- **Aim.** The first hash brown in a volley flies at the nearest pest within 0.7 × the larger side of the play field. With no pest that close, it flies the way Tibo faces, so the weapon never holds its fire. Extra hash browns in the same volley follow 0.15 s apart, each turned up to about 0.5 radians (roughly 29°) to either side at random. Tibo's built-in +1 amount (see [Stats](/stats#stat-conversion)) gives 2 per volley at level 1 and 4 at level 8.
- **Return.** The hash brown is pushed back along its throw direction at a constant rate (360 units/s²), so it stops and comes back instead of homing on Tibo.<small>[sim-B7Rtlarz.js: `r.vx[t]=r.vx[t]-E(i)*a,r.vy[t]=r.vy[t]-x(i)*a`]</small> At level 1 (speed 190) it turns around about 0.53 s after the throw, roughly 50 units out, and is back at the throw point after about 1.06 s. It keeps flying past that point until its lifetime (Duration × Tibo's duration stat, 3.25 s with no bonuses) runs out. The return is tied to where it was thrown, not to where Tibo is now.
- **Speed.** Projectile speed bonuses scale the return push by the same factor, so the turnaround time stays the same and the reach grows with the speed bonus. The level-6 +40 speed raises reach to about 73 units.
- **Pierce.** Pierce 99 means unlimited. A hash brown can hit the same pest again after a short re-hit delay, which is how it hits pests once on the way out and again on the way back.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it threw 2 hash browns 0.15 s apart every 2 s, each spawned with a 3.25 s lifetime; no pest was hit twice by them within 0.5 s, and pests out to 60 units were hit. At level 8 it threw 4 every 1.8 s, and pests out to 80 units were hit. All three seeds gave the same figures.

## Tips

- **Fight crowds up close.** Its reach is short, so it hits hardest close to Tibo. Pests that crowd him get hit on both passes.
- Sour Cream raises crit damage, which only pays off with crit chance. [Hot Sauce](/passives/hot-sauce) is the passive that adds crit chance.
