## Overview

Tater Mines buries spuds around Tibo's feet. Every 2.5 seconds it drops 2 mines that stay armed for 15 seconds; when any pest comes within 14 units of a mine, it bursts for 30 damage to everything within 26 units, with heavy knockback. The stat tables show the raw values (amount 1, duration 12 s); every non-aura weapon gets +1 amount and +25% duration from Tibo's base stats (see [Stats](/stats)). <small>[sim-CrpXuTSY.js: `i[r.durationMult]=Math.max(.2,1+e.duration+t.player.baseDuration)`]</small> Levels add mines per drop (5 at level 8), raise damage to 65, enlarge the blast by 20% and shorten the cooldown to 2.1 s.

It is offered on level-up. At level 8 a chest evolves it into [Landmine Harvest](/weapons/landmine-harvest) if you own [Rotten Spud](/passives/rotten-spud). See [Evolutions](/evolutions).

## How it works

- **Placement.** Each mine lands at Tibo's position, shifted randomly by up to 14 units on each axis. Multiple mines from one drop are laid 0.1 s apart. <small>[sim-CrpXuTSY.js: `i.x[o]=e.player.x[e.me]+e.rng.range(-14,14)`]</small>
- **Trigger and blast.** A mine checks for enemies within its `trigger` radius of 14. When one is found it explodes, hitting every enemy within the blast radius (`size` 26 × area), and is removed. Area enlarges the blast but not the trigger radius. <small>[sim-CrpXuTSY.js: `function Gp(e,t){let n=e.zones;V(e,n.x[t],n.y[t],n.trigger[t],e.buf.zone)!==0&&(Up(e,t),Za(e,n.x[t],n.y[t],n.radius[t]),n.pool.kill(t))}`]</small>
- **Expiry.** A mine that is never triggered disappears quietly when its duration runs out. Further duration bonuses keep mines armed longer.
- Mines are dropped on cooldown whether or not enemies are around, and extra amount adds mines to each drop.

## Tips

- Mines only work where pests walk. Kiting in a loop, so that the crowd following Tibo crosses the spots where mines were dropped, gets the most out of them.
- Because a mine blasts a wider area than its trigger, the explosion usually catches the pests bunched up behind the first one.
