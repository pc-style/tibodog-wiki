## Overview

Full Broadside evolves [Broadside](/weapons/broadside): reach level 8, own [Sour Cream](/passives/sour-cream) at any level, then open a [chest](/chests). It fires two staggered rows of shells from each side of Tibo. Each shell bursts at the first pest it meets after arming, or at the end of its flight, and sends out three smaller shells.

## How it works

- **Fire out of both sides.** Each Amount shot produces four main shells: two rows on each side, perpendicular to the direction Tibo faces. Raw Amount 2 plus Tibo's base +1 gives twelve main shells over a full volley, with a 0.06 s interval between Amount shots. <small>[sim-BOrXOAif.js: `Cb.side=-1,wb(e,t,n,r),Cb.side=1,wb(e,t,n,r)`]</small>
- **Land both rows together.** The rows reach 56 and 84 units. Their speeds are 190 and 285 before bonuses, giving the same roughly 0.295 s flight. They arm after 32 units, so a pest very close to the launch point does not trigger an immediate impact. The rows are staggered by half of the 22-unit gap along Tibo's facing direction. <small>[sim-BOrXOAif.js: `Cb.reach=n.range+o*a.reach,Cb.pace=Cb.reach/n.range`]</small>
- **Burst, then scatter three small shells.** A main shell has 68 base damage and a 20 × Area explosion radius. Its three children fan out at −38°, 0° and +38° from its travel direction, move 20 units over 0.2 s, then burst with an 11 × Area radius. Each child deals one quarter of the main damage (17 before bonuses) and half the knockback; children do not split again. <small>[sim-BOrXOAif.js: `o=n.angle[t]+(e-(r-1)/2)*n.burstFan[t]`]</small> <small>[start-rows-BB1nx1Jx.js: `count:3,fanDeg:38,reach:20,flight:.2,explodeRadius:11,damage:.25,knockback:.5`]</small>

**Measured** on original engines `main-chVaZCYa.js` → `main-BlAVw0Co.js`, Standard/Normal: level 7/8 and missing/owned Sour Cream controls evolve only on the new build with Broadside level 8 and the catalyst. Direct original-engine controls confirm four shells from the first Amount shot, 190/285 speeds, equal flight time, the range boundary, exactly three quarter-damage children and no recursive split. Sixty-second stepped combat uses seeds `s1/s2/s3` and the original optional rules; the existing Broadside's damage is unchanged in every seed. Equipment, shell clocks and HP refills are supplied fixtures, not natural evolution acquisition or representative DPS.

## Tips

- **Turn to aim the sides.** The shells leave perpendicular to Tibo's facing direction rather than at the nearest pest.
- **Leave room to arm.** This is a short-range side barrage, but its main shells must travel 32 units before detecting pests.
