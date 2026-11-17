## How it works

Tot Sniper steers the first tot toward the highest-maximum-HP eligible pest even if that pest has only 1 current HP. It does not gain infinite range or remove ordinary spread on later shots. These controls use the base Tot Toss, not its evolved gatling or union forms. <small>[sim-w2ssE-IM.js: `` id:`tot-toss-tot-sniper` ``]</small>

The original selector compares **maximum HP among eligible targets inside the weapon’s search range**, breaking equal-max-HP ties by distance. It does not compare remaining HP. If a larger pest is outside that range, the nearer eligible pest can still be chosen. <small>[sim-w2ssE-IM.js: `` let f=u.maxHp[d] ``]</small> <small>[sim-w2ssE-IM.js: `` f<c||f===c&&h>=l ``]</small>

Other rune scales: **damage ×1.28**. These apply to the computed weapon values before focus/salvo/beat conversion. They are not a measured DPS ratio. <small>[sim-w2ssE-IM.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Controlled checks on `main-8zbhOvtE.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-projectile-runes.mjs main-8zbhOvtE.js` retained **six supplied-state groups for this rune**, with Amount bonus 0 and 3. The original choice handler applies the rune to a supplied **level-one** base weapon, deliberately bypassing natural max-level acquisition. Original stat, targeting and attack-tick/dispatch consumers emit six complete volleys, including third/sixth-beat controls, actual cooldown starts and within-volley spacing. The asymmetric target control uses maximum HP 100/300 versus current HP 100/1, range exclusion and equal-max-HP distance ties where applicable. Emission fixtures stop before projectile movement/collision: no measured freeze, wall bounce, landing/explosion hit, natural run, evolved/union equivalence, survival/DPS, private server or device claim. No reward writes; network forbidden.

Examples below are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Bonus is the supplied Amount bonus, replacing Tibo’s usual bonus for isolation. Shots counts the full volley; damage is per projectile on volleys 1 / 3; radius is the ordinary projectile body; gap is start-to-start seconds.

| Bonus | Shots | Damage 1 / 3 | Radius | Gap (s) |
|---|---|---|---|---|
| 0 | 1 | 12.8 / 12.8 | 4 | 1.1 |
| 3 | 4 | 12.8 / 12.8 | 4 | 1.1 |
