## Overview

Tater Mines buries spuds around Tibo's feet. Every 2.1 seconds it drops 2 mines that stay armed for 15 seconds; when any pest comes within 14 units of a mine, it bursts for 41.4 raw damage to everything within 26 units, with heavy knockback. The stat tables show the raw values (amount 1, duration 12 s); every non-aura weapon gets +1 amount and +25% duration from Tibo's base stats (see [Stats](/stats)). <small>[sim-C4Oo36Ru.js: `i[r.durationMult]=Math.max(.2,1+e.duration+t.player.baseDuration)`]</small> Levels add mines per drop (5 at level 8), raise raw damage to 83.4, enlarge the blast by 20% and shorten the cooldown to 1.7 s.

It is offered on level-up. At level 8 a chest evolves it into [Landmine Harvest](/weapons/landmine-harvest) if you own [Rotten Spud](/passives/rotten-spud). See [Evolutions](/evolutions).

## How it works

- **Placement.** Each mine lands at Tibo's position, shifted randomly by up to 14 units on each axis. Multiple mines from one drop are laid 0.1 s apart. <small>[sim-C4Oo36Ru.js: `i.x[a]=e.player.x[e.me]+e.rng.range(-14,14)`]</small>
- **Trigger and blast.** A mine checks for enemies within its `trigger` radius of 14. When one is found it explodes, hitting every enemy within the blast radius (`size` 26 × area), and is removed. Area enlarges the blast but not the trigger radius. <small>[sim-C4Oo36Ru.js: `function mA(e,t){let n=e.zones;G(e,n.x[t],n.y[t],n.trigger[t],e.buf.zone)!==0&&(fA(e,t),bu(e,n.x[t],n.y[t],n.radius[t]),n.pool.kill(t))}`]</small>
- **Expiry.** A mine that is never triggered disappears quietly when its duration runs out. Further duration bonuses keep mines armed longer.
- Mines are dropped on cooldown whether or not enemies are around, and extra amount adds mines to each drop.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; one pest held 250 units away so no mine triggered): at level 1 it dropped 2 mines 0.1 s apart every 2.5 s, each lasting 15 s with a 26-unit blast; at level 8 it dropped 5 every 2.1 s with a 31.2-unit blast. All three seeds gave the same figures.

## Tips

- **Kite in loops over your mines.** Mines only work where pests walk. Kiting in a loop, so that the crowd following Tibo crosses the spots where mines were dropped, gets the most out of them.
- Because a mine blasts a wider area than its trigger, the explosion usually catches the pests bunched up behind the first one.
