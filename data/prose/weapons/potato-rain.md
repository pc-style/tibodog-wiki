## Overview

Potato Rain drops potatoes at random spots around Tibo. Every 5 seconds it calls a shower of 6 potatoes, 7 with Tibo's base +1 amount bonus (see [Stats](/stats)). Each potato lands after a short delay and deals 24 damage to every pest within its 18-unit blast, knocking them away from the impact. It does not aim, so it fires even when no pests are nearby.

You get it from a level-up card. At level 8 it drops 14 potatoes for 54 damage every 4.1 seconds. With a max-level Potato Rain and [Golden Fry](/passives/golden-fry), a chest can evolve it into [Golden Harvest](/weapons/golden-harvest).

## How it works

- **Where potatoes land.** Each potato picks a random point in a disc of radius `spread` (110 units) around Tibo, spread evenly over the disc's area. Area bonuses enlarge each blast (`size` × area) but only widen the disc once area goes above 1.25, because the spread is multiplied by `max(1, 0.8 × area)`. <small>[sim-HQr6OS1G.js: `c=Math.sqrt(e.rng.next())*n.spread*Math.max(1,.8*r.area)`]</small>
- **When they land.** The whole shower is placed at once. Each potato waits `delay` (0.45 s) plus a random extra time of up to the weapon's duration, so the shower lands over a window instead of all at once. Duration bonuses make that window longer but do not add damage. With Tibo's base +25% duration, the 2 s duration becomes a 2.5 s window. <small>[sim-HQr6OS1G.js: `let d=n.delay+e.rng.next()*r.duration`]</small>
- The landing spots are fixed when the shower is called and do not follow Tibo, so the potatoes stay where he was standing.
- Amount bonuses from [GPU](/passives/gpu) and [Sprouting Eyes](/passives/sprouting-eyes) each add another potato.

## Tips

- Potatoes fall around where Tibo was standing when the shower was called. It works best when pests are closing in on you, and you should not expect it to hit pests that are chasing you from far behind.
- The spread does not grow with [Big Bowl](/passives/big-bowl) until area is above 1.25, so early area bonuses mostly make each potato's blast bigger rather than covering more ground.
