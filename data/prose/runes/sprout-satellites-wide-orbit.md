## How it works

Wide Orbit moves the satellite centers **1.6 times farther from Tibo**, but reduces contact damage to ×0.25. At level one and Area 1, the orbit radius becomes **60.8 units**, while each satellite’s own hit radius stays 6. It does not make each satellite 1.6 times wider or fill in the space between Tibo and the ring. Its hit timer, speed and active/rest cycle stay unchanged. <small>[sim-BB0FRU65.js: `` id:`sprout-satellites-wide-orbit` ``]</small>

Satellite centers rotate at **computed speed radians per second**, evenly spaced around an orbit of **definition orbitRadius × √Area**. Each satellite hits within **definition size × Area plus the pest’s body radius**. Area therefore changes orbit distance and contact width by different factors. The controls follow a satellite every tick, independently predict its angle, and put additional bodies 0.25 units inside/outside its outer contact boundary. <small>[sim-BB0FRU65.js: `` t.angle+=r.speed*i ``]</small> <small>[sim-BB0FRU65.js: `` s=n.orbitRadius*Math.sqrt(r.area),c=n.size*r.area ``]</small>

Each pest shares one weapon-slot hit stamp across **all satellites**: the next eligible contact is **24 ticks later**, not 24 ticks per satellite. A separate, deliberately supplied **Area 400** overlap control makes all satellites touch four ordinary-sized bodies simultaneously; each body loses one hit’s damage on ticks 0 and 24, not one hit per satellite. This is a timer control, not an attainable-loadout claim. At ordinary fixture Area, three complete **300-tick active / 180-tick rest** cycles are retained. Rotation pauses during rest; the expiration tick still runs contact checks before the next call enters cooldown. <small>[sim-BB0FRU65.js: `` a=8*W(r)+t.slot ``]</small> <small>[sim-BB0FRU65.js: `` if(e.tick-i.hitStamp[a]<l)continue ``]</small> <small>[sim-BB0FRU65.js: `` else if(t.active>0)--t.active,t.active<=0&&(t.cd=w(r.cooldown)) ``]</small>

Retained command: `node tools/probe-continuous-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Level-one weapons and rune cards are supplied through the original choice handler; this bypasses ordinary max-level acquisition. Only the original weapon and hit systems advance; high-HP aphids do not die, no reward handlers or pickups run, and network access is forbidden. These controls do **not** establish natural acquisition, max-level/evolved/union equivalence, autonomous moving-pest combat, status progression, DPS/survival, server or device behavior. Existing older scenario evidence remains historical.

Examples below are the **s1 supplied level-one fixtures**, not ordinary max-level builds. Damage is HP loss per ordinary-pest pulse/contact; Bonus means the deliberately supplied Amount bonus.

| Bonus | Satellites | Damage | Orbit radius | Hit radius |
|---|---|---|---|---|
| 0 | 2 | 3.5 | 60.8 | 6 |
| 3 | 5 | 3.5 | 60.8 | 6 |
