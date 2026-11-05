## Overview

Stand Mixer is the evolution of [Whisk Vortex](/weapons/whisk-vortex). A chest evolves Whisk Vortex into it once Whisk Vortex is at max level and Tibo owns [Big Bowl](/passives/big-bowl) (see [Evolutions](/evolutions)). It casts clover-shaped whirlpools on crowds near Tibo, pulls pests in harder, and ends each whirlpool with a slam that hits everything gathered in it.

Its amount is 2, the same as a max-level Whisk Vortex. With Tibo's base +1 amount (see [Stats](/stats)) that is three whirlpools per cast, although the in-game text says “Two whirlpools”. Compared with a max-level Whisk Vortex (5 damage, 3.2 s cooldown, area 1.3, 3.25 s lifetime), Stand Mixer deals 7 damage per hit and hits every 0.2 s instead of every 0.25 s. It recasts every 2.8 s and searches for pests up to 150 units away instead of 130. Its whirlpools are larger (base radius 36 × area 1.3) and pull from farther away. They last 3.125 s (2.5 s plus Tibo's base +25% duration), slightly shorter than a max-level Whisk Vortex.

## How it works

Placement, damage ticks and pull work as described on [Whisk Vortex](/weapons/whisk-vortex#how-it-works). The differences:

- **Stronger pull.** The pull strength is 130 instead of 100, with a base radius of 70 instead of 60 (both radii scale with area). Bosses are still not pulled.
- **Slam.** When a whirlpool's lifetime runs out, it deals 3 × its damage to every pest within 1.2 × its radius. <small>[sim-Bgf_4bDZ.js: `e.attack.damage=n.damage[t]*n.slam[t],qo(e,n.x[t],n.y[t],1.2*n.radius[t])`]</small> The slam is an explosion, so unlike the pull it also hits bosses in range.

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): it cast 3 whirlpools 0.1 s apart every 2.8 s, each with radius 46.8 and a 3.125 s lifetime, ticking every 0.2 s; all 8 pests were hit. All three seeds gave the same figures.

## Tips

- The slam lands after the full 3.1 s of pulling, when the whirlpool holds the most pests. Area makes both the whirlpool and the slam radius larger.
- Extra amount from passives or items adds more whirlpools, and each one slams when it ends.
