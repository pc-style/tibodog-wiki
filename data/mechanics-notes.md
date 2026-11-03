# tibo.dog game mechanics (from deployed JS)

Build: main-D3tdcOXz.js, boot-DIJlLGwy.js, sim-DQNACfZS.js (downloaded 2026-11-02). Every claim cites a chunk file and a verbatim minified quote (``like this``, at most 200 chars). Each claim is labelled **Verified** (read directly from code/config) or **Inferred** (our reading; not proven by code). Numbers marked "computed" were calculated by us from the cited formula. Minified identifiers (e.g. `Ee`, `Rr`) are build-specific and will change between builds.


## 1. Formulas

The sim runs at 60 ticks per second; second-valued config is converted with `round(60*sec)`. Verified. [boot-DIJlLGwy.js: ``function v(e){return _(Math.round(60*e))}``]

### XP needed per level
- XP needed to go from level L to L+1 = `round(xpFirst + xpLinear*(L-1) + xpCurve*(L-1)^xpExponent)` = `round(5 + 5(L-1) + (L-1)^2.5)`. Verified. [sim-DQNACfZS.js: ``function ot(e,t){let n=Math.max(0,t-1);return Math.round(e.xpFirst+e.xpLinear*n+e.xpCurve*xe(n,e.xpExponent))}``]
- Values (computed from the formula): L1→2: 5, L2→3: 11, L3→4: 21, L4→5: 36, L5→6: 57, L10: 293, L20: 1674, L30: 4679, L40: 9699, L50: 17057. Verified formula, values computed by us.
- Picked-up XP is multiplied by the `growthMult` stat; extra levels queue up as pending level-ups. Verified. [sim-DQNACfZS.js: ``o===D.xp)e.gemCount--,e.counters.gems++,Ci(e,a*i.growthMult)``] [sim-DQNACfZS.js: ``n.xp-=n.xpNext,n.level++,n.xpNext=ot(e.cfg.levelUp,n.level),n.pendingLevels++``]

### Stat derivation (all passives, items, dog auras, shrine picks summed, then converted)
All raw stat totals are summed (passives `perLevel*level`, items `mods*count`, dog auras, shrine totals) and turned into final multipliers by one function. Verified. [sim-DQNACfZS.js: ``for(let e of this.passives)n[e.def.stat]+=xt(e.def.perLevel,e.level)``] [sim-DQNACfZS.js: ``for(let e of ht)n[e]+=this.shrineTotals[e]``]
- Damage: `max(0.1, 1+might)`. Area: `max(0.2, 1+area)`. Projectile speed `max(0.2, 1+speed)`. Move speed `max(0.3, 1+moveSpeed)`. Verified. [sim-DQNACfZS.js: ``i[r.damageMult]=Math.max(.1,1+e.might),i[r.areaMult]=Math.max(.2,1+e.area)``]
- Duration: `max(0.2, 1 + duration + 0.25)` (player.baseDuration = 0.25, so base duration multiplier is 1.25). Verified. [sim-DQNACfZS.js: ``i[r.durationMult]=Math.max(.2,1+e.duration+t.player.baseDuration)``]
- Amount: `floor(amount) + 1` (baseAmount 1). Not applied to aura, cone, nuke and ring weapons. Verified. [sim-DQNACfZS.js: ``i[r.amountBonus]=Math.floor(e.amount)+t.player.baseAmount``] [sim-DQNACfZS.js: ``return e!==`aura`&&e!==`cone`&&e!==`nuke`&&e!==`ring```]
- Max HP: `max(1, (100 + maxHp) * (1 + maxHpPct) * difficulty.maxHp)`. Verified. [sim-DQNACfZS.js: ``i[r.maxHp]=Math.max(1,(t.player.baseMaxHp+e.maxHp)*(1+e.maxHpPct)*t.level.maxHp)``]
- Pierce bonus `floor(pierce)`, knockback `max(0, 1+knockback)`, elite damage `1+eliteDamage`. Verified. [sim-DQNACfZS.js: ``i[r.knockbackMult]=Math.max(0,1+e.knockback),i[r.pierceBonus]=Math.floor(e.pierce)``]

### Cooldown cap
- Cooldown multiplier = `1 - clamp(cooldown, -1, 0.6)`, so cooldown reduction is capped at 60% (multiplier floor 0.4). Same cap for dash cooldown. Verified. [sim-DQNACfZS.js: ``i[r.cooldownMult]=1-we(e.cooldown,-1,n.cooldownCap)``] [sim-DQNACfZS.js: ``cooldownCap:.6``]
- A weapon's final cooldown never drops below 0.05 s (15 s for `nuke` weapons, `reset.minCooldownSec`), and that floor is multiplied by the Frenzy Fryer rate. Verified. [sim-DQNACfZS.js: ``let o=(a===`nuke`?e.cfg.reset.minCooldownSec:.05)*Xa(e);return n.cooldown=i.cooldown<=0?0:Math.max(o,i.cooldown*r.cooldownMult)``]

### Diminishing-returns stats (crit chance, evasion, explode-on-kill, chest discount)
- Helper `Ee(x,k) = x/(k+x)` (0 for x ≤ 0). Verified. [sim-DQNACfZS.js: ``function Ee(e,t){return e<=0?0:e/(t+e)}``]
- Effective crit chance = `critChance/(1+critChance)`; evasion = `evasion/(1+evasion)`; explode-on-kill chance = `x/(1+x)`; chest price multiplier = `1 - chestDiscount/(1+chestDiscount)` (all K constants = 1). Verified. [sim-DQNACfZS.js: ``i[r.critChance]=Ee(e.critChance,n.critK),i[r.critMult]=n.baseCritMult+e.critDamage,i[r.evasion]=Ee(e.evasion,n.evasionK)``] [sim-DQNACfZS.js: ``i[r.chestPriceMult]=1-Ee(e.chestDiscount,n.discountK)``]
- Example (computed): +0.10 raw crit chance gives 9.1% effective; +1.0 gives 50%.

