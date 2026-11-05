## Overview

Slow Cooker makes weapon effects last longer. Each level adds 0.1 duration. Tibo already has a hidden +25% base duration, so the duration multiplier goes from ×1.25 without Slow Cooker to ×1.35 at level 1 and ×1.75 at level 5. Compared with no Slow Cooker, that is 8% longer at level 1 and 40% longer at level 5.

It is the catalyst for [Cold Storage](/weapons/cold-storage) (from [Root Cellar](/weapons/root-cellar)) and [Eternal Sprouts](/weapons/eternal-sprouts) (from [Sprout Satellites](/weapons/sprout-satellites)). At level 5 it also evolves [Freezer Burn](/items/freezer-burn) into [Glacier Spud](/items/glacier-spud).

## How it works

The duration multiplier is `max(0.2, 1 + total + 0.25)`.<small>[sim-qQloWRmx.js: `i[r.durationMult]=Math.max(.2,1+e.duration+t.player.baseDuration)`]</small> Each weapon's duration is multiplied by it, which lengthens pools, orbits and other timed attacks. It also lengthens freeze, slow and burn effects, including burns and freezes from items.<small>[sim-qQloWRmx.js: `ju.seconds=r*e.loadout.stats.durationMult`]</small>

Other duration sources are [Time Tuber](/items/time-tuber) (+0.15), [Philosopher's Potato](/items/philosophers-potato) (+0.1) and [Spud Shrine](/points-of-interest#spud-shrine) blessings.

## Tips

- Duration is most useful for weapons whose effect lasts a set time, such as ground pools and orbits, and for freezing or burning builds.
- Because of the hidden base, the in-game “+10% weapon duration per level” is 10 points on top of 125%, not 10% of the current total.
