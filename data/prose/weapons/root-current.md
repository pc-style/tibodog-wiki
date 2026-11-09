## Overview

Root Current unites [Taproot Eruption](/weapons/taproot-eruption) and [Spud Grid](/weapons/spud-grid). Own both evolutions and open a [chest](/chests) to combine them and free a weapon slot. It clips three live wires with Tibo's base +1 Amount. Each wired target also gets a root eruption every second.

## How it works

- **Keep targets wired.** The wires deal 150 raw damage every 0.2 s, last 5 s × Duration (6.25 s with Tibo's base bonus), and snap beyond 210 units. Targets are acquired within 150 units. As with Spud Grid, unclipped bosses get priority; ordinary pests are pinned, but neither pests nor bosses get protection from death just for being wired. The shared [Potato Battery](/weapons/potato-battery) updater searches again from Tibo when an endpoint dies, retaining the remaining wire duration; with no replacement the wire disappears. The 0.3 s cooldown starts after all wires are gone. <small>[start-rows-D9s_TGPM.js: `` kind:`tether`,size:8,minRange:60,range:150,snap:210,hitInterval:.2,discharge:14,pin:.85,clipsBosses:!0 ``]</small>
- **Burst roots under the endpoint.** Each wire starts its root timer immediately, then repeats every second. A burst lands after 0.25 s at the endpoint sampled when it was created; it does not keep following the target during that delay. Its radius is `18 × Area`, or 28.8 at the union's base Area 1.6. <small>[sim-DZHQsQUT.js: `r.kind[i]=pe.strike,r.x[i]=n.x2[t],r.y[i]=n.y2[t],r.radius[i]=n.rootRadius[t]`]</small> <small>[start-rows-D9s_TGPM.js: `everySec:1,size:18,damageMult:2,delay:.25`]</small>
- **Hit twice with each eruption.** Every target caught receives a root hit for twice the wire's damage, then a zap for the wire's damage: 300 + 150 raw damage before bonuses. The root can throw ordinary pests back, but not bosses or pinned pests; the zap has no knockback. Normal wire zaps continue separately. Both attacks carry the wire's slow. <small>[sim-DZHQsQUT.js: `r.damage[i]=n.rootDamage[t],r.zap[i]=n.damage[t],r.status[i]=n.status[t]`]</small> <small>[sim-DZHQsQUT.js: `e.attack.kb=!Wl(n)&&Lp(e,n)?0:o,X(e,n)`]</small> <small>[sim-DZHQsQUT.js: `J(e,n.zap[t],n.src[t],n.slot[t],0)`]</small>
- **Finish with the discharge.** Releasing a wire still deals 14× wire damage in an 18-unit radius: 2,100 raw damage. That radius does not scale with Area. <small>[sim-DZHQsQUT.js: `J(e,n.discharge[t],n.src[t],n.slot[t],0),Y(e,r,i);let a=e.buf.weapon,o=G(e,r,i,18,a)`]</small>

**Controlled checks:** original engines `main-mEUYCZvr.js` → `main-B4LDNZMr.js`, Standard/Normal, seeds `s1/s2/s3`. Recipe fixtures test both partner orders, each missing partner and slot release. Original callbacks check the immediate root timer, either side of its one-second repeat boundary, and separate queued 300/150 hits. Supported 60-second combat retains the original optional rules; six existing weapons have identical old/new damage and kills in each seed, and Root Current deals damage in all three. Equipment grants, held level-ups, HP refills and supplied targets/clocks are fixtures, not natural acquisition, representative DPS or server acceptance.

## Tips

- **Keep a crowd near the wired target.** Roots hit everything around the endpoint, not just the clipped pest.
- **Stay within 210 units.** Snapping a wire gets its discharge but stops its repeating eruptions.
