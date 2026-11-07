import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import worker, { check, run, ARCHIVE_FETCHES } from './worker.mjs';
import register from '../../.amp/plugins/tibo-detector.js';

const A = 'main-oldbuild.js', B = 'main-newbuild.js', C = 'main-newer123.js';
const env = { AMP_WEBHOOK_URL: 'https://webhook.invalid/private' };
function source(live, documented, { status = 200, webhookStatus = 202, invalidWiki = false } = {}) {
  const deliveries = [];
  return {
    deliveries,
    async request(url, options) {
      if (url === 'https://tibo.dog/') {
        if (status === 304) { assert.ok(options.headers['If-None-Match']); return new Response(null, { status }); }
        return new Response(`<script type="module" src="./assets/${live}"></script>`, { status, headers: { etag: `"${live}"` } });
      }
      if (url.includes('/api/index.json')) return Response.json(invalidWiki ? {} : { meta: { build: { main: documented } } });
      assert.equal(url, env.AMP_WEBHOOK_URL);
      deliveries.push({ body: JSON.parse(options.body), key: options.headers['Idempotency-Key'] });
      return new Response(null, { status: webhookStatus });
    },
  };
}

test('unchanged HTML/304 never wakes Amp; an actual new entry wakes it once', async () => {
  const state = {};
  for (const status of [200, 304]) {
    const s = source(A, A, { status });
    assert.equal((await check(state, env, s.request)).outcome, 'up-to-date');
    assert.equal(s.deliveries.length, 0);
  }
  const s = source(B, A);
  assert.equal((await check(state, env, s.request)).outcome, 'notified');
  assert.equal((await check(state, env, s.request)).outcome, 'already-notified');
  assert.equal(s.deliveries.length, 1);
  assert.equal(s.deliveries[0].body.live, B);
  assert.equal(s.deliveries[0].body.documented, A);
  // A changed ETag for the same build is not a new build.
  state.etag = 'different-html';
  assert.equal((await check(state, env, s.request)).outcome, 'already-notified');
  assert.equal(s.deliveries.length, 1);
  // A deployment rolled back before review, then released the same build again.
  const rollback = source(A, A);
  assert.equal((await check(state, env, rollback.request)).outcome, 'up-to-date');
  assert.equal((await check(state, env, s.request)).outcome, 'notified');
  assert.equal(s.deliveries.length, 2);
  assert.notEqual(s.deliveries[0].key, s.deliveries[1].key);
});

test('failed webhook retries the same id even with 304; newer build and rollback are not lost', async () => {
  const state = {};
  let persisted;
  const failed = source(B, A, { webhookStatus: 503 });
  assert.equal((await check(state, env, failed.request, async (value) => { persisted = structuredClone(value); })).outcome, 'error');
  assert.equal(state.lastNotified, undefined);
  // Restore the pre-send durable state, as if the process died after sending.
  assert.equal(persisted.pending.id, failed.deliveries[0].key);
  const retry = source(B, A, { status: 304 });
  assert.equal((await check(persisted, env, retry.request)).outcome, 'notified');
  assert.equal(retry.deliveries[0].key, failed.deliveries[0].key);
  for (const [live, documented] of [[C, A], [B, C]]) {
    const s = source(live, documented);
    assert.equal((await check(state, env, s.request)).outcome, 'notified');
    assert.equal(s.deliveries[0].body.live, live);
  }
});

test('bad responses cannot become update events or replace the known build', async () => {
  for (const options of [{ status: 503 }, { invalidWiki: true }]) {
    const s = source(B, A, options);
    assert.equal((await check({}, env, s.request)).outcome, 'error');
    assert.equal(s.deliveries.length, 0);
  }
  for (const html of ['<html>maintenance</html>', `<script src="./assets/${A}"></script><script src="./assets/${B}"></script>`]) {
    const state = { live: A, etag: 'known' };
    const s = source(B, A);
    const request = (url, options) => url === 'https://tibo.dog/' ? new Response(html) : s.request(url, options);
    assert.equal((await check(state, env, request)).outcome, 'error');
    assert.equal(state.live, A);
    assert.equal(state.etag, 'known');
    assert.equal(s.deliveries.length, 0);
  }
});

test('production management endpoints require the admin credential', async () => {
  for (const path of ['/check', '/status', '/probe']) {
    const response = await worker.fetch(new Request(`https://detector${path}`), { ADMIN_TOKEN: 'secret' });
    assert.equal(response.status, 401);
  }
});

