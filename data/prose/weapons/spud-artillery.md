## Overview

Spud Artillery is the union of [Spud Lob](/weapons/spud-lob) and [Spud Cannon](/weapons/spud-cannon). Opening a [chest](/chests) when both qualify replaces them with this one weapon and frees a weapon slot (see [Evolutions](/evolutions#unions)). It throws potatoes in the high arc of Spud Lob, and like Spud Cannon's shells they explode.

Every 1.8 s it lobs 6 potatoes (raw Amount 5 plus Tibo's base +1 projectile, see [Stats](/stats)), 0.1 s apart. A potato bursts on the first pest it touches, dealing 84 damage to every pest within about 51 units (explosion radius 32 × Area 1.6) with knockback 2.

## How it works

- **Throw.** Each potato is thrown straight up the screen at 85–110% of its Speed (230), with a random sideways drift of up to 140 × (0.6 + 0.4 × Area) units per second, about 174 at its base Area. Gravity (420) then pulls it back down past Tibo, so potatoes rise roughly 45–75 units above him and fall back through the height they were thrown from about 1.1 s later. <small>[sim-BfhgrRZL.js: `o.vx[i]=e.rng.range(-n.spreadX,n.spreadX)*(.6+.4*r.area),o.vy[i]=-r.speed*e.rng.range(.85,1.1)`]</small>
- **Hitting.** A potato hits anything it passes over on the way up or down. On its first hit it explodes and is removed, so its Pierce never comes into play. The pest it touched takes the direct hit and is also inside the blast. <small>[sim-BfhgrRZL.js: `if(n.split[t]>0&&Qf(e,t,a),n.explodeRadius[t]>0)Zf(e,t),n.pool.kill(t);`]</small>
- **Misses.** A potato that touches nothing explodes wherever it is when its Duration runs out.
- **No target needed.** The weapon fires on its cooldown even when no pest is around.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it lobbed 6 potatoes 0.1 s apart every 1.8 s, each spawned with a 3.75 s lifetime. All three seeds gave the same figures.

## Tips

- Area raises both the sideways spread and the blast radius; projectile speed raises the arc.
