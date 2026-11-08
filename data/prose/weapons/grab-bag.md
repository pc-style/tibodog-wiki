## Overview

Grab Bag borrows other weapons. Each shot picks a random weapon from a fixed list and fires that weapon's attack, such as a gravy pool, a boomerang or a pan swing. The damage, area, speed, duration, pierce and knockback all come from Grab Bag's own stats; the picked weapon supplies only the shape of the attack and its look.<small>[sim-C7oUgQu3.js: `J(e,r.damage,t.src,t.slot,r.knockback),e.attack.look=N(e,s.id,o.paints[n]),a(e,t,s.behavior,r,i)`]</small> You do not need to own the weapon that gets copied.

It is offered as a level-up card. At max level, with [Sprouting Eyes](/passives/sprouting-eyes) owned, a [chest](/chests) evolves it into [Bottomless Sack](/weapons/bottomless-sack). The Sack pulls two attacks per shot and copies the evolved forms.

## How it works

- **The list.** The copy pool is every base weapon whose attack is a fired or placed attack: slash, targeted or facing shots, lobs, boomerangs, pools, strikes, bouncers, explosives, mines, chains, novas, homing shots, beams, rain and spirals.<small>[sim-C7oUgQu3.js: ``function nO(e){let t=e.behavior;return tO.has(t.kind)&&(t.kind!==`targetShot`||t.mimic===void 0)}``]</small> In this build that is 28 weapons. Weapons that work differently are left out: turrets ([Fry Cook Sentry](/weapons/fry-sentry)), orbiters, auras, cones, familiars, guards ([Hash Brown Shield](/weapons/hash-brown-shield)), tethers, rings, nukes, and the newer special weapons. Grab Bag can't copy itself. Each pick is uniformly random.
- **Firing.** Grab Bag only fires when a pest is within targeting range, which is 0.7 × the larger side of the play field. Each volley fires Amount shots 0.25 s apart, and each shot is one random pick. Tibo's built-in +1 amount (see [Stats](/stats#stat-conversion)) gives 2 picks per volley at level 1 and 4 at level 8.
- Because the copy uses Grab Bag's numbers, a copied attack can behave differently from the real weapon. For example, a copied pool's lifetime is based on Grab Bag's 2 s Duration, and a copied pan swing does not get the [Frying Pan](/weapons/frying-pan)'s elite charge.

## Tips

- **Value it for variety, not damage.** Grab Bag's damage per hit is the same whatever it copies, so its value comes from variety: crowd attacks such as pools and novas, and single-target shots, all hit at Grab Bag's damage.
- Amount bonuses add more random picks per volley, so [Sprouting Eyes](/passives/sprouting-eyes) helps it now and is also its evolution catalyst.
