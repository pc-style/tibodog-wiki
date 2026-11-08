// Supervised event queue. Long imports/deployments must not run inside Amp's
// 30-second webhook handler. Jobs/results survive process and orb restarts.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recordEvent, startMeasurement } from './update-measurements.mjs';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const queue = join(root, '.amp/detector/jobs');
mkdirSync(queue, { recursive: true });
for (;;) {
  for (const file of readdirSync(queue).filter((f) => f.endsWith('.job.json')).sort()) {
    if (existsSync(join(root, '.amp/detector/agent-owner.json'))) break;
    const id = file.slice(0, -9);
    const resultFile = join(queue, `${id}.result.json`);
    if (!existsSync(resultFile)) {
      const payload = JSON.parse(readFileSync(join(queue, file)));
      // Older persisted jobs may predate receiver instrumentation. Record only
      // this newly observed start, never invent their original receive time.
      recordEvent(root, payload, 'queue-start-backfill');
      const measurement = startMeasurement(root, 'queue-job', { event: id, newMain: payload.live });
      let output, code = 0;
      console.log(`Running automatic job ${id}`);
      try { output = measurement.sync('automatic-process', () => execFileSync('node', ['tools/auto-update.mjs', '--ship'], { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20, timeout: 30 * 60 * 1000,
        env: { ...process.env, TIBO_UPDATE_EVENT: id, TIBO_MEASUREMENT_PARENT: measurement.receipt.id, TIBO_MEASUREMENTS_DIR: measurement.directory },
      })); }
      catch (e) { code = e.status ?? 1; output = `${e.stdout ?? ''}\n${e.stderr ?? ''}`; }
      measurement.finish(code === 0 ? 'complete' : code === 20 ? 'needs-review' : 'failed', { exitCode: code });
      writeFileSync(join(queue, `${id}.log`), output);
      writeFileSync(resultFile, JSON.stringify({ code, summary: output.slice(-2000), checkedAt: new Date().toISOString() }));
    }
    try {
      const response = await fetch(readFileSync(join(root, '.amp/detector/webhook-url'), 'utf8').trim(), {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': `result-${id}` },
        body: JSON.stringify({ id: `result-${id}`, type: 'automatic.result', job: id }), signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error('Result delivery failed');
      rmSync(join(queue, file));
    } catch { console.error(`Pending automatic result ${id}; retrying delivery, not rerunning the update`); }
  }
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
