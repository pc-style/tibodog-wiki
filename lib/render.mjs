// Renders a page model into HTML and Markdown.
import { marked } from 'marked';
import { BUILD, ICONS, slug } from './data.mjs';

export const SITE = process.env.SITE_URL || 'https://tibodog-wiki.vercel.app';
export const SITE_NAME = 'tibo.dog Wiki';

marked.setOptions({ gfm: true });

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const NAV = [
  ['Main page', '/'],
  ['Getting started', '/getting-started'],
  ['Weapons', '/weapons'],
  ['Evolutions', '/evolutions'],
  ['Passives', '/passives'],
  ['Items', '/items'],
  ['Dogs', '/dogs'],
  ['Enemies', '/enemies'],
  ['Bosses', '/bosses'],
  ['Biomes', '/biomes'],
  ['Events', '/events'],
  ['Points of interest', '/points-of-interest'],
  ['Modes', '/modes'],
  ['Stats', '/stats'],
  ['Level-up', '/level-up'],
  ['Chests', '/chests'],
  ['Curse', '/curse'],
  ['Enemy scaling', '/enemy-scaling'],
  ['Unlocks', '/unlocks'],
  ['Controls', '/controls'],
  ['Strategy', '/strategy'],
  ['Story mode', '/story-mode'],
  ['Grok Bots', '/grok-bots'],
  ['Visitors', '/visitors'],
  ['History', '/history'],
];
export const NAV2 = [
  ['All pages', '/all-pages'],
  ['Sources & method', '/sources'],
  ['Mechanics reference', '/mechanics-reference'],
  ['Coverage gaps', '/coverage'],
  ['Data API', '/api'],
  ['About', '/about'],
  ['Contact', '/contact'],
  ['Privacy', '/privacy'],
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
    .replace(/<table>/g, '<div class="table-wrap"><table class="wikitable">')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<h([23])>(.*?)<\/h\1>/g, (_, n, inner) => {
      let id = slug(inner.replace(/<[^>]+>/g, '')) || 'section';
      const k = used.get(id) ?? 0;
      used.set(id, k + 1);
      if (k) id = `${id}-${k + 1}`;
      return `<h${n} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${n}>`;
    })
    .replace(/<a href="(https?:\/\/(?!tibodog-wiki)[^"]+)"/g, '<a href="$1" rel="noopener" class="ext"');
}

