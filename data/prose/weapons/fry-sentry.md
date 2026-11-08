## Overview

Fry Cook Sentry drops small fry-cook turrets next to Tibo. Each turret stays where it lands, shoots the nearest pest within 150 units, and disappears when its timer runs out. Tibo does not have to aim or stay close; the turrets work on their own while he moves on.

In Standard runs it is one of the weapons Tibo can start with: when no starting kit is set, the run picks one from the game's `player.startWeapons` list using the run seed. Otherwise it is offered as a level-up card. At level 8, holding [Slow Cooker](/passives/slow-cooker), a [chest](/chests) can evolve it into [Fry Fortress](/weapons/fry-fortress). Fry Fortress then unites with [Gravy Pack](/weapons/gravy-pack) into [Fry Brigade](/weapons/fry-brigade). The pups plant fry turrets as they follow Tibo, and the union frees a weapon slot (see [Evolutions](/evolutions#unions)).

## How it works

- **Drop.** Every cooldown, the sentry places Amount turrets at once, each 18 units from Tibo in a random direction. Unlike most weapons, Amount here means turrets per drop, not shots. The drop happens even when no pest is nearby. Tibo's built-in +1 amount (see [Stats](/stats#stat-conversion)) means 2 turrets per drop at level 1, rising to 4 at level 8.
- **Lifetime.** Each turret lasts the weapon's Duration multiplied by Tibo's duration stat, which includes a base +25%. With no duration bonuses, at level 1 that is 6.25 s against a 6 s cooldown, so successive drops can overlap. At level 8 it is 6.875 s against 4.8 s. Base damage is 7, rising to 24 at level 8.
- **Shooting.** A turret fires one bolt at the nearest pest within 150 units every Interval (0.35 s). The bolt has 0 base pierce, so it stops at the first pest unless Tibo has pierce bonuses, and it always lives 1.2 s, whatever the weapon's Duration. With no pest in range, the turret holds its fire and keeps checking.<small>[sim-CUTgHmYT.js: `let f=s?Math.max(.1*Fx(e),Vk.interval):Vk.cooldown`]</small>
- Turrets read the weapon's current stats each time they fire, so a level-up or a new passive also affects turrets that are already on the ground.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; one pest held 60 units to Tibo's right): at level 1 every 7 s it placed 2 turrets at once; one of each pair lasted 375 ticks (6.25 s) and the other 359. At level 8 it placed 4 every 5.8 s, lasting 412 ticks (6.875 s). Turret bolts spawned with a 1.2 s lifetime. All three seeds gave the same figures.

## Tips

- **Hold one spot to use the turrets.** Turrets do not follow Tibo. They work best when you fight near one spot, for example while you hold a chokepoint or wait out a boss. When you kite in long lines, you leave them behind.
- Duration raises turret uptime directly. [Slow Cooker](/passives/slow-cooker) keeps each turret alive longer; [Chives](/passives/chives) makes successive drops overlap more.
