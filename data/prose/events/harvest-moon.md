## Overview

Harvest Moon is a scheduled gold rush. The [wave table](/bosses) fires it at 8:00 and 15:00, in both cases together with a [Fry Fly Swarm](/events/fly-swarm). 8:00 also brings [The Fryer King](/bosses/fryer-king) and 15:00 an elite. It is not part of the rotation after 20:00. For 30 seconds every gold coin Tibo collects is worth twice as much. No enemies spawn from it.

[Loose Change](/events/loose-change) at the [Coin Laundromat](/biomes/coin-laundromat) is the same effect, lasting 20 seconds.

## How it works

- **Applied on pickup.** The ×2 applies when a coin is collected, on top of the gold gain stat. Coins dropped before the rush but picked up during it count double. Coins still on the ground when it ends don't. <small>[sim-FslaxQ7g.js: `let t=1*a*i.greedMult*(e.time<e.goldRushUntil?e.goldRushMult:1)`]</small>
- **No stacking.** A second gold rush sets the end time to whichever finishes later and sets the multiplier to its own value. Two rushes therefore extend the window rather than giving ×4. <small>[sim-FslaxQ7g.js: `e.goldRushUntil=Math.max(e.goldRushUntil,e.time+n.duration),e.goldRushMult=n.goldMult`]</small>
- **Always fires.** Other events are skipped when the enemy pool is full, but gold rushes skip that check. <small>[sim-FslaxQ7g.js: ``n.effect.kind!==`goldRush`&&!Va(e)``]</small>
- Coin values at drop time are on [Pickups](/pickups): pests drop 1 × the biome's gold multiplier, elites 10 ×, bosses 25 ×.

**Measured** (headless `tools/play.mjs`, build `main-B2gf34bA`, standard mode, `--god`, seed `wiki`; the clock warped to 2 s before each minute): Harvest Moon was announced at 8:00 and 15:00 on all four difficulties, on the same tick as a Fry Fly Swarm, and at no other minute up to 25:00 on Normal. The only pests spawned on that tick were the swarm's 26 flies and ordinary wave pests.

## Tips

- The window is a good moment to collect coins you left lying around. A Magnet pickup, a [Tater Magnet](/points-of-interest#tater-magnet) or a Tidy [Grok Bot](/grok-bots) pulls them in quickly.
- If you can kill The Fryer King at 8:00 within the 30 seconds, its 25-gold coin counts double.
