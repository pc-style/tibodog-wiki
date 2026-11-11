## Overview

Porcupine Spud is an uncommon item that fights back when Tibo is hurt. Each time Tibo takes damage, he fires 10 fries in an even ring around himself, at most once every 0.5 seconds.

The fries are not based on the hit Tibo took. Each fry deals 50 damage that grows by 15% of its base per minute of run time, plus Tibo's [thorns](/items/thorny-jacket). Both parts are multiplied by Tibo's damage multiplier. <small>[sim-CIWbMQSD.js: `c=n.damage*Lb(e)+n.thornsShare*i.thorns*i.damageMult`]</small> With no damage bonus that is 50 per fry at 0:00, 125 at 10:00 and 200 at 20:00.

It evolves into [Fry Volcano](/items/fry-volcano) when [Starch Plating](/passives/starch-plating) is at level 5 and you open a chest (see [Evolutions](/evolutions#item-evolutions)).

## How it works

- **Trigger.** Only hits that actually cost HP count. Dodged hits, hits Tibo is invulnerable to, hits fully absorbed by a guard weapon, and terrain or hazard-pool damage do not trigger it. <small>[sim-CIWbMQSD.js: `a.hurtFlash[o]=8,e.lastHit.amount=d,e.itemFx.hurts++`]</small>
- **Cooldown.** After firing, it cannot fire again for 0.5 s, no matter how many hits land in that time. <small>[sim-CIWbMQSD.js: `` i.kind!==`onHurt`||e.tick<r.readyAt||(r.readyAt=e.tick+v(i.cooldown),Qb(e,r,i.proc)) ``]</small>
- **The fries.** The ring starts at a random angle. Each fry pierces 2 enemies (hits up to 3), plus any pierce bonus such as [Sharp Peeler](/items/sharp-peeler). <small>[sim-CIWbMQSD.js: `r.pierce[f]=n.pierce+i.pierceBonus,r.life[f]=l`]</small> Speed (220) scales with projectile speed and lifetime (0.6 s) with duration, so at default duration a fry travels about 165 units. Their size grows with area.
- **Stacking.** Extra copies do nothing. The fry count, damage and cooldown come from the item alone and ignore how many you hold. Copies still count when the item evolves, but Fry Volcano ignores its count too.

## Tips

- **It grows stronger late with no investment.** The fries scale with run time, so the item gets stronger late without any investment.
- It rewards builds that are hit often but survive, such as armor from Starch Plating, which is also its catalyst.
- Thorns from [Thorny Jacket](/items/thorny-jacket) add directly to every fry.
