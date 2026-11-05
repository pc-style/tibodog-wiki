const GAME = 'https://tibo.dog/';
const WIKI = 'https://tibodog-wiki.vercel.app/api/index.json';
const MAIN = /^main-[A-Za-z0-9_-]{8}\.js$/;
const REMIND_MS = 45 * 60 * 1000;
const UA = 'tibodog-wiki-detector';

// Hashed build assets: the same filename always has the same content.
const TYPES = {
  js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8', png: 'image/png', webp: 'image/webp',
  jpg: 'image/jpeg', svg: 'image/svg+xml', json: 'application/json', wasm: 'application/wasm', woff2: 'font/woff2',
  mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', html: 'text/html; charset=utf-8',
};
const EXT = 'js|css|png|webp|jpg|svg|json|wasm|woff2|mp3|ogg|wav';
const ASSET = new RegExp(`^[A-Za-z0-9_][A-Za-z0-9_.-]*-[A-Za-z0-9_-]{8}\\.(?:${EXT})$`);
const REF = new RegExp(`[A-Za-z0-9_][A-Za-z0-9_.-]*-[A-Za-z0-9_-]{8}\\.(?:${EXT})(?![A-Za-z0-9_])`, 'g');
// Per check: external asset fetches (Workers allow 50 subrequests; notify uses up to 4).
export const ARCHIVE_FETCHES = 35;
const ARCHIVE_BATCH = 7;
const ARCHIVE_ITEMS = 200;
const ARCHIVE_MS = 15000;

// Mutate one persisted observation. Transport failures leave notification pending.
// `observed` receives the live build (and HTML when downloaded) for the archiver.
export async function check(state, env, request = fetch, persist = async () => {}, observed = {}) {
  state.checks = (state.checks ?? 0) + 1;
  state.checkedAt = new Date().toISOString();
  try {
    const headers = { 'Cache-Control': 'no-cache', 'User-Agent': UA };
    const [game, wiki] = await Promise.all([
      request(GAME, { headers: { ...headers, ...(state.etag ? { 'If-None-Match': state.etag } : {}) }, signal: AbortSignal.timeout(8000) }),
      request(WIKI, { headers, signal: AbortSignal.timeout(8000) }),
    ]);
    if (game.status === 304) {
      if (!MAIN.test(state.live ?? '')) throw new Error('304 without a known build');
    } else {
      if (!game.ok) throw new Error(`Game HTTP ${game.status}`);
      const html = await game.text();
      const entry = entryOf(html);
      if (!entry) throw new Error('Missing or ambiguous game entry script');
      state.live = entry;
      state.etag = game.headers.get('etag');
      observed.html = html;
    }
    observed.live = state.live;
    if (!wiki.ok) throw new Error(`Wiki HTTP ${wiki.status}`);
    const documented = (await wiki.json()).meta?.build?.main;
    if (!MAIN.test(documented ?? '')) throw new Error('Invalid wiki build metadata');
    state.documented = documented;
    state.lastError = null;
    if (state.live === documented) {
      state.pending = null;
      state.lastNotified = null;
      state.firstNotifiedAt = null;
      return { outcome: 'up-to-date', live: state.live };
    }
    // Watchdog: production still behind 45 minutes after the last notification.
    const reminder = state.lastNotified === state.live;
    if (reminder && Date.parse(state.checkedAt) - Date.parse(state.notifiedAt) < REMIND_MS) {
      return { outcome: 'already-notified', live: state.live };
    }
    if (state.pending?.live !== state.live || Boolean(state.pending.reminder) !== reminder) {
      state.pending = { type: 'build.changed', id: crypto.randomUUID(), live: state.live, documented, observedAt: state.checkedAt };
      if (reminder) Object.assign(state.pending, { reminder: true, firstNotifiedAt: state.firstNotifiedAt ?? state.notifiedAt });
    }
    // A crash after sending must retry the same id, not create a second event.
    await persist(state);
    const result = await request(env.AMP_WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': state.pending.id },
      body: JSON.stringify(state.pending), signal: AbortSignal.timeout(8000),
    });
    if (!result.ok) throw new Error(`Amp webhook HTTP ${result.status}`);
    state.lastNotified = state.live;
    state.notifications = (state.notifications ?? 0) + 1;
    state.notifiedAt = state.checkedAt;
    if (reminder) state.reminders = (state.reminders ?? 0) + 1;
    else state.firstNotifiedAt = state.checkedAt;
    state.pending = null;
    return { outcome: reminder ? 'reminded' : 'notified', live: state.live };
  } catch (error) {
    // Avoid exposing the capability URL in network error messages.
    state.lastError = error.message.startsWith('Amp webhook HTTP') || /^(Game HTTP|Wiki HTTP|Invalid wiki|Missing or ambiguous|304 without)/.test(error.message)
      ? error.message : 'Detector network or response failure';
    return { outcome: 'error', error: state.lastError };
  }
}