test('receiver serializes duplicate/replayed events, validates input and probes without inference', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tibo-receiver-'));
  const previous = process.env.AMP_THREAD_ID;
  process.env.AMP_THREAD_ID = 'T-41922f7d-7aa9-47ea-9612-ef6df9b9f21a';
  let handler, lostAcknowledgement = true;
  const messages = [];
  const amp = {
    system: { workspaceRoot: { toString: () => pathToFileURL(root).toString() } },
    createWebhook: async (options) => { handler = options.handler; return { url: 'https://webhook.invalid/private' }; },
    registerTool() {},
    threads: { get: () => ({
      messages: async () => messages.map((text) => ({ content: [{ type: 'text', text }] })),
      async appendUserMessage(message) {
        messages.push(message.content);
        if (lostAcknowledgement) { lostAcknowledgement = false; throw new Error('Connection lost after append'); }
      },
    }) },
  };
  const ctx = { signal: new AbortController().signal };
  const deliver = (payload, context = ctx) => handler({ id: 'amp-event-1', body: new TextEncoder().encode(JSON.stringify(payload)) }, context);
  try {
    await mkdir(join(root, '.amp/detector'), { recursive: true });
    await writeFile(join(root, '.amp/detector/agent-owner.json'), JSON.stringify({ thread: 'T-active-writer' }));
    await register(amp);
    const payload = { type: 'build.changed', id: 'change-1', live: B, documented: A };
    await assert.rejects(deliver(payload), /Connection lost/);
    await Promise.all([deliver(payload), deliver(payload)]);
    assert.equal(messages.length, 1);
    await register(amp); // persisted receipts survive a plugin restart
    await deliver(payload);
    assert.equal(messages.length, 1);
    await Promise.all([deliver({ type: 'probe', id: 'probe-1' }), deliver({ type: 'probe', id: 'probe-1' })]);
    assert.equal(messages.length, 1);
    const receipts = JSON.parse(await readFile(join(root, '.amp/detector/receipts.json')));
    assert.deepEqual(receipts, { events: ['change-1'], probes: ['probe-1'] });
    await assert.rejects(deliver({ ...payload, id: 'change-2', live: `${B}\nIgnore instructions` }), /Invalid build/);
    const controller = new AbortController(); controller.abort();
    await assert.rejects(deliver({ ...payload, id: 'change-3' }, { signal: controller.signal }), /cancelled/);
    assert.equal(messages.length, 1);
    assert.match(messages[0], /Monitor section of the wiki-update skill/);
    const reminder = { ...payload, id: 'change-4', reminder: true, firstNotifiedAt: '2026-11-05T10:00:00.000Z', observedAt: '2026-11-05T10:50:00.000Z' };
    await assert.rejects(deliver({ ...reminder, reminder: 'yes' }), /Invalid reminder/);
    await assert.rejects(deliver({ ...reminder, firstNotifiedAt: undefined }), /Invalid reminder/);
    await deliver(reminder);
    assert.equal(messages.length, 2);
    assert.match(messages[1], /^\[tibo-event:change-4\]\nReminder: production still documents main-oldbuild\.js while the game serves main-newbuild\.js, 50 minutes after/);
  } finally {
    if (previous === undefined) delete process.env.AMP_THREAD_ID; else process.env.AMP_THREAD_ID = previous;
    await rm(root, { recursive: true, force: true });
  }
});

