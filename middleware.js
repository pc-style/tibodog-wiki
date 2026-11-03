// Markdown content negotiation, Markdown/JSON 404 bodies and Vary headers for the static wiki.
import { next, rewrite } from '@vercel/functions';
import PATHS, { API as API_PATHS } from './paths.js';

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

export default function middleware(request) {
  const url = new URL(request.url);
  const p = url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : '/';
  const accept = request.headers.get('accept') ?? '';

  if (p.startsWith('/api/')) {
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
