import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { importShadow, backfillHistory, importHistoricalResults, parseAmpUsage, readMeasurements } from './update-measurements.mjs';

test('required worker CLI preserves failures, lineage, review elapsed time and unavailable usage', () => {
  const root = mkdtempSync(join(tmpdir(), 'wiki-measure-'));
  try {
    for (const d of ['tools', 'data', 'bin']) mkdirSync(join(root, d));
    for (const file of ['measure-update.mjs', 'update-measurements.mjs']) copyFileSync(new URL(file, import.meta.url), join(root, 'tools', file));
    writeFileSync(join(root, 'data/build.json'), '{"main":"main-newbuild.js"}');
    // No real provider request, publishing command or credentials in fixtures.
    writeFileSync(join(root, 'bin/amp'), '#!/bin/sh\nexit 1\n', { mode: 0o755 });
    const env = { ...process.env, AMP_THREAD_ID: 'T-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', TIBO_MEASUREMENTS_DIR: join(root, 'measurements'), PATH: `${root}/bin:${process.env.PATH}` };
    const cli = (...args) => spawnSync(process.execPath, ['tools/measure-update.mjs', ...args], { cwd: root, encoding: 'utf8', env });
    const start = cli('worker-start', 'main-newbuild.js', 'event-1');
    assert.equal(start.status, 0, start.stderr);
    const id = start.stdout.trim();
    env.TIBO_MEASUREMENT_PARENT = id;
    const incomplete = cli('worker-finish', id, 'complete');
    assert.equal(incomplete.status, 1);
    assert.match(incomplete.stderr, /Missing required measured worker stages: build, quotes, middleware, tests, push, live/);
    for (const code of [0, 7]) {
      const result = cli('run', 'gate', '--', process.execPath, '-e', `console.log('secret-must-not-persist');process.exit(${code})`);
      assert.equal(result.status, code);
    }
    assert.equal(cli('worker-finish', id, 'failed').status, 0);
    const records = readMeasurements(env.TIBO_MEASUREMENTS_DIR);
    const review = records.find((r) => r.id === id);
    assert.equal(review.status, 'failed');
    assert.equal(review.event, 'event-1');
    assert.equal(review.aiUsage.status, 'unavailable');
    assert.ok(review.durationMs >= 0);
    const commands = records.filter((r) => r.lane === 'worker-command');
    assert.deepEqual(commands.map((r) => r.parent), [id, id]);
    assert.deepEqual(commands.map((r) => r.status).sort(), ['complete', 'failed']);
    assert.equal(commands.find((r) => r.status === 'failed').stages[0].failure.exitCode, 7);
    assert.ok(commands.every((r) => r.stages[0].durationMs >= 0));
    assert.ok(!JSON.stringify(records).includes('secret-must-not-persist'));
    assert.equal(cli('export', join(root, 'export.json')).status, 0);
    env.TIBO_MEASUREMENTS_DIR = join(root, 'destination');
    mkdirSync(env.TIBO_MEASUREMENTS_DIR);
    assert.equal(cli('ingest', join(root, 'export.json')).status, 0);
    assert.equal(readMeasurements(env.TIBO_MEASUREMENTS_DIR).length, 3);
    for (const stage of ['build', 'quotes', 'middleware', 'tests', 'push', 'live']) assert.equal(cli('run', stage, '--', process.execPath, '-e', 'process.exit(0)').status, 0);
    assert.equal(cli('worker-finish', id, 'complete').status, 0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('historical backfill preserves replay provenance and never fabricates original stage latency', () => {
  const root = mkdtempSync(join(tmpdir(), 'wiki-backfill-'));
  const prior = process.env.TIBO_MEASUREMENTS_DIR;
  process.env.TIBO_MEASUREMENTS_DIR = join(root, 'measurements');
  try {
    mkdirSync(join(root, 'data'));
    writeFileSync(join(root, 'data/builds.json'), JSON.stringify(Array.from({ length: 144 }, (_, i) => ({ main: `build${i + 1}`, updated: '2026-11-08T04:08:29Z', status: 'reviewed' }))));
    backfillHistory(root);
    const file = join(root, 'shadow.json');
    writeFileSync(file, JSON.stringify({ schema: 1, mode: 'shadow', status: 'complete', startedAt: '2026-11-08T04:00:00Z', completedAt: '2026-11-08T04:00:13Z', binding: { oldMain: 'build143', newMain: 'build144' }, stages: [{ name: 'browser:new', status: 'passed', durationMs: 8000 }] }));
    importShadow(root, file); importShadow(root, file);
    const rows = readMeasurements(process.env.TIBO_MEASUREMENTS_DIR);
    assert.equal(rows.length, 8); // seven history rows and one deduplicated replay
    const replay = rows.find((r) => r.provenance === 'replay');
    assert.equal(replay.durationMs, 13000);
    assert.equal(replay.historicalLatency.status, 'unavailable');
    assert.equal(replay.stages[0].durationMs, 8000);
    assert.ok(rows.filter((r) => r.provenance === 'historical-metadata').every((r) => r.durationMs === undefined && r.stages.length === 0));
    assert.match(readFileSync(join(process.env.TIBO_MEASUREMENTS_DIR, 'report.md'), 'utf8'), /NOT historical delivery latency/);
    const original = join(root, 'original.json');
    writeFileSync(original, JSON.stringify({ schema: 1, results: [{ job: 'original-job', live: 'build144', code: 20, checkedAt: '2026-11-08T04:02:43.965Z' }] }));
    importHistoricalResults(root, original);
    const result = readMeasurements(process.env.TIBO_MEASUREMENTS_DIR).find((r) => r.event === 'original-job');
    assert.equal(result.provenance, 'original-result-observation');
    assert.equal(result.checkedAt, '2026-11-08T04:02:43.965Z');
    assert.equal(result.status, 'needs-review');
    assert.equal(result.durationMs, undefined);
    assert.deepEqual(result.stages, []);
  } finally {
    if (prior === undefined) delete process.env.TIBO_MEASUREMENTS_DIR; else process.env.TIBO_MEASUREMENTS_DIR = prior;
    rmSync(root, { recursive: true, force: true });
  }
});

test('usage parser selects exact thread export, retains token scope and rejects format changes', () => {
  const thread = 'T-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const exportText = `| Other (T-bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb) | 99,999 | 3h | 3h | $1 | $1 | $2 |\n| Worker (${thread}) | 12,345 | 0.4h | 0.8h | $0 | $0 | $0 |`;
  const result = parseAmpUsage(exportText, thread, 'start', 'end');
  assert.equal(result.totalTokens, 12345);
  assert.equal(result.ampRecordedCost, '$0');
  assert.equal(result.scope.thread, thread);
  assert.equal(result.includedOrbHours, '0.8h');
  assert.match(result.limits, /stage attribution/);
  assert.throws(() => parseAmpUsage(exportText.replace('12,345', 'unknown'), thread), /format changed/);
  assert.throws(() => parseAmpUsage(exportText.replace('12,345', ''), thread), /format changed/);
  assert.throws(() => parseAmpUsage('', thread), /absent/);
});
