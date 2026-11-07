## Overview

Zelda & Link is the fused form of the two legendary dogs, [Link](/dogs/pomeranian) and [Zelda](/dogs/pomchi). It never appears as a stray. Tibo gets it by holding one of the pair and walking onto a stray of the other. Each of the two is available in a run with a one-in-three chance, so both are available in about one run in nine.

The fused dog does both jobs on one shared timer. Every 5 seconds it marks elites and loot runners the way Zelda does, and every second time it also grows a fluff charge the way Link does. About every 50 seconds it adds an eclipse: an extra fluff charge and a short mark on every pest near Tibo. Its aura combines both: +0.15 HP per second of recovery and +6% luck (+0.6 HP/s and +24% at level 5). Training uses the same multipliers as Zelda and Link, so the timer drops to 3 s at level 5.

## How it works

### Fusing

- Fusion is checked before the usual stray rules. It happens even when the pack is full, without a swap prompt. <small>[sim-CG3gW6oN.js: `` if(e.legendary!==null&&e.legendary.fuse(e,t.id))return`joined` ``]</small>
- The fused dog takes the pack slot and the level of the partner Tibo already had. Training that partner before the fusion is not lost. <small>[run-rules-BsMiClNC.js: `o.level[i]=Math.min(s,ue(u))`]</small>

### Each beat

- **Marks**: the same rules as Zelda. It marks the nearest unmarked elites or loot runners within 600 units of Tibo (1, 1, 2, 2 and 3 at once by level), and they take +25% damage for `8 × power` seconds.
- **Fluff**: on every second beat it grows a charge, up to 1, or 2 from level 3. A charge cancels the next hit on Tibo that is not dodged and sneezes pests away, exactly as for Link. Because two beats equal one Link interval, fluff regrows at Link's pace at the same level.
- **Eclipse**: on the first beat at least 50 s after the fusion or the last eclipse. The 50 s does not shrink with training. <small>[run-rules-BsMiClNC.js: `r.beat%n.puffBeats===0&&Ze(e,t),e.time-Math.max(r.coronaAt,r.fusedAt)>=n.corona.every`]</small>
  - It adds one fluff charge that may go one above the normal cap, so up to 3 charges from level 3. <small>[run-rules-BsMiClNC.js: `let i=Ye(e,n)+r.charges`]</small>
  - It marks every pest within 110 units of Tibo, elite or not, for +10% damage taken for 1 s. Bosses are excluded. An existing stronger or longer mark is kept.

### Differences from the separate dogs

The shared beat always counts as used, even when there is nothing to mark and the fluff is full. So the fused dog loses one small edge each dog has alone. Link alone regrows a spent charge within 0.25 s after a quiet spell; Zelda alone marks a new elite as soon as it comes in range. The fused dog waits for its next beat for both.

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; legendary dogs enabled with the game's own `installLegendary` hook from the run-extras chunk; the fused dog added directly at Tibo's side with the sim's own dog-join and dog-level-up functions, without a fusion; HP refilled every tick; level-ups taking the first offer; beats timed from the game's `dogAbility` events). At level 1, with Tibo walking a slow circle for 240 s on seeds `s1`–`s3`, the beat came every 5 s (47 of 47 gaps on each seed). Eclipses fell on the beats at 51, 101, 151 and 201 s, the first beat at least 50 s after the last. At level 5, with Tibo standing still for 150 s on seed `wiki`, the beat came every 3 s (49 of 49).

## Tips

- **Both legendaries share one pack slot.** One pack slot for both legendaries is the main gain: it leaves two slots for other dogs.
- Thanks to the eclipse charge above the cap, a Zelda & Link at level 3 or higher can hold three charges and cancel three hits in a row.
- The eclipse's +10% lasts only a second, so treat it as a minor bonus. The regular +25% marks matter more, especially with a [Jack Russell Terrier](/dogs/terrier) biting marked elites.
