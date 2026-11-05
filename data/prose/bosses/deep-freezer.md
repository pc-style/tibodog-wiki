## Overview

The Deep Freezer is the ninth boss. It arrives at 14:00 on the [wave schedule](/bosses#wave-schedule), alongside a [Golden Scarab](/events/golden-scarab). It has 6200 base HP: about 4030 on Normal (boss HP ×0.65, see [Modes](/modes)) and 5890 on Nightmare, before any [curse](/curse). It is the last boss before the ×3 boss HP step at 16:00. It moves slowly (speed 28) and deals 24 contact damage.

It is not in the post-20:00 rotation; a [Boss Lair](/points-of-interest#boss-lair) can wake it. It drops an XP gem worth 150, a 25-gold coin and a chest ([Chests](/chests)). It has no Nightmare variants: its slam and shard fan are the same on every difficulty.

## Fight

The Freezer walks towards Tibo, fires a fan of ice shards, and every 3.4 s stops to slam the ground near him. A slam cycle lasts 4.3 s (3.4 s of walking plus a 0.9 s warning). The shard timer is paused during the slam. <small>[sim-HQr6OS1G.js: `d===0?(Uu(e,o,s,c,l,u),Hu(e,o,s,t)):d===1?Wu(e,o,s,t):Gu(e,o,s,t)`]</small>

### Triple slam

Three circles of radius 40 appear on the ground. The first is centred on Tibo; the other two are placed up to 70 units away in random directions. They strike one after another, at 0.9 s, 1.02 s and 1.14 s, each dealing the Freezer's contact damage (24 at base, growing with run time). <small>[sim-HQr6OS1G.js: `Fa(e,a+g(l)*c,o+u(l)*c,i.radius,n.telegraph+.12*s,e.bosses.damage[t])`]</small>

### Ice shard fan

Every 2.4 s at base, the Freezer aims at Tibo. After 0.8 s it fires nine shards spread over 1.4 radians (about 80°) at speed 110, 16 damage each. The shards on each side curve towards the line they were aimed along, turning 1 radian (about 57°) over their first second, then fly straight. A centre shard, when there is one, does not curve. <small>[sim-HQr6OS1G.js: `` case`fan`:return Math.sign(n-1-2*t) ``]</small> Because they turn that far, the shards cross the aim line and end up on the opposite side. The inner shards cross close to the Freezer and the outer ones further out.

A shard that hits Tibo also slows him to half move speed for 1.5 s. Further hits refresh the slow but do not stack it. The slow is applied even when the hit's damage is dodged or blocked. During a dash, shards pass through Tibo without hitting at all. <small>[sim-HQr6OS1G.js: `eo(e,n.damage[t],Cr(e,n.src[t]),!1,n.level[t])&&e.counters.hostileHits++;let r=e.statuses[n.status[t]]`]</small>

Enemy bullets scale with time ([Enemy scaling](/enemy-scaling#enemy-bullets)). At 14:00 the fan has 14 shards (9 × 1.56, rounded), so there is no centre shard. They launch at about 133 and a new fan starts about every 1.7 s.

## Tips

- The slam is easy to walk out of at full speed: Tibo needs to cover about 46 units from the centre of the first circle (its radius plus his body), and he does about 56 in 0.9 s. Watch the two random circles so you do not walk into one.
- The slow is what makes this boss dangerous. At half speed Tibo covers only about 28 units in 0.9 s, which is not enough to leave a circle. A dash still covers its full 48 units while slowed, so keep a dash charge for a slam that follows a shard hit. <small>[sim-HQr6OS1G.js: `let h=m>0?1-n.slowF[r]:1`]</small>
- The space straight in front of the Freezer is where the shards cross. Stepping well to one side of its aim, rather than backing straight away, keeps Tibo out of most paths.
- [Butter Socks](/passives/butter-socks) adds dash charges and shortens the dash cooldown, which helps with the slow-then-slam combination. [Ghost Pepper](/items/ghost-pepper) extends the protection after a dash.
- With 4030 HP on Normal, it is still worth having a strong single-target or boss-damage source by this point; [Bacon Bits](/passives/bacon-bits) and [Boss Buster](/items/boss-buster) raise damage against bosses. The next boss, [Grater Golem](/bosses/grater-golem), arrives after the ×3 HP step.