### Crit
- On each hit, crit chance = effective crit chance + the weapon's own `critBonus`; on crit damage is multiplied by `critMult = 2 + critDamage`. Verified. [sim-DQNACfZS.js: ``let s=o.critChance+a.critBonus[r];s>0&&e.rng.next()<s&&(l*=o.critMult,u=!0)``]
- Elite/boss hits are also multiplied by `eliteMult` (1+eliteDamage) before crit. Verified. [sim-DQNACfZS.js: ``if((i||t.has(n,x.Elite))&&(l*=o.eliteMult*a.eliteMult[r])``]

### Evasion
- When the player would take damage, evasion is rolled right after the invulnerability checks; a success cancels the hit entirely (a `dodge` event). Damage flagged as unavoidable (biome terrain, hazard pools) skips the roll. Verified. [sim-DQNACfZS.js: ``if(!r&&s.evasion>0&&e.rng.chance(s.evasion))return function(e){e.recordEvents&&F(e,{type:`dodge`})}(e),!1``]

### Armor
- Damage taken = `damage * (1 - min(0.85, armor / (5*attackerLevel + armor)))`. Verified. [sim-DQNACfZS.js: ``function Rr(e,t,n){let r=n.armor;return Math.min(r.cap,Ee(e,r.k*t))}``] [sim-DQNACfZS.js: ``let u=l*(1-Rr(s.armor,i,e.cfg))``]
- Attacker level = `10 + floor(runMinutes * 1)`; elites +5, bosses +10. Enemy bullets and ground telegraphs use the same time-based level. Verified. [sim-DQNACfZS.js: ``function Lr(e,t){let n=e.armor;return n.firstLevel+Math.floor(t/60*n.levelsPerMinute)}``] [sim-DQNACfZS.js: ``n.level[r]=Lr(o=e.cfg,e.runClock)+o.armor.bossLevels``]
- Example (computed): 50 armor vs a level-10 pest (minute 0) = 50/(50+50) = 50% reduction; vs a level-30 pest (minute 20) = 50/200 = 25%.
- A `guard` weapon with active charges absorbs (`soak`) damage before armor. Verified. [sim-DQNACfZS.js: ``if(!(i.kind!==`guard`||r.active<1))return r.active--,r.counter++,Xe(e),i.soak``]

### Curse
- Curse stat = summed curse + `difficulty.globalCurse` (0). Verified. [sim-DQNACfZS.js: ``i[r.curse]=Math.max(0,e.curse)+t.difficulty.globalCurse``]
- Rewards: XP gain and gold gain are each multiplied by `1 + 0.5*curse` (curseRewardShare). Verified. [sim-DQNACfZS.js: ``i[r.greedMult]=(1+e.greed)*(1+n.curseRewardShare*Math.max(0,e.curse))``]
- Pests: HP ×(1+curse), speed ×(1+0.3·curse). Verified. [sim-DQNACfZS.js: ``e.scratch.hp=t.hp*(1+n)``] [sim-DQNACfZS.js: ``e.scratch.speed=t.speed*(1+.3*n)``]
- Crowd: the alive-enemy ceiling, the minimum crowd and the spawn timer rate are each ×(1+curse) (ceiling still capped at spawns.maxEnemies = 500). Verified. [sim-DQNACfZS.js: ``d=Math.min(e.cfg.spawns.maxEnemies,Math.round(u*e.cfg.spawns.ceilingScale*l.count*(1+s)))``] [sim-DQNACfZS.js: ``n.spawnTimer-=t*l.rate*(1+s)*ls.density``]
- Elites and bosses: HP ×(1+curse). Verified. [sim-DQNACfZS.js: ``let o=r.hp*t.hpMult*(1+e.loadout.stats.curse)*i.hpPost*e.cfg.level.eliteHp``]
- Curses *taken* (a counter, separate from the curse stat; +1 per Moldy Shrine accepted, +1 per Nightmare start curse) add extra copies: every elite spawn adds `floor(cursesTaken * 1)` extra elites, every boss spawn adds `floor(cursesTaken * 0.5)` extra bosses. Verified. [sim-DQNACfZS.js: ``function Ba(e,t){return Math.floor(t*e.extraElitesPerCurse)}function Va(e,t){return Math.floor(t*e.extraBossesPerCurse)}``]
- Extra (cursed) elites/bosses each drop `chestsPerCursedExtra` = 1 chest. Verified. [sim-DQNACfZS.js: ``function Qs(e,t,n){return t.has(n,x.Chest)?t.has(n,x.CursedExtra)?Ha(e.cfg.difficulty):1:0}``]
- Game UI wording: "Curse makes enemies tougher, faster and more numerous, and raises XP and gold." Verified. [choices-7yGAe9Ru.js: ``Curse makes enemies tougher, faster and more numerous, and raises XP and gold.``]

### Luck
- 4th level-up card: chance = `min(1, luck / 1)`. Verified. [sim-DQNACfZS.js: ``return t.baseChoices+ +(e.lootRng.next()<Math.min(1,e.loadout.stats.luck/t.luckForFourthChoice))``]
- Item rarity: weights `[59,25,10,4,2]` (Common..Legendary) with weight of rarity n multiplied by `(1+luck)^n`. Verified. [sim-DQNACfZS.js: ``e.cfg.economy.rarityWeights.map((e,n)=>e*se(1+t,n))``]
- Chest size: 5 rewards if roll < 0.02·(1+luck); 3 rewards if roll < 0.20·(1+luck); else 1. Verified. [sim-DQNACfZS.js: ``return r<t.chanceFive*n?5:r<(t.chanceFive+t.chanceThree)*n?3:1``]
- Game UI wording: "Better odds of a fourth level-up card, bigger chests and rarer items." Verified. [deferred-ui-BYWEYMjM.js: ``Better odds of a fourth level-up card, bigger chests and rarer items.``]

### Greed (gold gain)
- Every gold pickup is worth `value * greedMult` (×2 during a gold-rush event). Verified. [sim-DQNACfZS.js: ``let t=1*a*i.greedMult*(e.time<e.goldRushUntil?e.goldRushMult:1)``]
- Chest gold: `random(12..30) * rewardCount * greedMult * goldScale`, where goldScale = `min(2, 1 + 0.05*runMinutes)` for boss and elite chests, else 1. Verified. [sim-DQNACfZS.js: ``let s=Math.round(e.lootRng.range(it[0],it[1])*n*e.loadout.stats.greedMult*a)``] [sim-DQNACfZS.js: ``return Math.min(n.goldCap,1+n.goldPerMinute*(e.runClock/60))``]

### Growth
- `growthMult = (1+growth) * (1+0.5*curse) * difficulty.xp`. Verified. [sim-DQNACfZS.js: ``i[r.growthMult]=(1+e.growth)*(1+n.curseRewardShare*Math.max(0,e.curse))*t.level.xp``]

### Magnet (pickup range)
- Pickup radius = `40 * max(0.2, 1+magnet)`. Gems, coins and other small pickups inside it fly to the player at 300 units/s; chests and items are never magnetised (you stand on them to open). Verified. [sim-DQNACfZS.js: ``i[r.magnetRadius]=t.player.baseMagnet*Math.max(.2,1+e.magnet)``] [sim-DQNACfZS.js: ``let f=!rc(d),p=r-l,m=i-u,h=p*p+m*m;if(n.vacuum[o]===1||f&&h<s)``]

### Recovery
- Heals `recovery` HP per second, capped at max HP. Verified. [sim-DQNACfZS.js: ``i.recovery>0&&Si(e,i.recovery*t)``] [sim-DQNACfZS.js: ``n.hp[e.me]=Math.min(e.loadout.stats.maxHp,n.hp[e.me]+t)``]
- Heal on kill: `healOnKill` HP per kill. Verified. [sim-DQNACfZS.js: ``let i=e.loadout.stats.healOnKill;i>0&&Si(e,i)``]

### Revivals
- Revives available = `floor(revival) + difficulty.addedRevives` (0 if the difficulty disallows revives). Verified. [sim-DQNACfZS.js: ``i[r.revivals]=t.level.allowRevives?Math.floor(e.revival)+t.level.addedRevives:0``]
- On death with a revive left: revive at 50% max HP, 2 s invulnerability, enemies within 120 are knocked back. Verified. [sim-DQNACfZS.js: ``t.revivesUsed++,e.run.revivesUsed++,n.hp[e.me]=.5*t.stats.maxHp,n.invuln[e.me]=2``]
- On difficulties without revives, items whose only mod is `revival` (Second Spud) are removed from the item pool. Verified. [sim-DQNACfZS.js: ``function Ii(e){return e.level.allowRevives?c.items:Fi}``]

### Enemy scaling over time
From `Br(scale, cfg, runClock)`; `a` = min(minutes, 20), `o` = overtime minutes past 20:00 (+ difficulty overtimeHoldSec). Verified. [sim-DQNACfZS.js: ``function zr(e,t){return Math.max(0,(t-e.win.timeSec-e.level.overtimeHoldSec)/60)}``]
- Pest HP multiplier = `(1 + 0.03a + 0.009a²) * 4^o * difficulty.pestHp`. At 20:00 that is 1 + 0.6 + 3.6 = 5.2×; after 20:00 it multiplies by 4 every further minute. Verified. [sim-DQNACfZS.js: ``e.hp=(1+r.hpLinearPerMin*a+r.hpQuadraticPerMin*a*a)*s*t.level.pestHp,e.hpPost=s``]
- Pest damage multiplier = `(1 + 0·a + 0.0025a²) * 4^o * early * late * difficulty.damage`, where `early` ramps linearly from 0.4 at 0:00 to 1.0 at 15:00, and `late` = `1 + 0.2*max(0, a-15)`. Verified. [sim-DQNACfZS.js: ``let c=n<r.earlyDamageFullAtSec?r.earlyDamageStart+(1-r.earlyDamageStart)*n/r.earlyDamageFullAtSec:1``]
- Overtime only (after 20:00): enemy speed ×1.15^o (max 2.2×), count ×1.5^o, spawn rate ×1.5^o. Verified. [sim-DQNACfZS.js: ``e.speed=Math.min(r.maxSpeedMult,xe(r.speedPerMin,o)),e.count=xe(r.countPerMin,o),e.rate=xe(r.spawnRatePerMin,o)``]
- Enemy bullets: count ×(1+0.04/min, max 2.5), fire rate ×(1+0.03/min, max 2.2), speed ×(1+0.015/min, max 1.6), based on total run minutes. Verified. [sim-DQNACfZS.js: ``e.bulletCount=Math.min(r.maxBulletCountMult,1+r.bulletCountLinearPerMin*u)``]
- Elite and boss HP use the overtime factor `hpPost` (4^o) but not the pre-20 pest curve; see section 7. Verified. [sim-DQNACfZS.js: ``n.maxHp[r]=i.hp*t.hpMult*(1+e.loadout.stats.curse)*a.hpPost``]

### Chest (Potato Crate) price
- Price of the n-th paid crate (n = crates bought so far, starting at 0) = `round(round(30 + 41.5n + 0.5n² + 0.898*max(0,n-3)³) * chestPriceMult)`. Verified. [sim-DQNACfZS.js: ``Math.round(n.chestPriceBase+n.chestPriceLinear*t+n.chestPriceQuad*t*t+n.chestPriceCubic*se(Math.max(0,t-n.chestPriceKnee),3))``]
- Computed base prices before discount: 30, 72, 115, 159, 205, 257, 321, 402, 506, 638 (n = 0..9).
- Tater Slots spin price = `ceil(crate price * 0.5)`. Verified. [sim-DQNACfZS.js: ``function wo(e){return Math.ceil(ki(e)*e.cfg.taterSlots.priceFraction)}``]

### Item power per minute
- `items.powerPerMinute = 0.15` is used in exactly one place: projectiles fired by `onHurt` item procs deal `damage * damageMult * (1 + 0.15*runMinutes)` (+ a thorns share). Verified. [sim-DQNACfZS.js: ``c=n.damage*function(e){let t=e.cfg.items.powerPerMinute;return e.loadout.stats.damageMult*(1+t*e.runClock/60)}(e)+n.thornsShare*i.thorns*i.damageMult``] [sim-DQNACfZS.js: ``i.kind!==`onHurt`||e.tick<r.readyAt||(r.readyAt=e.tick+re(i.cooldown),Us(e,r,i.proc))``]

### hpEdge (low-HP bonus)
- Only `slash` weapons with an `hpEdge` field (Mezzaluna lowHpBonus 1.2, Moon Cleaver 1.6). Damage multiplier = `0.8 + (lowHpBonus + 0.2) * missingHpFraction`: 0.8× at full HP, up to (1+lowHpBonus)× near 0 HP. Verified. [sim-DQNACfZS.js: ``let n=1-we(e.player.hp[e.me]/e.loadout.stats.maxHp,0,1),r=e.cfg.hpEdge.fullHpPenalty;return 1-r+(t.hpEdge.lowHpBonus+r)*n``]

## 2. Stats, mods, effects, behaviors

Full machine-readable mapping: `labels.json`. Passive stats and item mods share one stat table: passives add `perLevel × level` (or the per-level array value at that level), items add `mods × copies`, dog auras and shrine picks add too, then the totals are converted (section 1). Verified. [sim-DQNACfZS.js: ``for(let[e,t]of this.items)gt(n,{mods:c.item(e).mods,times:t})``] [sim-DQNACfZS.js: ``function xt(e,t){return t<=0?0:typeof e==`number`?e*t:e[Math.min(t,e.length)-1]??0}``]
In-game short names come from the stats/dog-aura label switch (dog-level chunk; the 11 shrine stats reuse `content.shrine.*.label`), tooltips from deferred-ui. Verified. [dog-level-DtjeDJwC.js: ``case`speed`:return e._({id:`dsbK5U`,message:[`Projectile speed`]})``] [deferred-ui-BYWEYMjM.js: ``case`growth`:return e._({id:`aPdxfP`,message:[`Extra XP from every gem.`]})``]

### Stat keys (passive `stat` and item `mods`)

| Key | Game label | Game tooltip | What it does (Verified, see quote) |
|---|---|---|---|
| `might` | Damage | Raises the damage of every weapon. | Final damage multiplier = max(0.1, 1 + might). [sim-DQNACfZS.js: ``i[r.damageMult]=Math.max(.1,1+e.might)``] |
| `area` | Area | Makes attacks and blasts bigger. | Area multiplier = max(0.2, 1 + area); radius-type effects (item blasts, chains) scale by sqrt(areaMult). [sim-DQNACfZS.js: ``function Ns(e){return Math.sqrt(e.loadout.stats.areaMult)}``] |
| `cooldown` | Cooldown | Shortens the wait between weapon attacks. | Cooldown multiplier = 1 - clamp(cooldown, -1, 0.6); max 60% reduction. [sim-DQNACfZS.js: ``i[r.cooldownMult]=1-we(e.cooldown,-1,n.cooldownCap)``] |
| `amount` | Amount | Extra shots or pieces for each weapon. | +floor(amount) extra projectiles per attack (base +1 from player.baseAmount); not used by aura, cone, nuke, ring weapons. [sim-DQNACfZS.js: ``i[r.amountBonus]=Math.floor(e.amount)+t.player.baseAmount``] |
| `duration` | Duration | Makes weapon effects last longer. | Duration multiplier = max(0.2, 1 + duration + 0.25 base). Also lengthens freeze/slow/burn statuses. [sim-DQNACfZS.js: ``i[r.durationMult]=Math.max(.2,1+e.duration+t.player.baseDuration)``] |
| `speed` | Projectile speed | Makes Tibo's shots fly faster. | Projectile speed multiplier = max(0.2, 1 + speed); orbit weapons get half the bonus. [sim-DQNACfZS.js: ``n.speed=i.speed*(a===`orbit`?1+.5*(r.projSpeedMult-1):r.projSpeedMult)``] |
| `moveSpeed` | Move speed | How fast Tibo walks. | Move speed = 62 × max(0.3, 1 + moveSpeed) × terrain/slow/frenzy factors. [sim-DQNACfZS.js: ``i[r.moveSpeedMult]=Math.max(.3,1+e.moveSpeed)``] |
| `maxHp` | Max HP | The most HP Tibo can have. | Flat max HP added to the base 100. [sim-DQNACfZS.js: ``i[r.maxHp]=Math.max(1,(t.player.baseMaxHp+e.maxHp)*(1+e.maxHpPct)*t.level.maxHp)``] |
| `maxHpPct` | (none found) | (none found) | Percent max HP: (100 + maxHp) × (1 + maxHpPct). No stats-panel label found in the label switch (not determined). [sim-DQNACfZS.js: ``(t.player.baseMaxHp+e.maxHp)*(1+e.maxHpPct)``] |
| `recovery` | Recovery | HP Tibo regains each second. | HP regenerated per second. [sim-DQNACfZS.js: ``i.recovery>0&&Si(e,i.recovery*t)``] |
| `armor` | Armor | Cuts the damage Tibo takes from each hit. Enemies get stronger each minute, so the cut shrinks, and elites and bosses get through more. | Damage taken × (1 - min(0.85, armor/(5×attackerLevel + armor))); attacker level 10 + 1/min, elites +5, bosses +10. [sim-DQNACfZS.js: ``function Rr(e,t,n){let r=n.armor;return Math.min(r.cap,Ee(e,r.k*t))}``] |
| `magnet` | Pickup range | How far away Tibo pulls in gems, gold and snacks. | Pickup radius = 40 × max(0.2, 1 + magnet). [sim-DQNACfZS.js: ``i[r.magnetRadius]=t.player.baseMagnet*Math.max(.2,1+e.magnet)``] |
| `luck` | Luck | Better odds of a fourth level-up card, bigger chests and rarer items. | 4th card chance = min(1, luck); item rarity weights × (1+luck)^rarity; 3/5-reward chest odds × (1+luck). [sim-DQNACfZS.js: ``Math.min(1,e.loadout.stats.luck/t.luckForFourthChoice)``] |
| `growth` | XP gain | Extra XP from every gem. | XP multiplier = (1+growth) × (1 + 0.5×curse) × difficulty xp. [sim-DQNACfZS.js: ``i[r.growthMult]=(1+e.growth)*(1+n.curseRewardShare*Math.max(0,e.curse))*t.level.xp``] |
| `greed` | Gold gain | Extra gold from every coin and chest. | Gold multiplier = (1+greed) × (1 + 0.5×curse); applies to coins, chest gold, shrine gold, Poteto gold. [sim-DQNACfZS.js: ``i[r.greedMult]=(1+e.greed)*(1+n.curseRewardShare*Math.max(0,e.curse))``] |
| `curse` | Curse | Curse makes enemies tougher, faster and more numerous, and raises XP and gold. | Enemy HP ×(1+curse), pest speed ×(1+0.3curse), crowd size and spawn rate ×(1+curse), XP/gold ×(1+0.5curse). [sim-DQNACfZS.js: ``e.scratch.speed=t.speed*(1+.3*n)``] |
| `critChance` | Crit chance | The chance that a hit is critical. | Effective crit chance = x/(1+x), plus the weapon's own critBonus. [sim-DQNACfZS.js: ``i[r.critChance]=Ee(e.critChance,n.critK)``] |
| `critDamage` | Crit damage | How much a critical hit multiplies damage. | Crit multiplier = 2 + critDamage. [sim-DQNACfZS.js: ``i[r.critMult]=n.baseCritMult+e.critDamage``] |
| `evasion` | Evasion | The chance to dodge a hit. | Dodge chance = x/(1+x); a dodge cancels the hit. [sim-DQNACfZS.js: ``i[r.evasion]=Ee(e.evasion,n.evasionK)``] |
| `knockback` | Knockback | How far hits push enemies back. | Knockback multiplier = max(0, 1 + knockback); push = weapon kb × mult × (1 - enemy mass) × 70. [sim-DQNACfZS.js: ``d=o*e.loadout.stats.knockbackMult*(1-s)*70``] |
| `pierce` | Pierce | Extra enemies each shot passes through. | +floor(pierce) enemies each projectile passes through. [sim-DQNACfZS.js: ``i[r.pierceBonus]=Math.floor(e.pierce)``] |
| `revival` | Revival | How many times Tibo gets back up when his HP runs out. | Extra lives: floor(revival) + difficulty bonus; revive at 50% HP with 2 s invulnerability. [sim-DQNACfZS.js: ``n.hp[e.me]=.5*t.stats.maxHp,n.invuln[e.me]=2``] |
| `eliteDamage` | Elite damage | Extra damage to elites and bosses. | Damage to elites and bosses × (1 + eliteDamage). [sim-DQNACfZS.js: ``i[r.eliteMult]=1+e.eliteDamage``] |
| `healOnKill` | Heal on kill | HP Tibo regains for each kill. | Heals this many HP per kill. [sim-DQNACfZS.js: ``let i=e.loadout.stats.healOnKill;i>0&&Si(e,i)``] |
| `explodeOnKill` | Explode on kill | The chance that a defeated enemy explodes. | Chance x/(1+x) that a killed pest explodes for 20 × damage multiplier in radius 22. [sim-DQNACfZS.js: ``Y(e,20*n.damageMult,R(e,`boom-spud`,Zt(`boom-spud`)),-1,1),vi(e,a,o,22)``] |
| `thorns` | Thorns | Damage dealt back to an enemy that touches Tibo. | Flat damage dealt to an enemy each time its body touches Tibo (contact hit); also adds to guard-weapon shard bursts and onHurt quills. [sim-DQNACfZS.js: ``s<=0||(Y(e,s,R(e,`thorny-jacket`,Zt(`thorny-jacket`)),-1,0)``] |
| `chestDiscount` | Chest price | How much less chests and shop items cost. | Price multiplier = 1 - d/(1+d) for crates, vendors, kennel training and slot spins. [sim-DQNACfZS.js: ``i[r.chestPriceMult]=1-Ee(e.chestDiscount,n.discountK)``] |
| `dashCharges` | Dash charges | Extra dashes Tibo can make in a row. Spent charges come back one at a time. | +floor(dashCharges) dash charges on top of the base 1. [sim-DQNACfZS.js: ``function hi(e){return e.cfg.dash.charges+e.loadout.stats.dashCharges}``] |
| `dashCooldown` | Dash cooldown | Shortens the wait for each dash charge to come back. | Dash recharge = 5 s × (1 - clamp(dashCooldown, -1, 0.6)). [sim-DQNACfZS.js: ``function mi(e){return S(e.cfg.dash.cooldownSec*e.loadout.stats.dashCooldownMult)}``] |
| `dashGrace` | (none found) | (none found) | Extra seconds of dash shield after a dash (shield = 9 dash ticks + dashGrace s); while shielded, normal damage is ignored. No stats-panel label found (not determined). [sim-DQNACfZS.js: ``t.dashShield[n]=e.cfg.dash.ticks+function(e){return Math.round(60*e.loadout.stats.dashGraceSec)}(e)``] |

Item `mods` keys used: `amount`, `area`, `armor`, `chestDiscount`, `cooldown`, `critChance`, `critDamage`, `curse`, `dashGrace`, `duration`, `eliteDamage`, `evasion`, `explodeOnKill`, `greed`, `growth`, `healOnKill`, `luck`, `magnet`, `maxHp`, `might`, `moveSpeed`, `pierce`, `recovery`, `revival`, `speed`, `thorns`. Same meaning as above. Verified (registry).

### Item `effect.kind`

- `onHit`: Item proc rolled when one of your weapon hits lands. Proc chance with N copies = 1-(1-chance)^N; procs per second capped at perSec × N (token bucket). Items: coal-baked-spud, heavy-russet, spicy-croquette, static-tot, bonfire-spud, magma-croquette, meteor-russet, storm-tot. No UI label in code. Verified. [sim-DQNACfZS.js: ``e.chance=function(e,t){return 1-se(1-Math.min(1,Math.max(0,e)),t)}(r.chance,t),e.rate=r.perSec*t``]
- `onKill`: Item proc rolled when an enemy dies (frozenOnly: only if it was frozen). Same stacking as onHit. Items: freezer-burn, wandering-eyes, all-seeing-spud, glacier-spud, kaboom-spud. No UI label in code. Verified. [sim-DQNACfZS.js: ``o.kind!==`onKill`||o.frozenOnly&&t.freezeT[n]<=0||!js(e,a)``]
- `onHurt`: Item proc when Tibo is hurt, at most once per `cooldown` seconds; fires projectiles outward whose damage grows +15%/minute. Items: porcupine-spud, fry-volcano. No UI label in code. Verified. [sim-DQNACfZS.js: ``i.kind!==`onHurt`||e.tick<r.readyAt||(r.readyAt=e.tick+re(i.cooldown),Us(e,r,i.proc))``]

### Item `proc.kind`

- `burn`: Sets the hit enemy on fire for share × hit damage per second for `seconds` × duration; `spread` also ignites enemies in a radius. Items: coal-baked-spud, bonfire-spud. Game wording: coal-baked-spud: "15% of hits set enemies on fire.". Verified. [sim-DQNACfZS.js: ``case`burn`:{if(yi(r,i,a*n.share,n.seconds*e.loadout.stats.durationMult,t.src),n.spread===void 0)return``]
- `blast`: Explosion around the target for share × damage in radius × sqrt(area); optional burn. Items: spicy-croquette, kaboom-spud, magma-croquette. Game wording: spicy-croquette: "12% of hits burst in a fiery blast.". Verified. [sim-DQNACfZS.js: ``case`blast`:{let o=n.radius*Ns(e);Y(e,a*n.share,t.src,-1,.5)``]
- `chain`: Lightning jumps to `jumps` more enemies within range × sqrt(area) for share × damage; `clap` adds a small blast at each. Items: static-tot, storm-tot. Game wording: static-tot: "10% of hits arc lightning to 3 more enemies.". Verified. [sim-DQNACfZS.js: ``for(let r=0;r<n.jumps;r++){let r=Ar(e,l,u,s,o);if(r===void 0)break``]
- `bonk`: Multiplies that hit by `mult` (15× / 20×); `meteor` also craters enemies around. Items: heavy-russet, meteor-russet. Game wording: heavy-russet: "2% of hits BONK for 15× damage.". Verified. [sim-DQNACfZS.js: ``return e.itemFx.bonkSrc=o.src,s.proc.mult``]
- `seekers`: On kill, launches homing potato eyes for share × the dead enemy's max HP. Items: wandering-eyes, all-seeing-spud. Game wording: wandering-eyes: "20% of kills send 2 potato eyes after other enemies.". Verified. [sim-DQNACfZS.js: ``case`seekers`:(function(e,t,n,r,i,a){let o=e.projectiles``]
- `shatter`: On kill, bursts for share × the dead enemy's max HP and applies a status (freeze); `frost` slows a wider ring. Items: freezer-burn, glacier-spud. Game wording: freezer-burn: "Frozen enemies shatter when they die and freeze enemies nearby.". Verified. [sim-DQNACfZS.js: ``case`shatter`:{let o=n.radius*Ns(e);if(Y(e,a*n.share,t.src,-1,.3)``]
- `quills`: onHurt projectiles: `count` fries in a ring, damage × damage mult × (1+0.15/min) + thornsShare × thorns; optional blast. Items: porcupine-spud, fry-volcano. Game wording: porcupine-spud: "When Tibo is hit, he fires 10 fries outward.". Verified. [sim-DQNACfZS.js: ``Hs(e,f,a,o,u+d/n.count*j,s),r.radius[f]=3*Ns(e),r.damage[f]=c``]

### Weapon `onHit.kind` (status effects)

- `slow`: Status: enemy speed reduced by `factor` for `seconds` × duration. Weapons: butter-streak, potato-battery, salt-line, ghee-glide, mashquake, salt-flats, spud-grid. Verified. [sim-DQNACfZS.js: ``case`slow`:e.slowF[t]=Math.max(e.slowF[t],n.factor),e.slowT[t]=Math.max(e.slowT[t],n.seconds*i)``]
- `freeze`: Status: enemy frozen for `seconds` × duration (bosses are not frozen). Weapons: frozen-fries, root-cellar, cold-storage, hash-bulwark, permafrost-fries. Verified. [sim-DQNACfZS.js: ``case`freeze`:r||(e.freezeT[t]=Math.max(e.freezeT[t],n.seconds*i))``]
- `burn`: Status: damage over time `dps` for `seconds` × duration (strongest burn wins). Weapons: inferno-basket. Verified. [sim-DQNACfZS.js: ``case`burn`:yi(e,t,n.dps,n.seconds*i,a);return``]

### Weapon `behavior.kind`

No UI label exists for behavior kinds. The explanations below are **Inferred** from the game's own weapon descriptions (en-content) and the behavior fields; the game wording is verbatim.

- `pool`: Leaves damaging ground pools/trails. Game wording: butter-streak: "Each dash leaves a strip of melted butter that slows pests and burns them for 2 s. Between dashes, it also leaves one on the path Tibo just walked.". Weapons: butter-streak, gravy-boat, salt-line, whisk-vortex, ghee-glide, gravy-flood, salt-flats, stand-mixer. Inferred.
- `spiral`: Projectiles spiral outward. Game wording: chip-shuriken: "Spinning chips that spiral outward.". Weapons: chip-shuriken, kettle-cyclone. Inferred.
- `cone`: Cone spray in front of Tibo. Game wording: deep-fryer: "Sprays hot oil in a cone.". Weapons: deep-fryer, inferno-basket. Inferred.
- `targetShot`: Fires projectiles at the nearest enemy. Game wording: frozen-fries: "Shoots frozen fries that freeze enemies in place.". Weapons: frozen-fries, grab-bag, small-fry, tot-toss, big-fry, bottomless-sack, permafrost-fries, tot-gatling. Inferred.
- `facingShot`: Fires projectiles in the direction Tibo faces. Game wording: fry-knives: "Fires sharp fries in the direction Tibo faces.". Weapons: fry-knives, thousand-fries. Inferred.
- `beam`: Long line attack that pierces a whole line. Game wording: fry-lance: "One very long fry that pierces a whole line.". Weapons: fry-lance, julienne-dash, railfry, waffle-cut. Inferred.
- `turret`: Places a turret that shoots nearby enemies. Game wording: fry-sentry: "Drops a fry-cook turret that shoots nearby enemies.". Weapons: fry-sentry. Inferred.
- `slash`: Melee swing in front of Tibo (some reflect bullets, charge on elite kills, heal, or gain low-HP damage via hpEdge). Game wording: frying-pan: "Swings a pan in front of Tibo. Enemy bullets it swats fly back at whoever shot them. Each elite Tibo kills charges the next swing bigger and harder.". Weapons: frying-pan, mezzaluna, peeler, cast-iron, mandoline-fury, moon-cleaver. Inferred.
- `boomerang`: Projectile flies out and returns. Game wording: hash-boomerang: "A crispy hash brown that flies out and comes back.". Weapons: hash-boomerang, hashnado. Inferred.
- `guard`: Orbiting shields that absorb (`soak`) damage then burst. Game wording: hash-brown-shield: "Hash browns circle Tibo. Each takes up to 20 damage of one hit or bullet, then bursts into shards that hurt nearby enemies. Thorns add to shard damage. Broken ones re-crisp one at a time.". Weapons: hash-brown-shield, hash-bulwark. Inferred.
- `homing`: Seeking projectile. Game wording: hot-potato: "Hops from pest to pest and blows up on the last one when its count runs out.". Weapons: hot-potato, seeker-sprouts, overgrowth, spicy-hot-potato. Inferred.
- `nova`: Expanding ring from Tibo. Game wording: mash-wave: "A ring of mashed potato rolls out from Tibo.". Weapons: mash-wave, mashquake. Inferred.
- `tether`: Clips a wire to a pest that zaps and slows what it touches. Game wording: potato-battery: "Clips a live wire onto a pest. The wire zaps and slows every pest it touches. The clipped pest can't die until the wire lets go.". Weapons: potato-battery, spud-grid. Inferred.
- `rain`: Projectiles fall around Tibo. Game wording: potato-rain: "Calls down a shower of potatoes around Tibo.". Weapons: potato-rain, golden-harvest. Inferred.
- `nuke`: Screen clear on a long cooldown (min 15 s); bosses only take a fraction. Game wording: reset-button: "We reset the limits. Clears every enemy on screen. Bosses only flinch.". Weapons: reset-button, factory-reset. Inferred.
- `ring`: Ring around Tibo that damages/statuses enemies crossing it. Game wording: root-cellar: "A ring of cellar cold around Tibo. Pests that cross it take frostbite and freeze for a moment. Bosses only slow.". Weapons: root-cellar, cold-storage. Inferred.
- `strike`: Hits appear under enemies (some chain/jump). Game wording: root-spikes: "Roots burst out of the ground under enemies.". Weapons: root-spikes, starch-bolt, taproot-eruption, thunder-tuber, starch-supercell. Inferred.
- `bouncer`: Projectile bounces off the edges of the view. Game wording: rosti-disc: "A flat rösti that bounces off the edges of the view.". Weapons: rosti-disc, rosti-storm. Inferred.
- `orbit`: Projectiles circle Tibo for a duration. Game wording: sprout-satellites: "Potato sprouts circle Tibo for a while.". Weapons: sprout-satellites, eternal-sprouts. Inferred.
- `explosive`: Projectile that explodes on impact (some cluster). Game wording: spud-cannon: "A classic potato gun. Shots burst on impact.". Weapons: spud-cannon, spud-dice, loaded-dice, spudzooka. Inferred.
- `lob`: Arcing thrown projectile that lands and explodes. Game wording: spud-lob: "Lobs heavy potatoes high. They crash down through crowds.". Weapons: spud-lob, sack-of-russets, spud-artillery. Inferred.
- `chain`: Spark that jumps between enemies. Game wording: starch-chain: "A spark that jumps from enemy to enemy.". Weapons: starch-chain, gratin-arc. Inferred.
- `aura`: Constant damage zone around Tibo. Game wording: steam-vent: "Hot steam from a baked potato hurts everything close.". Weapons: steam-vent, pressure-cooker. Inferred.
- `mine`: Places mines that burst when enemies come close. Game wording: tater-mines: "Buries spuds that burst when enemies step close.". Weapons: tater-mines, landmine-harvest. Inferred.
- `familiar`: Companion that follows Tibo and shoots. Game wording: tater-pup: "A loyal tot that follows Tibo and shoots.". Weapons: tater-pup, fry-brigade. Inferred.

Not determined: in-game labels for `maxHpPct` and `dashGrace` (absent from the label switch, so likely never shown as a stat row; inference).

## 3. Level-up rules

- Slots: 6 weapons, 6 passives. Verified. [sim-DQNACfZS.js: ``weaponSlots:6,passiveSlots:6``]
- Max levels: base weapons `min(8, levels+1)` (all 37 base weapons reach 8); evolved/union weapons are level 1 only (cannot be levelled). Passives: maxLevel 5 (all 22). Verified. [sim-DQNACfZS.js: ``function Z(e){return e.tier===`base`?Math.min(8,e.levels.length+1):1}``]
- Number of cards: 3, plus a 4th with chance `min(1, luck)`. Verified (see Luck).
- Offer pool and weights (`da`): Verified. [sim-DQNACfZS.js: ``weight:Math.max(30,e.def.weight)*ia})``] [sim-DQNACfZS.js: ``weight:a.weight*aa*i*(ua(t,a.id)?e.cfg.levelUp.unionPartnerWeight:1)``]
  - Upgrade an owned base weapon (not max, not banished): `max(30, weight) × 3`.
  - New base weapon (only if a weapon slot is free; not owned, not already evolved/united away, not banished): `weight × 0.35 × (1926 / 2970)`, ×4 if it is a union partner of a weapon you hold. (2970 = sum of current base-weapon weights; normaliser `ca(target,total)=target/total` when total > target.)
  - Upgrade an owned passive: `weight × 3 × 0.8`, ×4 if it is the catalyst for an item you hold.
  - New passive (only if a passive slot is free): `weight × 0.35 × (1720 / 1840)`, ×4 if it is an item catalyst for a held item. Verified. [sim-DQNACfZS.js: ``weight:r.def.weight*ia*.8*la(e,r.def.id)``] [sim-DQNACfZS.js: ``var ia=3,aa=.35``]
  - Cards are drawn without replacement by weight. Verified. [sim-DQNACfZS.js: ``let n=e.lootRng.weightedIndex(t.map(e=>e.weight)),i=t[n];if(i===void 0)break;r.push(i.offer),t.splice(n,1)``]
- catalystGuaranteeLevel = 4 (6 in Story): if you have a free passive slot and own a base weapon at level ≥ 4 whose evolution catalyst you do not own (and have not banished), the last card is replaced by that catalyst passive (unless it is already offered). Verified. [sim-DQNACfZS.js: ``if(e.def.tier!==`base`||e.level<n)continue;let r=c.evolutionOf(e.def.id)?.catalyst;if(r!==void 0&&t.passive(r)===void 0&&!t.banished.has(r))return r``]
- Empty pool fallback: "Sack of Gold" (+25 gold) and "Baked Potato" (heal 30). If HP is full and only these remain, the gold is taken automatically (`autoGold`). Verified. [sim-DQNACfZS.js: ``r.push({type:`gold`,name:`Sack of Gold`,desc:`+25 gold.`,amount:25}),r.push({type:`heal`,name:`Baked Potato`,desc:`Heal 30 HP.`,amount:30})``]
- Reroll: spends 1 reroll, draws a fresh set (only allowed if the pool has something not already shown). Skip: spends 1 skip, closes the level-up with nothing. Banish: spends 1 banish, removes that weapon/passive from offers for the rest of the run, then redraws. Verified. [sim-DQNACfZS.js: ``case`skip`:if(n.skips<=0)return;n.skips--,e.choiceQueue.shift();return;case`banish`:``] [sim-DQNACfZS.js: ``n.banishes--,n.banished.add(i.id)``]
- In-game tutorial wording: "reroll redraws, skip passes, banish bans a card for the run." Verified. [levelup-lesson-run-B_SQzpEA.js: ``reroll redraws, skip passes, banish bans a card for the run.``]
- Rerolls/skips/banishes are not given at the start in normal config; they come from pickups (see section 6), the Seed Vault (+2/+1/+1) and dog digs. Inferred from the absence of any starting grant in config; the Loadout class starts at 0. [sim-DQNACfZS.js: ``rerolls=0;skips=0;banishes=0``]
- Whetstone offers up to 3 random owned, non-max, non-banished base weapons; picking one levels it. Verified. [sim-DQNACfZS.js: ``n=new Set(e.lootRng.shuffle([...t]).slice(0,e.cfg.levelUp.baseChoices))``]

## 4. Evolution rules

- Evolutions, unions and item evolutions happen only when a chest is opened (boss/elite chests, Poteto's gift, Tater Slots jackpot). Paid crates, vendors and Microwave give items, not chest rolls. Verified. [sim-DQNACfZS.js: ``function Ea(e,t){if(e.runClock>=e.cfg.chests.evolutionGateSec){let n=ka(e,t.pending);if(n!==void 0)return n}return Ma(e,t.goldScale)}``]
- `evolutionGateSec` = 0, so there is no time gate. Verified. [sim-DQNACfZS.js: ``evolutionGateSec:0``]
- Weapon evolution requirement: the base weapon is at its max level (8) and you own its catalyst passive at any level. Verified. [sim-DQNACfZS.js: ``function Pa(e,t){let n=e.loadout,r=n.weapon(t.weapon);if(r!==void 0&&Na(r)&&n.passive(t.catalyst)!==void 0)return{w:r,recipe:t}}``]
- Union requirement: you own both partner weapons (or the evolution of one), each is either max-level base or evolved, and at least one is a max-level base. The union replaces the first weapon's slot and removes the second, freeing a weapon slot. Verified. [sim-DQNACfZS.js: ``if(n!==void 0&&r!==void 0&&Fa(n)&&Fa(r))return Na(n)||Na(r)?[n,r]:void 0``] [sim-DQNACfZS.js: ``Zi(e,i.slot),Qi(e,i.slot),n.weapons.splice(n.weapons.indexOf(i),1)``]
- UI wording: "Unites with {partner} into {result} when both reach LV {level}." (the UI simplifies the rule above). Verified. [deferred-ui-BYWEYMjM.js: ``message:[`Unites with `,[`partner`],` into `,[`result`],` when both reach LV `,[`level`],`.`]``]
- Fork: if a weapon can both evolve and unite, that chest slot becomes a choice "Evolve or unite?" (cards tagged EVOLVE / UNITE). Verified. [sim-DQNACfZS.js: ``return t===void 0?Aa(e,r):{type:`fork`,evolve:r.recipe,unite:t.recipe}``] [choices-7yGAe9Ru.js: ``message:[`Evolve or unite?`]``]
- Each chest reward slot is, in order of priority: an evolution/union if one is ready; otherwise a level-up of your highest-level non-max base weapon (ties go to the one with more damage dealt); otherwise a random non-max passive level; otherwise `20 × greed × goldScale` gold. Verified. [sim-DQNACfZS.js: ``n.def.tier!==`base`||n.level>=Z(n.def)||(t===void 0||n.level>t.level||n.level===t.level&&n.damageDealt>t.damageDealt)&&(t=n)``] [sim-DQNACfZS.js: ``let o=Math.round(20*n.stats.greedMult*t)``]
- Chest size: 1 / 3 / 5 rewards, P(5) = 2%·(1+luck), P(3) = 18%·(1+luck) (cumulative check, see Luck). A 5-reward chest is shown as "Jackpot chest!" (inferred: title uses jackpot tier reward count). [choices-7yGAe9Ru.js: ``message:[`Jackpot chest!`]``]
- Item evolution: you hold the base item and the catalyst passive is at max level (5). On the next chest opening, all copies of the item turn into the evolved item. Verified. [sim-DQNACfZS.js: ``if(r?.def.id===t.catalyst)return r.level>=r.def.maxLevel``] [sim-DQNACfZS.js: ``return n.items.delete(t.item),n.items.set(t.result,n.itemCount(t.result)+r)``]
- UI wording: "Evolves into {result} when {catalyst} reaches LV {level}." Verified. [deferred-ui-BYWEYMjM.js: ``message:[`Evolves into `,[`result`],` when `,[`catalyst`],` reaches LV `,[`level`],`.`]``]
- Once an item has evolved, the base item stops dropping. Verified. [sim-DQNACfZS.js: ``let n=ir.itemEvolutionOf(t);return n!==void 0&&e.itemCount(n.result)>0``]
- Recipe tables (from `sim.pt`): see `notes/recipes.md` appended below.

### Recipe tables (from `sim.pt`, names from en-content)

| Base weapon | Catalyst passive | Evolution |
|---|---|---|
| Small Fry (`small-fry`) | Fertilizer (`fertilizer`) | Big Fry (`big-fry`) |
| Grab Bag (`grab-bag`) | Sprouting Eyes (`sprouting-eyes`) | Bottomless Sack (`bottomless-sack`) |
| Frying Pan (`frying-pan`) | Starch Plating (`starch-plating`) | Cast Iron (`cast-iron`) |
| Root Cellar (`root-cellar`) | Slow Cooker (`slow-cooker`) | Cold Storage (`cold-storage`) |
| Sprout Satellites (`sprout-satellites`) | Slow Cooker (`slow-cooker`) | Eternal Sprouts (`eternal-sprouts`) |
| Reset Button (`reset-button`) | Four-Eyed Spud (`four-eyed-spud`) | Factory Reset (`factory-reset`) |
| Butter Streak (`butter-streak`) | Spud Sneakers (`spud-sneakers`) | Ghee Glide (`ghee-glide`) |
| Potato Rain (`potato-rain`) | Golden Fry (`golden-fry`) | Golden Harvest (`golden-harvest`) |
| Starch Chain (`starch-chain`) | Hot Sauce (`hot-sauce`) | Gratin Arc (`gratin-arc`) |
| Gravy Boat (`gravy-boat`) | Potato Magnet (`potato-magnet`) | Gravy Flood (`gravy-flood`) |
| Hash Brown Shield (`hash-brown-shield`) | Starch Plating (`starch-plating`) | Hash Bulwark (`hash-bulwark`) |
| Hash Boomerang (`hash-boomerang`) | Sour Cream (`sour-cream`) | Hashnado (`hashnado`) |
| Deep Fryer (`deep-fryer`) | Bacon Bits (`bacon-bits`) | Inferno Basket (`inferno-basket`) |
| Chip Shuriken (`chip-shuriken`) | GPU (`gpu`) | Kettle Cyclone (`kettle-cyclone`) |
| Tater Mines (`tater-mines`) | Rotten Spud (`rotten-spud`) | Landmine Harvest (`landmine-harvest`) |
| Spud Dice (`spud-dice`) | Four-Eyed Spud (`four-eyed-spud`) | Loaded Dice (`loaded-dice`) |
| Peeler (`peeler`) | Gravy Heart (`gravy-heart`) | Mandoline Fury (`mandoline-fury`) |
| Mash Wave (`mash-wave`) | Big Bowl (`big-bowl`) | Mashquake (`mashquake`) |
| Mezzaluna (`mezzaluna`) | Rotten Spud (`rotten-spud`) | Moon Cleaver (`moon-cleaver`) |
| Seeker Sprouts (`seeker-sprouts`) | Fertilizer (`fertilizer`) | Overgrowth (`overgrowth`) |
| Frozen Fries (`frozen-fries`) | Thick Skin (`thick-skin`) | Permafrost Fries (`permafrost-fries`) |
| Steam Vent (`steam-vent`) | Root Network (`root-network`) | Pressure Cooker (`pressure-cooker`) |
| Fry Lance (`fry-lance`) | Spud Sneakers (`spud-sneakers`) | Railfry (`railfry`) |
| Rösti Disc (`rosti-disc`) | Starch Plating (`starch-plating`) | Rösti Storm (`rosti-storm`) |
| Spud Lob (`spud-lob`) | Butter Pat (`butter-pat`) | Sack of Russets (`sack-of-russets`) |
| Salt Line (`salt-line`) | Spud Sneakers (`spud-sneakers`) | Salt Flats (`salt-flats`) |
| Hot Potato (`hot-potato`) | Hot Sauce (`hot-sauce`) | Spicy Hot Potato (`spicy-hot-potato`) |
| Potato Battery (`potato-battery`) | Root Network (`root-network`) | Spud Grid (`spud-grid`) |
| Spud Cannon (`spud-cannon`) | Hot Sauce (`hot-sauce`) | Spudzooka (`spudzooka`) |
| Whisk Vortex (`whisk-vortex`) | Big Bowl (`big-bowl`) | Stand Mixer (`stand-mixer`) |
| Root Spikes (`root-spikes`) | Masher Grip (`masher-grip`) | Taproot Eruption (`taproot-eruption`) |
| Fry Knives (`fry-knives`) | Salt Shaker (`salt-shaker`) | Thousand Fries (`thousand-fries`) |
| Starch Bolt (`starch-bolt`) | Sprouting Eyes (`sprouting-eyes`) | Thunder Tuber (`thunder-tuber`) |
| Tot Toss (`tot-toss`) | Chives (`chives`) | Tot Gatling (`tot-gatling`) |
| Julienne Dash (`julienne-dash`) | Butter Socks (`butter-socks`) | Waffle Cut (`waffle-cut`) |

| Weapon A | Weapon B | Union |
|---|---|---|
| Fry Cook Sentry (`fry-sentry`) | Tater Tot Pup (`tater-pup`) | Fry Brigade (`fry-brigade`) |
| Spud Lob (`spud-lob`) | Spud Cannon (`spud-cannon`) | Spud Artillery (`spud-artillery`) |
| Starch Bolt (`starch-bolt`) | Starch Chain (`starch-chain`) | Starch Supercell (`starch-supercell`) |

| Item | Catalyst passive (must be max level) | Evolved item |
|---|---|---|
| Wandering Eyes (`wandering-eyes`) | Four-Eyed Spud (`four-eyed-spud`) | All-Seeing Spud (`all-seeing-spud`) |
| Coal-Baked Spud (`coal-baked-spud`) | Hot Sauce (`hot-sauce`) | Bonfire Spud (`bonfire-spud`) |
| Porcupine Spud (`porcupine-spud`) | Starch Plating (`starch-plating`) | Fry Volcano (`fry-volcano`) |
| Freezer Burn (`freezer-burn`) | Slow Cooker (`slow-cooker`) | Glacier Spud (`glacier-spud`) |
| Boom Spud (`boom-spud`) | Rotten Spud (`rotten-spud`) | Kaboom Spud (`kaboom-spud`) |
| Spicy Croquette (`spicy-croquette`) | Big Bowl (`big-bowl`) | Magma Croquette (`magma-croquette`) |
| Heavy Russet (`heavy-russet`) | Masher Grip (`masher-grip`) | Meteor Russet (`meteor-russet`) |
| Static Tot (`static-tot`) | Root Network (`root-network`) | Storm Tot (`storm-tot`) |

## 5. Unlocks and progression

- **No gameplay meta-progression found.** All weapons, passives, items, dogs and difficulties are available from the first run; there is no persistent currency, upgrade shop or stat carry-over in the sim. The only things saved between runs are settings, the run-picker state, the encyclopedia "discovered" lists and the list of evolution/union/item-evolution results you have made. Inferred from the full list of storage keys found in the bundle (`tibo.settings.v1`, `tibo.discovery.v1`, `tibo.evolutions.v1`, plus `tibo.page.*` locks and the `tibo.safe-start` IndexedDB crash guard) and from the sim taking no saved state. [boot-DIJlLGwy.js: ``var Kc=`tibo.settings.v1```] [evolution-store-h8UcGvvT.js: ``key:`tibo.discovery.v1`,parse:f,merge:d``] [evolution-store-h8UcGvvT.js: ``key:`tibo.evolutions.v1`,parse:a,merge:i``]
- **Encyclopedia discovery** (`tibo.discovery.v1`): tracks seven shelves: weapon, passive, item, enemy, boss, biome, dog. Verified. [evolution-store-h8UcGvvT.js: ``c=[`weapon`,`passive`,`item`,`enemy`,`boss`,`biome`,`dog`]``]
  - An entry is discovered when it is *offered or seen*, not only when taken: level-up/whetstone cards, chest rewards, items found, vendor stock, microwave offers, dog swap offers, plus a scan every 30 ticks of your loadout, enemies and bosses on the field, your dogs and the biomes visited. Verified. [run-records-Iz0UhFh9.js: ``case`levelUp`:case`whetstone`:for(let t of e.offers)this.offer(t);return;``] [run-records-Iz0UhFh9.js: ``e.tick-this.scannedAt>=30&&(this.scannedAt=e.tick,this.scan(e))``]
  - Undiscovered entries show "?" and "Not found yet". Shelves: Weapons, Evolutions, Passives, Items, Enemies, Bosses, Biomes, Dogs. Verified. [encyclopedia-screen-RAUoo72F.js: ``if(!t.found)return e._({id:`vROlcq`,message:[`Not found yet`]})``]
- **Recipe knowledge** (`tibo.evolutions.v1`): every evolution, union and item evolution you complete is remembered. Item-evolution results you have never made appear as "???" in recipe views. Verified. [run-records-Iz0UhFh9.js: ``unlocked=e=>this.known.has(e)``] [recipe-view-DJMaj6Un.js: ``case`itemEvolution`:return n.unlocked(i.result)?r(`item`,e.item(i.result)):`???```]
- **Story → difficulties:** difficulties are not locked. Before Story is finished the run picker shows Story + Easy/Normal/Hard/Nightmare with Story selected and featured; once a Story run reaches its ending, Story is dropped from the picker and the default becomes Easy (then your last pick). Verified. [boot-DIJlLGwy.js: ``return e.storyDone?{picks:sa,selected:(n=e.lastPick,(n===fa?void 0:n)??t.afterStory),featured:void 0}:{picks:la,selected:fa,featured:fa}``] [boot-DIJlLGwy.js: ``runPicker:{afterStory:`easy`,storyDoneOn:`ending`,storyOnStats:!0}``]
- **Dog breeds / legendary dogs:** nothing is unlocked permanently; legendary dogs are rolled per run seed (section 10). Verified by absence of dog data in any store (inference for "nothing permanent").
- **Medals:** the `sprite-medal` chunk is only used to draw icons in the end-of-run stats panel; no medal/achievement unlock logic was found. Inferred. [stats-panel-Bw-pgRkU.js: ``function T(e){return e.classList.add(`stats-medal`),e}``]

## 6. POIs, shrines, events, helpers, pickups

Activation: you stand inside a POI's radius; charge goes +1 per tick while inside (and the POI's condition holds) and −2 per tick outside; it fires at `activation.seconds[kind]` × 60 ticks. Verified. [sim-DQNACfZS.js: ``u.charge=lc(u.charge,h&&u.armed&&_s(e,l),i),u.charge<nc(e.cfg,l.kind)||(u.charge=0,u.armed=!1,ys(e,l))``] [sim-DQNACfZS.js: ``function lc(e,t,n){return t?e+1:Math.max(0,e-n)}``]
Charge times (s): item 0.75, chest 1, crops 1, taterLantern 1, taterMagnet 1, dog 1, boss/Poteto gold chest 1.5, curseShrine 1.5, dinnerBell 1.5, eliteNest 1.5, microwave 1.5, paidChest 1.5, taterSlots 1.5, vendor 1.5, whetstone 1.5, dogKennel 1.5, spudFreezer 1.5, botDock 2, seedVault 2, rootTunnel 2, frenzyFryer 2, bossLair 3, chargeShrine 5, goldenShrine 5. Verified. [sim-DQNACfZS.js: ``activation:{seconds:{item:.75,chest:1,crops:1,taterLantern:1,taterMagnet:1,dog:1,curseShrine:1.5``]
POIs are placed per 256-unit chunk using per-biome `poiWeights`. Verified (registry biomes). Game names below are from en-content (`content.poi.*.name`).

- **Potato Crate** (`paidChest`): pay the crate price (section 1), get one random item (rarity by luck). Verified. [sim-DQNACfZS.js: ``r.gold-=i,e.run.goldSpent+=i,e.paidChestsBought++,e.run.paidChests++,n.used=!0;let a=Ri(e)``] UI: "Costs gold. Holds an item. Each crate costs more than the last."
- **Spud Shrine** (`chargeShrine`, 5 s): offers 3 random stats from the shrine list, each with a random rarity; value = base × rarityMult [1,1.2,1.4,1.7,2]. Stats and bases: Damage 0.06, Area 0.06, Cooldown 0.03, Move speed 0.05, Max HP 12, Armor 10, Luck 0.06, Gold gain 0.1, XP gain 0.06, Crit 0.04, Duration 0.06, Pickup range 0.15. Verified. [sim-DQNACfZS.js: ``value:(i=n.stat,a=n.base*e.cfg.economy.rarityMult[r],i===`armor`?Math.round(a):a),rarity:r``]
- **Golden Spud Shrine** (`goldenShrine`, 5 s): same, but every offer's rarity is Epic (3), or Legendary (4) with 30% chance. Verified. [sim-DQNACfZS.js: ``function Ui(e){return e.lootRng.chance(e.cfg.goldenShrine.legendaryChance)?4:3}``]
- **Moldy Shrine** (`curseShrine`): accept to gain `round((45 + 9*minutes) * greed)` gold, +0.1 curse and +1 curse taken. Verified. [sim-DQNACfZS.js: ``gold:Math.round((45+e.runClock/60*9)*e.loadout.stats.greedMult),curse:.1``] [sim-DQNACfZS.js: ``n.shrineTotals.curse+=t.curse,n.cursesTaken++``]
- **Fry Cart** (`vendor`): stocks 3 items; the third gets a bumped rarity (Common→Uncommon, Uncommon→Rare, Rare→Epic, Epic/Legendary→Legendary). Price = `vendorPrice[rarity] × (1 + 0.06·minutes) × chestPriceMult`, vendorPrice = [80,140,240,400,640]. One purchase per cart, then it leaves. Verified. [sim-DQNACfZS.js: ``let c=Math.round(e.cfg.economy.vendorPrice[s.rarity]*(1+.06*n)*e.loadout.stats.chestPriceMult)``] [sim-DQNACfZS.js: ``purchasesPerVendor:1``]
- **Microwave**: copy one of your base items; cost mode is `melt`: another base item of the same rarity (the one you hold fewest of) loses one copy. Verified. [sim-DQNACfZS.js: ``i.id!==e.id&&i.rarity===e.rarity&&(r===void 0||t.itemCount(i.id)<t.itemCount(r.id))&&(r=i)``] UI: "Copy an item. Another of its rarity melts." [choices-7yGAe9Ru.js: ``Copy an item. Another of its rarity melts.``] (Config also defines unused `gold` and `curse` cost modes. Verified config, unused = inferred from `cost:"melt"`.)
- **Crop Patch** (`crops`): drops 3–7 coins (×biome gold mult) and a 35% chance of a 30-HP snack. Verified. [sim-DQNACfZS.js: ``e.lootRng.chance(.35)&&J(e,`heal`,t.x,t.y-8,30)``]
- **Beetle Nest** (`eliteNest`): spawns an elite; tier bonus `floor(tier/3)`, HP ×(1 + 0.15·tier) (tier = the POI's tier, inferred to grow with distance). Verified. [sim-DQNACfZS.js: ``tierBonus:Math.floor(t.tier/n.nestTierEvery),hpMult:1+t.tier*n.nestHpPerTier``]
- **Boss Lair** (`bossLair`, 3 s): wakes a boss chosen from `bossOrder` at index `clamp(floor(minutes/2) + floor(tier/2), 1, 11)`, HP ×(0.8 + 0.1·tier). Verified. [sim-DQNACfZS.js: ``n[Math.max(1,Math.min(n.length-2,Math.floor(e.runClock/120)+Math.floor(t.tier/2)))]``]
- **Stray Dog** (`dog`): see section 10.
- **Bot Dock** (`botDock`, 2 s): calls a Grok Bot swarm (same as a Bot Beacon). Verified. [sim-DQNACfZS.js: ``case`botDock`:yo(e)>0&&(t.state.used=!0);return``]
- **Spud Whetstone** (`whetstone`): level up one of up to 3 offered weapons (section 3). Only chargeable if a weapon can still level. Verified. [sim-DQNACfZS.js: ``case`whetstone`:n.used=!0,e.choiceQueue.push({kind:`whetstone`,offers:pa(e)})``]
- **Dinner Bell** (`dinnerBell`): spawns 20 pests in a ring of radius 130 around you; they give 3× XP, always drop gold and despawn after 30 s. Verified. [sim-DQNACfZS.js: ``r.xp[a]=(r.xp[a]??0)*n.xpMult,r.goldChance[a]=1,r.despawnAt[a]=e.time+n.lifeSec``]
- **Tater Slots** (`taterSlots`): pay half a crate price; three reels of 4 symbols. Three of a kind = a 1-reward chest; two of a kind = a random item; otherwise nothing. Verified. [sim-DQNACfZS.js: ``let r=So(n.reels,e.cfg.taterSlots.symbols);if(r!==3){if(r===2){let t=Ri(e)``] (UI desc says "Match two for an item.")
- **Seed Vault** (`seedVault`, 2 s): +2 rerolls, +1 skip, +1 banish. Verified. [sim-DQNACfZS.js: ``r.rerolls+=n.rerolls,r.skips+=n.skips,r.banishes+=n.banishes``]
- **Tater Magnet** (`taterMagnet`): pulls every gem and coin on the map to you (only chargeable if any exist). Verified. [sim-DQNACfZS.js: ``case`taterMagnet`:(function(e,t){let n=gs(e)``]
- **Root Tunnel** (`rootTunnel`, 2 s): digs you to a far POI at least 900 units away; you are invulnerable during dig+rise (90 ticks). Verified. [sim-DQNACfZS.js: ``let s=e.me,c=(2*r.digTicks+r.riseTicks)/60;e.player.invuln[s]=Math.max(e.player.invuln[s]??0,c)``]
- **Tater Lantern** (`taterLantern`): breaks into one token tossed just past your pickup range: skip (weight 4), magnet (4), reroll (3), banish (2), Bot Beacon (1). Verified. [sim-DQNACfZS.js: ``tokens:[{kind:`skip`,weight:4},{kind:`magnet`,weight:4},{kind:`reroll`,weight:3},{kind:`banish`,weight:2},{kind:`beacon`,weight:1}]``]
- **Spud Freezer** (`spudFreezer`): freezes pests within 200 for 5 s; bosses are slowed 50% instead. Verified. [sim-DQNACfZS.js: ``effect:{kind:`slow`,factor:n.bossSlow,seconds:n.freezeSec}``]
- **Frenzy Fryer** (`frenzyFryer`, 2 s): 20 s frenzy: weapon timers run 1.4× faster and move speed ×1.2. Verified. [sim-DQNACfZS.js: ``function Xa(e){return Ya(e)?e.cfg.frenzyFryer.fireRateMult:1}``] [sim-DQNACfZS.js: ``return Ya(e)?e.cfg.frenzyFryer.moveSpeedMult:1``]
- **Dog Kennel** (`dogKennel`): see section 10.

### World events
Events fire from the wave table each minute (section 7) or once per landmark; non-gold-rush events need spawn room. Verified. [sim-DQNACfZS.js: ``a!==void 0&&To(e,c.event(a))&&e.world.spendLandmark(r)``]
- `swarm` (Fry Fly Swarm 26 flies, Lunch Rush 24 gulls): a band of enemies crossing from one side, count scaled by enemy-count scaling (max 2×), despawn after 14 s. Verified. [sim-DQNACfZS.js: ``f=Math.round(t.count*Math.min(2,Br(e.scale,e.cfg,e.runClock).count))``]
- `wall` (Ring of Hay Bales 36, Strike 10 bowling balls): a ring of enemies closing in, count × difficulty `wallPests` (0.15 on Easy). Verified. [sim-DQNACfZS.js: ``o=Math.max(1,Math.round(t.count*e.cfg.level.wallPests))``]
- `lootRunner` (Golden Scarab, Lost Saucer): a fleeing enemy that despawns after `escapeAfter`; killing a loot runner drops an item. Verified. [sim-DQNACfZS.js: ``Ks[n.def[t]]===1&&li(e,`item`,i,a,1,`lootRunner`)``]
- `goldRush` (Harvest Moon 30 s, Loose Change 20 s): coins worth 2×. Verified. [sim-DQNACfZS.js: ``e.goldRushUntil=Math.max(e.goldRushUntil,e.time+t.duration),e.goldRushMult=t.goldMult``]

### Grok bots
- A wandering bot spawns 280 units ahead at 0:20 and then every 35 s (max 2 out). If you come within 140 it hops to you (8 s), helps when it touches you, cheers and beams away; otherwise it leaves after 40 s or at 700 distance. Verified. [sim-DQNACfZS.js: ``e.runClock<e.nextGrokBotAt||(e.nextGrokBotAt=e.runClock+n.everySec,l<n.maxOut&&``]
- Help kind is weighted: Zapper 3, Gift Bot 3, Bubble Bot 2, Tidy Bot 2. Verified (registry botHelps).
  - Zapper (`zap`): hits the 6 nearest targets within 120: pests die outright, elites lose 15% max HP, bosses are excluded. Verified. [sim-DQNACfZS.js: ``Y(e,u?c.maxHp[l]*r:0,R(e,so,a),-1,1),e.attack.flags=u?0:ge.Kill``] UI: "Zaps the closest bugs. Elites only get a jolt, and bosses are too big to zap."
  - Gift Bot (`gift`): `round(6 + 1.5·minutes)` coins, an XP gem worth 40% of your current level, 5% chance of a Bot Beacon. Verified. [sim-DQNACfZS.js: ``J(e,`xp`,i,a-6,e.loadout.xpNext*t.help.levelFraction),r.chance(t.help.beaconChance)&&J(e,`beacon`,i,a+6,1)``]
  - Bubble Bot (`shield`): 3 s invulnerability and heals 20% max HP. Verified. [sim-DQNACfZS.js: ``n.invuln[e.me]=Math.max(n.invuln[e.me]??0,t.help.seconds),Si(e,e.loadout.stats.maxHp*t.help.healFraction)``]
  - Tidy Bot (`tidy`): pulls all gems and coins within 600. Verified. [sim-DQNACfZS.js: ``s*s+c*c<=a&&(n.vacuum[t]=1)}q(e,`pickup`,r,i,40,t.paint)``]
- Bot Beacon pickup / Bot Dock: spawns a swarm of 8 Zapper-type bots for 6 s around you. Verified. [sim-DQNACfZS.js: ``let s=o/t.swarmSize*j,c=vo(e,{x:r+C(s)*t.swarmRadius*3,y:i+A(s)*t.swarmRadius*3,help:ho``]

### Poteto visits
- Visits once per run (visitChance 1) at a random time between 4:00 and 12:00. Verified. [boot-DIJlLGwy.js: ``function xn(e,t){let n=e.next()<t.visitChance,r=e.range(t.windowSec[0],t.windowSec[1]);return n?Math.round(60*r):-1}``]
- Walks up and bonks Tibo: a 1.5 s stun (outside the story ending). With 25% chance it also drops a gift chest. Verified. [sim-DQNACfZS.js: ``e.player.stunTicks[e.me]=Math.round(60*e.cfg.poteto.stunSec)``] [sim-DQNACfZS.js: ``r.gift?function(e,t){``] [boot-DIJlLGwy.js: ``function Sn(e,t){return e.chance(t.giftChance)}``]
- Gift chest: 5 rewards. First up to 1 evolution/union if one is ready; then the 2 non-gold gifts are taken in order from a table, each kind at most once per chest when possible: (1) `catalyst`: grants the missing catalyst passive of a max-level base weapon (only if no evolution was used and a passive slot is free); (2) `weaponLevel`: +1 level to a non-max base weapon (sorted to prefer weapons that have an evolution); (3) `newWeapon`: the first weapon you lack from Peeler, Mash Wave, Tot Toss, Starch Bolt, Hash Boomerang, Spud Lob, Gravy Boat, Starch Chain, Deep Fryer, Chip Shuriken, at level 1; (4) `itemLevel` (despite the name, +1 level to a non-max passive). Remaining slots are gold worth `round(100 × greed)` each. Verified. [sim-DQNACfZS.js: ``var Yo=[[`catalyst`,function(e,t){``] [sim-DQNACfZS.js: ``i=r.newWeapons.find(e=>n.weapon(e)===void 0&&!n.retired.has(e)&&!n.banished.has(e))``] [sim-DQNACfZS.js: ``let t=Math.round(e.cfg.poteto.giftGold*e.loadout.stats.greedMult)``]

### Alex
- Revealed when the boss "amusing" dies; joins with 25% chance in standard runs (100% in Story), otherwise "asleep". Verified. [sim-DQNACfZS.js: ``n.def[t]===Os&&fe(e.alex)===`pending```] [boot-DIJlLGwy.js: ``function st(e){return e.revealedTick===-1?`pending`:e.due?`joined`:`asleep`}``]
- When joined: follows Tibo; every 9 s throws its head 70 units behind you; for 4 s pests within 85 are lured to it, then it bursts for `30 × damageMult` in radius 51 with knockback. Verified. [sim-DQNACfZS.js: ``Y(e,n.burstDamage*e.loadout.stats.damageMult,r,-1,n.burstKnockback),vi(e,t.headX,t.headY,n.lureRadius*n.burstRadiusShare)``]

### Pickups (boot `si`: xp, gold, heal, magnet, chest, reroll, skip, banish, item, beacon)
Effects on collection. Verified. [sim-DQNACfZS.js: ``o===D.magnet?gs(e):o===D.reroll?r.rerolls++:o===D.skip?r.skips++:o===D.banish?r.banishes++:o===D.beacon&&yo(e)``]
- xp: value × growthMult. gold: value × greedMult (× gold rush). heal: restores its value (30 HP from drops). magnet: pulls all gems and coins. reroll/skip/banish: +1 each. beacon: Grok bot swarm. chest/item: must be stood on to open (1 s / 0.75 s; boss & Poteto chests 1.5 s). Verified.
- Normal pest kill drops (independent of XP gem): heal 0.4%, magnet 0.12%, reroll 0.18%, skip 0.12%, banish 0.08%. Verified. [sim-DQNACfZS.js: ``let r=e.lootRng.next(),i=.004;r<i?J(e,`heal`,t,n,30):(i+=.0012,r<i?J(e,`magnet`,t,n,1)``]
- Elite kill: gold coin worth 10 × the biome's goldMult (always), chest, 50% reroll, 25% banish, 10% Bot Beacon. Verified. [sim-DQNACfZS.js: ``r.chance(.5)&&J(e,`reroll`,i+8,a,1),r.chance(.25)&&J(e,`banish`,i-8,a,1),void(r.chance(.1)&&J(e,`beacon`,i,a+8,1))``]
- Boss kill: XP gem, 25-gold coin (× biome) and a chest. Verified. [sim-DQNACfZS.js: ``J(e,`xp`,i,a,o.xp*s.xpMult),J(e,`gold`,i+6,a,25*s.goldMult)``]

## 7. Boss and elite schedule

The wave table (boot `zi`, rows per minute) drives bosses, elites and events at each new minute. Verified. [sim-DQNACfZS.js: ``!0===n.elite&&cs(e),n.boss===void 0||``] [boot-DIJlLGwy.js: ``je={rows:Ae,afterLast:`postWin`}``]

| Minute | Boss (game name) | Elite | Events |
|---|---|---|---|
| 0 | | | |
| 1 | | yes | |
| 2 | amusing | | Fry Fly Swarm |
| 3 | Colorado Queen (`beetle-queen`) | yes | Golden Scarab |
| 4 | The Masher | | |
| 5 | | yes | Fry Fly Swarm |
| 6 | Late Blight | | Ring of Hay Bales |
| 7 | Sir Strawman | yes | Golden Scarab |
| 8 | The Fryer King | | Fry Fly Swarm, Harvest Moon |
| 9 | | yes | Ring of Hay Bales |
| 10 | The Great Wireworm | | Golden Scarab |
| 11 | | yes | Fry Fly Swarm |
| 12 | The Mandoline | | |
| 13 | | yes | Ring of Hay Bales |
| 14 | The Deep Freezer | | Golden Scarab |
| 15 | | yes | Fry Fly Swarm, Harvest Moon |
| 16 | Grater Golem | | Ring of Hay Bales |
| 17 | Compost Titan | yes | Golden Scarab |
| 18 | Ketchup Kraken | | Fry Fly Swarm |
| 19 | | yes | Ring of Hay Bales |
| 20 | The Harvester | | Fry Fly Swarm |

Source row example: [boot-DIJlLGwy.js: ``{minute:20,minEnemies:480,maxEnemies:500,interval:.14,batch:14,tiers:[0,0,0,0,1],boss:`harvester`,events:[`fly-swarm`]}``] Verified.
- Bosses spawn in a random direction at half the smaller view dimension + 20 from you (so roughly at the screen edge; "off-screen" is inference). Verified. [sim-DQNACfZS.js: ``r=.5*Math.min(e.field.width,e.field.height)+20``]
- Boss HP = `def.hp × (1+curse) × 4^overtime × hpStep × difficulty.bossHp`, hpStep = 1 before 16:00, 3 from 16:00, 4 from 18:00, 6 from 20:00. Damage scales with the pest damage curve. Verified. [sim-DQNACfZS.js: ``let n=e[0].hpScale;for(let r of e)r.minute<=t&&(n=r.hpScale);return n}(e.cfg.bosses.hpSteps,e.runClock/60)*e.cfg.level.bossHp``]
- Elites: HP is interpolated along the curve (300 at 1:00, 390 at 3:00, 750 at 5:00, 1300 at 8:00, 2400 at 10:00, 10000 at 15:00, 18000 at 17:00, 32000 at 20:00), × (1+curse) × 4^overtime × difficulty.eliteHp; damage ×1.6; speed 0.95–1.3; body 1.7× larger; 12× XP; always drop gold and a chest; enemy tier from the curve (2→5). Verified. [sim-DQNACfZS.js: ``a.radius[n]=1.7*(a.radius[n]??0),a.damage[n]=(a.damage[n]??0)*r.damage``] [sim-DQNACfZS.js: ``a.xp[n]=12*(a.xp[n]??0),a.goldChance[n]=1``]
- At 20:00 (`win.timeSec` 1200) the run is marked won and a "You survived 20:00!" message is shown; `win.mode` is `continue`, so the run simply keeps going. Verified. [sim-DQNACfZS.js: ``let t=e.cfg.win.mode;switch(t){case`continue`:return;``] [boot-DIJlLGwy.js: ``message:[`You survived `,[`minutes`],`:00!`]``]
- `win.finalBoss` = harvester is only used by the `finalBoss` win mode (invincible Harvester with 1.6× speed, 10× damage); no difficulty or Story config selects that mode in this build, so The Harvester arrives as the normal minute-20 wave boss. Verified that the code path exists and that `Ie` does not override `win` for standard difficulties; "unused" is inference. [sim-DQNACfZS.js: ``n.set(t,x.Invincible),n.speed[t]=1.6*(n.speed[t]??0),n.damage[t]=10*(n.damage[t]??0)``]
- The UI also contains an unused-by-default win panel: "Keep going" / "Enemies grow stronger every minute" and "End the run" / "Take the win" (shown for the `choose` mode). Verified strings; reachability is inference. [choices-7yGAe9Ru.js: ``message:[`Keep going`]}),desc:e._({id:`tnJm5o`,message:[`Enemies grow stronger every minute`]``]
- After the last row (from minute 21 on, `postWin`): every minute an elite spawns, a boss spawns cycling The Fryer King → The Mandoline → The Masher → Grater Golem → Compost Titan → Ketchup Kraken → The Harvester, and an event alternates Fry Fly Swarm (even minutes) / Ring of Hay Bales (odd). Verified. [sim-DQNACfZS.js: ``case`postWin`:(function(e,t){cs(e);let n=t-e.waves.rows.length;``] [boot-DIJlLGwy.js: ``Me=[`fryer-king`,`the-mandoline`,`the-masher`,`grater-golem`,`compost-titan`,`ketchup-kraken`,`harvester`],Ne=[`fly-swarm`,`bale-ring`]``]
- Overtime scaling makes everything ×4 HP/damage per minute after 20:00 (section 1), so the post-win phase is effectively endless and lethal. Verified formula; "effectively endless" is inference.
- Nightmare uses the `classic` opening: minutes 0–2 use denser rows (34–35, 75–100, 75–100 enemies). Verified. [boot-DIJlLGwy.js: ``Pe={graceSec:30,graceDensity:.8,rows:[{minEnemies:34,maxEnemies:35``]
- Difficulty `tierLag` (Easy 3) makes enemy tiers follow the wave row from N minutes earlier. Verified. [sim-DQNACfZS.js: ``function ps(e,t){return fs(e,Math.max(0,t-e.cfg.level.tierLag))}``]

## 8. Controls and settings

### Keyboard (from `T.keys` in boot, plus input code)
- Move: WASD or arrow keys (the on-screen hint relabels WASD for AZERTY/QWERTZ/Dvorak/Colemak layouts). Verified. [boot-DIJlLGwy.js: ``var Ur={KeyW:[0,-1],ArrowUp:[0,-1],KeyS:[0,1],ArrowDown:[0,1],KeyA:[-1,0],ArrowLeft:[-1,0],KeyD:[1,0],ArrowRight:[1,0]}``]
- Dash Space; Reroll R; Skip X; Banish B; Back Escape; Play again R; Share S; auto-advance story lines T; skip lines Space. Verified. [boot-DIJlLGwy.js: ``keys:{reroll:`KeyR`,skip:`KeyX`,banish:`KeyB`,back:`Escape`,playAgain:`KeyR`,share:`KeyS`,dash:`Space`,autoAdvance:`KeyT`,skipLines:`Space`}``]
- Pause: P or Escape. Mute: M. Verified. [main.js: ``playKey(e){e!==`KeyP`&&e!==`Escape`||!this.canPause()||this.setPause(this.pause===`none`?`player`:`none`)``] [main.js: ``if(e===`KeyM`)this.controls.toggleSound()``]
- Choice cards get number hotkeys 1, 2, 3… in order; Enter/Space activate the focused button; arrow keys move focus in lists. Verified. [choices-7yGAe9Ru.js: ``let s=re(this.hotkeys.length+1)``] [boot-DIJlLGwy.js: ``function qr(e){return`Digit${e}`}``]
- Dash rules: 48 units over 9 ticks, 5 s recharge per charge, 1 charge base, 6-tick input buffer. Verified. [sim-DQNACfZS.js: ``dash:{distance:48,ticks:9,cooldownSec:5,charges:1,bufferTicks:6}``] During a dash (and `dashGrace` after) Tibo ignores normal damage. Verified. [sim-DQNACfZS.js: ``function pi(e){return e.player.dashShield[e.me]>0}``]

### Touch
- "Drag anywhere to move", "Flick to dash" (a flick of ≥ 22 px within 260 ms), pause button, "Tap to resume". Verified strings/config. [boot-DIJlLGwy.js: ``flickPx:22,flickMs:260``] [boot-DIJlLGwy.js: ``message:[`Flick to dash`]``]

### Gamepad
- Not determined / no gamepad controls found: the only gamepad reference records that a pad was connected (input-device analytics). Inferred. [boot-DIJlLGwy.js: ``e.addEventListener(`gamepadconnected`,()=>this.seen.add(`pad`),t)``]

### Settings (boot `st` defaults; labels from settings-panel)
Defaults: [boot-DIJlLGwy.js: ``var zc={effectsOpacity:Rc(1),shake:`full`,flashes:!0,damageNumbers:!0,hitbox:!1,recommendedPicks:!0``] Verified. Tabs: Sound, Language, Comfort, Graphics, Privacy. [settings-panel-C5ucFufB.js: ``{tab:`comfort`,name:e._({id:`jMucll`,message:[`Comfort`]})``]

| Key | UI label | Default | Notes |
|---|---|---|---|
| `effectsOpacity` | Weapon effects | 1 | slider |
| `shake` | Screen shake | full | Off / Low / Full |
| `flashes` | Flashing effects | on | |
| `damageNumbers` | Damage numbers | on | |
| `hitbox` | Hitbox | off | help: "Shows where shots hit Tibo." |
| `recommendedPicks` | Recommended picks | on | marks one card as recommended (heuristic in picks chunk) |
| `musicVolume` | Music volume | 1 | Sound tab |
| `soundVolume` | Sound volume | 1 | Sound tab |
| `quality` | Quality | auto | Auto / Low / Medium / High |
| `colorVision` | Color-blind mode | off | Off / Protanopia / Deuteranopia / Tritanopia |
| `picker` | (not shown) | {storyDone:false} | run-picker memory |
| `autoAdvance` | (T key) | true | auto-advances story lines |

Verified labels. [settings-panel-C5ucFufB.js: ``M({key:`hitbox`,label:e._({id:`PSN6Nm`,message:[`Hitbox`]}),help:e._({id:`dfnSLw`,message:[`Shows where shots hit Tibo.`]})``] [settings-panel-C5ucFufB.js: ``M({key:`picks`,label:e._({id:`MmtEzI`,message:[`Recommended picks`]}),value:n.recommendedPicks``]
- Recommended pick heuristic (what the "recommended" tag picks): upgrading a weapon whose catalyst you own scores 20; new passives that are a catalyst for one of your weapons get a bonus that rises as the weapon nears max level; Peeler, Mash Wave and Tot Toss get an extra +5; heal is preferred under 50% HP; chest forks pick Unite if weapon slots are full, else Evolve; Moldy Shrine is always declined. Verified. [picks-D6O4eKt0.js: ``return!r.isNew&&n?20:r.id===`reset-button`?9.5:``] [picks-D6O4eKt0.js: ``case`curseShrine`:return{type:`close`}``]
- The Analytics toggle lives in Privacy: "Anonymous gameplay stats help poteto improve the game. No name, account or IP address is recorded." Verified. [settings-panel-C5ucFufB.js: ``Anonymous gameplay stats help poteto improve the game. No name, account or IP address is recorded.``]

## 9. Modes

- Picks and captions (UI): Story "A short first game. Play this first."; Easy "Fewer, weaker pests and a tougher Tibo."; Normal "The game as designed."; Hard "More pests, harder hits, tougher bosses."; Nightmare "Crowds, a curse and no revives." Verified. [boot-DIJlLGwy.js: ``caption:h._({id:`IyKM4g`,message:[`A short first game. Play this first.`]})``] [boot-DIJlLGwy.js: ``caption:h._({id:`_c47F1`,message:[`Crowds, a curse and no revives.`]})``]
- Story runs use the Normal difficulty table plus the story script. Verified. [boot-DIJlLGwy.js: ``function ua(e){return e===`story`?{mode:`story`,difficulty:ca}:{mode:`standard`,difficulty:e}}``]

### Difficulty table (`Ne` in sim, applied by `Ie`)
| | Easy | Normal | Hard | Nightmare |
|---|---|---|---|---|
| crowd size (`alive`) | ×0.55 | ×1 | ×1.25 | ×1.36 |
| pest HP | ×0.5 | 1 | ×1.2 | ×1.75 |
| enemy damage | ×0.4 | 1 | ×1.1 | ×1.3 |
| boss HP | ×0.5 | 1 | ×1.25 | ×1.25 |
| elite HP | ×0.5 | 1 | ×1.25 | ×2 |
| Tibo max HP | ×2 | 1 | 1 | 1 |
| XP | ×1.5 | 1 | 1 | ×1.5 |
| extra revives | +2 | 0 | 0 | revives disabled |
| start curses | 0 | 0 | 0 | 1 (+0.1 curse, 1 curse taken) |
| enemy tier lag | 3 min | 0 | 0 | 0 |
| wall-event pests | ×0.15 | 1 | 1 | 1 |
| overtime hold | 60 s | 0 | 0 | 0 |
| crowd ramp / floor | default | default | own ramp, floor 85% | own faster ramp, floor 85%, early damage ramp time ×0.2, `classic` dense opening |

Verified. [sim-DQNACfZS.js: ``Ne={easy:{...Me,alive:.55,pestHp:.5,damage:.4,bossHp:.5,eliteHp:.5,maxHp:2,xp:1.5,addedRevives:2,tierLag:3,wallPests:.15,overtimeHoldSec:60``] [sim-DQNACfZS.js: ``nightmare:{...Me,alive:1.36,floorShare:.85,earlyRamp:1,earlyRampTime:.2``] [sim-DQNACfZS.js: ``opening:`classic`,pestHp:1.75,damage:1.3,bossHp:1.25,eliteHp:2,xp:1.5,allowRevives:!1,startCurses:1``]
- Nightmare's start curse: +0.1 curse and +1 curse taken per start curse. Verified. [sim-DQNACfZS.js: ``n.shrineTotals.curse+=.1*t,n.cursesTaken+=t,B(e)``]

### Story mode script (`sim.Yt`)
All Verified from config.json `sim.Yt` / sim-DQNACfZS.js `M={startChest:`.
- Start chest 56 units to the right. Tibo is on a leash (radius 220) until he opens it; nag lines at 8/16/24 s, then he is pulled in ("jailed") at 32 s. Contents: Peeler L4, Tot Toss L3, Thick Skin L2. [sim-DQNACfZS.js: ``contents:{weapons:[{id:`peeler`,level:4},{id:`tot-toss`,level:3}],passives:[{id:`thick-skin`,level:2}]}``]
- First rush: crowd ramps 10→200 over the rush, then the boss "amusing" lands (`landTicks` 1800 = 30 s into the story phase; its `heal:1` field is not traced, so "heals Tibo" is inference). First-rush pests have ×3 HP, but Tibo's first hit on a non-elite always kills, and his first kill grants level 2. [sim-DQNACfZS.js: ``story:{firstRushHp:3,secondRushHp:.3,secondRushXp:0,bossHp:2.2,bossDamage:1.6,bossSpeed:2.4``] [sim-DQNACfZS.js: ``firstKillLevel:2,firstHitKills:!0``]
- Killing amusing reveals Alex (100% join in Story) and starts the second rush (crowd 220→400, pests ×0.3 HP, no XP), followed by Poteto's visit. [sim-DQNACfZS.js: ``secondRush:{peakTicks:900,alive:{from:220,to:400},everySec:{from:.2,to:.06},batch:3,reach:200}``]
- In Story, HP floors at 1 during the first rush, and during the second rush once Poteto's visit is due. Verified. [sim-DQNACfZS.js: ``return t===`firstRush`||t===`secondRush`&&function(e){let t=e.visitor``] In other story phases, reaching 0 HP "knocks" Tibo and the story revives him, each time with a growing boost (+0.15 damage and +0.1 move speed scaled by `n + n(n-1)/2`). [sim-DQNACfZS.js: ``function ft(e,t){return t+e.boostGrowth*t*(t-1)/2}function pt(e,t){return ft(e,t)*e.boostMight}``]
- Ending: Poteto visits 900 ticks after Alex joins and delivers lines (`inTheGame`, `foundYou`, `storyMode`, `noobs`, `madeSure`, `laugh`, `napTime`), knocks Tibo out, then `realDifficulty`. Reaching this ending marks Story done for the run picker. [sim-DQNACfZS.js: ``ending:[{kind:`visit`,afterJoinTicks:900}``]
- Story config overrides: catalystGuaranteeLevel 6, no random Poteto visit, only POIs crops, Tater Magnet, Spud Freezer, Frenzy Fryer, Bot Dock, Tater Lantern, Seed Vault; waves are only `reset-zombie` pests. [sim-DQNACfZS.js: ``onlyPois:[`crops`,`taterMagnet`,`spudFreezer`,`frenzyFryer`,`botDock`,`taterLantern`,`seedVault`]``]
- End-of-story picker text: "Now play the real game." Verified. [death-flow-C6ztfY2s.js: ``message:[`Now play the real game.`]``]

### Run sharing links (`/r/`)
- The end-of-run share builds a URL `https://tibo.dog/r/?run=…&<stats>=…` with base64url-encoded run data (seed, stats, biomes, Alex, tally, build). Links over 8192 chars or with a bad format/ID are ignored. Verified. [run-address-BpTkpKsy.js: ``function Ye(e,t){let n=new URL(`/r/`,e)``] [run-address-BpTkpKsy.js: ``if(t.length>8192)return{kind:`invalid`,fault:`too-long`}``]
- Opening a link shows a "Shared run" stats panel with a "Play" button that starts a new game (test id `play-new`; not a replay of the shared seed, inferred). [shared-run-2uiYdqA3.js: ``message:[`Shared run`]``]
- Share copy says the post is for X ("Share on X", "Copy the post, then paste it into a post or reply on X."). Verified. [death-flow-C6ztfY2s.js: ``message:[`Share on X`]``]

## 10. Dogs

- First dog: a stray-dog POI is placed 110 units from the start (at angle 0.6 rad), or at the nearest free spot if that overlaps another POI. Verified. [sim-DQNACfZS.js: ``let n=this.cfg.world.chunkSize,r=this.cfg.dogs.firstDogDistance,i=C(.6)*r,a=A(.6)*r``]
- Other strays appear as `dog` POIs (biome poiWeights). Breed is weighted: Retriever 12, Terrier 12, Beagle 10, Collie 10, Corgi 10, Dachshund 10, Greyhound 8, Saint Bernard 8; legendary breeds have weight 0. Verified. [sim-DQNACfZS.js: ``let n=t.kind===`dog`?function(e){let t=e.weighted(c.dogs,e=>e.weight);return t===void 0?`retriever`:t.id}(t.rng):null``]
- Legendary dogs: per run seed, each non-fusion legendary (Link the Pomeranian, Zelda the Chihuahua-Pomeranian) is independently "in the run" with chance 1/6; dog POIs in chunks whose centre is at least 1200 units from the origin take them from that queue. Verified. [run-extras-CdCBynDO.js: ``let t=I.filter(t=>new l(a(`${e.seed}:legend:${t.id}`)).chance(e.chance)).map(e=>e.id)``] [sim-DQNACfZS.js: ``rollLegend(e){if(this.legendary&&!(e<1200))return this.legendQueue.shift()}``]
- Fusion: holding Link and Zelda fuses them into Zelda & Link (keeps the higher level). Verified. [boot-DIJlLGwy.js: ``ue=[{parts:[`pomeranian`,`pomchi`],into:`zelda-and-link`}]``]
- Joining: walking onto a stray of a breed you already have levels that dog up; otherwise it joins if the pack has room (maxPack 3); if full you get a swap choice ("Swap out {member}" / "Keep my pack"). Verified. [sim-DQNACfZS.js: ``if(i>=0)return mr(e,i),`leveled`;if(n.pool.count>=e.cfg.dogs.maxPack)return`full```] [choices-7yGAe9Ru.js: ``message:[`Keep my pack`]``]
- Dog levels: max level = number of levelUps + 1 = 5. Per level: ability power × `power`, ability cooldown × `every`, aura × (1 + sum of `aura`). Verified. [sim-DQNACfZS.js: ``function ct(e,t){let n=e.levelUps,r=1;for(let e=0;e<t-1;e++)r*=n[e]?.power??1;return r}``] [sim-DQNACfZS.js: ``function ut(e,t){let n=e.levelUps,r=1;for(let e=0;e<t-1;e++)r+=n[e]?.aura??0;return r}``]
- Dog Kennel (training): buy levels for a pack dog at `kennelPrices[level-1] × chestPriceMult` = 120 / 240 / 450 / 720; up to 3 buys per kennel. Verified. [picks-D6O4eKt0.js: ``let o=t.cfg.dogs.kennelPrices[i-1];return o===void 0?-1:Math.round(o*t.loadout.stats.chestPriceMult)``] UI: "Train up to # more levels here, then the kennel closes". [choices-7yGAe9Ru.js: ``Train up to `,`#`,` more levels here, then the kennel closes``]
- Every dog's aura is added to your stats like an item (e.g. Beagle luck +0.1, Corgi armor +6). Verified. [sim-DQNACfZS.js: ``e.pool.isAlive(r)&&gt(n,{mods:i.aura,times:ut(i,e.level[r]??1)})``]
- Ability kinds (Verified from `Tl`/`xl` in sim-DQNACfZS.js unless noted):
  - `bite` (Terrier "Pip"): darts at the nearest enemy within range 110 and deals `22 × power × damageMult`. [sim-DQNACfZS.js: ``Y(e,l.damage*o*e.loadout.stats.damageMult,s,7,1.5)``]
  - `rescue` (Saint Bernard "Barrel"): when HP < 40%, runs to you and heals `25 × power`.
  - `zoomies` (Greyhound "Zoom"): sprints 150 units through enemies, `30 × power × damageMult` to all in the line.
  - `fetch` (Retriever "Biscuit"): pulls gems/coins/snacks within `120 × sqrt(power)` (not chests/items).
  - `herd` (Collie "Moss"): pushes enemies around you within `46 × sqrt(power)` back.
  - `dig` (Dachshund "Frank"): digs `round(6 × power)` coins; 20% chance of an extra find (70% a 30-HP snack, else a reroll). [sim-DQNACfZS.js: ``e.lootRng.chance(n.bonusChance)&&(J(e,e.lootRng.chance(.7)?`heal`:`reroll`,a,o-6,30)``]
  - `sniff` (Beagle "Scout"): points to the nearest crate/shrine/dog-type POI and drops `round(3 × power)` coins.
  - `bark` (Corgi "Waffles"): freezes nearby non-hidden enemies within `60 × sqrt(power)` for `1 × sqrt(power)` s; bosses are not affected per UI text. [sim-DQNACfZS.js: ``a.has(s,x.Hidden)||(a.freezeT[s]=Math.max(a.freezeT[s],r)``]
  - `puff` (Link, legendary): holds fluff charges (1, 2 from level 3) that cancel the next hit; when a charge is spent it sneezes pests away (push 220, stun 0.5 s from level 5). [sim-DQNACfZS.js: ``if(!r&&c!==null&&e.legend.fluff>0)return c.sneeze(e,t*(1-Rr(s.armor,i,e.cfg))),!1``]
  - `listen` (Zelda, legendary): marks the nearest elite/loot runner within 600 (1/1/2/2/3 marks by level) for 8 s × power: +25% damage taken. [run-extras-CdCBynDO.js: ``return n.marks[Math.min(r,n.marks.length)-1]??1``]
  - `eclipse` (Zelda & Link): both of the above, plus every 50 s a corona that adds a fluff charge and marks every pest within 110 (+10% for 1 s). Verified in run-extras-CdCBynDO.js.
- Dog names/descriptions are in en-content (`content.dog.<id>.name/.breed/.desc`), e.g. "Darts at the nearest enemy and bites it, about once a second." Verified.
