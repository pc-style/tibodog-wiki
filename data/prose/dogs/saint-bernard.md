## Overview

Barrel the Saint Bernard is one of the eight ordinary breeds, and one of the two rarest (weight 8 of 80, tied with the [Greyhound](/dogs/greyhound)). Tibo recruits it by walking onto a [Stray Dog](/points-of-interest#stray-dog); another Saint Bernard stray later levels it up.

When Tibo's health drops below 40% of his max HP, Barrel runs to him and heals 25 HP. It can then rescue again after 20 seconds. Its aura adds +0.2 HP per second of recovery, the largest recovery aura of any single dog (+0.8 HP/s at level 5). Training raises the heal to about 71 HP and shortens the wait to about 9.2 s at level 5. The 40% threshold stays the same at every level.

## How it works

- Barrel checks Tibo's health every 0.25 s. The 20 s interval only starts after a rescue, so the first time Tibo falls below 40% after a healthy stretch, Barrel reacts at once. <small>[sim-JoUvrIFk.js: `` case`rescue`:return!(e.player.hp[e.me]>=e.loadout.stats.maxHp*n.threshold ``]</small>
- Barrel runs to the spot where Tibo stood, at twice its speed (150 units per second), for at most 0.5 s. The heal happens when it arrives, without checking HP again.
- The heal is `25 × power` HP: 25, 35, 49, about 59 and about 71 at levels 1 to 5. Healing never goes above max HP.

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; Barrel added at Tibo's side and trained with the sim's own dog-join and dog-level-up functions; Tibo's HP held at or below 30% of max every tick; Tibo standing still; level-ups taking the first offer; 150 s; rescues timed from the game's `dogAbility` events): with Tibo always below the threshold, the first rescue came 1 s after joining. After that Barrel rescued every 20 s at level 1 and every 9.25 s at level 5. 9.25 s is the 9.248 s interval rounded to whole ticks.

## Tips

- The heal is a flat amount, so it matters less as max HP grows. At base 100 HP, a level 1 rescue is a quarter of Tibo's health; with [Gravy Heart](/passives/gravy-heart) and HP items it is a smaller share.
- Barrel and recovery from [Root Network](/passives/root-network) (+0.25 HP/s per level) stack. A level 5 Barrel's aura alone heals 48 HP a minute.
- Barrel works best as a safety net against a sudden drop in HP. It does not replace dodge, armor or [Link's](/dogs/pomeranian) fluff, which stop damage before it lands.
