// Renders a page model into HTML and Markdown.
import { marked } from 'marked';
import { BUILD, BUILDS, BUILT_AT, ICONS, slug, utc } from './data.mjs';
import { GUIDE_NAV, TIPS_NAV } from '../pages/guides.mjs';

export const SITE = process.env.SITE_URL || 'https://www.tibodog.wiki';
export const SITE_NAME = 'tibodog.wiki';

marked.setOptions({ gfm: true });

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Sidebar navigation, grouped so readers can scan it by topic.
export const NAV = [
  ['Start here', [
    ['Main page', '/'],
    ['All pages', '/all-pages'],
    ['Getting started', '/getting-started'],
    ['Strategy', '/strategy'],
    ['Controls', '/controls'],
  ]],
  ['Gear', [
    ['Weapons', '/weapons'],
    ['Evolutions', '/evolutions'],
    ['Passives', '/passives'],
    ['Items', '/items'],
    ['Dogs', '/dogs'],
  ]],
  ['Enemies', [
    ['Enemies', '/enemies'],
    ['Bosses', '/bosses'],
    ['Enemy scaling', '/enemy-scaling'],
  ]],
  ['World', [
    ['Biomes', '/biomes'],
    ['Events', '/events'],
    ['Points of interest', '/points-of-interest'],
    ['Modes', '/modes'],
    ['Story mode', '/story-mode'],
    ['Grok Bots', '/grok-bots'],
    ['Visitors', '/visitors'],
  ]],
  ['Mechanics', [
    ['Stats', '/stats'],
    ['Level-up', '/level-up'],
    ['Chests', '/chests'],
    ['Curse', '/curse'],
    ['Unlocks', '/unlocks'],
    ['Mechanics reference', '/mechanics-reference'],
    ['History', '/history'],
  ]],
];

function iconImg(spec, size) {
  const [cat, id] = spec.split('/');
  const m = ICONS[cat]?.[id];
  if (!m) return '';
  const h = size ?? 24;
  const w = Math.round((m.w / m.h) * h);
  return `<img class="ico" src="/icons/${cat}/${id}.png" width="${w}" height="${h}" alt="" loading="lazy" decoding="async">`;
}

const stripIcons = (s) => s.replace(/\{\{icon:[^}]+\}\}/g, '');

