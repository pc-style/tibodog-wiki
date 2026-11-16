## How it works

Big Bolt concentrates the computed Amount into **one stronger, wider immediate strike**. It gives up extra centers, not merely extra visual bolts. A bigger circle can still overlap several pests; one center is not a one-enemy damage cap. <small>[sim-CQ8ALNnZ.js: `` id:`starch-bolt-big-bolt` ``]</small>

The strike consumer handles Amount **inside one dispatch**, marking each picked target before choosing the next. It stops when no unpicked eligible target remains. Strike radius is definition size × Area, not √Area. This is a cap on selected centers, not on enemies caught by each circle. <small>[sim-CQ8ALNnZ.js: `` for(let o=0;o<r.amount;o++){let o=ij(e,t,n.range,i);if(o===void 0)return;kd(e,o,i) ``]</small> <small>[sim-CQ8ALNnZ.js: `` a=n.size*r.area ``]</small>

Starch Bolt has **no warning zone**: the selected circles queue hits during the attack, then the original hit processor applies HP loss. These two-target controls use separated circles, so the observed strike count is not inflated by overlapping explosions. <small>[sim-CQ8ALNnZ.js: `` else qd(e,s,c,a),R(e,`strike`,s,c,a,Kd(e)) ``]</small>

After ordinary stats and rune scales, let N be computed Amount. Focus multiplies damage by **1 + 0.5 × (N − 1)** and Area by **1 + 0.3 × (N − 1)**, then sets Amount to 1. These are additive bonuses per spare Amount, not repeated compounding. <small>[sim-CQ8ALNnZ.js: `` t.damage*=1+r.focusDamage*e,t.area*=1+r.focusArea*e,t.amount=1 ``]</small>

Other computed-stat scales: **damage ×1.05**. These are not measured sustained-DPS ratios. <small>[sim-CQ8ALNnZ.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 1 / 1 | 28.35 / 28.35 | 1.3 / 1.3 | 2 |
| 3 | 1 / 1 | 56.7 / 56.7 | 2.2 / 2.2 | 2 |
