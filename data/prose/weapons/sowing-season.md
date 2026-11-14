## Overview

Sowing Season unites [Golden Harvest](/weapons/golden-harvest) and [Landmine Harvest](/weapons/landmine-harvest). Own both evolutions and open a [chest](/chests) to combine them and free a weapon slot. Golden potatoes rain around Tibo; potatoes that land without hitting a target stay planted as mines.

## How it works

- **Rain over a wide area.** Every 2.4 s it calls 22 potatoes, or 23 with Tibo's base +1 Amount. Each has raw damage 175, a 27-unit blast radius (`18 × Area 1.5`) and knockback 1.5. Landings are spread around Tibo; each waits 0.4 s plus a random delay up to modified Duration (2.5 s with Tibo's base bonus). <small>[start-rows-BURjg0pm.js: `damage:175,cooldown:2.4,amount:22,area:1.5,speed:0,duration:2,pierce:0,knockback:1.5,interval:.1`]</small> <small>[sim-DUXHKfs3.js: `let u=n.delay+e.rng.next()*r.duration`]</small>
- **Plant the misses.** A potato becomes a mine only if its landing blast would find no target and fewer than 20 mines from this weapon are already alive. At the cap it bursts normally instead. A planted mine lasts 8 s × Duration (10 s with Tibo's base bonus), triggers within 16 units and explodes in a `26 × Area` radius, or 39 at base Area. The trigger distance does not grow with Area. <small>[start-rows-BURjg0pm.js: `lifeSec:8,size:26,trigger:16,cap:20,goldOnKill:.25`]</small> <small>[sim-DUXHKfs3.js: `i.afterLife[t]=n.lifeSec*e.loadout.stats.durationMult,i.afterRadius[t]=n.size*r.area,i.trigger[t]=n.trigger`]</small> <small>[sim-DUXHKfs3.js: `n.afterLife[t]<=0||K(e,n.x[t],n.y[t],n.radius[t],e.buf.zone)>0`]</small>
- **Keep the gold bonus.** A rain hit adds 10 percentage points to a pest's gold-drop chance; a planted mine adds 25. As on both partners, the killing hit determines the bonus, not merely having damaged the pest earlier. This raises drop chance, not coin value. <small>[start-rows-BURjg0pm.js: `` kind:`rain`,size:18,spread:140,delay:.4,goldOnKill:.1 ``]</small> <small>[sim-DUXHKfs3.js: `n.goldOnKill[t]=i.goldOnKill`]</small> <small>[sim-DUXHKfs3.js: `r.next()<n.goldChance[t]+n.killGold[t]`]</small>

**Controlled checks:** original engines `main-mEUYCZvr.js` → `main-B4LDNZMr.js`, Standard/Normal, seeds `s1/s2/s3`. Recipe fixtures cover both partner orders, each missing partner and slot release. Empty-field original strike callbacks check 0/19/20 existing mines: the twentieth can be planted, the twenty-first cannot. Mines retain damage and get a 10 s lifetime, radius 39 and 0.25 gold tag at base stats. Supported 60-second combat retains original optional rules; Golden Harvest, Landmine Harvest and four other existing weapons match old/new damage and kills in each seed, and the union deals damage in all three. Grants, held level-ups, HP refills and supplied positions/clocks are fixtures, not natural acquisition, representative DPS or measured natural gold-drop odds.

## Tips

- **Bog Witch covers the union.** Sowing Season is zone-class: the full three-piece set's new damage bonus scales its rain and inherited mine damage by 1 + 0.8 × set strength before extra ladder scaling. It does not change raw damage or the mine cap. See [set rules](/modes#gear-set-rules).
- **Return through the planted field.** Missed rain leaves useful ground behind; lure pests back toward it before the mines expire.
- **Do not expect unlimited stockpiling.** The 20-mine cap is per weapon slot, regardless of Amount.
