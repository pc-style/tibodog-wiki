## Overview

Jet Fryer evolves [Afterburner Fries](/weapons/afterburner-fries). Reach level 8 with Afterburner Fries, hold [Hot Start](/passives/hot-start) at any level, then open a [chest](/chests). Each dash sends two fans backward from the dash's starting point; the fries leave hot-oil splats when their flight expires.

## How it works

- Base stats are 70 damage, Amount 7, Area 1.2, projectile speed 210 and duration 0.2 s. Tibo's built-in +1 amount produces **eight fries per fan**, 16 per dash before other bonuses. His +25% duration makes their flight 0.25 s.
- The first fan spans 1.2 radians at speed 210; the second uses staggered angles across 1.6 radians and flies at 45% speed (94.5). Both start 10 units behind the dash origin, not at the dash's endpoint. <small>[sim-CteDA9xy.js: `s.x[c]=e.player.dashFromX[e.me]+l*n.gap`]</small> <small>[start-rows-3Hq_mI2a.js: `spread:1.6,speed:.45,oil:{shape:`]</small>
- Each expiring fry creates a splat at its final position. Oil lasts 4 s and checks damage every 0.25 s, using the fry's damage and weapon ownership. Its base radius 12 scales by the square root of Area: about 13.145 at Area 1.2. Overlapping splats are not a promise of that many independent hits on one pest. <small>[sim-CteDA9xy.js: `a.radius[o]=t.radius*Math.sqrt(n.area),a.life[o]=t.sec,a.maxLife[o]=t.sec,a.damage[o]=i.damage[r]*t.share`]</small>

**Controlled tests:** original `main-XeaRNUVr.js`, Standard/Normal, seeds `s1/s2/s3`, granted Jet Fryer alone, refilled HP, 8 s warmup, then 20 s walking right and dashing every 4 s with six high-HP pests held 45–90 units behind Tibo: 1,470–1,540 damage, up to 16 fries and 16 oil splats. Separate stationary dash controls, with and without optional combat/area rules, produced both eight-shot fans and 16 splats; this behavior belongs to the base sim. Original chest controls on both builds, three seeds, levels 7/8 and catalyst absent/present evolved only the new build's level-8 + Hot Start setup (3/3). Grants and supplied chests do not establish natural acquisition, drop odds or practical DPS.

## Tips

- **Dash away from the pursuers.** Both fans fire backward. Leave the oil across the crowd's path rather than dashing toward it.
- Hot Start also rewards dashing, but extra duration changes where the fries finish and place their splats.
- **Add Tailgate Party for Fry-By.** A chest makes [Fry-By](/weapons/fry-by) from both evolutions. Its dash fans spread along the dash path, alongside ordinary backwards volleys.
