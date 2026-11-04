## Overview

Tot Toss throws tater tots at the nearest pest. Every 1.1 seconds it throws 2 tots for 10 damage each; a tot flies at speed 170 for up to 2.5 seconds and stops at the first enemy it hits. The stat tables show the raw values (amount 1, duration 2 s); every non-aura weapon gets +1 amount and +25% duration from Tibo's base stats (see [Stats](/stats)). Levels add more tots per throw (5 at level 8), shave the cooldown to 1 s, raise damage to 30 and add one pierce, so each tot can pass through a second enemy.

Tot Toss is one of the 17 weapons a standard run can start with, it is offered on level-up (its offer weight of 100 is the highest of any weapon, shared with [Peeler](/weapons/peeler) and [Fry Knives](/weapons/fry-knives)), and [poteto's](/visitors#poteto) gift chest can hand it out. In [Story mode](/story-mode) it is in the starting chest at level 3. At level 8 a chest evolves it into [Tot Gatling](/weapons/tot-gatling) if you own [Chives](/passives/chives). See [Evolutions](/evolutions).

## How it works

- **Targeting.** Each tot is aimed at the nearest enemy at the moment it is thrown. The weapon only fires when some enemy is within 70% of the larger screen dimension, so in practice it never wastes a throw on an empty screen. <small>[sim-CrpXuTSY.js: `function pp(e){return .7*Math.max(e.field.width,e.field.height)}`]</small>
- **Volleys.** Tots in one throw leave 0.1 s apart. The first flies straight at the target; each later tot gets a random spread that grows with its position in the volley (±0.08 radians for the second, up to ±0.32 for the fifth). <small>[sim-CrpXuTSY.js: `hp(e,pp(e))+e.rng.range(-.08,.08)*c`]</small>
- **Pierce.** A tot is removed after hitting one more enemy than its pierce value, and it cannot hit the same enemy twice.

## Tips

- With several tots per throw, the spread helps hit pests that are lined up behind or beside the nearest one, so extra amount still pays off in a crowd.
- [Chives](/passives/chives) shortens Tot Toss's cooldown now and is the catalyst for Tot Gatling later, so it is a natural pick alongside this weapon.
