## Overview

Strike is the landmark event of [Gutterball Lanes](/biomes/gutterball-lanes). It fires the first time Tibo walks into a bowling alley (radius 400), once per alley, and never in [Story mode](/story-mode). After the announcement, a ring of [Bowling Balls](/enemies/bowling-ball) appears 200 units around Tibo.

It uses the same ring spawn as [Ring of Hay Bales](/events/bale-ring), but these balls keep their own charging behaviour. Instead of rolling to a fixed point, they track Tibo and dash at him. Each ball has 28 base HP, deals 8 contact damage and gives 2 XP, with a 6% gold chance. Balls that are still alive after 16 seconds disappear without drops.

## How it works

- **Count.** 10 balls × the difficulty's wall-pest multiplier: 2 on Easy, 3 on Normal and Hard, 6 on Nightmare (see [Modes](/modes)). The ring is much thinner than the event's raw count suggests.
- **Approach.** The event sets each ball to its base speed of 26. A ball rolls towards Tibo at that speed until it is within 120 units and its cooldown is over.
- **Charge.** The ball stops for a 0.5-second windup (0.6 seconds from 20:00 in Standard) and locks its direction towards Tibo's position at the start of the windup. It then dashes at 210 for about 0.74 seconds (roughly 156 units, past where Tibo stood) and rolls normally for 1.6 seconds before it can wind up again. <small>[sim-C5PTMz0J.js: `i.state[t]=1,i.timer[t]=.5,e.bigUpdate.lateGame&&(i.timer[t]=Gr(e,.5)),i.tx[t]=r/s,i.ty[t]=a/s`]</small> <small>[sim-C5PTMz0J.js: `i.state[t]=2,i.timer[t]=1.3*n/r,i.windup[t]=0`]</small>
- **Despawn.** Balls are removed after 16 seconds, or once they are about 460 units from Tibo.
- **Trigger.** If the enemy pool is full (550 on Easy/Normal, 700 on Hard, 850 on Nightmare), the alley stays unused and the event tries again while Tibo is inside.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, `--god`, Tibo teleported into the first Gutterball Lanes alley found at 1:00 with pests removed first): the ring had 2 bowling balls on Easy, 3 on Normal and Hard, and 6 on Nightmare, each set to vanish 16 s later. Seeds `wiki` and `s1` to `s4` gave 3 on Normal and 6 on Nightmare every time. With `--mode story`, entering the alley fired no event.

## Tips

- **Sidestep during the windup.** Because the dash direction is fixed when the windup starts, a step sideways during the 0.5-second pause makes the ball miss. A [dash](/controls) also works, since Tibo ignores normal damage while dashing.
- With 28 base HP and only 2 to 6 balls, it is probably quicker to kill them than to dodge for the full 16 seconds.
- The lanes have patches of slowing ground (see [Gutterball Lanes](/biomes/gutterball-lanes)). Sidestepping a charge from inside one is harder, so it may be worth fighting on clear floor.
- Gutterball Lanes also spawns bowling balls as ordinary pests, so more of them may roll in after the event ends.
