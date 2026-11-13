## Overview

Tot Gatling is the evolution of [Tot Toss](/weapons/tot-toss): instead of a few tots every second, it fires a nonstop stream at the nearest pest. Each tot deals 24 damage, flies faster than Tot Toss's (speed 230) and passes through 2 enemies before stopping. Its raw amount is 1, but like every non-aura weapon it gets +1 from Tibo's base amount bonus (see [Stats](/stats)), so each 0.13 s cycle throws 2 tots. That works out to about 15 tots per second, or roughly 360 damage per second on one target before other bonuses. A maxed Tot Toss throws 5 tots of 30 per second, 150 damage.

You get it by opening a chest while Tot Toss is level 8 and you own [Chives](/passives/chives) at any level. See [Evolutions](/evolutions) and [Chests](/chests). It is a different weapon from [Locked Gatling](/weapons/locked-gatling), which fires tots in fixed-angle bursts.

**Union:** hold [Tot Cavalry](/weapons/tot-cavalry) as well and open a chest to make [Tot Barrage](/weapons/tot-barrage), freeing one weapon slot. Its thrown tots pop a charging tot on their first hit, and walking adds squads behind Tibo.

## How it works

Targeting and spread follow [Tot Toss](/weapons/tot-toss#how-it-works): every tot is aimed at the nearest enemy when it leaves, and the second tot of each pair gets a small random spread.

**Frame timing.** The game simulates 60 frames per second and rounds every cooldown to whole frames, so 0.13 s becomes 8 frames (0.133 s). <small>[sim-B7Rtlarz.js: `e.tick++,e.time=e.tick/60`]</small> <small>[boot-R9cefr3R.js: `function Bn(e){return Rn(Math.max(1,Math.round(60*e)))}`]</small>

**Volleys limit the fire rate.** A new volley only starts after the previous one has finished, and tots within a volley leave 0.1 s apart. <small>[sim-B7Rtlarz.js: `t.cd<=0&&t.volleyLeft<=0`]</small> On most weapons that gap is far shorter than the cooldown, but Tot Gatling's cooldown is already close to it. As a result, cooldown reduction past a point stops helping, and extra amount makes the stream slower. Working through the timing rules gives these fire rates (tots per second, without fire-rate effects such as [Frenzy Fryer](/points-of-interest#frenzy-fryer)):

| Tots per volley | Base cooldown (8 frames) | [Chives](/passives/chives) level 5, −35% (5 frames) | 60% cooldown cap (3 frames) |
|---|---|---|---|
| 2 (default) | 15 | 17.1 | 17.1 |
| 3 | 13.8 | 13.8 | 13.8 |
| 4 | 12.6 | 12.6 | 12.6 |
| 5 | 12 | 12 | 12 |

With more tots per volley the rate keeps falling toward 10 per second. With 2 tots per volley, cooldown reduction stops adding anything once the cooldown rounds to 7 frames or less (below 0.125 s, about 4% reduction). These figures are this wiki's calculation from the code above, not numbers the game shows.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; one pest held 60 units to Tibo's right; amount raised with 1–3 [Extra Eye](/items/extra-eye) items and cooldown cut with [Chives](/passives/chives) level 5, plus 9 Chive Charm items for the 60% cap, all granted directly): tots per second, counted over 10 s, were 15.0 / 17.1 / 17.1 with 2 tots per volley (base cooldown / Chives 5 / cap), 13.9 with 3, 12.6 with 4 and 12.0 with 5 in every cooldown column. That matches the table: 3 tots per volley is 3 tots every 13 frames, 13.85 per second. Each tot spawned with a 2.5 s lifetime and pierce 2, and in a line of 8 pests only the nearest 3 were ever hit. All three seeds gave the same figures.

## Tips

- **Extra amount lowers Tot Gatling's damage.** Extra amount from [Sprouting Eyes](/passives/sprouting-eyes), [GPU](/passives/gpu) or [Extra Eye](/items/extra-eye) lowers Tot Gatling's damage. If it is your main weapon, think twice before taking amount for another weapon.
- A little cooldown reduction helps (Chives level 1 already reaches the 17.1 tots per second ceiling); beyond that, damage and pierce are better investments.
- Pierce 2 lets the stream cut through pests that step in front of the target, which makes it a good boss and elite weapon.
