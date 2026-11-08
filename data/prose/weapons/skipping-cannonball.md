## Overview

Skipping Cannonball sends a cannonball along Tibo's facing direction. It bursts at each bounce, with later bursts growing in size and damage. Amount adds bounces rather than firing more cannonballs in the volley.

## Evolution

**Reach level 8 and own [Sprouting Eyes](/passives/sprouting-eyes) at any level**, then open a [chest](/chests) to evolve it into [Russet Ricochet](/weapons/russet-ricochet). The evolution fires a two-ball fan and throws a smaller spud from every parent burst. <small>[start-rows-BQHn4-F9.js: `` from:`skipping-cannonball`,catalyst:`sprouting-eyes` ``]</small>

## How it works

The hop count is 3 plus the final amount above `1 + player.baseAmount`, with no negative extra hops. Each hop takes 17 simulation ticks, about 0.283 seconds. At bounce n, the radius is `(23 + 5 × (n − 1)) × √area`, and damage is `weapon damage × (1 + 0.25 × (n − 1))`. Speed increases the distance between bounces, with a floor of 80 units/second. <small>[sim-CJCEF4hP.js: `return t.hops+Math.max(0,Math.round(n.amount)-r)`]</small> <small>[sim-CJCEF4hP.js: `return e.radius[t]+e.grow[t]*(n-1)`]</small>

**Aim down a line of pests** to make use of the later, larger bursts. Extra amount extends that line with more bounces; it does not widen the single-ball volley.
