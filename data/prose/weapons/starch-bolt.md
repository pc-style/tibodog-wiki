## Overview

Starch Bolt calls down small static strikes on random pests near Tibo. Every 2 seconds it picks 3 different enemies within 160 units of Tibo and blasts each one; the blast also hurts anything else standing within 12 units of the target. The weapon's raw amount is 2, but like every non-aura weapon it gets +1 from Tibo's base amount bonus (see [Stats](/stats)). <small>[sim-eSpFSniv.js: `i[r.amountBonus]=Math.floor(e.amount)+t.player.baseAmount`]</small> Levels add one strike at a time (7 at level 8), raise damage from 18 to 48 and widen each blast by half.

It is one of the 17 configured starting weapons of a standard run, with gear able to alter the starting choice. It is also offered on level-up and by [poteto's](/visitors#poteto) gift chest. <small>[sim-eSpFSniv.js: `e.cfg.player.startKit.length===0&&Rf(e,e.bigUpdate.gear?`]</small> At level 8 a chest evolves it into [Thunder Tuber](/weapons/thunder-tuber) if you own [Sprouting Eyes](/passives/sprouting-eyes). Thunder Tuber then unites with [Gratin Arc](/weapons/gratin-arc) into [Starch Supercell](/weapons/starch-supercell), freeing a weapon slot. See [Evolutions](/evolutions).

## How it works

- **Only fires with a target in range.** The weapon waits until some enemy is within 160 units of Tibo; until then it rechecks every 0.1 s instead of spending its cooldown. <small>[sim-eSpFSniv.js: ``case`chain`:case`strike`:return Ql(e,n,r,t.range)!==void 0``]</small>
- **Random, distinct targets.** Each strike picks a random enemy inside that circle and marks it so the same cast does not pick it twice. If there are fewer enemies in range than strikes, the extra strikes are lost. <small>[sim-eSpFSniv.js: `let o=$l(e,n.range,i);if(o===void 0)return;tu(e,o,i);let s=K(e,o),c=q(e,o);`]</small>
- **All strikes land at once.** Unlike projectile weapons, a strike weapon resolves its whole amount in a single cast, so the 0.1 s interval does not spread them out.
- **Blast size.** The blast radius is the `size` of 12 times area. Range is not scaled by area, so area makes each blast bigger but does not let the weapon reach further.
- Extra amount from [Sprouting Eyes](/passives/sprouting-eyes) and other sources adds strikes.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; 12 pests held on a ring 75 units from Tibo): at level 1 every 2 s exactly 3 pests were struck on the same tick, and at level 8 exactly 7, every 2 s, each for the weapon's full damage. All three seeds gave the same figures.

## Tips

- **Use it to thin crowds, not bosses.** Because targets are random, Starch Bolt is better at thinning a crowd than at focusing a boss. With a single enemy in range only one strike lands per cast.
- [Sprouting Eyes](/passives/sprouting-eyes) is worth picking early: it adds strikes now and is the catalyst you need for Thunder Tuber later.
