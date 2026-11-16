## How it works

Mash Landing arms when a dash starts and makes **one slam when the dash finishes**, at Tibo's final position. It does not slam at the starting point, every dash tick or once per Amount. It must also have finished its weapon cooldown; the raw cooldown is 0.8 s. Standing still does not trigger it. <small>[sim-CQ8ALNnZ.js: `` if(t.active!==1||ad(e)||(t.active=0,t.cd>0))return; ``]</small>

The slam immediately queues hits for every target whose body overlaps radius `34 × √Area`. Damage and knockback use the weapon's effective stats; it is not a lasting damage pool. Amount does not multiply the slam. Mash Meteor's delayed echo is a separate evolution rule, absent here. <small>[sim-CQ8ALNnZ.js: `` return e.radius*Math.sqrt(t.area) ``]</small> <small>[sim-CQ8ALNnZ.js: `` e.counters.shots++,TS(e,i,a,o) ``]</small>

Controlled checks on `main-DwGb2BE_.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-mechanics-groups.mjs` used real Game idle, dash-start and dash-end controls, then original-consumer fixtures at Area 1/4 and supplied Amount 20. Only dash end cast, radius doubled from 34 to 68, and excessive Amount still made one slam. This does not establish natural-run DPS or survival benefit.
