## Overview

Gravy Whirlpool is the union of [Gravy Flood](/weapons/gravy-flood) and [Stand Mixer](/weapons/stand-mixer). A chest combines the two evolutions and frees a weapon slot. Its scalding clover-shaped pools pull pests inward, burn them, grow and drift after Tibo, then slam when they expire.

## How it works

- **Cast three pools by default.** Raw Amount 2 plus Tibo's built-in +1 gives three pools, 0.1 s apart, every 3.2 s before cooldown bonuses. The targeting range is 160 units. This is fewer pools than Gravy Flood, but each adds Stand Mixer's pull and slam.
- **Grow the pool and its pull together.** A pool starts at radius 30 × Area: 42 units at raw Area 1.4. Its pull starts at 64 × Area, or 89.6 units. Both radii grow by 4 units per second, while the pool follows Tibo at 10 units per second. With base Duration it lasts 5 s, ending 20 units wider in radius.<small>[sim-B1TRz8tn.js: `let s=o*r*10;i.radius[t]=i.radius[t]+s,i.pull[t]>0&&(i.pullRadius[t]=i.pullRadius[t]+s)`]</small>
- **Hit and burn.** Each pool deals 32 base damage every 0.25 s to pests inside its clover shape. A hit applies 12 burn damage per second for 2 s before Duration bonuses (2.5 s with Tibo's base bonus). Its pull strength is 150; bosses are not pulled.<small>[start-rows-D8hrTSAC.js: ``kind:`pool`,shape:`clover`,size:30,hitInterval:.25,range:160,grow:.4,follow:10,pull:{speed:150,radius:64,slam:3},onHit:{kind:`burn`,dps:12,seconds:2}``]</small>
- **Slam at the end.** Expiry deals 3 × pool damage (96 before bonuses) in a circle with 1.2 × the pool's grown radius. This explosion can hit bosses, unlike the pull.<small>[sim-B1TRz8tn.js: `e.attack.damage=n.damage[t]*n.slam[t],bu(e,n.x[t],n.y[t],1.2*n.radius[t])`]</small>

**Measured** on original engines `main-D3Ygc0S-.js` → `main-BR1KgmXn.js`, Standard/Normal, seeds `s1/s2/s3`: only the new resolver combines the two partners, in either order, freeing one slot; missing and base partners do not combine. Original callback controls confirm the 42/89.6 starting radii, 5 s lifetime, 32-damage hits 15 ticks apart, 12-per-second burn for 2.5 s, inward pull and 96-damage slam. Growth controls cross zero/positive growth with no pull/pull on both builds; existing Gravy Flood and Stand Mixer retain their behavior. These fixtures grant equipment, hold level-ups, refill HP and supply targets/stats/clocks; they do not establish natural acquisition or representative DPS. Six existing weapons also match old/new damage and kills in three 60-second seeded runs each, with the original optional rules installed.

## Tips

- **Circle back through the pools.** They follow more slowly than Tibo walks; looping back keeps chasing pests inside the growing damage and pull areas.
- **Give the slam time.** Duration keeps a pool pulling and growing longer before its final hit. Area enlarges its starting pool, pull and slam, but does not multiply the fixed growth rate.
