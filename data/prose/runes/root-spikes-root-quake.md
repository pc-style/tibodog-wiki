## How it works

Root Quake buffs every **third strike volley**, not every third spike or warning completion. The whole dispatch shares the buff. Larger Area increases each strike circle linearly; the delay and distinct-target rule stay unchanged. <small>[sim-C-tamJE5.js: `` id:`root-spikes-root-quake` ``]</small>

The strike consumer handles Amount **inside one dispatch**, marking each picked target before choosing the next. It stops when no unpicked eligible target remains. Strike radius is definition size × Area, not √Area. This is a cap on selected centers, not on enemies caught by each circle. <small>[sim-C-tamJE5.js: `` for(let o=0;o<r.amount;o++){let o=hk(e,t,n.range,i);if(o===void 0)return;dd(e,o,i) ``]</small> <small>[sim-C-tamJE5.js: `` a=n.size*r.area ``]</small>

Root Spikes stores the target’s position when placing the warning. Only when its **nominal 0.3-second delay** ends does the original zone system resolve the circle against current enemy positions. In these 60 Hz fixtures, repeated floating-point timer subtraction completes on **tick 19 (about 0.317 s)**, not tick 18. Bodies moved just inside/outside the stored circle during the warning receive one hit/no hit respectively; the original hit resolver confirms HP loss. <small>[sim-C-tamJE5.js: `` n.delay[i]=a-t,a-t<=0&&kM(e,i) ``]</small> <small>[sim-C-tamJE5.js: `` wM(e,t),kd(e,r,i,n.radius[t]) ``]</small>

Each **3-volley cycle** ends with **×2.2 damage and ×1.4 Area**. Starting a volley increments the counter once; its remaining attacks keep that same beat. The control covers both third and sixth volleys, with ordinary fourth/fifth volleys in between. <small>[sim-C-tamJE5.js: `` (e.volleyLeft>0?n.beats:n.beats+1)%r.beatEvery===0 ``]</small> <small>[sim-C-tamJE5.js: `` e.runes.beats++ ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 3 / 2 | 26 / 57.2 | 1 / 1.4 | 2.4 |
| 3 | 6 / 2 | 26 / 57.2 | 1 / 1.4 | 2.4 |
