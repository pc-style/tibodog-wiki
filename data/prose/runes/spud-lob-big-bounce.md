## How it works

Big Bounce strengthens the **third lob volley**, not every third floor bounce. The increased Area enlarges the emitted projectile body and also enters the lob’s horizontal-velocity spread formula. These fixtures do not advance gravity, bounces or impact damage. <small>[sim-By2tGUp7.js: `` id:`spud-lob-big-bounce` ``]</small>

Each **3-volley cycle** ends with **×2.2 damage and ×1.5 Area**. Starting a volley increments the beat counter once; its remaining shots keep that same beat. Larger Area means ×√1.5 body radius, not ×1.5 radius. <small>[sim-By2tGUp7.js: `` (e.volleyLeft>0?n.beats:n.beats+1)%r.beatEvery===0 ``]</small> <small>[sim-By2tGUp7.js: `` e.runes.beats++ ``]</small>

Other rune scales: **damage ×0.92**. These apply to the computed weapon values before focus/salvo/beat conversion. They are not a measured DPS ratio. <small>[sim-By2tGUp7.js: `` t.damage*=r.damage,t.cooldown*=r.cooldown,t.area*=r.area ``]</small>

Controlled checks on `main-8zbhOvtE.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-projectile-runes.mjs main-8zbhOvtE.js` retained **six supplied-state groups for this rune**, with Amount bonus 0 and 3. The original choice handler applies the rune to a supplied **level-one** base weapon, deliberately bypassing natural max-level acquisition. Original stat, targeting and attack-tick/dispatch consumers emit six complete volleys, including third/sixth-beat controls, actual cooldown starts and within-volley spacing. The asymmetric target control uses maximum HP 100/300 versus current HP 100/1, range exclusion and equal-max-HP distance ties where applicable. Emission fixtures stop before projectile movement/collision: no measured freeze, wall bounce, landing/explosion hit, natural run, evolved/union equivalence, survival/DPS, private server or device claim. No reward writes; network forbidden.

Examples below are the retained **s1 level-one fixtures**, not ordinary max-level loadouts. Bonus is the supplied Amount bonus, replacing Tibo’s usual bonus for isolation. Shots counts the full volley; damage is per projectile on volleys 1 / 3; radius is the ordinary projectile body; gap is start-to-start seconds.

| Bonus | Shots | Damage 1 / 3 | Radius | Gap (s) |
|---|---|---|---|---|
| 0 | 1 | 23 / 50.6 | 7 | 2.7 |
| 3 | 4 | 23 / 50.6 | 7 | 2.7 |