function postHtml(html) {
  const used = new Map();
  return html
    .replace(/\{\{icon:([^}]+)\}\}/g, (_, spec) => iconImg(spec))
    // Key/value tables are written with blank headers; drop that empty header row.
    .replace(/<thead>\s*<tr>(?:\s*<th(?: [^>]*)?><\/th>)+\s*<\/tr>\s*<\/thead>\s*/g, '')
    // Short inline code (file names, field names) should never wrap mid-token.
    .replace(/<code>([^<\s]{1,40})<\/code>/g, '<code class="nw">$1</code>')
    // Long unbroken values may wrap anywhere (length counted after decoding entities).
    // Long unbroken values may wrap between characters (length counted after decoding entities).
    .replace(/<code>([^<\s]+)<\/code>/g, (m, c) => (c.replace(/&[a-z#0-9]+;/g, '_').length > 60 ? `<code class="long">${c}</code>` : m))
    .replace(/<table>/g, '<div class="table-wrap"><table class="wikitable">')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<h([23])>(.*?)<\/h\1>/g, (_, n, inner) => {
      let id = slug(inner.replace(/<[^>]+>/g, '')) || 'section';
      const k = used.get(id) ?? 0;
      used.set(id, k + 1);
      if (k) id = `${id}-${k + 1}`;
      return `<h${n} id="${id}"><a class="anchor" href="#${id}" aria-label="Link to this section">#</a>${inner}</h${n}>`;
    })
    .replace(/<a href="(https?:\/\/(?!(?:www\.)?tibodog\.wiki[/"])[^"]+)"/g, '<a href="$1" rel="noopener" class="ext"');
}

function toc(html) {
  const hs = [...html.matchAll(/<h([23]) id="([^"]+)"><a class="anchor"[^>]*>#<\/a>(.*?)<\/h\1>/g)];
  if (hs.filter((h) => h[1] === '2').length < 3) return '';
  let out = '', open2 = false, open3 = false;
  for (const [, lvl, id, inner] of hs) {
    const li = `<a href="#${id}">${inner.replace(/<small>[\s\S]*?<\/small>/g, '').replace(/<[^>]+>/g, '').trim()}</a>`;
    if (lvl === '2') {
      if (open3) { out += '</ol>'; open3 = false; }
      if (open2) out += '</li>';
      out += `<li>${li}`;
      open2 = true;
    } else {
      if (!open3) { out += '<ol>'; open3 = true; }
      out += `<li>${li}</li>`;
    }
  }
  if (open3) out += '</ol>';
  if (open2) out += '</li>';
  // A disclosure, so narrow screens can start with it folded (site.js); open without JavaScript.
  // Long contents lists (a guide's 93 weapons) start folded so the first entry is on screen.
  return `<nav class="toc" aria-labelledby="toc-h"><details class="toc-in"${hs.length > 20 ? '' : ' open'}><summary><h2 id="toc-h">On this page</h2></summary><ol>${out}</ol></details></nav>`;
}

function infoboxHtml(ib) {
  if (!ib) return '';
  const img = ib.icon ? `<div class="ib-img">${iconImg(ib.icon, ib.iconSize ?? 64)}</div>` : '';
  const rows = ib.rows
    .filter((r) => r[1] !== undefined && r[1] !== '')
    .map(
      ([k, v]) =>
        `<tr><th scope="row">${esc(k)}</th><td>${postHtml(marked.parseInline(String(v)))}</td></tr>`,
    )
    .join('');
  return `<aside class="infobox" aria-label="${esc(ib.title)} summary"><div class="ib-title">${esc(ib.title)}</div>${img}${ib.caption ? `<div class="ib-cap">${esc(ib.caption)}</div>` : ''}<table>${rows}</table></aside>`;
}

function infoboxMd(ib) {
  if (!ib) return '';
  const rows = ib.rows.filter((r) => r[1] !== undefined && r[1] !== '');
  return `| ${ib.title} | |\n|---|---|\n${rows.map(([k, v]) => `| ${k} | ${String(v).replace(/\|/g, '\\|')} |`).join('\n')}\n\n`;
}

// data-local="ago" asks site.js for a relative time ("2 h ago"); otherwise it shows local time.
const timeTag = (iso, mode = '') => `<time datetime="${iso}" data-local="${mode}">${utc(iso)}</time>`;
const pending = BUILDS.filter((b) => b.status !== 'reviewed').length;

// Sidebar card: when this copy of the wiki was deployed, which game version it documents, and
// a button that asks /api/live-build whether tibo.dog still serves that version.
function versionCard() {
  return `<section class="status" aria-label="Wiki version">
  <p class="st-row"><span class="st-k">Game version</span> <a href="/versions">${BUILD.version ?? '?'}</a> <code title="Game commit ${BUILD.commit ?? 'unknown'}, entry file ${BUILD.main}">${(BUILD.commit ?? BUILD.main).slice(0, 7)}</code></p>
  <p class="st-row"><span class="st-k">Wiki updated</span> ${timeTag(BUILT_AT, 'ago')}</p>
  ${BUILD.updated ? `<p class="st-row"><span class="st-k">Data synced</span> ${timeTag(BUILD.updated, 'ago')}</p>` : ''}
  ${pending ? `<p class="st-row"><a class="st-warn" href="/versions">${pending} newer build${pending === 1 ? '' : 's'} not reviewed yet</a></p>` : ''}
  <button type="button" id="live-check" hidden>Check for updates</button>
  <p id="live-result" aria-live="polite"></p>
</section>`;
}

function sourcesMd(p) {
  const src = p.sources ?? [];
  const lines = [
    `Game version ${BUILD.version ?? '?'}: \`${BUILD.main}\` / \`${BUILD.boot}\` / \`${BUILD.sim}\` from ${BUILD.site}, researched ${BUILD.researched}. See [Versions & updates](/versions).`,
    ...src.map((s) => `- ${s}`),
  ];
  return lines.join('\n');
}

// Inline code citations ("[sim-X.js: `quote`]") become numbered footnotes listed under Sources.
const CITE = /\s*(?:<small>)?\[([\w.-]+\.(?:js|json|png)): ((?:<code[^>]*>[\s\S]*?<\/code>|[^\]<])*)\](?:<\/small>)?/g;
function footnotes(html) {
  const refs = new Map();
  const out = html.replace(CITE, (_, file, quote) => {
    const key = `${file}\n${quote}`;
    if (!refs.has(key)) refs.set(key, { n: refs.size + 1, file, quote });
    const { n } = refs.get(key);
    return `<sup class="fn"><a href="#ref-${n}" aria-label="Source ${n}" title="${file}">[${n}]</a></sup>`;
  });
  const list = [...refs.values()]
    .map(({ n, file, quote }) => `<li id="ref-${n}"><span class="ref-file">${file}</span> ${quote.trim()}</li>`)
    .join('');
  return { html: out, refs: list ? `<h3 class="refs-h">Code references</h3><ol class="refs">${list}</ol>` : '' };
}

