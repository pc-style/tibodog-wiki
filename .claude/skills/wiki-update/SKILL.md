---
name: wiki-update
description: Updates the tibo.dog wiki when the game ships a new build, as the event-driven monitor or as an update worker. Use when the detector wakes the monitor, when dispatched to review a game build, or when Adam asks to update the wiki.
---

# Update the tibo.dog wiki

The Cloudflare detector (`tools/detector/`) checks tibo.dog every minute and archives builds to R2. Its webhook queues a programmatic update, not an agent turn. `tools/automatic-events.mjs` runs as the supervised `tibo-updates` service and invokes `tools/auto-update.mjs --ship`. Identical rebuilds and existing numeric values import, validate, commit, push and live-check without model inference. Only writing, new content, schema/code changes or failed gates wake monitor `T-41922f7d-7aa9-47ea-9612-ef6df9b9f21a`. `origin/main` is canonical. Root `AGENTS.md` holds standing policy; this skill holds the method. Edge cases are in [reference.md](reference.md).

## Monitor: one check per event

1. On an automatic escalation, read `.amp/detector/jobs/<id>.log` and `.cache/<main>/report.md`. Fetch/fast-forward only a clean tree, then `node tools/freshness.mjs`. Fetch/parse errors are failures, never evidence of no change.
2. Reuse a known active writer/schema worker; never create a duplicate. While one owns delivery, record its URL as `{"thread":"T-…"}` in `.amp/detector/agent-owner.json`; remove that file only after ownership releases. Events then go to the monitor, not a competing automatic shipper. A stopped worker needing judgment is a blocker, not permission to spawn replacements repeatedly.
3. Read **Automatic update decision**. An existing numeric value alone is not a task for an agent. `tools/update.mjs --apply --auto` also accepts only proven unchanged next→dated journal graduations (`journal-only`), including cross-UTC-date grouping while preserving publication and source introduction separately, reusing reviewed extraction before the general importer. Complete whole-build, full/panel browser and official API proof are mandatory; any mismatch retains semantic review. Text, entity, schema, logic, art, citation and unfinished-review changes still refuse automatic writes. Config/difficulty still use extraction because public config currently returns 403. See reference.md: *Journal* for the exact boundary.
   - Writing/new content: start one scoped `medium`, `features: []`, `a1.medium` worker. Give only the affected pages/data paths and required explanation, not a blanket gameplay review. Ask it to reply to this monitor with commit, checks, deployment and live evidence.
   - Schema/extraction or gate failure: diagnose the exact failed contract and fix its owning tool plus regression test. Never bypass a failed check or silently fall back to stale data.
   - A manually delivered event with no existing job: run `node tools/auto-update.mjs --ship`; this owns all delivery steps. Do not independently deploy in parallel.
4. A rollback (the game serves an older build again) is an ordinary update: the wiki follows whatever build is live. Do not ask Adam.
5. Before archiving a finished worker, download its measurement export and run `node tools/measure-update.mjs ingest <export.json>` in the monitor checkout. The monitor's read-only measurement report must include automatic jobs and worker exports. Never archive this monitor thread: the detector webhook lives here.

## Worker: writing, new content or schema work

