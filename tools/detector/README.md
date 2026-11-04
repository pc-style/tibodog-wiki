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
active worker and dispatches High workers using its saved procedure. The disabled
schedule retains that procedure; event-driven runs must not re-enable polling.
Keep the monitor unarchived: archiving its thread disables webhook delivery.

## Deploy and operate

Worker configuration is in `wrangler.jsonc`. Deployment needs Cloudflare access
and two secret bindings: `AMP_WEBHOOK_URL` and `ADMIN_TOKEN`. The receiver writes
its capability URL to `.amp/detector/webhook-url` with owner-only permissions;
never print or commit it. These files are Git-ignored and excluded from Vercel.
Never replace an existing secret binding with plaintext or log its value.
If commissioning the monitor before the repository ignore rule is available,
locally exclude `.amp/detector/` in `.git/info/exclude`. The saved procedure
allows the exact commissioned receiver as host wiring for read-only fetch/show;
it still forbids rebasing a dirty worktree and preserves other concurrent edits.

Public `GET /health` identifies the service. Authenticated `GET /status` returns
check/cron counts, observed builds, pending notification and latest error.
`POST /check` runs the real detector; `POST /probe` with an `id` sends a
non-inference test delivery through the same webhook. Management endpoints use
`Authorization: Bearer <ADMIN_TOKEN>`. Probe receipts are readable through the
monitor's `tibo_detector_receipts` tool. Enable the `* * * * *` cron only after
checking credentials; disable old agent polling only after live tests pass.

Run `node --test tools/detector/detector.test.mjs` for no-change/304, updates,
retry/idempotency, newer-build/rollback, failures and webhook receiver checks.
The original game-updating systemd timer remains disabled.
