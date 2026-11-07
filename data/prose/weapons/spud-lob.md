## Overview

Spud Lob throws heavy potatoes up into the air every 2.7 s: 2 at level 1 (its raw amount of 1 plus Tibo's base +1 amount, see [Stats](/stats)), 0.1 s apart. They arc back down past Tibo, hitting pests along the way. A potato deals 25 raw damage to each pest it touches, going up or coming down. At level 1 it can hit 4 pests (pierce 3) before it is used up. It is not aimed and fires whether or not pests are nearby.

It is offered on level-up cards, is in the starting-weapon pool, and is one of the weapons [poteto](/visitors) can hand out. At level 8 it throws 4 potatoes (raw amount 3 plus 1, 0.1 s apart) for 70 raw damage, each able to hit 8 pests. With [Butter Pat](/passives/butter-pat) owned, a [chest](/chests) evolves it into [Sack of Russets](/weapons/sack-of-russets). Sack of Russets then unites with [Spudzooka](/weapons/spudzooka) into [Spud Artillery](/weapons/spud-artillery), whose lobbed potatoes explode. See [Evolutions](/evolutions).

## How it works

- **Launch.** Every potato goes straight up the screen (toward the top of the play area) at the weapon's speed times a random 0.85–1.1. It also gets a random sideways speed of up to `spreadX` (90) × (0.6 + 0.4 × area) units per second, either way. <small>[sim-CssMfSN7.js: `a.vx[i]=e.rng.range(-n.spreadX,n.spreadX)*(.6+.4*r.area),a.vy[i]=-r.speed*e.rng.range(.85,1.1),a.gravity[i]=n.gravity`]</small>
- **Arc.** `gravity` (420 units/s²) pulls the potato back down every tick. <small>[sim-CssMfSN7.js: `i===C.lob?r.vy[t]=r.vy[t]+r.gravity[t]*n`]</small> At the base speed of 210 it peaks about 52 units above Tibo after 0.5 s, comes back level with him after about 1 s, and keeps falling below him for the rest of its life, 3 s or 3.75 s with Tibo's base +25% duration.
- **Hits.** A potato damages every pest it overlaps, rising and falling. Each potato hits a given pest only once and is used up after pierce + 1 pests.
- **Stat effects.** [Projectile speed](/stats) raises the arc, area widens the sideways scatter, and pierce bonuses add hits per potato.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it threw 2 potatoes 0.1 s apart every 2.7 s, each spawned with a 3.75 s lifetime and pierce 3; at level 8 it threw 4 every 2.7 s with pierce 7. All three seeds gave the same figures.

## Tips

- **Line pests up north or south.** The potatoes always cover a column above and below Tibo, not the direction he faces. Lining up so pests are directly north or south of him gets the most out of each throw.
