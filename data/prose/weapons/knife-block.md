## Overview

Knife Block unites [Mandoline Fury](/weapons/mandoline-fury) and [Moon Cleaver](/weapons/moon-cleaver). Own both evolutions, then open a [chest](/chests). Their base weapons, Peeler and Mezzaluna, do not qualify. The union replaces both partners and frees a weapon slot; see [Evolutions](/evolutions#unions).

Every 0.9 s it makes 3 pairs of chops (raw Amount 2 plus Tibo's built-in +1), 0.12 s apart. Each pair cuts in front of Tibo and behind him at once, for 6 chops per volley. Each chop has 126 raw damage and a 102.4 × 54.4 box (64 × 34 × base Area 1.6). The second pair sits 10 units lower than the first, and the third another 10 units lower.

## How it works

- **Paired chops.** Amount counts pairs, not individual chops. Each attack calls the same slash routine twice, once on each side. Facing left reverses the order without changing the two-sided coverage. <small>[sim-BZUQNEDf.js: `!0===n.twin?(ik(e,t,n,r,2*i),ik(e,t,n,r,2*i+1)):ik(e,t,n,r,i)`]</small>
- **Healing.** Each side heals `min(0.125 × pests hit, 2)` HP, reaching its own cap at 16 pests. With enough pests on both sides, a pair heals 4 HP and the default three-pair volley heals up to 12 HP, capped by Tibo's max HP. <small>[sim-BZUQNEDf.js: `n.heal!==void 0&&l>0&&wu(e,Math.min(n.heal*l,n.healCap??4))`]</small>
- **Missing-HP damage.** Like Moon Cleaver, its slash damage is multiplied by `0.8 + 1.8 × missing HP fraction`: 100.8 at full HP, 214.2 at half HP, and approaching 327.6 near zero HP, before other damage bonuses. Healing reduces the missing-HP bonus on later attacks. <small>[sim-BZUQNEDf.js: `return 1-r+(t.hpEdge.lowHpBonus+r)*n`]</small>
- **Slices both ways.** Every chop throws 2 slow slices on its own side: 4 per pair, 12 per default volley. They deal 0.5× chop damage, move at 40 units/s, live for 2.2 s × Duration (2.75 s with Tibo's base bonus), and have a 6 s rehit interval. Each rear chop also throws 3 fast shreds: 9 per volley, dealing 0.4× damage, moving at 170 units/s and living for 0.8 s × Duration (1 s with Tibo's base bonus), with a 1 s rehit interval. Both kinds pierce pests; the rear-only check follows Tibo's facing direction. <small>[sim-BZUQNEDf.js: `ak(e,t,r,n.fling,o,a),ak(e,t,r,n.flick,o,a)`]</small>

Both kinds share this weapon's per-pest hit timestamp, rather than keeping a separate timer per slice. A fast shred that hits resets the wait for the slow slices too. <small>[sim-BZUQNEDf.js: `return!(e.tick-r.hitStamp[i]<e.projectiles.rehit[t]||(r.hitStamp[i]=e.tick,0))`]</small>

**Controlled tests:** original builds `main-T9nqT8ni.js` and `main-DC1AZu0u.js`, Standard/Normal, seeds `s1/s2/s3`, granted loadouts and inserted charged single-reward chests: only the new build united the two evolutions, in either slot order; missing-partner and base/base controls did not unite. Fixed-loadout 60 s combat controls for Peeler, Mezzaluna, Mandoline Fury, Moon Cleaver, Frying Pan and Cast Iron matched the old engine. Direct original-function controls measured paired geometry, both facing directions, separate healing caps at 15/16/17 pests per side, HP scaling and 21 projectiles per default volley. These grants, held level-ups, refilled HP, pinned foes and direct calls are fixtures, not natural acquisition, drop odds, representative DPS or server acceptance.

## Tips

- **Let crowds reach both sides.** The two healing caps are separate; a crowded front does not use the rear chop's allowance.
- **Use Area for coverage.** It enlarges both chop dimensions. More Amount adds another front-and-back pair, rather than just one extra swing.
