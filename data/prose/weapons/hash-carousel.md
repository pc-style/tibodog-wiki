## Overview

Hash Carousel is the union of [Hashnado](/weapons/hashnado) and [Tater Twister](/weapons/tater-twister). Open a [chest](/chests) with both evolutions to combine them and free one weapon slot. Golden wheels circle Tibo and throw returning hash browns; movement speeds up both the wheels and the throws.

## How it works

- **Keep moving to set the pace.** Like Tater Twirl, pace follows actual movement relative to Tibo's base walking speed, bounded between 0.12 and 2. It rises quickly while running and eases down while stopped. The wheels have 440 base damage and share a per-pest hit delay of 0.2 s divided by pace. Five wheels by default cover more ground, not five independent hit timers. <small>[sim-DZHQsQUT.js: `Math.max(1,Math.round(60*r.hitInterval/o.pace))`]</small>
- **Sweep a wider ring.** The orbit is 38 × √Area units, about 45 at raw Area 1.4. Each wheel's hit radius is 9 × Area. Raw spin is 6 rad/s multiplied by pace; projectile-speed bonuses count at half strength for spin, as on Tater Twister.
- **Throw from every wheel.** Each volley throws one hash brown from each wheel, angled 0.5 radians ahead. The throw cooldown is 1.4 s divided by pace before cooldown bonuses: roughly 1.4 s at ordinary walking pace, 0.7 s at maximum pace and 11.7 s once fully slowed while standing. <small>[sim-DZHQsQUT.js: `for(let o=0;o<i.count;o++){if(ok(e,t,n,r,o)<0)return a;a++}`]</small>
- **Hit on the way out and back.** Each throw deals 20% of wheel damage (88 before bonuses, calculated from the current base damage), starts at speed 220 and reverses under acceleration 340. Both scale with projectile speed. Lifetime is 2.8 s before Duration bonuses (3.5 s with Tibo's base bonus), with unlimited pierce. <small>[sim-DZHQsQUT.js: `J(e,r.damage*n.share,t.src,t.slot,r.knockback)`]</small> <small>[sim-DZHQsQUT.js: `o.returnAccel[s]=n.returnAccel*u`]</small>

**Measured** on original engines `main-chVaZCYa.js` → `main-BlAVw0Co.js`, Standard/Normal, seeds `s1/s2/s3`: only the new union resolver combines Hashnado and Tater Twister, in either order, freeing one slot. Missing and base partners do not combine. Direct original-function controls at movement ratios 0 / 0.5 / 1 / 2 / 3 confirm the pace bounds, five throws per volley, 44 damage per throw, 3.5 s lifetime, return acceleration and cooldown blocking an immediate second volley. These are supplied-loadout/movement fixtures, not natural acquisition or representative DPS. Sixty-second stepped Hash Boomerang, Hashnado, Tater Twirl and Tater Twister controls retain the original optional rules and match the old build in all three seeds.

That 44-damage measurement predates the current base-damage increase; it has not been rerun.

## Tips

- **Run to keep throwing.** Standing still keeps the wheels but slows their hits and leaves a long gap between throws.
- **Plan for two catalysts.** Hashnado needs Sour Cream; Tater Twister needs Salt Shaker. Both passives keep contributing after the union.
