## How it works

Burst triples computed Amount and cooldown, sets within-volley interval to zero, and distributes the simultaneous launches in **one full ring** around the first launch’s random angle. It also scales damage ×1.29. Supplied level-one Amount bonus 0/3 produces **9/18 sprouts**, spaced **40°/20°**, all in one tick, followed by a 6 s cooldown. They are not three timed waves or nine sprouts all aimed in the same direction. Each projectile subsequently uses ordinary nearest-target steering. <small>[sim-eDYsG0no.js: `` id:`seeker-sprouts-burst` ``]</small>

Launches start around the facing direction with a random **±1.2-radian** offset, before Burst’s ring override. Ordinary steering refreshes on **(tick + projectile slot) mod 6 = 0**, searches within **200 units** of the projectile, and turns at most **5/60 radians per tick** at level one while preserving speed. The retained controls deliberately reset one projectile’s position/velocity and advance the original movement consumer; they do not simulate a complete flight to a moving pest. <small>[sim-eDYsG0no.js: `` Jj(e)+e.rng.range(-1.2,1.2) ``]</small> <small>[sim-eDYsG0no.js: `` if((e.tick+t)%6!=0)return ``]</small> <small>[sim-eDYsG0no.js: `` let i=e.loadout.bySlot(t);return i!==void 0&&pk(i)?fk(e,n,r,200,0):cd(e,n,r,200) ``]</small>

Retained command: `node tools/probe-special-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Original choice handling receives a supplied level-one rune card, bypassing ordinary max-level acquisition. Original consumers are isolated; no full-world/death/drop stepping or network, and high-HP aphids never die. Backhand uses supplied enemy bullets; Hopper additionally uses supplied Pierce 0/2 and forced contacts/expiry; summon checks isolate one emitted unit after recording the full count. No natural acquisition, max-level/evolved/union equivalence, autonomous projectile trajectories, moving-pest combat, status progression, DPS/survival, private-server or device proof. Prior scenarios remain separately labeled history.

Examples are **s1 supplied level-one fixtures**, not ordinary max-level builds. Bonus is supplied Amount bonus; damage is per hit/bolt, not DPS.

| Bonus | Sprouts | Damage | In-volley gap (s) | Cycle (s) |
|---|---|---|---|---|
| 0 | 9 | 15.48 | 0 | 6 |
| 3 | 18 | 15.48 | 0 | 6 |
