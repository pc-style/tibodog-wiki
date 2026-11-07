## Overview

Golden Fry raises gold gain by 0.2 per level, so gold income is multiplied by ×1.2 at level 1 and ×2 at level 5. Gold buys items at the Fry Cart, opens Potato Crates, spins Tater Slots and trains dogs at the Dog Kennel (see [Points of interest](/points-of-interest)).

It is the catalyst for [Golden Harvest](/weapons/golden-harvest), the evolution of [Potato Rain](/weapons/potato-rain) (“A downpour of golden potatoes. Kills can drop gold.”).

## How it works

The gold gain multiplier is `(1 + gold gain) × (1 + 0.5 × curse)` (see [Stats](/stats)). It applies to:

- every gold coin picked up<small>[sim-DkPbThzu.js: `let t=1*a*i.greedMult*(e.time<e.goldRushUntil?e.goldRushMult:1)`]</small>
- gold inside chests, and the 20-gold fallback reward when a chest has nothing else to give (see [Chests](/chests#gold-in-chests))
- the gold from accepting a [Moldy Shrine](/points-of-interest#moldy-shrine)
- the gold in poteto's gift chest (see [Visitors](/visitors#poteto))

It does not apply to the bonus gold from a [Tater Slots](/points-of-interest#tater-slots) triple, which is added after the multiplier.

Other gold gain sources are [Penny Spud](/items/penny-spud) (+0.08), [Golden Gravy](/items/golden-gravy) (+0.15), the aura of the dog [Frank](/dogs/dachshund) and [Spud Shrine](/points-of-interest#spud-shrine) blessings. Curse also raises gold, through the second factor.

## Tips

- **Take it only if you will spend gold.** Gold only helps if you spend it. Golden Fry fits runs where you plan to use the Fry Cart, Potato Crates or the Dog Kennel often.
- Crate prices rise with each crate bought (see [Potato Crate](/points-of-interest#potato-crate)), so extra gold buys fewer extra crates later in a run.