function entryOf(html) {
  const entries = [...html.matchAll(/<script\b[^>]*\bsrc=["'][^"']*\/assets\/(main-[A-Za-z0-9_-]{8}\.js)["'][^>]*>/g)].map((m) => m[1]);
  return new Set(entries).size === 1 ? entries[0] : null;
}

// Notify first; archiving runs afterwards and can never turn the check into an error.
export async function run(state, env, request = fetch, persist = async () => {}) {
  const observed = {};
  const result = await check(state, env, request, persist, observed);
  if (observed.live && env.ARCHIVE) {
    await persist(state);
    try {
      await archive(state, env.ARCHIVE, request, observed);
      state.archiveError = null;
    } catch (error) {
      state.archiveError = String(error?.message ?? error).slice(0, 300);
    }
  }
  return result;
}

const hex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
const extOf = (name) => name.slice(name.lastIndexOf('.') + 1);
const refs = (text) => text.match(REF) ?? [];

// Incrementally copy the live build into R2: builds/<main>/{index.html,manifest.json}, assets/<file>.
export async function archive(state, bucket, request = fetch, { live, html } = {}, { budget = ARCHIVE_FETCHES, deadline = Date.now() + ARCHIVE_MS } = {}) {
  if (!MAIN.test(live ?? '')) return;
  if (state.archive?.main !== live) {
    // A new live build restarts the crawl; finished builds keep their manifest in R2.
    state.archive = { main: live, index: false, queue: [live], seen: [], files: [], done: false, startedAt: new Date().toISOString() };
    if (await bucket.head(`builds/${live}/manifest.json`)) Object.assign(state.archive, { queue: [], index: true, done: true });
  }
  const a = state.archive;
  if (a.done) return;
  let fetches = 0;
  const enqueue = (text) => {
    for (const name of refs(text)) if (!a.seen.includes(name) && !a.queue.includes(name)) a.queue.push(name);
  };
  if (!a.index) {
    const key = `builds/${live}/index.html`;
    const stored = await bucket.get(key);
    if (stored) html = await stored.text();
    else {
      if (html === undefined) {
        // 304 check: fetch the exact HTML again; skip if it already moved to another build.
        fetches++;
        const response = await request(GAME, { headers: { 'Cache-Control': 'no-cache', 'User-Agent': UA }, signal: AbortSignal.timeout(8000) });
        if (!response.ok) throw new Error(`Archive index HTTP ${response.status}`);
        html = await response.text();
        if (entryOf(html) !== live) return;
      }
      await bucket.put(key, html, { httpMetadata: { contentType: TYPES.html } });
    }
    enqueue(html);
    a.index = true;
  }
  let processed = 0;
  while (a.queue.length && fetches < budget && processed < ARCHIVE_ITEMS && Date.now() < deadline) {
    const batch = [];
    while (a.queue.length && batch.length < Math.min(ARCHIVE_BATCH, budget - fetches)) {
      const name = a.queue.shift();
      if (!a.seen.includes(name) && !batch.includes(name)) batch.push(name);
    }
    const results = await Promise.allSettled(batch.map((name) => archiveAsset(bucket, request, name, name === live)));
    let failure;
    results.forEach((r, i) => {
      processed++;
      if (r.status === 'rejected') {
        failure ??= r.reason;
        a.queue.unshift(batch[i]); // retry on the next check
        return;
      }
      const { fetched, file, text } = r.value;
      if (fetched) fetches++;
      a.seen.push(batch[i]);
      if (file) a.files.push(file);
      if (text !== undefined) enqueue(text);
    });
    if (failure) throw failure;
  }
  if (!a.queue.length) {
    const files = [...a.files].sort((x, y) => (x.name < y.name ? -1 : 1));
    const manifest = { main: live, archivedAt: new Date().toISOString(), files };
    await bucket.put(`builds/${live}/manifest.json`, JSON.stringify(manifest, null, 1), { httpMetadata: { contentType: TYPES.json } });
    Object.assign(a, { done: true, archivedAt: manifest.archivedAt });
  }
}

