## Overview

The Bog Toad is the tier-3 charger of the wet biomes. In [Mash Swamp](/biomes/mash-swamp) it is the only tier-3 pest; in [Ketchup Bog](/biomes/ketchup-bog) it shares the slot with the [Sizzle Imp](/enemies/sizzle-imp). On Normal, tier-3 pests spawn from 6:00 to 16:59 (from 7:00 on Easy), and between 5:00 and 9:59 a Bog Toad can also be the minute's [elite](/bosses#elites) in those biomes.

Most of the time it waddles towards Tibo at speed 28. When Tibo comes within 100 units it stops, winds up, and lunges in a straight line. With 50 base HP and 13 contact damage it is the bulkiest of the tier-3 chargers, tougher than the [Field Crow](/enemies/field-crow) but slower to close in. Its mass of 0.4 cuts knockback by 40%. A kill gives 4 XP and an 8% chance of a coin.

## How it works

The timings below are before 20:00. In Standard from 20:00, the windup is 0.6 s instead of 0.5 s; the dash and cooldown do not change. <small>[sim-B7N2RusS.js: `return!An(e)||e.runClock<Tn?t:Math.max(t,.6)`]</small>

The toad's charge has three phases:

1. **Windup**: once Tibo is within `dashRange` (100) and the charge is off cooldown, it stands still for 0.5 s. It aims at where Tibo is when the windup starts and does not re-aim.
2. **Dash**: it moves at `dashSpeed` 170 for 1.3 × 100 / 170 ≈ 0.76 s, covering about 130 units, and since the charge starts within 100 units it carries on at least 30 units past Tibo's old position. <small>[sim-B7N2RusS.js: `i.state[t]=2,i.timer[t]=1.3*n/r,i.windup[t]=0`]</small>
3. **Cooldown**: for 1.6 s it walks normally and cannot charge again.

A freshly spawned toad waits 0.5–2 s before its first charge can start. The dash does no extra damage: it hurts only by touching Tibo, like walking pests, at most once every 0.5 s. The dash throws up dust when it starts and stops (see [charging pest effects](/enemy-scaling#charging-pest-effects)).

## Tips

- Step sideways during the half-second windup. At Tibo's base speed of 62 that is about 31 units, far more than the 13 units of combined body radius the dash needs to connect.
- After a missed dash the toad ends up at least 30 units past you with 1.6 s before it can charge again. That is a good moment to hit it with short-range weapons.
- In Mash Swamp every tier-3 spawn is a toad, so mid-run waves there arrive as a stream of charges rather than a mixed crowd.
