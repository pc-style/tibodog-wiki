## Overview

Tot Toss throws tater tots at the nearest pest. Every 1.1 seconds it throws 2 tots for 10 damage each; a tot flies at speed 170 for up to 2.5 seconds and stops at the first enemy it hits. The stat tables show the raw values (amount 1, duration 2 s); every non-aura weapon gets +1 amount and +25% duration from Tibo's base stats (see [Stats](/stats)). Levels add more tots per throw (5 at level 8), shave the cooldown to 1 s, raise damage to 30 and add one pierce, so each tot can pass through a second enemy.

Tot Toss is one of the 17 weapons a standard run can start with, it is offered on level-up (its base offer weight is 80, above [Peeler](/weapons/peeler)'s 70 but below [Fry Knives](/weapons/fry-knives)' 100 and [Potato Rain](/weapons/potato-rain)'s 130), and [poteto's](/visitors#poteto) gift chest can hand it out. In [Story mode](/story-mode) it is in the starting chest at level 3. At level 8 a chest evolves it into [Tot Gatling](/weapons/tot-gatling) if you own [Chives](/passives/chives). See [Evolutions](/evolutions).

## How it works

- **Targeting.** Each tot is aimed at the nearest enemy at the moment it is thrown. The weapon only fires when some enemy is within 70% of the larger screen dimension, so in practice it never wastes a throw on an empty screen. <small>[sim-BZUQNEDf.js: `function Ek(e){return .7*Math.max(e.field.width,e.field.height)}`]</small>
- **Volleys.** Tots in one throw leave 0.1 s apart. The first flies straight at the target; each later tot gets a random spread that grows with its position in the volley (±0.08 radians for the second, up to ±0.32 for the fifth). <small>[sim-BZUQNEDf.js: `Ok(e,Ek(e))+e.rng.range(-.08,.08)*i`]</small>
- **Pierce.** A tot is removed after hitting one more enemy than its pierce value, and it cannot hit the same enemy twice.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 it threw 2 tots 0.1 s apart every 1.1 s, each spawned with a 2.5 s lifetime, and only the nearest pest was ever hit (pierce 0, one pest per tot). At level 8 it threw 5 tots every 1 s and they hit the two nearest pests and no others (pierce 1). All three seeds gave the same figures.

## Tips

- **Keep taking amount for crowds.** With several tots per throw, the spread helps hit pests that are lined up behind or beside the nearest one, so extra amount still pays off in a crowd.
- [Chives](/passives/chives) shortens Tot Toss's cooldown now and is the catalyst for Tot Gatling later, so it is a natural pick alongside this weapon.