function toc(html) {
  const hs = [...html.matchAll(/<h([23]) id="([^"]+)"><a[^>]*>#<\/a>(.*?)<\/h\1>/g)];
  if (hs.filter((h) => h[1] === '2').length < 3) return '';
  let out = '', open2 = false, open3 = false;
  for (const [, lvl, id, inner] of hs) {
    const li = `<a href="#${id}">${inner.replace(/<[^>]+>/g, '')}</a>`;
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
  return `<nav class="toc" aria-labelledby="toc-h"><h2 id="toc-h">Contents</h2><ol>${out}</ol></nav>`;
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

function sourcesMd(p) {
  const src = p.sources ?? [];
  const lines = [
    `Game build: \`${BUILD.main}\` / \`${BUILD.boot}\` / \`${BUILD.sim}\` from ${BUILD.site}, researched ${BUILD.researched}.`,
    ...src.map((s) => `- ${s}`),
  ];
  return lines.join('\n');
}

export function renderHtml(p, allPages) {
  const bodyHtml = postHtml(marked.parse(p.body));
  const tocHtml = toc(bodyHtml);
  const crumbs = p.crumbs ?? [];
  const crumbHtml = crumbs.length
    ? `<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Main page</a></li>${crumbs.map(([n, u]) => `<li><a href="${u}">${esc(n)}</a></li>`).join('')}<li aria-current="page">${esc(p.title)}</li></ol></nav>`
    : '';
  const navLinks = (list) =>
    list
      .map(([n, u]) => `<li><a href="${u}"${u === p.path ? ' aria-current="page"' : ''}>${esc(n)}</a></li>`)
      .join('');
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
        dateModified: BUILD.researched,
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
                description: 'Maintainer of the unofficial tibo.dog Wiki.',
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
<title>${esc(p.path === '/' ? `${SITE_NAME}: unofficial guide to tibo.dog` : `${p.title} – ${SITE_NAME}`)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" type="text/markdown" href="${mdPath}" title="Markdown version">
<link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="${SITE_NAME}">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="stylesheet" href="/style.css">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="tibo.dog Wiki title with pixel sprites of weapons, a dog, a pest and the Harvester boss">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2b1d12">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
<script src="/site.js" defer></script>
</head>
<body>
<a class="skip" href="#content">Skip to content</a>
<header class="top">
  <a class="brand" href="/"><img src="/favicon.png" width="28" height="28" alt=""><span>tibo.dog <b>Wiki</b></span></a>
  <form class="search" role="search" action="/search" method="get">
    <label class="sr" for="q">Search the wiki</label>
    <input id="q" name="q" type="search" placeholder="Search weapons, items, bosses…" autocomplete="off" aria-controls="search-results">
    <button type="submit">Search</button>
    <ul id="search-results" class="sresults" role="listbox" hidden></ul>
  </form>
  <a class="play" href="https://tibo.dog/" rel="noopener">Play tibo.dog ↗</a>
</header>
<div class="layout">
<nav class="side" aria-label="Wiki sections">
  <details class="side-menu" open>
    <summary>Navigation</summary>
    <ul>${navLinks(NAV)}</ul>
    <h2 class="side-h">Wiki</h2>
    <ul>${navLinks(NAV2)}</ul>
  </details>
</nav>
<main id="content">
${crumbHtml}
<article>
<h1>${esc(p.title)}</h1>
<p class="meta">Game build researched ${BUILD.researched} · <a href="${mdPath}">Markdown</a>${p.status ? ` · ${esc(p.status)}` : ''}</p>
${infoboxHtml(p.infobox)}
${p.lead ? `<p class="lead">${postHtml(marked.parseInline(p.lead))}</p>` : ''}
${tocHtml}
${bodyHtml}
<section class="sources" aria-labelledby="src-h"><h2 id="src-h">Sources</h2>${postHtml(marked.parse(sourcesMd(p)))}</section>
</article>
</main>
</div>
<footer class="foot">
<p>Unofficial fan wiki for <a href="https://tibo.dog/">tibo.dog</a>, the game by <a href="https://x.com/poteto">poteto</a>. Not affiliated with or endorsed by the developer. Game names, text and sprites belong to their owner and are shown for reference.</p>
<p>Data from game build <code>${BUILD.boot}</code>, researched ${BUILD.researched}. <a href="/sources">How this wiki was researched</a> · <a href="/llms.txt">llms.txt</a> · <a href="/sitemap.xml">Sitemap</a> · <a href="/api">Data API</a></p>
</footer>
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
    `Source page: ${url} · Game build researched ${BUILD.researched}${p.status ? ` · ${p.status}` : ''}`,
    '',
  ];
  if (p.crumbs?.length) parts.push(`Breadcrumb: ${['[Main page](/)', ...p.crumbs.map(([n, u]) => `[${n}](${u})`)].join(' › ')}`, '');
  if (p.infobox) parts.push(infoboxMd(p.infobox));
  if (p.lead) parts.push(p.lead, '');
  parts.push(p.body.trim(), '', '## Sources', '', sourcesMd(p), '');
  return stripIcons(parts.join('\n'))
    .replace(/<\/?small>/g, '')
    .replace(/<a href="([^"]+)"><strong>([^<]+)<\/strong><span>([^<]+)<\/span><\/a>/g, '- [$2]($1): $3')
    .replace(/<\/?div[^>]*>\n?/g, '')
    .replace(/<h2 id="search-heading">Search<\/h2>\n<ol id="search-page-results"><\/ol>\n<noscript>[^<]*<\/noscript>\n/g, '')
    .replace(/\n{3,}/g, '\n\n');
}
