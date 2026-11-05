## Overview

Hashnado is the evolution of [Hash Boomerang](/weapons/hash-boomerang). You get it by opening a [chest](/chests) with a max-level Hash Boomerang and [Sour Cream](/passives/sour-cream) at any level. It throws the same returning hash browns, but more of them, faster and harder: 40 damage each, a 1.2 s cooldown, and its own Amount of 4.

## How it works

- **Volley.** With Tibo's built-in +1 amount (see [Stats](/stats#stat-conversion)), each volley throws 5 hash browns, 0.08 s apart. The first goes at the nearest pest (or the way Tibo faces), and the rest are turned up to about 29° to either side at random, which spreads the volley into a fan.
- **Flight.** Each hash brown starts at speed 220 and is pushed back at 340 units/s², so it turns around after about 0.65 s, roughly 71 units out, and returns along its throw line. It lives 2.8 s × Tibo's duration stat (3.5 s with no bonuses). As with the boomerang, projectile speed bonuses scale the return push too, so they lengthen the reach without changing the timing.
- **Pierce.** Unlimited, with a short re-hit delay per pest, so pests near Tibo are hit on the way out and again on the way back. The Area of 1.6 makes each hash brown wider than the boomerang's.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it threw 5 hash browns about 0.08 s apart every 1.2 s, each spawned with a 3.5 s lifetime. All three seeds gave the same figures.

## Tips

- The fan of 5 short-range throws clears crowds around Tibo well, but it does little to far-off targets.
- Sour Cream is the catalyst. Crit damage pays off with crit chance from [Hot Sauce](/passives/hot-sauce) or the [Hot Pepper](/items/hot-pepper) item.
