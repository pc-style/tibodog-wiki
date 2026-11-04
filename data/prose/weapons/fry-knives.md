## Overview

Fry Knives fires sharp fries straight ahead in the direction Tibo is facing. It does not aim: every 0.9 s it throws its knives along Tibo's last movement direction, whether or not a pest is there. At level 1 it throws one knife for 8 damage that hits 2 pests; by level 8 it throws 7 knives per volley (0.07 s apart), each dealing 35 damage and hitting up to 4 pests.

Fry Knives has the highest offer weight of this group of weapons (100), so it shows up on level-up cards often, and it is one of the possible starting weapons of a standard run (see [Level-up](/level-up)). At level 8, a chest opened while Tibo holds [Salt Shaker](/passives/salt-shaker) evolves it into [Thousand Fries](/weapons/thousand-fries).

## How it works

- **Direction**: knives follow Tibo's facing, which is updated whenever he moves and kept when he stops. The first knife of a volley gets a random spread of ±`spread` (0.08 rad); later knives get twice that. <small>[sim-CrpXuTSY.js: `gp(e)+e.rng.range(-i.spread,i.spread)*(c>0?2:1)`]</small> Each knife also starts up to 4 units to the side of Tibo, so a volley forms a narrow stream.
- **Always fires**: facing-shot weapons do not wait for a target in range.
- **Pierce**: a knife with pierce N hits N + 1 pests.
- **Range**: with speed 260 and duration 1.2 s (times Tibo's duration stat, base +25%), a knife travels about 390 units before disappearing (see [Stats](/stats)).

## Tips

- Steer with movement. Walking toward a group, or turning to face it before stopping, points the knives at it.
- Pests coming from behind are not covered; pair Fry Knives with a weapon that hits around Tibo.
