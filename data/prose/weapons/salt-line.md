## Overview

Salt Line leaves a trail of salt behind Tibo while he walks. Every 0.2 s of movement it drops 2 salt patches 0.1 s apart (its raw amount of 1 plus Tibo's base +1 amount, see [Stats](/stats)), so a walking Tibo leaves a patch with a radius of 9 units just behind him every 0.1 s. Each patch lasts 2 s, or 2.5 s with Tibo's base +25% duration (see [Stats](/stats)). Pests on the salt take 14 damage every 0.3 s and are slowed by 45% for 1 s (1.25 s with the base duration bonus). Bosses are slowed too.

You get it from a level-up card. At level 8 it deals 40 damage per tick, patches last 3 s before duration bonuses and the patch radius is about 12.6 units (area 1.4). With a max-level Salt Line and [Spud Sneakers](/passives/spud-sneakers), a chest can evolve it into [Salt Flats](/weapons/salt-flats).

## How it works

- **Only while moving.** It drops patches only while Tibo is moving. Standing still stops new salt, though patches already on the ground keep working until they expire. <small>[sim-Cn6iREtF.js: `return t.trail===void 0?Cl(e,n,r,t.range)!==void 0:e.player.moving[e.me]===1`]</small>
- **Patches do not stack.** Patches overlap, but a pest can take damage from this trail at most once per `hitInterval` (0.3 s), however many patches it stands on. Standing in thick salt is no worse than standing in one patch. <small>[sim-Cn6iREtF.js: `o.rehit[i]=n.trail===void 0?0:Be(n.hitInterval)`]</small>
- **Slow.** `factor` 0.45 means a slowed pest moves at 55% speed. Duration bonuses lengthen both the patches and the slow.
- The trail has no knockback. Amount adds patches to each drop, which makes the single trail denser; because of the shared hit timer that adds no damage.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path): at level 1 a new patch appeared every 6 ticks (0.1 s), each with radius 9 and a 2.5 s lifetime, and a pest on the trail was hit every 0.3 s (18 ticks) for 8; at level 8 the patches had radius 12.6 and a 3.75 s lifetime and hit for 24. All three seeds gave the same figures.

## Tips

- **Walk loops to drag pests over salt.** Salt Line hits pests that follow Tibo's path. Walking in loops or circling a group drags pests across the salt again and again.
- A faster Tibo spreads the patches further apart and leaves a longer trail. [Spud Sneakers](/passives/spud-sneakers) adds move speed and is also the evolution catalyst.
