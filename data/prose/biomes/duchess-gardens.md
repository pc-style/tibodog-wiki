## How it works

This is the terrain of the [Court endgame phase](/endgame), not a climate biome to search for before 15:00. New chunks use the current phase's ground; previously explored chunks retain their terrain.

Its clover patches apply **6 raw damage per second while Tibo's centre is inside**, before damage reduction. This is continuous terrain damage, not a single 6-damage hit on entry or a weapon burn status. Overlapping damaging patches each call the damage consumer. <small>[sim-BluGyCqn.js: `` r.kind===`slow`||r.kind===`chill`?ee=Math.min(ee,1-r.strength):Gd(e,r.strength*t,kj[r.kind],!0,y) ``]</small>

The hazard check uses **Tibo's centre**, not his body radius. It follows the patch's actual shape and rotation. Dash travel is added separately from slowed walking; a damaging patch can still hurt during a dash because terrain uses the continuous-damage path rather than ordinary dash-shielded contact. Homefield Boots replace the normal player-hazard list with an empty list and apply their separate pest-hazard rule; this is not universal immunity without that power. <small>[sim-BluGyCqn.js: `` bo(r.poolShape,r.turn,_-r.x,v-r.y,r.radius,0) ``]</small> <small>[sim-BluGyCqn.js: `` te=!0===e.update2?.boots?Zv:e.world.activeHazards ``]</small>

At base settings a chunk rolls 2–3 candidate patches, each radius 20 × a random 0.8–1.3 factor, dropping candidates outside this biome. Difficulty and active condition rules can alter hazard size, density or add drifting patches; the candidate count is not a guaranteed visible count. <small>[sim-BluGyCqn.js: `` a=e.rng.int(Math.max(0,t.perChunk-1),t.perChunk) ``]</small>

Controlled checks on `main-DwGb2BE_.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-mechanics-groups.mjs` called the original movement system with supplied circular patches to isolate centre-inside/outside behavior and 6/60 damage in one tick at zero armor. Natural clover generation, device rendering, Homefield Boots and survival were not measured by these fixtures.
