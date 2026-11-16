## How it works

Big Pot increases the steam’s **radius ×1.45** while reducing each pulse to ×0.25 damage. At level one that is a 46.4-unit radius and 1.25 damage per ordinary pest per pulse. It does not add projectiles, increase the pulse frequency, or apply a quarter-damage penalty once for every pest in the circle: each qualifying pest receives its own full scaled hit. <small>[sim-jaWRJZTO.js: `` id:`steam-vent-big-pot` ``]</small>

The original aura damages **every overlapping pest** in its circle on a pulse, including the body radius at the boundary. The supplied pests 0.25 units inside/outside that overlap boundary receive one hit/no hit. Radius is definition size × Area. The timer is reset from **behavior hitInterval**, not computed cooldown; ordinary cooldown reduction and extra Amount do not add pulses or extra hits to one pest. <small>[sim-jaWRJZTO.js: `` t.cd=b(n.hitInterval),Y(e,r.damage,t.src,t.slot,r.knockback) ``]</small> <small>[sim-jaWRJZTO.js: `` n.size*r.area,i) ``]</small> <small>[sim-jaWRJZTO.js: `` return e!==`aura`&&e!==`cone`&&e!==`nuke`&&e!==`ring` ``]</small>

Retained command: `node tools/probe-continuous-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Level-one weapons and rune cards are supplied through the original choice handler; this bypasses ordinary max-level acquisition. Only the original weapon and hit systems advance; high-HP aphids do not die, no reward handlers or pickups run, and network access is forbidden. These controls do **not** establish natural acquisition, max-level/evolved/union equivalence, autonomous moving-pest combat, status progression, DPS/survival, server or device behavior. Existing older scenario evidence remains historical.

Examples below are the **s1 supplied level-one fixtures**, not ordinary max-level builds. Damage is HP loss per ordinary-pest pulse/contact; Bonus means the deliberately supplied Amount bonus.

| Bonus | Damage | Radius | Pulse gap (ticks) |
|---|---|---|---|
| 0 | 1.25 | 46.4 | 30 |
| 3 | 1.25 | 46.4 | 30 |