export function renderHtml(p, allPages) {
  const { html: rawBody, refs: refsHtml } = footnotes(postHtml(marked.parse(p.body)));
  // The raw JSON record under "Data" is reference material: collapsed until asked for.
  const bodyHtml = rawBody.replace(/(<h2 id="data">[\s\S]*?<\/h2>\s*)(<pre>[\s\S]*?<\/pre>)/, '$1<details class="raw"><summary>Show raw game data</summary>$2</details>');
  const tocHtml = p.toc === false ? '' : toc(bodyHtml);
  const tab = p.tab ?? 'wiki';
  const crumbs = p.crumbs ?? [];
  const crumbHtml = crumbs.length
    ? `<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Main page</a></li>${crumbs.map(([n, u]) => `<li><a href="${u}">${esc(n)}</a></li>`).join('')}<li aria-current="page">${esc(p.title)}</li></ol></nav>`
    : '';
  const navLinks = (list) =>
    list
      .map(([n, u]) => `<li><a href="${u}"${u === p.path ? ' aria-current="page"' : u === crumbs[0]?.[1] ? ' aria-current="true"' : ''}>${esc(n)}</a></li>`)
      .join('');
  // Previous / next page within the same section (e.g. weapon to weapon), in list order.
  const sibs = crumbs.length ? allPages.filter((q) => q.crumbs?.[0]?.[1] === crumbs[0][1] && q.crumbs.length === crumbs.length) : [];
  const at = sibs.indexOf(p);
  const pagerLink = (q, cls, label) =>
    q ? `<a class="${cls}" href="${q.path}"><small>${label}</small><span>${esc(q.title)}</span></a>` : '<span></span>';
  const pagerHtml = at >= 0 && sibs.length > 1
    ? `<nav class="pager" aria-label="More ${esc(crumbs[0][0])}">${pagerLink(sibs[at - 1], 'prev', '← Previous')}${pagerLink(sibs[at + 1], 'next', 'Next →')}</nav>`
    : '';
  const navGroups = ({ wiki: NAV, guides: GUIDE_NAV, tips: TIPS_NAV })[tab].map(
    // Each group folds open/closed; all start open so the page works without JavaScript.
    ([h, list]) => `<details class="nav-group" data-group="${esc(h)}" open><summary class="side-h">${esc(h)}</summary><ul>${navLinks(list)}</ul></details>`,
  ).join('\n    ');
  const mdPath = p.path === '/' ? '/index.md' : `${p.path}.md`;
  const canonical = SITE + (p.path === '/' ? '/' : p.path);
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': p.path === '/' ? 'WebSite' : 'WebPage',
        '@id': canonical + '#page',
        url: canonical,
        name: p.path === '/' ? SITE_NAME : `${p.title} – ${SITE_NAME}`,
        description: p.description,
        inLanguage: 'en',
        dateModified: BUILT_AT,
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE + '/' },
        keywords: 'tibo.dog wiki, tibo.dog weapons, tibo.dog evolutions, tibo.dog items, tibo.dog bosses, tibo.dog guide',
        image: SITE + '/og.png',
        about: { '@type': 'VideoGame', name: 'tibo.dog', url: 'https://tibo.dog/' },
        ...(p.path === '/'
          ? {
              publisher: {
                '@type': 'Person',
                name: 'Adam Krupa',
                url: 'https://pcstyle.dev',
                jobTitle: 'Software developer',
                description: 'Maintainer of tibodog.wiki, the unofficial tibo.dog fan wiki.',
                sameAs: ['https://github.com/pc-style'],
              },
            }
          : {}),
      },
      ...(crumbs.length
        ? [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [['Main page', '/'], ...crumbs, [p.title, p.path]].map(([n, u], i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: n,
                item: SITE + u,
              })),
            },
          ]
        : []),
    ],
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.path === '/' ? `${SITE_NAME}: the unofficial tibo.dog wiki` : `${p.title} – ${SITE_NAME}`)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" type="text/markdown" href="${mdPath}" title="Markdown version">
<link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="${SITE_NAME}">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 64x64">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/cinzel-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/marcellus-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/style.css">
<meta property="og:title" content="${esc(p.path === '/' ? `${SITE_NAME}: the unofficial tibo.dog wiki` : `${p.title} – ${SITE_NAME}`)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="tibodog.wiki logo, an open book with a paw print, with pixel sprites of tibo.dog weapons, dogs, a pest and the Harvester boss">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b0e1c">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
<script src="/site.js" defer></script>
</head>
<body>
<a class="skip" href="#content">Skip to content</a>
<header class="top">
  <a class="brand" href="/" aria-label="tibodog.wiki, unofficial fan wiki, main page"><img src="/logo.svg" width="32" height="32" alt=""><span class="brand-txt"><span>tibodog<b>.wiki</b></span><small>Unofficial fan wiki</small></span></a>
  <form class="search" role="search" action="/search" method="get">
    <label class="sr" for="q">Search the wiki</label>
    <svg class="search-ico" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.75" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m13 13 4.25 4.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    <input id="q" name="q" type="search" placeholder="Search weapons, items, bosses…" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="search-results">
    <kbd class="search-key" hidden aria-hidden="true">Ctrl K</kbd>
    <button class="sr" type="submit" tabindex="-1">Search</button>
    <ul id="search-results" class="sresults" role="listbox" aria-label="Suggestions" hidden></ul>
  </form>
  <a class="ver-chip${pending ? ' is-warn' : ''}" href="/versions" title="${pending ? `${pending} newer game build${pending === 1 ? '' : 's'} not reviewed yet` : 'Game version this wiki documents'}">Game v${BUILD.version ?? '?'}</a>
  <a class="play" href="https://tibo.dog/" rel="noopener">Play tibo.dog <span aria-hidden="true">↗</span></a>
  <button type="button" class="menu-btn" aria-controls="site-menu" aria-expanded="false" hidden><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg><span class="sr">Menu</span></button>
