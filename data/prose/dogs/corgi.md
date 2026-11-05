## Overview

Waffles the Corgi is one of the eight ordinary breeds. Tibo recruits it by walking onto a [Stray Dog](/points-of-interest#stray-dog) that rolls Corgi (weight 10 of 80). Another Corgi stray later levels it up.

Every 5 seconds Waffles barks and freezes every pest within 60 units of itself for 1 second. The pest's own radius is added to that range. Bosses are not frozen. Its aura adds +6 armor, or +24 at level 5. Training makes the bark wider (about 94 units at level 5), longer (about 1.56 s) and more frequent (every 2.6 s).

## How it works

- The circle is centred on Waffles, not on Tibo. Waffles follows at Tibo's side, so the two are usually close.
- Both the radius and the freeze length grow with the square root of power: `60 × √power` units and `1 × √power` seconds. <small>[sim-HQr6OS1G.js: `(e,t,n.radius*Wn(r),n.stun*Wn(r))`]</small> A bark never shortens a longer freeze from another source, such as [Frozen Fries](/weapons/frozen-fries); the pest keeps whichever freeze ends later.
- If no pest is in range, Waffles checks again every 0.25 s, and the interval only restarts after a bark that froze something.
- At level 5 a pest that stays in range is frozen for about 1.56 s of every 2.6 s, roughly 60% of the time.

## Tips

- Frozen pests take double damage from [Permafrost Fries](/weapons/permafrost-fries) (`shatter` 2), and the check only asks whether the pest is frozen, not who froze it. A Corgi therefore feeds that evolution. <small>[sim-HQr6OS1G.js: `a.shatter[r]>0&&t.freezeT[n]>0&&(l*=a.shatter[r])`]</small>
- The armor aura loses value as the run goes on, because armor is weighed against the attacker's level. +24 armor blocks about 32% of a hit from a level-10 pest at 0:00, but about 14% from a level-30 pest at 20:00. See [Armor](/stats#armor).
- Waffles cannot freeze a boss. In a boss fight its value is in freezing the pests that come with it.
