## Overview

Heavy Russet is a Legendary item that occasionally makes a weapon hit BONK. Each of Tibo's weapon hits has a 2% chance to deal 15× its damage, shown with a shockwave and shards. You can hold up to 5 copies, and each one raises the chance: `1 − 0.98^N` gives 2% with one, 3.9% with two and 9.6% with five.

Legendary items share the smallest rarity weight, and Heavy Russet has weight 1 out of 4 among them, about 0.5% of item rolls at luck 0. With [Masher Grip](/passives/masher-grip) at level 5, the next chest turns every copy into [Meteor Russet](/items/meteor-russet).

## How it works

- The bonk multiplies the hit after the elite/boss bonus and before the crit roll, so a bonk can also crit for 15 × 2 = 30× or more. <small>[sim-DECyKN4u.js: `u*=i}let l=o.critChance+a.critBonus[r]`]</small>
- Only weapon hits can bonk. Dog bites, burn ticks and item blasts cannot.
- The limit is 8 bonks per second per copy. At a 2% chance that only matters for very fast-hitting builds.
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added with `giveItem`; Peeler, Small Fry, Tot Toss, Chip Shuriken, Starch Chain and Seeker Sprouts each given 5 times with `give`; `warp(240)`; HP refilled every tick; Tibo walking a slow circle; later level-ups taking the first offer): over 180 s on seeds `s1`–`s5`, 1.97% of 24,931 rolls bonked with one copy (expected 2%), and 5.83% of 23,657 with three (expected 5.88%). With the chance set to 100% in the scenario (120 s, seeds `s1`–`s3`), one copy bonked 7.80–7.89 times per second and two copies 15.37–15.52.
- On average, one copy adds about 28% to weapon hit damage (2% × 14 extra), and five copies about 134%. Actual results are swingy, because the damage comes in rare big hits and anything beyond the target's remaining HP is wasted.

## Tips

- **It is best against elites and bosses.** Because the bonus comes in rare large hits, it is best against high-HP targets such as elites and bosses, where the full 15× counts.
- The [Microwave](/points-of-interest#microwave) can copy a held Heavy Russet, melting a copy of another Legendary item you hold, until you reach the 5-copy cap. Copies carry over when it evolves.
