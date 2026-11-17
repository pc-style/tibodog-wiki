## How it works

Carving Knife trades a multi-knife volley for **one stronger, larger facing shot**. It still follows Tibo’s facing direction, not the toughest-pest selector; adding Amount feeds the single-knife conversion rather than restoring the discarded knives. <small>[sim-59_D3BWK.js: `` id:`fry-knives-carving-knife` ``]</small>

After ordinary stats and the rune’s scales, let N be the volley’s total Amount. Each spare shot adds **0.55 times damage** and **0.25 times Area** to the single survivor: multiply by 1 + 0.55 × (N − 1) and 1 + 0.25 × (N − 1), then set Amount to 1. The damage and Area conversions are additive per spare shot, not repeated compounding. Projectile radius uses the square root of final Area. <small>[sim-59_D3BWK.js: `` t.damage*=1+r.focusDamage*e,t.area*=1+r.focusArea*e,t.amount=1 ``]</small>

Other rune scales: **damage ×1.7**. These apply to the computed weapon values before focus/salvo/beat conversion. They are not a measured DPS ratio. <small>[sim-59_D3BWK.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Controlled checks on `main-8zbhOvtE.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-projectile-runes.mjs main-8zbhOvtE.js` retained **six supplied-state groups for this rune**, with Amount bonus 0 and 3. The original choice handler applies the rune to a supplied **level-one** base weapon, deliberately bypassing natural max-level acquisition. Original stat, targeting and attack-tick/dispatch consumers emit six complete volleys, including third/sixth-beat controls, actual cooldown starts and within-volley spacing. The asymmetric target control uses maximum HP 100/300 versus current HP 100/1, range exclusion and equal-max-HP distance ties where applicable. Emission fixtures stop before projectile movement/collision: no measured freeze, wall bounce, landing/explosion hit, natural run, evolved/union equivalence, survival/DPS, private server or device claim. No reward writes; network forbidden.

Examples below are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Bonus is the supplied Amount bonus, replacing Tibo’s usual bonus for isolation. Shots counts the full volley; damage is per projectile on volleys 1 / 3; radius is the ordinary projectile body; gap is start-to-start seconds.

| Bonus | Shots | Damage 1 / 3 | Radius | Gap (s) |
|---|---|---|---|---|
| 0 | 1 | 13.6 / 13.6 | 3 | 0.9 |
| 3 | 1 | 36.04 / 36.04 | 3.9686 | 0.9 |
