## Overview

Fry Rush starts at minutes 11 and 18 with the active more-variety rules. It multiplies weapon timer speed by 1.3 for 15 seconds: a 30% faster firing rate, not 30% less cooldown and not +30% damage per hit.

## How it works

- **It stacks with the existing timer modifiers.** The game applies the ×1.3 after gear/variety timer rules, including the GPU throttle contribution. It is separate from the cooldown stat's diminishing returns and cap. <small>[sim-CJCEF4hP.js: `return Vx(e,t*Fx(e))*n.fireRate`]</small>
- **The time limit is strict.** The bonus applies while current simulation time is less than its expiry and is gone at exactly 15 seconds. It does not promise a faster independent attack timer on every effect, such as Steam Vent's separate aura pulses. <small>[sim-CJCEF4hP.js: `if(n!==void 0&&e.time<n.fryRushUntil)`]</small>

## Tips

- **Use the short firing window to clear space.** It speeds weapon countdowns without increasing the damage of an individual hit. [GPU](/passives/gpu) can still throttle during the event.
