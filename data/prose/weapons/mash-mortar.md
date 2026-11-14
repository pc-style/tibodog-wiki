## Overview

Mash Mortar places stationary mortars that fire explosive globs at nearby pests. Bring [Big Bowl](/passives/big-bowl) and level the mortar to 8 to prepare its evolution, [Pestle Barrage](/weapons/pestle-barrage); the usual [chest evolution gates](/chests) still apply.

## Starting with Mash Mortar

A full three-piece Pack Ranger set can add Mash Mortar to the summon-class Open World starter pool. It is eligible, not guaranteed on every seed; explicit picks or kits can take precedence. Pack Ranger Dailies add it only from **20 November 2026 UTC** (day 20777), not the journal's earlier publication date. See [Mash Mortar starts](/modes#mash-mortar-starts) for the selection rules and original-engine control limits. <small>[sim-rGD56OmB.js: `wS={"hash-hawk":20769,"mash-mortar":20777}`]</small>

## How it works

- Each drop places mortars rather than firing that many globs. Raw Amount starts at 1; Tibo's built-in +1 makes two mortars before other bonuses. Raw cooldown is 8 s and duration is 7 s, before global stats.
- A mortar targets the nearest pest within 170 units and fires at a raw interval of 1.4 s. Its projectiles keep the turret path's 1.2-second lifetime, not the mortar's duration.
- Globs carry a burst radius of 24 × the weapon's current Area. This weapon is summon-class even though its projectiles explode. <small>[sim-rGD56OmB.js: `` c.kind===`turret`&&c.explodeRadius!==void 0 ``]</small><small>[sim-rGD56OmB.js: `e.projectiles.explodeRadius[h]=c.explodeRadius*vj.area`]</small>

## Tips

- **Circle back through your mortars.** They stay where placed; running far away leaves their firing range behind.
- Area widens the glob's burst. Big Bowl also supplies the evolution catalyst; it does not evolve the weapon by itself.
