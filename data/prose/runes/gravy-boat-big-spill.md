## How it works

Big Spill chooses the highest-maximum-HP eligible pest as the **pool placement target**. The pool then stays at that position; it does not follow the pest or reselect it on every damage pulse. The rune boosts pulse damage, not pool duration or pulse frequency. <small>[sim-By2tGUp7.js: `` id:`gravy-boat-big-spill` ``]</small>

Gravy’s pool has a **rotated splat outline**, not a circle. Its size parameter is definition size × Area; the shape’s angular outline and the enemy’s body radius determine overlap. The first pulse occurs on the first zone tick, then every **0.4 s (24 ticks)**. The isolated level-one pool lasts 3.125 s in this fixture and hits on ticks **1, 25, 49, 73, 97, 121, 145, 169**; expiration prevents the next pulse. Damage is per pulse, not damage per second. The fixture checks bodies 0.25 units inside and outside the actual rotated outline, not a guessed circular boundary. <small>[sim-By2tGUp7.js: `` o.radius[i]=n.size*r.area,o.life[i]=r.duration ``]</small> <small>[sim-By2tGUp7.js: `` o.poolShape[i]=s,o.turn[i]=xo(s,o.pool.id(i)) ``]</small> <small>[sim-By2tGUp7.js: `` let n=e.zones,r=n.tickTimer[t]-1 ``]</small> <small>[sim-By2tGUp7.js: `` if(n.life[i]=o,o<=0) ``]</small>

Priority compares **maximum HP inside the search range**; equal maximum HP prefers the nearer eligible pest. Range exclusion still applies. The asymmetric control has max HP 1,000,000 / 3,000,000 but current HP 1,000,000 / 10,000, so maximum HP and remaining HP predict opposite choices. <small>[sim-By2tGUp7.js: `` let f=u.maxHp[d] ``]</small> <small>[sim-By2tGUp7.js: `` f<c||f===c&&h>=l ``]</small>

Other computed-stat scales: **damage ×1.48**. These are not measured sustained-DPS ratios. <small>[sim-By2tGUp7.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 1 / 1 | 14.06 / 14.06 | 1 / 1 | 3.4 |
| 3 | 4 / 4 | 14.06 / 14.06 | 1 / 1 | 3.4 |
