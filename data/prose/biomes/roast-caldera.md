## How it works

This is the terrain of the [Shell endgame phase](/endgame), not a climate biome to search for before 15:00. New chunks use the current phase's ground; previously explored chunks retain their terrain.

Its oval patches apply **10 raw damage per second while Tibo's centre is inside**, before damage reduction. This is continuous terrain damage, not a single 10-damage hit on entry or a weapon burn status. Overlapping damaging patches each call the damage consumer. <small>[sim-Cb_K_V3L.js: `` r.kind===`slow`||r.kind===`chill`?te=Math.min(te,1-r.strength):qd(e,r.strength*t,ZA[r.kind],!0,re) ``]</small>

The hazard check uses **Tibo's centre**, not his body radius. It follows the patch's actual shape and rotation. Dash travel is added separately from slowed walking; a damaging patch can still hurt during a dash because terrain uses the continuous-damage path rather than ordinary dash-shielded contact. Homefield Boots replace the normal player-hazard list with an empty list and apply their separate pest-hazard rule; this is not universal immunity without that power. <small>[sim-Cb_K_V3L.js: `` Mo(r.poolShape,r.turn,v-r.x,ee-r.y,r.radius,0) ``]</small> <small>[sim-Cb_K_V3L.js: `` ne=!0===e.update2?.boots?Mv:e.world.activeHazards ``]</small>

At base settings a chunk rolls 2–3 candidate patches, each radius 22 × a random 0.8–1.3 factor, dropping candidates outside this biome. Difficulty and active condition rules can alter hazard size, density or add drifting patches; the candidate count is not a guaranteed visible count. <small>[sim-Cb_K_V3L.js: `` a=e.rng.int(Math.max(0,t.perChunk-1),t.perChunk) ``]</small>

Controlled checks on `main-DwGb2BE_.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-mechanics-groups.mjs` called the original movement system with supplied circular patches to isolate centre-inside/outside behavior and 10/60 damage in one tick at zero armor. Natural oval generation, device rendering, Homefield Boots and survival were not measured by these fixtures.
