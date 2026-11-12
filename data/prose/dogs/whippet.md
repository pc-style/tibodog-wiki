## Overview

Whip the Whippet tugs Tibo away after a surviving normal hit, at most once every 15 seconds at level 1. The base tug covers 36 units over six ticks when a clear route is available. Its aura gives +10 max HP (+40 at level 5).

## How it works

- **It reacts after damage; it does not block the hit.** Dodges, rejected hits, hazard/terrain damage and lethal hits do not arm the tug. Tibo must still be alive and outside a tunnel when Whip reacts. <small>[sim-CnCw_hkt.js: `e.moreVariety!==void 0&&!r&&f>0&&Ys().noteHit(e)`]</small>
- **The route is crowd-aware.** Whip chooses a direction away from nearby targets within 72 units, falling back to Tibo's facing when none are nearby. It tries eight directions to avoid hazard pools. A route shorter than 8 units is rejected; a later hazard can interrupt an active tug. <small>[sim-CnCw_hkt.js: `return o*a>=r.minStep`]</small>
- **Training improves distance and cooldown.** Power scales the requested 36-unit distance, and interval multipliers shorten the cooldown (about 10.28 s at level 5). The nudge is not a normal Space dash: it does not spend a dash charge or promise dash invulnerability. The fallback zero-radius `fetch` is not a pickup ability.

## Tips

- **Treat Whip as an escape assist, not a shield.** It needs a recent hit and a usable route. Avoid walking into damage just to trigger it.
