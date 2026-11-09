## Overview

Sprout Satellites puts potato sprouts in orbit around Tibo for a few seconds at a time. At level 1, 3 sprouts (the raw amount of 2 plus Tibo's base +1 amount, see [Stats](/stats)) circle at a distance of 38 units for 5 s (4 s plus the base +25% duration), then disappear for a 3 s cooldown. Any pest a sprout touches takes 14 raw damage with knockback. Each pest can be hit by this weapon at most once every 0.4 s.

It is offered on level-up cards and is in the starting-weapon pool. At level 8 it has 5 sprouts, 48 raw damage, area 1.4, a 6.25 s orbit (5 s raw) and a 2 s cooldown. With [Slow Cooker](/passives/slow-cooker) owned, a [chest](/chests) evolves it into [Eternal Sprouts](/weapons/eternal-sprouts), which never stop orbiting.

## How it works

- **On/off cycle.** The orbit lasts for the weapon's duration (at least 0.5 s). The cooldown only starts after the sprouts disappear. <small>[sim-DDrvxPQy.js: `else if(t.active>0)--t.active,t.active<=0&&(t.cd=D(r.cooldown))`]</small> One cycle is duration + cooldown: 5 s on and 3 s off at level 1, 6.25 s on and 2 s off at level 8, counting Tibo's base +25% duration. [Duration](/stats) bonuses lengthen the on-time and cooldown bonuses shorten the gap.
- **Orbit.** Sprouts are spaced evenly around Tibo. The orbit radius is `38 × √area` and each sprout's hit radius is `6 × area`. <small>[sim-DDrvxPQy.js: `s=n.orbitRadius*Math.sqrt(r.area),c=n.size*r.area,l=Math.round(60*n.hitInterval)`]</small> At level 8 (area 1.4) that is about 45 units out, with an 8.4-unit hit radius.
- **Rotation speed.** For this weapon the `speed` stat is in radians per second. At 3.2 a sprout completes a lap in about 2 s; the level 3 upgrade raises it to 3.8. Orbit weapons get only half of Tibo's projectile speed bonus. <small>[sim-DDrvxPQy.js: `1+.5*(r.projSpeedMult-1)`]</small>
- **Hit timer.** `hitInterval` (0.4 s) is tracked per pest for the whole weapon, not per sprout. <small>[sim-DDrvxPQy.js: `if(e.tick-i.hitStamp[a]<l)continue;i.hitStamp[a]=e.tick`]</small> A pest touched by two sprouts within 0.4 s is only hit once.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still; for the ring test the clock was first warped 200 s and played 20 s to have enough pests): with 24 pests held in a ring on the orbit, at most 3 separate spots on the ring were hit on the same tick at level 1 and 5 at level 8, one per sprout. The weapon was active for 300 ticks (5 s) then off for 180 (3 s) at level 1, and 375 (6.25 s) on, 120 (2 s) off at level 8. A pest moved along with a sprout every tick was hit exactly every 24 ticks (0.4 s). All three seeds gave the same figures.

## Tips

- **Use it for coverage, not single targets.** Because of the shared hit timer, more sprouts mean more coverage around the ring rather than more damage on one pest. A single target takes at most 2.5 hits per second from this weapon.
- Pests standing closer to Tibo than the orbit, or farther out, are not touched. The ring works best on pests walking in toward Tibo, since they have to cross it.
