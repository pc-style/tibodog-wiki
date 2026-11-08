## Overview

The Blight Spore is a tier-3 shooter found in five biomes: [Potato Field](/biomes/potato-field), [Peel Forest](/biomes/peel-forest), [Crop Circle](/biomes/crop-circle), [Compost Caves](/biomes/compost-caves) and [Coin Laundromat](/biomes/coin-laundromat). On Normal, tier-3 pests spawn from 6:00 to 16:59 (from 7:00 on Easy). In each of these biomes it shares the tier-3 slot with the [Field Rat](/enemies/field-rat) or [Field Crow](/enemies/field-crow), and Potato Field also has the [Reset Zombie](/enemies/reset-zombie). Between 5:00 and 9:59 it can also appear as a tier-3 [elite](/bosses#elites).

It is slow (speed 26) and fairly sturdy, with 40 base HP. Instead of rushing Tibo it keeps its distance and fires rings of six bullets. Its contact damage of 10 is the lowest of any tier-3 pest. A kill gives 4 XP and an 8% chance of a coin.

## How it works

- **Movement.** It walks towards Tibo until it is within 84 units (0.7 × its `range` of 120). Closer than that, it stops approaching and sidesteps around Tibo at 60% of its speed. <small>[sim-BEF9Qth5.js: `i.vx[t]=-o/n*i.speed[t]*.6`]</small>
- **Shooting.** It fires whenever its shot timer is ready and Tibo is within 144 units (1.2 × range). The timer is 3.4 s divided by the enemy fire-rate multiplier, which grows by 3% a minute up to ×2.2 (see [Enemy scaling](/enemy-scaling#enemy-bullets)). Its first shot can come no sooner than 0.5–2 s (random) after it spawns. <small>[sim-BEF9Qth5.js: `r.timer[t]=n.shotEvery/kc(e.scale,e.cfg,e.runClock).bulletRate`]</small>
- **The ring.** Each volley is a ring of six bullets (more later, as the bullet-count multiplier grows), evenly spaced, with one aimed at where Tibo stood when the volley started. A 0.6 s telegraph comes before the bullets leave. Bullets start at speed 50 (raised by the bullet-speed multiplier) and deal 7 base damage, scaled by the same multiplier as the spore's contact damage. If the spore dies during the telegraph, the volley is cancelled. <small>[sim-BEF9Qth5.js: `if(!Av(e,i)){n.pool.kill(i);continue}`]</small>
- **Nightmare.** On Nightmare it uses its alternate pattern: the same ring, but each bullet weaves 6 units to either side once per second, with neighbouring bullets weaving in opposite directions. <small>[sim-BEF9Qth5.js: `e.level.sharpPatterns&&n!==void 0?n:t.pattern`]</small>

The game caps how many shooting pests can spawn (see [crowd limits](/enemy-scaling#crowd-limits)). When the cap is full, a tier-3 spawn that would have been a Blight Spore becomes one of the biome's other tier-3 pests instead.

## Tips

- **Close in and kill it.** A ring of six spreads out as it travels, so the gaps are widest far from the spore. Its strafing range of about 84 units is close enough that moving in to kill it is often safer than dodging repeated volleys.
- Killing it during the telegraph cancels the volley, so fast single-target weapons do well against it.
- Only one bullet in each ring is aimed at Tibo. A small sideways step beats the aimed bullet; the other five fly off in other directions.
