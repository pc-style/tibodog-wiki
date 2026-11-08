## Overview

Gale the Saluki lunges at pests like a bite dog, but gains damage from Tibo's move-speed stat. At level 1 its raw bite is 24 damage, its target range is 120 units and its interval is 2 seconds. Its aura adds +4% move speed, so Gale supplies some of its own bonus.

## How it works

- **Raise move speed for harder bites.** The lunge multiplier is `1 + max(0, move-speed multiplier − 1)`. A ×1.5 move-speed stat gives ×1.5 bite damage; a slow below ×1 does not penalize the bite. It reads the stat, not Tibo's instantaneous walking velocity. <small>[sim-DwWYU7G5.js: `let n=Math.max(0,e.loadout.stats.moveSpeedMult-1);return 1+t.perMoveSpeed*n`]</small>
- **The ordinary bite still has to land.** Gale runs towards the selected target, then bites an enemy close to the landing point. Training power and Tibo's damage multiplier also apply. It can bite bosses, unlike [Copper Tot](/items/copper-tot).
- At level 5 the aura is +16% move speed. The generated training tables below show the exact power and interval multipliers; they are not measured DPS or a guarantee that every lunge hits.

## Tips

- **Pair Gale with move-speed bonuses.** [Spud Sneakers](/passives/spud-sneakers) can help both movement and lunge damage. Standing still does not by itself remove the stat-based damage bonus.
