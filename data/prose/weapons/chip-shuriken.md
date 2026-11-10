## Overview

Chip Shuriken throws a ring of spinning chips that spiral outwards from where Tibo is standing. Every 1.6 s it releases 4 chips at once (its raw amount of 3 plus Tibo's base +1 amount, see [Stats](/stats)), spaced evenly around Tibo; each chip turns at 3 radians per second while its distance from the centre grows at 110 units per second, so the ring sweeps outwards in a swirl. Each chip deals 9 damage and can pass through 2 pests before it breaks (it hits up to 3).

Levels mostly add chips: by level 8 it fires 8 chips per throw (raw amount 7 plus 1) for 29 damage each, with pierce 3 and speed 130. Chip Shuriken is offered on level-up cards; it is not in the pool of random starting weapons. At level 8, a chest opened while Tibo holds [GPU](/passives/gpu) evolves it into [Kettle Cyclone](/weapons/kettle-cyclone).

## How it works

- **All chips fire at once.** Spiral weapons fire a single volley per cooldown containing every chip, so `interval` has no effect. <small>[sim-CJbdqtVr.js: ``return e===`strike`||e===`rain`||e===`spiral`||e===`nuke`||e===`turret` ``]</small>
- **Spacing**: chips are spread evenly over a full circle, and the starting angle advances by 0.4 rad on each throw, so consecutive rings do not line up. <small>[sim-CJbdqtVr.js: `rA(e,t,r,a+o/r.amount*O,T.spiral`]</small>
- **The spiral is anchored where it was thrown.** Its centre is Tibo's position at the moment of the throw; the chips do not follow him afterwards. <small>[sim-CJbdqtVr.js: `i.ox[s]=e.player.x[e.me]`]</small>
- **Motion**: each chip starts 6 units from the centre. Its angle grows by `spin` rad/s and its radius by its speed per second. <small>[sim-CJbdqtVr.js: `r.orbitR[t]+x(r.vx[t],r.vy[t])*n`]</small> Projectile speed bonuses (such as [Salt Shaker](/passives/salt-shaker)) make the ring expand faster, not spin faster.
- **Lifetime** is the weapon's duration (1.6 s) times Tibo's duration stat, which starts at +25% (see [Stats](/stats)). At base values a chip ends roughly 6 + 110 × 2 = 226 units out, after a bit less than one full turn.
- **Pierce**: a chip with pierce N hits N + 1 different pests; it is destroyed on the hit after its pierce runs out. <small>[sim-CJbdqtVr.js: `r<=0?n.pool.kill(t):n.pierce[t]=r-1`]</small>

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 every throw released 4 chips on the same tick, every 1.6 s, each spawned with a 2 s lifetime and pierce 2; at level 8 it released 8 chips every 1.6 s with pierce 3. The in-game stat table shows the raw amounts (3 and 7). All three seeds gave the same figures.

## Tips

- **Chips hit pests next to Tibo best.** Close to Tibo the chips are tightly packed, and they spread out as the ring grows. Pests next to Tibo are the most likely to be hit.
- Extra projectiles from passives add chips to every ring, which is the main way the weapon scales.
