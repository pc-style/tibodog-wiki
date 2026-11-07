## Overview

Ketchup Kraken is the twelfth boss in the boss order and the 18:00 boss on the [wave schedule](/bosses#wave-schedule), the last one before [The Harvester](/bosses/harvester) at 20:00. It comes back in the overtime cycle after 20:00, first at 26:00 and then every seven minutes (see [After 20:00](/bosses#after-20-00)). A [Boss Lair](/points-of-interest#boss-lair) can also wake it; it is the latest boss a lair can pick.

It arrives just as the ×4 boss HP step starts at 18:00, so its 11000 base HP becomes 44000 before the difficulty multiplier and 28600 on Normal (boss HP ×0.65, see [Modes](/modes)), more with [curse](/curse). Contact damage is 34 before time scaling. At speed 22 it is the slowest boss, at about a third of Tibo's base speed of 62.

It drops a [chest](/chests), an XP gem worth 230 XP and a 25-gold coin (both multiplied by the biome's XP and gold multipliers).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 18:00 on all four difficulties, with 22,000 HP on Easy, 28,600 on Normal, 30,800 on Hard and 45,980 on Nightmare. The Nightmare figure is 10% above base HP × the difficulty multiplier because Nightmare starts every run with one curse, and boss HP is multiplied by 1 + curse. <small>[intro-shared-Wxe39561.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-CFo3ylXb.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> Seeds `s1` to `s4` gave the same Normal times and HP. The Nightmare value comes from a run where each earlier boss was removed on arrival, because a stationary god-mode Tibo was killed by stacked boss hits at 17:59 otherwise.

## Fight

The Kraken crawls towards Tibo, throws fans of ketchup that turn into puddles, and every 3 s of walking stops for a round of tentacle slams. A full cycle takes 4.1 s, and its first slams start about 1.8 s after it spawns. It is the same on every difficulty: it has no Nightmare variants.

### Tentacle slams

Five circles of radius 32 are marked around Tibo's position: the first centred on him, the other four at random spots up to 80 units away. They strike in turn, 0.12 s apart, at 1.1 s, 1.22 s, 1.34 s, 1.46 s and 1.58 s. Each deals the Kraken's contact damage. <small>[sim-CFo3ylXb.js: `u=vC(e,Yc(e,a+p(l)*c,o+x(l)*c,i.radius,n.telegraph+.12*s,e.bosses.damage[t]),t)`]</small>

### Ketchup fan

Every 2.8 s of walking, after a 0.8 s warning, it throws a fan of 5 blobs spread over 1.2 radians (about 69°), aimed at Tibo. Each blob deals 14 damage before scaling. The blobs slow to a crawl and, 0.95 s after launch, turn into short-lived puddles about 74 units from where they were thrown. Blobs that hit Tibo don't leave a puddle. The puddle size, lifetime and damage on each difficulty are under [Ketchup blobs](/bosses/ketchup-kraken#ketchup-blobs).

Bullet count, fire rate and speed grow with run time (see [Enemy bullets](/enemy-scaling#enemy-bullets)). At its 18:00 arrival the fan has 9 blobs at about speed 121, landing about 94 units out, and comes every 1.8 s of walking. Puddles last about 3 s on Normal, so one or two sets are on the ground most of the time.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 18:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): 9-blob fans 2.15 s, 5.08 s, 8.00 s, 9.82 s and 12.73 s after it spawned.

## Tips

- **Leave the first circle first.** It is always centred on Tibo and strikes first, so moving about 38 units (its radius plus Tibo's size) during the 1.1 s warning avoids it. Check where the other four were marked before picking a direction: one of them may cover the spot Tibo is heading for, and the last one strikes almost half a second later.
- **A dash can't help with puddles.** Puddle damage is ground-hazard damage: dashing and dodge sources such as [Thick Skin](/passives/thick-skin) don't stop it, though [armor](/stats#armor) does. Save the dash for the slams and blobs, and walk around the puddles.
- **Mind the puddle line.** Puddles form in an arc a fixed distance from where the Kraken threw them, in Tibo's direction. Standing close to the Kraken keeps that arc behind Tibo; standing at that distance puts him in it.
- **Run it down with damage bonuses.** At 28600 HP on Normal, with the Harvester due two minutes later, boss-damage bonuses such as [Bacon Bits](/passives/bacon-bits) and [Boss Buster](/items/boss-buster), or [Inferno Basket](/weapons/inferno-basket)'s double damage to bosses, pay off. Its low speed makes close-range weapons safer here than against most late bosses.
