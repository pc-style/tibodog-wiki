## Overview

Thunder Tuber is the evolution of [Starch Bolt](/weapons/starch-bolt). It works the same way, striking random enemies around Tibo, but on a much larger scale: every 1.7 seconds it hits 9 different pests within 180 units (its raw amount of 8 plus the +1 base amount bonus every non-aura weapon gets, see [Stats](/stats)), each strike dealing 66 damage in a blast of 24 units around the target. A maxed Starch Bolt manages 7 strikes of 48 damage with 18-unit blasts every 2 seconds.

You get it by opening a chest while Starch Bolt is level 8 and you own [Sprouting Eyes](/passives/sprouting-eyes) at any level. Thunder Tuber unites with [Gratin Arc](/weapons/gratin-arc) into [Starch Supercell](/weapons/starch-supercell). Both partners must be evolved first. See [Evolutions](/evolutions) and [Chests](/chests).

## How it works

The targeting rules are the same as Starch Bolt's: the weapon waits until an enemy is within range, then picks distinct random targets inside that circle, and all strikes land in the same instant. If fewer than 9 enemies are in range, the remaining strikes are skipped. <small>[sim-D8O4GfAa.js: `for(let o=0;o<r.amount;o++){let o=zl(e,n.range,i);if(o===void 0)return;`]</small> Its catalyst also keeps paying off: every extra projectile from Sprouting Eyes is one more strike per cast. Since you need Sprouting Eyes to evolve, which gives +1 projectile from its first level, a fresh Thunder Tuber normally strikes at least 10 enemies per cast when that many are in range.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; 12 pests held on a ring 75 units from Tibo): every 1.7 s exactly 9 pests were struck on the same tick, each for 66. All three seeds gave the same figures.

## Tips

- **Keep a focused weapon for bosses.** Thunder Tuber shines against dense waves, where all 9 strikes find targets and the 24-unit blasts overlap. Against a lone boss most of the cast is wasted, so keep a focused weapon for boss fights.
