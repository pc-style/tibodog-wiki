## Overview

Frank the Dachshund is one of the eight ordinary breeds. Tibo recruits it by walking onto a [Stray Dog](/points-of-interest#stray-dog) that rolls Dachshund (weight 10 of 80). Another Dachshund stray later levels it up.

Every 6 seconds Frank digs and scatters 6 coins around itself. Each dig also has a 20% chance of an extra find: a snack that heals 30 HP (70%) or a reroll (30%). Its aura adds +8% gold gain, which applies to all gold Tibo collects, including Frank's own coins. At level 5 Frank digs 17 coins every 3.1 s and the aura is +32% gold gain.

## How it works

- The coin count is `round(6 × power)`: 6, 8, 12, 14 and 17 at levels 1 to 5. Each coin is a normal gold pickup worth 1 gold before gold gain. That is 1 gold per second at level 1 and about 5.5 per second at level 5.
- The 20% bonus chance does not grow with training, but faster digging means more rolls. At level 1 that is about 1.4 snacks and 0.6 rerolls a minute; at level 5 about 2.7 snacks and 1.2 rerolls. <small>[sim-CrpXuTSY.js: `` e.lootRng.chance(i.bonusChance)&&(G(e,e.lootRng.chance(.7)?`heal`:`reroll`,c,l-6,30) ``]</small>
- A dig always succeeds, so Frank's timer never stalls.

## Tips

- Frank is the only dog that produces rerolls. The other sources are pickups, elite kills, the [Seed Vault](/points-of-interest#seed-vault) and [Tater Lanterns](/points-of-interest#tater-lantern). See [Reroll, skip and banish](/level-up#reroll-skip-and-banish).
- Training pays for itself quickly. Taking Frank from level 1 to 4 at a [Dog Kennel](/points-of-interest#dog-kennel) costs 120 + 240 + 450 = 810 gold before the purchase-price multiplier. It raises the dig rate from 1 to about 4 gold per second, so the cost comes back in roughly four and a half minutes, sooner with gold gain.
- Coins land on the ground and still have to be collected. A [Golden Retriever](/dogs/retriever) or [Potato Magnet](/passives/potato-magnet) helps.
- Gold buys items at the [Fry Cart](/points-of-interest#fry-cart), opens [Potato Crates](/points-of-interest#potato-crate), spins [Tater Slots](/points-of-interest#tater-slots) and trains dogs, so an early Frank compounds over the run.
