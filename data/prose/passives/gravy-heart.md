## Overview

Gravy Heart raises Tibo's max HP by 12% per level, up to +60% at level 5. Tibo's base max HP is 100, multiplied by the difficulty's max HP factor (see [Modes](/modes)). With no other bonuses, Gravy Heart at level 5 gives 160 instead of 100 at a ×1 factor, or 240 instead of 150 on Normal (×1.5).

It is the catalyst for [Mandoline Fury](/weapons/mandoline-fury), the evolution of [Peeler](/weapons/peeler).

## How it works

Max HP is `(100 + flat max HP) × (1 + percent max HP) × difficulty max HP` (see [Stats](/stats)). Gravy Heart is the only source of percent max HP. Flat bonuses, from [Spud Muffin](/items/spud-muffin) (+10) and [Spud Shrine](/points-of-interest#spud-shrine) blessings, are added first, so Gravy Heart multiplies them too.

When max HP goes up, current HP goes up by the same amount, so taking a level of Gravy Heart also heals.<small>[sim-BGF0Y8Y5.js: `n.hp[e.me]=Math.min(r,(n.hp[e.me]??0)+Math.max(0,t))`]</small>

## Tips

- **It boosts revives, not snack heals.** Gravy Heart scales healing that is a share of max HP, such as a revive's 50% max HP (see [Stats](/stats#healing-and-revives)). Flat healing, such as the 30 HP from a snack, stays the same.
- [Mezzaluna](/weapons/mezzaluna) and [Moon Cleaver](/weapons/moon-cleaver) hit harder the more HP Tibo is missing, as a share of max HP. More max HP neither helps nor hurts that bonus directly.
