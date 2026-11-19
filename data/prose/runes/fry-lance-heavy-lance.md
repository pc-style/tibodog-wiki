## How it works

Heavy Lance strengthens the **third beam volley**, not every third enemy pierced. All rays within that volley share the buff. Its ×1.5 Area makes the beam 1.5 times as wide but only √1.5 times as long; it is not a 1.5-times reach bonus. <small>[sim-ChQfHUR1.js: `` id:`fry-lance-heavy-lance` ``]</small>

The original attack checks a **line segment plus half the beam width and the enemy’s body radius**. It applies a hit immediately; the lingering beam graphic is not a damage-over-time field. Length is definition length × √Area; width is definition size × Area. Extra Amount rays alternate offsets of **+0.35, −0.35, +0.70 radians** around the chosen aim, with ordinary within-volley spacing. <small>[sim-ChQfHUR1.js: `` l=n.length*Math.sqrt(r.area),u=n.size*r.area ``]</small> <small>[sim-ChQfHUR1.js: `` sn(q(e,n),J(e,n),a,o,d,f)<=u/2+Cd(e,n)&&Z(e,n) ``]</small>

Each **3-volley cycle** ends with **×2.2 damage and ×1.5 Area**. Starting a volley increments the counter once; its remaining attacks keep that same beat. The control covers both third and sixth volleys, with ordinary fourth/fifth volleys in between. <small>[sim-ChQfHUR1.js: `` (e.volleyLeft>0?n.beats:n.beats+1)%r.beatEvery===0 ``]</small> <small>[sim-ChQfHUR1.js: `` e.runes.beats++ ``]</small>

Other computed-stat scales: **damage ×0.92**. These are not measured sustained-DPS ratios. <small>[sim-ChQfHUR1.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 1 / 1 | 23.92 / 52.624 | 1 / 1.5 | 2 |
| 3 | 4 / 4 | 23.92 / 52.624 | 1 / 1.5 | 2 |