1. Start a required measurement session: `node tools/measure-update.mjs worker-start <new-main> <event-id>`; keep its returned ID in `TIBO_MEASUREMENT_PARENT` and the dispatch event in `TIBO_UPDATE_EVENT` for every later command. `git pull --ff-only`, `node tools/freshness.mjs`, then `node tools/update.mjs --apply`. Import timing and full journal/browser collection are automatic; the change report is `.cache/<main>/report.md`. Its **Whole-build comparison** lists every changed file. Old builds come from the archive automatically. Icon extraction follows the game's ordered optional atlas manifest/image pairs, including gear sheets.
2. Work only on the reported writing/new-content/schema task. Read changed code when needed to explain a new mechanic or repair an extraction contract (`tools/code-diff.py`, `tools/diff-data.mjs`; reference.md: *Reviewing code*). Do not review unchanged modules or replay ordinary numeric updates.
3. Play only to support new behavioral claims or changed explanations. Load `playing-tibo` and measure the affected behavior on the original old/new engines with equal inputs. Text/journal changes and imported raw stats need no ceremonial five-minute run.
4. Fix the pages: prose in `pages/` and `data/prose/`, citations (`cite(SIM|BOOT|'<chunk>', …)` must point at the file that contains the quote), and the in-game journal (reference.md: *Journal*).
5. In `data/builds.json`, set the build to `reviewed`, write `changes` as one or two plain sentences a player cares about (≤ 280 characters, enforced by `build.mjs`) and put the review detail in `evidence`. Set `updated` to the current UTC time on the entry and in `data/build.json` just before delivery.
6. **Deliver.** Ship the scoped work, then release delivery ownership to the monitor. Do not automatically begin another whole-build review: the next event goes through the programmatic lane. Preserve unshipped work on rollbacks; coordinate rather than discard it.
7. Run `node tools/measure-update.mjs worker-finish <session-id> complete` (or `failed`/`blocked` truthfully), then `node tools/measure-update.mjs export .cache/update-measurements.json`. Report the export path, commit, deployment, live checks and unavailable measurements to the monitor before release/archive. Closing collects actual range-scoped Amp usage when available; never estimate tokens/cost or call review elapsed time inference time.

## Deliver

1. Checks, as separate commands through `node tools/measure-update.mjs run <stage> -- <command> [args]`: stage `build`: `node build.mjs`; `quotes`: `node tools/check-quotes.mjs .cache/<main>/assets` (0 unresolved; `--write` fixes moved quotes); `middleware`: `node check-middleware.mjs`; `tests`: `node --test tools/*.test.mjs pages/*.test.mjs tools/detector/*.test.mjs`; `diff`: `git diff --check`. Use the same wrapper for gameplay/browser/research commands when needed, with descriptive stage names. Do not wrap edits or inference in fake command timings.
2. Commit, `git fetch`, rebase your own commits onto `origin/main`, rerun the checks, push through the wrapper with stage `push`. Measurements do not authorize bypassing any existing gate or ownership reservation.
3. The push deploys production through Vercel's Git integration; do not create another deployment. Find the deployment for your SHA (team `team_ceF7ek1jhDCXPvwYHv5HrsGM`, project `prj_ezw3MZfNGIIQlXJSKRbpzexA2qtp`). Only if none appears within 2 minutes, create one production deployment for exactly that SHA.
4. Done means live: wait for READY, then check `https://www.tibodog.wiki/api/index.json` `meta.wiki.commit` equals the latest `origin/main`, `/versions` shows no "Not reviewed yet", and each changed page shows the change. Run the verification command through the wrapper with stage `live`. Inspect a screenshot of any changed layout.

## Required measurements

Collect on every following update indefinitely, until pcstyle says stop. `update.mjs` and `auto-update.mjs` always record revision-bound stages/failures; changed-build apply also invokes complete journal/browser collection and preserves escalation evidence. A measurement failure is reported, never converted into approval or silently called a pass. All existing classification, gameplay, citation and live publishing gates remain intact.

For an already-applied review or journal-only repair that skips changed-build import, run `node tools/shadow-update.mjs <original-old-main> <new-main> --browser`, then `node tools/measure-update.mjs backfill <shadow-run>/receipt.json`. Do not use `--force` to manufacture a comparison against itself. Worker completion refuses missing measured build/quotes/middleware/tests/push/live stages. See reference.md: *Required measurement collection* for storage, reports and unavailable evidence. No model-only measurement task or monitoring schedule is needed.

## Keeping this skill small

When a method breaks, fix the tool that owns it (`update.mjs`, `same-build.mjs`, `check-quotes.mjs`, `play.mjs`) and its test before adding prose. Add prose only for judgement a tool cannot make, put edge cases in reference.md, and delete a rule once a tool enforces it. Validate with `amp skill info wiki-update` and reload skills after editing.
