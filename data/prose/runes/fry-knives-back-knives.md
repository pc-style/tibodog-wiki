## How it works

Back Knives alternates **forward, backward, forward, backward** within each volley. It does not search for a pest behind Tibo, and it does not double Amount by itself. Normal facing-shot spread is still applied before the alternating half-turn. <small>[sim-B3FDQRPx.js: `` id:`fry-knives-back-knives` ``]</small>

The angle consumer adds counter modulo 2 times a 180° turn to each shot’s ordinary heading. It changes launch angles, not Amount, cooldown or the projectile’s later collision rules. <small>[sim-B3FDQRPx.js: `` r.ringAngle+e.counter*j/Math.max(1,t.amount) ``]</small>

Other rune scales: **damage ×0.9**. These apply to the computed weapon values before focus/salvo/beat conversion. They are not a measured DPS ratio. <small>[sim-B3FDQRPx.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Controlled checks on `main-8zbhOvtE.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-projectile-runes.mjs main-8zbhOvtE.js` retained **six supplied-state groups for this rune**, with Amount bonus 0 and 3. The original choice handler applies the rune to a supplied **level-one** base weapon, deliberately bypassing natural max-level acquisition. Original stat, targeting and attack-tick/dispatch consumers emit six complete volleys, including third/sixth-beat controls, actual cooldown starts and within-volley spacing. The asymmetric target control uses maximum HP 100/300 versus current HP 100/1, range exclusion and equal-max-HP distance ties where applicable. Emission fixtures stop before projectile movement/collision: no measured freeze, wall bounce, landing/explosion hit, natural run, evolved/union equivalence, survival/DPS, private server or device claim. No reward writes; network forbidden.

Examples below are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Bonus is the supplied Amount bonus, replacing Tibo’s usual bonus for isolation. Shots counts the full volley; damage is per projectile on volleys 1 / 3; radius is the ordinary projectile body; gap is start-to-start seconds.

| Bonus | Shots | Damage 1 / 3 | Radius | Gap (s) |
|---|---|---|---|---|
| 0 | 1 | 7.2 / 7.2 | 3 | 0.9 |
| 3 | 4 | 7.2 / 7.2 | 3 | 0.9 |
