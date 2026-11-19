## How it works

Afterburner Fries fires **once at dash start**, from the dash's starting position, in a fan facing opposite the dash. It does not fire while Tibo stands still or continuously throughout the dash. The fan spans 1.1 radians in total; more Amount puts more fries inside that same fan. Raw Amount 4 plus Tibo's built-in +1 gives five fries at level 1. <small>[sim-tHS_Ichq.js: `` if(!nd(e))return; ``]</small> <small>[sim-tHS_Ichq.js: `` return r<=1?t:t+(n/(r-1)-.5)*e.spread ``]</small>

Fries start 10 units back along their individual firing directions, travel at raw speed 300, and have collision radius `3 × √Area`. Their raw 0.5-second life becomes 0.625 s with Tibo's base Duration. They use ordinary straight-projectile collision and piercing; this base weapon has neither Jet Fryer's second fan nor its oil. <small>[sim-tHS_Ichq.js: `` s.x[c]=e.player.dashFromX[e.me]+l*n.gap ``]</small> <small>[sim-tHS_Ichq.js: `` s.radius[c]=n.size*Math.sqrt(r.area) ``]</small>

Controlled checks on `main-DwGb2BE_.js`, Standard/Normal, seeds `s1/s2/s3`, granted level 1 and no gear: `node tools/probe-mechanics-groups.mjs` checked idle versus actual dash, five backward shots, total fan width, speed, collision size and expiry without oil. These are supplied-loadout checks, not natural acquisition or representative DPS.

## Evolution

Max Afterburner Fries at level 8 and hold [Hot Start](/passives/hot-start), then open a [chest](/chests) to evolve it into [Jet Fryer](/weapons/jet-fryer). The evolution adds a second, slower backward fan and oil splats at the fries' final positions.
