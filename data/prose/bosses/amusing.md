## Overview

amusing is the first boss of a run. It arrives at 2:00 on the [wave schedule](/bosses#wave-schedule), a minute after the first elite. It is the weakest boss: 650 base HP, which is about 423 on Normal after the [difficulty's](/modes) ×0.65 boss HP multiplier, and 618 on Nightmare (×0.95) before curse. Nightmare starts every run with one curse, which adds 10% to boss HP, so on Nightmare amusing actually has about 679. A higher curse stat raises this further ([Curse](/curse)). It walks at speed 32, about half of Tibo's base move speed of 62, so Tibo can always walk away from it.

It is not in the post-20:00 boss rotation ([After 20:00](/bosses#after-20-00)), and a [Boss Lair](/points-of-interest#boss-lair) never wakes it, because lairs pick from the second boss in the order onwards. In a normal run you meet it once, unless cursed extra bosses add copies.

On death it drops an XP gem worth 40 (times the biome's XP multiplier), a 25-gold coin and a chest ([Chests](/chests)). Killing it also reveals [Alex](/visitors#alex), who joins in 25% of normal runs and always in Story. <small>[sim-C5oejjzh.js: `` n.def[t]===xb&&Zt(e.alex)===`pending` ``]</small> amusing is also the scripted boss of [Story mode](/story-mode), where it has extra HP, damage and speed.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 2:00 on all four difficulties, with 325 HP on Easy, 422.5 on Normal, 455 on Hard and 679.25 on Nightmare. The Nightmare figure is 10% above base HP × the difficulty multiplier because Nightmare starts every run with one curse, and boss HP is multiplied by 1 + curse. <small>[intro-shared-BloBLHKd.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-C5oejjzh.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> Seeds `s1` to `s4` gave the same Normal times and HP.

## Fight

amusing walks straight at Tibo. Every 3.6 s it stops for its hug, and between hugs it cycles through three bullet patterns in a fixed order: fan, ring, spiral, then the fan again. A new pattern starts every 2.2 s at base. The bullet-pattern clock only runs while the boss is walking, so it pauses during the hug. <small>[sim-C5oejjzh.js: `d===0?(LE(e,o,s,c,l,u),IE(e,o,s,t)):d===1?RE(e,o,s,t):zE(e,o,s,t)`]</small> The first hug comes about 2.2 s after it spawns, and the first pattern about 1.1 s after.

When amusing walks away from the camera, it shows its back-facing walk animation. This changes its appearance, not its attacks or movement speed. The renderer selects that walk when upward movement is greater than sideways movement; an exact diagonal keeps the ordinary walk. Bosses without back-facing art fall back to their ordinary walk or idle frames. <small>[scene-Cx5dOAqd.js: `return t<-Math.abs(e)`]</small> <small>[clip-chains-DBwJlYBi.js: `` walkBack:()=>[`walk-back`,`walk`,`idle`] ``]</small>

Enemy bullets scale with run time ([Enemy scaling](/enemy-scaling#enemy-bullets)): count +4% per minute, fire rate +3% and speed +1.5%. At 2:00 that only changes the ring, which grows from 12 to 13 shots, and shortens the pattern interval to about 2.1 s. <small>[sim-C5oejjzh.js: `a.count[o]=Math.max(1,Math.round(t.count*d.bulletCount))`]</small>

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 2:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): 5-shot fans 1.85 s and 2.22 s after it spawned, two 13-shot rings at 5.68 s and 6.23 s, then 12 two-shot spiral bursts from 7.67 s to 8.90 s (about 0.11 s apart), and the next fan at 11.40 s. Easy and Nightmare gave the same counts and timings, and so did seed `s2`.

### Hug

When the hug starts, the game marks a circle of radius 40 where Tibo is standing. amusing stands still for 1.1 s, then leaps onto the marked spot over 0.55 s. The circle deals the boss's contact damage (24 base, scaled with run time) when amusing lands, 1.65 s after it was marked. <small>[sim-C5oejjzh.js: `vl(e,r,s,o.radius,n.telegraph+o.leapTime,i.damage[t])`]</small> The circle does not follow Tibo.

### Fan

Five shots spread over 1 radian (about 57°), aimed at Tibo, fired twice 0.4 s apart at speed 70, 6 damage each. The aim is fixed when the pattern starts, and the first shots leave 0.8 s later. <small>[sim-C5oejjzh.js: `return w(e.player.y[e.me]-n,e.player.x[e.me]-t)}(e,l,u)`]</small>

### Ring

Twelve shots (13 at 2:00) in a full circle at speed 55, 6 damage each, after a 0.9 s warning. A second ring follows 0.6 s later, rotated by half a gap so its shots fly between the first ring's. <small>[sim-C5oejjzh.js: `sy.angle=s+r%2*Math.PI/o+k*n/o`]</small>

### Spiral

Two opposite streams of shots at speed 65, 4 damage each. After 0.8 s of warning, the boss fires 12 pairs 0.12 s apart, and each pair is rotated about 0.3 radians (17°) from the last. That makes 24 shots sweeping a bit more than half a turn on each side.

### Nightmare changes

On Nightmare the fan is unchanged. The ring shots slow to 30% speed by 0.35 s, hang there until 0.8 s, then speed up to 150% by 1.1 s. The spiral launches slower, at 45, and speeds up to ×1.7 by 0.8 s. The exact curves are in the Nightmare table on this page.

## Tips

- **Walk out of the hug circle.** To avoid the hug, keep moving: walking 46 units (the circle's radius plus Tibo's body) takes Tibo about 0.75 s, well inside the 1.65 s before it lands. Dashing is not needed.
- Patterns are aimed where Tibo stood when they started, so walking steadily sideways makes the fan miss. Avoid turning back into the fan's second burst.
- For the double ring, step through a gap in the first ring early. Standing still between the rings tends to put Tibo in the path of the second, offset ring.
- The spiral's shots are weak (4 damage), but there are 24 of them. The shots in each stream spread apart as they travel, so the gaps are widest far from amusing; backing off before the spiral starts makes it easier to slip through.
- On Nightmare the ring stalls near the boss before it speeds up. Leave the stall zone before the shots accelerate instead of trying to weave through them.
- With about 423 HP on Normal, amusing rarely needs a special build. Spending the fight dodging rather than chasing it is usually fine, because it keeps walking towards Tibo.
