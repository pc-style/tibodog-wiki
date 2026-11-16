## How it works

Jouster aims the lance toward the eligible pest with the highest **maximum HP**, even when that pest has much less current HP than a nearby one. It does not turn the beam into a homing projectile or make every extra ray converge on that pest. <small>[sim-CQ8ALNnZ.js: `` id:`fry-lance-jouster` ``]</small>

The original attack checks a **line segment plus half the beam width and the enemy’s body radius**. It applies a hit immediately; the lingering beam graphic is not a damage-over-time field. Length is definition length × √Area; width is definition size × Area. Extra Amount rays alternate offsets of **+0.35, −0.35, +0.70 radians** around the chosen aim, with ordinary within-volley spacing. <small>[sim-CQ8ALNnZ.js: `` l=n.length*Math.sqrt(r.area),u=n.size*r.area ``]</small> <small>[sim-CQ8ALNnZ.js: `` An(q(e,n),J(e,n),a,o,d,f)<=u/2+Od(e,n)&&Z(e,n) ``]</small>

Priority compares **maximum HP inside the search range**; equal maximum HP prefers the nearer eligible pest. Range exclusion still applies. The asymmetric control has max HP 1,000,000 / 3,000,000 but current HP 1,000,000 / 10,000, so maximum HP and remaining HP predict opposite choices. <small>[sim-CQ8ALNnZ.js: `` let f=u.maxHp[d] ``]</small> <small>[sim-CQ8ALNnZ.js: `` f<c||f===c&&h>=l ``]</small>

Other computed-stat scales: **damage ×1.2**. These are not measured sustained-DPS ratios. <small>[sim-CQ8ALNnZ.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 1 / 1 | 31.2 / 31.2 | 1 / 1 | 2 |
| 3 | 4 / 4 | 31.2 / 31.2 | 1 / 1 | 2 |
