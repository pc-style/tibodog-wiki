## Overview

The Great Wireworm is the seventh boss. It arrives at 10:00 on the [wave schedule](/bosses#wave-schedule), alongside a [Golden Scarab](/events/golden-scarab). It has 4200 base HP: about 2730 on Normal (boss HP ×0.65, see [Modes](/modes)) and 3990 on Nightmare, before any [curse](/curse). At speed 40 it is the fastest boss in the game, but still slower than Tibo's base 62. Its contact damage is 26.

It is not in the post-20:00 rotation; a [Boss Lair](/points-of-interest#boss-lair) can wake it. It drops an XP gem worth 120, a 25-gold coin and a chest ([Chests](/chests)).

## Fight

The Wireworm crawls towards Tibo and fires a beetle-shaped fan between dives. Every 4 s it burrows and bursts up under where Tibo was. Its fan timer is paused for the whole dive. <small>[sim-HQr6OS1G.js: `d===0?(Uu(e,o,s,c,l,u),Hu(e,o,s,t)):d===1?Wu(e,o,s,t):Gu(e,o,s,t)`]</small> Its first dive comes about 2.4 s after it appears.

### Burrow

When the dive starts, the game marks a circle of radius 40 on Tibo's position, and the Wireworm goes underground at once. It travels under the ground to the mark and erupts 2.2 s later (1 s warning plus 1.2 s underground), dealing its contact damage to Tibo if he is inside the circle. <small>[sim-HQr6OS1G.js: `let i=n.telegraph+s.under`]</small>

While it is underground, the Wireworm is out of reach: it is left out of the lookup weapons use to find targets, it deals no contact damage, and any bullet pattern it was still winding up is cancelled. <small>[sim-HQr6OS1G.js: `r.pool.isAlive(n)&&!r.has(n,D.Hidden)&&Fi(t,zi+n,r.x[n],r.y[n])`]</small> A full cycle is 6.2 s, so it spends about a third of the fight underground.

### Click-beetle fan

Every 3 s at base, the Wireworm aims at Tibo. After 0.7 s it fires five shots spread over 1.3 radians (about 74°) at speed 90, 12 damage each. The shots fly out, nearly stop, re-aim once at Tibo's position at that moment, and then shoot off faster than they started. The exact timings, and the earlier Nightmare timings, are under [Click-beetle shots](/bosses/great-wireworm#click-beetle-shots).

Enemy bullets scale with time ([Enemy scaling](/enemy-scaling#enemy-bullets)). At 10:00 the fan has 7 shots instead of 5, launches at about 104 and repeats about every 2.3 s.

## Tips

- The burrow circle stays where Tibo was when the dive began. Any movement takes him out of it long before the 2.2 s are up, so keep walking and do not stop on the mark.
- It surfaces on the mark itself, so getting well clear of the mark keeps its body, and its next fan, at a distance.
- The beetle shots re-aim only once, when they stop. Moving across their new line just after they lunge forward makes them miss, while standing still lets all of them converge on Tibo.
- Weapons cannot hit it underground, so the 4 s it spends on the surface between dives are the time to deal damage.
- It is the fastest boss, but Tibo still outruns it. Kiting in wide circles keeps it from reaching contact range between dives.
