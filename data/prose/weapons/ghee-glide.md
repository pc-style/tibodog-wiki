## Overview

Ghee Glide is the evolution of [Butter Streak](/weapons/butter-streak). It works the same way, laying a strip of damaging pools along each dash and, when its cooldown is ready, behind Tibo as he walks. The numbers are much higher: 120 damage per hit instead of 40 at Butter Streak's level 8, pools 50% larger (area 1.5), strips lasting 4.375 s (3.5 s plus Tibo's base +25% duration), and a 1.5 s cooldown for the walking strip. Pests in the ghee are slowed to half speed for 1 s per hit, as before.

New with the evolution, Tibo moves 15% faster while standing in his own ghee. It is made by opening a chest with Butter Streak at level 8 and [Spud Sneakers](/passives/spud-sneakers) at any level (see [Evolutions](/evolutions) and [Chests](/chests)).

## How it works

- Placement, hit timing (every 0.3 s, one shared re-hit timer per pest across all strips) and the slow are the same as on [Butter Streak](/weapons/butter-streak).
- With area 1.5 each pool has radius 13.5, so a strip is 5 pools along the 48-unit dash path.
- **Speed boost**: while Tibo is inside any zone with a haste value, his move speed is multiplied by `1 + haste`, using the largest haste of the zones he is in. Ghee pools have haste 0.15. <small>[sim-pcti3OIT.js: `haste[i]=n.trail?.haste??0`]</small> Overlapping strips do not stack the bonus.
- As on Butter Streak, the "burns" in the description is the pool damage itself; there is no burn status in the weapon's data.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path, no dashes): every 1.8 s it laid 10 pools at once (two strips of 5, radius 13.5), each with a 4.375 s lifetime, and a pest on the strip was hit every 0.3 s for 80. Dash strips and the speed boost were not measured. All three seeds gave the same figures.

## Tips

- **Unite with Salt Flats.** A chest can combine both evolutions into [Salted Butter](/weapons/salted-butter), adding slow, push and a separate burn status to the fast trail.
- **Kite along your fresh strips.** Walking along a strip you just laid keeps the 15% speed bonus, which helps when kiting.
- Spud Sneakers is also the catalyst for [Railfry](/weapons/railfry), so one copy can serve both evolutions if you carry [Fry Lance](/weapons/fry-lance) too.
