## How it works

Disc Wheel starts with the ordinary random bounce heading, then arranges the rest of that volley at equal angles around the circle. It does not independently roll every disc’s initial direction. With one disc the ring has no extra spokes; bounce trajectories are outside this fixture. <small>[sim-jaWRJZTO.js: `` id:`rosti-disc-disc-wheel` ``]</small>

The angle consumer captures the first heading and adds counter × 360° / total Amount for later shots. It changes launch angles, not Amount, cooldown or the projectile’s later collision rules. <small>[sim-jaWRJZTO.js: `` r.ringAngle+e.counter*A/Math.max(1,t.amount) ``]</small>

Other rune scales: **damage ×1.09**. These apply to the computed weapon values before focus/salvo/beat conversion. They are not a measured DPS ratio. <small>[sim-jaWRJZTO.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Controlled checks on `main-8zbhOvtE.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-projectile-runes.mjs main-8zbhOvtE.js` retained **six supplied-state groups for this rune**, with Amount bonus 0 and 3. The original choice handler applies the rune to a supplied **level-one** base weapon, deliberately bypassing natural max-level acquisition. Original stat, targeting and attack-tick/dispatch consumers emit six complete volleys, including third/sixth-beat controls, actual cooldown starts and within-volley spacing. The asymmetric target control uses maximum HP 100/300 versus current HP 100/1, range exclusion and equal-max-HP distance ties where applicable. Emission fixtures stop before projectile movement/collision: no measured freeze, wall bounce, landing/explosion hit, natural run, evolved/union equivalence, survival/DPS, private server or device claim. No reward writes; network forbidden.

Examples below are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Bonus is the supplied Amount bonus, replacing Tibo’s usual bonus for isolation. Shots counts the full volley; damage is per projectile on volleys 1 / 3; radius is the ordinary projectile body; gap is start-to-start seconds.

| Bonus | Shots | Damage 1 / 3 | Radius | Gap (s) |
|---|---|---|---|---|
| 0 | 1 | 10.9 / 10.9 | 6 | 2.6 |
| 3 | 4 | 10.9 / 10.9 | 6 | 2.6 |
