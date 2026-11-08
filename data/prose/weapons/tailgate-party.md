## Overview

Tailgate Party is the evolution of [Tailgate Fries](/weapons/tailgate-fries), made by opening a [chest](/chests) with Tailgate Fries at level 8 and [Butter Pat](/passives/butter-pat) owned. It fires the same backwards volleys, but each fry deals 57 damage instead of 28 and passes through two pests instead of one.

Every 0.5 s, a moving Tibo sprays 6 fries (raw Amount 5 plus his base +1 projectile) behind him, 0.06 s apart, in a cone about 60° wide. Each fry flies at 200 units per second for about 1 s. A Tibo standing still when the cooldown comes up drips a single fry at 35% speed instead.

## How it works

The volley rules are the same as [Tailgate Fries](/weapons/tailgate-fries#how-it-works). Whether a volley is a full spray or a drip is decided when it starts: if Tibo is still at that moment, only one fry is fired. <small>[sim-pcti3OIT.js: `t.volleyLeft=ZO(e)?1:r.amount`]</small>

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path): it fired 6 fries 0.06 s apart every 0.6 s, each spawned with a 1 s lifetime, for 47.6. All three seeds gave the same figures.

## Tips

- **Run so pests queue behind you.** Pierce 2 means each fry can hit three pests in a line, which suits the tight queue of pests that forms behind a running Tibo.
- Butter Pat stays in your passives after the evolution, and its damage bonus keeps applying to every fry.
- **Add Jet Fryer for Fry-By.** Opening a chest with both evolutions makes [Fry-By](/weapons/fry-by), combining backwards volleys with dash fans and freeing a weapon slot.