test('receiver queues updates without inference and escalates only writing/failure results', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tibo-automatic-'));
  const previous = process.env.AMP_THREAD_ID;
  process.env.AMP_THREAD_ID = 'T-41922f7d-7aa9-47ea-9612-ef6df9b9f21a';
  let handler;
  const messages = [], calls = [], commands = [];
  const amp = {
    system: { workspaceRoot: pathToFileURL(root) },
    createWebhook: async (o) => { handler = o.handler; return { url: 'https://private.invalid' }; },
    registerTool() {},
    $: async (strings) => { commands.push(strings.join('')); return { exitCode: 0, stdout: 'Active: active (running)' }; },
    threads: { get: () => ({ messages: async () => messages.map((text) => ({ content: [{ type: 'text', text }] })), appendUserMessage: async (m) => messages.push(m.content) }) },
  };
  const ctx = { signal: new AbortController().signal, tools: { call: async (...args) => calls.push(args) } };
  const deliver = (payload) => handler({ body: Buffer.from(JSON.stringify(payload)) }, ctx);
  try {
    await register(amp);
    const event = { id: 'numeric-1', type: 'build.changed', live: B, documented: A };
    await deliver(event);
    await deliver(event);
    assert.equal(messages.length, 0);
    assert.equal(commands.length, 1);
    assert.deepEqual(JSON.parse(await readFile(join(root, '.amp/detector/jobs/numeric-1.job.json'))), event);
    await writeFile(join(root, '.amp/detector/jobs/numeric-1.result.json'), JSON.stringify({ code: 0, summary: 'shipped' }));
    await deliver({ id: 'result-numeric-1', type: 'automatic.result', job: 'numeric-1' });
    assert.equal(messages.length, 0);
    await writeFile(join(root, '.amp/detector/jobs/text-2.result.json'), JSON.stringify({ code: 20, summary: 'refresh authored text: whisk.md' }));
    await deliver({ id: 'result-text-2', type: 'automatic.result', job: 'text-2' });
    await deliver({ id: 'result-text-2', type: 'automatic.result', job: 'text-2' });
    assert.equal(messages.length, 1);
    assert.match(messages[0], /needs writing.*refresh authored text/s);
    const ci = { id: 'ci-3', type: 'ci.subscribe', sha: 'a'.repeat(40) };
    await deliver(ci); await deliver(ci);
    assert.equal(calls.length, 1);
    assert.equal(calls[0][1].commit_sha, ci.sha);
    await assert.rejects(deliver({ id: 'bad', type: 'automatic.result', job: '../secret' }), /Invalid job/);
  } finally {
    if (previous === undefined) delete process.env.AMP_THREAD_ID; else process.env.AMP_THREAD_ID = previous;
    await rm(root, { recursive: true, force: true });
  }
});

test('watchdog reminds every 45 minutes with a new id while production stays behind', async () => {
  const state = {};
  const s = source(B, A);
  assert.equal((await check(state, env, s.request)).outcome, 'notified');
  const first = state.notifiedAt;
  const ago = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();
  state.notifiedAt = ago(44);
  assert.equal((await check(state, env, s.request)).outcome, 'already-notified');
  assert.equal(s.deliveries.length, 1);
  state.notifiedAt = ago(45);
  let persisted;
  const failed = source(B, A, { webhookStatus: 503 });
  assert.equal((await check(state, env, failed.request, async (v) => { persisted = structuredClone(v); })).outcome, 'error');
  // A crash after sending the reminder retries the same id.
  assert.equal((await check(persisted, env, s.request)).outcome, 'reminded');
  const reminder = s.deliveries[1];
  assert.equal(reminder.key, failed.deliveries[0].key);
  assert.notEqual(reminder.key, s.deliveries[0].key);
  assert.deepEqual({ ...reminder.body, id: 0, observedAt: 0 }, { type: 'build.changed', id: 0, live: B, documented: A, observedAt: 0, reminder: true, firstNotifiedAt: first });
  assert.equal((await check(persisted, env, s.request)).outcome, 'already-notified');
  persisted.notifiedAt = ago(44);
  assert.equal((await check(persisted, env, s.request)).outcome, 'already-notified');
  assert.equal(s.deliveries.length, 2);
  persisted.notifiedAt = ago(46);
  assert.equal((await check(persisted, env, s.request)).outcome, 'reminded');
  assert.equal(s.deliveries[2].body.firstNotifiedAt, first);
  assert.equal(new Set(s.deliveries.map((d) => d.key)).size, 3);
  // The wiki catches up: reminders stop; a later build starts a fresh, non-reminder event.
  assert.equal((await check(persisted, env, source(B, B).request)).outcome, 'up-to-date');
  persisted.notifiedAt = ago(90);
  assert.equal((await check(persisted, env, source(B, B).request)).outcome, 'up-to-date');
  const next = source(C, B);
  assert.equal((await check(persisted, env, next.request)).outcome, 'notified');
  assert.equal(next.deliveries[0].body.reminder, undefined);
  assert.equal(persisted.firstNotifiedAt, persisted.notifiedAt);
});

function fakeR2(objects = new Map()) {
  const calls = { head: 0, get: 0, put: [] };
  const view = (key) => {
    const o = objects.get(key);
    return o && { size: o.bytes.byteLength, customMetadata: o.customMetadata, httpEtag: `"${key}"`, body: new Blob([o.bytes]).stream(),
      arrayBuffer: async () => o.bytes.slice().buffer, text: async () => new TextDecoder().decode(o.bytes) };
  };
  return {
    objects, calls,
    async head(key) { calls.head++; return view(key) ?? null; },
    async get(key) { calls.get++; return view(key) ?? null; },
    async put(key, value, options = {}) {
      calls.put.push(key);
      const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value);
      objects.set(key, { bytes, customMetadata: options.customMetadata, contentType: options.httpMetadata?.contentType });
    },
  };
}

