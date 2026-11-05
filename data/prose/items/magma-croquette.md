## Overview

Magma Croquette is the evolved form of [Spicy Croquette](/items/spicy-croquette). Each weapon hit has a 20% chance to set off a blast at the enemy it hit. The blast deals 90% of that hit's damage to every enemy within 44 units and sets them on fire. You get it by holding Spicy Croquette with [Big Bowl](/passives/big-bowl) at level 5 and opening a [chest](/chests). Every Spicy Croquette you hold becomes a Magma Croquette, and Spicy Croquette then stops dropping. <small>[sim-HQr6OS1G.js: `let n=e.loadout,r=n.itemCount(t.item);return n.items.delete(t.item),n.items.set(t.result,n.itemCount(t.result)+r)`]</small>

The burn deals 30% of the triggering hit's damage per second for 3 seconds × Tibo's duration multiplier. Duration starts at 1.25, so by default the burn lasts 3.75 s and adds about 1.1× the hit's damage on top of the blast. <small>[sim-HQr6OS1G.js: `K(e,a*n.share,t.src,-1,.5),Pl(e,t,r.x[i],r.y[i],o),n.burn!==void 0&&Ll(e,r.x[i],r.y[i],o,Il(e,t,a*n.burn.share,n.burn.seconds))`]</small>

## How it works

- **Trigger and stacking** work as for Spicy Croquette: only weapon hits can trigger it, the chance with *n* copies is `1 − 0.8^n`, and it fires at most 8 × *n* times per second. The per-copy cap is lower than Spicy Croquette's 12, so very fast-hitting builds gain less from the evolution than the higher chance suggests.
- **Burns do not stack.** An enemy keeps only its strongest burn per second and its longest remaining burn time. A new, weaker burn extends the time but does not add damage. <small>[sim-HQr6OS1G.js: `function Qa(e,t,n,r,i){n>=e.burnDps[t]&&(e.burnSrc[t]=i),e.burnDps[t]=Math.max(e.burnDps[t],n),e.burnT[t]=Math.max(e.burnT[t],r)}`]</small>
- **Burn ticks** land every 0.5 s for half the per-second value.
- **Size.** The radius grows with the square root of Tibo's area multiplier, so Big Bowl at level 5 (+50% area) makes the blast about 22% wider.

## Tips

- Bigger single hits make bigger blasts and burns, so it pairs well with crit and damage bonuses.
- Duration bonuses, such as [Slow Cooker](/passives/slow-cooker) or [Time Tuber](/items/time-tuber), lengthen the burn.
