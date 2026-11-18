## How it works

This is the terrain of the [Hunt endgame phase](/endgame), not a climate biome to search for before 15:00. New chunks use the current phase's ground; previously explored chunks retain their terrain.

Inside its splat patches, Tibo's walking-speed factor becomes **0.85** (15% slower). This does not damage Tibo. Overlapping slows use the strongest reduction, not multiplication. <small>[sim-CX9jKioI.js: `` r.kind===`slow`||r.kind===`chill`?ee=Math.min(ee,1-r.strength):Gd(e,r.strength*t,Dj[r.kind],!0,ne) ``]</small>

The hazard check uses **Tibo's centre**, not his body radius. It follows the patch's actual shape and rotation. Dash travel is added separately from slowed walking; a damaging patch can still hurt during a dash because terrain uses the continuous-damage path rather than ordinary dash-shielded contact. Homefield Boots replace the normal player-hazard list with an empty list and apply their separate pest-hazard rule; this is not universal immunity without that power. <small>[sim-CX9jKioI.js: `` vo(r.poolShape,r.turn,v-r.x,y-r.y,r.radius,0) ``]</small> <small>[sim-CX9jKioI.js: `` te=!0===e.update2?.boots?Xv:e.world.activeHazards ``]</small>

The official journal's **17 November 2026 / 552073a** art note says the slowing mud splats now show painted pools instead of plain circles. This changes their appearance, not the slowing rule above. This comparison observes the renderer change between `main-CIdMQv3M.js` and `main-w35iMA4h.js`; the journal's grouping is not a claim about its first source introduction. <small>[changelog-panel-DpMweeFA.js: `The slowing mud splats in the Russet Moor now show their painted pools instead of plain circles.`]</small>

At base settings a chunk rolls 2–3 candidate patches, each radius 22 × a random 0.8–1.3 factor, dropping candidates outside this biome. Difficulty and active condition rules can alter hazard size, density or add drifting patches; the candidate count is not a guaranteed visible count. <small>[sim-CX9jKioI.js: `` a=e.rng.int(Math.max(0,t.perChunk-1),t.perChunk) ``]</small>

Controlled checks on `main-DwGb2BE_.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-mechanics-groups.mjs` called the original movement system with supplied circular patches to isolate centre-inside/outside behavior, no damage and strongest-slow selection. Natural splat generation, device rendering, Homefield Boots and survival were not measured by these fixtures.
