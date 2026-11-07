## Overview

Big Fry is the evolution of [Small Fry](/weapons/small-fry). To get it, have Small Fry at level 8 and own [Fertilizer](/passives/fertilizer), then open a [chest](/chests). See [Evolutions](/evolutions).

Every 0.45 s it fires 4 fries (raw amount 3 plus Tibo's base +1, see [Stats](/stats)) at the nearest pest, 0.06 s apart. The fries pierce without limit. Like Small Fry, it gains damage from its kills, now +0.08 raw damage per kill up to +25. The fries also get bigger as the kill count rises, up to three times their starting size.

## How it works

- **Kills carry over.** Evolving swaps the weapon's definition and resets its ordinary level, but keeps its kill counter. A weapon that was limit-broken retains its breaks and uses the new shape at break level 8. <small>[sim-BUcaJmpn.js: `r.def=n,r.src=N(e,n.id,Ji(n.id)),r.level=1,r.raw=sf(n,1),la(r),r.cd=0`]</small> Without limit breaks, Big Fry's bonuses are worked out from the combined count. Example: a Small Fry that evolves at 240 kills becomes a Big Fry with 12 + 19.2 = 31.2 raw damage and fries 1.4× their base size.
- **Damage bonus.** The bonus is `min(25, 0.08 × kills)`, added before Tibo's damage multiplier. It is maxed at 313 kills, for 37 raw damage per fry.
- **Size bonus.** The fry's radius is multiplied by `min(3, 1 + kills / 600)`: double size at 600 kills, triple at 1200. <small>[sim-BUcaJmpn.js: `function dT(e,t){return Math.min(e.cap,t*e.perKill)}function fT(e,t){return!0===e.size?Math.min(3,1+t/600):1}`]</small>
- **Unlimited pierce and re-hits.** Weapons with 99 pierce get unlimited pierce, and pierce bonuses do not change that. <small>[sim-BUcaJmpn.js: `r.pierce=o.pierce>=99?-1:o.pierce+a.pierceBonus`]</small> In exchange, a pest can only be hit by this weapon once every 30 ticks (0.5 s). That timer is shared by all of Big Fry's fries. <small>[sim-BUcaJmpn.js: `i=8*H(n)+Math.max(0,e.projectiles.slot[t]);return!(e.tick-r.hitStamp[i]<e.projectiles.rehit[t]`]</small> If two fries reach the same pest within 0.5 s, only the first one damages it.
- **Aim.** It targets the same way as Small Fry: the nearest pest within 224 units, and it holds fire when none is in range.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it fired 4 fries every 0.45 s, each spawned with a 1.875 s lifetime; all 8 pests in the line were hit, and no pest was ever hit twice within 0.5 s (the shortest gap between two hits on one pest was 30 ticks). All three seeds gave the same figures.

## Tips

- **Use it on long lines of pests.** Against one tough target such as a [boss](/bosses), the shared re-hit timer caps Big Fry at 2 hits per second, however many fries it fires. Its strength is long lines of pests, where every fry passes through all of them.
- Kill bonuses carry over, so a Small Fry with many kills makes a stronger Big Fry from the start. The damage cap is reached long before the size cap.
