// Observations only: these receipts never decide eligibility or publish anything.
import { execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const measurementDir = (root) => resolve(process.env.TIBO_MEASUREMENTS_DIR || join(root, '.amp/detector/measurements'));
export function save(file, value) {
  mkdirSync(resolve(file, '..'), { recursive: true });
  const temp = `${file}.${randomUUID()}.tmp`;
  writeFileSync(temp, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });
  renameSync(temp, file);
}
function binding(root) {
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  try {
    return { wikiCommit: git('rev-parse', 'HEAD'), trackedDiffSha256: hash(git('diff', '--binary', 'HEAD')),
      collectorSha256: hash(readFileSync(new URL(import.meta.url))),
      entrypointSha256: process.argv[1] && existsSync(process.argv[1]) ? hash(readFileSync(process.argv[1])) : null };
  } catch { return { status: 'unavailable', reason: 'No Git revision at execution site' }; }
}
export function startMeasurement(root, lane, metadata = {}) {
  const directory = measurementDir(root);
  const id = randomUUID();
  const file = join(directory, `${id}.json`);
  const started = performance.now();
  const receipt = { schema: 1, id, provenance: 'execution', lane, parent: process.env.TIBO_MEASUREMENT_PARENT ?? null,
    thread: process.env.AMP_THREAD_ID ?? null, event: process.env.TIBO_UPDATE_EVENT ?? null,
    startedAt: new Date().toISOString(), status: 'running', binding: binding(root), ...metadata,
    aiUsage: { status: lane === 'automatic' || lane === 'import' ? 'not-used-in-this-process' : 'unavailable',
      reason: 'No model calls made by collector; worker tokens/cost require an actual provider export' }, stages: [] };
  if (receipt.event && existsSync(join(directory, `event-${receipt.event}.json`))) {
    const event = JSON.parse(readFileSync(join(directory, `event-${receipt.event}.json`)));
    if (event.lane !== 'queue-start-backfill') {
      receipt.queueWaitMs = Math.max(0, Date.parse(receipt.startedAt) - Date.parse(event.receivedAt));
      receipt.queueWaitProvenance = 'receiver UTC to process UTC; includes owner hold and queue delay, not detector polling';
    }
  }
  const persist = () => save(file, receipt);
  persist();
  const begin = (name) => {
    const entry = { name, startedAt: new Date().toISOString(), status: 'running' };
    receipt.stages.push(entry); persist();
    return { entry, time: performance.now() };
  };
  const end = ({ entry, time }, error) => {
    Object.assign(entry, { status: error ? 'failed' : 'passed', completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - time) });
    // Do not persist command arguments, environment, output or errors containing credentials.
    if (error) entry.failure = { type: error.name, exitCode: error.status ?? null, signal: error.signal ?? null };
    persist();
  };
  const finish = (status, extra = {}) => {
    Object.assign(receipt, extra, { status, completedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - started) });
    persist();
    refreshReport(directory);
  };
  return { receipt, file, directory, persist, finish,
    sync(name, action) { const span = begin(name); try { const result = action(); end(span); return result; } catch (error) { end(span, error); throw error; } },
    async async(name, action) { const span = begin(name); try { const result = await action(); end(span); return result; } catch (error) { end(span, error); throw error; } },
  };
}

// Exits and ordinary uncaught failures leave receipts; SIGKILL/power loss honestly
// leave 'running', never a fabricated completion. Register before network work.
export function measureProcess(root, lane, metadata) {
  const measure = startMeasurement(root, lane, metadata);
  process.once('exit', (code) => {
    if (measure.receipt.status === 'running') measure.finish(code ? 'failed' : 'complete', { exitCode: code });
  });
  return measure;
}

export function recordEvent(root, payload, route) {
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(payload.id ?? '')) throw new Error('Invalid measurement event');
  const directory = measurementDir(root);
  const file = join(directory, `event-${payload.id}.json`);
  if (!existsSync(file)) save(file, { schema: 1, id: `event-${payload.id}`, provenance: 'event-observation', lane: route,
    event: payload.id, oldMain: payload.documented, newMain: payload.live,
    observedAt: payload.observedAt ?? null, firstNotifiedAt: payload.firstNotifiedAt ?? null,
    receivedAt: new Date().toISOString(), status: 'received', stages: [],
    aiUsage: { status: 'unavailable' } });
  refreshReport(directory);
}

