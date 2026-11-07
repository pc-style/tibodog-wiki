## Overview

Moon Cleaver is the evolution of [Mezzaluna](/weapons/mezzaluna). Get Mezzaluna to level 8 while you own [Rotten Spud](/passives/rotten-spud), then open a [chest](/chests).

Every 1.15 s it chops 3 times (2 plus Tibo's built-in +1 amount, see [Stats](/stats)), 0.1 s apart: in front, behind, then in front again, one row lower. Each chop deals 120 damage to every pest in an 84 × 40 box (62 × 30 × its 1.35 Area). Like Mezzaluna it hits harder the more HP Tibo is missing, but with a bigger bonus: 0.8× at full HP, 1.7× at half HP, up to 2.6× near 0 HP. The rear chop also flicks 4 hash shreds backwards, each dealing 0.4× damage.

## How it works

- **Low-HP bonus.** The multiplier is `0.8 + (1.6 + 0.2) × missing HP fraction` (`lowHpBonus` 1.6). See [Stats](/stats) for the shared formula. <small>[sim-BEypEELT.js: `return 1-r+(t.hpEdge.lowHpBonus+r)*n`]</small>
- **Chop order.** Swings alternate sides, starting on the side Tibo faces (left or right). The third and fourth swings of a volley sit 10 units lower than the first two.
- **Shreds.** Only the rear chop flings (`fling.back`). The 4 shreds fan out over ±0.45 rad behind Tibo, fly at 170 units/s for 0.8 s × Duration and pierce everything. A pest can be hit by this weapon's shreds once per second (`rehit` 1), however many pass through it. <small>[sim-BEypEELT.js: `r===void 0||!0===r.back&&i===a||_T(e,t,n,r,(i>0?0:Math.PI)+.2*y(hT(e)))`]</small>

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 28 units to each side of Tibo): it chopped right, left and right, 0.1 s apart, every 1.15 s, for 96 (0.8 × 120, Tibo at full HP), and the rear chop flung 4 shreds with a 1 s lifetime. All three seeds gave the same figures.

## Tips

- **Face the larger group.** Two of the three chops face the way Tibo faces, so turn toward the larger group.
- Before Damage bonuses, the cleaver deals 96 per chop at full HP, 204 at half HP and 312 near 0 HP. Low-HP play pays off much more here than on the base Mezzaluna.
