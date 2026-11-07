## Overview

The Sizzle Imp is a tier-3 suicide pest of the hot biomes: [Chip Canyons](/biomes/chip-canyons), [Fry-Oil Desert](/biomes/fry-oil-desert) (where it is the only tier-3 pest), [Ketchup Bog](/biomes/ketchup-bog) and the [Fry Palace Drive-Thru](/biomes/fry-palace) landmark. Tier 3 is in the wave table from minute 4 to minute 14; with Normal's two-minute [tier lag](/modes) Sizzle Imps spawn from about 6:00 to 16:59.

It runs at Tibo at speed 48, quicker than most pests of its tier, and blows itself up when it gets close. Its 20 base damage is the highest of any tier-3 pest, but it has only 30 HP. Killed normally it gives 4 XP and an 8% gold chance. If it explodes on its own it drops nothing.

## How it works

1. When the imp is within 18 units of Tibo, it lights a 0.6 s fuse. <small>[sim-aJ7IG2rS.js: `a.state[t]===0&&n<18&&(a.state[t]=1,a.timer[t]=r)`]</small>
2. While the fuse burns it keeps following Tibo at only 20% of its speed.
3. When the fuse runs out it explodes. Tibo takes its damage only if he is closer than 26 units plus his own body radius (6), so 32 units centre to centre. Moving away does not cancel the fuse. <small>[sim-aJ7IG2rS.js: `n<i+e.player.radius[e.me]&&lu(e,a.damage[t],Ec[a.def[t]],!1,a.level[t])`]</small>
4. The imp is then removed without the normal death rewards: no XP gem, no gold, and no kill counted. Only an elite's chest still drops. The blast checks Tibo only; it does not hurt other pests. <small>[sim-aJ7IG2rS.js: `RS(e,t),a.pool.kill(t)))})(e,t,r,n.fuse`]</small>

The explosion uses the imp's scaled damage, so it follows the usual [enemy damage scaling](/enemy-scaling), and elites (tier 3 from 5:00 to 9:59) hit harder.

## Tips

- **Kill it before it gets close.** Killing it before it gets within 18 units is the cleanest answer: 30 HP is low, and you keep the XP.
- Once the fuse is lit, walking straight away is usually enough. Tibo's base speed is 62, so in 0.6 s he covers about 37 units while the imp creeps forward at about 10 units per second. A dash (48 units) also clears the blast.
- Standing still in a crowd is risky here: several imps can light their fuses together and the blasts stack.
