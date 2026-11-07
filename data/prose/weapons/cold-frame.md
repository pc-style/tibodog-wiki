## Overview

Cold Frame unites [Cold Storage](/weapons/cold-storage) and [Eternal Sprouts](/weapons/eternal-sprouts). Own both evolutions and open a [chest](/chests) to combine them and free a weapon slot. Seven sprouts circle Tibo permanently with his base +1 Amount, inside a separate freezing ring. Both sprouts and ring deal 170 raw damage per hit; bosses slow instead of freezing.

## How it works

- **Keep two distances in mind.** Sprouts orbit at `33 × √Area` units, with a hit radius of `5 × Area`. The cold band extends from `33 × Area` to `44 × Area`. At base Area 1.75, the sprouts sit about 43.7 units out with radius 8.75, while the band spans 57.75–77 units. Pests touching either edge of the band count. <small>[sim-BEypEELT.js: `s=n.orbitRadius*Math.sqrt(r.area),c=n.size*r.area`]</small> <small>[sim-BEypEELT.js: `function OE(e,t){return Math.max(0,(e.size-e.width)*t)}`]</small>
- **Sprouts and ring have separate hit timers.** A pest can take a sprout hit every 0.3 s and a ring hit every 0.9 s before cooldown or fire-rate bonuses. Touching several sprouts does not bypass the shared sprout timer, but the ring can hit on the same tick as a sprout. <small>[sim-BEypEELT.js: `let o=U(e,r),l=8*H(r)+t.slot;e.tick-o.frostStamp[l]<u`]</small> <small>[sim-BEypEELT.js: `e.tick-i.hitStamp[a]<l||(i.hitStamp[a]=e.tick,e.attack.status=El(r)?d:u,Y(e,r))`]</small>
- **Freeze with either attack.** Sprouts and ring apply a 1.2 s freeze to pests. Bosses get a 55% movement slow for 1.6 s instead. Duration multiplies these times: Tibo's base +25% makes them 1.5 s and 2 s. <small>[start-rows-CF8J9sBI.js: `` kind:`freeze`,seconds:1.2 ``]</small> <small>[start-rows-CF8J9sBI.js: `` kind:`slow`,factor:.55,seconds:1.6 ``]</small>
- **Stay active forever.** There is no off phase. Amount adds sprouts; it does not add rings. Rotation is 4.6 radians per second before bonuses, with only half the projectile-speed bonus applied. Cooldown affects the ring's re-hit interval, not the sprout timer. Duration still helps the freeze and slow even though the orbit is permanent. <small>[sim-BEypEELT.js: `n.frost!==void 0&&kE(e,t,n.frost,r)`]</small>

**Measured** on original engines `main-DfgNa9GZ.js` → `main-C4V6jx2U.js`, Standard/Normal, seeds `s1/s2/s3`: 36 union resolver fixtures cover both partner orders, missing partners and base-partner controls; only the new engine combines both evolutions and frees a slot. Thirty-three 60-second stepped combat fixtures keep the original optional rules: five existing weapons give identical old/new damage in every seed, and Cold Frame deals damage in all three. Direct original-function controls check ring edges at three Area values, separate 18-tick sprout and 54-tick ring timers, same-tick hits, pest freeze versus boss slow, Amount/Area geometry, permanent activity and timer reset. Equipment grants, held level-ups, HP refills and supplied targets/stats/clocks are fixtures, not natural acquisition, representative DPS or server acceptance.

## Tips

- **Keep pests crossing both defences.** The orbit and cold band use different Area scaling; they are not one solid damage disk.
- **Keep Slow Cooker.** It is the catalyst for both partners and still lengthens Cold Frame's freeze and boss slow after the union.
