## Overview

The Colorado Queen is the second boss. She arrives at 3:00 on the [wave schedule](/bosses#wave-schedule), in the same minute as an elite and a [Golden Scarab](/events/golden-scarab). She has 700 base HP: about 455 on Normal (boss HP ×0.65, see [Modes](/modes)) and 665 on Nightmare before [curse](/curse). Nightmare starts every run with one curse, which adds 10% to boss HP, so there she actually has about 732. <small>[intro-shared-CUo8U0f2.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-DSqbJT_O.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> She is slow (speed 30, against Tibo's base 62) and has the lowest contact damage of any boss, 14. Her danger is the brood she hatches, not her body.

She is not in the post-20:00 rotation. As the second entry in the boss order, she is one of the bosses a [Boss Lair](/points-of-interest#boss-lair) can wake, early in a run. She drops an XP gem worth 40, a 25-gold coin and a chest ([Chests](/chests)).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 3:00 on all four difficulties, with 350 HP on Easy, 455 on Normal, 490 on Hard and 731.5 on Nightmare. Seeds `s1` to `s4` gave the same Normal times and HP.

## Fight

The Queen walks towards Tibo. Every 5 s she stops to hatch a brood, and between broods she fires aimed eggs that hatch into radial shots. The pattern clock is paused while she is hatching her ordinary brood. <small>[sim-DSqbJT_O.js: `d===0?(qS(e,o,s,c,l,u),KS(e,o,s,t)):d===1?JS(e,o,s,t):YS(e,o,s,t)`]</small> Her first brood comes about 3 s after she appears.

### Brood

Eight small spawn marks appear in a ring 36 units around the Queen herself, not around Tibo. She stands still for 1 s, then a [Beetle Brood](/enemies/beetle-brood) hatches on each mark. Brood are ordinary chasing pests: 16 base HP, speed 46 and 7 contact damage. Each one despawns 40 s after hatching if it is not killed. <small>[sim-DSqbJT_O.js: `o>=0&&(e.enemies.despawnAt[o]=e.time+40)`]</small> One full cycle takes 6 s (5 s of walking plus the 1 s hatch), so an ignored Queen can have several broods chasing Tibo at once.

If the Queen dies during the 1 s hatch, the marks vanish and nothing hatches. <small>[sim-DSqbJT_O.js: `function fE(e,t){let n=e.zones.ownerBoss[t];return n>=0&&!e.bosses.pool.has(n)}`]</small>

### Aimed eggs

Every 2.8 s at base (about 2.6 s at 3:00, because enemy fire rate rises with time; see [Enemy scaling](/enemy-scaling#enemy-bullets)), the Queen aims at Tibo. After a 0.6 s warning she fires two single eggs, with a base interval of 0.45 s. Each egg has radius 3.5, base speed 80 and base damage 7. Its direction is fixed when the pattern starts, before the warning. <small>[sim-DSqbJT_O.js: `` kind:`aimed`,count:1,speed:80,radius:3.5,damage:7,bursts:2,interval:.45,telegraph:.6 ``]</small>

An egg keeps its launch speed for 0.55 s, slows to a stop over the next 0.30 s, then hatches at age 1.35 s into **five evenly spaced larva bullets**. These are projectiles, not the eight chasing Beetle Brood pests above. Each larva has radius 2, speed 55 and 60% of the egg's damage (4.2 before difficulty/time scaling). The egg disappears at the split. <small>[sim-DSqbJT_O.js: `at:1.35,count:5,speed:55,radius:2,damage:.6`]</small> <small>[sim-DSqbJT_O.js: `n.pool.kill(d),e.legendary?.hatch(e,d)`]</small>

The hatch checks the original owner's pool identity and hidden flag. If the Queen dies or becomes hidden before the split, the egg disappears without larvae; a different boss reusing her slot does not count as the same owner. If the hostile-bullet pool is full, the hatch can produce fewer than five larvae. <small>[run-rules-BGxfYFg5.js: `return i.pool.has(n.ownerId[t])&&!i.has(w(r),f.Hidden)`]</small> <small>[run-rules-BGxfYFg5.js: `let l=ye(e,i,s);if(l<0)return;`]</small>

**Measured before and after** (builds `main-4ZrEZvZi` → `main-CKdQfNMW`, seed `wiki`, Standard/Normal and Nightmare, actual sim plus each build's run-extras rules): isolated the Queen after warping to 179.95 s, removed weapons and other bosses/pests, used `--god`, and held Tibo at offset (150, 41). The old first volley was three two-shot bursts at 181.967, 182.183 and 182.417 s. The new volley was two eggs at 181.967 and 182.367 s, each producing five larvae at 183.317 and 183.717 s. Normal larvae traveled at 55 and dealt 1.228227 scaled damage; Nightmare larvae traveled at 70 and dealt 2.71985. Separate boundary/control probes checked the split threshold, dead/hidden/recycled owners, full and partially full bullet pools, inherited fields and asymmetric shot directions. These are isolated simulation measurements, not device or rendering-performance tests.

**Historical measurement** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, Standard/Normal, `--god`; clock warped to just before 3:00; every other boss and pest removed each tick): the former stream had three two-shot bursts about 0.22 s apart, starting 1.95 s, 5.53 s, 8.10 s and 11.67 s after she spawned. This records the old attack, not the current eggs.

### Nightmare changes

Eggs launch at base speed 100 instead of 80 and follow the same stop-and-hatch timing. Their larvae travel at 70 instead of 55. This replaces the former Nightmare stream's slowdown to half speed by 0.7 s.

## Tips

- **Move sideways from the eggs.** Eggs aim at where Tibo was before the warning. Move sideways to avoid their initial path, then leave room for the radial larvae when they hatch.
- Brood are slower than Tibo (46 against 62), so you can kite them. They still add up over a long fight, though, so killing the Queen quickly is the main defence.
- Brood hatch around the Queen. Fighting her from range keeps the fresh brood away from Tibo at first, while weapons that hit an area or pierce ([Stats](/stats#stat-sources)) can clear a brood ring in one go.
- If the Queen is nearly dead when she stops to hatch, finishing her within that 1 s cancels the whole brood.
- Killing her before an egg splits also prevents that egg's larvae.
