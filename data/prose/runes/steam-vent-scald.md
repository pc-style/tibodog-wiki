## How it works

Scald gives every steam hit **×1.15 damage**, then applies a separate **×2 elite multiplier** in the original hit resolver. Equal-position ordinary and elite aphids lose **5.75 and 11.5 HP** per pulse in the supplied level-one control. The elite multiplier is not a second hit, a faster pulse, or a rule based on maximum HP. Bosses share the elite branch in source, but this retained control uses elite enemies, not a boss encounter. <small>[sim-BF7yetWo.js: `` id:`steam-vent-scald` ``]</small>

The original aura damages **every overlapping pest** in its circle on a pulse, including the body radius at the boundary. The supplied pests 0.25 units inside/outside that overlap boundary receive one hit/no hit. Radius is definition size × Area. The timer is reset from **behavior hitInterval**, not computed cooldown; ordinary cooldown reduction and extra Amount do not add pulses or extra hits to one pest. <small>[sim-BF7yetWo.js: `` t.cd=b(n.hitInterval),Y(e,r.damage,t.src,t.slot,r.knockback) ``]</small> <small>[sim-BF7yetWo.js: `` n.size*r.area,i) ``]</small> <small>[sim-BF7yetWo.js: `` return e!==`aura`&&e!==`cone`&&e!==`nuke`&&e!==`ring` ``]</small>

The original resolver, not a queue-size estimate, confirms the elite HP loss. The global elite multiplier is left at its ordinary value in these controls; other bonuses or game modes could change final damage. <small>[sim-BF7yetWo.js: `` t.has(n,T.Elite) ``]</small> <small>[sim-BF7yetWo.js: `` l*=o.eliteMult*a.eliteMult[r] ``]</small>

Retained command: `node tools/probe-continuous-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Level-one weapons and rune cards are supplied through the original choice handler; this bypasses ordinary max-level acquisition. Only the original weapon and hit systems advance; high-HP aphids do not die, no reward handlers or pickups run, and network access is forbidden. These controls do **not** establish natural acquisition, max-level/evolved/union equivalence, autonomous moving-pest combat, status progression, DPS/survival, server or device behavior. Existing older scenario evidence remains historical.

Examples below are the **s1 supplied level-one fixtures**, not ordinary max-level builds. Damage is HP loss per ordinary-pest pulse/contact; Bonus means the deliberately supplied Amount bonus.

| Bonus | Damage | Radius | Pulse gap (ticks) |
|---|---|---|---|
| 0 | 5.75 | 32 | 30 |
| 3 | 5.75 | 32 | 30 |