async function archiveAsset(bucket, request, name, isMain) {
  const key = `assets/${name}`;
  const scan = /\.(js|css)$/.test(name);
  const head = await bucket.head(key);
  if (head && head.customMetadata?.sha256 && !scan) {
    return { fetched: false, file: { name, size: head.size, sha256: head.customMetadata.sha256 } };
  }
  let bytes, fetched = false;
  if (head) bytes = await (await bucket.get(key)).arrayBuffer();
  else {
    fetched = true;
    const response = await request(`${GAME}assets/${name}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) });
    if (response.status === 404 && !isMain) return { fetched }; // a name-shaped string that is not a chunk
    if (!response.ok) throw new Error(`Archive HTTP ${response.status} for ${name}`);
    bytes = await response.arrayBuffer();
  }
  const sha256 = hex(await crypto.subtle.digest('SHA-256', bytes));
  if (!head) await bucket.put(key, bytes, { httpMetadata: { contentType: TYPES[extOf(name)] }, customMetadata: { sha256 } });
  return { fetched, file: { name, size: bytes.byteLength, sha256 }, text: scan ? new TextDecoder().decode(bytes) : undefined };
}

// Public read-only access to archived builds. Only exact archive key shapes are accepted.
export async function serveArchive(request, env) {
  const path = new URL(request.url).pathname;
  let key, cache;
  const asset = path.match(/^\/archive\/assets\/([^/]+)$/);
  const build = path.match(/^\/archive\/([^/]+)\/(manifest\.json|index\.html)$/);
  if (asset && ASSET.test(asset[1])) [key, cache] = [`assets/${asset[1]}`, 'public, max-age=31536000, immutable'];
  else if (build && MAIN.test(build[1])) [key, cache] = [`builds/${build[1]}/${build[2]}`, 'public, max-age=300'];
  else return new Response('Not found', { status: 404 });
  if (!env.ARCHIVE) return new Response('Archive unavailable', { status: 503 });
  const object = request.method === 'HEAD' ? await env.ARCHIVE.head(key) : await env.ARCHIVE.get(key);
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers({
    'Content-Type': TYPES[extOf(key)], 'Cache-Control': cache, 'Content-Length': String(object.size),
    // Archived game HTML/SVG must not run scripts on this origin.
    'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': 'sandbox',
  });
  if (object.httpEtag) headers.set('ETag', object.httpEtag);
  return new Response(request.method === 'HEAD' ? null : object.body, { headers });
}

function status(state) {
  const a = state.archive;
  const progress = a && { main: a.main, done: a.done, index: a.index, archived: a.files.length, seen: a.seen.length, queued: a.queue.length, startedAt: a.startedAt, archivedAt: a.archivedAt ?? null };
  return { ...state, archive: progress ?? null };
}

export class Detector {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
  }

  async fetch(request) {
    // Serialize cron and manual checks, including I/O, to avoid duplicate sends.
    return this.ctx.blockConcurrencyWhile(async () => {
      const state = (await this.ctx.storage.get('state')) ?? {};
      const path = new URL(request.url).pathname;
      if (path === '/status') return Response.json(status(state));
      if (path === '/probe') {
        const { id } = await request.json();
        if (!/^[a-zA-Z0-9-]{1,80}$/.test(id ?? '')) return new Response('Invalid probe', { status: 400 });
        const response = await fetch(this.env.AMP_WEBHOOK_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': id },
          body: JSON.stringify({ type: 'probe', id }), signal: AbortSignal.timeout(8000),
        });
        return Response.json({ accepted: response.ok, status: response.status });
      }
      if (path !== '/check') return new Response('Not found', { status: 404 });
      if (request.headers.get('x-trigger') === 'cron') state.cronChecks = (state.cronChecks ?? 0) + 1;
      const result = await run(state, this.env, fetch, (value) => this.ctx.storage.put('state', value));
      await this.ctx.storage.put('state', state);
      console.log(JSON.stringify({ ...result, archiveError: state.archiveError ?? null }));
      return Response.json(result, { status: result.outcome === 'error' ? 502 : 200 });
    });
  }
}

function detector(env) {
  return env.DETECTOR.get(env.DETECTOR.idFromName('tibo-game'));
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(detector(env).fetch(new Request('https://detector/check', { method: 'POST', headers: { 'x-trigger': 'cron' } })).then((r) => {
      if (!r.ok) throw new Error(`Detector check failed: ${r.status}`);
    }));
  },
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === '/health' && request.method === 'GET') return Response.json({ service: 'tibodog-game-detector' });
    if (path.startsWith('/archive/') && ['GET', 'HEAD'].includes(request.method)) return serveArchive(request, env);
    if (!env.ADMIN_TOKEN || request.headers.get('authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return new Response('Unauthorized', { status: 401 });
    if ((path === '/status' && request.method === 'GET') || (['/check', '/probe'].includes(path) && request.method === 'POST')) {
      return detector(env).fetch(request);
    }
    return new Response('Not found', { status: 404 });
  },
};
