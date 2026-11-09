## Overview

Gravy Boat pours pools of scalding gravy under nearby pests. A pool stays on the ground for a few seconds and keeps hurting every pest standing in it, so it suits crowds that walk into Tibo.

In Standard runs it is one of the weapons Tibo can start with: when no starting kit is set, the run picks one from the game's `player.startWeapons` list using the run seed. Otherwise it is offered as a level-up card. At max level, with [Potato Magnet](/passives/potato-magnet) owned, a [chest](/chests) evolves it into [Gravy Flood](/weapons/gravy-flood). Gravy Flood's pools are bigger, grow over time and drift after Tibo.

## How it works

- **Targeting.** The boat fires only when a pest is within 100 units of Tibo.<small>[sim-BtJ1ZXuM.js: `return t.trail===void 0?Ql(e,n,r,t.range)!==void 0:e.player.moving[e.me]===1`]</small> Each pool is centred on a random pest in that range, so pools land in the crowd around Tibo, not on far targets.
- **Pools.** A pool has a radius of 22 × Area units and lasts Duration × Tibo's duration stat. With no bonuses, that is 3.125 s at level 1, because the duration stat includes a base +25%. Every 0.4 s it deals 9.5 damage at level 1, or 19.5 at level 8, to every pest inside it. It casts every 3.4 s before cooldown bonuses. Gravy has no knockback, so pests are not pushed out of the pool.
- **Amount.** Each cast pours Amount pools, 0.1 s apart. Each pool picks its own random target, so two pools can land on the same pest. Tibo's built-in +1 amount (see [Stats](/stats#stat-conversion)) gives 2 pools per cast at level 1 and 5 at level 8.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it poured 2 pools 0.1 s apart every 4 s, each with radius 22, a 3.125 s lifetime and a 0.4 s tick; at level 8 it poured 5 pools with radius 30.8 and a 4.375 s lifetime. All three seeds gave the same figures.

## Tips

- **Keep it for close defence.** Because the range is short, the boat is a close-defence weapon. It does nothing while Tibo is clear of pests, and it starts its cooldown only once it has actually fired.
- Area raises the pool radius directly, so [Big Bowl](/passives/big-bowl) makes each pool cover more of the crowd.
