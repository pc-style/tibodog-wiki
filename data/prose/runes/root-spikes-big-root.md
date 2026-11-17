## How it works

Big Root converts the entire computed Amount into **one larger, stronger delayed strike**, rather than leaving extra spikes hidden under the first. At level one, the ordinary three strikes already supply two spare Amount for conversion. The larger circle does not lengthen the warning. <small>[sim-59_D3BWK.js: `` id:`root-spikes-big-root` ``]</small>

The strike consumer handles Amount **inside one dispatch**, marking each picked target before choosing the next. It stops when no unpicked eligible target remains. Strike radius is definition size × Area, not √Area. This is a cap on selected centers, not on enemies caught by each circle. <small>[sim-59_D3BWK.js: `` for(let o=0;o<r.amount;o++){let o=$j(e,t,n.range,i);if(o===void 0)return;Ed(e,o,i) ``]</small> <small>[sim-59_D3BWK.js: `` a=n.size*r.area ``]</small>

Root Spikes stores the target’s position when placing the warning. Only when its **nominal 0.3-second delay** ends does the original zone system resolve the circle against current enemy positions. In these 60 Hz fixtures, repeated floating-point timer subtraction completes on **tick 19 (about 0.317 s)**, not tick 18. Bodies moved just inside/outside the stored circle during the warning receive one hit/no hit respectively; the original hit resolver confirms HP loss. <small>[sim-59_D3BWK.js: `` n.delay[i]=a-t,a-t<=0&&fF(e,i) ``]</small> <small>[sim-59_D3BWK.js: `` sF(e,t),Wd(e,r,i,n.radius[t]) ``]</small>

After ordinary stats and rune scales, let N be computed Amount. Focus multiplies damage by **1 + 0.5 × (N − 1)** and Area by **1 + 0.45 × (N − 1)**, then sets Amount to 1. These are additive bonuses per spare Amount, not repeated compounding. <small>[sim-59_D3BWK.js: `` t.damage*=1+r.focusDamage*e,t.area*=1+r.focusArea*e,t.amount=1 ``]</small>

Other computed-stat scales: **damage ×1.9**. These are not measured sustained-DPS ratios. <small>[sim-59_D3BWK.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 1 / 1 | 98.8 / 98.8 | 1.9 / 1.9 | 2.4 |
| 3 | 1 / 1 | 172.9 / 172.9 | 3.25 / 3.25 | 2.4 |
