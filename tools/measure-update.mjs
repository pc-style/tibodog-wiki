// Required worker command wrapper and report/backfill interface. No publisher.
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startMeasurement, measurementDir, importShadow, backfillHistory, importHistoricalResults, refreshReport, readMeasurements, collectWorkerUsage, save } from './update-measurements.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const [action, ...args] = process.argv.slice(2);
const directory = measurementDir(root);
try {
  if (action === 'run') {
    const [stage, separator, command, ...commandArgs] = args;
    if (!stage || separator !== '--' || !command) throw new Error('run <stage> -- <command> [args]');
    const build = JSON.parse(readFileSync(join(root, 'data/build.json')));
    const m = startMeasurement(root, 'worker-command', { newMain: build.main });
    try {
      m.sync(stage, () => {
        const r = spawnSync(command, commandArgs, { cwd: root, stdio: 'inherit', env: { ...process.env, TIBO_MEASUREMENT_PARENT: m.receipt.id, TIBO_MEASUREMENTS_DIR: directory } });
        if (r.error || r.status !== 0) throw Object.assign(r.error ?? new Error('Command failed'), { status: r.status, signal: r.signal });
        return r;
      });
      m.finish('complete');
    } catch (error) { m.finish('failed'); process.exitCode = Number.isInteger(error.status) && error.status > 0 ? error.status : 1; }
  } else if (action === 'worker-start') {
    const build = JSON.parse(readFileSync(join(root, 'data/build.json')));
    const m = startMeasurement(root, 'worker-review', { newMain: args[0] ?? build.main, event: args[1] ?? null,
      clock: 'UTC wall time across worker commands, includes thinking, waits and tool work; not active inference time' });
    console.log(m.receipt.id);
  } else if (action === 'worker-finish') {
    const [id, status] = args;
    if (!/^[a-f0-9-]{36}$/.test(id ?? '') || !['complete', 'failed', 'blocked'].includes(status)) throw new Error('worker-finish <id> <complete|failed|blocked>');
    const file = join(directory, `${id}.json`), receipt = JSON.parse(readFileSync(file));
    if (receipt.lane !== 'worker-review') throw new Error('Not a worker-review receipt');
    if (status === 'complete') {
      const stages = readMeasurements(directory).filter((r) => r.parent === id && r.status === 'complete').flatMap((r) => r.stages.filter((s) => s.status === 'passed').map((s) => s.name));
      const missing = ['build', 'quotes', 'middleware', 'tests', 'push', 'live'].filter((stage) => !stages.includes(stage));
      if (missing.length) throw new Error(`Missing required measured worker stages: ${missing.join(', ')}`);
    }
    receipt.completedAt = new Date().toISOString();
    receipt.durationMs = Math.max(0, Date.parse(receipt.completedAt) - Date.parse(receipt.startedAt));
    receipt.status = status;
    receipt.aiUsage = collectWorkerUsage(receipt);
    save(file, receipt);
    refreshReport(directory);
  } else if (action === 'export') {
    if (!args[0]) throw new Error('export <output.json>');
    writeFileSync(args[0], JSON.stringify({ schema: 1, records: readMeasurements(directory) }, null, 2) + '\n', { mode: 0o600 });
  } else if (action === 'ingest') {
    const bundle = JSON.parse(readFileSync(args[0]));
    if (bundle.schema !== 1 || !Array.isArray(bundle.records)) throw new Error('Invalid measurement bundle');
    mkdirSync(directory, { recursive: true });
    // Receipt IDs cannot escape this directory. Ingestion has no publishing effect.
    for (const r of bundle.records) {
      if (!/^[a-zA-Z0-9-]+$/.test(r.id ?? '') || r.schema !== 1 || !Array.isArray(r.stages)) throw new Error('Invalid receipt');
      save(join(directory, `${r.id}.json`), r);
    }
    refreshReport(directory);
  } else if (action === 'backfill') {
    backfillHistory(root);
    for (const file of args) {
      if (JSON.parse(readFileSync(file)).mode === 'shadow') importShadow(root, file);
      else importHistoricalResults(root, file);
    }
    console.log(refreshReport(directory));
  } else if (action === 'report') {
    console.log(refreshReport(directory));
  } else if (action === 'serve') {
    // Read-only report, not a directory server. No logs, payloads or credentials.
    createServer((req, res) => {
      if (!['/', '/report.md'].includes(req.url)) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.end(refreshReport(directory));
    }).listen(Number(process.env.PORT || 7341), '0.0.0.0', () => console.log('Measurement report ready'));
  } else throw new Error('Use run, worker-start, worker-finish, export, ingest, backfill, report or serve');
} catch (error) { console.error(error.message); process.exitCode = 1; }
