## Overview

The Great Wireworm is the seventh boss. It arrives at 10:00 on the [wave schedule](/bosses#wave-schedule), alongside a [Golden Scarab](/events/golden-scarab). It has 4200 base HP: about 2730 on Normal (boss HP ×0.65, see [Modes](/modes)) and 3990 on Nightmare before [curse](/curse). Nightmare starts every run with one curse, which adds 10% to boss HP, so there it actually has about 4389. <small>[sim-JoUvrIFk.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-JoUvrIFk.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> At speed 40 it is the fastest boss in the game, but still slower than Tibo's base 62. Its contact damage is 26.

It is not in the post-20:00 rotation; a [Boss Lair](/points-of-interest#boss-lair) can wake it. It drops an XP gem worth 120, a 25-gold coin and a chest ([Chests](/chests)).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 10:00 on all four difficulties, with 2100 HP on Easy, 2730 on Normal, 2940 on Hard and 4389 on Nightmare. Seeds `s1` to `s4` gave the same Normal times and HP.

## Fight

The Wireworm crawls towards Tibo and fires a beetle-shaped fan between dives. Every 4 s it burrows and bursts up under where Tibo was. Its fan timer is paused for the whole dive. <small>[sim-JoUvrIFk.js: `d===0?($d(e,o,s,c,l,u),Qd(e,o,s,t)):d===1?ef(e,o,s,t):tf(e,o,s,t)`]</small> Its first dive comes about 2.4 s after it appears.

### Burrow

When the dive starts, the game marks a circle of radius 40 on Tibo's position, and the Wireworm goes underground at once. It travels under the ground to the mark and erupts 2.2 s later (1 s warning plus 1.2 s underground), dealing its contact damage to Tibo if he is inside the circle. <small>[sim-JoUvrIFk.js: `let o=n.telegraph+a.under`]</small>

While it is underground, the Wireworm is out of reach: it is left out of the lookup weapons use to find targets, it deals no contact damage, and any bullet pattern it was still winding up is cancelled. <small>[sim-JoUvrIFk.js: `r.pool.isAlive(n)&&!r.has(n,k.Hidden)&&Aa(t,So+n,r.x[n],r.y[n])`]</small> A full cycle is 6.2 s, so it spends about a third of the fight underground.

### Click-beetle fan

Every 3 s at base, the Wireworm aims at Tibo. After 0.7 s it fires five shots spread over 1.3 radians (about 74°) at speed 90, 12 damage each. The shots fly out, nearly stop, re-aim once at Tibo's position at that moment, and then shoot off faster than they started. The exact timings, and the earlier Nightmare timings, are under [Click-beetle shots](/bosses/great-wireworm#click-beetle-shots).

Enemy bullets scale with time ([Enemy scaling](/enemy-scaling#enemy-bullets)). At 10:00 the fan has 7 shots instead of 5, launches at about 104 and repeats about every 2.3 s.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 10:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): 7-shot fans 2.15 s, 6.67 s and 13.50 s after it spawned (the gap is a dive).

## Tips

- The burrow circle stays where Tibo was when the dive began. Any movement takes him out of it long before the 2.2 s are up, so keep walking and do not stop on the mark.
- It surfaces on the mark itself, so getting well clear of the mark keeps its body, and its next fan, at a distance.
- The beetle shots re-aim only once, when they stop. Moving across their new line just after they lunge forward makes them miss, while standing still lets all of them converge on Tibo.
- Weapons cannot hit it underground, so the 4 s it spends on the surface between dives are the time to deal damage.
- It is the fastest boss, but Tibo still outruns it. Kiting in wide circles keeps it from reaching contact range between dives.
