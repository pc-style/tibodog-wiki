## Overview

Inferno Basket is the evolution of [Deep Fryer](/weapons/deep-fryer): a longer, wider blast of fryer oil that sets pests on fire. Each spray lasts 1.6 s (before duration bonuses) and hits everything in the cone every 0.12 s for 24 damage, then rests 1.2 s. The cone reaches 105 units (area 1.5) and is wider than Deep Fryer's (0.75 rad instead of 0.6).

Every hit also burns the target for 20 damage per second for 2 s, and all of the weapon's hits deal double damage to elites and bosses. It is made by opening a chest with Deep Fryer at level 8 and [Bacon Bits](/passives/bacon-bits) at any level (see [Evolutions](/evolutions) and [Chests](/chests)).

## How it works

- Trigger, spray-then-cooldown cycle and aiming are the same as on [Deep Fryer](/weapons/deep-fryer). The cone covers 0.475 rad (about 27°) either side of its aim.
- **Elite bonus**: the weapon sets an elite multiplier of 2 on its hits. <small>[sim-RltxC9X3.js: `e.attack.eliteMult=n.eliteMult??1`]</small> It applies to elites and bosses and multiplies together with Tibo's elite damage stat from [Bacon Bits](/passives/bacon-bits). <small>[sim-RltxC9X3.js: `(i||t.has(n,a.Elite))&&(d*=s.eliteMult*o.eliteMult[r])`]</small>
- **Burn**: a burning pest takes half the burn's damage per second every 0.5 s (every 30 ticks). <small>[sim-RltxC9X3.js: `J(e,.5*t.burnDps[o]`]</small> Burns do not stack: a new burn keeps the higher damage per second and the longer remaining time. Burn time scales with Tibo's duration stat.
- Because the spray hits every 0.12 s, a pest in the cone keeps its burn refreshed for the whole spray and about 2 s after it.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; one pest held 40 units to Tibo's right): each spray hit the pest 18 times, 0.12 s apart, over 2 s (1.6 s plus the base +25% duration), and a new spray began every 3.2 s. All three seeds gave the same figures.

## Tips

- With the ×2 elite multiplier and Bacon Bits, Inferno Basket is a strong pick against elites and [bosses](/bosses) if you can stay within about 100 units of them.
- Area and duration remain its best stats; projectile count still does nothing.
