## Overview

The Harvester is the last of the 13 bosses and the one the game config names as `win.finalBoss`. It is the minute-20 wave boss, arriving at 20:00 on the [wave schedule](/bosses#wave-schedule), the same moment the run counts as survived. Beating it is not required to survive: the run carries on into overtime either way (see [After 20:00](/bosses#after-20-00)). After that it returns as the last boss in the overtime cycle, first at 27:00 and then every seven minutes.

It is by far the toughest boss. Its 16000 base HP is multiplied by the ×6 boss HP step that starts at 20:00, which gives 96000 HP before the difficulty multiplier and 62400 on Normal (boss HP ×0.65, see [Modes](/modes)), more with [curse](/curse). It has the highest contact damage of any boss (60 before time scaling) and walks at speed 36, a little over half of Tibo's base speed of 62. Boss walking speed does not grow with time. <small>[sim-SY4MKKFC.js: `n.speed[r]=i.speed,n.damage[r]=i.damage*a.dmg`]</small>

[Boss Lairs](/points-of-interest#boss-lair) never wake the Harvester: they pick from the boss order but stop one short of its end. <small>[sim-SY4MKKFC.js: `r=n[Math.max(1,Math.min(n.length-2,Math.floor(e.runClock/120)+Math.floor(t.tier/2)))]`]</small>

Like every boss, it drops a [chest](/chests), an XP gem worth its 300 XP and a 25-gold coin (both multiplied by the biome's XP and gold multipliers).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 20:00 on all four difficulties, with 48,000 HP on Easy, 62,400 on Normal, 67,200 on Hard and 100,320 on Nightmare. The Nightmare figure is 10% above base HP × the difficulty multiplier because Nightmare starts every run with one curse, and boss HP is multiplied by 1 + curse. <small>[intro-shared-LIRFuqu4.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-SY4MKKFC.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> Seeds `s1` to `s4` gave the same Normal times and HP. The Nightmare value comes from a run where each earlier boss was removed on arrival, because a stationary god-mode Tibo was killed by stacked boss hits at 17:59 otherwise.

## Fight

The Harvester walks towards Tibo and alternates two bullet patterns while walking. Every 2.6 s of walking it stops to charge. The pattern timer pauses during the warning and the charge, and the 2.6 s countdown restarts only once the charge ends. Its first charge comes 1.56 s after it spawns and its first pattern 1.2 s after. <small>[sim-SY4MKKFC.js: `n.timer[r]=.6*i.attackEvery,n.patternT[r]=.5*i.patternEvery`]</small>

### Combine charge

When the attack is ready, the Harvester stops and locks onto the direction Tibo is in at that moment. A 70-unit-wide warning lane, 418 units long, shows its path for 1 s. It then drives along that line at speed 380 for 1.1 s, which covers the whole lane, and does not steer. A full cycle of walking, warning and charging takes 4.7 s.

The charge damage comes from touching the boss, not from the lane. While charging, its body hitbox widens from its normal radius of 22 to half the lane width (35), and contact damage is ×1.5, which is 90 before time scaling. <small>[sim-SY4MKKFC.js: ``e.bosses.state[t]===2&&r.attack.kind===`charge`?1.5:1``]</small>

### Homing volleys

The first pattern fires 3 volleys at Tibo, 0.25 s apart, after a 0.7 s warning. Each volley is a line of bullets fired in the same direction at falling speeds: the first at full speed (140), each later one 15% slower, so the line stretches out as it flies. <small>[sim-SY4MKKFC.js: ``case`aimed`:return m_.angle=s,m_.speed=c/(1+.15*n)``]</small> The aim is fixed when the warning starts. From 0.1 s to 0.6 s after launch, each bullet turns towards Tibo by up to 1.6 radians per second, but only while he is ahead of it and only if he has not dashed since it was fired. A dash ends the homing for every bullet already in the air. <small>[sim-SY4MKKFC.js: `c!==void 0&&r>=c.after&&r<c.until&&kC.dashAgo>Math.round(r/i)`]</small>

### Stalling rings

The second pattern fires two rings of 24 bullets, 0.4 s apart, after a 0.9 s warning. The second ring is rotated by half a gap, so it covers the first ring's holes. The bullets launch at speed 85, slow to a fifth of that by 0.4 s, hang almost still until 0.9 s, then speed up to 1.6× (136) by 1.2 s. In practice the double ring stalls around the Harvester before bursting outward.

### Late-game numbers

Enemy bullet counts, fire rates and bullet speeds all grow with run time (see [Enemy bullets](/enemy-scaling#enemy-bullets)). They are worked out when each pattern starts, so they are already high when the Harvester arrives at 20:00: ×1.8 bullet count, ×1.6 fire rate, ×1.3 bullet speed. <small>[sim-SY4MKKFC.js: `a.count[o]=Math.max(1,Math.round(t.count*f.bulletCount)),a.speed[o]=t.speed*f.bulletSpeed`]</small> At 20:00 that means:

- Homing volleys: 7 bullets per line instead of 4, lead bullet at speed 182, volleys 0.16 s apart.
- Stalling rings: 43 bullets per ring instead of 24, rings 0.25 s apart, bursting out at about 177.
- A new pattern every 1.5 s of walking instead of 2.4 s, so it usually fires one or two patterns between charges.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 20:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): three 7-bullet volleys 0.15 s apart at 1.85 s, two 43-bullet rings 0.23 s apart at 5.65 s, the volleys again at 9.05 s and the rings at 10.75 s after it spawned.

The charge is not affected: its timing and speed are fixed.

## Tips

- **Sidestep the charge early.** The direction is locked when the lane appears, so leaving the lane is enough. To be safe, Tibo needs to be about 40 units from the lane's centre line (35 for the hitbox plus his own size). At base speed that is about 0.65 s of the 1 s warning, so start moving as soon as the lane appears. A dash covers 48 units in 0.15 s and clears it on its own (see [dash details](/controls#dash-details)).
- **Stay out of its path after it stops.** The charge always runs the full 418 units, so standing just past where Tibo was is not safe either.
- **Dash after the volleys are fired**, not before. Dashing once the bullets are in the air ends their homing, and they fly straight from then on. With only one dash charge and a 5 s recharge, it may be worth saving the dash for the charge and walking out of the volleys instead. [Butter Socks](/passives/butter-socks) adds dash charges and makes this choice easier.
- **Don't try to slip through a ring while it stalls near the boss.** With 43 bullets per ring at 20:00, the gaps only become wide enough for Tibo once the ring is about 90 units out. Before the ring bursts, either back off or wait for it to pass.
- **Armor is weaker here.** Bosses count as 10 levels higher than the run time against [armor](/stats#armor), so the same armor blocks less of the Harvester's hits than of normal pests'. Avoiding hits matters more than tanking them.
- **For damage**, [Bacon Bits](/passives/bacon-bits) (+12% damage to elites and bosses per level) and [Boss Buster](/items/boss-buster) (+15%) apply to every hit on it. [Inferno Basket](/weapons/inferno-basket) deals double damage to bosses, but its cone is short, so Tibo has to stay close to a boss that hits hard on contact.
- Freeze effects such as [Frozen Fries](/weapons/frozen-fries) don't freeze bosses <small>[sim-SY4MKKFC.js: ``case`freeze`:r||(e.freezeT[t]=Math.max(e.freezeT[t],n.seconds*i))``]</small>, and the Harvester has more HP than anything else, so plan to whittle it down while dodging rather than to lock it in place.
