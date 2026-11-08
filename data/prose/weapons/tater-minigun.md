## Overview

Tater Minigun is the evolution of [Locked Gatling](/weapons/locked-gatling). A chest evolves Locked Gatling into it once Locked Gatling is at max level and Tibo owns [Masher Grip](/passives/masher-grip) (see [Evolutions](/evolutions)). It fires the same locked 2 s bursts with a 0.35 s pause between them.

The only change from a max-level Locked Gatling is damage. Each tot deals 20.4 instead of 12, 1.7 times as much. The fire interval stays at 0.10 s (about 20 shots per burst), pierce at 2 (up to three pests per tot), and speed and flight time at 220 units/s for 1.2 s.

## How it works

Bursts lock onto the nearest pest within 220 units as described on [Locked Gatling](/weapons/locked-gatling#how-it-works). Every tot in a burst flies along the angle taken at the start, from wherever Tibo is when it fires. Each point of amount is one lane, 7 units from the next. With Tibo's base +1 amount that is two lanes before any amount bonuses. <small>[sim-BYbipzJm.js: `l=(i-.5*(r.amount-1))*n.lane`]</small>

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): a burst was 21 shots 0.1 s apart over 2 s, a new burst began every 2.35 s, each shot was 2 tots of 20.4, and only the 3 nearest pests were hit (pierce 2). All three seeds gave the same figures.

## Tips

- **Stack amount bonuses.** Each lane is a full stream of tots, so amount bonuses scale this weapon directly.
- As with the base weapon, you can sweep the locked stream across a crowd by moving sideways to the firing angle.
