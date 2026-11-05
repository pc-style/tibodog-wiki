## Overview

The Spittlebug is the only tier-2 pest of the [Crop Circle](/biomes/crop-circle) landmark, so you meet it only inside Crop Circles. Tier 2 is in the wave table from the start until minute 9, which with Normal's two-minute [tier lag](/modes) means up to about 11:59.

It is a small shooter. It walks towards Tibo until it is within 77 units (70% of its 110 range), then circles him sideways at 60% of its speed instead of closing in. When Tibo is within 132 units (120% of range) and its reload is done, it spits a burst of three shots. <small>[sim-BfhgrRZL.js: `if(n>=.7*r)return;`]</small> Each shot does 4 base damage and contact does 5. With 18 HP it dies to almost anything. It gives 2 XP and has a 6% chance to drop gold.

## How it works

- **Burst**: after a 0.5 s wind-up, three single shots at speed 75, 0.2 s apart. All three are aimed at the point where Tibo stood when the wind-up began, not re-aimed between shots.
- **Reload**: 3.4 s, shortened by the enemy-bullet fire-rate scaling (see [Enemy bullets](/enemy-scaling#enemy-bullets)). Shot damage scales with the bug's damage scaling.
- **Killing it stops the burst**: the shots are fired by an emitter that is deleted as soon as the Spittlebug is gone, including shots still waiting in the burst. <small>[sim-BfhgrRZL.js: `if(!ul(e,i)){n.pool.kill(i);continue}`]</small>
- **Shooter cap**: early in a run only 2 shooting pests may be spawned at once before 3:00 and 4 before 6:00 (see [Crowd limits](/enemy-scaling#crowd-limits)). Because the Spittlebug is alone in its tier, a tier-2 spawn in a Crop Circle that hits the cap becomes a tier-1 pest ([Little Grey](/enemies/little-grey) or [Aphid](/enemies/aphid)) instead. <small>[sim-BfhgrRZL.js: `if(Ms[i]===0||Fs(e)<Ps(e))return i`]</small>
- **Elites** use tier 2 from 1:00 to 4:59, so an early elite spawned in a Crop Circle can be a Spittlebug.

## Tips

- One sidestep dodges the whole burst, since all three shots travel along the same line.
- At 18 HP it rarely needs special attention; the shots matter mostly when several bugs fire at once.