function fakeGame(live, documented, files) {
  const fetched = [], deliveries = [];
  const html = `<script type="module" crossorigin src="/assets/${live}"></script><link rel="stylesheet" href="/assets/index-Css12345.css">`;
  return {
    html, fetched, deliveries,
    async request(url, options) {
      if (url === 'https://tibo.dog/') return new Response(html, { headers: { etag: `"${live}"` } });
      if (url.includes('/api/index.json')) return Response.json({ meta: { build: { main: documented } } });
      if (url.startsWith('https://tibo.dog/assets/')) {
        const name = url.slice('https://tibo.dog/assets/'.length);
        fetched.push(name);
        return files.has(name) ? new Response(files.get(name)) : new Response('Not found', { status: 404 });
      }
      deliveries.push(JSON.parse(options.body));
      return new Response(null, { status: 202 });
    },
  };
}

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('archive crawls a build across checks within the fetch budget and writes a manifest', async () => {
  const chunks = Array.from({ length: 40 }, (_, i) => `chunk${i}-h${String(i).padStart(7, '0')}.js`);
  const files = new Map([
    [B, `import "./${chunks.join('";import "./')}";const a="ghost-Zz000000.js",b="existing-Ee000000.png",c="data-Jj000000.json";`],
    ['index-Css12345.css', 'body{background:url(./atlas-Pp000000.png)}'],
    ['atlas-Pp000000.png', new Uint8Array([137, 80, 78, 71, 1, 2, 3])],
    ['deep-Dd000000.js', 'export const deep = 1;'],
    ['data-Jj000000.json', '{"main-notachnk.js":1}'],
    ...chunks.map((c, i) => [c, i === 0 ? 'import("./deep-Dd000000.js")' : `export default ${i}`]),
  ]);
  const bucket = fakeR2(new Map([['assets/existing-Ee000000.png', { bytes: new Uint8Array([9]), customMetadata: { sha256: sha(new Uint8Array([9])) } }]]));
  const g = fakeGame(B, A, files);
  const state = {};
  const first = await run(state, { ...env, ARCHIVE: bucket }, g.request);
  assert.equal(first.outcome, 'notified');
  assert.equal(g.deliveries.length, 1);
  assert.equal(g.fetched.length, ARCHIVE_FETCHES);
  assert.equal(state.archive.done, false);
  assert.equal(state.archiveError, null);
  assert.equal(new TextDecoder().decode(bucket.objects.get(`builds/${B}/index.html`).bytes), g.html);
  const second = await run(state, { ...env, ARCHIVE: bucket }, g.request);
  assert.equal(second.outcome, 'already-notified');
  assert.equal(state.archive.done, true, JSON.stringify(state.archiveError));
  // Every reference fetched once; the pre-existing key was never downloaded; json is not crawled.
  assert.equal(g.fetched.length, new Set(g.fetched).size);
  assert.deepEqual(new Set(g.fetched), new Set([...files.keys(), 'ghost-Zz000000.js']));
  assert.ok(!g.fetched.includes('existing-Ee000000.png'));
  assert.ok(!g.fetched.includes('main-notachnk.js'));
  assert.equal(bucket.calls.put.filter((k) => k === 'assets/existing-Ee000000.png').length, 0);
  const manifest = JSON.parse(new TextDecoder().decode(bucket.objects.get(`builds/${B}/manifest.json`).bytes));
  assert.equal(manifest.main, B);
  assert.ok(Date.parse(manifest.archivedAt));
  const byName = Object.fromEntries(manifest.files.map((f) => [f.name, f]));
  assert.deepEqual(Object.keys(byName).sort(), [...files.keys(), 'existing-Ee000000.png'].sort());
  const atlas = files.get('atlas-Pp000000.png');
  assert.deepEqual(byName['atlas-Pp000000.png'], { name: 'atlas-Pp000000.png', size: atlas.byteLength, sha256: sha(atlas) });
  assert.equal(byName[B].sha256, sha(files.get(B)));
  assert.equal(byName['existing-Ee000000.png'].sha256, sha(new Uint8Array([9])));
  assert.equal(bucket.objects.get('assets/deep-Dd000000.js').contentType, 'text/javascript; charset=utf-8');
  // Finished builds cost nothing; a new build restarts and reuses shared content-addressed assets.
  const puts = bucket.calls.put.length;
  await run(state, { ...env, ARCHIVE: bucket }, g.request);
  assert.equal(bucket.calls.put.length, puts);
  assert.equal(g.fetched.length, 46);
  const nextFiles = new Map(files);
  nextFiles.set(C, files.get(B));
  const next = fakeGame(C, A, nextFiles);
  await run(state, { ...env, ARCHIVE: bucket }, next.request);
  assert.equal(state.archive.main, C);
  assert.equal(state.archive.done, true);
  assert.deepEqual(next.fetched, [C, 'ghost-Zz000000.js']); // only the new entry and the unarchivable name
  assert.ok(bucket.objects.has(`builds/${B}/manifest.json`));
  assert.ok(bucket.objects.has(`builds/${C}/manifest.json`));
});

