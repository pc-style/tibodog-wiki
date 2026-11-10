## Overview

Spark Spud rewards walking with a burst every 300 units. Each copy adds 24 base damage to the burst; item damage grows with run time and Tibo's damage multiplier. The burst reaches 48 units before Area scaling and applies a 0.35 s freeze to pests. Bosses use the normal boss status rules rather than receiving an ordinary pest freeze.

## How it works

- **Walk, rather than dash, to charge it.** The spark adds Tibo's actual frame-to-frame displacement only while he is not dashing, capped at 12 units per tick. It keeps the remainder after each burst. <small>[sim-CoEKDEz3.js: `t.walked+=Math.min(12,i)`]</small> This is not the same counter as [Spud Purse](/items/spud-purse).
- **Stack for damage, not more frequent bursts.** Every copy shares the same 300-unit threshold. Damage is `24 × copies × damage multiplier × (1 + 0.15 × run minutes)`; radius scales with the square root of Area. <small>[sim-CoEKDEz3.js: `J(e,r.damage*t.stacks*Sb(e),t.src,-1,r.knockback)`]</small>

## Tips

- **Keep moving between activation rings.** The burst is centred on Tibo, so walking past nearby pests is more useful than charging it far from the fight. That is positioning advice, not a measured survival advantage.
