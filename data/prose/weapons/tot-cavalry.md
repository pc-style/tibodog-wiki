## Overview

Tot Cavalry is the evolution of [Tot Stampede](/weapons/tot-stampede), made by opening a [chest](/chests) with Tot Stampede at level 8 and [Butter Socks](/passives/butter-socks) owned. It keeps the walking trigger: every 40 units Tibo moves, a batch of homing tots charges out behind him. Each tot hits for 81.6 base damage instead of level-8 Stampede's 43.2 and has Pierce 1, so it rams through one pest and bursts on the second.

A batch is 5 tots (raw Amount 4 plus Tibo's base +1 projectile), released 0.08 s apart. They fly at 140 units per second for 5 s (Duration 4 plus Tibo's base +25%, see [Stats](/stats)). A still Tibo makes no tots.

## How it works

All the rules of [Tot Stampede](/weapons/tot-stampede#how-it-works) apply unchanged, including the limit of 12 tots on the field at once. <small>[sim-BHWBCY8v.js: `var Bw={every:40,live:12}`]</small> At base move speed a full batch of 5 comes every 0.65 s or so, which fills the limit within two seconds if the tots do not find targets; after that a new batch only gets as many tots as there is room for.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo walking right for 8 s past 12 pests held at fixed points on his path): batches of 5 tots about 0.07 s apart appeared about every 0.65 s, each with a 5 s lifetime. All three seeds gave the same figures.

**Damage comparison:** original-engine `main-IizW8WLk.js` → `main-XeaRNUVr.js`, Standard/Normal, seeds `s1/s2/s3`, granted Cavalry alone, refilled HP, 8 s warmup, then 20 s walking right and dashing every 4 s with six high-HP pests held 45–90 units behind Tibo. Damage rose from 21,556–21,760 to 25,867.2–26,112, exactly 20% per seed. Peeler and Afterburner Fries controls matched. This is forced-target damage, not natural-run DPS or acquisition evidence.

## Tips

- **Pair it with Butter Socks.** The catalyst fits the weapon: [Butter Socks](/passives/butter-socks) gives extra dash charges and a shorter dash cooldown, and each 48-unit dash counts towards the 40-unit walk trigger like normal movement.
- Each point of Pierce bonus lets every tot hit one more pest before it bursts.
