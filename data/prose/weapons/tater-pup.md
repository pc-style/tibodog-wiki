## Overview

Tater Tot Pup gives Tibo tot companions that circle him and shoot at nearby pests. Each pup fires a tot at the nearest enemy within 150 units of itself every second, for 9 damage. You start with 2 pups: the raw amount of 1 plus the +1 base amount bonus every non-aura weapon gets (see [Stats](/stats)). Levels add a third and fourth pup, cut the shot cooldown to 0.8 s, raise damage to 28 and let each shot pierce one extra enemy.

It is one of the 17 weapons a standard run can start with, and it is offered on level-up. At level 8 with [Gravy Heart](/passives/gravy-heart), a chest evolves it into [Gravy Pack](/weapons/gravy-pack). Gravy Pack can then unite with [Fry Fortress](/weapons/fry-fortress) into [Fry Brigade](/weapons/fry-brigade), freeing a weapon slot. See [Evolutions](/evolutions).

## How it works

- **One pup per amount.** The weapon keeps exactly as many pups alive as its amount, spawning new ones at Tibo's position or removing extras whenever the amount changes. Extra amount from passives such as [Sprouting Eyes](/passives/sprouting-eyes) therefore adds pups. <small>[sim-aoTT3npm.js: `i.pool.isAlive(n)&&i.slot[n]===t.slot&&i.kind[n]===Re.familiar&&(a>=r.amount?i.pool.kill(n)`]</small>
- **Movement.** Pups circle Tibo on a small oval, 18 units out to the sides and 14 above and below, spaced evenly and slowly rotating. They follow him closely, so in practice they shoot from where Tibo stands.
- **Shooting.** Each pup has its own timer. When it is ready, it targets the nearest enemy within 150 units of the pup; with no target in range it checks again every 0.1 s. Newly spawned pups start 0.15 s apart so their shots are staggered. <small>[sim-aoTT3npm.js: `let l=n.x[i],u=n.y[i],d=Cl(e,l,u,o.range);if(d===void 0){n.t[i]=TT;continue}`]</small>
- **Shots.** Tots travel at speed 200 for 1.875 s (1.5 s raw, plus Tibo's base +25% duration) and stop at the first enemy unless the weapon has pierce. Projectile speed, duration, area and pierce bonuses apply to them as usual.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; one pest held 60 units to Tibo's right): 2 pups existed at level 1 and 4 at level 8. All three seeds gave the same figures.

## Tips

- **Use it for steady single-target damage.** Pups never need aiming and never run out, which makes Tater Tot Pup a steady single-target weapon. Its short 150-unit range means it does little against enemies that keep their distance.
- Amount is especially valuable here: every extra projectile is a whole extra pup with its own fire timer.
