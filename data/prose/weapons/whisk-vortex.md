## Overview

Whisk Vortex drops a clover-shaped whirlpool on a crowd of pests near Tibo. The whirlpool damages everything inside it several times a second and keeps tugging nearby pests towards its centre, so it gathers a crowd and grinds it down in place.

At level 1 it casts two whirlpools every 3.2 s, but only when a pest is within 130 units of Tibo. The weapon's own amount is 1, and every weapon of this kind gets Tibo's base +1 amount on top (see [Stats](/stats)). Each whirlpool has a radius of 30, lasts 2 s and hits for 3 damage every 0.25 s, about eight hits per cast. Levelling raises damage to 5, the lifetime to 2.6 s and the area to 1.3, and level 7 raises the amount to 2, for three whirlpools per cast. It is a base weapon offered on level-up. At max level, with [Big Bowl](/passives/big-bowl) owned, a chest evolves it into [Stand Mixer](/weapons/stand-mixer) (see [Evolutions](/evolutions)).

## How it works

- **Placement.** The game picks a random pest within 130 units, then samples five more random pests in that range. The whirlpool goes to whichever one has the most pests within 40 units around it. "The biggest crowd" is therefore the best of six samples, not a full search of the screen. <small>[sim-CrpXuTSY.js: `c=V(e,o,s,40,e.buf.explode);c<=i||(i=c,r.x[t]=o,r.y[t]=s)`]</small>
- **Damage ticks.** Every 0.25 s the whirlpool hits every pest inside the clover shape. Area scales the shape's size.
- **Pull.** On each damage tick, pests within 60 × area units of the centre (or inside the whirlpool, if that is larger) are pushed towards the centre with a strength of 100. The push weakens inside the last 20 units, and a pest's mass reduces it by up to 95%. Bosses are never pulled. <small>[sim-CrpXuTSY.js: `p=(o-a*Math.min(1,f/Yp))*(1-Math.min(Xp,c.mass[l]))`]</small>
- **Amount.** Each point of amount adds another whirlpool to the cast, 0.1 s apart. Each one runs its own placement, so the whirlpools can land on different crowds.

## Tips

- Whisk Vortex is idle when no pest is within 130 units, and its damage per hit is low. It is most useful for holding a crowd in place for weapons that hit an area.
- Area raises both the whirlpool's size and its pull radius. That makes [Big Bowl](/passives/big-bowl), the catalyst, a good fit even before the evolution.
- The pull does not move bosses, so do not count on it to keep a boss in place.
