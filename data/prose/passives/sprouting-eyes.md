## Overview

Sprouting Eyes gives Tibo's weapons extra projectiles. It adds +1 at levels 1 and 2, +2 at levels 3 and 4 and +3 at level 5, so only levels 1, 3 and 5 change anything (in-game: “+1 projectile at levels 1, 3 and 5.”).

It is the catalyst for [Bottomless Sack](/weapons/bottomless-sack) (from [Grab Bag](/weapons/grab-bag)), [Thunder Tuber](/weapons/thunder-tuber) (from [Starch Bolt](/weapons/starch-bolt)) and [Russet Ricochet](/weapons/russet-ricochet) (from [Skipping Cannonball](/weapons/skipping-cannonball)). For the cannonballs, amount adds bounces rather than extra fan shots.

## How it works

The values per level are totals, not increments: the game reads the array entry for the current level.<small>[sim-CGWtUfyF.js: ``function _i(e,t){return t<=0?0:typeof e==`number`?e*t:e[Math.min(t,e.length)-1]??0}``]</small> All amount bonuses are added, rounded down and added to each weapon's own amount.

The bonus is skipped for `aura`, `cone`, `nuke` and `ring` weapons.<small>[sim-CGWtUfyF.js: ``return e!==`aura`&&e!==`cone`&&e!==`nuke`&&e!==`ring` ``]</small> Among base weapons that means [Steam Vent](/weapons/steam-vent), [Deep Fryer](/weapons/deep-fryer), [Reset Button](/weapons/reset-button) and [Root Cellar](/weapons/root-cellar). Other weapons use amount in their own way, for example more wedges in a fan for [Gem Sling](/weapons/gem-sling) or more wires for [Potato Battery](/weapons/potato-battery).

Other amount sources are [GPU](/passives/gpu) (+1) and [Extra Eye](/items/extra-eye) (+1 per copy).

## Tips

- **Push through levels 2 and 4.** Levels 2 and 4 add nothing by themselves. They are still needed to reach levels 3 and 5.
- Sprouting Eyes at level 5 and GPU together give +4 projectiles to every weapon that uses amount.
