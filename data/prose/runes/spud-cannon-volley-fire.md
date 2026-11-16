## How it works

Volley Fire emits three ordinary volleys’ worth of cannon shots in one tick. Its separate cooldown scale means the new wait is **2.25 times** the old wait, not three times and not 0.75 times. Shot damage is scaled independently; overlapping blasts and actual hit totals were not measured. <small>[sim-DKo2qdWE.js: `` id:`spud-cannon-volley-fire` ``]</small>

The salvo consumer multiplies both **Amount and cooldown by 3**, and sets the interval between shots to zero. This happens after the rune’s ordinary scales, not instead of them. <small>[sim-DKo2qdWE.js: `` t.cooldown*=r.salvo,t.amount*=r.salvo,t.interval=0 ``]</small>

Other rune scales: **damage ×1.9**, **cooldown ×0.75**. These apply to the computed weapon values before focus/salvo/beat conversion. They are not a measured DPS ratio. <small>[sim-DKo2qdWE.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Controlled checks on `main-8zbhOvtE.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-projectile-runes.mjs main-8zbhOvtE.js` retained **six supplied-state groups for this rune**, with Amount bonus 0 and 3. The original choice handler applies the rune to a supplied **level-one** base weapon, deliberately bypassing natural max-level acquisition. Original stat, targeting and attack-tick/dispatch consumers emit six complete volleys, including third/sixth-beat controls, actual cooldown starts and within-volley spacing. The asymmetric target control uses maximum HP 100/300 versus current HP 100/1, range exclusion and equal-max-HP distance ties where applicable. Emission fixtures stop before projectile movement/collision: no measured freeze, wall bounce, landing/explosion hit, natural run, evolved/union equivalence, survival/DPS, private server or device claim. No reward writes; network forbidden.

Examples below are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Bonus is the supplied Amount bonus, replacing Tibo’s usual bonus for isolation. Shots counts the full volley; damage is per projectile on volleys 1 / 3; radius is the ordinary projectile body; gap is start-to-start seconds.

| Bonus | Shots | Damage 1 / 3 | Radius | Gap (s) |
|---|---|---|---|---|
| 0 | 3 | 38 / 38 | 5 | 4.95 |
| 3 | 12 | 38 / 38 | 5 | 4.95 |
