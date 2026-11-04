## Overview

Salt Line leaves a trail of salt behind Tibo while he walks. Every 0.2 s of movement it drops a salt patch with a radius of 9 units just behind him. Each patch lasts 2 s, or 2.5 s with Tibo's base +25% duration (see [Stats](/stats)). Pests on the salt take 8 damage every 0.3 s and are slowed by 45% for 1 s (1.25 s with the base duration bonus). Bosses are slowed too.

You get it from a level-up card. At level 8 it deals 24 damage per tick, patches last 3 s before duration bonuses and the patch radius is about 12.6 units (area 1.4). With a max-level Salt Line and [Spud Sneakers](/passives/spud-sneakers), a chest can evolve it into [Salt Flats](/weapons/salt-flats).

## How it works

- **Only while moving.** It drops patches only while Tibo is moving. Standing still stops new salt, though patches already on the ground keep working until they expire. <small>[sim-CrpXuTSY.js: `return t.trail===void 0?Zi(e,n,r,t.range)!==void 0:e.player.moving[e.me]===1`]</small>
- **Patches do not stack.** Patches overlap, but a pest can take damage from this trail at most once per `hitInterval` (0.3 s), however many patches it stands on. Standing in thick salt is no worse than standing in one patch. <small>[sim-CrpXuTSY.js: `s.rehit[i]=n.trail===void 0?0:u(n.hitInterval)`]</small>
- **Slow.** `factor` 0.45 means a slowed pest moves at 55% speed. Duration bonuses lengthen both the patches and the slow.
- The trail has no knockback. Amount bonuses do not add extra trails.

## Tips

- Salt Line hits pests that follow Tibo's path. Walking in loops or circling a group drags pests across the salt again and again.
- A faster Tibo spreads the patches further apart and leaves a longer trail. [Spud Sneakers](/passives/spud-sneakers) adds move speed and is also the evolution catalyst.
