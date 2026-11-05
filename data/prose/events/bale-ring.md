## Overview

Ring of Hay Bales is one of the scheduled events. The [wave table](/bosses) fires it at 6:00, 9:00, 13:00, 16:00 and 19:00, and after 20:00 it alternates with [Fry Fly Swarm](/events/fly-swarm), taking every odd minute. After the announcement, a ring of [Hay Bales](/enemies/hay-bale) appears 170 units around Tibo and starts rolling inward.

Hay bales are tanky and very slow: 400 base HP, 14 contact damage and a speed of 9, against Tibo's base speed of 62. Each bale disappears 22 seconds after the event starts. A bale you kill drops ordinary pest loot (3 XP and a 5% gold chance). Bales that time out drop nothing.

## How it works

- **Count.** 36 bales × the difficulty's wall-pest multiplier, with a minimum of 1. That is 5 on Easy, 11 on Normal and Hard, and 22 on Nightmare (see [Modes](/modes)). They are spaced evenly around the circle. <small>[sim-DrUZpiNa.js: `o=Math.max(1,Math.round(t.count*e.cfg.level.wallPests))`]</small>
- **Movement.** Bales don't chase Tibo. Each one heads for the spot where Tibo stood when the event fired and stops within 20 units of it. At speed 9, the ring takes about 17 seconds to close from 170 to 20 units. <small>[sim-DrUZpiNa.js: `r=n.tx[t]-n.x[t],i=n.ty[t]-n.y[t],a=Fe(r,i),o=a<20?0:n.speed[t]`]</small>
- **Scaling.** The event sets each bale to its base speed of 9, so time and curse never make bales faster. Their HP and damage still follow normal [enemy scaling](/enemy-scaling). <small>[sim-DrUZpiNa.js: `r.speed[l]=S.enemyAt(n).speed,r.tx[l]=i,r.ty[l]=a,r.despawnAt[l]=e.time+t.life`]</small>
- **Despawn.** A bale is removed at 22 seconds, or earlier if it ends up more than about 460 units from Tibo. A removed bale gives nothing. <small>[sim-DrUZpiNa.js: `if(s>0&&e.time>=s){i.pool.kill(o);continue}`]</small>
- **Full field.** Like other non-gold events, the ring is skipped (with no announcement) if the enemy pool is already at its cap of 550.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, `--god`, seed `wiki`; the clock warped to 2 s before each minute with pests removed first): the ring fired at 6:00, 9:00, 13:00 and 16:00, and on Normal also at 19:00, 21:00, 23:00 and 25:00. Each ring had 5 bales on Easy, 11 on Normal and Hard, and 22 on Nightmare.

## Tips

- The ring closes on a fixed point, so walking out through a gap takes it out of play. On Normal, neighbouring bales start about 97 units apart, centre to centre (about 49 on Nightmare). The gaps shrink as the ring closes, so leaving early is easiest.
- A 400-HP bale is worth only 3 XP, so fighting through the ring usually isn't worth it unless your weapons are already hitting the bales.
- Tibo's [dash](/controls) ignores normal damage, which can carry him through a gap that has become too tight.
