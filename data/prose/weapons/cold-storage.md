## Overview

Cold Storage is the evolution of [Root Cellar](/weapons/root-cellar). A chest can evolve it once Root Cellar is at max level and Tibo owns [Slow Cooker](/passives/slow-cooker) (see [Evolutions](/evolutions)). The cold ring now runs from 42 to 60 units around Tibo (area 1.5). A pest touching it takes 110 damage and freezes for 1.1 s, and it can be hit again after 1 s. Bosses are slowed by 50% for 1.5 s instead of being frozen.

Compared with a max-level Root Cellar (38 damage, re-hit every 1.6 s), it hits almost three times as hard, re-hits more often and holds pests longer.

**Combine with Eternal Sprouts.** Once you own both evolutions, a chest can unite them into [Cold Frame](/weapons/cold-frame), freeing one weapon slot and adding freezing sprouts to the cold ring.

## How it works

- The ring works the same way as Root Cellar's. It is always active, hits pests touching the band between the inner and outer edge, and skips pests fully inside. Its 1 s cooldown is the wait before the same pest can be hit again.
- **Freeze outlasts the re-hit.** Freeze and slow durations are multiplied by Tibo's duration stat, so with the base +25% duration a pest stays frozen for about 1.4 s. That is longer than the 1 s re-hit time, so a pest frozen inside the band is hit and frozen again before it thaws. It stays locked in the band until it dies or something else knocks it out. Slow Cooker levels lengthen the freeze further. <small>[sim-DUXHKfs3.js: `e.slowF[t]=Math.max(e.slowF[t],n.factor),e.slowT[t]=Math.max(e.slowT[t],n.seconds*i)`]</small>
- Bosses get the slow (`factor` 0.5, so half speed) because they cannot be frozen.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right, then one pest held 52 units away): in the line only the pests at 40 to 60 units were hit, each every 1 s, and the single pest's freeze timer was set to 1.375 s by each hit. With the clock warped to 9:58 and the Great Wireworm boss held 40 units away, the boss was never frozen and each hit slowed it by 50% for 1.875 s. All three seeds gave the same figures.

## Tips

- **Use it to hold off swarms.** A pest walking in towards Tibo takes a 110-damage hit and a freeze as soon as it touches the band, unless the ring hit it within the last second. This makes Cold Storage a strong defence against swarms.
- Weapons with high knockback can push frozen pests out of the band and out of the freeze lock.
