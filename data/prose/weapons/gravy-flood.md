## Overview

Gravy Flood is the evolution of [Gravy Boat](/weapons/gravy-boat). You get it by opening a [chest](/chests) with a max-level Gravy Boat and [Potato Magnet](/passives/potato-magnet) at any level. It pours more and larger gravy pools, picks targets from a wider range, and its pools grow and slowly slide after Tibo instead of staying where they landed.

## How it works

- **Casting.** The flood fires when a pest is within 150 units (Gravy Boat: 100). It drops each pool on a random pest in that range. Its own Amount of 4 plus Tibo's built-in +1 (see [Stats](/stats#stat-conversion)) gives 5 pools per cast, 0.1 s apart, every 3 s before cooldown bonuses.
- **Pools.** A pool starts with a radius of 22 × Area (35 units at the base 1.6 area) and deals 21 base damage to every pest inside it every 0.35 s. With no bonuses, it lasts 4 s × 1.25 = 5 s.
- **Grow and follow.** While a pool lives, its radius grows by 5 units per second, and it moves toward Tibo at 18 units per second.<small>[sim-BsNpoIrY.js: `r.x[t]=r.x[t]+a/s*i*n,r.y[t]=r.y[t]+o/s*i*n`]</small><small>[sim-BsNpoIrY.js: `let a=r.grow[t];if(a<=0)return;let o=a*n*10;r.radius[t]=r.radius[t]+o`]</small> Area bonuses scale the starting size, but the growth rate is fixed, so a 5 s pool ends about 25 units wider than it started.

Gravy Flood and [Stand Mixer](/weapons/stand-mixer) can unite into [Gravy Whirlpool](/weapons/gravy-whirlpool), freeing a weapon slot.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it poured 5 pools 0.1 s apart every 3 s, each starting at radius 35.3 with a 5 s lifetime and a 0.35 s tick. All three seeds gave the same figures.

## Tips

- **Circle a spot to pool the gravy.** Tibo's base move speed is 62, so the pools trail well behind him when he runs. If you circle around a spot, the pools gather under him and the pests chasing him.
