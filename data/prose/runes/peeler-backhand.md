## How it works

Backhand adds **bullet reflection inside each slash** and scales slash damage ×1.11. It removes eligible enemy bullets and creates new player projectiles facing the reverse of their incoming direction. The replacement uses **Peeler’s damage ×1.5, Peeler’s speed, pierce 2 and at least 0.2 s lifetime**—not the enemy bullet’s damage or speed. Crucially, the supplied level-one Peeler has **speed 0**: its reflected shots are stationary, not fast return shots. A pest deliberately placed on one takes **19.98 HP** from the original contact resolver. This does not prove a moving reflection build or natural defensive success. <small>[sim-C8s6MCs3.js: `` id:`peeler-backhand` ``]</small>

Slashes alternate facing/opposite sides. Their centers sit half a computed width plus **2 units** sideways, **3 units above Tibo**, then move down **10 units for each pair of additional slashes**. Each rectangle includes the pest’s body radius. Six volleys per group check actual original-resolver HP loss, both sides, spare Amount and horizontal body-overlap boundaries ±0.25 units. <small>[sim-C8s6MCs3.js: `` t.cx=e.player.x[e.me]+n*(t.width/2+2),t.cy=e.player.y[e.me]-3+10*Math.floor(r/2) ``]</small> <small>[sim-C8s6MCs3.js: `` Math.abs(q(e,a)-t.cx)>r+c||Math.abs(J(e,a)-t.cy)>i+c||(Z(e,a),o++) ``]</small>

The reflection rectangle is **slash width + 8** by **1.6 × slash height + 8**, using bullet centers rather than the enemy-body overlap rule. The isolated first-slash control supplies four bullets: two inside are removed and replaced, while two just outside remain. Reflection can therefore catch a bullet beyond the damage rectangle’s vertical edge. It does not imply that every nearby projectile is erased. <small>[sim-C8s6MCs3.js: `` u=i.width/2+4,d=1.6*i.height/2+4 ``]</small> <small>[sim-C8s6MCs3.js: `` s.vx[_]=S(g)*r.speed,s.vy[_]=T(g)*r.speed ``]</small> <small>[sim-C8s6MCs3.js: `` s.damage[_]=r.damage*n.mult,s.pierce[_]=n.pierce ``]</small>

Retained command: `node tools/probe-special-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Original choice handling receives a supplied level-one rune card, bypassing ordinary max-level acquisition. Original consumers are isolated; no full-world/death/drop stepping or network, and high-HP aphids never die. Backhand uses supplied enemy bullets; Hopper additionally uses supplied Pierce 0/2 and forced contacts/expiry; summon checks isolate one emitted unit after recording the full count. No natural acquisition, max-level/evolved/union equivalence, autonomous projectile trajectories, moving-pest combat, status progression, DPS/survival, private-server or device proof. Prior scenarios remain separately labeled history.

Examples are **s1 supplied level-one fixtures**, not ordinary max-level builds. Bonus is supplied Amount bonus; damage is per hit/bolt, not DPS.

| Bonus | Slashes | Damage 1 / 3 | Box 1 / 3 |
|---|---|---|---|
| 0 | 1 | 13.32 / 13.32 | 64×20 / 64×20 |
| 3 | 4 | 13.32 / 13.32 | 64×20 / 64×20 |
