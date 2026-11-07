## Overview

Frank the Dachshund is one of the eight ordinary breeds. Tibo recruits it by walking onto a [Stray Dog](/points-of-interest#stray-dog) that rolls Dachshund (weight 10 of 80). Another Dachshund stray later levels it up.

Every 6 seconds Frank digs and scatters 6 coins around itself. Each dig also has a 20% chance of an extra find: a snack that heals 30 HP (70%) or a reroll (30%). Its aura adds +8% gold gain, which applies to all gold Tibo collects, including Frank's own coins. At level 5 Frank digs 17 coins every 3.1 s and the aura is +32% gold gain.

## How it works

- The coin count is `round(6 × power)`: 6, 8, 12, 14 and 17 at levels 1 to 5. Each coin is a normal gold pickup worth 1 gold before gold gain. That is 1 gold per second at level 1 and about 5.5 per second at level 5.
- The 20% bonus chance does not grow with training, but faster digging means more rolls. At level 1 that is about 1.4 snacks and 0.6 rerolls a minute; at level 5 about 2.7 snacks and 1.2 rerolls. <small>[sim-BIASVETB.js: `` e.lootRng.chance(n.bonusChance)&&(z(e,e.lootRng.chance(.7)?`heal`:`reroll`,o,s-6,30) ``]</small>
- A dig always succeeds, so Frank's timer never stalls.

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; Frank added at Tibo's side and trained with the sim's own dog-join and dog-level-up functions; HP refilled every tick; Tibo standing still; level-ups taking the first offer; 150 s; digs timed from the game's `dogAbility` events): the first dig came 1 s after joining, then one every 6 s at level 1 (24 of 24 gaps) and every 3.11–3.12 s at level 5 (47 of 47). The level 5 interval is 3.11 s rounded to whole 1/60 s ticks. The timer never stalled.

## Tips

- **Pick Frank for extra rerolls.** Frank is the only dog that produces rerolls. The other sources are pickups, elite kills, the [Seed Vault](/points-of-interest#seed-vault) and [Tater Lanterns](/points-of-interest#tater-lantern). See [Reroll, skip and banish](/level-up#reroll-skip-and-banish).
- Training pays for itself quickly. Taking Frank from level 1 to 4 at a [Dog Kennel](/points-of-interest#dog-kennel) costs 120 + 240 + 450 = 810 gold before the purchase-price multiplier. It raises the dig rate from 1 to about 4 gold per second, so the cost comes back in roughly four and a half minutes, sooner with gold gain.
- Coins land on the ground and still have to be collected. A [Golden Retriever](/dogs/retriever) or [Potato Magnet](/passives/potato-magnet) helps.
- Gold buys items at the [Fry Cart](/points-of-interest#fry-cart), opens [Potato Crates](/points-of-interest#potato-crate), spins [Tater Slots](/points-of-interest#tater-slots) and trains dogs, so an early Frank compounds over the run.
