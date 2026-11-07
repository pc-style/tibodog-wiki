## Overview

Factory Reset is the evolution of [Reset Button](/weapons/reset-button). A chest can evolve it once Reset Button is at max level and Tibo owns [Four-Eyed Spud](/passives/four-eyed-spud) (see [Evolutions](/evolutions)). It still kills every pest in the play area and clears enemy bullets. Unlike Reset Button, it lets pests drop their loot, leaves pickups on the ground and heals Tibo by 30 HP. Bosses take 8% of their max HP instead of 5%.

Its base cooldown is 45 s, compared with 59.9 s for a max-level Reset Button. The 15 s floor for this kind of weapon still applies.

## How it works

- **Kills with drops.** `keepDrops` turns off both drawbacks of Reset Button. Pests it kills drop their XP, gold and other loot normally, and the pickup-erasing step is skipped.
- **Boss hit.** `bossHitMult` 1.6 multiplies the 5% boss hit (`reset.bossHitFraction`) to 8% of each boss's max HP. As with Reset Button, this hit cannot bring a boss below 1 HP.
- **Heal.** Each activation restores 30 HP, capped at Tibo's max HP. <small>[sim-BIASVETB.js: `n.heal!==void 0&&ou(e,n.heal)`]</small>
- Like Reset Button, it only affects things overlapping the 320 × 320 play area centred on Tibo. It fires whenever it is off cooldown and any pest or boss is alive.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; 17 pests held at offsets from Tibo between 140 and 180 units along each axis and on the diagonal): the same pests died as with Reset Button: those overlapping the 320 × 320 square centred on Tibo, including the corner at (160, 160). All three seeds gave the same figures.

## Tips

- **Sweep up the drops with Potato Magnet.** Each activation kills a screen of pests and their drops land on the ground. Moving through the area afterwards with a large pickup range ([Potato Magnet](/passives/potato-magnet)) collects that XP quickly.
