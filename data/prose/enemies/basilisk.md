## How it works

This is a **Court crowd member**, not its armoured Shell namesake. It walks toward Tibo and can route around Court maze walls; its catalog `chase` behavior adds no separate projectile, windup or charge. Court spawning replaces its catalog speed with **36**, base HP with **7200 × the spawn HP scale**, and XP with 18. Its body/contact damage still passes through the ordinary enemy systems. <small>[endgame-sim-BAa_QrvO.js: `` c=A.crowdHp,l=A.crowdSpeed,u=A.crowdXp ``]</small> <small>[court-D-UgUxfV.js: `` crowdHp:7200,helperHp:18e3,attendantHp:12e3,crowdSpeed:36 ``]</small>

Nearby banner, mender and shell helpers can speed it up, heal it or protect it. Those are roles of the nearby helper, not extra innate attacks for this species. Separating it from helpers removes their range-limited support; see [Court](/endgame#court).

Controlled checks on `main-DwGb2BE_.js`, Standard/Normal, seeds `s1/s2/s3`: `node tools/probe-endgame-roles.mjs` used original phase constructors, spawners and consumers with supplied roles, clocks, positions and HP. These are client-rule checks, not a naturally reached encounter, survival advice, Nightmare timing or server verification. The fixture checked original crowd spawning and the 36-speed override for this species; helper range interactions are checked separately. Maze navigation and natural crowd encounters are not measured.
