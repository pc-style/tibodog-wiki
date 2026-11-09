## Overview

The Mandoline is the eighth boss in the boss order and the 12:00 boss on the [wave schedule](/bosses#wave-schedule), between [The Great Wireworm](/bosses/great-wireworm) at 10:00 and [The Deep Freezer](/bosses/deep-freezer) at 14:00. It is the second boss in the overtime cycle after 20:00, first at 22:00 and then every seven minutes (see [After 20:00](/bosses#after-20-00)). A [Boss Lair](/points-of-interest#boss-lair) can also wake it.

It has 5200 base HP, which is 3380 HP on Normal (boss HP ×0.65, see [Modes](/modes)), plus [curse](/curse). Contact damage is 34 before time scaling, a big jump from the 26 of the boss before it. It walks at speed 32, about half of Tibo's base speed of 62.

It drops a [chest](/chests), an XP gem worth 140 XP and a 25-gold coin (both multiplied by the biome's XP and gold multipliers).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 12:00 on all four difficulties, with 2600 HP on Easy, 3380 on Normal, 3640 on Hard and 5434 on Nightmare. The Nightmare figure is 10% above base HP × the difficulty multiplier because Nightmare starts every run with one curse, and boss HP is multiplied by 1 + curse. <small>[intro-shared-Fi8cwUjF.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-BwchEhls.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> Seeds `s1` to `s4` gave the same Normal times and HP.

## Fight

The Mandoline walks towards Tibo, fires a fast-spinning spiral, and every 3.4 s of walking stops to slice the ground in three lanes. A full cycle takes 4.5 s, and its first slice comes about 2 s after it spawns. These are base timings: [conditional N2+ boss pacing](/modes#boss-attack-pacing) can shorten the ground and pattern intervals independently. It has no separate Nightmare attack or pattern definitions.

### Three-lane slice

When the attack starts, the Mandoline locks the direction from itself to Tibo and marks three parallel lines across that direction, each 360 units long and 22 units wide. The middle line runs through Tibo's position; the other two run 57.2 units nearer to the boss and 57.2 units further away. <small>[sim-BwchEhls.js: `let f=(d-(i.lanes-1)/2)*i.width*2.6`]</small> The lines strike one after another, starting with the one nearest the boss: at 1.1 s, 1.25 s and 1.4 s. Each deals the Mandoline's contact damage. <small>[sim-BwchEhls.js: `i.width/2,n.telegraph+.15*d,a.damage[t]`]</small>

### Slicer spiral

Every 3.4 s of walking, after a 0.8 s warning, it fires a three-armed spiral: 14 bursts 0.1 s apart, turning at 2.2 radians per second in the opposite direction to [Late Blight](/bosses/late-blight)'s spiral. The bullets are small (radius 2) and deal 10 damage each before scaling. They leave at speed 55 and speed up steadily to 1.8× (99) by 0.9 s.

Bullet count, fire rate and speed grow with run time (see [Enemy bullets](/enemy-scaling#enemy-bullets)). At its 12:00 arrival the spiral has four arms, bursts about 0.07 s apart and a top speed of about 117, and comes every 2.5 s of walking. Because the bursts come faster, the arms turn less in total (about 120° instead of 164°) and sit closer together.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 12:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): spirals of 14 four-bullet bursts about 0.07 s apart, starting 2.45 s, 6.05 s, 9.65 s and 13.25 s after it spawned.

## Tips

- **Stand between two lines.** Counting Tibo's size, a line hits anything within 17 units of it, so there is a safe strip about 23 units wide between neighbouring lines. From Tibo's spot, the nearest safe place is 17–40 units towards or away from the boss.
- **Or step off the end.** The lines are 360 units long and centred on Tibo's position, so going sideways is slow (about 3 s at base speed). Moving along the boss-to-Tibo direction is much quicker.
- **Pick a strip, then stop.** The three lines are fixed once marked and strike only 0.15 s apart, so it is safer to reach one of the two safe strips and wait there than to keep moving through the lanes.
- **Dodge the spiral early.** The bullets are slowest just after leaving the boss and nearly twice as fast after 0.9 s, so the gaps are easiest to read close in or at the start.
- **Armor helps less from here.** Bosses count as 10 levels higher than the run time against [armor](/stats#armor). Damage bonuses against bosses such as [Bacon Bits](/passives/bacon-bits) and [Boss Buster](/items/boss-buster) cut the number of slice cycles Tibo has to dodge.
