## How it works

Big Sprout concentrates computed Amount into **one larger satellite**, but first scales damage ×0.2. If N is Amount before focus, damage becomes ordinary damage ×0.2 × [1 + 0.3 × (N − 1)], and Area becomes ordinary Area × [1 + 0.25 × (N − 1)]. The bonuses add per spare satellite; they do not compound. With Amount bonus 0/3, the supplied level-one Amount is 2/5 and the result is one satellite with **3.64/6.16 damage** and **1.25/2 Area**. A single larger satellite is not a guarantee of higher single-target damage. <small>[sim-ChQfHUR1.js: `` id:`sprout-satellites-big-sprout` ``]</small>

Satellite centers rotate at **computed speed radians per second**, evenly spaced around an orbit of **definition orbitRadius × √Area**. Each satellite hits within **definition size × Area plus the pest’s body radius**. Area therefore changes orbit distance and contact width by different factors. The controls follow a satellite every tick, independently predict its angle, and put additional bodies 0.25 units inside/outside its outer contact boundary. <small>[sim-ChQfHUR1.js: `` t.angle+=r.speed*i ``]</small> <small>[sim-ChQfHUR1.js: `` s=n.orbitRadius*Math.sqrt(r.area),c=n.size*r.area ``]</small>

Each pest shares one weapon-slot hit stamp across **all satellites**: the next eligible contact is **24 ticks later**, not 24 ticks per satellite. A separate, deliberately supplied **Area 400** overlap control makes all satellites touch four ordinary-sized bodies simultaneously; each body loses one hit’s damage on ticks 0 and 24, not one hit per satellite. This is a timer control, not an attainable-loadout claim. At ordinary fixture Area, three complete **300-tick active / 180-tick rest** cycles are retained. Rotation pauses during rest; the expiration tick still runs contact checks before the next call enters cooldown. <small>[sim-ChQfHUR1.js: `` a=8*W(r)+t.slot ``]</small> <small>[sim-ChQfHUR1.js: `` if(e.tick-i.hitStamp[a]<l)continue ``]</small> <small>[sim-ChQfHUR1.js: `` else if(t.active>0)--t.active,t.active<=0&&(t.cd=O(r.cooldown)) ``]</small>

Retained command: `node tools/probe-continuous-runes.mjs main-BDQvha6l.js`. **Six supplied-state groups per rune**, Standard/Normal, seeds `s1/s2/s3`, Amount bonus 0/3, crit chance 0. Level-one weapons and rune cards are supplied through the original choice handler; this bypasses ordinary max-level acquisition. Only the original weapon and hit systems advance; high-HP aphids do not die, no reward handlers or pickups run, and network access is forbidden. These controls do **not** establish natural acquisition, max-level/evolved/union equivalence, autonomous moving-pest combat, status progression, DPS/survival, server or device behavior. Existing older scenario evidence remains historical.

Examples below are the **s1 supplied level-one fixtures**, not ordinary max-level builds. Damage is HP loss per ordinary-pest pulse/contact; Bonus means the deliberately supplied Amount bonus.

| Bonus | Satellites | Damage | Orbit radius | Hit radius |
|---|---|---|---|---|
| 0 | 1 | 3.64 | 42.4853 | 7.5 |
| 3 | 1 | 6.16 | 53.7401 | 12 |
