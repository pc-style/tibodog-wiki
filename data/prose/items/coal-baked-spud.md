## Overview

Coal-Baked Spud is an Uncommon item that sets enemies on fire. When one of Tibo's weapons hits, there is a 15% chance to ignite the target. The fire burns for 80% of that hit's damage per second for 3 seconds, and the duration is multiplied by Tibo's duration stat. With no duration bonuses the multiplier is already 1.25 (the base +25%), so one ignite lasts 3.75 s and deals roughly three times the triggering hit.

It has weight 8 out of 78 among Uncommon items, about 2.6% of item rolls at luck 0. With [Hot Sauce](/passives/hot-sauce) at level 5, the next chest turns it into [Bonfire Spud](/items/bonfire-spud).

## How it works

- Only Tibo's weapon hits can trigger it. Dog bites, burn ticks, explosions and other item procs cannot. <small>[sim-HQr6OS1G.js: `h=m>=0&&m<7&&l>0`]</small>
- The burn is based on the hit's final damage after crit and the elite/boss bonus, so a crit leaves a bigger fire.
- Burns do not stack. An enemy keeps the highest burn damage it has received and the longest remaining burn time. <small>[sim-HQr6OS1G.js: `e.burnDps[t]=Math.max(e.burnDps[t],n),e.burnT[t]=Math.max(e.burnT[t],r)`]</small>
- Burn damage lands every 0.5 s as a separate hit, each worth half the per-second value. These ticks can crit and get the elite/boss bonus again. <small>[sim-HQr6OS1G.js: `(e.tick+o)%30==0){let r=t.burnSrc[o];K(e,.5*t.burnDps[o],r>=0?r:i,-1,0)`]</small>
- Copies stack: with *N* copies the ignite chance is `1 − 0.85^N`, limited to 30 × *N* ignites per second.

## Tips

- It suits weapons that hit hard and not very often. A single big hit leaves a big fire, while many small hits keep overwriting each other with weak burns.
- [Slow Cooker](/passives/slow-cooker) lengthens every burn, but it is not this item's catalyst. The catalyst is Hot Sauce.
