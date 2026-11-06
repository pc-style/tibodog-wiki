## Overview

Chives shortens the wait between weapon attacks. Each level adds 0.07 cooldown reduction, so weapon cooldowns are multiplied by 0.93 at level 1 and 0.65 at level 5. At level 5 weapons attack about 1.54 times as often.

It is the catalyst for [Tot Gatling](/weapons/tot-gatling), the evolution of [Tot Toss](/weapons/tot-toss).

## How it works

The cooldown multiplier is `1 − total cooldown reduction`, and the reduction is capped at 60% (see [Stats](/stats)). Chives reaches 35% on its own. Other sources are [GPU](/passives/gpu) (+0.02 per level, 10% at level 5) the [Chive Charm](/items/chive-charm) item (+0.03 each) and [Spud Shrine](/points-of-interest#spud-shrine) blessings. Chives and GPU together give 45%, still under the cap.

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; passives given with `give`, charms with `giveItem`): the game's `cooldownMult` stat read 0.93, 0.86, 0.79, 0.72 and 0.65 for Chives levels 1 to 5. With Chives and GPU both at level 5 it read 0.55; adding 4 Chive Charms gave 0.43, and 5, 6 or 20 charms all gave 0.40. 25 charms alone also gave 0.40, so the 60% cap holds.<small>[sim-DJfN0TyV.js: `i[r.cooldownMult]=1-wt(e.cooldown,-1,n.cooldownCap)`]</small>

A weapon's cooldown never drops below 0.05 s (15 s for `nuke` weapons). Weapons with no cooldown at all keep a cooldown of 0.<small>[sim-DJfN0TyV.js: `n.cooldown=i.cooldown<=0?0:Math.max(o,i.cooldown*r.cooldownMult)`]</small> Two of them read the cooldown multiplier directly instead: [Hot Streak](/weapons/hot-streak) slashes faster and [Seed Potato](/weapons/seed-potato) throws faster with Chives.<small>[sim-DJfN0TyV.js: `a.nextThrow=e.time+n.throwSec*e.loadout.stats.cooldownMult`]</small> The other base weapons with no cooldown, [Steam Vent](/weapons/steam-vent), [Gem Sling](/weapons/gem-sling), [Mash Snowball](/weapons/mash-snowball), [Spud Fence](/weapons/spud-fence), [Tater Twirl](/weapons/tater-twirl) and [Tot Stampede](/weapons/tot-stampede), get nothing from Chives.

Chives does not affect the dash cooldown, which is a separate stat (see [Butter Socks](/passives/butter-socks)).

## Tips

- The fire-rate gain grows with each level: going from 28% to 35% reduction is a bigger relative speed-up than going from 0% to 7%.
- If you also run GPU, remember that a faster cooldown does not reduce GPU heat per second. See [GPU](/passives/gpu#how-it-works).
