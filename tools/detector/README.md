# Game update detector

`tibodog-game-detector` checks the live game's entry-script build and the wiki's
published build every minute. Unchanged builds never call Amp. An ETag avoids
downloading unchanged game HTML. A SQLite Durable Object serializes checks and
persists the known build, pending delivery ID, notification count and errors.
Failed sends retry the same event ID; newer builds replace pending older findings.
A failed review/deployment is not automatically retried by repeatedly launching agents.

The project plugin [tibo-detector.js](../../.amp/plugins/tibo-detector.js) registers
only in monitor thread `T-41922f7d-7aa9-47ea-9612-ef6df9b9f21a`. A changed build
wakes that existing Medium + Fast host, which verifies fresh evidence, reuses any
active worker and follows the Monitor section of the wiki-update skill
(`.claude/skills/wiki-update/SKILL.md`); event-driven runs must not re-enable polling.
Keep the monitor unarchived: archiving its thread disables webhook delivery.

## Watchdog

While the game serves a build that production still does not document, the
detector repeats the `build.changed` event every 45 minutes after the last
notification, with a new event ID, `reminder: true` and `firstNotifiedAt`.
Reminders use the same pending/retry idempotency as the first event and stop
once the wiki catches up. The monitor then checks whether the update worker is
still alive and replaces it only if it stopped.

## Build archive

tibo.dog deletes old hashed assets, so every live build the detector sees is
copied to the R2 bucket `tibodog-game-builds` (binding `ARCHIVE`):

- `builds/<main>/index.html`: the exact HTML served;
- `assets/<name>-<hash8>.<ext>`: content-addressed assets, shared across builds and never re-downloaded;
- `builds/<main>/manifest.json`: `{ main, archivedAt, files: [{ name, size, sha256 }] }`, written last.

The crawl starts at index.html and follows hashed `js, css, png, webp, jpg, svg,
json, wasm, woff2, mp3, ogg, wav` names found in the HTML, JS and CSS. Names that
404 are not assets (a missing main entry is an error). Each check fetches at most
35 assets after notifying and resumes on the next minute from the queue in
`state.archive`. Archive failures go to `state.archiveError`; they never delay or
fail notification. A new live build restarts the crawl; finished manifests remain.

Archived files are public and need no token:
`https://tibodog-game-detector.pcstyle.workers.dev/archive/<main>/manifest.json`,
`/archive/<main>/index.html` and `/archive/assets/<file>`. Assets are served
`immutable`; any other path under `/archive/` returns 404.

## Deploy and operate

Worker configuration is in `wrangler.jsonc`. Deployment needs Cloudflare access
the R2 bucket `tibodog-game-builds` and two secret bindings: `AMP_WEBHOOK_URL` and `ADMIN_TOKEN`. The receiver writes
its capability URL to `.amp/detector/webhook-url` with owner-only permissions;
never print or commit it. These files are Git-ignored and excluded from Vercel.
Never replace an existing secret binding with plaintext or log its value.
If commissioning the monitor before the repository ignore rule is available,
locally exclude `.amp/detector/` in `.git/info/exclude`. The saved procedure
allows the exact commissioned receiver as host wiring for read-only fetch/show;
it still forbids rebasing a dirty worktree and preserves other concurrent edits.

Public `GET /health` identifies the service. Authenticated `GET /status` returns
check/cron counts, observed builds, pending notification, latest error and archive
progress (`archive`: main, done, archived/seen/queued counts; `archiveError`).
`POST /check` runs the real detector; `POST /probe` with an `id` sends a
non-inference test delivery through the same webhook. Management endpoints use
`Authorization: Bearer <ADMIN_TOKEN>`. Probe receipts are readable through the
monitor's `tibo_detector_receipts` tool. Enable the `* * * * *` cron only after
checking credentials; disable old agent polling only after live tests pass.

Run `node --test tools/detector/detector.test.mjs` for no-change/304, updates,
retry/idempotency, newer-build/rollback, reminders, archive crawl/endpoints,
failures and webhook receiver checks.
