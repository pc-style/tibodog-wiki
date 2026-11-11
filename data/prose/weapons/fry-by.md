## Overview

Fry-By unites [Tailgate Party](/weapons/tailgate-party) and [Jet Fryer](/weapons/jet-fryer). Open a [chest](/chests) with both evolutions to combine them and free a weapon slot. It keeps backwards volleys between dashes and sprays a double fan along the dash path.

## How it works

- **Keep the backwards spray.** Raw damage 74, cooldown 0.5 s and Amount 5 give six fries per moving volley with Tibo's base +1, spaced 0.06 s apart. They fly at speed 240 with Pierce 2 and 0.8 s raw lifetime (1 s with base Duration). If still when the volley starts, Tibo drips one fry; a fry released while still flies at 35% speed, or 84. Ordinary volley fries do not leave oil. <small>[sim-CIWbMQSD.js: `t.volleyLeft=jS(e)?1:r.amount`]</small> <small>[sim-CIWbMQSD.js: `$.speed=jS(e)?r.speed*n.dripSpeed:r.speed`]</small>
- **Spread dash shots along the path.** Each dash emits two rows of fries across 2.6 radians (about 149°), backwards from positions 8 units behind Tibo as the dash advances. Each row has one fry per Amount: twelve total with default Amount 6. Unlike Jet Fryer, they do not all launch at the dash origin. The two rows fly at full and half speed (240 and 120). <small>[sim-CIWbMQSD.js: `m=a.x[o]-d*n.gap,h=a.y[o]-f*n.gap`]</small> <small>[sim-CIWbMQSD.js: `$.speed=i===0?r.speed:r.speed*n.innerSpeed`]</small>
- **Leave oil at the fan's endpoints.** Dash fries have unlimited pierce and lifetime max(0.2 s, 0.22 × modified Duration), 0.22 s with base Duration. Each expiring dash fry creates a radius-12 splat, scaled by √Area, lasting 4 s and checking every 0.25 s for the fry's full damage. Normal backwards fries do not create splats. <small>[sim-CIWbMQSD.js: `a.slot[s]===t.slot&&a.kind[s]===AS&&a.life[s]-i<=0&&nx(e,n.oil,r,s)`]</small> <small>[sim-CIWbMQSD.js: `$.pierce=n.fanPierce`]</small>

**Controlled checks:** original `main-CejfDMmT.js` → `main-mEUYCZvr.js`, Standard/Normal, seeds `s1/s2/s3`. Only the new engine combines the pair in either order and frees a slot; missing-partner controls do not combine. Original callbacks at supplied Amount 1/2/5, moving/still and all nine dash ticks verify double-row counts, speeds, minimum 0.2 s lifetime, unlimited pierce and one four-second oil splat per fan fry. Supported 60-second combat retains original optional rules; Tailgate Party, Jet Fryer and six other existing weapons match old/new damage and shots in every seed. Grants, held level-ups, HP refills and supplied targets/stats/clocks are fixtures, not natural acquisition, practical DPS or server acceptance.

## Tips

- **Dash away from a crowd.** The fans and oil cover the path behind Tibo.
- **Add dash charges for more fans.** The ordinary volley has its own cooldown, separate from dash-triggered fans.
