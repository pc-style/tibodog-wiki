## Overview

Waffles the Corgi is one of the eight ordinary breeds. Tibo recruits it by walking onto a [Stray Dog](/points-of-interest#stray-dog) that rolls Corgi (weight 10 of 80). Another Corgi stray later levels it up.

Every 5 seconds Waffles barks and freezes every pest within 60 units of itself for 1 second. The pest's own radius is added to that range. Bosses are not frozen. Its aura adds +6 armor, or +24 at level 5. Training makes the bark wider (about 94 units at level 5), longer (about 1.56 s) and more frequent (every 2.6 s).

## How it works

- The circle is centred on Waffles, not on Tibo. Waffles follows at Tibo's side, so the two are usually close.
- Both the radius and the freeze length grow with the square root of power: `60 × √power` units and `1 × √power` seconds. <small>[sim-DgGsJ7U5.js: `(e,t,n.radius*Ii(r),n.stun*Ii(r))`]</small> A bark never shortens a longer freeze from another source, such as [Frozen Fries](/weapons/frozen-fries); the pest keeps whichever freeze ends later.
- If no pest is in range, Waffles checks again every 0.25 s, and the interval only restarts after a bark that froze something.
- At level 5 a pest that stays in range is frozen for about 1.56 s of every 2.6 s, roughly 60% of the time.

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; Waffles added at Tibo's side and trained with the sim's own dog-join and dog-level-up functions; HP refilled every tick; Tibo standing still; level-ups taking the first offer; 150 s; barks timed from the game's `dogAbility` events): the shortest gap between barks was 5 s at level 1 and 2.6 s at level 5, which was also the most common gap (32 of 43). The longer gaps are likely Waffles waiting for a pest to come in range (inference; the run did not log pest distances).

## Tips

- **Pair it with Permafrost Fries.** Frozen pests take double damage from [Permafrost Fries](/weapons/permafrost-fries) (`shatter` 2), and the check only asks whether the pest is frozen, not who froze it. A Corgi therefore feeds that evolution. <small>[sim-DgGsJ7U5.js: `a.shatter[r]>0&&t.freezeT[n]>0&&(l*=a.shatter[r])`]</small>
- The armor aura loses value as the run goes on, because armor is weighed against the attacker's level. +24 armor blocks about 32% of a hit from a level-10 pest at 0:00, but about 14% from a level-30 pest at 20:00. See [Armor](/stats#armor).
- Waffles cannot freeze a boss. In a boss fight its value is in freezing the pests that come with it.
