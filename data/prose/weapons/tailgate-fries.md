## Overview

Tailgate Fries is a base weapon that shoots backwards. Every 0.7 s it fires a quick volley of fries out of Tibo's back, opposite the way he is facing, so it hits the pests chasing him rather than the ones ahead. If Tibo is standing still when the volley starts, it is cut to a single slow fry.

Each fry flies at 200 units per second for 1 s (Duration 0.8 plus Tibo's base +25%, see [Stats](/stats)), so it reaches about 200 units behind him. At level 8, with [Butter Pat](/passives/butter-pat) owned at any level, it evolves into [Tailgate Party](/weapons/tailgate-party) on the next [chest](/chests).

## How it works

- **Volley size.** While Tibo moves, a volley has as many fries as the weapon's Amount, which includes Tibo's base +1 projectile: 3 fries at level 1 and 6 at level 8. They leave 0.06 s apart.
- **Standing still.** If Tibo is not moving when the cooldown comes up, the volley is a single fry that travels at 35% speed (`dripSpeed`), about 70 units per second. <small>[sim-CrpXuTSY.js: `let d=Jf(e)?i.speed*n.dripSpeed:i.speed`]</small>
- **Direction.** Fries go straight back from Tibo's facing. The first fry of a volley deviates by up to 0.25 rad (about 14°, `spread`); later fries deviate by up to twice that, so a volley fans out into a cone about 60° wide. <small>[sim-CrpXuTSY.js: `l=r(-e.player.fy[c],-e.player.fx[c])+e.rng.range(-n.spread,n.spread)*(a>0?2:1)`]</small>
- **Pierce.** A fry with Pierce 1 passes through one pest and stops at the second; each point of Pierce adds one more pest.

## Tips

- The weapon rewards kiting: keep moving away from the crowd so the fries go into it. Facing a group head-on points the fries away from it.
- Extra Amount only adds fries to the moving volley; the still drip stays at one fry, so it pays off only if you keep moving.
