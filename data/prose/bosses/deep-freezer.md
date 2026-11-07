## Overview

The Deep Freezer is the ninth boss. It arrives at 14:00 on the [wave schedule](/bosses#wave-schedule), alongside a [Golden Scarab](/events/golden-scarab). It has 6200 base HP: about 4030 on Normal (boss HP ×0.65, see [Modes](/modes)) and 5890 on Nightmare before [curse](/curse). Nightmare starts every run with one curse, which adds 10% to boss HP, so there it actually has about 6479. <small>[intro-shared-B6S10bJW.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-CeO30Hnb.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> It is the last boss before the ×3 boss HP step at 16:00. It moves slowly (speed 28) and deals 24 contact damage.

It is not in the post-20:00 rotation; a [Boss Lair](/points-of-interest#boss-lair) can wake it. It drops an XP gem worth 150, a 25-gold coin and a chest ([Chests](/chests)). It has no Nightmare variants: its slam and ice-cube fan are the same on every difficulty.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 14:00 on all four difficulties, with 3100 HP on Easy, 4030 on Normal, 4340 on Hard and 6479 on Nightmare. Seeds `s1` to `s4` gave the same Normal times and HP.

## Fight

The Freezer walks towards Tibo, fires a fan of ice cubes, and every 3.4 s stops to slam the ground near him. A slam cycle lasts 4.3 s (3.4 s of walking plus a 0.9 s warning). The cube timer is paused during the slam. <small>[sim-CeO30Hnb.js: `d===0?(rT(e,o,s,c,l,u),nT(e,o,s,t)):d===1?iT(e,o,s,t):aT(e,o,s,t)`]</small>

### Triple slam

Three circles of radius 40 appear on the ground. The first is centred on Tibo; the other two are placed up to 70 units away in random directions. They strike one after another, at 0.9 s, 1.02 s and 1.14 s, each dealing the Freezer's contact damage (24 at base, growing with run time). <small>[sim-CeO30Hnb.js: `Qc(e,a+_(u)*l,o+c(u)*l,i.radius,n.telegraph+.12*s,e.bosses.damage[t])`]</small>

### Ice cube fan

Every 2.4 s at base, the Freezer aims at Tibo. After 0.8 s it fires nine ice cubes spread over 1.4 radians (about 80°) at speed 110, 16 damage each. The cubes on each side curve towards the line they were aimed along, turning 1 radian (about 57°) over their first second, then fly straight. A centre cube, when there is one, does not curve. <small>[sim-CeO30Hnb.js: `` case`fan`:return Math.sign(n-1-2*t) ``]</small> Because they turn that far, the cubes cross the aim line and end up on the opposite side. The inner cubes cross close to the Freezer and the outer ones further out.

Each cube that actually damages Tibo adds **0.3 s of freeze**, stopping ordinary movement. One freeze can accumulate at most **0.9 s total**, including time already spent frozen; later hits cannot keep extending it forever. A dash breaks the ice. When Tibo thaws naturally or dashes free, he gains **0.9 s of immunity to another freeze**, not to damage. Dodged hits, invulnerable hits and hits fully soaked by a guard weapon do not freeze him. <small>[sim-CeO30Hnb.js: ``case`freeze`:n&&function(e,t)``]</small> <small>[sim-CeO30Hnb.js: `if(n.freezeGuard[r]>0)return;let i=n.freezeTicks[r]>0?n.freezeSpan[r]:0`]</small> <small>[intro-shared-B6S10bJW.js: `freezeCapSec:.9,freezeGuardSec:.9,freezeDamageCut:.25`]</small>

While frozen, Tibo takes **25% less damage**, after armor, guard absorption and Nightmare's boss-hit cap; this also reduces terrain damage. The first cube starts the freeze only after its damage lands, so it does not receive that reduction. The icy screen tint and ice block show the freeze; the block cracks as the remaining time falls and shatters when it ends. <small>[sim-CeO30Hnb.js: `(e,l*(1-Tc(s.armor,i,e.cfg)),n,r)*(u?1-e.cfg.player.freezeDamageCut:1)`]</small> <small>[scene-DybBygRT.js: ``iceBack:n(gx,`back`),iceFront:n(gx,`front`),iceShatter:n(gx,`shatter`),iceChip:n(gx,`chip`)``]</small>

**Measured old/new** (seed `wiki`, Standard/Normal, original hit/movement/thaw functions, forced base-damage cube hits with no armor): four successive 16-damage hits cost 16/16/16/16 HP before this change, versus 16/12/12/12 now. Freeze counters rose 18 → 36 → 54 → 54 ticks at 60 Hz. Ordinary movement stopped; thaw and dash both cleared the freeze and set a 54-tick freeze guard. Dodge, invulnerability and full/partial guard controls confirm the damage requirement; frozen terrain damage fell from 16 to 12. These isolated probes do not measure how often a player naturally gets caught.

Enemy bullets scale with time ([Enemy scaling](/enemy-scaling#enemy-bullets)). At 14:00 the fan has 14 cubes (9 × 1.56, rounded), so there is no centre cube. They launch at about 133 and a new fan starts about every 1.7 s.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 14:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): 14-shard fans 1.95 s, 4.55 s, 6.25 s, 8.85 s, 10.55 s and 13.15 s after it spawned.

## Tips

- **Walk out of the slam circle.** The slam is easy to walk out of at full speed: Tibo needs to cover about 46 units from the centre of the first circle (its radius plus his body), and he does about 56 in 0.9 s. Watch the two random circles so you do not walk into one.
- Keep a dash charge for a slam that follows a cube hit: dashing breaks the freeze rather than waiting for it to expire. The 25% damage reduction is a fallback, not protection from a slam.
- The space straight in front of the Freezer is where the cubes cross. Stepping well to one side of its aim, rather than backing straight away, keeps Tibo out of most paths.
- [Butter Socks](/passives/butter-socks) adds dash charges and shortens the dash cooldown, which helps with the freeze-then-slam combination. [Ghost Pepper](/items/ghost-pepper) extends the protection after a dash.
- With 4030 HP on Normal, it is still worth having a strong single-target or boss-damage source by this point; [Bacon Bits](/passives/bacon-bits) and [Boss Buster](/items/boss-buster) raise damage against bosses. The next boss, [Grater Golem](/bosses/grater-golem), arrives after the ×3 HP step.
