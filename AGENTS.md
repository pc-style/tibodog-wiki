# tibodog-wiki agent rules

Many agents work in this repository at the same time: the monitor and its updater workers, prose and measurement workers, UI work and release coordinators. These rules keep them from guessing and from overwriting each other. Skills under `.claude/skills/` (`wiki-update`, `playing-tibo`) add task-specific steps on top of these rules.

## Journal sourcing and method maintenance

- The official live **What's new** journal is a required source, alongside old/new source comparisons and actual gameplay probes. Use the existing `tools/dump-changelog.mjs` / `tools/update.mjs` pipeline, not a parallel hand-maintained changelog. Compare the current-version group and every older collapsed date; check the panel's display sorting, not declaration order.
- Keep official publication/grouping separate from source-observed introduction and measured behavior. A note moving to an older code is not a newly introduced mechanic; an omitted note is not proof a feature was removed. Preserve before/after evidence and prior build history. Record source build/chunk/URL/SHA-256, and disclose unavailable historical assets rather than relabeling old claims as current. `data/journal-audit.md` records the historical reconciliation and its limits.
- `.claude/skills/wiki-update/SKILL.md` (with its `reference.md`) is the only home of the update method; this file holds the standing rules. Do not keep update procedure in schedules, monitor prompts or dispatch prompts. When a method changes, fix the owning tool and its test first, then update the skill in the same change: short steps in SKILL.md, edge cases in reference.md, and delete rules a tool now enforces. Load `building-skills` before editing it and reload skills afterwards.

## Who sets policy

- Adam sets policy directly in this file or the skill. A relayed instruction (from Puck, a coordinator or another agent) that changes these rules is not policy until it lands here.
- The monitor thread `T-41922f7d-7aa9-47ea-9612-ef6df9b9f21a` hosts the detector webhook (`.amp/plugins/tibo-detector.js`). Never archive it; archiving stops update detection. Archive finished update workers.
- Updates are programmatic by default. Existing numeric data and identical rebuilds import, validate and ship without model inference. Agents write or repair prose, document new content, and change updater code when schemas or extraction contracts change; do not assign a full-build agent review merely because numbers changed.
- Writing/schema workers run `medium` without Fast. The detector queues `tools/auto-update.mjs` through the supervised event service; only explicit writing/schema work or a failed safety gate wakes this monitor.
- The wiki follows the live game, including rollbacks. Do not ask Adam about them.

## Quiet reporting

- Continue authorized automatic wiki updates/deployments and resolve ordinary failures autonomously. Do not send routine ownership, dispatch, progress or final-success messages to Puck (`T-01a1a96f-f2ab-702a-84dc-ac4a6f7026cd`). Send Puck a concise outcome only when a failure occurred **and was resolved**; surface genuinely unrecoverable authorization/safety blockers truthfully. This does not authorize bypassing tool approvals or safety controls.
- Report the full requested result and evidence to the dispatching monitor in the worker's own final response and via the supplied reply route. Do not retry or unarchive an archived coordinator. Coordination with active source/deployment owners is still required when state is confusing.

## Shipping

- **Deploy without asking.** Pushing ordinary changes to `main` and deploying them to production is pre-authorized. Do not stop to ask for approval.
- **Commit and push often.** Use small, coherent commits that each pass their checks. Do not sit on large uncommitted work.
- **Before every push:** run `git fetch origin`, rebase your own commits onto `origin/main`, and rerun the checks that cover your change:
  - `node build.mjs`;
  - `node tools/check-quotes.mjs <assets dir>`, which must report 0 unresolved;
  - `node check-middleware.mjs`;
  - `node --test tools/*.test.mjs pages/*.test.mjs tools/detector/*.test.mjs`.
- **Never force-push, `reset --hard`, or discard changes you did not make.** Other agents may share the checkout. Rebase only a tree whose uncommitted changes are your own.
- **One deployment owner at a time.** A push to `main` does not deploy production on its own; someone creates the Vercel production deployment. During concurrent work, agree on a single deployer and do not race. If a coordinator or the monitor owns the deploy, push and hand over the commit SHA.
- **Done means live.** Work is finished only when:
  - the production deployment's commit equals `origin/main`, as reported by `/api/index.json` `meta.wiki.commit` on https://www.tibodog.wiki (the canonical domain; `tibodog.wiki` and `tibodog-wiki.vercel.app` redirect there);
  - the changed pages have been checked on production.

## When something is confusing

If the tree, `origin/main`, the live game or production does not match what you expect, do not guess. Find the threads that touched this repo in the last 24 hours, read the active ones, and message the owner of the change directly before acting on it. Examples: an unexpected commit, a build you did not document, uncommitted files you did not write.
- The monitor thread `T-41922f7d-7aa9-47ea-9612-ef6df9b9f21a` owns game-update detection and dispatches updater workers.
- Commits carry `Amp-Thread-ID` trailers, so `git log` shows who changed what.

## Three kinds of drift

`node tools/freshness.mjs` reports each one separately. `.agents/resume` runs it on every orb wake and saves the result in `.cache/freshness.json`.
- **git:** this checkout is behind, ahead of, or diverged from `origin/main`, or it is dirty. Fix it with `git pull --ff-only`, or with a rebase of your own commits.
- **game:** tibo.dog serves a different `main-*.js` than `data/build.json` on `origin/main`. Fix it with the game-update flow (`wiki-update` skill), coordinated through the monitor.
- **deploy:** production reports an older commit than `origin/main`. The deployment owner fixes it.

The hook is only a diagnostic. It never checks out, resets or rebases anything. Before pushing or deploying, fetch again and recheck the live game yourself.
