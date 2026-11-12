## Overview

Clockwork Spud evolves [Spud Decoy](/weapons/spud-decoy). Reach level 8 with Spud Decoy, hold [Four-Eyed Spud](/passives/four-eyed-spud) at any level, then open a [chest](/chests). Tibo plants wind-up spuds behind him. Nearby pests chase them; each explosion leaves a smaller decoy that explodes once more.

## How it works

- Each planting uses Amount: **three spuds at Tibo's base +1 Amount**, from the weapon's base 2. They fan out 26 units behind the direction Tibo faces. The base cooldown is 5 s. <small>[start-rows-DXdqa7Ea.js: `damage:128,cooldown:5,amount:2,area:1.3,speed:0,duration:4`]</small> <small>[sim-CjfoLCzS.js: `o=E(a.fy[e.me],a.fx[e.me])+Math.PI+(i-(r.amount-1)/2)*n.spread`]</small>
- A full-size decoy lures pests within 80 × √Area and winds for 4 s × Duration: **5 s at Tibo's base +25% Duration**. With the weapon's Area 1.3 and no Area bonus, lure reach is about 91.2 units. The first explosion deals **128 base damage** within 30 × √Area, about 34.2 units. <small>[start-rows-DXdqa7Ea.js: `reach:80},behind:26,spread:1.1,burstRadius:30`]</small> <small>[sim-CjfoLCzS.js: `Kd(n.lure,r.area),j(r.duration),t.slot`]</small>
- Each full-size explosion leaves **one echo at the same position**, not another full planting. Its lure and blast radii are 60% of the original, its wind-up is 45% of the original duration and its damage is 80%: **102.4 base damage**, about 54.7 lure reach, 20.5 blast radius and 2.25 s wind-up at those base stats. <small>[start-rows-DXdqa7Ea.js: `echo:{reach:.6,wind:.45,damage:.8}`]</small> <small>[sim-CjfoLCzS.js: `let s=qd(e,o.x[i],o.y[i],o.reach[i]*a.reach,j(r.duration*a.wind),t.slot)`]</small>
- Echoes do **not** make more echoes. Area enlarges both stages; Duration delays both explosions. More Amount adds full-size decoys and therefore their eventual echoes. <small>[sim-CjfoLCzS.js: `if(a===void 0||o.echo[i]===1)return`]</small> <small>[sim-CjfoLCzS.js: `Y(e,s?r.damage*n.echo.damage:r.damage,t.src,t.slot,r.knockback)`]</small>

**Controlled tests:** original `main-BEITxKNf.js`, Standard/Normal, seeds `s1/s2/s3`, granted the selected weapon alone, HP refilled, 8 s warmup, then 20 s standing still with six high-HP original pests held 21–26 units left and −7 to +8 units vertically: Clockwork Spud dealt 13,312 damage on all three seeds. Peeler (1,440) and Spud Decoy (1,080) matched the preceding build. Original single-reward controls on both builds evolved only the new level-8 + Four-Eyed Spud setup. No-target Game.step controls with and without optional rules produced three full decoys at tick 1, three echoes at tick 301 and no third stage after tick 436. Direct original expiry controls checked both sides of expiry, 128/102.4 damage, 60% reach and a 135-tick echo. Grants, held targets, HP refill and direct function calls are fixtures, not natural acquisition, drop odds, practical DPS or server acceptance.

## Tips

- **Plant in the pack's path.** Face away from pursuing pests so the decoys appear between Tibo and the crowd.
- **Plan for both wind-ups.** The echo stays where the first decoy exploded; it does not follow Tibo or seek a new pack.
