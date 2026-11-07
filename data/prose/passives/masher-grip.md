## Overview

Masher Grip makes hits push enemies farther. Each level adds 0.25 knockback, so the knockback multiplier goes from ×1.25 at level 1 to ×2.25 at level 5. It only affects hits that already have knockback. Heavy enemies resist the push, and some cannot be moved at all.

It is the catalyst for [Taproot Eruption](/weapons/taproot-eruption) (from [Root Spikes](/weapons/root-spikes)), [Mash Avalanche](/weapons/mash-avalanche) (from [Mash Snowball](/weapons/mash-snowball)) and [Tater Minigun](/weapons/tater-minigun) (from [Locked Gatling](/weapons/locked-gatling)). At level 5 it also evolves [Heavy Russet](/items/heavy-russet) into [Meteor Russet](/items/meteor-russet).

## How it works

The push from a hit is the hit's knockback × Tibo's knockback multiplier × (1 − the enemy's mass) × 70.<small>[sim-BEjq2fOA.js: `d=o*e.loadout.stats.knockbackMult*(1-s)*70`]</small> Hits with no knockback push nothing, and enemies with mass 1 or more are never pushed. Mass is on each enemy's page: most small pests have 0, [Mud Golem](/enemies/mud-golem) has 0.8 and [Hay Bale](/enemies/hay-bale) has 1.

Masher Grip is the only source of the knockback stat.

## Tips

- **Use it to keep light pests away.** Knockback is defensive: pests pushed away take longer to reach Tibo. The effect is largest on light pests, which have little or no mass.
- Meteor Russet's crater hit carries knockback 1.2, so Masher Grip also pushes pests away from where a meteor lands.<small>[sim-BEjq2fOA.js: `J(e,n.crater[t],n.itemSrc[t],-1,1.2)`]</small>
