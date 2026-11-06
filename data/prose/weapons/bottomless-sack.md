## Overview

Bottomless Sack is the evolution of [Grab Bag](/weapons/grab-bag). You get it by opening a [chest](/chests) with a max-level Grab Bag and [Sprouting Eyes](/passives/sprouting-eyes) at any level. Like Grab Bag, it fires other weapons' attacks with its own stats. It makes two picks per shot instead of one, and it copies the **evolved** form of each weapon. For example, it copies [Gravy Flood](/weapons/gravy-flood) instead of [Gravy Boat](/weapons/gravy-boat), and [Hashnado](/weapons/hashnado) instead of [Hash Boomerang](/weapons/hash-boomerang). A weapon with no evolution is copied as it is.<small>[sim-6hUEdZJv.js: `wC(TC().map(e=>D.evolutionOf(e.id)??e))`]</small>

## How it works

- The copy pool is the same 28 base weapons as Grab Bag (see [Grab Bag](/weapons/grab-bag#how-it-works)), each swapped for its evolution. Each pick is uniformly random.
- Each volley fires Amount shots, 0.25 s apart, and each shot makes 2 picks. With the Sack's own Amount of 2 plus Tibo's built-in +1 (see [Stats](/stats#stat-conversion)), that is 3 shots and 6 random evolved attacks every 1.6 s before cooldown bonuses.
- Every copied attack uses the Sack's damage (20), area (1.2), speed (200), duration (2 s), pierce (2) and knockback. The evolved weapon supplies only the attack shape and its special parameters, such as Gravy Flood's growing, drifting pools.

## Tips

- Every pick counts as one more attack, so amount bonuses scale the Sack quickly: each extra Amount adds another two random attacks per volley.
