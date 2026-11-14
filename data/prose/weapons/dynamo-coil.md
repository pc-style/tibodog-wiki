## Overview

Dynamo Coil evolves [Spud Dynamo](/weapons/spud-dynamo) at level 8 while Tibo owns [Slow Cooker](/passives/slow-cooker), when a [chest](/chests) opens. Its raw amount of 2 gives **three sparks** with Tibo's base +1 Amount. They orbit permanently, dealing 8 raw damage per contact, with a shared 0.35 s re-hit timer per pest.

The evolution trades Spud Dynamo's stronger individual hit for permanent coverage and another spark. It remains a storm-class weapon for [Storm Sage](/modes#gear-set-rules).

## How it works

- **Always active.** The permanent flag skips the duration/recharge cycle. Duration and cooldown do not create an off phase. <small>[start-rows-2pTfaHnx.js: `` kind:`orbit`,size:18,orbitRadius:100,hitInterval:.35,permanent:!0 ``]</small>
- **Wide orbit.** The ring radius is `100 × √Area`; each spark's hit radius is `18 × Area`. Base rotation is 2.2 radians per second, before half of the projectile-speed bonus. <small>[sim-nIcq_DHZ.js: `c=n.orbitRadius*Math.sqrt(r.area),l=n.size*r.area`]</small>
- **Shared timer.** Three sparks can cover different pests, but the same pest cannot take another contact hit before 21 ticks (0.35 s). <small>[sim-nIcq_DHZ.js: `if(e.tick-i.hitStamp[a]<u)continue;i.hitStamp[a]=e.tick`]</small>
- **One continuous Storm Sage volley.** The permanent orbit stamps its firing time only on first activation. In controlled fixtures, later contacts reuse that volley rather than spending a fresh spark every tick. This is not a promise of a new fork activation whenever another spark is earned. <small>[sim-nIcq_DHZ.js: `` t.firedAt<0&&$r(t.def.id)===`storm`&&(t.firedAt=e.time),t.active=1 ``]</small>

**Measured** on original build-157 callbacks, Standard/Normal, seeds `s1/s2/s3`, with grants and supplied targets/clocks: the contact boundary includes equality; contacts before 21 ticks are suppressed; later contacts leave the original firing time unchanged and do not spend a second spark in the same volley. A supplied 1,000-HP pest takes 8 unmodified damage. Equal-state old-callback controls isolate the new hook; Dynamo Coil itself was absent from build 156. These are not natural evolution, long-run DPS or server-reward measurements.

## Tips

- More sparks improve ring coverage, not the per-pest hit limit.
- Slow Cooker is needed to evolve it, but its duration bonus does not lengthen a permanent orbit; it still helps other timed weapons.
