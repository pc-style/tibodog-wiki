## Overview

The Masher is the third boss in the boss order and the 4:00 boss on the [wave schedule](/bosses#wave-schedule), after [amusing](/bosses/amusing) at 2:00 and the [Colorado Queen](/bosses/beetle-queen) at 3:00. It comes back in the overtime cycle after 20:00, first at 23:00 and then every seven minutes (see [After 20:00](/bosses#after-20-00)). A [Boss Lair](/points-of-interest#boss-lair) can also wake it.

With 1300 base HP it is the weakest of the scheduled bosses after the first two: 845 HP on Normal (boss HP ×0.65, see [Modes](/modes)), plus [curse](/curse). Contact damage is 15 before time scaling, and it walks at speed 34, about half of Tibo's base speed of 62.

It drops a [chest](/chests), an XP gem worth 60 XP and a 25-gold coin (both multiplied by the biome's XP and gold multipliers).

## Fight

The Masher walks towards Tibo, fires a single bullet ring, and every 3.2 s of walking stops to slam. A full walk-and-slam cycle takes 4.4 s. Its first slam comes about 1.9 s after it spawns.

### Mash slam

The Masher marks a circle of radius 38 centred exactly where Tibo is standing when the attack starts. 1.2 s later the circle strikes once for the Masher's contact damage. The circle does not follow Tibo, and the boss stands still while it is marked. <small>[sim-CrpXuTSY.js: `let a=e.player.x[e.me],o=e.player.y[e.me];for(let c=0;c<i.count;c++){let l=c===0?0:(i.spread??60)*e.rng.next()`]</small> If the Masher dies before the strike, the marked circle is removed. <small>[sim-CrpXuTSY.js: `function Vp(e,t){let n=e.zones.ownerBoss[t];return n>=0&&!e.bosses.pool.has(n)}`]</small>

### Potato ring

Every 3 s of walking it fires one ring of 10 bullets after a 0.7 s warning, at speed 70 with 9 damage each before scaling. Bullet count, fire rate and speed grow with run time (see [Enemy bullets](/enemy-scaling#enemy-bullets)), so at its 4:00 arrival this is a ring of 12 bullets at about speed 74, every 2.7 s of walking.

### On Nightmare

[Nightmare](/modes#nightmare-rules) swaps the slam for three bands that strike one after another around Tibo's position. With Nightmare's ×1.45 area scale, they are:

| Band | Area around the centre | Strikes after |
|---|---|---|
| Disk | 0–27.6 units | 1.2 s |
| Inner ring | 50.8–66.7 units | 1.55 s |
| Outer ring | 89.9–104.4 units | 1.9 s |

<small>[sim-CrpXuTSY.js: `let a=t[i],o=Ju(e,Z.cx,Z.cy,a.outer*r,Z.delay+i*n)`]</small>

The ring bullets also weave from side to side by up to 9 units at 1.1 waves per second, with neighbouring bullets weaving in opposite directions, so the gaps open and close as the ring expands.

## Tips

- **Walk out of the circle.** Tibo needs to get about 44 units from the centre of the slam (38 plus his own size). At base speed that takes about 0.7 s of the 1.2 s warning, so a dash is rarely needed.
- **The ring is easy to pass at range.** Twelve bullets leave Tibo-sized gaps once the ring is about 25 units from the Masher. Keep some distance, then step through a gap.
- **On Nightmare, either keep running or stop in a gap.** Counting Tibo's size, the safe gaps are about 34–45 and 73–84 units from where he stood, and he is safe from all three bands beyond about 110. Walking straight out at base speed from the moment the disk appears stays ahead of every band, because each one strikes 0.35 s after the last.
- **For a quick kill**, damage bonuses against bosses such as [Bacon Bits](/passives/bacon-bits) and [Boss Buster](/items/boss-buster) apply to every hit. At 4:00 most builds are still small, though, and the Masher's HP is low enough that ordinary damage usually does the job.
