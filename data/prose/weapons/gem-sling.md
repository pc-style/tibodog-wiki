## Overview

Gem Sling has no timer. It fires whenever Tibo collects XP. Each XP gem he picks up flings a potato wedge in the direction he is facing. A run full of gems becomes a steady stream of wedges, and while no gems are being collected it does nothing.

At level 1 each gem flings two wedges: the weapon's amount of 1 plus Tibo's base +1 amount (see [Stats](/stats)). A wedge deals 8 damage, flies at 210 units/s for 1.125 s (0.9 s plus Tibo's base +25% duration, about 236 units) and has pierce 1, so it can hit two pests. Levelling raises damage to 18, speed to 240 and pierce to 3 (four pests per wedge). It is a base weapon offered on level-up. At max level, with [Potato Magnet](/passives/potato-magnet) owned, a chest evolves it into [Gem Catapult](/weapons/gem-catapult) (see [Evolutions](/evolutions)).

## How it works

- **One volley per gem.** Only XP gem pickups count. Gold and other pickups do not. <small>[sim-LB46ZBLZ.js: `o===D.xp)e.gemCount--,e.counters.gems++`]</small>
- **Queue.** Collected gems join a queue that holds at most 40. The sling fires for up to 2 queued gems per tick (60 ticks per second), so a big pickup of gems is fired off quickly, but any gems above 40 in the queue are lost. <small>[sim-LB46ZBLZ.js: `a.queue=Math.min(n.maxQueue,a.queue+e.counters.gems-a.seenGems)`]</small>
- **Direction.** Wedges go along Tibo's facing direction, not towards pests. Each wedge has a small random spread of up to ±0.05 rad (about 3°).
- **Amount.** Each gem fires one wedge per point of amount (two with no amount bonuses), fanned 0.16 rad (about 9°) apart and centred on Tibo's heading.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; normal spawning; the seeded starting weapon removed, Starch Bolt given to level 8 to kill pests and Gem Sling given with `give`; Tibo walking in a slow circle for 40 s; level-up cards answered with the first offer that is not an amount bonus): Tibo collected 14–26 XP gems per run and the sling fired exactly 2 wedges per gem at level 1 and at level 8, each spawned with a 1.125 s lifetime; pierce was 1 at level 1 and 3 at level 8.

## Tips

- **Take Potato Magnet before the evolution.** Gem Sling's damage depends on how many gems you collect. [Potato Magnet](/passives/potato-magnet) and other pickup-range bonuses pull in more gems per second, so the catalyst helps the sling before the evolution too.
- Since wedges fly where Tibo faces, walking towards a crowd while collecting gems aims the sling at it.
