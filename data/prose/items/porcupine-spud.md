## Overview

Porcupine Spud is an uncommon item that fights back when Tibo is hurt. Each time Tibo takes damage, he fires 10 fries in an even ring around himself, at most once every 0.7 seconds. With no luck it is about 2.6% of random item rolls (25% Uncommon × 8/78).

The fries are not based on the hit Tibo took. Each fry deals 30 damage that grows by 15% of its base per minute of run time, plus Tibo's [thorns](/items/thorny-jacket). Both parts are multiplied by Tibo's damage multiplier. <small>[sim-FslaxQ7g.js: `c=n.damage*function(e){let t=e.cfg.items.powerPerMinute;return e.loadout.stats.damageMult*(1+t*e.runClock/60)}(e)+n.thornsShare*i.thorns*i.damageMult`]</small> With no damage bonus that is 30 per fry at 0:00, 75 at 10:00 and 120 at 20:00.

It evolves into [Fry Volcano](/items/fry-volcano) when [Starch Plating](/passives/starch-plating) is at level 5 and you open a chest (see [Evolutions](/evolutions#item-evolutions)).

## How it works

- **Trigger.** Only hits that actually cost HP count. Dodged hits, hits Tibo is invulnerable to, hits fully absorbed by a guard weapon, and terrain or hazard-pool damage do not trigger it. <small>[sim-FslaxQ7g.js: `r||(a.hurtFlash[o]=8,e.lastHit.amount=u,e.itemFx.hurts++`]</small>
- **Cooldown.** After firing, it cannot fire again for 0.7 s, no matter how many hits land in that time. <small>[sim-FslaxQ7g.js: `` i.kind!==`onHurt`||e.tick<r.readyAt||(r.readyAt=e.tick+Ce(i.cooldown),Lu(e,r,i.proc)) ``]</small>
- **The fries.** The ring starts at a random angle. Each fry pierces 2 enemies (hits up to 3), plus any pierce bonus such as [Sharp Peeler](/items/sharp-peeler). <small>[sim-FslaxQ7g.js: `r.pierce[f]=n.pierce+i.pierceBonus,r.life[f]=l`]</small> Speed (220) scales with projectile speed and lifetime (0.6 s) with duration, so at default duration a fry travels about 165 units. Their size grows with area.
- **Stacking.** Extra copies do nothing. The fry count, damage and cooldown come from the item alone and ignore how many you hold. Copies still count when the item evolves, but Fry Volcano ignores its count too.

## Tips

- The fries scale with run time, so the item gets stronger late without any investment.
- It rewards builds that are hit often but survive, such as armor from Starch Plating, which is also its catalyst.
- Thorns from [Thorny Jacket](/items/thorny-jacket) add directly to every fry.
