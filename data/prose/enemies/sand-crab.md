## Overview

The Sand Crab is the only tier-2 pest of [Chip Canyons](/biomes/chip-canyons) (“Crabs scuttle in the cracks.”). Tier 2 is in the wave table from the start until minute 9, which with Normal's two-minute [tier lag](/modes) means up to about 11:59.

It is a charger: it walks slowly towards Tibo (speed 30), and when he is in range it stops, winds up and dashes at speed 150, well over Tibo's base speed of 62. It has 20 HP and deals 7 contact damage, about the same as other tier-2 pests. It gives 2 XP and has a 6% chance to drop gold.

## How it works

The timings below are before 20:00. In Standard from 20:00, the windup is 0.6 s instead of 0.5 s; the dash and cooldown do not change. <small>[sim-CPXfSfkD.js: `return!ni(e)||e.runClock<Xr?t:Math.max(t,.6)`]</small>

The charge is a three-step cycle: <small>[sim-CPXfSfkD.js: `i.state[t]=2,i.timer[t]=1.3*n/r,i.windup[t]=0`]</small>

1. **Approach**: while its cooldown is running or Tibo is 90 units or more away, it walks towards him like an ordinary pest.
2. **Wind-up**: once Tibo is within 90 units, it stops for 0.5 s and locks its direction towards where he is at that moment.
3. **Dash**: it charges in that fixed direction at 150 for 1.3 × 90 / 150 = 0.78 s, about 117 units, then walks normally again for a 1.6 s cooldown before it can charge again.

A freshly spawned crab also waits a random 0.5–2 s before its first charge. The dust and grit when it launches are cosmetic (see [Charging pest effects](/enemy-scaling#charging-pest-effects)).

## Tips

- **Step sideways during the pause.** The dash direction is fixed at the start of the wind-up, so stepping sideways during the 0.5 s pause makes it miss.
- The dash carries it about 117 units, past where Tibo stood. Afterwards it has a 1.6 s cooldown and is just a slow walker, a good moment to finish it.
