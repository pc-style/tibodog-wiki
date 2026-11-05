## Overview

Scout the Beagle is one of the eight ordinary breeds. Tibo recruits it by walking onto a [Stray Dog](/points-of-interest#stray-dog) that rolls Beagle (weight 10 of the 80 shared by the ordinary breeds). Another Beagle stray later in the run levels it up instead of joining.

Every 8 seconds Scout sniffs. It points at the nearest unused point of interest within 900 units of itself and drops a small pile of coins at its feet: 3 at level 1, up to 8 at level 5. The coins drop on every sniff, whether or not it found anything. Its aura adds +0.1 luck, which grows to +0.4 at level 5. Training also shortens the sniff interval from 8 s to about 4.1 s.

## How it works

Scout only considers these points of interest: Potato Crates, Spud Shrines, Golden Spud Shrines, Fry Carts, Microwaves, Bot Docks, Spud Whetstones, Tater Slots, Seed Vaults, Tater Magnets, Root Tunnels, Spud Freezers, Frenzy Fryers, Dog Kennels and Stray Dogs. Moldy Shrines, Crop Patches, Beetle Nests, Boss Lairs, Dinner Bells and Tater Lanterns are never chosen. The only "can Tibo use it?" check is for strays: it skips a stray that Tibo could not take, such as one of a breed already at level 5. It still points at a Potato Crate that Tibo cannot afford. The 900-unit limit is the squared distance `81e4` (900²) in the search. <small>[sim-BfhgrRZL.js: `let r=-1,i=81e4,a=e.world.activePois`]</small>

After a sniff, a short scent trail runs from its nose towards the target. The target also gets priority for the screen-edge POI markers: when the game picks which nearby points of interest get a marker, it counts the one a dog is pointing at as half as far away. <small>[scene-B5R9w1eD.js: `` let o=a.kind===`dog`||Q8(e,a.state.uid);$8(a,Math.hypot(a.x-t,a.y-n)*(o?.5:1)) ``]</small>

Each coin is a normal gold pickup worth 1 gold, multiplied by Tibo's gold gain, so Tibo still has to collect it. Coin counts are `round(3 × power)`: 3, 4, 6, 7 and 8 at levels 1 to 5. That works out to about 0.4 gold per second at level 1 and 1.9 at level 5 before gold gain.

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; Scout added at Tibo's side and trained with the sim's own dog-join and dog-level-up functions; HP refilled every tick; Tibo standing still; level-ups taking the first offer; 150 s; sniffs timed from the game's `dogAbility` events): the first sniff came 1 s after joining, then one every 8 s at level 1 (18 of 18 gaps) and every 4.15 s at level 5 (35 of 35). 4.15 s is the 4.147 s interval rounded to whole 1/60 s ticks.

## Tips

- Treat Scout as a luck dog that also scouts, not as a gold dog. The [Dachshund](/dogs/dachshund) drops 6 coins every 6 s at level 1, more than twice Scout's 3 coins every 8 s, and adds gold gain on top.
- Scout's luck aura works like [Four-Eyed Spud](/passives/four-eyed-spud) (+0.1 per level) without using a passive slot. At level 5 Scout alone gives a 40% chance of a fourth level-up card, plus bigger chests and rarer items. See [Luck](/stats#luck).
- Pointing pays off most early in a run, while you still need to find a [Fry Cart](/points-of-interest#fry-cart), [Spud Whetstone](/points-of-interest#spud-whetstone) or [Dog Kennel](/points-of-interest#dog-kennel). A [Golden Retriever](/dogs/retriever) in the same pack pulls Scout's coins to Tibo.
