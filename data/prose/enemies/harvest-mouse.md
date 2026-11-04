## Overview

The Harvest Mouse is the tier-4 pest of five biomes: [Peel Forest](/biomes/peel-forest), [Chip Canyons](/biomes/chip-canyons), [Fry-Oil Desert](/biomes/fry-oil-desert), the [Fry Palace Drive-Thru](/biomes/fry-palace) and [Gutterball Lanes](/biomes/gutterball-lanes). In each it is the only tier-4 pest. On Normal, tier-4 pests spawn from 9:00 to 20:59 (one minute later on Easy) and are the most common tier from about 13:00 to 18:00. Between 10:00 and 14:59 the minute's [elite](/bosses#elites) can be a Harvest Mouse.

It runs straight at Tibo at speed 44 and hurts on contact for 14, with 95 base HP. The catch is what happens when it dies: it splits into three [Field Rats](/enemies/field-rat). Counting the rats, one mouse is 95 + 3 × 42 = 221 base HP and gives 7 + 3 × 4 = 19 XP. The mouse itself has a 12% chance of a coin, and each rat rolls its own drops.

## How it works

When a mouse dies, three Field Rats appear in a small ring around the spot and are pushed outward. <small>[sim-CrpXuTSY.js: `r.kx[p]=60*D(f),r.ky[p]=60*s(f)`]</small> They are ordinary Field Rats with their full base stats, scaled by the same HP, damage and speed multipliers as the mouse that spawned them. This differs from splitters without a `child` (the [Snow Mold](/enemies/snow-mold) and [Sock Pile](/enemies/sock-pile)), whose copies get only 35% HP, a smaller body and half XP, and cannot split again. <small>[sim-CrpXuTSY.js: `e.scratch.hp=r.maxHp[t]/a.hp*(c?.35:1)`]</small>

An elite Harvest Mouse still releases three rats, but they are not elites. They get the normal scaling for the current time instead of the elite's stats.

## Tips

- Plan for the rats as part of the kill. Field Rats run at 50, so a mouse killed next to Tibo puts three fast attackers on top of Tibo at once. Killing mice at range gives time to deal with the split.
- Area damage around the spot where a mouse dies hits all three rats while they are still bunched together.
