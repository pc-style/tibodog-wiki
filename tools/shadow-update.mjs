// Opt-in, read-only replay. Never imports tracked data or approves/publishes a build.
// node tools/shadow-update.mjs <old main> <new main> [--browser] [--full-receipt <prior receipt>]
import { execFile, execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import { isDeepStrictEqual, parseArgs, promisify } from 'node:util';
import { mirror, ARCHIVE } from './fetch-build.mjs';
import { compareChangelog, extractChangelog } from './dump-changelog.mjs';
import { sameBuild } from './same-build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
const execute = promisify(execFile);

// Match the display wrapper, not declaration order or an invented "next" version.
export function journalRows(journal, currentCode) {
  if (!journal.days.length) throw new Error('Journal has no displayed dates');
  const row = (line, date, version) => ({ date, version, kind: line.kind, text: line.text });
  return journal.days.flatMap((day, index) => [
    ...(index === 0 ? journal.unreleased.map((line) => row(line, day.date, currentCode)) : []),
    ...day.waves.flatMap((wave) => wave.lines.map((line) => row(line, day.date, wave.version))),
  ]);
}

export function verifyJournalCapture(journal, currentCode, capture) {
  const expected = journalRows(journal, currentCode);
  if (capture.main !== journal.build) throw new Error(`Wrong browser build: ${capture.main}`);
  if (!capture.url || new URL(capture.url).pathname !== (capture.surface === 'panel' ? '/' : '/changelog')) throw new Error('Wrong browser route');
  if (!['panel', 'full'].includes(capture.surface)) throw new Error('Unknown journal surface');
  const dates = [...new Set(expected.map((row) => row.date))];
  if (!isDeepStrictEqual(capture.dates, dates)) throw new Error('Displayed dates differ');
  if (capture.surface === 'panel' && (capture.expanded?.length !== dates.length || capture.expanded.some((value) => value !== 'true'))) throw new Error('Not every journal date is expanded');
  if (!isDeepStrictEqual(capture.rows, expected)) {
    const first = expected.findIndex((row, i) => !isDeepStrictEqual(row, capture.rows?.[i]));
    throw new Error(`Ordered journal records differ at ${first < 0 ? expected.length : first} (expected ${expected.length}, got ${capture.rows?.length ?? 0})`);
  }
  return { records: expected.length, dates: dates.length, codes: new Set(expected.map((row) => row.version)).size };
}

export function verifyFullSnapshot(journal, prior, html) {
  const source = prior.binding?.builds?.new;
  if (source?.main !== journal.build || source.journal?.sha256 !== journal.source.sha256 ||
      !prior.stages?.some((stage) => stage.name === 'full-page:new' && stage.status === 'passed') ||
      source.fullPage?.status !== 'available' || source.fullPage.main !== journal.build || source.fullPage.htmlSha256 !== hash(html)) {
    throw new Error('Full journal snapshot revision or digest mismatch');
  }
  return source.fullPage;
}

// The same selector contract is used for archived replays and live captures.
// Clicking collapsed toggles deliberately checks the game's actual render path.
const captureScript = (surface) => `(() => {
  const panel = ${JSON.stringify(surface)} === 'panel';
  const prefix = panel ? 'changelog' : 'changes';
  const days = [...document.querySelectorAll('.' + prefix + '-day')];
  const date = d => panel ? d.querySelector('button').getAttribute('aria-controls').replace('changelog-day-', '') : d.querySelector('time').dateTime;
  return { surface: ${JSON.stringify(surface)}, url: location.href,
    main: [...document.scripts].map(s => s.src.match(/\\/(main-[A-Za-z0-9_-]{8}\\.js)(?:[?]|$)/)?.[1]).find(Boolean),
    dates: days.map(date), expanded: [...document.querySelectorAll('.changelog-toggle')].map(e => e.getAttribute('aria-expanded')),
    rows: days.flatMap(d => [...d.querySelectorAll('.' + prefix + '-wave')].flatMap(w => [...w.querySelectorAll('.' + prefix + '-line')].map(l => ({
      date: date(d), version: w.querySelector('code').textContent, kind: l.dataset.kind, text: l.querySelector('.' + prefix + '-text').textContent
    })))) };
})()`;

async function browserJournal(build, journal, code, out, fullPage) {
  // A finite, loopback-only replay server; no live game state or archive HTML is rewritten.
  const mime = { js: 'text/javascript', css: 'text/css', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml', json: 'application/json', wasm: 'application/wasm', woff2: 'font/woff2' };
  const server = createServer((req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    const asset = path.match(/^\/assets\/([A-Za-z0-9_.-]+)$/)?.[1];
    try {
      if (!asset && path !== '/' && !(path === '/changelog' && fullPage.status === 'available')) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', asset ? mime[asset.split('.').at(-1)] ?? 'application/octet-stream' : 'text/html');
      res.end(readFileSync(asset ? join(build.dir, asset) : path === '/changelog' ? join(out, 'full.html') : join(dirname(build.dir), 'index.html')));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const session = `shadow-${randomUUID().slice(0, 8)}`;
  const browser = async (...args) => {
    const { stdout } = await execute('agent-browser', ['--session', session, '--args', '--use-angle=swiftshader,--enable-unsafe-swiftshader', ...args], { cwd: ROOT, timeout: 90000, maxBuffer: 8 << 20 });
    return stdout;
  };
  try {
    await browser('open', origin);
    await browser('set', 'viewport', '1280', '900', '2');
    const results = { full: fullPage.status === 'available' ? undefined : fullPage };
    for (const surface of ['panel', ...(fullPage.status === 'available' ? ['full'] : [])]) {
      if (surface === 'panel') {
        await browser('wait', '[data-testid="changelog-open"]');
        await browser('find', 'role', 'button', 'click', '--name', "What's new");
        await browser('wait', '.changelog-toggle');
        await browser('eval', '[...document.querySelectorAll(".changelog-toggle[aria-expanded=false]")].forEach(e=>e.click())');
      } else await browser('open', `${origin}/changelog`);
      await browser('wait', `.${surface === 'panel' ? 'changelog' : 'changes'}-line`);
      const envelope = JSON.parse(await browser('eval', '--json', captureScript(surface)));
      const capture = envelope.data?.result;
      // The full page is server-rendered, without a main script. Its separate
      // before/after revision observation is required, not inferred from its text.
      if (surface === 'full' && capture) capture.main = fullPage.main;
      json(join(out, `${surface}.json`), capture ?? envelope);
      results[surface] = { status: 'passed', ...verifyJournalCapture(journal, code, capture ?? {}) };
    }
    return results;
  } catch (error) {
    try { writeFileSync(join(out, 'browser-diagnostic.txt'), [await browser('get', 'url'), await browser('errors'), await browser('snapshot')].join('\n')); }
    catch { /* Preserve the original verification error. */ }
    throw error;
  } finally {
    try { await browser('close'); } finally {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

export async function shadowUpdate(oldMain, newMain, { browser = false, fullReceipt } = {}) {
  if (fullReceipt && !browser) throw new Error('--full-receipt requires --browser');
  for (const main of [oldMain, newMain]) if (!/^main-[A-Za-z0-9_-]{8}\.js$/.test(main)) throw new Error(`Invalid build: ${main}`);
  const out = join(ROOT, '.cache', 'shadow', `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`);
  mkdirSync(out, { recursive: true });
  const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
  const toolFiles = ['shadow-update.mjs', 'fetch-build.mjs', 'dump-changelog.mjs', 'same-build.mjs'];
  const receipt = {
    schema: 1, mode: 'shadow', id: randomUUID(), startedAt: new Date().toISOString(),
    binding: { oldMain, newMain, wikiCommit: git('rev-parse', 'HEAD'), trackedDiffSha256: hash(git('diff', '--binary', 'HEAD')),
      tools: Object.fromEntries(toolFiles.map((file) => [file, hash(readFileSync(join(ROOT, 'tools', file)))])), builds: {} },
    stages: [], publishingDecision: 'unchanged; shadow evidence cannot approve or publish',
    notMeasured: ['detectedAt', 'enqueuedAt', 'writerReadyAt', 'release gates', 'push', 'deployment', 'canonical live'],
  };
  const save = () => json(join(out, 'receipt.json'), receipt);
  const stage = async (name, action) => {
    const entry = { name, startedAt: new Date().toISOString(), status: 'running' };
    const start = performance.now();
    receipt.stages.push(entry); save();
    try { const result = await action(); entry.status = 'passed'; return result; }
    catch (error) {
      entry.status = 'failed'; entry.error = error.message;
      if (error.code === 'ARCHIVE_NOT_READY') entry.failure = { code: error.code, main: error.main, httpStatus: 404 };
      throw error;
    }
    finally { entry.completedAt = new Date().toISOString(); entry.durationMs = Math.round(performance.now() - start); save(); }
  };
  console.log(`shadow evidence: ${out}`);
  try {
    const builds = [];
    const journals = [];
    for (const [index, main] of [oldMain, newMain].entries()) {
      const label = index ? 'new' : 'old';
      const build = await stage(`mirror:${label}`, () => mirror(undefined, main));
      builds.push(build);
      await stage(`provenance:${label}`, async () => {
        const url = new URL(`${main}/manifest.json`, ARCHIVE).href;
        const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw Object.assign(new Error(`Archive manifest HTTP ${response.status}: ${main}`),
          response.status === 404 ? { code: 'ARCHIVE_NOT_READY', main } : {});
        const bytes = Buffer.from(await response.arrayBuffer());
        const manifest = JSON.parse(bytes);
        if (manifest.main !== main || !manifest.files?.length) throw new Error('Invalid archive manifest');
        const files = new Map(manifest.files.map((f) => [f.name, f]));
        for (const file of build.files) {
          const entry = files.get(file), actual = readFileSync(join(build.dir, file));
          if (!entry || actual.length !== entry.size || hash(actual) !== entry.sha256) throw new Error(`Archive digest mismatch: ${file}`);
        }
        const html = readFileSync(join(dirname(build.dir), 'index.html'));
        if (!html.toString().includes(`/assets/${main}`)) throw new Error('Archived HTML does not name expected main');
        json(join(out, `${label}-manifest.json`), manifest);
        receipt.binding.builds[label] = { main, manifest: { url, sha256: hash(bytes), archivedAt: manifest.archivedAt }, htmlSha256: hash(html), verifiedAssets: build.files.length };
      });
      journals.push(await stage(`extract:${label}`, () => {
        const journal = extractChangelog(build.dir, main);
        if (!build.files.includes(journal.chunk)) throw new Error('Extracted journal is not reachable from this build');
        json(join(out, `${label}-journal.json`), journal);
        receipt.binding.builds[label].journal = journal.source;
        return journal;
      }));
    }
    const packet = await stage('comparison', () => {
      const historyBytes = readFileSync(join(ROOT, 'data/builds.json'));
      const history = JSON.parse(historyBytes);
      const changes = compareChangelog(...journals);
      return { schema: 1, mode: 'shadow', binding: receipt.binding,
        wholeBuild: sameBuild(...builds.map((build) => dirname(build.dir))),
        journalChanges: changes,
        priorWikiEvidence: { sha256: hash(historyBytes), entries: history.filter((entry) => [oldMain, newMain].includes(entry.main)) },
        judgmentRequired: changes.length ? ['Reconcile publication changes separately from source introduction', 'Review wording meaning and ambiguous citation ownership; never infer removal from omission'] : [],
        limits: ['Not an automatic-update eligibility decision', 'No numeric import, gameplay probe, citation gate or release gate executed', 'Journal regrouping is not mechanic introduction'],
      };
    });
    json(join(out, 'packet.json'), packet);
    if (browser) {
      // The displayed current code comes from this exact build, never today's live game.
      const source = readFileSync(join(builds[1].dir, builds[1].chunks['death-flow']), 'utf8');
      const commit = source.match(/commit:[\w$]+\(`([0-9a-f]{7,40})`\)/)?.[1];
      if (!commit) throw new Error('Current display commit not found; schema review required');
      receipt.binding.builds.new.gameCommit = commit;
      const fullPage = await stage('full-page:new', async () => {
        if (fullReceipt) {
          const bytes = readFileSync(fullReceipt);
          const html = readFileSync(join(dirname(fullReceipt), 'full.html'));
          const binding = verifyFullSnapshot(journals[1], JSON.parse(bytes), html);
          writeFileSync(join(out, 'full.html'), html);
          receipt.binding.builds.new.fullPage = { ...binding, reusedReceiptSha256: hash(bytes) };
          return receipt.binding.builds.new.fullPage;
        }
        const get = async (url) => {
          const response = await fetch(url, { headers: { 'cache-control': 'no-cache' }, signal: AbortSignal.timeout(20000) });
          if (!response.ok) throw new Error(`Full journal HTTP ${response.status}`);
          return response.text();
        };
        const mainOf = (html) => html.match(/\/assets\/(main-[A-Za-z0-9_-]{8}\.js)/)?.[1];
        const before = mainOf(await get('https://tibo.dog/'));
        if (!before) throw new Error('Live game entry parse failed');
        if (before !== newMain) return { status: 'unavailable', reason: 'Historical server-rendered /changelog HTML is not archived', liveMain: before };
        const html = await get('https://tibo.dog/changelog');
        const after = mainOf(await get('https://tibo.dog/'));
        if (after !== before) throw new Error('Game changed while capturing full journal');
        writeFileSync(join(out, 'full.html'), html);
        const binding = { status: 'available', url: 'https://tibo.dog/changelog', main: before, checkedAt: new Date().toISOString(), htmlSha256: hash(html) };
        receipt.binding.builds.new.fullPage = binding;
        return binding;
      });
      receipt.browser = await stage('browser:new', () => browserJournal(builds[1], journals[1], commit.slice(0, 7), out, fullPage));
    } else receipt.stages.push({ name: 'browser:new', status: 'not-run' });
    packet.browser = receipt.browser ?? { status: 'not-run' };
    json(join(out, 'packet.json'), packet);
    receipt.artifacts = Object.fromEntries(readdirSync(out).filter((file) => file !== 'receipt.json').map((file) => [file, hash(readFileSync(join(out, file)))]));
    receipt.status = 'complete';
    receipt.completedAt = new Date().toISOString();
    save();
    return { out, receipt, packet };
  } catch (error) {
    receipt.status = 'failed'; receipt.error = error.message; receipt.completedAt = new Date().toISOString(); save();
    throw new Error(`${error.message}; shadow evidence preserved: ${out}`, { cause: error });
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    const { positionals, values } = parseArgs({ allowPositionals: true, options: { browser: { type: 'boolean' }, 'full-receipt': { type: 'string' } } });
    if (positionals.length !== 2) throw new Error('Usage: node tools/shadow-update.mjs <old main> <new main> [--browser] [--full-receipt <prior receipt>]');
    const result = await shadowUpdate(...positionals, { browser: values.browser, fullReceipt: values['full-receipt'] });
    console.log(`shadow: complete; ${result.packet.journalChanges.length} journal differences; publishing unchanged`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
