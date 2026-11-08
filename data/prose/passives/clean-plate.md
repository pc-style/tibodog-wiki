## Overview

Clean Plate builds temporary crit points while Tibo avoids damage. It has **two passive levels**, each able to charge one tier worth 0.12 crit points. One tier charges after 5 seconds without a damaging hit; a second takes another 5 seconds. Taking damage sheds one charged tier and restarts the five-second timer; it does not permanently remove a passive level.

## How it works

- **Build one tier at a time.** At passive level 2, a fresh empty plate reaches one tier at 5 seconds and two at 10 seconds. With no other crit sources these give about 10.7% and 19.4% actual crit chance, not 12% and 24%. <small>[sim-wTU8O3Z8.js: `i<n.level&&e.tick-t.since>=S(r.seconds)&&(i+=1,t.since=e.tick)`]</small>
- **Use the shared crit curve.** Charged points join [Hot Sauce](/passives/hot-sauce), items and blessings before diminishing returns. Weapon-specific crit bonuses, such as [Gratin Arc's](/weapons/gratin-arc), are added afterwards. <small>[sim-wTU8O3Z8.js: `Lt(e.loadout.totals.critChance+t.critRaw,hi.critK)`]</small>
- **Avoid actual HP loss.** Invulnerable or rejected hits do not shed a tier. Positive damage does, including terrain/hazard damage; this differs from [Whip's](/dogs/whippet) normal-hit tug trigger. One hit at two charged tiers leaves one. Further damage at zero cannot make the bonus negative. <small>[sim-wTU8O3Z8.js: `e.moreVariety!==void 0&&d>0&&j().hurt(e)`]</small>

## Tips

- **Protect charged tiers, not just HP.** Dodges and shields can help preserve the bonus. The wording “a hit sheds one level” means a charged tier, not that you must buy the passive again.
