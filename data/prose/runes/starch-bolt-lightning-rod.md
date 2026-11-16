## How it works

Lightning Rod chooses the highest-maximum-HP eligible pest **first**, then uses distinct targets for remaining strikes. That priority is not based on remaining HP and does not let one isolated pest absorb all the unused Amount. <small>[sim-B3FDQRPx.js: `` id:`starch-bolt-lightning-rod` ``]</small>

The strike consumer handles Amount **inside one dispatch**, marking each picked target before choosing the next. It stops when no unpicked eligible target remains. Strike radius is definition size × Area, not √Area. This is a cap on selected centers, not on enemies caught by each circle. <small>[sim-B3FDQRPx.js: `` for(let o=0;o<r.amount;o++){let o=Xk(e,t,n.range,i);if(o===void 0)return;pd(e,o,i) ``]</small> <small>[sim-B3FDQRPx.js: `` a=n.size*r.area ``]</small>

Starch Bolt has **no warning zone**: the selected circles queue hits during the attack, then the original hit processor applies HP loss. These two-target controls use separated circles, so the observed strike count is not inflated by overlapping explosions. <small>[sim-B3FDQRPx.js: `` else jd(e,s,c,a),R(e,`strike`,s,c,a,Ad(e)) ``]</small>

Priority compares **maximum HP inside the search range**; equal maximum HP prefers the nearer eligible pest. Range exclusion still applies. The asymmetric control has max HP 1,000,000 / 3,000,000 but current HP 1,000,000 / 10,000, so maximum HP and remaining HP predict opposite choices. <small>[sim-B3FDQRPx.js: `` let f=u.maxHp[d] ``]</small> <small>[sim-B3FDQRPx.js: `` f<c||f===c&&h>=l ``]</small>

Other computed-stat scales: **damage ×1.18**. These are not measured sustained-DPS ratios. <small>[sim-B3FDQRPx.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 2 / 2 | 21.24 / 21.24 | 1 / 1 | 2 |
| 3 | 5 / 2 | 21.24 / 21.24 | 1 / 1 | 2 |
