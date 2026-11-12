## Overview

Mash Crater evolves [Mash Mallet](/weapons/mash-mallet) with [Masher Grip](/passives/masher-grip). Open a [chest](/chests) with the mallet at level 8 and the passive owned at any level. The game calls this weapon `crater-pound` internally; Mash Crater is its displayed name.

Its raw definition has 36 damage, a 1.6 s cooldown, Amount 2 and Area 1.2. It trades the levelled mallet's individual-hit damage for a different set of strike parameters; “evolved” does not mean every raw number rises.

## How it works

Mash Crater uses the same targeting and impact consumer as Mash Mallet, with a 72-unit initial search and radius 20 × modified Area. At its raw Area 1.2 that is radius 24 before Tibo's Area bonuses. Each pound selects a different primary target within reach; nearby pests can also be caught in the impact. Raw Amount 2 becomes 3 with Tibo's ordinary +1, rather than a fixed two-hit cap. <small>[sim-BGF0Y8Y5.js: `let i=Fu(e),a=n.size*r.area;for(let o=0;o<r.amount;o++){let o=fO(e,t,n.range,i);if(o===void 0)return;Pu(e,o,i)`]</small>

**Controlled checks:** original `main-CAVio-MR.js`, Standard/Normal, seeds `wiki`, `s1`, `s2`, granted weapon, fixed separated high-HP pests and supplied Amount 1/2: one/two primary targets were hit, with the out-of-range control untouched. Chest controls evolved level-8 Mash Mallet with Masher Grip, but not level 7 or a missing catalyst. These are forced-state consumer and recipe checks, not natural acquisition, practical DPS or survival measurements.

## Tips

- **Use Area for a wider impact**, not as a promise of a longer initial target search.
- **Keep more than one pest within reach** to make use of additional pounds.
