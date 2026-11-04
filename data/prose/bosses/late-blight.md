## Overview

Late Blight is the fourth boss in the boss order and the 6:00 boss on the [wave schedule](/bosses#wave-schedule), between [The Masher](/bosses/the-masher) at 4:00 and [Sir Strawman](/bosses/sir-strawman) at 7:00. It is not part of the overtime cycle after 20:00, but a [Boss Lair](/points-of-interest#boss-lair) can wake it.

It has 2000 base HP, which is 1300 HP on Normal (boss HP ×0.65, see [Modes](/modes)), plus [curse](/curse). Contact damage is 16 before time scaling. At speed 26 it is the third-slowest boss, after [Ketchup Kraken](/bosses/ketchup-kraken) (22) and [Compost Titan](/bosses/compost-titan) (24), and well under Tibo's base speed of 62. Most of the danger comes from the ground it leaves behind.

It drops a [chest](/chests), an XP gem worth 80 XP and a 25-gold coin (both multiplied by the biome's XP and gold multipliers).

## Fight

Late Blight drifts towards Tibo, fires slow spirals, and every 4 s of walking stops to drop spore pools. A full cycle takes 5.2 s.

### Spore pools

Five clover-shaped pools of radius 26 are marked at once: one centred on Tibo and four at random spots 20–90 units from him. After 1.2 s each pool strikes for half of Late Blight's contact damage. It then stays on the ground for 5 s, hurting Tibo for 9 damage per second before scaling, in ticks every 0.5 s. <small>[sim-CrpXuTSY.js: `p=qu(e,Fa(e,a+D(d)*f,o+s(d)*f,i.radius,n.telegraph,.5*c),t)`]</small> <small>[sim-CrpXuTSY.js: `e.zones.afterLife[p]=i.poolTime,e.zones.afterDps[p]=i.poolDps*(c/n.damage)`]</small>

Pools last 5 s and a new set strikes every 5.2 s, so the old set fades only just before the new one lands.

Pool damage counts as ground-hazard damage. It ignores the dash's protection and cannot be dodged, though [armor](/stats#armor) still reduces it. <small>[sim-CrpXuTSY.js: `if(a.invuln[o]>0||a.stunTicks[o]>0||e.over||!r&&Ka(e))return!1;if(!r&&s.evasion>0&&e.rng.chance(s.evasion))`]</small> The strike itself is an ordinary hit that a dash or dodge can avoid.

### Blight spiral

Every 3.5 s of walking, after a 0.9 s warning, Late Blight fires a three-armed spiral: 10 bursts, 0.2 s apart, with each burst rotated further so the arms turn at 1.6 radians (about 92°) per second. The bullets are large (radius 3.5) but slow (speed 45) and deal 7 damage each before scaling. <small>[sim-CrpXuTSY.js: ``case`spiral`:return X.angle=s+a.spin*i.interval[t]*r+j*n/o``]</small> Bullet count grows with run time (see [Enemy bullets](/enemy-scaling#enemy-bullets)). At its 6:00 arrival the count multiplier rounds up to four arms, with bursts about 0.17 s apart and a new spiral every 3 s of walking.

### On Nightmare

[Nightmare](/modes#nightmare-rules) replaces the five random pools with a fixed "crop circle" around Tibo's position: a central pool of radius 30.5 and six pools of radius 18.1 evenly spaced on a ring 79.8 units out, at a random rotation. All of them strike together after 1.2 s and become 5 s pools, as above.

The Nightmare spiral bullets also curve sideways as they leave, turning by about 48° in total over their first 1.4 s, with the curve fading as they go.

## Tips

- **Leave the centre pool at once.** It is always on Tibo, so moving about 32 units (its radius plus his own size) during the 1.2 s warning avoids the strike. Look at where the other four landed before choosing a direction.
- **Don't dash through standing pools.** The dash only protects against hits, not the ticking pool damage, and neither does dodge from [Thick Skin](/passives/thick-skin) or [Ghost Skin](/items/ghost-skin). Walk around them.
- **Fight it in open ground.** Pools cover the area for nearly the whole cycle, so a long walk into fresh ground every few seconds is easier than staying in one spot.
- **The spiral rewards distance.** The bullets are slow, and the gap between arms widens as they travel. From further away there is more time to pick a lane between two arms.
- **On Nightmare, stand in the gap between the centre and the outer pools.** Counting Tibo's size, the ring from about 37 to 55 units out is clear of the central pool and the six outer ones. The outer pools also leave gaps of roughly 30 units between them.
- **Bring burst damage.** At 1300 HP on Normal it dies quickly to boss-damage bonuses such as [Bacon Bits](/passives/bacon-bits) or [Boss Buster](/items/boss-buster). A faster kill means fewer pool cycles to deal with.
