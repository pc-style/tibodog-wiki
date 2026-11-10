## Overview

Root Spikes makes roots burst up under pests near Tibo. Every 2.4 seconds it picks 3 different pests within 80 units of Tibo, or 4 with Tibo's base +1 amount bonus (see [Stats](/stats)). It marks the spot under each one, and 0.3 s later a root erupts there. The root deals 26 damage to everything within 10 units and knocks them back.

You get it from a level-up card. At level 8 it targets 9 pests (8 + 1) for 48 damage every 1.8 s, with a 12-unit blast (area 1.2). With a max-level Root Spikes and [Masher Grip](/passives/masher-grip), a chest can evolve it into [Taproot Eruption](/weapons/taproot-eruption).

## How it works

- **Targeting.** It only fires when at least one pest is within `range` (80 units) of Tibo. Area bonuses do not increase this range. Each spike in a volley picks a different random pest in range. When there are fewer pests in range than spikes, the extra spikes are lost. <small>[sim-BI7WLnza.js: `let o=ou(e,n.range,i);if(o===void 0)return;cu(e,o,i)`]</small>
- **Delay.** The spike lands where the pest was when it was targeted, `delay` (0.3 s) later. A fast pest can walk out of the 10-unit blast before it erupts. Any other pest standing on the spot is hit as well.
- Each blast's radius is `size` × area. Amount bonuses from [GPU](/passives/gpu) and [Sprouting Eyes](/passives/sprouting-eyes) add more spikes per volley.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; 12 pests held on a ring 60 units from Tibo): at level 1 every 2.8 s exactly 4 pests were hit on the same tick; at level 8 exactly 9, every 2.2 s. All three seeds gave the same figures.

## Tips

- **Extra spikes need pests close by.** Extra spikes are only useful when enough pests are close to Tibo. It does nothing against pests that are far away.
- The blasts are small, so slower pests that walk in a straight line are the easiest to hit.
