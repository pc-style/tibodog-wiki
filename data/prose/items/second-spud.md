## Overview

Second Spud is a legendary item that gives Tibo one extra revive. You can hold at most 2. With no luck it is about 0.5% of random item rolls (2% Legendary × 1/4).

When Tibo would be reset, a revive brings him back with 50% max HP and 4 s of invulnerability. The burst knocks back nearby enemies, freezes pests and elites, slows bosses and clears nearby enemy shots (see [Stats](/stats) and [Modes](/modes)).

## How it works

- **Revive count** = `floor(revival) + the level's added revives`. Easy already gives 2 revives and Normal 1, so a Second Spud adds to those; on Hard it is your only source. <small>[sim-BsDYg9eQ.js: `i[r.revivals]=t.level.allowRevives?Math.floor(e.revival)+t.level.addedRevives:0`]</small>
- **Nightmare** allows no revives, so the item would do nothing there. The game removes it from the item pool on any level without revives. <small>[sim-BsDYg9eQ.js: `return e.cfg.level.allowRevives?n:n.filter(e=>!t(e))`]</small>
- **Stack limit.** Once you hold 2, it stops appearing in item rolls. <small>[sim-BsDYg9eQ.js: `(t.maxStacks===void 0||e.loadout.itemCount(t.id)<t.maxStacks)`]</small>

## Tips

- **Value it highest on Hard.** On Hard it is the only way to get a revive, which makes it much more valuable there than on Easy.
- Level-ups earned while Tibo is down wait until he gets up, so a revive does not waste XP.
