## How it works

Full Pour places three ordinary volleys’ worth of pools **in the same tick**, followed by ×1.95 ordinary cooldown after both conversions. Each pool keeps its own lifetime and pulse timer. This verifies placement and an isolated pool’s pulses, not total damage from overlapping pools in a natural fight. <small>[sim-DKo2qdWE.js: `` id:`gravy-boat-full-pour` ``]</small>

Gravy’s pool has a **rotated splat outline**, not a circle. Its size parameter is definition size × Area; the shape’s angular outline and the enemy’s body radius determine overlap. The first pulse occurs on the first zone tick, then every **0.4 s (24 ticks)**. The isolated level-one pool lasts 3.125 s in this fixture and hits on ticks **1, 25, 49, 73, 97, 121, 145, 169**; expiration prevents the next pulse. Damage is per pulse, not damage per second. The fixture checks bodies 0.25 units inside and outside the actual rotated outline, not a guessed circular boundary. <small>[sim-DKo2qdWE.js: `` o.radius[i]=n.size*r.area,o.life[i]=r.duration ``]</small> <small>[sim-DKo2qdWE.js: `` o.poolShape[i]=s,o.turn[i]=Eo(s,o.pool.id(i)) ``]</small> <small>[sim-DKo2qdWE.js: `` let n=e.zones,r=n.tickTimer[t]-1 ``]</small> <small>[sim-DKo2qdWE.js: `` if(n.life[i]=o,o<=0) ``]</small>

Salvo multiplies **Amount and cooldown by 3**, then sets the within-volley interval to zero, after applying ordinary scales. Strike Amount still cannot reuse a target in one dispatch; pool Amount creates separate pools. <small>[sim-DKo2qdWE.js: `` t.cooldown*=r.salvo,t.amount*=r.salvo,t.interval=0 ``]</small>

Other computed-stat scales: **damage ×2.4**, **cooldown ×0.65**. These are not measured sustained-DPS ratios. <small>[sim-DKo2qdWE.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 3 / 3 | 22.8 / 22.8 | 1 / 1 | 6.6333 |
| 3 | 12 / 12 | 22.8 / 22.8 | 1 / 1 | 6.6333 |
