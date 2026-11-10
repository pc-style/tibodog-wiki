## Overview

Landmine Harvest is the evolution of [Tater Mines](/weapons/tater-mines): rotten mines that hit harder and make the pests they kill more likely to drop gold. Every 1.5 seconds it lays 4 mines that stay armed for 17.5 seconds (raw amount 3 and duration 14 s, plus the base +1 amount and +25% duration every non-aura weapon gets, see [Stats](/stats)). Each one triggers when a pest comes within 16 units and bursts for 75 damage in a radius of about 42 units (`size` 26 × area 1.6), with even stronger knockback than Tater Mines.

You get it by opening a chest while Tater Mines is level 8 and you own [Rotten Spud](/passives/rotten-spud) at any level. See [Evolutions](/evolutions) and [Chests](/chests).

## How it works

Placement, triggering and expiry follow the same rules as [Tater Mines](/weapons/tater-mines#how-it-works).

The `goldOnKill` value of 0.25 is added to a pest's gold drop chance when a mine blast is the hit that kills it. <small>[sim-DBEflSqk.js: `r.next()<n.goldChance[t]+n.killGold[t]`]</small> Most pests have a gold chance between 2% and 8%, so a mine kill raises it to roughly 27–33%. The bonus changes only the chance of a drop, not its value (an elite's drop is worth 10 times a normal pest's, with or without the mine).

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; one pest held 250 units away so no mine triggered): it dropped 4 mines 0.1 s apart every 1.5 s, each lasting 17.5 s with a 41.6-unit blast. All three seeds gave the same figures.

## Tips

- **Unite with Golden Harvest.** A chest can combine both evolutions into [Sowing Season](/weapons/sowing-season), raining golden potatoes and planting mines where the rain misses.
- **Let the mines clear weak pests.** The gold bonus only counts when the mine lands the killing blow, so Landmine Harvest earns the most gold when it is clearing weak pests rather than finishing off enemies your other weapons already hurt.
- Its catalyst, Rotten Spud, raises [curse](/curse): tougher, faster and more numerous enemies, but more XP and gold. More pests walking into mines suits this weapon.
