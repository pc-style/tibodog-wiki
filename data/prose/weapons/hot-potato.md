## Overview

Hot Potato throws homing potatoes that bounce from pest to pest and explode on the last one. Every 2.6 s it throws a volley; with Tibo's built-in +1 amount bonus (see [Stats](/stats)) that is 2 potatoes at level 1, 0.3 s apart, and 4 at level 8. Each potato hits up to *pierce + 1* pests (4 at level 1, 8 at level 8), then blows up for 2.5× its damage in a 30-unit radius (scaled by Area).

It is offered as a level-up card. At level 8, with [Hot Sauce](/passives/hot-sauce) at any level, the next [chest](/chests) evolves it into [Spicy Hot Potato](/weapons/spicy-hot-potato), whose blast throws two fresh potatoes.

## How it works

- **Launch.** Potatoes leave Tibo roughly in the direction he faces (up to ±1.2 rad off) and steer toward a target at up to 7 rad/s. With no target they look for the nearest pest within 200 units that they have not hit yet.
- **Hops.** On each hit the potato deals its normal damage, uses up one point of pierce and turns toward the nearest pest within 90 units (`hopRange`) that it has not hit before. Each hop also tops its remaining flight time up to at least 1.2 s. <small>[sim-BUcaJmpn.js: `r.pierce[t]=i-1,jw(r,t),r.life[t]=Math.max(r.life[t],1.2)`]</small>
- **Blast.** When a potato hits with no pierce left, it explodes: every pest within `fuse.radius` × Area takes `fuse.blast` × damage (2.5×). The last pest takes both the hit and the blast.
- **Fizzling out.** A potato that runs out of flight time (3 s × Duration) also explodes where it is, so the blast is never lost. <small>[sim-BUcaJmpn.js: `n.fuseBlast[r]>0&&kw(e,r,-1)`]</small>
- Pierce bonuses from items and passives add hops, because the hop count is the potato's pierce. The hop range is not scaled by Area.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 40 to 110 units to Tibo's right): at level 1 it threw 2 potatoes 0.3 s apart every 2.6 s, each spawned with a 3.75 s lifetime and pierce 3; at level 8 it threw 4 every 2.3 s with pierce 7. All three seeds gave the same figures.

## Tips

- **Upgrade it for more pests per volley.** Level 3 and level 7 each add a potato, and four levels add pierce, so most upgrades raise the number of pests each volley touches.
- Hops need pests within 90 units of each other, so Hot Potato does its best work in packed crowds. Against a lone target, the potato hits once and then flies on until it finds another pest or its timer runs out.