</header>
<nav class="tabs" aria-label="Site sections">${[['wiki', 'Wiki', '/'], ['guides', 'Guides', '/guides'], ['tips', 'Quick tips', '/quick-tips']].map(([k, n, u]) => `<a href="${u}"${k === tab ? ' aria-current="true"' : ''}>${n}</a>`).join('')}</nav>
<div class="layout">
<nav class="side" aria-label="${({ wiki: 'Wiki sections', guides: 'Guides', tips: 'Quick tips' })[tab]}">
  <details class="side-menu" id="site-menu" open>
    <summary>Menu</summary>
    <div class="menu-panel">
    <a class="play menu-play" href="https://tibo.dog/" rel="noopener">Play tibo.dog <span aria-hidden="true">↗</span></a>
    ${navGroups}
    ${versionCard()}
    </div>
  </details>
</nav>
<main id="content">
<p id="sort-status" class="sr" aria-live="polite"></p>
<article>
${crumbHtml}
<h1>${esc(p.title)}</h1>
${p.infobox ? '<div class="with-ib">' : ''}
${p.lead ? `<p class="lead">${postHtml(marked.parseInline(p.lead))}</p>` : ''}
${p.infobox ? `${infoboxHtml(p.infobox)}\n<div class="ib-body">\n${tocHtml}\n${bodyHtml}\n</div>\n</div>` : `${tocHtml}\n${bodyHtml}`}
${p.bare ? '' : `<section class="sources" aria-labelledby="src-h"><h2 id="src-h">Sources</h2>${postHtml(marked.parse(sourcesMd(p)))}${refsHtml}<p class="md-link"><a href="${mdPath}">View this page as Markdown</a></p></section>`}
${pagerHtml}
</article>
<footer class="foot">
<p><strong>tibodog.wiki</strong> is an unofficial fan wiki for <a href="https://tibo.dog/">tibo.dog</a>, the game by <a href="https://x.com/poteto">poteto</a>. Not affiliated with or endorsed by the developer. Game names, text and sprites belong to their owner and are shown for reference.</p>
<p>Updated ${timeTag(BUILT_AT)} from game version ${BUILD.version ?? '?'} (<code>${BUILD.main}</code>)</p>
<p class="foot-links"><a href="/versions">Versions &amp; updates</a><a href="/sources">Sources &amp; method</a><a href="/coverage">Coverage gaps</a><a href="/api">Data API</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/llms.txt">llms.txt</a><a href="/sitemap.xml">Sitemap</a></p>
</footer>
</main>
</div>
</body>
</html>
`;
}

export function renderMd(p) {
  const url = SITE + (p.path === '/' ? '/' : p.path);
  const parts = [
    `# ${p.title}`,
    '',
    `> ${p.description}`,
    '',
    `Source page: ${url} · Wiki updated ${utc(BUILT_AT)} · Game version ${BUILD.version ?? '?'} (\`${BUILD.main}\`${BUILD.updated ? `, data synced ${utc(BUILD.updated)}` : ''})${p.status ? ` · ${p.status}` : ''}`,
    '',
  ];
  if (p.crumbs?.length) parts.push(`Breadcrumb: ${['[Main page](/)', ...p.crumbs.map(([n, u]) => `[${n}](${u})`)].join(' › ')}`, '');
  if (p.infobox) parts.push(infoboxMd(p.infobox));
  if (p.lead) parts.push(p.lead, '');
  parts.push(p.body.trim(), '', '## Sources', '', sourcesMd(p), '');
  return stripIcons(parts.join('\n'))
    .replace(/<\/?small[^>]*>/g, '')
    .replace(/<a href="([^"]+)"><strong>([^<]+)<\/strong><span>([^<]+)<\/span><\/a>/g, '- [$2]($1): $3')
    .replace(/<\/?div[^>]*>\n?/g, '')
    // Folded guide sections read as plain headings and lists in Markdown.
    .replace(/<details class="topic"><summary><h2[^>]*>(.*?)<\/h2>[\s\S]*?<\/summary>([\s\S]*?)<\/details>/g, '## $1$2')
    .replace(/<details class="more"><summary>[\s\S]*?<\/summary>([\s\S]*?)<\/details>/g, '$1')
    .replace(/<h2 id="search-heading">Search<\/h2>\n<ol id="search-page-results"><\/ol>\n<noscript>[\s\S]*?<\/noscript>\n/g, 'Search needs a browser with JavaScript. Every page is listed on [All pages](/all-pages).\n')
    .replace(/\n{3,}/g, '\n\n');
}
