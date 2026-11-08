## Overview

Whisk Vortex drops a clover-shaped whirlpool on a crowd of pests near Tibo. The whirlpool damages everything inside it several times a second and keeps tugging nearby pests towards its centre, so it gathers a crowd and grinds it down in place.

Its pool has a cream spiral, a pale foam crest and a dark central eye. These are visual layers, not extra damage zones; the clover-shaped hit area and pull stay the same. <small>[boot-DvB_HqHd.js: `swirl:{armPeriod:44,wind:1.15,twist:.7,crestPx:4,bodyTo:.52,midTo:.74,troughPx:5}`]</small>

At level 1 it casts two whirlpools every 2.7 s, but only when a pest is within 130 units of Tibo. The weapon's own amount is 1, and every weapon of this kind gets Tibo's base +1 amount on top (see [Stats](/stats)). Each whirlpool has a radius of 30, lasts 2.5 s (2 s plus Tibo's base +25% duration) and hits for 3.6 damage every 0.25 s, about ten hits per cast. Levelling raises damage to 6, the lifetime to 3.25 s (2.6 s raw) and the area to 1.3, and level 7 raises the amount to 2, for three whirlpools per cast. It is a base weapon offered on level-up. At max level, with [Big Bowl](/passives/big-bowl) owned, a chest evolves it into [Stand Mixer](/weapons/stand-mixer) (see [Evolutions](/evolutions)).

## How it works

- **Placement.** The game picks a random pest within 130 units, then samples five more random pests in that range. The whirlpool goes to whichever one has the most pests within 40 units around it. "The biggest crowd" is therefore the best of six samples, not a full search of the screen. <small>[sim-DEo-fQlt.js: `c=G(e,o,s,40,e.buf.explode);c<=i||(i=c,r.x[t]=o,r.y[t]=s)`]</small>
- **Damage ticks.** Every 0.25 s the whirlpool hits every pest inside the clover shape. Area scales the shape's size.
- **Pull.** On each damage tick, pests within 60 × area units of the centre (or inside the whirlpool, if that is larger) are pushed towards the centre with a strength of 100. The push weakens inside the last 20 units, and a pest's mass reduces it by up to 95%. Bosses are never pulled. <small>[sim-DEo-fQlt.js: `p=(o-a*Math.min(1,f/dA))*(1-Math.min(fA,c.mass[l]))`]</small>
- **Amount.** Each point of amount adds another whirlpool to the cast, 0.1 s apart. Each one runs its own placement, so the whirlpools can land on different crowds.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it cast 2 whirlpools 0.1 s apart every 3.2 s, each with radius 30 and a 2.5 s lifetime, and a pest inside was hit every 0.25 s (15 ticks); at level 8 it cast 3, with radius 39 and a 3.25 s lifetime. All three seeds gave the same figures.

## Tips

- **Pair it with area weapons.** Whisk Vortex is idle when no pest is within 130 units, and its damage per hit is low. It is most useful for holding a crowd in place for weapons that hit an area.
- Area raises both the whirlpool's size and its pull radius. That makes [Big Bowl](/passives/big-bowl), the catalyst, a good fit even before the evolution.
- The pull does not move bosses, so do not count on it to keep a boss in place.
