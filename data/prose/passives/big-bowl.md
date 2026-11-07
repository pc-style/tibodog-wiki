## Overview

Big Bowl makes Tibo's attacks bigger. Each level adds 0.1 area, so the area multiplier goes from ×1.1 at level 1 to ×1.5 at level 5. Area is not capped and has no diminishing returns (see [Stats](/stats)).

It is the catalyst for [Mashquake](/weapons/mashquake) (from [Mash Wave](/weapons/mash-wave)), [Stand Mixer](/weapons/stand-mixer) (from [Whisk Vortex](/weapons/whisk-vortex)) and [Eclipse Scythe](/weapons/eclipse-scythe) (from [Comet Scythe](/weapons/comet-scythe)). Any Big Bowl level qualifies for those weapon recipes. At level 5 it also evolves the item [Spicy Croquette](/items/spicy-croquette) into [Magma Croquette](/items/magma-croquette).

## How it works

Each weapon's area is its own area times the area multiplier. Most attacks then use that value directly, for example a ground pool's radius is its size times area. Some effects use the square root instead, so they grow more slowly:

- Comet Scythe and Eclipse Scythe multiply their changing orbit radius by √area.<small>[sim-aJ7IG2rS.js: `function tx(e,t,n,r){return e.orbitRadius*Math.sqrt(t.area)*ex(e,n,r)}`]</small> At level 5 the orbit is about 22% wider, not 50%.
- Item blasts and chains scale by √(area multiplier).<small>[sim-aJ7IG2rS.js: `return Math.sqrt(e.loadout.stats.areaMult)`]</small>

Other area sources are [Wide Ladle](/items/wide-ladle) (+0.06), [Philosopher's Potato](/items/philosophers-potato) (+0.1) and [Spud Shrine](/points-of-interest#spud-shrine) blessings. All sources are added together before the multiplier is applied.

## Tips

- **Max it to evolve Spicy Croquette.** Magma Croquette needs Big Bowl at level 5 and a Spicy Croquette in hand when you open a chest (see [Evolutions](/evolutions#item-evolutions)).
- Area helps most with pools, novas and other attacks that hit everything in a zone. It does less for single-target shots.
