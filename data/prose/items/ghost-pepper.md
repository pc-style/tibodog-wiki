## Overview

Ghost Pepper is a Rare item that extends Tibo's dash invulnerability. A dash lasts 9 ticks (0.15 s), and Tibo cannot be hit during it. Ghost Pepper keeps him untouchable for another 0.15 s after the dash ends, which doubles the safe window to 0.30 s. <small>[sim-BsDYg9eQ.js: `t.dashShield[r]=e.cfg.dash.ticks+function(e){return Math.round(60*e.loadout.stats.dashGraceSec)}(e)`]</small>

You can only hold one copy. After you pick it up, it leaves the item pool. It has weight 6 out of 131 among Rare items, about 0.46% of item rolls at luck 0 with the full pool eligible and no weapon-catalyst weight bonuses. It has no evolution.

## How it works

The dash shield is checked just before the dodge roll and has the same exception: neither one stops damage from biome terrain or hazard pools ([Stats](/stats#dodge)). <small>[sim-BsDYg9eQ.js: `e.over||!r&&Dl(e))return!1;if(!r&&s.evasion>0&&e.rng.chance(s.evasion))`]</small>

## Tips

- **Pair it with Butter Socks.** The base dash has a 4 s cooldown and a single charge. [Butter Socks](/passives/butter-socks) adds charges and shortens the cooldown, so it gives Ghost Pepper many more windows to work with.
- The extra 0.15 s makes it more forgiving to dash through bullets and enemy bodies, because Tibo is still safe for a moment after he lands.
