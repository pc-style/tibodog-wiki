## How it works

Hot Landing adds an **explosion-radius field of 26** to a lob that normally has no such field. Dispatch stores 26 times Area on each emitted lob, while its body still uses the ordinary size-7 radius formula. The source routes that field into impact handling; this fixture does not resolve landings or claim an extra explosion on every subsequent bounce. <small>[sim-DfBcZSG3.js: `` id:`spud-lob-hot-landing` ``]</small>

This adds a missing behavior field rather than multiplying an existing explosion radius. <small>[sim-DfBcZSG3.js: `` e.kind===`lob`?{...e,explodeRadius:t.explodeRadius}:e ``]</small>

Other rune scales: **damage ×1.36**. These apply to the computed weapon values before focus/salvo/beat conversion. They are not a measured DPS ratio. <small>[sim-DfBcZSG3.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Controlled checks on `main-8zbhOvtE.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-projectile-runes.mjs main-8zbhOvtE.js` retained **six supplied-state groups for this rune**, with Amount bonus 0 and 3. The original choice handler applies the rune to a supplied **level-one** base weapon, deliberately bypassing natural max-level acquisition. Original stat, targeting and attack-tick/dispatch consumers emit six complete volleys, including third/sixth-beat controls, actual cooldown starts and within-volley spacing. The asymmetric target control uses maximum HP 100/300 versus current HP 100/1, range exclusion and equal-max-HP distance ties where applicable. Emission fixtures stop before projectile movement/collision: no measured freeze, wall bounce, landing/explosion hit, natural run, evolved/union equivalence, survival/DPS, private server or device claim. No reward writes; network forbidden.

Examples below are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Bonus is the supplied Amount bonus, replacing Tibo’s usual bonus for isolation. Shots counts the full volley; damage is per projectile on volleys 1 / 3; radius is the ordinary projectile body; gap is start-to-start seconds.

| Bonus | Shots | Damage 1 / 3 | Radius | Gap (s) |
|---|---|---|---|---|
| 0 | 1 | 34 / 34 | 7 | 2.7 |
| 3 | 4 | 34 / 34 | 7 | 2.7 |
