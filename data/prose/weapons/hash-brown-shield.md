## Overview

Hash Brown Shield is a defensive weapon. Hash browns circle close around Tibo, and each one takes up to 20 damage off a single hit or bullet. The hash brown then bursts into shards that hit every pest nearby. Broken hash browns grow back one at a time.

It is offered as a level-up card. At max level, with [Starch Plating](/passives/starch-plating) owned, a [chest](/chests) evolves it into [Hash Bulwark](/weapons/hash-bulwark): more hash browns that soak 30 damage, regrow faster, and freeze pests with their shards.

## How it works

- **Soak.** When a hit would hurt Tibo, one hash brown is used up and 20 is subtracted from the damage before armor. If the hit was 20 or less, it is cancelled entirely; a bigger hit goes through for the rest.<small>[sim-DEIZSebo.js: ``if(!(i.kind!==`guard`||r.active<1))return r.active--,r.counter++,Fr(e),i.soak``]</small> Invulnerability and a successful dodge are checked first, so they don't use up a hash brown. Damage from biome terrain and hazard pools skips the shield. See [Armor](/stats#armor) for how the rest of the hit is reduced.
- **Shards.** The used hash brown bursts where it was on its orbit, dealing the weapon's damage plus Tibo's thorns (times his damage multiplier) to every pest within 60 × Area units. The burst happens even when the soak blocked the whole hit. The [Thorny Jacket](/items/thorny-jacket) item adds thorns.
- **Count and regrowth.** The shield holds Amount hash browns. Tibo's built-in +1 amount (see [Stats](/stats#stat-conversion)) gives 2 at level 1 and 4 at level 8. While one or more are missing, one grows back every cooldown (3 s at level 1, 2 s at level 8). Once the shield is full, the timer waits.
- **Orbit.** The hash browns circle at 15 × √Area units from Tibo. Speed (2.4) is how fast they spin, and projectile speed bonuses raise it. They have no other attack: the shield only deals damage when Tibo is hit.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; clock warped 60 s, normal spawning, Tibo standing still for 60 s; the seeded starting weapon removed and the shield given with `give`; level-up cards answered with the first offer that is not an amount or cooldown bonus. Level 1 used seeds `s4`–`s6`, because in `s1` the shield itself was levelled to 4): at level 1 (and level 2, which has the same cooldown and amount) the shield held 2 hash browns and a used one grew back every 180 ticks (3 s); at level 8 it held 4 and regrew every 120 ticks (2 s).

## Tips

- **It is strongest against many small hits.** The shield is strongest against many small hits. Early pests and bullets often deal 20 or less, so each hash brown cancels a whole hit. Late hits get through for most of their damage.
- Starch Plating (armor) is the catalyst and also stacks well with it: the soak comes off first, then armor reduces what is left. Starch Plating is also the catalyst for [Cast Iron](/weapons/cast-iron).
