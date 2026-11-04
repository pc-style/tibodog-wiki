## Overview

Fry Lance thrusts one very long fry at the nearest pest, hitting every pest along a 170-unit line at once. It fires every 2.4 s for 22 damage per pest, with no limit on how many pests in the line it hits. The lance is 6 units wide and appears for a moment before vanishing.

By level 8 it deals 57 damage, fires every 2.1 s, throws 2 lances 0.15 s apart, and is wider and longer (area 1.5). Fry Lance is one of the possible starting weapons of a standard run (see [Level-up](/level-up)) and is also offered on level-up cards (offer weight 80). At level 8, a chest opened while Tibo holds [Spud Sneakers](/passives/spud-sneakers) evolves it into [Railfry](/weapons/railfry).

## How it works

- **Trigger and aim**: it fires only when a pest is within 224 units (0.7 × the 320-unit play field), and aims at the nearest pest within 1.2 × the lance length. <small>[sim-CrpXuTSY.js: `hp(e,1.2*n.length)+(i>0?c*Math.ceil(i/2)*.35:0)`]</small> If no pest is that close, it points the way Tibo faces.
- **Extra lances fan out**: the second lance of a volley is turned 0.35 rad (about 20°) to one side, the third 0.35 rad to the other, and so on, each re-aimed at the nearest pest when it fires.
- **Size**: length is `length × √area` and width is `size × area`, so area bonuses widen the lance faster than they lengthen it. <small>[sim-CrpXuTSY.js: `u=n.length*Math.sqrt(r.area)`]</small> At level 8 (area 1.5) the lance is about 208 units long and 9 wide.
- **Hits**: every pest whose body touches the line takes one hit; pierce is not used. `duration` (0.25 s) only sets how long the lance is drawn. <small>[sim-CrpXuTSY.js: `Math.max(.12,r.duration)`]</small>

## Tips

- Lances are strongest against pests that line up, such as a column chasing Tibo. Moving so the crowd is directly behind the nearest pest puts more of it on the line.
- The level-4 second lance doubles hits per cycle but goes 20° off target, so it is most useful against wide groups.
