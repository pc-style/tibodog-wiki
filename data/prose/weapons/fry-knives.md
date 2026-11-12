## Overview

Fry Knives fires sharp fries straight ahead in the direction Tibo is facing. It does not aim: every 0.9 s it throws its knives along Tibo's last movement direction, whether or not a pest is there. At level 1 it throws 2 knives (its raw amount of 1 plus Tibo's base +1 amount, see [Stats](/stats)), 0.07 s apart, for 8 damage each, and each knife hits 2 pests; by level 8 it throws 8 knives per volley (raw amount 7 plus 1), each dealing 35 damage and hitting up to 4 pests.

Fry Knives has a base offer weight of 100, shared with [Tater Mines](/weapons/tater-mines) and below [Potato Rain](/weapons/potato-rain)'s 130, and it is one of the possible starting weapons of a standard run (see [Level-up](/level-up)). At level 8, a chest opened while Tibo holds [Salt Shaker](/passives/salt-shaker) evolves it into [Thousand Fries](/weapons/thousand-fries).

## How it works

- **Direction**: knives follow Tibo's facing, which is updated whenever he moves and kept when he stops. The first knife of a volley gets a random spread of ±`spread` (0.08 rad); later knives get twice that. <small>[sim-Bt1MrMd3.js: `HA(e)+e.rng.range(-n.spread,n.spread)*(i>0?2:1)`]</small> Each knife also starts up to 4 units to the side of Tibo, so a volley forms a narrow stream.
- **Always fires**: facing-shot weapons do not wait for a target in range.
- **Pierce**: a knife with pierce N hits N + 1 pests.
- **Range**: with speed 260 and duration 1.2 s (times Tibo's duration stat, base +25%), a knife travels about 390 units before disappearing (see [Stats](/stats)).

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it threw 2 knives about 0.07 s apart every 0.9 s, each spawned with a 1.5 s lifetime, and the hits landed on the 2 nearest pests (one stray hit on the third in one seed, from a knife that missed the second); at level 8 it threw 8 knives every 0.9 s and the 4 nearest pests took the hits. All three seeds gave the same figures.

## Tips

- **Face a group to aim the knives.** Steer with movement. Walking toward a group, or turning to face it before stopping, points the knives at it.
- Pests coming from behind are not covered; pair Fry Knives with a weapon that hits around Tibo.
