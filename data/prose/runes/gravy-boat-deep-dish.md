## How it works

Deep Dish converts all Amount into **one stronger, larger pool**. Its initial ×0.45 damage scale means one total Amount produces a weaker pulse; spare Amount supplies additive conversion bonuses. The shape remains a splat, so its size parameter is not a circular hit radius. <small>[sim-ChQfHUR1.js: `` id:`gravy-boat-deep-dish` ``]</small>

Gravy’s pool has a **rotated splat outline**, not a circle. Its size parameter is definition size × Area; the shape’s angular outline and the enemy’s body radius determine overlap. The first pulse occurs on the first zone tick, then every **0.4 s (24 ticks)**. The isolated level-one pool lasts 3.125 s in this fixture and hits on ticks **1, 25, 49, 73, 97, 121, 145, 169**; expiration prevents the next pulse. Damage is per pulse, not damage per second. The fixture checks bodies 0.25 units inside and outside the actual rotated outline, not a guessed circular boundary. <small>[sim-ChQfHUR1.js: `` c.radius[i]=n.size*r.area,c.life[i]=r.duration ``]</small> <small>[sim-ChQfHUR1.js: `` c.poolShape[i]=l,c.turn[i]=_o(l,c.pool.id(i)) ``]</small> <small>[sim-ChQfHUR1.js: `` let n=e.zones,r=n.tickTimer[t]-1 ``]</small> <small>[sim-ChQfHUR1.js: `` if(n.life[i]=s,s<=0) ``]</small>

After ordinary stats and rune scales, let N be computed Amount. Focus multiplies damage by **1 + 0.3 × (N − 1)** and Area by **1 + 0.45 × (N − 1)**, then sets Amount to 1. These are additive bonuses per spare Amount, not repeated compounding. <small>[sim-ChQfHUR1.js: `` t.damage*=1+r.focusDamage*e,t.area*=1+r.focusArea*e,t.amount=1 ``]</small>

Other computed-stat scales: **damage ×0.45**. These are not measured sustained-DPS ratios. <small>[sim-ChQfHUR1.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 1 / 1 | 4.275 / 4.275 | 1 / 1 | 3.4 |
| 3 | 1 / 1 | 8.1225 / 8.1225 | 2.35 / 2.35 | 3.4 |
