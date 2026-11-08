## Overview

Frying Pan is a melee weapon: Tibo swings a pan in a short box beside him, hitting every pest inside it. Enemy bullets inside the swing are batted back as Tibo's own projectiles. Killing elites charges the pan, so the swing after an elite kill is bigger and hits harder.

It is offered as a level-up card. At max level, with [Starch Plating](/passives/starch-plating) owned, a [chest](/chests) evolves it into [Cast Iron](/weapons/cast-iron). Cast Iron's reflected shots hit harder, pierce more pests and home in on them.

## How it works

- **Swing direction.** Swings alternate sides: the first swing in each volley goes the way Tibo faces (left or right), the second goes behind him, and further swings repeat the pair 10 units lower.<small>[sim-EYxKn8bh.js: `o=i%2==0?a:-a`]</small> Tibo's built-in +1 amount (see [Stats](/stats#stat-conversion)) means a level-1 pan already swings both ways, 0.12 s apart, even though the in-game text only mentions the front. From level 7 it gets a third swing.
- **Hit box.** Each swing covers a box 46 × Area units wide and 30 × Area units tall next to Tibo. Every pest touching it is hit once by that swing.
- **Swatting bullets.** Enemy bullets in a slightly bigger box (the same width plus a margin, 1.6 times the height) are destroyed and replaced by a projectile flying back the way the bullet came. The returned shot deals 1.5 × the pan's damage and passes through 2 pests (3 hits in total). It uses the pan's Speed (220) and Duration.<small>[sim-EYxKn8bh.js: `o.damage[y]=r.damage*n.mult,o.pierce[y]=n.pierce`]</small>
- **Elite charge.** Every elite that dies, whatever killed it, adds one charge, up to 3.<small>[sim-EYxKn8bh.js: `` t.has(r,f.Elite)&&(e.run.elitesKilled++,Jy(e),e.bigUpdate.gear&&pu(e,`elite`),e.moreVariety!==void 0&&Mi().eliteDown(e)) ``]</small> The next volley uses up all the stored charge, and every swing in that volley gets +35% size and +60% damage per charge. Full charge (3) means 2.05× size and 2.8× damage. Bosses are not elites and do not charge it. [Kiko](/dogs/shiba) also reacts to elite deaths, but its separate spirit trigger includes bosses. The charge does not raise the damage of swatted bullets, but it does enlarge the area that swats them.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; pests held 28 units to each side of Tibo): at level 1 the pan swung right, then left 0.12 s later, every 1.6 s; at level 7 and 8 a third swing hit the right side about 0.23 s after the first, every 1.4 s. Bullet swatting and elite charge were not measured. All three seeds gave the same figures.

## Tips

- **Take it against many shooters.** The pan does the most for runs that face many shooters: one swing can turn a spread of bullets into piercing shots that fly back toward the pests that fired them.
- Because the second swing goes behind Tibo, the pan also covers his back.
- Starch Plating is also the catalyst for [Hash Bulwark](/weapons/hash-bulwark), so it can be worth taking with a [Hash Brown Shield](/weapons/hash-brown-shield) build.
