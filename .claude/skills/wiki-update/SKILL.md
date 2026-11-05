---
name: wiki-update
description: Updates the tibo.dog wiki when the game ships a new build, as the event-driven monitor or as an update worker. Use when the detector wakes the monitor, when dispatched to review a game build, or when Adam asks to update the wiki.
---

# Update the tibo.dog wiki

The Cloudflare detector (`tools/detector/`) checks tibo.dog every minute, archives every build it sees to R2 and wakes the monitor thread `T-41922f7d-7aa9-47ea-9612-ef6df9b9f21a` when the game serves a build the wiki does not document. It repeats the wake-up every 45 minutes while production stays behind. `origin/main` is canonical. Root `AGENTS.md` holds the standing rules (shipping, quiet reporting, who sets policy); this skill holds the method. Edge cases and their reasons are in [reference.md](reference.md); read the part you need.

## Monitor: one check per event

1. `git pull --ff-only`, then `node tools/freshness.mjs`. Treat the event as an observation, not proof.
2. If an update worker from an earlier event is still running, send it the new build with `send_thread_message` and stop. Never start a second worker. On a reminder event, check that worker: if it stopped without shipping, resume it with a message, or start a new worker if it cannot continue.
3. Otherwise run `node tools/update.mjs` (no `--apply`) and act on its last line:
   - `status: identical`: the whole build matches the documented one apart from file hashes and its own commit id. Run `node tools/update.mjs --apply`, then **Deliver** below yourself. No worker.
   - `status: needs-review`: start one worker with `create_thread`, `agent_mode: "medium"`, `features: []` (no Fast) and orb size `a1.medium`. Prompt: "Update the tibo.dog wiki to game build `<main>` following the Worker section of the wiki-update skill. Send your result to T-41922f7d-7aa9-47ea-9612-ef6df9b9f21a with send_thread_message."
   - `status: up-to-date`: if production's `meta.wiki.commit` is not `origin/main`, deploy (Deliver step 3); otherwise nothing.
4. A rollback (the game serves an older build again) is an ordinary update: the wiki follows whatever build is live. Do not ask Adam.
5. After a worker reports success, archive it. Never archive this monitor thread: the detector webhook lives here.

## Worker: review one build, then the next

1. `git pull --ff-only`, `node tools/freshness.mjs`, then `node tools/update.mjs --apply`. The report is `.cache/<main>/report.md`; its **Whole-build comparison** lists every file whose content changed. Old builds missing from tibo.dog come from the archive automatically.
2. Review each changed file in context with each build's own assets (`tools/code-diff.py`, `tools/diff-data.mjs`; reference.md: *Reviewing code*). Unchanged files need no review. The dump and play tools load lazy endgame content through the game's own loader; review the resulting family definitions and rules as well as the base registry. The player also installs each build's original optional combat and area rules.
3. Play what changed. Load `playing-tibo`, run `node tools/play.mjs --build <main> --minutes 5`, and measure each changed weapon, enemy, boss, item or formula on the old and new builds with the same seed and inputs. A journal-only or text-only change needs no play run.
4. Fix the pages: prose in `pages/` and `data/prose/`, citations (`cite(SIM|BOOT|'<chunk>', …)` must point at the file that contains the quote), and the in-game journal (reference.md: *Journal*).
5. In `data/builds.json`, set the build to `reviewed`, write `changes` as one or two plain sentences a player cares about (≤ 280 characters, enforced by `build.mjs`) and put the review detail in `evidence`. Set `updated` to the current UTC time on the entry and in `data/build.json` just before delivery.
6. **Deliver.** Ship this build even if a newer one went live meanwhile, then run step 1 again for the newer build in this same thread. Only when the game went back to an older build, drop the unshipped work and follow the live build.
7. Report to the monitor: commit, deployment, live checks and anything you could not verify.

## Deliver

1. Checks, as separate commands: `node build.mjs`; `node tools/check-quotes.mjs .cache/<main>/assets` (0 unresolved; `--write` fixes quotes that moved verbatim); `node check-middleware.mjs`; `node --test tools/*.test.mjs pages/*.test.mjs tools/detector/*.test.mjs`; `git diff --check`.
2. Commit, `git fetch`, rebase your own commits onto `origin/main`, rerun the checks, push.
3. The push deploys production through Vercel's Git integration; do not create another deployment. Find the deployment for your SHA (team `team_ceF7ek1jhDCXPvwYHv5HrsGM`, project `prj_ezw3MZfNGIIQlXJSKRbpzexA2qtp`). Only if none appears within 2 minutes, create one production deployment for exactly that SHA.
4. Done means live: wait for READY, then check `https://tibodog-wiki.vercel.app/api/index.json` `meta.wiki.commit` equals the latest `origin/main`, `/versions` shows no "Not reviewed yet", and each changed page shows the change. Inspect a screenshot of any changed layout.

## Keeping this skill small

When a method breaks, fix the tool that owns it (`update.mjs`, `same-build.mjs`, `check-quotes.mjs`, `play.mjs`) and its test before adding prose. Add prose only for judgement a tool cannot make, put edge cases in reference.md, and delete a rule once a tool enforces it. Validate with `amp skill info wiki-update` and reload skills after editing.
