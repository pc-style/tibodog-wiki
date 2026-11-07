## Overview

Baked Alaska unites [Permafrost Fries](/weapons/permafrost-fries) and [Spicy Hot Potato](/weapons/spicy-hot-potato). Own both evolutions, then open a [chest](/chests). The union replaces them and frees a weapon slot. Their unevolved base weapons do not qualify.

Every 2 s it throws 3 homing potatoes (raw Amount 2 plus Tibo's built-in +1), 0.25 s apart. Each deals 11 base damage and freezes ordinary pests for 2 s, or 2.5 s with Tibo's base Duration bonus. Its own direct hits and small blasts deal double damage to already-frozen pests; it does not double every weapon's damage.

## How it works

- A potato can hit up to 8 targets before its last-hop blast (Pierce 7). It seeks an unhit target within 120 units after each hit. Unlike Hot Potato, it bursts immediately if no next target is in range, even with hops left. <small>[sim-dQVU-VqL.js: `if(o<=0||a.fuseAlone[t]===1&&!dl(s))return KC(e,t,r),void a.pool.kill(t)`]</small>
- The small blast deals 3× projectile damage in radius 32 × Area, about 44.8 units at base Area 1.4. It carries the projectile's ×2 bonus against already-frozen targets. <small>[sim-dQVU-VqL.js: `Y(e,r.damage[t]*r.fuseBlast[t],r.src[t],r.slot[t],r.knockback[t]),e.attack.shatter=r.shatter[t],Wl(e,r.x[t],r.y[t],r.fuseRadius[t])`]</small>
- A second, wider strike deals 2.5× projectile damage to frozen ordinary pests within 90 × Area (126 units at base Area). The ordinary pest that ended the hop qualifies even if it was not frozen before the hit. Bosses are excluded from this wide strike and cannot be frozen. The wide strike has no additional ×2 shatter multiplier. <small>[sim-dQVU-VqL.js: `Y(e,r.damage[t]*r.fuseShatter[t],r.src[t],r.slot[t],.4),X(e,i,a)`]</small> <small>[sim-dQVU-VqL.js: `return!hl(t)&&(t===n||G(e,t).freezeT[W(t)]>0)`]</small>
- Each original potato's blast throws two fresh potatoes with full hops and flight time. They keep freeze, shatter and the lone-target burst, but do not spawn further copies. <small>[sim-dQVU-VqL.js: `i.status[a]=i.status[t],i.shatter[a]=i.shatter[t]`]</small> <small>[sim-dQVU-VqL.js: `i.fuseShatter[a]=i.fuseShatter[t],i.fuseShatterRadius[a]=i.fuseShatterRadius[t],i.fuseAlone[a]=i.fuseAlone[t]`]</small>
- Running out of flight time also triggers both blasts and the original potato's copies. Without a last-hit target, only frozen ordinary pests qualify for the wide strike. Its starting flight time is 3 s × Duration (3.75 s with Tibo's base bonus); each hop keeps at least 1.2 s remaining.

**Controlled tests:** original `main-CPVZC6XS.js`, Standard/Normal, seeds `s1/s2/s3`, granted Baked Alaska alone, HP refilled, 4 s warmup, then six high-HP pests held 45–90 units right for 20 s with other spawning and pickups culled: 62,304 damage on each seed and a 2.5 s freeze peak. Existing Peeler, Hot Potato, Spicy Hot Potato and Permafrost Fries controls matched the preceding build exactly. Original chest-reward controls united the two evolutions on all three seeds only in the new build; base/base and evolved/base controls did not unite. Separate original hop/blast controls with zero-radius targets distinguished 119/121-unit hop distances and 125.9/126.1-unit wide-strike distances. Copies retained freeze/shatter and had no respawn. These grants, held targets and direct reward/function calls are fixtures, not natural acquisition, drop odds, practical DPS or server acceptance.

## Tips

- **Keep pests close enough to chain.** Hops reach 120 units without Area scaling; Area enlarges the blasts instead. Frozen stragglers within the wider blast can take damage even when they are outside the small explosion.
- Against a lone boss, expect early bursts and the two copies, not an eight-target chain or the wide frozen-pest strike.
