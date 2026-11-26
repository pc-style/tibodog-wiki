## How it works

Wide Peel changes the slash definition to **×1.45 width and ×1.3 height**, while scaling damage ×0.79. The level-one box becomes **92.8 × 26**, before Area, rather than scaling both dimensions by the same factor. The slash center also moves outward because it is placed half a box-width plus 2 units from Tibo; it is not a wider box centered on the old slash position. Each qualifying pest receives the complete hit, with no slash pierce cap. <small>[sim-0n0rJ5bz.js: `` id:`peeler-wide-peel` ``]</small>

Slashes alternate facing/opposite sides. Their centers sit half a computed width plus **2 units** sideways, **3 units above Tibo**, then move down **10 units for each pair of additional slashes**. Each rectangle includes the pest’s body radius. Six volleys per group check actual original-resolver HP loss, both sides, spare Amount and horizontal body-overlap boundaries ±0.25 units. <small>[sim-0n0rJ5bz.js: `` t.cx=e.player.x[e.me]+n*(t.width/2+2),t.cy=e.player.y[e.me]-3+10*Math.floor(r/2) ``]</small> <small>[sim-0n0rJ5bz.js: `` Math.abs(q(e,a)-t.cx)>r+c||Math.abs(J(e,a)-t.cy)>i+c||(Z(e,a),o++) ``]</small>

Retained command: `node tools/probe-special-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Original choice handling receives a supplied level-one rune card, bypassing ordinary max-level acquisition. Original consumers are isolated; no full-world/death/drop stepping or network, and high-HP aphids never die. Backhand uses supplied enemy bullets; Hopper additionally uses supplied Pierce 0/2 and forced contacts/expiry; summon checks isolate one emitted unit after recording the full count. No natural acquisition, max-level/evolved/union equivalence, autonomous projectile trajectories, moving-pest combat, status progression, DPS/survival, private-server or device proof. Prior scenarios remain separately labeled history.

Examples are **s1 supplied level-one fixtures**, not ordinary max-level builds. Bonus is supplied Amount bonus; damage is per hit/bolt, not DPS.

| Bonus | Slashes | Damage 1 / 3 | Box 1 / 3 |
|---|---|---|---|
| 0 | 1 | 9.48 / 9.48 | 92.8×26 / 92.8×26 |
| 3 | 4 | 9.48 / 9.48 | 92.8×26 / 92.8×26 |
