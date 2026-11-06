## Overview

Rösti Disc throws a flat rösti in a random direction. The disc passes through every pest in its path and bounces back whenever it reaches the edge of the area around Tibo. Every 2.6 seconds it launches 1 disc, or 2 with Tibo's base +1 amount bonus (see [Stats](/stats)), 0.2 s apart. Each disc deals 10 damage per hit, travels at 180 units/s and lasts 2.5 s (about 3.1 s with Tibo's base +25% duration).

You get it from a level-up card. At level 8 it launches 4 discs (3 + 1) for 30 damage, at 240 units/s, lasting 3.3 s before duration bonuses. With a max-level Rösti Disc and [Starch Plating](/passives/starch-plating), a chest can evolve it into [Rösti Storm](/weapons/rosti-storm).

## How it works

- **Bouncing.** The bounce box is the 320 × 320 play area centred on Tibo (`view.playWidth` and `playHeight` in the config). When a disc crosses the left or right edge while moving outward, its horizontal direction flips. The top and bottom edges work the same way for vertical movement. The box moves with Tibo, so discs stay around him as he walks. <small>[sim-Davaqo7b.js: `(r<a-s&&l<0||r>a+s&&l>0)&&(n.vx[t]=-l,DC(e,t))`]</small>
- **Pierce.** The 99 pierce counts as unlimited, so a disc never breaks on hitting pests.
- Each launch direction is random and the discs do not aim. Projectile speed from [Salt Shaker](/passives/salt-shaker) makes discs cross the box faster. Duration keeps them alive longer. Area makes each disc bigger, scaling its radius with the square root of area.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it launched 2 discs 0.2 s apart every 2.6 s, each spawned with a 3.125 s lifetime; at level 8 it launched 4 with a 4.125 s lifetime. All three seeds gave the same figures.

## Tips

- **Use it on surrounding crowds, not bosses.** The discs cover the whole area around Tibo without aiming. That makes Rösti Disc good at clearing pests that surround him and poor at focusing a single target such as a boss.
