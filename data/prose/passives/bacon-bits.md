## Overview

Bacon Bits makes every hit on an elite or a boss stronger. Each level adds 0.12 elite damage, so the damage multiplier against elites and bosses goes from ×1.12 at level 1 to ×1.60 at level 5. Ordinary pests take normal damage.

It is the catalyst for [Inferno Basket](/weapons/inferno-basket), the evolution of [Deep Fryer](/weapons/deep-fryer).

## How it works

When a hit lands on a boss or an enemy flagged as elite, its damage is multiplied by Tibo's elite damage stat and by the weapon's own elite multiplier, before the crit roll.<small>[sim-CM-5WO9_.js: `(i||t.has(n,k.Elite))&&(l*=o.eliteMult*a.eliteMult[r])`]</small> The stat is a plain `1 + total`, with no diminishing returns or cap (see [Stats](/stats)). The only other source is the [Boss Buster](/items/boss-buster) item (+0.15).

Inferno Basket has its own elite multiplier of 2 (“Double damage to elites and bosses.”). The two multiply, so with Bacon Bits at level 5 an Inferno Basket hit on an elite or boss deals 2 × 1.6 = 3.2 times its normal damage.

## Tips

- Boss HP is multiplied ×3 from 16:00, ×4 from 18:00 and ×6 from 20:00 (see [Bosses](/bosses#boss-hp)). Bacon Bits is worth considering if your build struggles with those late bosses.
- Because it multiplies before crits, it stacks with [Hot Sauce](/passives/hot-sauce) and [Sour Cream](/passives/sour-cream) rather than competing with them.
- Every elite drops a chest, and chests are the only way to evolve (see [Chests](/chests)).
