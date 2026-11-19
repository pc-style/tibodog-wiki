## How it works

Top Dog makes every pup prefer the eligible pest with the highest **maximum HP**, measured from that pup’s own position, and scales damage ×1.16. It does not increase pup count, add an elite-only multiplier, or prefer the pest with the most remaining HP. The asymmetric original-summon control verifies actual firing angles and resolved HP loss against the farther high-maximum-HP target. Range still belongs to the pup, not to Tibo’s position. <small>[sim-CTsQMfaf.js: `` id:`tater-pup-top-dog` ``]</small>

The summon system reads the weapon’s **current stats when firing**, not a damage snapshot from when it spawned. Changing supplied damage multiplier to 1.5 affects the same retained summon’s next bolt. Each summon emits **one bolt** when its timer is ready; Amount controls summon count, not bolts per summon shot. No eligible target means a **6-tick retry**, verified by removing all targets and returning them during the wait. Six shots per group check real aim, shot spacing, payload and original-resolver HP loss; projectile contacts are forced at the chosen pest, not natural flight. <small>[sim-CTsQMfaf.js: `` c!==i&&(bP(e,c,LP),i=c) ``]</small> <small>[sim-CTsQMfaf.js: `` if(m===void 0){n.t[s]=RP;continue} ``]</small>

The original familiar consumer continually reconciles live pup count to computed Amount, creating or removing pups when the supplied Amount changes. New pups start with timers **0, 9, 18, 27… ticks**; their later firing cadence uses computed **cooldown**. Their following motion remains the original small oval around Tibo; Zoomies changes the shot timer, not that motion. Level-one bolts in this fixture live **1.875 s**, unlike sentry bolts’ fixed 1.2 s. <small>[sim-CTsQMfaf.js: `` i.t[o]=a*_P ``]</small> <small>[sim-CTsQMfaf.js: `` i=r.order[t]/Math.max(1,LP.amount)*A+.8*e.time ``]</small>

Retained command: `node tools/probe-special-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Original choice handling receives a supplied level-one rune card, bypassing ordinary max-level acquisition. Original consumers are isolated; no full-world/death/drop stepping or network, and high-HP aphids never die. Backhand uses supplied enemy bullets; Hopper additionally uses supplied Pierce 0/2 and forced contacts/expiry; summon checks isolate one emitted unit after recording the full count. No natural acquisition, max-level/evolved/union equivalence, autonomous projectile trajectories, moving-pest combat, status progression, DPS/survival, private-server or device proof. Prior scenarios remain separately labeled history.

Examples are **s1 supplied level-one fixtures**, not ordinary max-level builds. Bonus is supplied Amount bonus; damage is per hit/bolt, not DPS.

| Bonus | Summons | Damage | Shot gap (ticks) | Area |
|---|---|---|---|---|
| 0 | 1 | 10.44 | 60 | 1 |
| 3 | 4 | 10.44 | 60 | 1 |
