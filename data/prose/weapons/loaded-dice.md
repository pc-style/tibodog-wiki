## Overview

Loaded Dice is the evolution of [Spud Dice](/weapons/spud-dice). To get it, have Spud Dice at level 8 and own [Four-Eyed Spud](/passives/four-eyed-spud), then open a [chest](/chests). See [Evolutions](/evolutions).

It throws 4 dice (raw amount 3 plus Tibo's base +1, see [Stats](/stats)) every 1.4 s, 0.08 s apart, each dealing 26 raw damage. Base area 1.4 gives a blast radius of about 34 units. The faces have the same effects as on Spud Dice (dud, freeze, burn, split, gold, blast). The difference is the roll: in the game's words, “Rolls two dice and keeps the higher. A pair doubles the throw.”

## How it works

- **Roll.** Each die rolls two d6 and keeps the higher. If the two rolls match, the throw's damage is doubled on top of the face effect. <small>[sim-CvmkyGNp.js: `let t=e.rng.int(1,6);t===i&&(a=!0),i=Math.max(i,t)`]</small> <small>[sim-CvmkyGNp.js: `a&&(r.damage[t]=2*r.damage[t])`]</small> The doubling applies to damage only, not to the blast radius.
- **Split dice.** A split face fires two extra dice with the weapon's normal damage. They are not doubled by a pair and have no face effect.
- **Luck.** Despite the [Four-Eyed Spud](/passives/four-eyed-spud) catalyst, the roll is plain random; [luck](/stats) does not change it.

### Face odds

Keeping the higher of two rolls shifts the odds toward high faces:

| Face | Chance |
|---|---|
| 1 (dud) | 1/36 (2.8%) |
| 2 (freeze) | 3/36 (8.3%) |
| 3 (burn) | 5/36 (13.9%) |
| 4 (split) | 7/36 (19.4%) |
| 5 (gold) | 9/36 (25%) |
| 6 (blast) | 11/36 (30.6%) |

A pair comes up 1 time in 6. The best result, double sixes (1/36), deals 6× damage over a 1.6× radius. Double ones still give a dud, at half damage instead of a quarter.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 40 to 110 units to Tibo's right): it threw 4 dice every 1.4 s, each spawned with a 2.5 s lifetime, plus 2 more for every die that rolled a split. All three seeds gave the same figures.

## Tips

- **It is much more consistent than Spud Dice.** Duds become rare (under 3%) and the big 6 face comes up almost a third of the time, so Loaded Dice is much more consistent than Spud Dice. Averaged over all rolls, the damage multiplier from faces and pairs works out to about 1.8× per throw (split extras not counted).
