## Overview

The Fryer King is the sixth boss. It arrives at 8:00 on the [wave schedule](/bosses#wave-schedule), together with a [Fry Fly Swarm](/events/fly-swarm) and a [Harvest Moon](/events/harvest-moon). It has 3300 base HP: about 2145 on Normal (boss HP ×0.65, see [Modes](/modes)) and 3135 on Nightmare before [curse](/curse). Nightmare starts every run with one curse, which adds 10% to boss HP, so there it actually has about 3449. <small>[intro-shared-CmFA0pXl.js: `startCurses:1,tierLag:2,wallPests:.6`]</small> <small>[sim-6hUEdZJv.js: `n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)`]</small> It walks at speed 30 and deals 22 contact damage.

It opens the post-20:00 rotation, so a long run meets it again at 21:00, 28:00 and every 7 minutes after that ([After 20:00](/bosses#after-20-00)), each time with much more HP. A [Boss Lair](/points-of-interest#boss-lair) can also wake it. It drops an XP gem worth 100, a 25-gold coin and a chest ([Chests](/chests)).

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`; the clock warped to 2 s before each minute and stepped across it; level-up offers taken first-in-order except Rotten Spud, so curse stays at the difficulty's start value): it spawned at exactly 8:00 on all four difficulties, with 1650 HP on Easy, 2145 on Normal, 2310 on Hard and 3448.5 on Nightmare. Seeds `s1` to `s4` gave the same Normal times and HP.

## Fight

The King walks towards Tibo. Every 3 s it stops to splash hot oil, and between splashes it fires rings of oil drops. One splash cycle takes 3.9 s: 3 s of walking plus the 0.9 s warning. The ring timer is paused while it splashes. <small>[sim-6hUEdZJv.js: `d===0?(Bx(e,o,s,c,l,u),zx(e,o,s,t)):d===1?Vx(e,o,s,t):Hx(e,o,s,t)`]</small>

### Oil splash

Four splat-shaped marks of radius 24 appear on the ground. The first is centred on Tibo; the other three land 20 to 80 units away in random directions. After 0.9 s each splat hits for half the King's contact damage (11 at base), then stays as a puddle of oil for 4 s. A puddle deals 12 damage per second at base, in ticks every 0.5 s, while Tibo stands in it. <small>[sim-6hUEdZJv.js: `f=u===0?0:e.rng.range(20,i.spread),p=Ix(e,oc(e,a+s(d)*f,o+E(d)*f,i.radius,n.telegraph,.5*c),t)`]</small> Puddle and splash damage grow with run time like the King's contact damage.

Puddle ticks are ground damage, and Tibo's dash does not block them. The game skips dash protection and dodge chance for this kind of damage; armor still reduces it. <small>[sim-6hUEdZJv.js: `if(a.invuln[o]>0||a.stunTicks[o]>0||e.over||!r&&bc(e))return!1`]</small>

### Oil rings

After a 0.9 s warning, the King fires a full ring of 18 drops at speed 95, 16 damage each, then a second ring 0.35 s later, rotated by half a gap. Enemy bullets scale with time ([Enemy scaling](/enemy-scaling#enemy-bullets)). At 8:00 each ring has 24 drops (18 × 1.32, rounded) moving at about 106, a new ring pair starts about every 2.4 s instead of every 3 s, and the two rings come about 0.28 s apart. <small>[sim-6hUEdZJv.js: `a.count[o]=Math.max(1,Math.round(t.count*f.bulletCount))`]</small>

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, seed `wiki`, standard mode, `--god`, Normal; the clock warped to just before 8:00; every other boss and every pest removed each tick, so the sim's hostile-shot counter only counts this boss): pairs of 24-drop rings 0.27 s apart, starting 2.35 s, 5.68 s, 9.00 s and 12.32 s after it spawned. Easy and Nightmare gave the same counts.

### Nightmare changes

On Nightmare the ring drops slow to 25% speed by 0.4 s, hang there until 0.85 s, then speed up to 150% by 1.15 s. The splash becomes six wedges around Tibo that strike in two sets, with oil puddles left only by the second set; see [the Nightmare ground attack](/bosses/fryer-king#nightmare-ground-attack) for the layout.

## Tips

- Leave the splat under Tibo straight away. It reaches about 30 units from its centre once Tibo's own size is counted, which takes about half a second at base move speed. Watch where the other three land so you do not walk into one.
- Walk around puddles rather than dashing through them: the dash does not stop the ticks.
- Puddles last 4 s and a new splash comes every 3.9 s, so the ground around the King is rarely clear. Leading the King into open ground before it splashes makes the next splashes easier to read.
- Near the King, the gaps between ring drops are narrower than Tibo's hit circle plus a drop. They only open further out. A dash (48 units with brief immunity to hits; see [Dash details](/controls#dash-details)) can carry Tibo across both rings of a pair, because they travel about 30 units apart.
- Armor reduces every hit including puddle ticks, so [Starch Plating](/passives/starch-plating) and [Baked Buckler](/items/baked-buckler) help more here than dodge chance, which puddles ignore.