export function importShadow(root, file) {
  const bytes = readFileSync(file), source = JSON.parse(bytes);
  if (source.mode !== 'shadow' || !source.binding?.newMain || !Array.isArray(source.stages)) throw new Error('Not a shadow receipt');
  const directory = measurementDir(root);
  const id = `replay-${hash(bytes)}`;
  const receipt = { ...source, id, provenance: 'replay', lane: 'journal-verification', sourceReceiptSha256: hash(bytes),
    sourceReceipt: resolve(file), oldMain: source.binding.oldMain, newMain: source.binding.newMain,
    durationMs: source.completedAt ? Date.parse(source.completedAt) - Date.parse(source.startedAt) : null,
    aiUsage: { status: 'not-used-in-replay' }, historicalLatency: { status: 'unavailable', reason: 'Replay runtime is not original update latency' } };
  save(join(directory, `${id}.json`), receipt);
  refreshReport(directory);
  return receipt;
}

export function backfillHistory(root) {
  const directory = measurementDir(root);
  const builds = JSON.parse(readFileSync(join(root, 'data/builds.json'))).map((b, i) => ({ ...b, version: i + 1 })).filter((b) => b.version >= 138);
  for (const build of builds) save(join(directory, `history-${build.main}.json`), {
    schema: 1, id: `history-${build.main}`, provenance: 'historical-metadata', lane: 'history', newMain: build.main,
    version: build.version, status: build.status, declaredUpdatedAt: build.updated ?? null, stages: [],
    historicalLatency: { status: 'unavailable', reason: 'History dates are not stage timestamps or production-ready observations' },
    aiUsage: { status: 'unavailable', reason: 'No provider usage export in build history' },
  });
  refreshReport(directory);
}

export function importHistoricalResults(root, file) {
  const bytes = readFileSync(file), source = JSON.parse(bytes);
  if (source.schema !== 1 || !Array.isArray(source.results)) throw new Error('Invalid historical result export');
  const directory = measurementDir(root);
  for (const result of source.results) {
    if (!/^[a-zA-Z0-9-]+$/.test(result.job) || !Number.isInteger(result.code) || !Number.isFinite(Date.parse(result.checkedAt))) throw new Error('Invalid historical result');
    save(join(directory, `result-${result.job}.json`), { schema: 1, id: `result-${result.job}`, provenance: 'original-result-observation',
      lane: 'automatic-result', event: result.job, oldMain: result.documented ?? null, newMain: result.live ?? null,
      checkedAt: result.checkedAt, exitCode: result.code, status: result.code === 0 ? 'complete' : result.code === 20 ? 'needs-review' : 'failed',
      sourceSha256: hash(bytes), stages: [], aiUsage: { status: 'unavailable' }, historicalLatency: { status: 'unavailable', reason: 'Result timestamp only; original stage boundaries absent' } });
  }
  if (source.automaticLiveReceipt) {
    const r = source.automaticLiveReceipt;
    save(join(directory, 'historical-live.json'), { schema: 1, id: 'historical-live', provenance: 'original-live-observation', lane: 'automatic-live',
      newMain: r.main, shippedSha: r.sha, pages: r.pages, checkedAt: r.checkedAt, status: 'live-checked', sourceSha256: hash(bytes),
      stages: [], historicalLatency: { status: 'unavailable', reason: 'Live timestamp only, no start time' }, aiUsage: { status: 'unavailable' } });
  }
  refreshReport(directory);
}

export function parseAmpUsage(text, thread, start, end) {
  if (!/^T-[a-f0-9-]{36}$/.test(thread ?? '')) throw new Error('Missing thread identity for usage');
  const line = text.split('\n').find((line) => line.startsWith('| ') && line.includes(`(${thread})`));
  if (!line) throw new Error('Thread usage absent from Amp export');
  const cells = line.split('|').slice(1, -1).map((s) => s.trim());
  const totalTokens = Number(cells[1].replaceAll(',', ''));
  if (cells.length !== 7 || !/^\d[\d,]*$/.test(cells[1]) || !Number.isSafeInteger(totalTokens) || totalTokens < 0 || !/^\$[\d,.]+$/.test(cells[6])) throw new Error('Amp usage format changed');
  return { status: 'available', source: 'amp usage --details', sourceSha256: hash(text), scope: { thread, start, end },
    totalTokens, orbRuntime: cells[2], includedOrbHours: cells[3], ampRecordedCost: cells[6],
    limits: 'Range-scoped whole-thread traffic, including cache; may post late. Model/stage attribution and external provider charges unavailable.' };
}

export function collectWorkerUsage(receipt) {
  const end = new Date().toISOString();
  try {
    const output = execFileSync('amp', ['usage', '--details', '--start', receipt.startedAt, '--end', end], { encoding: 'utf8', timeout: 30000, maxBuffer: 16 << 20, stdio: ['ignore', 'pipe', 'pipe'] });
    return parseAmpUsage(output, receipt.thread, receipt.startedAt, end);
  } catch { return { status: 'unavailable', reason: 'Amp export unavailable, missing thread row or format mismatch; no estimate substituted', attemptedAt: end }; }
}

