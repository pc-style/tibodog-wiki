// Markdown content negotiation, Markdown/JSON 404 bodies and Vary headers for the static wiki.
import { next, rewrite } from '@vercel/functions';
import PATHS, { API as API_PATHS, DOCUMENTED, KNOWN } from './paths.js';

const PAGES = new Set(PATHS);
const API = new Set(API_PATHS);

export const config = {
  matcher: ['/((?!icons/|style\\.css|site\\.js|favicon\\.png|search-index\\.json|_vercel).*)'],
};

function wantsMarkdown(accept) {
  if (!accept) return false;
  let md = -1, html = -1;
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    const qp = params.find((p) => p.trim().startsWith('q='));
    const q = qp ? Number(qp.trim().slice(2)) : 1;
    if (type === 'text/markdown' || type === 'text/x-markdown') md = Math.max(md, q);
    if (type === 'text/html' || type === 'application/xhtml+xml') html = Math.max(html, q);
  }
  return md > 0 && md >= html;
}

const mdNotFound = (path) =>
  `# 404 Not Found\n\nThere is no page at \`${path}\` on the tibo.dog Wiki.\n\n- Main page: /index.md\n- Every page: /all-pages.md\n- Index for agents: /llms.txt\n- Data API: /api/index.json\n`;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body, null, 1), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'access-control-allow-origin': '*' } });

// Loads tibo.dog now and compares the entry script it serves with the build the wiki documents.
async function liveBuild() {
  const checkedAt = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  let main;
  try {
    const res = await fetch('https://tibo.dog/', { cache: 'no-store', headers: { 'user-agent': 'tibodog-wiki live build check (+https://tibodog-wiki.vercel.app/versions)' }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`tibo.dog answered HTTP ${res.status}`);
    main = (await res.text()).match(/assets\/(main-[A-Za-z0-9_-]{8}\.js)/)?.[1];
    if (!main) throw new Error('no main-*.js script found in the tibo.dog page');
  } catch (e) {
    return json({ error: { code: 'live_check_failed', status: 502, message: `Could not read the live game: ${e.message}`, hint: 'Try again in a minute.' }, checkedAt, documented: DOCUMENTED }, 502);
  }
  const version = KNOWN.find((b) => b.main === main)?.version ?? null;
  const status = main === DOCUMENTED.main ? 'up-to-date' : version && version < DOCUMENTED.version ? 'wiki-ahead' : 'game-updated';
  const message = {
    'up-to-date': `The wiki matches the live game: tibo.dog serves game version ${DOCUMENTED.version} (${main}).`,
    'game-updated': `tibo.dog has a newer build than this wiki: it serves ${main}${version ? ` (game version ${version}, not on the wiki yet)` : ', which the wiki has not documented yet'}. The wiki documents game version ${DOCUMENTED.version} (${DOCUMENTED.main}).`,
    'wiki-ahead': `tibo.dog serves an older build, game version ${version} (${main}); this wiki documents version ${DOCUMENTED.version}. The game may have been rolled back.`,
  }[status];
  return json({ status, message, checkedAt, live: { main, version }, documented: DOCUMENTED });
}

export default function middleware(request) {
  const url = new URL(request.url);
  const p = url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : '/';
  const accept = request.headers.get('accept') ?? '';

  if (p.startsWith('/api/')) {
    if (p === '/api/live-build' || p === '/api/v1/live-build') return liveBuild();
    if (API.has(p)) return next();
    return new Response(
      JSON.stringify({ error: { code: 'not_found', status: 404, message: `No API endpoint at ${p}.`, hint: 'GET /api/v1/index.json lists every endpoint; /openapi.json describes them.' } }, null, 1),
      { status: 404, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } },
    );
  }

  if (p.endsWith('.md')) {
    const base = p === '/index.md' ? '/' : p.slice(0, -3);
    if (PAGES.has(base) || p === '/404.md') return next({ headers: { vary: 'Accept' } });
    return new Response(mdNotFound(p), { status: 404, headers: { 'content-type': 'text/markdown; charset=utf-8', vary: 'Accept' } });
  }

  if (/\.[a-z0-9]+$/i.test(p)) return next();

  if (PAGES.has(p)) {
    if (wantsMarkdown(accept)) {
      return rewrite(new URL(p === '/' ? '/index.md' : `${p}.md`, request.url), {
        headers: { vary: 'Accept', 'content-type': 'text/markdown; charset=utf-8' },
      });
    }
    return next({ headers: { vary: 'Accept' } });
  }

  if (wantsMarkdown(accept)) {
    return new Response(mdNotFound(p), { status: 404, headers: { 'content-type': 'text/markdown; charset=utf-8', vary: 'Accept' } });
  }
  if (accept.includes('application/json') && !accept.includes('text/html')) {
    return new Response(
      JSON.stringify({ error: { code: 'not_found', status: 404, message: `No page at ${p}.`, hint: 'See /llms.txt or /sitemap.xml for valid URLs.' } }),
      { status: 404, headers: { 'content-type': 'application/json; charset=utf-8', vary: 'Accept' } },
    );
  }
  return next({ headers: { vary: 'Accept' } });
}
