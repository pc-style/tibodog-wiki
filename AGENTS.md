# tibodog-wiki agent rules

Many agents work in this repository at the same time: the monitor and its updater workers, prose and measurement workers, UI work and release coordinators. These rules keep them from guessing and from overwriting each other. Skills under `.claude/skills/` (`wiki-update`, `playing-tibo`) add task-specific steps on top of these rules.

## Shipping

- **Deploy without asking.** Pushing ordinary changes to `main` and deploying them to production is pre-authorized. Do not stop to ask for approval.
- **Commit and push often.** Use small, coherent commits that each pass their checks. Do not sit on large uncommitted work.
- **Before every push:** run `git fetch origin`, rebase your own commits onto `origin/main`, and rerun the checks that cover your change:
  - `node build.mjs`;
  - `node tools/check-quotes.mjs <assets dir>`, which must report 0 unresolved;
  - `node check-middleware.mjs`;
  - `node --test tools/*.test.mjs pages/*.test.mjs`.
- **Never force-push, `reset --hard`, or discard changes you did not make.** Other agents may share the checkout. Rebase only a tree whose uncommitted changes are your own.
- **One deployment owner at a time.** A push to `main` does not deploy production on its own; someone creates the Vercel production deployment. During concurrent work, agree on a single deployer and do not race. If a coordinator or the monitor owns the deploy, push and hand over the commit SHA.
- **Done means live.** Work is finished only when:
  - the production deployment's commit equals `origin/main`, as reported by `/api/index.json` `meta.wiki.commit` on https://tibodog-wiki.vercel.app;
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
