## Overview

Frozen Fries shoots frozen fries at the nearest pest, freezing each pest it hits in place for 1 s. At level 1 it fires 2 fries (its raw amount of 1 plus Tibo's base +1 amount, see [Stats](/stats)), 0.12 s apart, every 1.6 s for 9 damage; each fry passes through one pest and hits a second. Levels add fries and pierce: by level 8 it fires 5 fries per volley (raw amount 4 plus 1) every 1.3 s, each dealing 21 damage and hitting up to 4 pests.

Frozen Fries is one of the possible starting weapons of a standard run (see [Level-up](/level-up)) and is also offered on level-up cards. At level 8, a chest opened while Tibo holds [Thick Skin](/passives/thick-skin) evolves it into [Permafrost Fries](/weapons/permafrost-fries).

## How it works

- **Targeting**: it fires only when a pest is within 0.7 × the larger side of the play field (224 units on the 320 × 320 field) and aims at the nearest one. <small>[sim-aJ7IG2rS.js: `function kO(e){return .7*Math.max(e.field.width,e.field.height)}`]</small>
- **Volley spread**: the first fry of a volley flies straight at the target; each later fry gets a random angle offset that grows with its place in the volley (up to ±0.08 rad × its index), so bigger volleys fan out. <small>[sim-aJ7IG2rS.js: `jO(e,kO(e))+e.rng.range(-.08,.08)*i`]</small>
- **Freeze**: a frozen pest stops moving. The freeze lasts 1 s times Tibo's duration stat, and a new freeze never shortens one already running. **Bosses cannot be frozen**: the freeze status is skipped for them. <small>[sim-aJ7IG2rS.js: ``case`freeze`:r||(e.freezeT[t]=Math.max(e.freezeT[t],n.seconds*i))``]</small>
- **Pierce**: a fry with pierce N hits N + 1 pests, as with other projectiles.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it fired 2 fries 0.12 s apart every 1.6 s and only the 2 nearest pests were ever hit; at level 8 it fired 5 fries every 1.3 s and only the 4 nearest pests were hit. Each hit set the pest's freeze timer to 1.25 s (1 s × the base duration stat). In a separate run with the clock warped to 9:58 so the 10:00 boss (Great Wireworm) spawns, and the boss held 40 units from Tibo, Frozen Fries hit the boss 6–7 times in 21 s and its freeze timer never left 0, while 24–27 ordinary pests were frozen. All three seeds gave the same figures.

## Tips

- **Use the freeze on crowds, not bosses.** The freeze is crowd control, not boss control. Against a [boss](/bosses) it is just a projectile.
- Pierce makes the freeze spread through a line of pests, which matters more than raw damage early on.
