## Overview

Zelda & Link is the fused form of the two legendary dogs, [Link](/dogs/pomeranian) and [Zelda](/dogs/pomchi). It never appears as a stray. Tibo gets it by holding one of the pair and walking onto a stray of the other. Each of the two is available in a run with a one-in-three chance, so both are available in about one run in nine.

The fused dog does both jobs on one shared timer. Every 5 seconds it marks elites and loot runners the way Zelda does, and every second time it also grows a fluff charge the way Link does. About every 50 seconds it adds an eclipse: an extra fluff charge and a short mark on every pest near Tibo. Its aura combines both: +0.15 HP per second of recovery and +6% luck (+0.6 HP/s and +24% at level 5). Training uses the same multipliers as Zelda and Link, so the timer drops to 3 s at level 5.

## How it works

### Fusing

- Fusion is checked before the usual stray rules. It happens even when the pack is full, without a swap prompt. <small>[sim-HQr6OS1G.js: `` if(e.legendary!==null&&e.legendary.fuse(e,t.id))return`joined` ``]</small>
- The fused dog takes the pack slot and the level of the partner Tibo already had. Training that partner before the fusion is not lost. <small>[run-extras-BO-3xLRW.js: `a.level[i]=Math.min(o,h(u))`]</small>

### Each beat

- **Marks**: the same rules as Zelda. It marks the nearest unmarked elites or loot runners within 600 units of Tibo (1, 1, 2, 2 and 3 at once by level), and they take +25% damage for `8 × power` seconds.
- **Fluff**: on every second beat it grows a charge, up to 1, or 2 from level 3. A charge cancels the next hit on Tibo that is not dodged and sneezes pests away, exactly as for Link. Because two beats equal one Link interval, fluff regrows at Link's pace at the same level.
- **Eclipse**: on the first beat at least 50 s after the fusion or the last eclipse. The 50 s does not shrink with training. <small>[run-extras-BO-3xLRW.js: `r.beat%n.puffBeats===0&&H(e,t),e.time-Math.max(r.coronaAt,r.fusedAt)>=n.corona.every`]</small>
  - It adds one fluff charge that may go one above the normal cap, so up to 3 charges from level 3. <small>[run-extras-BO-3xLRW.js: `let i=B(e,n)+r.charges`]</small>
  - It marks every pest within 110 units of Tibo, elite or not, for +10% damage taken for 1 s. Bosses are excluded. An existing stronger or longer mark is kept.

### Differences from the separate dogs

The shared beat always counts as used, even when there is nothing to mark and the fluff is full. So the fused dog loses one small edge each dog has alone. Link alone regrows a spent charge within 0.25 s after a quiet spell; Zelda alone marks a new elite as soon as it comes in range. The fused dog waits for its next beat for both.

## Tips

- One pack slot for both legendaries is the main gain: it leaves two slots for other dogs.
- Thanks to the eclipse charge above the cap, a Zelda & Link at level 3 or higher can hold three charges and cancel three hits in a row.
- The eclipse's +10% lasts only a second, so treat it as a minor bonus. The regular +25% marks matter more, especially with a [Jack Russell Terrier](/dogs/terrier) biting marked elites.
