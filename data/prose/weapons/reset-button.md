## Overview

Reset Button is a screen clear on a long timer. When it fires, it kills every pest in the play area around Tibo, elites included, and deletes all enemy bullets. Bosses lose only 5% of their max HP. The price is the loot: pests it kills drop no XP or gold, and most pickups already lying in the play area are erased.

You get it from a level-up card. Every level only lowers the cooldown, from 90 s at level 1 to 59.9 s at level 8. With a max-level Reset Button and [Four-Eyed Spud](/passives/four-eyed-spud), a chest can evolve it into [Factory Reset](/weapons/factory-reset), which keeps the drops and also heals Tibo.

## How it works

- **What counts as on screen.** Pests and bosses are hit if they overlap the 320 × 320 play area centred on Tibo (`view.playWidth` and `playHeight` in the config). Pests further out are not affected.
- **Pests.** Every pest in range is killed outright, whatever its HP. Killed pests drop nothing except the chest an elite carries, so you lose the XP, gold, rerolls and banishes they would have dropped. <small>[sim-D8sW_hhq.js: `t.has(r,A.NoDrops)?Cd(e,r):xd(e,r)`]</small>
- **Bosses.** Each boss in range takes 5% of its max HP (`reset.bossHitFraction`). This hit cannot bring a boss below 1 HP. <small>[sim-D8sW_hhq.js: `e.attack.damage=r.bossHitFraction*(n.bossHitMult??1)`]</small>
- **Pickups.** Each pickup in the play area is erased unless it passes a save roll. The save chance is 15% plus half of Tibo's luck, up to 95%. Some special pickups are exempt. <small>[sim-D8sW_hhq.js: `Math.min(.95,e.cfg.reset.dropSaveChance+.5*e.loadout.stats.luck)`]</small>
- **Bullets.** All enemy bullets are removed.
- **Timing.** It fires as soon as it is off cooldown while any pest or boss is alive. Gaining a level resets its cooldown to zero, so it fires straight away after each level-up. Cooldown reduction cannot take it below 15 s (`reset.minCooldownSec`), and amount bonuses do not affect it.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; 17 pests held at offsets from Tibo between 140 and 180 units along each axis and on the diagonal): every pest whose body reached 160 units or less from Tibo along either axis was killed, including one at (160, 160) on the diagonal, 226 units away, and every pest whose nearest edge was beyond 160 survived. For example a pest of radius 5 at 165 units died and one at 166 survived. The area is the 320 × 320 square, not a circle. All three seeds gave the same figures.

## Tips

- Every level-up of Reset Button is an immediate screen clear, which can get you out of a swarm. The kills give no XP, though, and gems on the ground are likely to be erased, so it slows your levelling.
- Luck raises the chance that pickups survive the reset. Each level of [Four-Eyed Spud](/passives/four-eyed-spud), which is also the evolution catalyst, adds 5 percentage points to the save chance.