export function readMeasurements(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter((f) => f.endsWith('.json') && f !== 'report.json').map((f) => JSON.parse(readFileSync(join(directory, f))));
}
export function refreshReport(directory) {
  const rows = readMeasurements(directory);
  const display = (value) => String(value ?? 'unavailable').replace(/[|\r\n]/g, ' ');
  const seconds = (ms) => Number.isFinite(ms) ? `${(ms / 1000).toFixed(3)}s` : 'unavailable';
  const lines = ['# Required update measurements', '', `Report generated ${new Date().toISOString()}. ${rows.length} durable records.`, '',
    'Collection is required indefinitely until pcstyle stops it. Receipts are observations, never approval to publish.',
    'Command timings use a monotonic clock; worker sessions use labelled UTC wall time. Nested stages overlap: do not sum them. Running records may be active or interrupted.',
    'Replay runtime is newly measured work, NOT historical delivery latency. History timestamps are metadata only.',
    'AI tokens/cost are unavailable unless supplied by an actual provider export; elapsed review time is not AI compute or spend.', '',
    '| Provenance / lane | Build / event | Observed UTC | Status | Elapsed | Stages passed/failed/running | AI usage |',
    '|---|---|---|---|---|---|---|'];
  for (const r of rows.sort((a, b) => (b.startedAt ?? b.receivedAt ?? '').localeCompare(a.startedAt ?? a.receivedAt ?? ''))) {
    const counts = ['passed', 'failed', 'running'].map((s) => r.stages.filter((x) => x.status === s).length).join('/');
    lines.push(`| ${display(r.provenance)} / ${display(r.lane)} | ${display(r.newMain ?? r.event)} | ${display(r.startedAt ?? r.receivedAt ?? r.checkedAt ?? r.declaredUpdatedAt)} | ${display(r.status)} | ${seconds(r.durationMs)} | ${counts} | ${display(r.aiUsage?.status)} |`);
    if (r.aiUsage?.status === 'available') lines.push(`| ↳ observed whole-thread usage | ${display(r.aiUsage.scope?.thread)} | ${display(r.aiUsage.scope?.start)}–${display(r.aiUsage.scope?.end)} | ${display(r.aiUsage.totalTokens)} tokens | ${display(r.aiUsage.ampRecordedCost)} Amp charges | not attributable to stages | ${display(r.aiUsage.source)} |`);
  }
  lines.push('', '## Slowest observed stages (overlap; not additive)', '');
  for (const provenance of ['execution', 'replay']) {
    const stages = rows.filter((r) => r.provenance === provenance).flatMap((r) => r.stages.filter((s) => Number.isFinite(s.durationMs)).map((s) => ({ ...s, main: r.newMain })));
    for (const stage of stages.sort((a, b) => b.durationMs - a.durationMs).slice(0, 5)) lines.push(`- ${provenance}: ${display(stage.name)}, ${seconds(stage.durationMs)}, ${display(stage.main)}, ${display(stage.status)}.`);
  }
  lines.push('', '## Stage detail (execution and replay kept separate)', '');
  for (const r of rows.filter((r) => r.stages.length)) {
    lines.push(`### ${display(r.provenance)} · ${display(r.lane)} · ${display(r.newMain)} · ${r.id}`, '',
      `Revision: ${display(r.binding?.wikiCommit)}; parent: ${display(r.parent)}; event: ${display(r.event)}.`, '');
    if (Number.isFinite(r.queueWaitMs)) lines.push(`- Receiver-to-start wait: ${seconds(r.queueWaitMs)} (UTC difference, includes reservation holds).`);
    if (r.journalMeasurement) lines.push(`- Required journal collection: ${display(r.journalMeasurement.status)}.`);
    for (const stage of r.stages) lines.push(`- ${display(stage.name)}: ${display(stage.status)}, ${seconds(stage.durationMs)}${stage.failure ? ` (exit ${display(stage.failure.exitCode)}, ${display(stage.failure.type)})` : ''}`);
    if (r.browser) lines.push(`- Journal verification: ${JSON.stringify(r.browser)}`);
    lines.push('');
  }
  // Unique temporary files prevent concurrent refreshes from corrupting a report.
  // Receipts, not this rebuildable view, are the authoritative append-only history.
  save(join(directory, 'report.json'), { generatedAt: new Date().toISOString(), records: rows });
  const temp = join(directory, `${randomUUID()}.tmp`);
  writeFileSync(temp, lines.join('\n') + '\n', { mode: 0o600 });
  renameSync(temp, join(directory, 'report.md'));
  return lines.join('\n') + '\n';
}
