## Overview

Compost Titan is the eleventh boss. It arrives at 17:00 on the [wave schedule](/bosses#wave-schedule), in the same minute as an elite and a [Golden Scarab](/events/golden-scarab), and only a minute after [Grater Golem](/bosses/grater-golem). The ×3 boss HP step from minute 16 applies, so its 9000 base HP becomes 27,000. That is about 17,550 on Normal (boss HP ×0.65, see [Modes](/modes)) and 25,650 on Nightmare before [curse](/curse). Nightmare starts every run with one curse, which adds 10% to boss HP, so there it actually has about 28,215. <small>[intro-shared-Cy9oIPG8.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-nIcq_DHZ.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> It is large (body radius 22) and slow (speed 24, against Tibo's base 62), and deals 30 contact damage.

It is part of the post-20:00 rotation, so a long run meets it again at 25:00, 32:00 and every 7 minutes after that ([After 20:00](/bosses#after-20-00)). A [Boss Lair](/points-of-interest#boss-lair) can also wake it. It drops an XP gem worth 200, a 25-gold coin and a chest ([Chests](/chests)). It has no Nightmare variants.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 17:00 on all four difficulties, with 13,500 HP on Easy, 17,550 on Normal, 18,900 on Hard and 28,215 on Nightmare. Seeds `s1` to `s4` gave the same Normal times and HP.

## Fight

The Titan lumbers towards Tibo, firing homing spirals. Every 4 s it stops to release a ring of maggots. One summon cycle is 5 s: 4 s of walking plus a 1 s warning. The spiral timer is paused during the summon. <small>[sim-nIcq_DHZ.js: `d===0?(KE(e,o,s,c,l,u),GE(e,o,s,t)):d===1?qE(e,o,s,t):JE(e,o,s,t)`]</small>

### Maggot ring

Fourteen spawn marks appear in a ring 44 units around the Titan. After 1 s a [Maggot](/enemies/maggot-swarm) hatches on each: an ordinary chasing pest with 30 base HP, speed 50 and 10 contact damage. Each one despawns 40 s after hatching if it is not killed. <small>[sim-nIcq_DHZ.js: `n>=0&&(e.enemies.despawnAt[n]=e.time+40)`]</small> A new ring every 5 s and a 40 s lifetime mean an ignored Titan can have up to about 110 maggots out at once.

If the Titan dies during the 1 s warning, the marks vanish and no maggots hatch.

### Homing spiral

Every 3.6 s at base, after a 1 s warning, the Titan fires four streams of shots at right angles to each other. It fires 12 volleys, 0.18 s apart, turning about 0.22 radians (12°) between volleys, so the streams sweep around it. The shots fly at speed 55 and deal 12 damage each.

From 0.4 s to 1.4 s after launch, each shot steers towards Tibo, turning up to 0.8 radians per second. It only steers while Tibo is ahead of it, and it stops steering for good once Tibo dashes. <small>[sim-nIcq_DHZ.js: `c!==void 0&&r>=c.after&&r<c.until&&$E.dashAgo>Math.round(r/i)`]</small>

Enemy bullets scale with time ([Enemy scaling](/enemy-scaling#enemy-bullets)). At 17:00 the spiral has seven streams instead of four (4 × 1.68, rounded), the shots fly at about 69, faster than Tibo walks, volleys come about 0.12 s apart and a new spiral starts about every 2.4 s.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 17:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): spirals of 12 seven-shot volleys about 0.12 s apart, starting 2.75 s, 6.13 s, 9.52 s and 11.90 s after it spawned.

## Tips

- **Dash early in each spiral.** A dash cancels the homing of every spiral shot already in the air. Dashing early in a spiral, once the first volleys are out, turns the rest of their flight into straight lines. Volleys fired after the dash still home.
- At 17:00 the spiral shots are faster than Tibo, so outrunning them does not work. Moving across their path does, because each shot can turn at most 0.8 radians (about 46°) in total.
- Maggots are slower than Tibo (50 against 62) but arrive in rings of 14. Weapons that hit an area or pierce ([Stats](/stats#stat-sources)) keep the numbers down. Kiting the Titan, the slowest boss after [Ketchup Kraken](/bosses/ketchup-kraken), is easy, but every 5 s spent kiting adds another ring.
- Its HP is the main problem. [Bacon Bits](/passives/bacon-bits) and [Boss Buster](/items/boss-buster) raise damage against bosses. If Grater Golem is still alive at 17:00, killing one of the two quickly is usually better than splitting damage.
