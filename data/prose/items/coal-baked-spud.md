## Overview

Coal-Baked Spud is an Uncommon item that sets enemies on fire. When one of Tibo's weapons hits, there is a 15% chance to ignite the target. The fire burns for 80% of that hit's damage per second for 3 seconds, and the duration is multiplied by Tibo's duration stat. With no duration bonuses the multiplier is already 1.25 (the base +25%), so one ignite lasts 3.75 s and deals roughly three times the triggering hit.

It has weight 8 out of 78 among Uncommon items, about 2.6% of item rolls at luck 0. With [Hot Sauce](/passives/hot-sauce) at level 5, the next chest turns it into [Bonfire Spud](/items/bonfire-spud).

## How it works

- Only Tibo's weapon hits can trigger it. Dog bites, burn ticks, explosions and other item procs cannot. <small>[sim-BY3r5cDe.js: `g=h>=0&&h<7&&l>0`]</small>
- The burn is based on the hit's final damage after crit and the elite/boss bonus, so a crit leaves a bigger fire.
- Burns do not stack. An enemy keeps the highest burn damage it has received and the longest remaining burn time. <small>[sim-BY3r5cDe.js: `e.burnDps[t]=Math.max(e.burnDps[t],n),e.burnT[t]=Math.max(e.burnT[t],r)`]</small>
- Burn damage lands every 0.5 s as a separate hit, each worth half the per-second value. These ticks can crit and get the elite/boss bonus again. <small>[sim-BY3r5cDe.js: `(e.tick+o)%30==0){let r=t.burnSrc[o];J(e,.5*t.burnDps[o],r>=0?r:i,-1,0)`]</small>
- Copies stack: with *N* copies the ignite chance is `1 − 0.85^N`, limited to 30 × *N* ignites per second.
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added with `giveItem`; Peeler, Small Fry, Tot Toss, Chip Shuriken, Starch Chain and Seeker Sprouts each given 5 times with `give`; `warp(240)`; HP refilled every tick; Tibo walking a slow circle; later level-ups taking the first offer; 180 s on seeds `s1`–`s5`): 14.8% of 23,410 ignite rolls succeeded with one copy (expected 15%), and 38.4% of 22,875 with three (expected 38.6%). The 30-per-second limit was not reached: even with the chance set to 100% in the scenario, these weapons and a second set (Steam Vent, Whisk Vortex, Sprout Satellites, Gravy Boat, Salt Line, Butter Streak) gave only 19–22 ignites per second.
- **Measured, burns not stacking** (same build and settings, one copy with its chance set to 100%, Tibo standing still, 120 s on seeds `s1`–`s3`): enemies that were already burning were re-ignited 964 times. Their burn damage per second stayed exactly the same 905 times, rose only when a bigger hit re-ignited them, and never fell. Burns that added up would have raised it on every re-ignite.

## Tips

- **Pair it with slow, hard-hitting weapons.** It suits weapons that hit hard and not very often. A single big hit leaves a big fire, while many small hits keep overwriting each other with weak burns.
- [Slow Cooker](/passives/slow-cooker) lengthens every burn, but it is not this item's catalyst. The catalyst is Hot Sauce.