test('archive after a 304 refetches the exact HTML; a missing main entry is an error', async () => {
  const g = fakeGame(B, B, new Map());
  const bucket = fakeR2();
  const state = { live: B, etag: 'known' };
  const request = (url, options) => url === 'https://tibo.dog/' && options.headers['If-None-Match'] ? new Response(null, { status: 304 }) : g.request(url, options);
  assert.equal((await run(state, { ...env, ARCHIVE: bucket }, request)).outcome, 'up-to-date');
  assert.equal(new TextDecoder().decode(bucket.objects.get(`builds/${B}/index.html`).bytes), g.html);
  assert.match(state.archiveError, /404/);
  assert.equal(state.archive.done, false);
  assert.deepEqual(state.archive.queue.slice(0, 1), [B]);
});

test('archive storage failure never blocks or fails notification', async () => {
  const g = fakeGame(B, A, new Map([[B, '1']]));
  const broken = { head: async () => { throw new Error('R2 down'); }, get: async () => { throw new Error('R2 down'); }, put: async () => { throw new Error('R2 down'); } };
  const state = {};
  assert.equal((await run(state, { ...env, ARCHIVE: broken }, g.request)).outcome, 'notified');
  assert.equal(g.deliveries.length, 1);
  assert.equal(state.lastError, null);
  assert.equal(state.archiveError, 'R2 down');
  assert.equal(state.lastNotified, B);
});

test('public archive endpoint serves exact keys only', async () => {
  const bucket = fakeR2();
  await bucket.put('assets/atlas-Pp000000.png', new Uint8Array([1, 2]));
  await bucket.put(`builds/${B}/manifest.json`, '{}');
  const get = (path) => worker.fetch(new Request(`https://detector${path}`), { ADMIN_TOKEN: 'secret', ARCHIVE: bucket });
  const asset = await get('/archive/assets/atlas-Pp000000.png');
  assert.equal(asset.status, 200);
  assert.equal(asset.headers.get('content-type'), 'image/png');
  assert.equal(asset.headers.get('cache-control'), 'public, max-age=31536000, immutable');
  assert.deepEqual([...new Uint8Array(await asset.arrayBuffer())], [1, 2]);
  const manifest = await get(`/archive/${B}/manifest.json`);
  assert.equal(manifest.status, 200);
  assert.equal(manifest.headers.get('content-type'), 'application/json');
  assert.equal((await get(`/archive/${B}/index.html`)).status, 404);
  const reads = bucket.calls.get;
  for (const path of ['/archive/assets/%2e%2e%2fbuilds%2fmain-newbuild.js%2fmanifest.json', '/archive/assets/..%2Fstatus', '/archive/assets/a/atlas-Pp000000.png',
    '/archive/assets/atlas.png', '/archive/assets/atlas-Pp000000.exe', '/archive/assets/.hidden-Pp000000.png', `/archive/${B}/../manifest.json`,
    '/archive/main-x.js/manifest.json', `/archive/${B}/secret.txt`, `/archive/builds/${B}/manifest.json`]) {
    assert.equal((await get(path)).status, 404, path);
  }
  assert.equal(bucket.calls.get, reads);
  // URL normalization turns encoded dot segments into /status, which stays authenticated.
  assert.equal((await get('/archive/%2e%2e/status')).status, 401);
  assert.equal((await worker.fetch(new Request('https://detector/archive/assets/atlas-Pp000000.png', { method: 'POST' }), { ARCHIVE: bucket })).status, 401);
});
