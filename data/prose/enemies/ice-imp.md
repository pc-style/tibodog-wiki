## Overview

The Ice Imp is the tier-4 shooter of [Frozen-Fries Tundra](/biomes/frozen-tundra), [Ketchup Bog](/biomes/ketchup-bog) and the [Coin Laundromat](/biomes/coin-laundromat) landmark, and the only tier-4 pest in each of them. Tier 4 is in the wave table from minute 7 to minute 18; with Normal's two-minute [tier lag](/modes) that puts Ice Imps on the field from about 9:00 to 20:59. <small>[sim-FslaxQ7g.js: `{minute:7,minEnemies:145,maxEnemies:240,interval:.45,batch:6,tiers:[0,1,2,1,0]`]</small>

It walks straight at Tibo until it is within 91 units (70% of its 130 range). From there it stops closing in and circles him sideways at 60% of its speed. Whenever Tibo is within 156 units (120% of range) and its reload is done, it fires a fan of ice shots. <small>[sim-FslaxQ7g.js: `if(n>=.7*r)return;`]</small> <small>[sim-FslaxQ7g.js: `a.timer[n]<=0&&i<1.2*r.range`]</small> Each shot does 10 base damage, and touching the imp costs 14. With 90 base HP it is nearly as tough as a [Mole](/enemies/mole) (110). It gives 7 XP and has a 12% chance to drop gold.

## How it works

- **Volley**: three shots spread over 0.5 radians (about 29°) at speed 85, fired after a 0.5 s wind-up. The fan is aimed at where Tibo was when the wind-up started and does not track him afterwards.
- **Reload**: 2.6 s, divided by the enemy-bullet fire-rate scaling, so volleys come faster as the run goes on (see [Enemy bullets](/enemy-scaling#enemy-bullets)).
- **Shot count grows**: the 3 is multiplied by the bullet-count scaling (+4% per minute) and rounded, so the fan has 4 shots from about 4:10 and 5 from 12:30. On Normal, the first Ice Imps already fire 4. <small>[sim-FslaxQ7g.js: `a.count[o]=Math.max(1,Math.round(t.count*d.bulletCount))`]</small>
- **Shot damage** follows the imp's own damage scaling: the 10 is multiplied by the imp's current damage divided by its base damage, so elite imps and late-run imps hit harder with their shots too.
- **Killing the imp cancels its volley.** A volley still in its wind-up is deleted when its owner is gone. <small>[sim-FslaxQ7g.js: `if(!ul(e,i)){n.pool.kill(i);continue}`]</small>
- **Shooter cap**: Ice Imps count toward the cap on shooting pests (2 before 3:00, 4 before 6:00, then 30; see [Crowd limits](/enemy-scaling#crowd-limits)). When the cap is full, a spawn that would have been an Ice Imp drops to the biome's tier 3, because no other tier-4 pest is available.
- **Nightmare**: the volley flies at speed 130 instead of 85. Shots left and right of the centre curve towards the middle for their first 0.6 s, so they cross the line Tibo was standing on. A centre shot, when the count is odd, flies straight. <small>[sim-FslaxQ7g.js: `` case`inward`:return function(e,t,n){switch(e.kind){case`fan`:return Math.sign(n-1-2*t) ``]</small>
- **Elites**: elites use tier 4 from 10:00 to 14:59, so an elite in these biomes can be an Ice Imp (see [Elites](/enemy-scaling#elites)).

## Tips

- The fan is locked in when the wind-up starts, so moving sideways during and after the wind-up usually takes Tibo out of it. Standing still or running straight towards or away from the imp keeps him in its line of fire.
- Because the imp stops approaching at about 91 units and circles, short-range auras and melee weapons rarely reach it. Targeted or long-range weapons are the better answer.
- Killing an imp during its 0.5 s wind-up removes that volley, so a sudden burst of damage on a nearby imp prevents a hit as well as killing it.
