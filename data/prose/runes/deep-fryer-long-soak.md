## How it works

Long Soak makes the **active spray twice as long**, each hit ×1.05 damage, and the subsequent rest ×1.3 as long. It does not double the pulse rate or make the entire start-to-start cycle exactly twice as long. In the supplied level-one fixture the spray grows from 68 to 135 ticks, rests for 187 ticks, and starts again after **322 ticks (about 5.367 s)**; there are 15 pulses in each complete spray, not 16. <small>[sim-CQ8ALNnZ.js: `` id:`deep-fryer-long-soak` ``]</small>

The original cone consumer searches out to **1.3 × reach** to start a spray, but applies damage only inside **reach plus the pest’s body radius** and the cone’s angular boundary. A supplied pest at 1.15 × reach starts a spray without receiving a hit. An empty search does not start one. Each pulse reselects its aim; half the definition angle plus **0.1 radians** sets the angular boundary. Area scales reach, not that angle. The controls distinguish angular offsets ±0.002 radians and body-overlap distances ±0.25 units. <small>[sim-CQ8ALNnZ.js: `` Ed(e,i,a,1.3*o)!==void 0 ``]</small> <small>[sim-CQ8ALNnZ.js: `` Math.abs(jn(t.angle,w(J(e,r)-a,q(e,r)-i)))<=c+.1&&Z(e,r) ``]</small>

The first pulse is **one tick after activation**, then every **9 ticks (0.15 s)**. The active timer finishes before the rest timer begins; extra Amount does not add simultaneous sprays or pulses. Three complete on/off cycles are retained per group. Hot Seat also verifies that out-of-range tougher pests cannot win the aim search. <small>[sim-CQ8ALNnZ.js: `` t.active=y(Math.max(.2,r.duration)),t.volleyTimer=0 ``]</small> <small>[sim-CQ8ALNnZ.js: `` t.active<=0&&(t.cd=y(r.cooldown)) ``]</small>

Retained command: `node tools/probe-continuous-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Level-one weapons and rune cards are supplied through the original choice handler; this bypasses ordinary max-level acquisition. Only the original weapon and hit systems advance; high-HP aphids do not die, no reward handlers or pickups run, and network access is forbidden. These controls do **not** establish natural acquisition, max-level/evolved/union equivalence, autonomous moving-pest combat, status progression, DPS/survival, server or device behavior. Existing older scenario evidence remains historical.

Examples below are the **s1 supplied level-one fixtures**, not ordinary max-level builds. Damage is HP loss per ordinary-pest pulse/contact; Bonus means the deliberately supplied Amount bonus.

| Bonus | Damage | Reach | Pulses/spray | Cycle (s) |
|---|---|---|---|---|
| 0 | 6.3 | 70 | 15 | 5.3667 |
| 3 | 6.3 | 70 | 15 | 5.3667 |
