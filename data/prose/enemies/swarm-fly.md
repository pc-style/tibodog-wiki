## Overview

The Fry Fly Swarm (internal id `swarm-fly`) is the pest of the [Fry Fly Swarm](/events/fly-swarm) event (“A swarm of fry flies!”). It does not appear in any biome's spawn table. The event is on the [wave schedule](/bosses#wave-schedule) at 1:30, 3:45, 6:00, 8:15, 11:15, 13:30 and 15:00; overtime uses the separate [endgame director](/endgame). It is a different enemy from the [Fry Fly](/enemies/fry-fly), the tier-2 pest of the fry biomes.

The event sends a band of 26 flies across the screen in one straight line at speed 100, much faster than Tibo's base speed of 62. Each fly has 10 HP and 5 contact damage, gives 1 XP and has a 2% chance to drop gold.

## How it works

- **Formation**: the flies spawn on one side of Tibo, at the normal spawn distance plus up to 60 units, spread up to 120 units either side of a line through him. They all fly along that line, towards and past him. <small>[sim-rGD56OmB.js: `i.vx[t]=i.tx[t]*i.speed[t],i.vy[t]=i.ty[t]*i.speed[t]`]</small>
- **No steering**: a fly keeps the heading it spawned with. It does not turn towards Tibo.
- **Lifetime**: every fly despawns 14 s after spawning, or earlier once it is more than 460 units from Tibo. <small>[sim-rGD56OmB.js: `r.despawnAt[f]=e.time+14`]</small>
- **Count**: 26 × the pest-count scaling, capped at ×2. Standard's count scaling stays at 1, so the requested swarm remains 26 flies in overtime too; a full pool can reduce the actual spawn. <small>[sim-rGD56OmB.js: `d=Math.round(t.count*Math.min(2,ol(e.scale,e.cfg,e.runClock).count))`]</small>
- **Passes through crowds**: Fry Fly Swarm flies are the one enemy left out of the push that keeps pests from overlapping, so the swarm flies straight through other pests and bosses instead of being slowed by them. The [Gull Flock](/enemies/gull-flock) of the Lunch Rush event flies the same way but is still pushed. <small>[sim-rGD56OmB.js: ``return v.enemyIndex(`swarm-fly`)``]</small>

## Tips

- **Move across the band, not away.** The band is about 240 units wide and every fly holds its course, so moving across its path, not away from it, gets Tibo out fastest.
- If Tibo is caught inside it, the flies only touch him as they pass. At speed 100 they are gone within seconds.
