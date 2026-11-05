## Overview

The Colorado Queen is the second boss. She arrives at 3:00 on the [wave schedule](/bosses#wave-schedule), in the same minute as an elite and a [Golden Scarab](/events/golden-scarab). She has 700 base HP: about 455 on Normal (boss HP ×0.65, see [Modes](/modes)) and 665 on Nightmare before [curse](/curse). Nightmare starts every run with one curse, which adds 10% to boss HP, so there she actually has about 732. <small>[sim-BfhgrRZL.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-BfhgrRZL.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> She is slow (speed 30, against Tibo's base 62) and has the lowest contact damage of any boss, 14. Her danger is the brood she hatches, not her body.

She is not in the post-20:00 rotation. As the second entry in the boss order, she is one of the bosses a [Boss Lair](/points-of-interest#boss-lair) can wake, early in a run. She drops an XP gem worth 40, a 25-gold coin and a chest ([Chests](/chests)).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 3:00 on all four difficulties, with 350 HP on Easy, 455 on Normal, 490 on Hard and 731.5 on Nightmare. Seeds `s1` to `s4` gave the same Normal times and HP.

## Fight

The Queen walks towards Tibo. Every 5 s she stops to hatch a brood, and between broods she fires one bullet pattern, an aimed stream. The pattern clock is paused while she is hatching. <small>[sim-BfhgrRZL.js: `d===0?(zd(e,o,s,c,l,u),Rd(e,o,s,t)):d===1?Bd(e,o,s,t):Vd(e,o,s,t)`]</small> Her first brood comes about 3 s after she appears.

### Brood

Eight small spawn marks appear in a ring 36 units around the Queen herself, not around Tibo. She stands still for 1 s, then a [Beetle Brood](/enemies/beetle-brood) hatches on each mark. Brood are ordinary chasing pests: 16 base HP, speed 46 and 7 contact damage. Each one despawns 40 s after hatching if it is not killed. <small>[sim-BfhgrRZL.js: `o>=0&&(e.enemies.despawnAt[o]=e.time+40)`]</small> One full cycle takes 6 s (5 s of walking plus the 1 s hatch), so an ignored Queen can have several broods chasing Tibo at once.

If the Queen dies during the 1 s hatch, the marks vanish and nothing hatches. <small>[sim-BfhgrRZL.js: `function Wm(e,t){let n=e.zones.ownerBoss[t];return n>=0&&!e.bosses.pool.has(n)}`]</small>

### Aimed stream

Every 2.8 s at base (about 2.6 s at 3:00, because enemy fire rate rises with time; see [Enemy scaling](/enemy-scaling#enemy-bullets)), the Queen aims at Tibo. After 0.6 s she fires three bursts 0.25 s apart. Each burst is two shots in the same direction, the second slightly slower (speed 80, then about 70), so the six shots arrive as a short stream. Each deals 7 damage. The direction is fixed when the pattern starts, before the 0.6 s warning. <small>[sim-BfhgrRZL.js: `` case`aimed`:return X.angle=s,X.speed=c/(1+.15*n),X ``]</small>

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 3:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): streams of three 2-shot bursts about 0.22 s apart, starting 1.95 s, 5.53 s, 8.10 s and 11.67 s after she spawned.

### Nightmare changes

On Nightmare the stream launches faster, at 100, and slows down evenly to half speed by 0.7 s, then keeps that speed. The shots reach Tibo quickly at close range but linger in the air further out.

## Tips

- The stream is aimed at where Tibo was 0.6 s before it fires. Any steady sideways movement makes it miss. Running straight away from the Queen does not.
- Brood are slower than Tibo (46 against 62), so you can kite them. They still add up over a long fight, though, so killing the Queen quickly is the main defence.
- Brood hatch around the Queen. Fighting her from range keeps the fresh brood away from Tibo at first, while weapons that hit an area or pierce ([Stats](/stats#stat-sources)) can clear a brood ring in one go.
- If the Queen is nearly dead when she stops to hatch, finishing her within that 1 s cancels the whole brood.
