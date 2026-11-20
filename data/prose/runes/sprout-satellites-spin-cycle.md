## How it works

Spin Cycle doubles angular speed and scales each contact hit ×0.87 damage. The level-one orbit rotates at **6.4 radians per second**, rather than 3.2, while the damage lockout remains **0.4 s per pest for the whole weapon**. Faster rotation changes when a satellite reaches a pest; it does not halve the contact timer or cause each satellite to get a separate timer. The active/rest cycle stays unchanged. <small>[sim-CJ88SoyL.js: `` id:`sprout-satellites-spin-cycle` ``]</small>

Satellite centers rotate at **computed speed radians per second**, evenly spaced around an orbit of **definition orbitRadius × √Area**. Each satellite hits within **definition size × Area plus the pest’s body radius**. Area therefore changes orbit distance and contact width by different factors. The controls follow a satellite every tick, independently predict its angle, and put additional bodies 0.25 units inside/outside its outer contact boundary. <small>[sim-CJ88SoyL.js: `` t.angle+=r.speed*i ``]</small> <small>[sim-CJ88SoyL.js: `` s=n.orbitRadius*Math.sqrt(r.area),c=n.size*r.area ``]</small>

Each pest shares one weapon-slot hit stamp across **all satellites**: the next eligible contact is **24 ticks later**, not 24 ticks per satellite. A separate, deliberately supplied **Area 400** overlap control makes all satellites touch four ordinary-sized bodies simultaneously; each body loses one hit’s damage on ticks 0 and 24, not one hit per satellite. This is a timer control, not an attainable-loadout claim. At ordinary fixture Area, three complete **300-tick active / 180-tick rest** cycles are retained. Rotation pauses during rest; the expiration tick still runs contact checks before the next call enters cooldown. <small>[sim-CJ88SoyL.js: `` a=8*W(r)+t.slot ``]</small> <small>[sim-CJ88SoyL.js: `` if(e.tick-i.hitStamp[a]<l)continue ``]</small> <small>[sim-CJ88SoyL.js: `` else if(t.active>0)--t.active,t.active<=0&&(t.cd=w(r.cooldown)) ``]</small>

Retained command: `node tools/probe-continuous-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Level-one weapons and rune cards are supplied through the original choice handler; this bypasses ordinary max-level acquisition. Only the original weapon and hit systems advance; high-HP aphids do not die, no reward handlers or pickups run, and network access is forbidden. These controls do **not** establish natural acquisition, max-level/evolved/union equivalence, autonomous moving-pest combat, status progression, DPS/survival, server or device behavior. Existing older scenario evidence remains historical.

Examples below are the **s1 supplied level-one fixtures**, not ordinary max-level builds. Damage is HP loss per ordinary-pest pulse/contact; Bonus means the deliberately supplied Amount bonus.

| Bonus | Satellites | Damage | Orbit radius | Hit radius |
|---|---|---|---|---|
| 0 | 2 | 12.18 | 38 | 6 |
| 3 | 5 | 12.18 | 38 | 6 |
