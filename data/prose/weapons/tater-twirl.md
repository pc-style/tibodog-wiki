## Overview

Tater Twirl is a base weapon: hash-brown wheels that orbit Tibo about 30 units out and hurt every pest they touch. How fast they spin and how often they can hit the same pest both depend on how fast Tibo is moving. At normal walking speed a pest in a wheel's path is hit every 0.2 s; standing still slows that to once every 1.7 s.

Tibo starts with 2 wheels (raw Amount 1 plus his base +1 projectile, see [Stats](/stats)) and gets a third at level 6. At level 8, with [Salt Shaker](/passives/salt-shaker) owned at any level, it evolves into [Tater Twister](/weapons/tater-twister) on the next [chest](/chests).

## How it works

- **Pace.** Every tick the weapon compares Tibo's movement with his base move speed (62 units per second). Walking at base speed gives a pace of 1; the pace is clamped between 0.12 (`crawl`) and 2 (`maxPace`), so move-speed bonuses can at most double it. <small>[sim-Bsmt8r-d.js: `i=60*l(n.x[r]-n.px[r],n.y[r]-n.py[r])/e.cfg.player.baseSpeed;return Math.max(t.crawl,Math.min(t.maxPace,i))`]</small>
- **Speeding up and slowing down.** The wheels catch up with a faster pace within about 0.12 s (`riseSec`). Slowing down is gradual and uses the weapon's Duration (0.5 s plus Tibo's base +25%), so the wheels keep some speed for a moment after Tibo stops. <small>[sim-Bsmt8r-d.js: `s=o>a.pace?i/n.riseSec:i/Math.max(i,r.duration)`]</small>
- **Hit rate.** A pest can be hit once every `hitInterval` ÷ pace seconds: 0.2 s at pace 1, 0.1 s at pace 2 and about 1.7 s at the crawl. This timer is shared by all wheels, so more wheels cover more of the circle but do not hit one pest more often. <small>[sim-Bsmt8r-d.js: `let c=Math.max(1,Math.round(60*n.hitInterval/a.pace))`]</small>
- **Spin.** The wheels turn at the weapon's raw Speed in radians per second times the pace: 5 rad/s (about 0.8 turns per second) at walking pace, 5.6 rad/s from level 3. Projectile speed bonuses count only half for the spin. <small>[sim-Bsmt8r-d.js: `return t.raw.speed*(1+.5*(e.loadout.stats.projSpeedMult-1))}(e,t)*a.pace`]</small>
- **Size.** The orbit radius is 30 units × √Area, and each wheel's hit circle has a radius of 8 units × Area.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP): 2 wheels at level 1 to 5 and 3 from level 6, on a 30-unit orbit at level 1. A pest moved along with a wheel every tick was hit every 12 ticks (0.2 s) while Tibo walked and every 100 ticks (1.67 s) while he stood still. All three seeds gave the same figures.

## Tips

- **Keep moving and stack move speed.** Keep moving. A still Tibo gets about an eighth of the hits, and move-speed bonuses raise both spin and hit rate up to double.
- A dash moves Tibo 48 units in 9 ticks, several times walking speed, so it briefly pushes the wheels to their maximum pace.
- Damage, Amount and Area are the stats that matter; the spin also gets a small boost from projectile speed. The weapon has no cooldown, so cooldown reduction does nothing for it.
