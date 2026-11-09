## Overview

Grater Golem is the tenth boss. It arrives at 16:00 on the [wave schedule](/bosses#wave-schedule), with a [Ring of Hay Bales](/events/bale-ring). It is the first boss after the ×3 boss HP step at minute 16, so its 7400 base HP becomes 22,200. That is about 14,430 on Normal (boss HP ×0.65, see [Modes](/modes)) and 21,090 on Nightmare before [curse](/curse). Nightmare starts every run with one curse, which adds 10% to boss HP, so there it actually has about 23,199. <small>[intro-shared-Fi8cwUjF.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-BwchEhls.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> Its contact damage of 40 is the second highest of any boss, after [The Harvester](/bosses/harvester). It walks at speed 34.

It is part of the post-20:00 rotation, so a long run meets it again at 24:00, 31:00 and every 7 minutes after that ([After 20:00](/bosses#after-20-00)). A [Boss Lair](/points-of-interest#boss-lair) can also wake it. It drops an XP gem worth 170, a 25-gold coin and a chest ([Chests](/chests)). It has no Nightmare variants.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 16:00 on all four difficulties, with 11,100 HP on Easy, 14,430 on Normal, 15,540 on Hard and 23,199 on Nightmare. Seeds `s1` to `s4` gave the same Normal times and HP.

## Fight

The Golem walks towards Tibo and fires weaving rings. Every 3 s it stops and charges along a marked line. One charge cycle is 4.9 s: 3 s of walking, 1 s of warning and a 0.9 s dash. The ring timer is paused during the warning and the dash. <small>[sim-BwchEhls.js: `d===0?(oE(e,o,s,c,l,u),aE(e,o,s,t)):d===1?sE(e,o,s,t):cE(e,o,s,t)`]</small>

### Charge

When the charge starts, a line 26 units wide is drawn from the Golem in Tibo's direction. It is 288 units long, the distance of the dash (speed 320 for 0.9 s). <small>[sim-BwchEhls.js: `e.zones.length[o]=a.dashSpeed*a.dashTime`]</small> The Golem stands still for 1 s, then dashes along the line. The direction is fixed when the line appears and does not follow Tibo.

The line itself deals no damage; the Golem's body does. During the dash its contact damage is multiplied by 1.5, so 60 at base before time scaling. <small>[sim-BwchEhls.js: `` return e.bosses.state[t]===2&&r.attack.kind===`charge`?1.5:1 ``]</small> Its body is wider than the line (radius 16 against a half-width of 13), so with Tibo's own size the danger reaches about 21 units from the centre of the line.

### Weaving ring

Every 3 s at base, the Golem fires one ring of 14 shots at speed 90, 14 damage each, after a 0.8 s warning. Each shot sways from side to side as it flies, about 10 units either way, 1.2 times a second. Neighbouring shots sway in opposite directions, so the gaps between them keep opening and closing. <small>[sim-BwchEhls.js: `let n=A*e.hz;return e.px*n*k(n*t)`]</small>

Enemy bullets scale with time ([Enemy scaling](/enemy-scaling#enemy-bullets)). At 16:00 each ring has 23 shots (14 × 1.64, rounded), they fly at about 112, and a ring comes about every 2 s.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 16:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): 23-shot rings 2.25 s, 6.18 s, 10.12 s and 12.15 s after it spawned. Easy and Nightmare also gave 23-shot rings.

## Tips

- **Step sideways off the charge line.** Dodge the charge sideways. Getting more than about 21 units off the line takes Tibo about a third of a second, and he has a full second. Running straight away along the line does not work, because the Golem is five times faster than Tibo while dashing.
- Past the far end of the line (288 units) Tibo is safe from the dash. After a charge the Golem has to walk back, which gives Tibo time to attack or collect pickups.
- With 23 swaying shots, the ring's gaps are tight and keep changing near the Golem. A dash through the ring (see [Dash details](/controls#dash-details)) is more reliable than threading a gap.
- Its HP after the ×3 step makes this the first real damage check of a run. [Bacon Bits](/passives/bacon-bits) and [Boss Buster](/items/boss-buster) raise damage against bosses, and [Strategy](/strategy) suggests having a strong single-target source by minute 15.
- [Compost Titan](/bosses/compost-titan) arrives at 17:00, so a slow Golem kill means fighting both at once.
