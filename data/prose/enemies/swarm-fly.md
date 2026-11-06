## Overview

The Fry Fly Swarm (internal id `swarm-fly`) is the pest of the [Fry Fly Swarm](/events/fly-swarm) event (“A swarm of fry flies!”). It does not appear in any biome's spawn table. The event is on the [wave schedule](/bosses#wave-schedule) at 2:00, 5:00, 8:00, 11:00, 15:00, 18:00 and 20:00, and every other minute in overtime. It is a different enemy from the [Fry Fly](/enemies/fry-fly), the tier-2 pest of the fry biomes.

The event sends a band of 26 flies across the screen in one straight line at speed 100, much faster than Tibo's base speed of 62. Each fly has 10 HP and 5 contact damage, gives 1 XP and has a 2% chance to drop gold.

## How it works

- **Formation**: the flies spawn on one side of Tibo, at the normal spawn distance plus up to 60 units, spread up to 120 units either side of a line through him. They all fly along that line, towards and past him. <small>[sim-Begj1yyi.js: `i.vx[t]=i.tx[t]*i.speed[t],i.vy[t]=i.ty[t]*i.speed[t]`]</small>
- **No steering**: a fly keeps the heading it spawned with. It does not turn towards Tibo.
- **Lifetime**: every fly despawns 14 s after spawning, or earlier once it is more than 460 units from Tibo. <small>[sim-Begj1yyi.js: `r.despawnAt[f]=e.time+14`]</small>
- **Count**: 26 × the pest-count scaling, capped at ×2. The count scaling is 1 until 20:00, so overtime swarms grow to at most 52 flies. <small>[sim-Begj1yyi.js: `d=Math.round(t.count*Math.min(2,Qs(e.scale,e.cfg,e.runClock).count))`]</small>
- **Passes through crowds**: Fry Fly Swarm flies are the one enemy left out of the push that keeps pests from overlapping, so the swarm flies straight through other pests and bosses instead of being slowed by them. The [Gull Flock](/enemies/gull-flock) of the Lunch Rush event flies the same way but is still pushed. <small>[sim-Begj1yyi.js: ``return E.enemyIndex(`swarm-fly`)``]</small>

## Tips

- **Move across the band, not away.** The band is about 240 units wide and every fly holds its course, so moving across its path, not away from it, gets Tibo out fastest.
- If Tibo is caught inside it, the flies only touch him as they pass. At speed 100 they are gone within seconds.
