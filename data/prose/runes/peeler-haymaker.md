## How it works

Haymaker scales ordinary slash damage ×0.86, then buffs **every third volley** to ×2.2 damage and ×1.5 Area. The counter advances once when a volley starts, not once per slash or enemy hit. All slashes in volleys 3 and 6 share the buff; volleys 4 and 5 return to ordinary values. Each box’s width and height both use Area linearly. At supplied level one the ordinary/buffed hits are **10.32/22.704 damage**, with **64 × 20 / 96 × 30** boxes before body overlap. <small>[sim-Bl4djHgd.js: `` id:`peeler-haymaker` ``]</small>

Slashes alternate facing/opposite sides. Their centers sit half a computed width plus **2 units** sideways, **3 units above Tibo**, then move down **10 units for each pair of additional slashes**. Each rectangle includes the pest’s body radius. Six volleys per group check actual original-resolver HP loss, both sides, spare Amount and horizontal body-overlap boundaries ±0.25 units. <small>[sim-Bl4djHgd.js: `` t.cx=e.player.x[e.me]+n*(t.width/2+2),t.cy=e.player.y[e.me]-3+10*Math.floor(r/2) ``]</small> <small>[sim-Bl4djHgd.js: `` Math.abs(q(e,a)-t.cx)>r+c||Math.abs(J(e,a)-t.cy)>i+c||(Z(e,a),o++) ``]</small>

Retained command: `node tools/probe-special-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Original choice handling receives a supplied level-one rune card, bypassing ordinary max-level acquisition. Original consumers are isolated; no full-world/death/drop stepping or network, and high-HP aphids never die. Backhand uses supplied enemy bullets; Hopper additionally uses supplied Pierce 0/2 and forced contacts/expiry; summon checks isolate one emitted unit after recording the full count. No natural acquisition, max-level/evolved/union equivalence, autonomous projectile trajectories, moving-pest combat, status progression, DPS/survival, private-server or device proof. Prior scenarios remain separately labeled history.

Examples are **s1 supplied level-one fixtures**, not ordinary max-level builds. Bonus is supplied Amount bonus; damage is per hit/bolt, not DPS.

| Bonus | Slashes | Damage 1 / 3 | Box 1 / 3 |
|---|---|---|---|
| 0 | 1 | 10.32 / 22.704 | 64×20 / 96×30 |
| 3 | 4 | 10.32 / 22.704 | 64×20 / 96×30 |
