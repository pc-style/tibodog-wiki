## Overview

Potato Battery clips a live wire from Tibo to a nearby pest. Every 0.25 s the wire zaps every pest touching it, including the clipped one, for 7 damage and slows them by 50% for 0.3 s × Duration. The clipped pest is almost pinned in place (−85% speed) and cannot drop below 1 HP while the wire holds. When the wire lets go, it bursts for 8× damage around the clipped pest, which usually finishes it off.

Its listed amount is 0, so it clips 1 wire at level 1 (Tibo's built-in +1 amount, see [Stats](/stats)) and 2 from level 5. It is offered as a level-up card. At level 8, with [Root Network](/passives/root-network) at any level, the next [chest](/chests) evolves it into [Spud Grid](/weapons/spud-grid).

## How it works

- **Target choice.** Within 110 units, the battery clips the nearest pest that is at least 50 units away (`minRange`) and not already clipped. If every pest is closer than that, it takes the farthest one in range. It does not clip bosses. <small>[sim-DN19mlsQ.js: `g>=o&&g<c&&(c=g,s=a),g>u&&(u=g,l=a)`]</small>
- **The wire** is a line from Tibo to the clipped pest, `size` × Area wide (8 at level 1). It follows both of them as they move.
- **Letting go.** The wire lasts `duration` seconds (3 s, × Duration) or snaps as soon as the clipped pest is more than 170 units from Tibo. Either way it discharges `discharge` × damage (56 at level 1) to every pest within 18 units of the clipped pest. <small>[sim-DN19mlsQ.js: `if(n.life[o]=u,u<=0||E(c-r,l-i)>n.snap[o]){n.pool.kill(o),$w(e,o);continue}`]</small>
- **HP floor.** Any hit that would bring a clipped pest below 1 HP leaves it at 1 HP. Bosses are exempt. <small>[sim-DN19mlsQ.js: `!i&&(s&v.Reset)===0&&Af(e,n))&&(y=1)`]</small>
- **Cooldown.** The 2 s cooldown only starts counting once all of this weapon's wires are gone. A full cycle is wire time plus cooldown, about 5.75 s at level 1 with the base Duration bonus. <small>[sim-DN19mlsQ.js: `n.pool.isAlive(i)&&n.slot[i]===t&&r++}return r})(e,t.slot)>0||(t.cd=Bv(e,t.cd)`]</small> With no pest in range it checks again every 0.1 s.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 60 to 90 units from Tibo): at level 1 one wire lasted 5 s (4 s plus the base +25% duration) and a new one clipped 7.5 s after the previous, zapping every 0.25 s for 5 and bursting for 25 on release; from level 5 two wires clipped at once. All three seeds gave the same figures.

## Tips

- **Make pests walk across the wire.** The pinned pest stops where it is clipped, at least 50 units away when possible. Moving so that other pests walk across the wire gets more out of each zap.
- Running far away snaps the wire early (past 170 units). That discharges sooner but cuts the zapping short.
- Other weapons can wear the clipped pest down to 1 HP, and the discharge then finishes it when the wire lets go.
