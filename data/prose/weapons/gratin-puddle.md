## Overview

Gratin Puddle evolves level-8 [Starch Puddle](/weapons/starch-puddle) when Tibo owns [Butter Pat](/passives/butter-pat) and opens a [chest](/chests). Each pool deals 18 raw damage every 0.35 s and slows pests to 35% speed for 0.8 s before Duration bonuses. Its raw lifetime is 3.6 s, raw cooldown 11 s and base Area 1.3.

That gives a 4.5 s pool lifetime with Tibo's base +25% Duration, before equipment. Butter Pat also boosts actual damage; the raw 18 is not the final equipped hit. Like its base weapon, Gratin Puddle belongs to the storm class used by [Storm Sage](/modes#gear-set-rules).

## How it works

- **Larger pools, longer gaps.** Targeting range is 140 units; each round pool has radius `24 × Area`, or 31.2 at its raw Area of 1.3. Its long cooldown leaves gaps unless bonuses or other weapons cover them. <small>[start-rows-CWiPGMOg.js: `` kind:`pool`,shape:`round`,size:24,hitInterval:.35,range:140,onHit:{kind:`slow`,factor:.35,seconds:.8} ``]</small>
- **Damage ticks.** Each pool runs its own 21-tick timer. Touching the edge counts, and overlapping non-trail pools can both hit. Amount adds pools; it does not make one pool tick faster. <small>[sim-BI7WLnza.js: `o.tickEvery[i]=n.hitInterval,o.rehit[i]=n.trail===void 0?0:v(n.hitInterval)`]</small>
- **Duration helps twice.** It lengthens both the pool and its slow. The base slow is a 65% reduction in movement speed, not a 35% reduction. <small>[sim-BI7WLnza.js: `Ub.seconds=r*e.loadout.stats.durationMult`]</small>
- **Storm Sage.** Hits use the same newly connected pool/set-rule path as Starch Puddle. Primary pool targets are marked before the fork lookup; repeated ticks share the weapon volley's spark decision. <small>[sim-BI7WLnza.js: `` r.def.behavior.kind===`pool`&&r.def.on!==`dash`&&oo(r.def.id)===`storm` ``]</small>

**Measured** on original build-157 callbacks, Standard/Normal, seeds `s1/s2/s3`, with granted weapon and supplied targets, clocks and rule state: contact-boundary, multiple-primary/fork, repeated-volley and negative eligibility cases pass. An unmodified fixture hit takes 1,000 HP to 982; this omits the catalyst's damage bonus deliberately. Equal-state old-callback controls isolate the new set hook, not natural build-156 availability. No natural evolution, representative DPS or server-acceptance claim is made.

## Tips

- Butter Pat strengthens the hit as well as enabling the evolution.
- Keep another source of damage for the gap between pool volleys.
