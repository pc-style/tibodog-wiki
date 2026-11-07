## Overview

Hash Bulwark is the evolution of [Hash Brown Shield](/weapons/hash-brown-shield). You get it by opening a [chest](/chests) with a max-level Hash Brown Shield and [Starch Plating](/passives/starch-plating) at any level. It works like the shield: orbiting hash browns soak part of a hit on Tibo, then burst into shards. It has more hash browns, a bigger soak, faster regrowth and much stronger shards that also freeze pests.

## How it works

- **Soak.** Each hash brown takes 30 off one hit before armor (the shield takes 20). A hit of 30 or less is cancelled. As with the shield, invulnerability, dodge, terrain and hazard pools are handled before or outside it.
- **Count and regrowth.** Its own Amount of 3 plus Tibo's built-in +1 (see [Stats](/stats#stat-conversion)) gives 4 hash browns. A missing one grows back every 2 s before cooldown bonuses.
- **Shards.** A burst deals 240 damage plus Tibo's thorns (times his damage multiplier) to every pest within 86 × Area units (about 112 units at the base 1.3 area). Each pest hit is frozen for 0.8 s × Tibo's duration stat (1 s with no bonuses). Bosses are not frozen; the freeze is skipped for them.<small>[sim-LB46ZBLZ.js: ``case`freeze`:r||(e.freezeT[t]=Math.max(e.freezeT[t],n.seconds*i));return``]</small>
- **Orbit.** The hash browns circle at 17 × √Area units and spin at 2.8 (faster with projectile speed bonuses).

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; clock warped to 9:58 so the Great Wireworm boss spawns, then the boss held 40 units from Tibo for 30 s; the seeded starting weapon removed and Hash Bulwark given with `give`): the shield held 4 hash browns, its bursts froze 13 ordinary pests in each run, and the boss's freeze timer never left 0. All three seeds gave the same figures.

## Tips

- **Step away after each burst.** Each burst both damages and freezes the crowd that just hit Tibo, which gives him a moment to step away.
- Starch Plating stays useful after the evolution: armor reduces whatever damage gets past the 30 soak.
