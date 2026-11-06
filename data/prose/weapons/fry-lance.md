## Overview

Fry Lance thrusts very long fries at the nearest pest, each hitting every pest along a 170-unit line at once. At level 1 it throws 2 lances (its raw amount of 1 plus Tibo's base +1 amount, see [Stats](/stats)), 0.15 s apart, every 2 s for 26 damage per pest, with no limit on how many pests in the line it hits. The lance is 6 units wide and appears for a moment before vanishing.

By level 8 it deals 68 damage, fires every 1.7 s, throws 3 lances 0.15 s apart (raw amount 2 plus 1), and is wider and longer (area 1.5). Fry Lance is one of the possible starting weapons of a standard run (see [Level-up](/level-up)) and is also offered on level-up cards (offer weight 80). At level 8, a chest opened while Tibo holds [Spud Sneakers](/passives/spud-sneakers) evolves it into [Railfry](/weapons/railfry).

## How it works

- **Trigger and aim**: it fires only when a pest is within 224 units (0.7 × the 320-unit play field), and aims at the nearest pest within 1.2 × the lance length. <small>[sim-B8UwV9Dw.js: `tT(e,1.2*n.length)+(i>0?s*Math.ceil(i/2)*.35:0)`]</small> If no pest is that close, it points the way Tibo faces.
- **Extra lances fan out**: the second lance of a volley is turned 0.35 rad (about 20°) to one side, the third 0.35 rad to the other, and so on, each re-aimed at the nearest pest when it fires.
- **Size**: length is `length × √area` and width is `size × area`, so area bonuses widen the lance faster than they lengthen it. <small>[sim-B8UwV9Dw.js: `l=n.length*Math.sqrt(r.area),u=n.size*r.area`]</small> At level 8 (area 1.5) the lance is about 208 units long and 9 wide.
- **Hits**: every pest whose body touches the line takes one hit; pierce is not used. `duration` (0.25 s) only sets how long the lance is drawn. <small>[sim-B8UwV9Dw.js: `e.effects.life[h]=Math.max(.12,r.duration)`]</small>

**Measured** in the headless sim (`tools/play.mjs`, build 41 `main-B2gf34bA.js`, Standard, Normal, god mode, seeds `s1`, `s2` and `s3`; the seeded starting weapon removed, the weapon given with `give`, spawning stopped after 4 s of play and the pests already on the field held at fixed spots with 10⁹ HP; Tibo standing still, facing right, with 8 pests in a line 20 to 90 units to his right): at level 1 the nearest pest was hit twice per firing, 0.15 s apart, and the other 7 pests in the line once (the second lance is turned off the line), every 2.4 s; at level 8 the nearest pest was hit 3 times per firing, every 2.1 s. All three seeds gave the same figures.

## Tips

- **Line pests up behind the nearest one.** Lances are strongest against pests that line up, such as a column chasing Tibo. Moving so the crowd is directly behind the nearest pest puts more of it on the line.
- Only the first lance of a volley aims at the target; the others go 20° or more off to the sides, so the extra lances are most useful against wide groups.
