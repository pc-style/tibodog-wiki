## Overview

Warm Bowl leaves a healing pool when Tibo finishes charging an activation ring. It lasts 10 seconds and heals 2 HP per copy once per second while Tibo is inside, up to five copies (10 HP per pulse). Merely entering or partly charging a ring does not create a pool.

## How it works

- **Finish the activation.** Both world-POI activations and charged pickup activations call the pool hook. The pool stays at the activated ring's position, with its activation radius plus Tibo's radius. <small>[sim-BsNpoIrY.js: `Js().charged(e,n.x[t]??0,n.y[t]??0,r)`]</small>
- **Stand inside to heal.** The edge counts as inside. Healing can start immediately, then repeats once per second; at exactly 10 seconds the pool is expired. Healing is capped at max HP and does not count as eating a snack for [Second Helping](/items/second-helping). <small>[sim-BsNpoIrY.js: `l*l+u*u>r*r||(eu(e,i),n.next[t]=c+Gw)`]</small>
- **Several pools can coexist.** Each has its own pulse timer. The game stores at most 16, reusing expired slots or replacing the oldest pool when full. Copies increase healing, not duration.

## Tips

- **Use a completed ring as a short recovery stop.** You can leave and return before it expires; you do not need to remain inside continuously. The pool does not follow Tibo.
