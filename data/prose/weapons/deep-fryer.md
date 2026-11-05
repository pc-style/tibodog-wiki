## Overview

Deep Fryer sprays hot oil in a narrow cone in front of Tibo. When a pest comes within range, it sprays for 0.9 s (before duration bonuses), hitting everything in the cone every 0.15 s for 6 damage per hit, then rests for its 2.4 s cooldown. The cone reaches 70 units and re-aims at the nearest pest on each hit, so it tracks targets while it sprays.

By level 8 it deals 21 per hit, sprays for 1.1 s, reaches 91 units (area 1.3) and rests 2.0 s. Deep Fryer is one of the possible starting weapons of a standard run (see [Level-up](/level-up)) and is also offered on level-up cards. At level 8, a chest opened while Tibo holds [Bacon Bits](/passives/bacon-bits) evolves it into [Inferno Basket](/weapons/inferno-basket).

## How it works

- **Trigger**: when the cooldown is ready, the spray starts only if a pest is within 1.3 × the cone's reach. <small>[sim-RltxC9X3.js: `Jo(e,i,a,1.3*o)!==void 0&&(t.active=b(Math.max(.2,r.duration))`]</small>
- **Cycle**: the cooldown starts only after the spray ends, so a full cycle is spray time plus cooldown. <small>[sim-RltxC9X3.js: `(e,t,n,r),t.active<=0&&(t.cd=b(r.cooldown))`]</small> The spray time is the weapon's duration times Tibo's duration stat (base +25%, see [Stats](/stats)), so at level 1 it is about 1.1 s, or 7 to 8 hits.
- **Aim and width**: on every hit the cone turns toward the nearest pest within range, then hits every pest within the reach whose direction is within half the cone `angle` plus 0.1 rad. For Deep Fryer that is 0.4 rad (about 23°) either side. <small>[sim-RltxC9X3.js: `Math.abs(Ge(t.angle,O(q(e,r)-a,K(e,r)-i)))<=c+.1&&Y(e,r)`]</small>
- **Amount does nothing**: cone weapons ignore the projectile-count bonus (see [Stats](/stats)).
- The cone has no pierce limit; every pest inside it is hit.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; one pest held 40 units to Tibo's right): at level 1 each spray hit the pest 8 times, 0.15 s apart, and a new spray began every 3.53 s (about 1.13 s of spray plus the 2.4 s cooldown); at level 8 each spray hit 10 times and the cycle was 3.38 s. All three seeds gave the same figures.

## Tips

- Area adds both reach and width of coverage, and duration lengthens every spray, so those stats help Deep Fryer more than projectile count.
- The short reach means it works best when pests are close. It pairs well with slows that keep them in the cone.
