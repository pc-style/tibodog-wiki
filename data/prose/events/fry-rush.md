## Overview

Fry Rush starts at 8:15 and 13:30 with the active more-variety rules. It multiplies weapon timer speed by 1.3 for 15 seconds: a 30% faster firing rate, not 30% less cooldown and not +30% damage per hit.

## How it works

- **It stacks with the existing timer modifiers.** The game applies the ×1.3 after gear/variety timer rules, including the GPU throttle contribution. It is separate from the cooldown stat's diminishing returns and cap. <small>[sim-DUXHKfs3.js: `n!==void 0&&e.time<n.fryRushUntil?$v(e,t*qv(e))*n.fireRate:$v(e,t*qv(e))`]</small>
- **The time limit is strict.** The bonus applies while current simulation time is less than its expiry and is gone at exactly 15 seconds. It does not promise a faster independent attack timer on every effect, such as Steam Vent's separate aura pulses. <small>[sim-DUXHKfs3.js: `e.time<n.fryRushUntil?$v(e,t*qv(e))*n.fireRate`]</small>

## Tips

- **Use the short firing window to clear space.** It speeds weapon countdowns without increasing the damage of an individual hit. [GPU](/passives/gpu) can still throttle during the event.
