## How it works

Big Game changes the in-flight target search to the eligible pest with the highest **maximum HP**, while scaling projectile damage ×1.18. It does not aim launches directly at that pest or teleport the projectile onto it. The asymmetric steering control prefers a farther pest with max HP 30 million/current HP 1 million over a nearer pest with max/current HP 10 million. Moving the tougher pest outside the search range makes the next refresh choose the eligible nearer pest. This is a steering control, not a completed moving-target hit or total-damage benchmark. <small>[sim-CaoSDYmj.js: `` id:`seeker-sprouts-big-game` ``]</small>

Launches start around the facing direction with a random **±1.2-radian** offset, before Burst’s ring override. Ordinary steering refreshes on **(tick + projectile slot) mod 6 = 0**, searches within **200 units** of the projectile, and turns at most **5/60 radians per tick** at level one while preserving speed. The retained controls deliberately reset one projectile’s position/velocity and advance the original movement consumer; they do not simulate a complete flight to a moving pest. <small>[sim-CaoSDYmj.js: `` OM(e)+e.rng.range(-1.2,1.2) ``]</small> <small>[sim-CaoSDYmj.js: `` if((e.tick+t)%6!=0)return ``]</small> <small>[sim-CaoSDYmj.js: `` let i=e.loadout.bySlot(t);return i!==void 0&&Jk(i)?qk(e,n,r,200,0):ud(e,n,r,200) ``]</small>

Retained command: `node tools/probe-special-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Original choice handling receives a supplied level-one rune card, bypassing ordinary max-level acquisition. Original consumers are isolated; no full-world/death/drop stepping or network, and high-HP aphids never die. Backhand uses supplied enemy bullets; Hopper additionally uses supplied Pierce 0/2 and forced contacts/expiry; summon checks isolate one emitted unit after recording the full count. No natural acquisition, max-level/evolved/union equivalence, autonomous projectile trajectories, moving-pest combat, status progression, DPS/survival, private-server or device proof. Prior scenarios remain separately labeled history.

Examples are **s1 supplied level-one fixtures**, not ordinary max-level builds. Bonus is supplied Amount bonus; damage is per hit/bolt, not DPS.

| Bonus | Sprouts | Damage | In-volley gap (s) | Cycle (s) |
|---|---|---|---|---|
| 0 | 3 | 14.16 | 0.12 | 2 |
| 3 | 6 | 14.16 | 0.12 | 2 |
