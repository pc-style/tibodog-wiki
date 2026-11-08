## Overview

Grease Fire unites [Wildfire Roast](/weapons/wildfire-roast) and [Pressure Cooker](/weapons/pressure-cooker). Open a [chest](/chests) with both evolutions to free one weapon slot. Moving builds flames for a wide sweep and leaves burning oil puddles. It does not retain Pressure Cooker's healing.

## How it works

- **Build up to five flames.** Each full second of movement lights one; a damaging hit puts out two, and stopping puts them all out. As with [Hot Streak](/weapons/hot-streak), dodged or fully shielded hits do not cost flames.
- **Sweep farther.** Raw damage is 220. Sweep radius is 44 × Area × (1 + 0.48 × flames): 76.56 at raw Area 1.74 with no flames, about 260.3 with five. The sweep checks every 1 s ÷ (1 + 0.24 × flames), before cooldown bonuses, and waits if no pest is in range. <small>[sim-CUTgHmYT.js: `return t.size*n.area*(1+t.streak.area*r)`]</small>
- **Leave oil while flames are lit.** Moving with at least one flame lays puddles every 0.5 s × cooldown multiplier ÷ (1 + 0.24 × flames), rounded to ticks. With no cooldown bonuses this is 24 ticks at one flame and 14 at five. The 16-slot puddle bank places them randomly around Tibo's feet, not exactly under his centre. Radius is 14 × Area, or 24.36 at raw Area 1.74. Lifetime uses weapon Duration: 1.2 s raw, 1.5 s with Tibo's base bonus. <small>[sim-CUTgHmYT.js: `return n.everySec*e.loadout.stats.cooldownMult/r`]</small> <small>[sim-CUTgHmYT.js: `r.puddleHead=(i+1)%16`]</small>
- **Burn pursuers.** Active puddles check every 15 ticks (0.25 s). Each hit deals 40% of the sweep's damage (88 raw) and applies a 40 DPS, 2 s burn before stat modifiers. Overlapping puddles share a hit tag for that check, so overlap does not multiply the direct hit on one pest. Stopping prevents new puddles but does not erase those already laid. <small>[sim-CUTgHmYT.js: `J(e,r.damage*n.damage,t.src,t.slot,0),e.attack.status=Xi(e,n.burn)`]</small> <small>[sim-CUTgHmYT.js: `W(e,n).pickTag[U(n)]!==o&&(tu(e,n,o),X(e,n))`]</small>

**Controlled checks:** original `main-CejfDMmT.js` → `main-mEUYCZvr.js`, Standard/Normal, seeds `s1/s2/s3`. Only the new engine combines both evolutions, in either order, and frees a slot; missing partners do not combine. Direct original callbacks at 0/1/4/5 flames verify the first puddle's tick boundary, radius, lifetime, expiry and stop reset. Sixty-second combat fixtures retain original optional rules; Hot Streak, Wildfire Roast, Pressure Cooker and five other existing weapons match old/new damage and shots in every seed. These supplied-loadout/target/clock fixtures, held level-ups and HP refills are not natural acquisition, practical DPS or server acceptance.

## Tips

- **Stay moving after the union.** The sweep works without flames, but oil laying needs at least one.
- **Replace the lost healing elsewhere.** Root Network remains a passive, but Grease Fire itself has no heal-on-hit effect.
