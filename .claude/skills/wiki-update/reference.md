# wiki-update reference

Edge cases behind the steps in SKILL.md. Each section says what goes wrong and what to do. Delete an entry when a tool starts enforcing it.

## Sources and archive

- `official-data.mjs` imports the public schema-1 index, ten catalogs and every listed locale. The index must match the mirrored game commit before and after download; byte counts, IDs, definitions and English text are cross-checked. Config/difficulty retain the explicit extracted fallback (public config returns 403); other failures never silently fall back. Per-resource hashes and URLs are retained in `.cache/<main>/official-data.json`.
- `numeric-update.mjs` accepts only finite numeric replacements in an unchanged structure, with a whole reachable-build AST comparison that preserves strings, property keys, operators and control flow. It requests writing when a changed value appears in the affected guide; never blind-replace numeric prose or relabel historical measurements. Unmapped numeric code constants, new fields/entities and changed text/code/art fail closed for documentation or schema work, not a routine full-build review.
- `auto-update.mjs` runs in a clean isolated Git worktree and preserves failures. `.amp/detector/automatic.lock` means another automatic process owns delivery; after a crash inspect its process/result before removing a stale lock. `agent-owner.json` reserves delivery for a scoped writer/schema worker. Queue callbacks retry result delivery rather than repeating completed jobs. Successful jobs do not append a model message.
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
- The approved `journal-only` fast path in `update.mjs --apply` (including `--auto`) precedes general extraction. `journal-only.mjs` proves unchanged next→dated graduations: unique message identities, exact text/kind/about/IDs, retained order and existing dated groups. The official grouping date may differ from the original UTC publication date; keep that timestamp and prior source-introduction history separately, never backdate introduction to the group. Known pure journal data may move, but helpers/rendering/sorting, every other reachable source/art file and numeric values must match. Reviewed baseline history, archived HTML/assets/digests, successful full/panel browser evidence and fresh matching official API catalogs are mandatory. Unknown shapes, missing evidence, changed notes or any other change retain review; do not widen the predicate or manually override it for an update.
- Successful proof reuses registry/config/content/icons, maps current citation sources by graph identity, retains prior introduction history and appends original publication timestamps to the audit. `.cache/<main>/journal-proof.json`, `report.md` and measured proof/API/preparation/gate stages preserve evidence. Only passing import build/quotes/middleware returns `journal-only`; a failure restores unreviewed status. The automatic publisher still executes every existing test, rebase, citation, deployment and all-published-page gate. Measurement alone never grants eligibility. The standalone `journal-only.mjs` CLI remains proposal/local-unreviewed preparation only; use the normal update/delivery entry points, not that CLI, for publishing.
- Check the live **What's new** panel in a browser (`using-agent-browser`): the current group and every collapsed older day, in the game's display order (its comparator, not declaration order). If WebGL 2 fails in the orb, try SwiftShader flags; a blank screen is not a check.
- Official grouping is not when a mechanic first appeared. A note moving to an older code is not new; an omitted note is not a removal. Keep publication dates separate from observation times. The history and its limits live in `data/journal-audit.md`.

## Shadow replay

- `node tools/shadow-update.mjs <old main> <new main> [--browser]` writes a unique `.cache/shadow/<run>/` directory. `receipt.json` records actual stage start/end/duration and failure, wiki/tool/source hashes, and explicitly unmeasured production stages. `packet.json` contains whole-build comparison, stable-ID journal changes with both sides, prior wiki evidence and judgment limits. Neither file grants automatic eligibility or review approval.
- Browser replay runs the archived game on a temporary loopback server, expands every journal date and compares every ordered text/kind/date/code record. It derives the current display code from the requested build, not today's game. A separate server-rendered full changelog is checked only when the live entry matches before and after capture; historical full-page HTML is not archived and is reported unavailable, never synthesized. Archived browser evidence is not a replacement for the required live-panel check.
- If a prior shadow run captured the full page before the game advanced, add `--full-receipt <prior run>/receipt.json`. It reuses only the saved `full.html` whose digest, main and journal source match that receipt's successful capture stage; it still reruns browser record verification. A failed later browser stage does not invalidate a separately successful capture stage.
- Missing archives, digest differences, extraction/schema errors, blank/wrong-build browser pages, collapsed dates and record mismatches preserve failed receipts and exit nonzero. Without `--browser`, the browser stage is explicitly not run. No data, prose, owner reservation, queue, Git ref, CI subscription or deployment is changed. Existing publishing decisions and final gates remain unchanged.

## Required measurement collection

- `tools/update-measurements.mjs` writes per-process JSON receipts incrementally to `.amp/detector/measurements/`; `TIBO_MEASUREMENTS_DIR` carries the monitor's directory into isolated automatic worktrees. Event IDs and parent IDs link queue/import/delivery. Receiver timestamps survive owner holds; old queued jobs first observed at execution explicitly lack the original queue delay. Each stage records UTC boundaries, monotonic elapsed time, status and failure exit/signal without storing command arguments, output, environment or webhook credentials. A hard-killed process remains `running` (active or interrupted), not successfully completed.
- Worker sessions span real wall time, including thinking and waits, not active inference time. Export/ingest receipts across orbs using the normal thread file-transfer tools before archiving workers; never assume shared `.amp` state. A worker that cannot finish still exports failed/blocked evidence. `worker-finish complete` requires measured successful build/quotes/middleware/tests/push/live stages; it is not a replacement for the underlying checks.
- `worker-finish` calls `amp usage --details` once for the session's UTC range and exact thread. Reported total tokens include input/cache traffic; rounded orb hours and Amp-recorded charges are not provider invoices or stage attribution. Missing credentials/rows, changed format, late postings or missing model data remain explicitly unavailable. No AI turn is spawned to measure AI. Do not sum overlapping snapshots or parent/child durations.
- `node tools/measure-update.mjs report` rebuilds human-readable `report.md` and machine-readable `report.json` from durable receipts. The monitor serves the continuously refreshed, read-only report with supervised `node tools/measure-update.mjs serve` and a portal; only the report routes are exposed, never directory contents, logs or credentials. Restart `tibo-updates` and reload the detector plugin/skill after changing instrumentation so the existing process picks it up; preserve the owner reservation during activation.
- Historical backfill: `node tools/measure-update.mjs backfill <receipt.json> ...` imports existing/replayed shadow receipts idempotently and records build-138-onward history metadata. Replay runtimes and browser failures/unavailable full pages are preserved as replay observations, not original production latency. Build `updated` and journal publication dates are never interpreted as stage or deployment timestamps. Use retained original job/deployment/usage logs when available; mark every missing original stage unavailable, rather than replaying the publisher or synthesizing historical pages.

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
