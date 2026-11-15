## How it works

Storm Front triples strike Amount but cannot repeat a target center within the same dispatch. With only two separated eligible pests, this control lands **two strikes**, not six or fifteen. Spare Amount is unused; it is not queued for later. Its cooldown is ×2.25 after both the rune scale and salvo conversion. <small>[sim-eDYsG0no.js: `` id:`starch-bolt-storm-front` ``]</small>

The strike consumer handles Amount **inside one dispatch**, marking each picked target before choosing the next. It stops when no unpicked eligible target remains. Strike radius is definition size × Area, not √Area. This is a cap on selected centers, not on enemies caught by each circle. <small>[sim-eDYsG0no.js: `` for(let o=0;o<r.amount;o++){let o=hk(e,t,n.range,i);if(o===void 0)return;dd(e,o,i) ``]</small> <small>[sim-eDYsG0no.js: `` a=n.size*r.area ``]</small>

Starch Bolt has **no warning zone**: the selected circles queue hits during the attack, then the original hit processor applies HP loss. These two-target controls use separated circles, so the observed strike count is not inflated by overlapping explosions. <small>[sim-eDYsG0no.js: `` else kd(e,s,c,a),R(e,`strike`,s,c,a,Od(e)) ``]</small>

Salvo multiplies **Amount and cooldown by 3**, then sets the within-volley interval to zero, after applying ordinary scales. Strike Amount still cannot reuse a target in one dispatch; pool Amount creates separate pools. <small>[sim-eDYsG0no.js: `` t.cooldown*=r.salvo,t.amount*=r.salvo,t.interval=0 ``]</small>

Other computed-stat scales: **damage ×1.8**, **cooldown ×0.75**. These are not measured sustained-DPS ratios. <small>[sim-eDYsG0no.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 6 / 2 | 32.4 / 32.4 | 1 / 1 | 4.5 |
| 3 | 15 / 2 | 32.4 / 32.4 | 1 / 1 | 4.5 |
