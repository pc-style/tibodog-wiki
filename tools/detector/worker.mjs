const GAME = 'https://tibo.dog/';
const WIKI = 'https://tibodog-wiki.vercel.app/api/index.json';
const MAIN = /^main-[A-Za-z0-9_-]{8}\.js$/;

// Mutate one persisted observation. Transport failures leave notification pending.
export async function check(state, env, request = fetch, persist = async () => {}) {
  state.checks = (state.checks ?? 0) + 1;
  state.checkedAt = new Date().toISOString();
  try {
    const headers = { 'Cache-Control': 'no-cache', 'User-Agent': 'tibodog-wiki-detector' };
    const [game, wiki] = await Promise.all([
      request(GAME, { headers: { ...headers, ...(state.etag ? { 'If-None-Match': state.etag } : {}) }, signal: AbortSignal.timeout(8000) }),
      request(WIKI, { headers, signal: AbortSignal.timeout(8000) }),
    ]);
    if (game.status === 304) {
      if (!MAIN.test(state.live ?? '')) throw new Error('304 without a known build');
    } else {
      if (!game.ok) throw new Error(`Game HTTP ${game.status}`);
      const html = await game.text();
      const entries = [...html.matchAll(/<script\b[^>]*\bsrc=["'][^"']*\/assets\/(main-[A-Za-z0-9_-]{8}\.js)["'][^>]*>/g)].map((m) => m[1]);
      if (new Set(entries).size !== 1) throw new Error('Missing or ambiguous game entry script');
      state.live = entries[0];
      state.etag = game.headers.get('etag');
    }
    if (!wiki.ok) throw new Error(`Wiki HTTP ${wiki.status}`);
    const documented = (await wiki.json()).meta?.build?.main;
    if (!MAIN.test(documented ?? '')) throw new Error('Invalid wiki build metadata');
    state.documented = documented;
    state.lastError = null;
    if (state.live === documented) {
      state.pending = null;
      state.lastNotified = null;
      return { outcome: 'up-to-date', live: state.live };
    }
    if (state.lastNotified === state.live) return { outcome: 'already-notified', live: state.live };
    if (state.pending?.live !== state.live) {
      state.pending = { type: 'build.changed', id: crypto.randomUUID(), live: state.live, documented, observedAt: state.checkedAt };
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
    state.pending = null;
    return { outcome: 'notified', live: state.live };
  } catch (error) {
    // Avoid exposing the capability URL in network error messages.
    state.lastError = error.message.startsWith('Amp webhook HTTP') || /^(Game HTTP|Wiki HTTP|Invalid wiki|Missing or ambiguous|304 without)/.test(error.message)
      ? error.message : 'Detector network or response failure';
    return { outcome: 'error', error: state.lastError };
  }
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
      if (path === '/status') return Response.json(state);
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
      const result = await check(state, this.env, fetch, (value) => this.ctx.storage.put('state', value));
      await this.ctx.storage.put('state', state);
      console.log(JSON.stringify(result));
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
    if (!env.ADMIN_TOKEN || request.headers.get('authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return new Response('Unauthorized', { status: 401 });
    if ((path === '/status' && request.method === 'GET') || (['/check', '/probe'].includes(path) && request.method === 'POST')) {
      return detector(env).fetch(request);
    }
    return new Response('Not found', { status: 404 });
  },
};
