## How it works

Big Pup turns computed Amount into **one larger pup**, first scaling damage ×2.4 and shot cooldown ×0.4. If N is pre-focus Amount, damage additionally gains **1 + 0.7 × (N − 1)** and Area gains **1 + 0.6 × (N − 1)** before Amount becomes 1. With supplied Amount bonus 0/3 this gives **21.6/66.96 damage** per shot from one pup, with a **24-tick** shot gap in both controls. Extra Amount becomes focus bonuses, not invisible extra pups or extra bolts per shot. <small>[sim-CX9jKioI.js: `` id:`tater-pup-big-pup` ``]</small>

The summon system reads the weapon’s **current stats when firing**, not a damage snapshot from when it spawned. Changing supplied damage multiplier to 1.5 affects the same retained summon’s next bolt. Each summon emits **one bolt** when its timer is ready; Amount controls summon count, not bolts per summon shot. No eligible target means a **6-tick retry**, verified by removing all targets and returning them during the wait. Six shots per group check real aim, shot spacing, payload and original-resolver HP loss; projectile contacts are forced at the chosen pest, not natural flight. <small>[sim-CX9jKioI.js: `` s!==i&&(iP(e,s,xP),i=s) ``]</small> <small>[sim-CX9jKioI.js: `` if(m===void 0){n.t[o]=SP;continue} ``]</small>

The original familiar consumer continually reconciles live pup count to computed Amount, creating or removing pups when the supplied Amount changes. New pups start with timers **0, 9, 18, 27… ticks**; their later firing cadence uses computed **cooldown**. Their following motion remains the original small oval around Tibo; Zoomies changes the shot timer, not that motion. Level-one bolts in this fixture live **1.875 s**, unlike sentry bolts’ fixed 1.2 s. <small>[sim-CX9jKioI.js: `` i.t[o]=a*tP ``]</small> <small>[sim-CX9jKioI.js: `` i=r.order[t]/Math.max(1,xP.amount)*j+.8*e.time ``]</small>

Retained command: `node tools/probe-special-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Original choice handling receives a supplied level-one rune card, bypassing ordinary max-level acquisition. Original consumers are isolated; no full-world/death/drop stepping or network, and high-HP aphids never die. Backhand uses supplied enemy bullets; Hopper additionally uses supplied Pierce 0/2 and forced contacts/expiry; summon checks isolate one emitted unit after recording the full count. No natural acquisition, max-level/evolved/union equivalence, autonomous projectile trajectories, moving-pest combat, status progression, DPS/survival, private-server or device proof. Prior scenarios remain separately labeled history.

Examples are **s1 supplied level-one fixtures**, not ordinary max-level builds. Bonus is supplied Amount bonus; damage is per hit/bolt, not DPS.

| Bonus | Summons | Damage | Shot gap (ticks) | Area |
|---|---|---|---|---|
| 0 | 1 | 21.6 | 24 | 1 |
| 3 | 1 | 66.96 | 24 | 2.8 |
