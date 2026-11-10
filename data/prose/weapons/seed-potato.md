## Overview

Seed Potato is a planting weapon. Tibo tosses a seed potato next to nearby pests, where it grows through three stages and zaps pests around it once per second. Walking over the plant harvests it for a burst that gets much stronger with each stage, and the potato goes back into Tibo's hand. A plant left alone bursts weakly after 8 s.

At level 1 Tibo can have one plant out at a time and the weapon's raw damage is 34.5. Levelling raises raw damage to 76.5 and area to 1.2. Extra amount from passives or items allows more plants at once, up to 4. It is a base weapon offered on level-up. At max level, with [Fertilizer](/passives/fertilizer) owned, a chest evolves it into [Potato Patch](/weapons/potato-patch) (see [Evolutions](/evolutions)).

## How it works

- **Throwing.** Tibo throws only when a pest is within 90 units. The seed aims at the nearest pest at least 30 units away. If every pest in range is closer than that, it lands 30 units towards the nearest one. Throws are at least 0.25 s × cooldown multiplier apart, and the seed flies for 0.35 s.
- **Plant limit.** The number of plants out at once is 1 plus Tibo's amount bonuses from passives and items, capped at 4. Unlike most weapons, the base +1 amount every weapon gets (see [Stats](/stats)) is subtracted here, so with no amount bonuses only one plant is out at a time. <small>[sim-B1TRz8tn.js: `c=Math.min(r.maxPlants,6,Math.max(1,t.raw.amount)+s)`]</small>
- **Growing.** A planted seed is at stage 1, reaches stage 2 after 1.2 s and stage 3 after 2.4 s. The duration stat speeds this up. <small>[sim-B1TRz8tn.js: `o.growth[i]=o.growth[i]+a*r.duration`]</small>
- **Zaps.** From the moment it lands, the plant zaps every pest within 30 × area units once per second, for 0.3 × damage × stage (0.3×, 0.6× or 0.9×). Zaps cause no knockback.
- **Harvest.** Tibo harvests a plant by coming within 24 units of it. Extra pickup range adds a quarter of the extra radius, up to 34 units. The harvest bursts for damage × (1 + 1.5 × (stage − 1)), that is 1×, 2.5× or 4×, in a radius of (30 + 8 × stage) × area. The potato is then ready to throw again. <small>[sim-B1TRz8tn.js: `J(e,r.damage*(1+n.burstK*(o-1)),t.src,t.slot,r.knockback)`]</small>
- **Golden harvest.** A stage 3 harvest has a 0.5 × luck chance to also drop 4 gold coins. Each coin is worth 1 × (1 + [curses taken](/curse)).
- **Left alone.** After 8 s an unharvested plant bursts by itself for 0.6 × damage in a radius of 38 × area, with no knockback, and leaves a spent potato. Walk over it to catch it. It returns to Tibo's hand on its own once he is more than 160 units away.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): zaps came once per second (59–60 ticks) and dealt 9, 18 or 27 at level 1, that is 0.3, 0.6 and 0.9 × 30 for stages 1 to 3. All three seeds gave the same figures.

## Tips

- **Bog Witch boosts its damage.** Seed Potato is zone-class: the full three-piece set now adds 80% × set strength before extra ladder scaling. This raises zap and harvest damage, not the weapon's raw damage or growth-stage multipliers. See [set rules and measured controls](/modes#gear-set-rules).
- **Let plants ripen fully before harvesting.** Wait for stage 3 (2.4 s after landing) before walking over a plant. A stage 3 harvest deals 4 times the damage of a stage 1 harvest over a larger radius. The plant also zaps harder while it grows.
- Do not leave plants to time out. The 8 s self-burst deals only 0.6× damage, less than even a stage 1 harvest.
- Luck adds gold to stage 3 harvests. Duration bonuses make the plants ripen sooner.
- With a large pickup range the harvest reach (up to 34) is more than the 30-unit minimum throw. A seed thrown at a pest right next to Tibo can then be harvested at stage 1 the moment it lands. Step away from the plant if you want it to ripen.
