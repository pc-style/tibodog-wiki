# wiki-update reference

Edge cases behind the steps in SKILL.md. Each section says what goes wrong and what to do. Delete an entry when a tool starts enforcing it.

## Sources and archive

- `tools/fetch-build.mjs` mirrors a build's `index.html` and every hashed asset (JS, CSS, images, fonts) into `.cache/<main>/`. Files tibo.dog has deleted come from the detector's R2 archive: `https://tibodog-game-detector.pcstyle.workers.dev/archive/assets/<file>`, `…/archive/<main>/index.html` and `…/archive/<main>/manifest.json` (sha256 per file). Builds before the archive existed (2026-11-05) may be missing; say so rather than claiming a historical check.
- `.cache/` is local. Nothing needs transferring between threads for assets any more; the archive has them. Transfer only unfinished work (a patch) with the thread file-transfer tools.
- If a worker already applied a build, continue its review. Do not rerun `update.mjs --apply --force`: it would compare the build with itself and erase the original report.

## Reviewing code

- `tools/same-build.mjs` compares whole builds: asset names reduced to their role, the build's own commit id masked, references hashed through the import graph. A file listed as changed has different content. Everything else is identical, including which same-role chunk it imports.
- For a changed module, read the change in context. `python3 -I tools/code-diff.py old.js new.js 60` ignores renamed identifiers; config objects can move between `sim` and `boot`, which `diff-data` reports as "no match"/"new export", so match them by keys.
- Pair duplicate chunks of one role by what they import and export, not by filename.
- Compare sprites with each build's own atlas table and PNG. A repacked atlas is not changed art unless the cropped frames differ.
- Before describing dormant code as gameplay, find its caller and check its flag.
- If `node build.mjs` fails with `config object with keys … not found`, look at `cfgBy` in `lib/data.mjs`.
- Difficulty overrides can reference config or helper functions. `dump-build.mjs` locates the owning chunk (including tables moved out of sim) and evaluates the table in a temporary sibling copy so real dependencies resolve. Never substitute guessed constants.
- Endgame catalogs are lazy registrations, not unused data simply because the boot registry initially lacks them. `load-endgame.mjs` invokes the original registration and chunk loader, including registry refresh callbacks and the endgame sim. Family spawn rules can replace catalog HP (including placeholder HP 1); keep raw definitions separate from measured encounter stats. Hydra forms are not extra scheduled phases.

## Playing

- If `tools/play.mjs` cannot find `Game`, the stat enum or the recompute function, fix the lookup as part of the update.
- `loadGame` exposes `extras` from the dedicated run-rules chunk, or the older run-extras chunk, and `Run` installs its original combat and area rules automatically. Direct `new Game` probes must pass `legendary: api.extras?.rules` and `areas: api.extras?.areas` themselves. Keep a no-rules control when testing optional hooks; do not write substitute callbacks.
- Use asymmetric inputs and both sides of boundaries; record seed, inputs, durations and numbers.
- Spawn limits: a late crowd floor raises the ceiling, it does not guarantee that many are alive; keep ordinary limits separate from the hard-cap reserve. Probe the run config and the real spawn/death systems at timing boundaries, with Story and disabled-feature controls. For XP changes, measure the dropped pickup value.
- Limits to state honestly: client replay submission is not server validation; draw cadence is not battery or temperature; Chromium's narrow viewport is not a phone; a forced scenario is not naturally reached gameplay.

## Journal

- `update.mjs` refreshes `data/changelog.json` with `tools/dump-changelog.mjs` and reports additions, removals, revisions and date/code regrouping. If the extractor throws, fix its code-shape lookup and fixture, never the JSON by hand. For a journal-only repair on the same build: `node tools/dump-changelog.mjs <assets> <main> data/changelog.json`.
- Check the live **What's new** panel in a browser (`using-agent-browser`): the current group and every collapsed older day, in the game's display order (its comparator, not declaration order). If WebGL 2 fails in the orb, try SwiftShader flags; a blank screen is not a check.
- Official grouping is not when a mechanic first appeared. A note moving to an older code is not new; an omitted note is not a removal. Keep publication dates separate from observation times. The history and its limits live in `data/journal-audit.md`.

## Pages and citations

- Every quote cites the file that contains it; exact filenames beat same-prefix wrappers. A quote that moved chunk needs its label fixed even if the text is unchanged. Do not loosen `check-quotes.mjs`.
- `data/mechanics-notes.md` is the archival snapshot of the original research and is excluded from the quote check. Leave it unchanged.
- `pages/notes.mjs` strings are template literals: escape backticks.
- Text about past builds belongs in `data/builds.json`, never in `pages/*.mjs` (the updater rewrites chunk names there). In `data/prose/`, `main-*.js` names the build a measurement used and is kept.
- Changed spawn limits reach curse/passive, event and splitter prose too. Keep historical measured runs unchanged and label base XP before any late-run multiplier.
- `update.mjs` also refreshes `data/i18n-names.json` (names in 26 other languages). A changed language list needs `/controls#languages` reviewed.

## Delivery

- `vercel promote` or a rollback turns off automatic production aliasing; promote the next good deployment explicitly.
- A push, READY without the production alias, or cached HTML is not "live". Compare `meta.wiki.commit` with a freshly fetched `origin/main`.
- Capture desktop and narrow screenshots of changed layouts and inspect them; record a short clip only for changed interactions.
