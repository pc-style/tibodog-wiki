## Overview

Spud Sneakers makes Tibo walk faster. Each level adds 8% move speed. Tibo's base speed is 62 units per second, so he walks at about 67 at level 1 and about 87 at level 5 (×1.4).

It is the catalyst for three evolutions: [Ghee Glide](/weapons/ghee-glide) (from [Butter Streak](/weapons/butter-streak)), [Railfry](/weapons/railfry) (from [Fry Lance](/weapons/fry-lance)) and [Salt Flats](/weapons/salt-flats) (from [Salt Line](/weapons/salt-line)).

## How it works

Walking speed is `62 × max(0.3, 1 + move speed)`, then multiplied by terrain, slows and the [Frenzy Fryer](/points-of-interest#frenzy-fryer) bonus.<small>[sim-NFTWJMcM.js: `g=e.cfg.player.baseSpeed*i.moveSpeedMult*n.terrainSlow[r]*h`]</small> Move speed does not change the dash, which always covers 48 units.

Dogs in the pack keep up: they run at 1.3 times Tibo's speed, at least 80 units per second.<small>[sim-NFTWJMcM.js: `i=Math.max(80,e.cfg.player.baseSpeed*e.loadout.stats.moveSpeedMult*1.3)`]</small>

Other move speed sources are [Starch Sock](/items/starch-sock) (+0.04), the auras of the dogs [Moss](/dogs/collie) and [Zoom](/dogs/greyhound), and [Spud Shrine](/points-of-interest#spud-shrine) blessings.

## Tips

- Several weapons work off distance walked, so walking faster makes them fire more often: [Tot Stampede](/weapons/tot-stampede) every 40 units and [Spud Fence](/weapons/spud-fence) every 60 units.
- [Tater Twirl](/weapons/tater-twirl) spins at a pace equal to Tibo's actual speed divided by the base 62, capped at 2.<small>[sim-NFTWJMcM.js: `i=60*w(n.x[r]-n.px[r],n.y[r]-n.py[r])/e.cfg.player.baseSpeed;return Math.max(t.crawl,Math.min(t.maxPace,i))`]</small> Walking at Spud Sneakers level 5 speed gives a pace of 1.4 instead of 1.
