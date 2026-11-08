## Overview

Sir Strawman is the fifth boss in the boss order and the 7:00 boss on the [wave schedule](/bosses#wave-schedule), arriving together with that minute's elite. It is not part of the overtime cycle after 20:00, but a [Boss Lair](/points-of-interest#boss-lair) can wake it.

It has 2600 base HP, which is 1690 HP on Normal (boss HP ×0.65, see [Modes](/modes)), plus [curse](/curse). Contact damage is 18 before time scaling. At speed 36 it ties with [The Harvester](/bosses/harvester) as the second-fastest boss after [The Great Wireworm](/bosses/great-wireworm) (40), though still well short of Tibo's base speed of 62.

It drops a [chest](/chests), an XP gem worth 90 XP and a 25-gold coin (both multiplied by the biome's XP and gold multipliers).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 7:00 on all four difficulties, with 1300 HP on Easy, 1690 on Normal, 1820 on Hard and 2717 on Nightmare. The Nightmare figure is 10% above base HP × the difficulty multiplier because Nightmare starts every run with one curse, and boss HP is multiplied by 1 + curse. <small>[intro-shared-BOMSP_en.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-DO61yIsl.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> Seeds `s1` to `s4` gave the same Normal times and HP.

## Fight

Sir Strawman is a smaller version of the Harvester's fight: a short charge and a single fan of straw that comes back. Every 2.6 s of walking it charges. A full walk, warning and charge cycle takes 4.1 s.

### Lance charge

When the attack is ready, Sir Strawman stops and locks onto the direction Tibo is in at that moment. <small>[sim-DO61yIsl.js: `s.state[t]=1,s.timer[t]=n.telegraph,s.timer2[t]=n.telegraph,s.tx[t]=r/l,s.ty[t]=i/l`]</small> A 22-unit-wide lane shows its path for 0.8 s, then it rushes along it at speed 280 for 0.7 s, covering about 196 units. The hit comes from touching it during the rush, and contact damage is ×1.5 while charging (27 before time scaling). Its hitbox stays at its normal radius of 15, because the lane is narrower than its body.

### Straw fan

Every 2.6 s of walking, after a 0.8 s warning, it throws a fan of 7 straw shots spread over 1.1 radians (about 63°), aimed at where Tibo was when the warning began. Each shot deals 14 damage before scaling. The shots fly out at speed 120, stop about 113 units out, and then fly back along the same lines, through the point they were thrown from and out the other side. The exact speeds and the per-difficulty return speed are on this page under [Returning sickles](/bosses/sir-strawman#returning-sickles).

Bullet count, fire rate and speed grow with run time (see [Enemy bullets](/enemy-scaling#enemy-bullets)). At its 7:00 arrival the fan has 9 shots at about speed 133, and comes every 2.15 s of walking.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 7:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): 9-shot fans 2.05 s, 5.70 s, 9.35 s and 13.00 s after it spawned.

On [Nightmare](/modes#nightmare-rules) the fan is slightly faster (130 base) and turns back a little later. The charge is the same on every level.

## Tips

- **Step sideways off the lane.** The direction is locked when the lane appears, so about 20 units to the side (its body radius plus Tibo's size) is enough. At base speed that takes about a third of a second, well inside the 0.8 s warning.
- **Get out of the fan's wedge, not just its range.** The returning shots come back through the point they were thrown from and keep going, so the area behind Sir Strawman is not safe either. The safest place is to the side of the 63° wedge, in either direction.
- **Keep track of the shots on their way back.** On Normal and harder they come back faster than they went out (on Easy, slower). Walking into the wedge right after the shots stop can be how a hit happens.
- **A dash through the fan works if timed.** The dash makes Tibo immune to hits for 0.15 s (more with [Ghost Pepper](/items/ghost-pepper)), but with only one charge and a 5 s recharge it is usually better kept for the charge. See [dash details](/controls#dash-details).
- **Boss damage bonuses** such as [Bacon Bits](/passives/bacon-bits) and [Boss Buster](/items/boss-buster) shorten the fight. The 7:00 elite arrives at the same time, so area weapons that hit both are useful.
