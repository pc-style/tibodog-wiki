## How it works

Big Blast enlarges the **explosion radius**, not the flying potato’s body. At base Area the blast radius changes from **22 to 35.2**, while the projectile’s radius remains 5. This trades direct projectile damage for blast reach; the control checks the attached blast radius, not enemies damaged by an explosion. <small>[sim-Bl4djHgd.js: `` id:`spud-cannon-big-blast` ``]</small>

Reshaping multiplies the existing behavior fields `explodeRadius` ×1.6; it does not multiply every Area-sensitive dimension. <small>[sim-Bl4djHgd.js: `` n.push([r,a*i]) ``]</small>

Other rune scales: **damage ×0.48**. These apply to the computed weapon values before focus/salvo/beat conversion. They are not a measured DPS ratio. <small>[sim-Bl4djHgd.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Controlled checks on `main-8zbhOvtE.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-projectile-runes.mjs main-8zbhOvtE.js` retained **six supplied-state groups for this rune**, with Amount bonus 0 and 3. The original choice handler applies the rune to a supplied **level-one** base weapon, deliberately bypassing natural max-level acquisition. Original stat, targeting and attack-tick/dispatch consumers emit six complete volleys, including third/sixth-beat controls, actual cooldown starts and within-volley spacing. The asymmetric target control uses maximum HP 100/300 versus current HP 100/1, range exclusion and equal-max-HP distance ties where applicable. Emission fixtures stop before projectile movement/collision: no measured freeze, wall bounce, landing/explosion hit, natural run, evolved/union equivalence, survival/DPS, private server or device claim. No reward writes; network forbidden.

Examples below are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Bonus is the supplied Amount bonus, replacing Tibo’s usual bonus for isolation. Shots counts the full volley; damage is per projectile on volleys 1 / 3; radius is the ordinary projectile body; gap is start-to-start seconds.

| Bonus | Shots | Damage 1 / 3 | Radius | Gap (s) |
|---|---|---|---|---|
| 0 | 1 | 9.6 / 9.6 | 5 | 2.2 |
| 3 | 4 | 9.6 / 9.6 | 5 | 2.2 |
