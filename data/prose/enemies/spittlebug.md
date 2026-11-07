## Overview

The Spittlebug is the only tier-2 pest of the [Crop Circle](/biomes/crop-circle) landmark, so you meet it only inside Crop Circles. Tier 2 is in the wave table from the start until minute 9, which with Normal's two-minute [tier lag](/modes) means up to about 11:59.

It is a small shooter. It walks towards Tibo until it is within 77 units (70% of its 110 range), then circles him sideways at 60% of its speed instead of closing in. When Tibo is within 132 units (120% of range) and its reload is done, it spits two pairs of froth bubbles. <small>[sim-aoTT3npm.js: `if(n>=.7*r)return;`]</small> Each bubble does 4 base damage and contact does 5. With 18 HP it dies to almost anything. It gives 2 XP and has a 6% chance to drop gold.

## How it works

- **Burst**: after a 0.5 s wind-up, two pairs of bubbles, 0.35 s apart before fire-rate scaling. Each pair's centre travels at base speed 70 along the aim fixed when the wind-up began; it is not re-aimed between pairs. Both bubbles start on the same heading (`fan` with zero arc), with opposite orbit phases. <small>[boot-BD2UPk7Y.js: ``kind:`fan`,count:2,arc:0,speed:70,radius:2,damage:4,bursts:2,interval:.35,telegraph:.5``]</small> <small>[sim-aoTT3npm.js: `Q.phase=a.motion?.orbit===void 0?0:k*n/o`]</small>
- **Orbit**: the bubbles circle their moving centre, growing from zero to a 6-unit radius over 0.3 s. The base frequency is 1.1 turns/s. Difficulty multiplies frequency by 0.6 on Easy and Hard, 0.8 on Normal and 1.1 on Nightmare, giving 0.66, 0.88 and 1.21 turns/s respectively. Nightmare also enlarges the radius to 7.2 units; Story keeps the base radius and frequency. The orbit adds both forward/backward and sideways velocity, not just a sideways wiggle. <small>[boot-BD2UPk7Y.js: `px:6,hz:1.1,grow:.3`]</small> <small>[sim-aoTT3npm.js: `let i=e.px*r.orbitPx,a=k*e.hz*r.orbitHz,o=t<e.grow,s=o?i*t/e.grow:i,c=o?i/e.grow:0`]</small> <small>[sim-aoTT3npm.js: `p+=RS.along,f+=RS.lat`]</small>
- **Reload**: 3.4 s, shortened by the enemy-bullet fire-rate scaling (see [Enemy bullets](/enemy-scaling#enemy-bullets)). Shot damage scales with the bug's damage scaling.
- **Killing it stops the burst**: the shots are fired by an emitter that is deleted as soon as the Spittlebug is gone, including shots still waiting in the burst. <small>[sim-aoTT3npm.js: `if(!Yg(e,i)){n.pool.kill(i);continue}`]</small>
- **Shooter cap**: early in a run only 2 shooting pests may be spawned at once before 3:00 and 4 before 6:00 (see [Crowd limits](/enemy-scaling#crowd-limits)). Because the Spittlebug is alone in its tier, a tier-2 spawn in a Crop Circle that hits the cap becomes a tier-1 pest ([Little Grey](/enemies/little-grey) or [Aphid](/enemies/aphid)) instead. <small>[sim-aoTT3npm.js: `if(km[i]===0||Nm(e)<Mm(e))return i`]</small>
- **Elites** use tier 2 from 1:00 to 4:59, so an early elite spawned in a Crop Circle can be a Spittlebug.

Measured in a controlled headless run (seed `wiki`, Standard, each difficulty, no grants or clock jumps, weapons removed, one stationary invulnerable Spittlebug 100 units east of stationary Tibo, other pests removed): build 44 (`main-C2skBLTa.js`) fired three single shots at ticks 30, 41 and 53; build 45 (`main-BRJMoZXM.js`) fired pairs at ticks 30 and 50. These are observed 60 Hz ticks, not replacements for the raw interval settings. At tick 60 the first pair was 11.84 units apart on Normal and 14.13 on Nightmare; discrete stepping makes this slightly different from the ideal diameters of 12 and 14.4. This tests the attack in isolation, not spawn odds or survival difficulty.

## Tips

- **Sidestep the bubble pair widely.** Move across the pair's path and leave room for the orbit around it; the bubbles no longer stay on a single straight line.
- At 18 HP it rarely needs special attention; the shots matter mostly when several bugs fire at once.
