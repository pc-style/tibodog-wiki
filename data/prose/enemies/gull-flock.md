## Overview

Gull Flocks appear only during [Lunch Rush](/events/lunch-rush), the landmark event of the [Fry Palace Drive-Thru](/biomes/fry-palace), which fires once when Tibo reaches the drive-thru (“Lunch rush! Gulls dive across the lot!”). They are not the [Parking Lot Gulls](/enemies/parking-gull) that chase Tibo in the same biome.

Each gull is weak, with 10 base HP and 5 contact damage, but at speed 105 it is the fastest pest in the game, ahead of even the [Fry Fly Swarm](/enemies/swarm-fly) (100). Gulls do not chase. The whole flock flies across the field in one straight line and is gone a few seconds later. Each gull gives 1 XP and has a 2% chance of a coin.

## How it works

Lunch Rush spawns 24 gulls, multiplied by the enemy-count multiplier up to ×2. That multiplier only rises in overtime (see [Enemy scaling](/enemy-scaling)), so the flock has 24 gulls before 20:00 and up to 48 after. The flock starts just beyond the edge of the screen on a random side. It forms a band 280 units wide, centred on Tibo's position when the event fired, and up to 60 units deep. Every gull flies in the same fixed direction, across Tibo's position and out the other side. Gulls never steer, and any still alive 14 s after spawning disappear without drops. <small>[sim-Cn6iREtF.js: `r.tx[f]=c,r.ty[f]=l,r.despawnAt[f]=e.time+14`]</small>

A gull touches Tibo if its line passes within 9 units of Tibo's centre (4 for the gull, 6 for Tibo, less 1). Each enemy can hurt Tibo at most once every 0.5 s, and at speed 105 a gull crosses Tibo in well under that, so each gull hits at most once per pass. <small>[sim-Cn6iREtF.js: `o=e.cfg.player.contactCooldown`]</small>

## Tips

- **A Lunch Rush costs a hit or two.** The band is sparse. Spread over 280 units, the 24 gulls put on average about 1.5 into the 18-unit lane that hits a standing Tibo, so a Lunch Rush usually costs a hit or two, not 24.
- Moving sideways across the flock's path while it passes sweeps Tibo through more lanes. Standing still, or moving parallel to the flight line, keeps the lane narrow.
- Any area or piercing weapon kills gulls quickly, but they are worth very little XP, so there is no need to chase them.
