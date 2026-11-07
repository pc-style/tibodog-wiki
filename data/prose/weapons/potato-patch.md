## Overview

Potato Patch is the evolution of [Seed Potato](/weapons/seed-potato). A chest evolves Seed Potato into it once Seed Potato is at max level and Tibo owns [Fertilizer](/passives/fertilizer) (see [Evolutions](/evolutions)). It works the same way: Tibo throws seed potatoes near pests, the plants grow through three stages and zap around them, and walking over a plant harvests a burst.

The evolution raises the weapon's damage from 72 at max level to 123, and lets Tibo keep three plants out instead of one. Extra amount raises the plant count further, to at most 6. Area stays at 1.2. At 123 damage a stage 3 harvest bursts for 492 in a radius of about 65 units before stat bonuses.

## How it works

Throwing, growing, zaps, harvests and the 8 s self-burst follow the rules on [Seed Potato](/weapons/seed-potato#how-it-works). The plant limit is 3 plus Tibo's amount bonuses from passives and items (the base +1 amount does not count), capped at 6. <small>[sim-BY3r5cDe.js: `s=Math.min(n.maxPlants,6,Math.max(1,t.raw.amount)+o)`]</small> The in-game text says Tibo “tosses three fertilized seed potatoes at a time”. In the code he still throws one seed at a time, at least 0.25 s apart, until three plants are out.

When Seed Potato evolves, any of its plants still in the ground are recalled to Tibo's hand.

Own Potato Patch and [Spark Corral](/weapons/spark-corral), then open a chest to unite them into [Starch Garden](/weapons/starch-garden), freeing a weapon slot.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): zaps dealt 36.9, 73.8 and 110.7, that is 0.3, 0.6 and 0.9 × 123 for stages 1 to 3. All three seeds gave the same figures.

## Tips

- **Toss, move on, then walk back.** With three or more plants out, a good rhythm is to toss them, move on while they ripen for 2.4 s, then walk back over them for stage 3 harvests.
- Plants left alone still self-burst after 8 s for only 0.6× damage, so harvest the ones you can reach.
