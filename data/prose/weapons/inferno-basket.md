## Overview

Inferno Basket is the evolution of [Deep Fryer](/weapons/deep-fryer): a longer, wider blast of fryer oil that sets pests on fire. Each spray lasts 1.6 s (before duration bonuses) and hits everything in the cone every 0.12 s for 24 damage, then rests 1.2 s. The cone reaches 105 units (area 1.5) and is wider than Deep Fryer's (0.75 rad instead of 0.6).

Every hit also burns the target for 20 damage per second for 2 s, and all of the weapon's hits deal double damage to elites and bosses. It is made by opening a chest with Deep Fryer at level 8 and [Bacon Bits](/passives/bacon-bits) at any level (see [Evolutions](/evolutions) and [Chests](/chests)).

## How it works

- Trigger, spray-then-cooldown cycle and aiming are the same as on [Deep Fryer](/weapons/deep-fryer). The cone covers 0.475 rad (about 27°) either side of its aim.
- **Elite bonus**: the weapon sets an elite multiplier of 2 on its hits. <small>[sim-HQr6OS1G.js: `e.attack.eliteMult=n.eliteMult??1`]</small> It applies to elites and bosses and multiplies together with Tibo's elite damage stat from [Bacon Bits](/passives/bacon-bits). <small>[sim-HQr6OS1G.js: `(i||t.has(n,D.Elite))&&(l*=o.eliteMult*a.eliteMult[r])`]</small>
- **Burn**: a burning pest takes half the burn's damage per second every 0.5 s (every 30 ticks). <small>[sim-HQr6OS1G.js: `K(e,.5*t.burnDps[o]`]</small> Burns do not stack: a new burn keeps the higher damage per second and the longer remaining time. Burn time scales with Tibo's duration stat.
- Because the spray hits every 0.12 s, a pest in the cone keeps its burn refreshed for the whole spray and about 2 s after it.

## Tips

- With the ×2 elite multiplier and Bacon Bits, Inferno Basket is a strong pick against elites and [bosses](/bosses) if you can stay within about 100 units of them.
- Area and duration remain its best stats; projectile count still does nothing.
