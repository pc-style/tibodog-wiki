## How it works

Long Lance trades width for reach: the base definition changes from **170 long and 6 wide to 272 long and 5.1 wide**, before Area. Reshaping also extends the aim search to 1.2 times that definition length. Additional Area lengthens the beam through √Area but does not extend that search again. <small>[sim-CX9jKioI.js: `` id:`fry-lance-long-lance` ``]</small>

The original attack checks a **line segment plus half the beam width and the enemy’s body radius**. It applies a hit immediately; the lingering beam graphic is not a damage-over-time field. Length is definition length × √Area; width is definition size × Area. Extra Amount rays alternate offsets of **+0.35, −0.35, +0.70 radians** around the chosen aim, with ordinary within-volley spacing. <small>[sim-CX9jKioI.js: `` u=n.length*Math.sqrt(r.area),d=n.size*r.area ``]</small> <small>[sim-CX9jKioI.js: `` ln(q(e,n),J(e,n),a,o,f,p)<=d/2+Cd(e,n)&&Z(e,n) ``]</small>

Reshaping multiplies only **length ×1.6**, **size ×0.85** in the original behavior definition. It does not scale every dimension equally. <small>[sim-CX9jKioI.js: `` n.push([r,a*i]) ``]</small>

Other computed-stat scales: **damage ×1.15**. These are not measured sustained-DPS ratios. <small>[sim-CX9jKioI.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Retained command: `node tools/probe-area-runes.mjs main-C0RlIzyD.js`. **Six supplied-state groups for this rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0, supplied level-one base weapon and rune card through the original choice handler. The fixture deliberately bypasses max-level rune acquisition. Six volleys check original computed stats, attack timing and dispatch; original hit processing checks stationary high-HP aphid damage without deaths. Root/Gravy additionally advance only the original zone and hit systems, isolating one emitted zone for lifetime and boundary checks. No full-world stepping, natural acquisition, max-level/evolved/union equivalence, moving-target combat, status advancement, overlapping-pool totals, DPS/survival, private-server or device proof. No reward handling or pickups; network forbidden.

Examples are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Count is **requested Amount / actual centers or rays**, with only two supplied pests. Damage is per beam hit, strike hit or pool pulse, on volleys 1 / 3. Gap is the measured start-to-start interval, quantized at 60 Hz.

| Bonus | Count | Damage 1 / 3 | Area 1 / 3 | Gap (s) |
|---|---|---|---|---|
| 0 | 1 / 1 | 29.9 / 29.9 | 1 / 1 | 2 |
| 3 | 4 / 4 | 29.9 / 29.9 | 1 / 1 | 2 |
