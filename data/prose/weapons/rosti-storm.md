## Overview

Rösti Storm is the evolution of [Rösti Disc](/weapons/rosti-disc). A chest can evolve it once Rösti Disc is at max level and Tibo owns [Starch Plating](/passives/starch-plating) (see [Evolutions](/evolutions)). Every 2 seconds it throws 4 röstis, or 5 with Tibo's base +1 amount bonus, 0.15 s apart. Each one bounces around the play area around Tibo and passes through every pest it touches for 26 damage. It also explodes every time it bounces.

Its direct hit (26) is lower than a max-level Rösti Disc's 30. It makes up for that with more discs, longer life (4 s, or 5 s with Tibo's base +25% duration), slightly larger discs (area 1.2) and the bounce explosions.

## How it works

- Discs move and bounce exactly like Rösti Disc's. They start at Tibo in a random direction, flip direction at the edges of the 320 × 320 play area centred on him and have unlimited pierce.
- **Bounce explosions.** At each bounce the disc deals 60% of its damage (15.6 at base) to every pest within `explodeOnBounce` × area, 24 units at area 1.2, with knockback 1. <small>[sim-6hUEdZJv.js: `J(e,.6*n.damage[t],n.src[t],n.slot[t],1),dl(e,n.x[t],n.y[t],r)`]</small>
- Bounces happen at the play-area edges, so the explosions go off around the edges of the area around Tibo, not near Tibo himself.
- Faster discs reach the edges more often, so projectile speed from [Salt Shaker](/passives/salt-shaker) means more bounces and more explosions over each disc's life.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it launched 5 discs 0.15 s apart every 2 s, each spawned with a 5 s lifetime. All three seeds gave the same figures.

## Tips

- The explosions hit pests at the edge of the play area as they walk in towards Tibo. Pair Rösti Storm with a weapon that covers the space close to him.
