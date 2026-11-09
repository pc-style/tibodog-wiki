## Overview

Kiko the Shiba calls two spirit pups whenever an elite or boss dies while Kiko is in the pack. Each pup lasts 6 seconds, hunts nearby targets and bites for 14 raw damage times Kiko's training power. Kiko has no passive aura and does not perform the zero-damage fallback bite shown in the raw definition.

## How it works

- **Look for elite and boss deaths.** Both death-processing branches call the spirit hook; ordinary pest deaths do not. It is not restricted to kills credited to Kiko. <small>[sim-BsDYg9eQ.js: `` e.run.bossesKilled++,e.bigUpdate.gear&&pu(e,`boss`),e.moreVariety!==void 0&&Ai().eliteDown(e) ``]</small>
- **Spirits are temporary attackers.** They start to either side of Tibo, move at 100 units/s towards targets within 150 units, and bite within 16 units. Bites repeat every 0.4 s; the second pup starts with a 0.15 s stagger. Spawn capacity can reduce the requested pair. <small>[sim-BsDYg9eQ.js: `e.tick>=i.plantIn[t]?(i.pool.kill(t),!0)`]</small>
- **Train for bite damage.** Training power multiplies the 14 base damage. The spirit hit is queued without Tibo's global damage multiplier; shared hit modifiers such as crits can still apply. The fallback eight-second bite interval is not a cooldown between elite-triggered summons.

## Tips

- **Use Kiko around elite waves and bosses.** Its help comes after a death, rather than on a fixed ordinary attack timer. It does not provide steady summons when no elite or boss is dying.
