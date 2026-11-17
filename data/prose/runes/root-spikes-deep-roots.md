## How it works

Deep Roots changes **which pest gets a strike center first**. Remaining Amount can pick other eligible pests, but the same pest cannot be chosen twice in one dispatch. It does not make all strikes chase the first target during their warning. <small>[sim-DUPRGVJF.js: `` id:`root-spikes-deep-roots` ``]</small>

The strike consumer handles Amount **inside one dispatch**, marking each picked target before choosing the next. It stops when no unpicked eligible target remains. Strike radius is definition size × Area, not √Area. This is a cap on selected centers, not on enemies caught by each circle. <small>[sim-DUPRGVJF.js: `` for(let o=0;o<r.amount;o++){let o=Nj(e,t,n.range,i);if(o===void 0)return;wd(e,o,i) ``]</small> <small>[sim-DUPRGVJF.js: `` a=n.size*r.area ``]</small>

Root Spikes stores the target’s position when placing the warning. Only when its **nominal 0.3-second delay** ends does the original zone system resolve the circle against current enemy positions. In these 60 Hz fixtures, repeated floating-point timer subtraction completes on **tick 19 (about 0.317 s)**, not tick 18. Bodies moved just inside/outside the stored circle during the warning receive one hit/no hit respectively; the original hit resolver confirms HP loss. <small>[sim-DUPRGVJF.js: `` n.delay[i]=a-t,a-t<=0&&KP(e,i) ``]</small> <small>[sim-DUPRGVJF.js: `` VP(e,t),Hd(e,r,i,n.radius[t]) ``]</small>

Priority compares **maximum HP inside the search range**; equal maximum HP prefers the nearer eligible pest. Range exclusion still applies. The asymmetric control has max HP 1,000,000 / 3,000,000 but current HP 1,000,000 / 10,000, so maximum HP and remaining HP predict opposite choices. <small>[sim-DUPRGVJF.js: `` let f=u.maxHp[d] ``]</small> <small>[sim-DUPRGVJF.js: `` f<c||f===c&&h>=l ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 3 / 2 | 26 / 26 | 1 / 1 | 2.4 |
| 3 | 6 / 2 | 26 / 26 | 1 / 1 | 2.4 |
