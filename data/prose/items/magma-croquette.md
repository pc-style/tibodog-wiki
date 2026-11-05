## Overview

Magma Croquette is the evolved form of [Spicy Croquette](/items/spicy-croquette). Each weapon hit has a 20% chance to set off a blast at the enemy it hit. The blast deals 90% of that hit's damage to every enemy within 44 units and sets them on fire. You get it by holding Spicy Croquette with [Big Bowl](/passives/big-bowl) at level 5 and opening a [chest](/chests). Every Spicy Croquette you hold becomes a Magma Croquette, and Spicy Croquette then stops dropping. <small>[sim-D6eyfxy3.js: `let n=e.loadout,r=n.itemCount(t.item);return n.items.delete(t.item),n.items.set(t.result,n.itemCount(t.result)+r)`]</small>

The burn deals 30% of the triggering hit's damage per second for 3 seconds × Tibo's duration multiplier. Duration starts at 1.25, so by default the burn lasts 3.75 s and adds about 1.1× the hit's damage on top of the blast. <small>[sim-D6eyfxy3.js: `J(e,a*n.share,t.src,-1,.5),od(e,t,r.x[i],r.y[i],o),n.burn!==void 0&&ld(e,r.x[i],r.y[i],o,cd(e,t,a*n.burn.share,n.burn.seconds))`]</small>

## How it works

- **Trigger and stacking** work as for Spicy Croquette: only weapon hits can trigger it, the chance with *n* copies is `1 − 0.8^n`, and it fires at most 8 × *n* times per second. The per-copy cap is lower than Spicy Croquette's 12, so very fast-hitting builds gain less from the evolution than the higher chance suggests.
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; copies added directly with `giveItem`, skipping the evolution; Peeler, Small Fry, Tot Toss, Chip Shuriken, Starch Chain and Seeker Sprouts each given 5 times with `give`; `warp(240)`; HP refilled every tick; Tibo walking a slow circle; later level-ups taking the first offer). Over 180 s on seeds `s1`–`s5`, 20.1% of 20,135 rolls fired with one copy (expected 20%), and 48.3% of 16,645 with three (expected 48.8%). With the chance set to 100% in the scenario (120 s, seeds `s1`–`s3`), one copy fired 7.96–7.98 times per second. Two copies fired 11.3–12.6 per second, above one copy's limit, so the doubled limit of 16 was not reached in these runs.
- **Burns do not stack.** An enemy keeps only its strongest burn per second and its longest remaining burn time. A new, weaker burn extends the time but does not add damage. <small>[sim-D6eyfxy3.js: `function xs(e,t,n,r,i){n>=e.burnDps[t]&&(e.burnSrc[t]=i),e.burnDps[t]=Math.max(e.burnDps[t],n),e.burnT[t]=Math.max(e.burnT[t],r)}`]</small>
- **Burn ticks** land every 0.5 s for half the per-second value.
- **Size.** The radius grows with the square root of Tibo's area multiplier, so Big Bowl at level 5 (+50% area) makes the blast about 22% wider.

## Tips

- Bigger single hits make bigger blasts and burns, so it pairs well with crit and damage bonuses.
- Duration bonuses, such as [Slow Cooker](/passives/slow-cooker) or [Time Tuber](/items/time-tuber), lengthen the burn.
