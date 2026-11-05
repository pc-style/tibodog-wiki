## Overview

Meteor Russet is the evolved form of [Heavy Russet](/items/heavy-russet). Hold Heavy Russet with [Masher Grip](/passives/masher-grip) at level 5, and the next [chest](/chests) you open turns every Heavy Russet copy (up to 5) into the same number of Meteor Russets.

Each of Tibo's weapon hits has a 3% chance to call down a meteor. The hit is held back for 0.4 s while the meteor falls, then lands on the original target at 20× damage. The impact also craters every enemy within 56 units of where the meteor was called, for 30× the triggering hit's damage (20× the hit × a 1.5 share). The crater radius grows with the square root of your area multiplier. <small>[sim-FslaxQ7g.js: `a=r*c.proc.mult*d.share,o=d.radius*Su(e)`]</small> The section Meteor impact below has the landing details.

## How it works

- Copies stack: with *N* copies the chance is `1 − 0.97^N`, and the limit is 3 × *N* meteors per second. That is much lower than Heavy Russet's 8 per copy: a build landing more than about 100 weapon hits per second per copy reaches it. Procs over the limit are skipped until the token bucket refills.
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added directly with `giveItem`, skipping the evolution; Peeler, Small Fry, Tot Toss, Chip Shuriken, Starch Chain and Seeker Sprouts each given 5 times with `give`; `warp(240)`; HP refilled every tick; Tibo walking a slow circle; later level-ups taking the first offer): over 180 s on seeds `s1`–`s5`, 3.04% of 21,996 rolls called a meteor with one copy (expected 3%), and 8.52% of 21,391 with three (expected 8.73%). With the chance set to 100% in the scenario (120 s, seeds `s1`–`s3`), one copy called 2.96–2.99 meteors per second and two copies 5.90–5.97.
- The delayed hit keeps the same rules as a bonk: the 20× applies before the crit roll, so it can crit.
- The crater is a separate hit. It can also crit, gets the elite/boss bonus, and knocks enemies back (scaled by your knockback stat).
- The crater lands where the meteor was called. If the original target is still standing there, it takes the 20× hit and is caught in the crater too.

## Tips

- Meteor Russet turns Heavy Russet's single-target hits into area damage, so it helps against crowds as well as bosses.
- Meteor damage is a multiple of the triggering hit, and the number of meteors is capped. That favours weapons with big individual hits over many small ones.
