## How it works

Rolling Boil changes the aura’s **hitInterval ×0.55**, not its cooldown stat, and scales each pulse’s damage ×0.7. The nominal interval becomes 0.275 s. The original 60 Hz timer rounds that to **17 ticks (about 0.2833 s)**, compared with 30 ticks ordinarily. Each hit is 3.5 raw damage in the supplied level-one fixture. Faster pulses are not proof of a natural-run DPS ratio. <small>[sim-BluGyCqn.js: `` id:`steam-vent-rolling-boil` ``]</small>

The original aura damages **every overlapping pest** in its circle on a pulse, including the body radius at the boundary. The supplied pests 0.25 units inside/outside that overlap boundary receive one hit/no hit. Radius is definition size × Area. The timer is reset from **behavior hitInterval**, not computed cooldown; ordinary cooldown reduction and extra Amount do not add pulses or extra hits to one pest. <small>[sim-BluGyCqn.js: `` t.cd=y(n.hitInterval),Y(e,r.damage,t.src,t.slot,r.knockback) ``]</small> <small>[sim-BluGyCqn.js: `` n.size*r.area,i) ``]</small> <small>[sim-BluGyCqn.js: `` return e!==`aura`&&e!==`cone`&&e!==`nuke`&&e!==`ring` ``]</small>

Retained command: `node tools/probe-continuous-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Level-one weapons and rune cards are supplied through the original choice handler; this bypasses ordinary max-level acquisition. Only the original weapon and hit systems advance; high-HP aphids do not die, no reward handlers or pickups run, and network access is forbidden. These controls do **not** establish natural acquisition, max-level/evolved/union equivalence, autonomous moving-pest combat, status progression, DPS/survival, server or device behavior. Existing older scenario evidence remains historical.

Examples below are the **s1 supplied level-one fixtures**, not ordinary max-level builds. Damage is HP loss per ordinary-pest pulse/contact; Bonus means the deliberately supplied Amount bonus.

| Bonus | Damage | Radius | Pulse gap (ticks) |
|---|---|---|---|
| 0 | 3.5 | 32 | 17 |
| 3 | 3.5 | 32 | 17 |
