## How it works

Zoomies scales the pup’s **shot cooldown ×0.6** and each hit’s damage ×0.66. It does not increase the pup’s following speed or launch extra bolts per shot. The isolated level-one pup fires every **36 ticks (0.6 s)** for **5.94 damage**, compared with an ordinary 60-tick cooldown and 9 damage. Each pup keeps its own timer; faster shots are not evidence of a natural-run DPS or survival advantage. <small>[sim-DtAHT1Aj.js: `` id:`tater-pup-zoomies` ``]</small>

The summon system reads the weapon’s **current stats when firing**, not a damage snapshot from when it spawned. Changing supplied damage multiplier to 1.5 affects the same retained summon’s next bolt. Each summon emits **one bolt** when its timer is ready; Amount controls summon count, not bolts per summon shot. No eligible target means a **6-tick retry**, verified by removing all targets and returning them during the wait. Six shots per group check real aim, shot spacing, payload and original-resolver HP loss; projectile contacts are forced at the chosen pest, not natural flight. <small>[sim-DtAHT1Aj.js: `` s!==i&&(aP(e,s,SP),i=s) ``]</small> <small>[sim-DtAHT1Aj.js: `` if(p===void 0){n.t[o]=CP;continue} ``]</small>

The original familiar consumer continually reconciles live pup count to computed Amount, creating or removing pups when the supplied Amount changes. New pups start with timers **0, 9, 18, 27… ticks**; their later firing cadence uses computed **cooldown**. Their following motion remains the original small oval around Tibo; Zoomies changes the shot timer, not that motion. Level-one bolts in this fixture live **1.875 s**, unlike sentry bolts’ fixed 1.2 s. <small>[sim-DtAHT1Aj.js: `` i.t[o]=a*nP ``]</small> <small>[sim-DtAHT1Aj.js: `` i=r.order[t]/Math.max(1,SP.amount)*k+.8*e.time ``]</small>

Retained command: `node tools/probe-special-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Original choice handling receives a supplied level-one rune card, bypassing ordinary max-level acquisition. Original consumers are isolated; no full-world/death/drop stepping or network, and high-HP aphids never die. Backhand uses supplied enemy bullets; Hopper additionally uses supplied Pierce 0/2 and forced contacts/expiry; summon checks isolate one emitted unit after recording the full count. No natural acquisition, max-level/evolved/union equivalence, autonomous projectile trajectories, moving-pest combat, status progression, DPS/survival, private-server or device proof. Prior scenarios remain separately labeled history.

Examples are **s1 supplied level-one fixtures**, not ordinary max-level builds. Bonus is supplied Amount bonus; damage is per hit/bolt, not DPS.

| Bonus | Summons | Damage | Shot gap (ticks) | Area |
|---|---|---|---|---|
| 0 | 1 | 5.94 | 36 | 1 |
| 3 | 4 | 5.94 | 36 | 1 |
