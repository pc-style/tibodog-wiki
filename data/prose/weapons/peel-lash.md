## Overview

Peel Lash cracks a nearby pest with a long peel, then jumps to another pest. Its raw damage is 63, cooldown 1.6 s and Pierce 1. It evolves into [Rind Whip](/weapons/rind-whip) when you open a [chest](/chests) with Peel Lash at level 8 and [Salt Shaker](/passives/salt-shaker) owned at any level.

## How it works

Each lash starts at the nearest pest within 64 units of Tibo. Pierce counts **additional jumps**, not total targets: raw Pierce 1 allows the first target plus one jump. Each jump picks a nearby pest not yet hit by that lash, within 36 × √modified Area units of the previous target. More Amount adds separate lashes through the ordinary volley system. <small>[sim-PFuQo9mq.js: `gA(e,c,l,r.pierce===-1?60:Math.min(60,r.pierce),n.jump*Math.sqrt(r.area),s)`]</small>

The renderer uses a dedicated peel arc for Peel Lash and Rind Whip rather than the ordinary lightning arc. That is a visual distinction, not extra damage. <small>[scene--UmxPEyq.js: `` sprite:gR,names:[`arc-peel`] ``]</small>

This is a melee-tagged weapon, but it is excluded from melee-restricted new-weapon offers and melee starter fill. Ordinary offers, including Mech Pilot's unrestricted pool, can include it. See [Modes](/modes#new-melee-weapons-and-set-restrictions).

**Controlled checks:** original `main-CAVio-MR.js`, Standard/Normal, seeds `wiki`, `s1`, `s2`, granted level-1 weapon and fixed high-HP pests 25 units apart: one emitted lash hit two targets for the supplied weapon damage, without revisiting targets or reaching the distant control. Offer/start and chest checks use supplied kits and grants; they do not measure natural acquisition odds, DPS or survival.

## Tips

- **Keep pests close together** so a jump has a second target.
- **Pierce adds jumps; Amount adds lashes.** They solve different limits.
