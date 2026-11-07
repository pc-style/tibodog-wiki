## Overview

The Harvest Mouse is the tier-4 pest of five biomes: [Peel Forest](/biomes/peel-forest), [Chip Canyons](/biomes/chip-canyons), [Fry-Oil Desert](/biomes/fry-oil-desert), the [Fry Palace Drive-Thru](/biomes/fry-palace) and [Gutterball Lanes](/biomes/gutterball-lanes). In each it is the only tier-4 pest. On Normal, tier-4 pests spawn from 9:00 to 20:59 (one minute later on Easy) and are the most common tier from about 13:00 to 18:00. Between 10:00 and 14:59 the minute's [elite](/bosses#elites) can be a Harvest Mouse.

It runs straight at Tibo at speed 44 and hurts on contact for 14, with 95 base HP. The catch is what happens when it dies: it splits into three [Field Rats](/enemies/field-rat). Counting the rats, one mouse is 95 + 3 × 42 = 221 base HP and gives 7 + 3 × 4 = 19 XP. The mouse itself has a 12% chance of a coin, and each rat rolls its own drops.

## How it works

When a mouse dies, three Field Rats appear in a small ring around the spot and are pushed outward. <small>[sim-r66zS6bG.js: `n.kx[d]=60*p(u),n.ky[d]=60*x(u)`]</small> They are ordinary Field Rats with their full base stats, scaled by the same HP, damage and speed multipliers as the mouse that spawned them. This differs from a splitter without a `child` (the [Snow Mold](/enemies/snow-mold); the [Sock Pile](/enemies/sock-pile) has one and releases full [Lint Bunnies](/enemies/lint-bunny)), whose copies get only 35% HP, a smaller body and half XP, and cannot split again. <small>[sim-r66zS6bG.js: `e.scratch.hp=n.maxHp[t]/i.hp*(o?.35:1)`]</small> <small>[boot-BytKoKur.js: `` child:`lint-bunny` ``]</small>

An elite Harvest Mouse still releases three rats, but they are not elites. They get the normal scaling for the current time instead of the elite's stats.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, Normal, `--god`, seed `wiki`; Tibo teleported deep into Peel Forest at 10:00 and left standing for 240 s): 124 Harvest Mice died and 372 Field Rats appeared at their death spots, three per mouse. Each new pest was matched to the nearest death on the same tick, within 30 units; a few mice died close together on the same tick, so the per-mouse split could not be told apart there, but the total is exactly 3 × 124. The rats had 4 XP each, and none of the 367 rats that died spawned anything. No elite mouse died in that window, so the elite case is not measured.

## Tips

- **Kill mice at range.** Plan for the rats as part of the kill. Field Rats run at 50, so a mouse killed next to Tibo puts three fast attackers on top of Tibo at once. Killing mice at range gives time to deal with the split.
- Area damage around the spot where a mouse dies hits all three rats while they are still bunched together.
