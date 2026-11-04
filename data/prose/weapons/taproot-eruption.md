## Overview

Taproot Eruption is the evolution of [Root Spikes](/weapons/root-spikes). A chest can evolve it once Root Spikes is at max level and Tibo owns [Masher Grip](/passives/masher-grip) (see [Evolutions](/evolutions)). Every 1.5 seconds it picks 8 different pests within 150 units of Tibo, or 9 with Tibo's base +1 amount bonus. After 0.25 s a giant root erupts under each one, dealing 90 damage within 16 units (10 × 1.6 area) and throwing pests back with knockback 3 instead of Root Spikes' 1.

Compared with a max-level Root Spikes, it reaches almost twice as far (150 units instead of 80), roughly doubles the damage and fires about every 1.5 s instead of 2.2 s.

## How it works

- Targeting works the same way as Root Spikes. Each root picks a different random pest in range, and it only fires when a pest is within 150 units. If fewer pests are in range than roots, the extra roots are lost. Each root lands where its target was when it was picked.
- **Knockback.** Pests are pushed away from the centre of the eruption. The push strength is knockback × Tibo's knockback multiplier × (1 − the pest's mass) × 70, so heavy pests move less and bosses are never pushed. Masher Grip adds 25% knockback per level, so the catalyst keeps strengthening this weapon after the evolution. <small>[sim-CrpXuTSY.js: `d=o*e.loadout.stats.knockbackMult*(1-s)*70`]</small>

## Tips

- The knockback scatters pests away from where the roots land. That buys time when you are surrounded, but it can also push pests out of reach of short-range weapons such as [Root Cellar](/weapons/root-cellar).
