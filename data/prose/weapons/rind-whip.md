## Overview

Rind Whip evolves [Peel Lash](/weapons/peel-lash) with [Salt Shaker](/passives/salt-shaker). Open a [chest](/chests) with Peel Lash at level 8 and Salt Shaker at any level.

It starts at 18 raw damage, a 1.2 s cooldown, Pierce 3 and Area 1.15. Its lower individual-hit damage is not a typo: the evolved definition has a faster cooldown, longer reach and more jumps than the base weapon's starting definition.

## How it works

The first target must be within 72 units of Tibo. Each lash then jumps up to three times at raw Pierce 3, so it can hit four different pests. Each jump reaches 44 × √modified Area units from the previous target; it does not repeatedly hit the same pest in one chain. Extra Pierce adds jumps, capped at 60, and extra Amount adds separate lashes. <small>[sim-DvRnAb2l.js: `ZA(e,c,l,r.pierce===-1?60:Math.min(60,r.pierce),n.jump*Math.sqrt(r.area),s)`]</small>

Like Peel Lash, Rind Whip uses the dedicated peel-arc renderer. <small>[scene-DRlZFh1d.js: `` sprite:dR,names:[`arc-peel`] ``]</small>

**Controlled checks:** original `main-CAVio-MR.js`, Standard/Normal, seeds `wiki`, `s1`, `s2`, granted weapon and fixed high-HP pests 25 units apart: one emitted lash hit four targets at the supplied damage and left the distant control untouched. Ready level-8/catalyst chest fixtures evolved Peel Lash; level-7 and missing-catalyst controls did not. These are forced-state consumer/recipe checks, not natural acquisition, practical DPS or survival measurements.

## Tips

- **Aim for a chain of nearby pests.** The first target needs to be close to Tibo; later targets need to be close to the previous one.
- **Compare crowd coverage, not just raw damage**, when deciding when to evolve.
