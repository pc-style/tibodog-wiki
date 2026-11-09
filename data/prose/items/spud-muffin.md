## Overview

Spud Muffin is a common item that adds 10 max HP. Copies stack. It is one of eight Common items of equal weight, so with no luck it is about 7.4% of random item rolls.

The 10 HP is added to Tibo's base 100 before the percentage bonus from [Gravy Heart](/passives/gravy-heart) and the level's max HP multiplier are applied. <small>[sim-B6dlvQvf.js: `i[r.maxHp]=Math.max(1,(t.player.baseMaxHp+e.maxHp)*(1+e.maxHpPct)*t.level.maxHp)`]</small> So one muffin is worth 20 HP on Easy (×2), 15 on Normal and Hard (×1.5) and 12 on Nightmare (×1.2), before Gravy Heart.

When max HP goes up, Tibo is also healed by the amount gained, so picking up a muffin heals him too. <small>[sim-B6dlvQvf.js: `n.hp[e.me]=Math.min(r,(n.hp[e.me]??0)+Math.max(0,t))`]</small>

## Tips

- **Pair it with healing items.** Max HP makes healing from [Pickle Jar](/items/pickle-jar), [Vampire Tot](/items/vampire-tot) and snacks more useful, since they are all capped at max HP.
- Muffins are better with Gravy Heart, which multiplies the flat bonus.
