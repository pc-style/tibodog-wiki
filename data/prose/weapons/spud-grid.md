## Overview

Spud Grid is the evolution of [Potato Battery](/weapons/potato-battery). Get Potato Battery to level 8 while you own [Root Network](/passives/root-network), then open a [chest](/chests).

It clips 3 wires at once (2 plus Tibo's built-in +1 amount, see [Stats](/stats)) to pests within 140 units. Each wire zaps everything it touches every 0.2 s for 80 damage and a 50% slow. When it lets go it discharges for 14× damage, 1,120, around the clipped pest. Unlike the battery, Spud Grid **clips bosses**: if a boss is in range and not already clipped, a wire goes to the nearest boss first.

## How it works

- Wires work as on [Potato Battery](/weapons/potato-battery): clipped pests are slowed by 85% and held at 1 HP or more until the wire lets go. The wire lasts 5 s × Duration or snaps when its target is more than 200 units from Tibo, then discharges in an 18-unit radius. The 1.5 s cooldown starts only after all three wires are gone.
- **Bosses.** Each wire first looks for the nearest unclipped boss in range, then falls back to the battery's rule: the nearest pest at least 60 units away, otherwise the farthest in range. <small>[sim-BKmk53sU.js: `!0===r.clipsBosses&&g<f&&!yp(e,a)&&(f=g,d=a)`]</small>
- A clipped boss is not pinned and gets no HP floor, so it can still die while wired. The zaps still apply their 0.3 s slow to it. <small>[sim-BKmk53sU.js: `H(s)||ek(e,s,n.pin[o])`]</small>
- Each wire is 12 units wide (8 × its 1.5 Area).

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 60 to 90 units from Tibo): it clipped 3 wires at once; each lasted 6.25 s (5 s plus the base +25% duration), new wires followed 7.75 s apart, zaps came every 0.2 s for 80 and each release dealt 1,120. All three seeds gave the same figures.

## Tips

- **Unite with Taproot Eruption.** A chest can combine the two evolutions into [Root Current](/weapons/root-current), adding repeating root bursts to its wires.
- **Keep the boss close to hold the wire.** In boss fights, one wire stays on the boss and zaps every pest between it and Tibo. Keeping the boss within 200 units keeps the wire up for the full duration.
- The discharge has a small, fixed radius (18 units, not scaled by Area). Its 1,120 damage mostly finishes off the clipped pest and anything bunched right next to it.
