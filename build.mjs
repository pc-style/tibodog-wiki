// Builds the static wiki into dist/: HTML pages, Markdown twins, sitemap, llms.txt, search index and data API.
import { mkdirSync, writeFileSync, rmSync, cpSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { renderHtml, renderMd, SITE, SITE_NAME, NAV, NAV2 } from './lib/render.mjs';
import { R, BUILD, BUILDS, BUILT_AT, WIKI_COMMIT, GAME, DIFF, TEXT } from './lib/data.mjs';
import * as ent from './pages/entities.mjs';
import { systemPages } from './pages/system.mjs';
import { MECH } from './pages/mechanics.mjs';

const OUT = new URL('./dist/', import.meta.url).pathname;
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(new URL('./public/', import.meta.url).pathname, OUT, { recursive: true });

const write = (rel, content) => {
  const f = join(OUT, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, content);
};

const pages = [
  ent.weaponIndex(), ...ent.weaponPages(), ent.evolutionPage(),
  ent.passiveIndex(), ...ent.passivePages(),
  ent.itemIndex(), ...ent.itemPages(),
  ent.dogIndex(), ...ent.dogPages(),
  ent.enemyIndex(), ...ent.enemyPages(),
  ent.bossIndex(), ...ent.bossPages(),
  ent.biomeIndex(), ...ent.biomePages(),
  ent.eventIndex(), ...ent.eventPages(),
];
pages.find((p) => p.path === '/bosses').body += '\n' + MECH.bossSchedule();
pages.push(...systemPages(pages));

// Sanity checks: unique paths, every internal link resolves.
const paths = new Set();
for (const p of pages) {
  if (paths.has(p.path)) throw new Error(`Duplicate path ${p.path}`);
  paths.add(p.path);
}
const STATIC = new Set(['/llms.txt', '/llms-full.txt', '/sitemap.xml', '/search', '/api/index.json', '/openapi.json', '/index.md']);
const broken = [];
for (const p of pages) {
  const text = `${p.body} ${p.lead ?? ''} ${(p.infobox?.rows ?? []).map((r) => r[1]).join(' ')}`;
  for (const m of text.matchAll(/\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g)) {
    const target = m[1].replace(/\.md$/, '') || '/';
    if (!paths.has(target) && !STATIC.has(m[1]) && !m[1].startsWith('/api/') && !m[1].startsWith('/icons/')) broken.push(`${p.path} -> ${m[1]}`);
  }
}
if (broken.length) {
  console.error(`Broken links:\n${[...new Set(broken)].join('\n')}`);
  process.exit(1);
}

for (const p of pages) {
  const base = p.path === '/' ? '/index' : p.path;
  write(`${base}.html`, renderHtml(p, pages));
  write(`${base}.md`, renderMd(p));
}

// Search index.
const index = pages
  .filter((p) => p.path !== '/search')
  .map((p) => ({ t: p.title, u: p.path, d: p.description.slice(0, 160), k: p.search ?? '', s: p.crumbs?.[0]?.[0] ?? 'Guide', i: p.infobox?.icon ?? '' }));
write('search-index.json', JSON.stringify(index));

// Sitemap.
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${SITE}${p.path === '/' ? '/' : p.path}</loc><lastmod>${BUILD.researched}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

// llms.txt and llms-full.txt.
const groups = {};
for (const p of pages) (groups[p.crumbs?.[0]?.[0] ?? 'Guides'] ??= []).push(p);
const order = ['Guides', 'Weapons', 'Passives', 'Items', 'Dogs', 'Enemies', 'Bosses', 'Biomes', 'Events'];
const llms = [
  `# ${SITE_NAME}`,
  '',
  `> Unofficial, source-cited wiki for tibo.dog, the free browser survivors-like by poteto (https://tibo.dog/). Covers every weapon, evolution, passive, item, dog, enemy, boss, biome, event, point of interest, mode, stat formula and control, with numbers extracted from the deployed game build (${BUILD.boot}, researched ${BUILD.researched}).`,
  '',
  '## When to use this',
  '',
  '- Use it to answer questions about tibo.dog gameplay: what a weapon, passive, item or dog does, evolution and union recipes, boss attacks, enemy stats, biome hazards, difficulty multipliers, controls and unlocks.',
  '- Prefer the Markdown version of any page: append `.md` to its URL (for example /weapons/peeler.md), or send `Accept: text/markdown`. The home page is /index.md.',
  '- For structured data, use the JSON API at /api/index.json (documented at /api and /openapi.json). It is read-only and needs no key.',
  '- Every page separates verified values from the game code from inference, and lists its sources. Do not use it for other games or for official support; it is not affiliated with the developer.',
  '',
  ...order.filter((g) => groups[g]).flatMap((g) => [
    `## ${g}`,
    '',
    ...groups[g].map((p) => `- [${p.title}](${SITE}${p.path === '/' ? '/index' : p.path}.md): ${p.description.replace(/\s+/g, ' ').slice(0, 180)}`),
    '',
  ]),
  '## Optional',
  '',
  `- [Full wiki text](${SITE}/llms-full.txt): every page's Markdown in one file`,
  `- [Data API](${SITE}/api.md): JSON endpoints for the raw game data`,
  `- [Sitemap](${SITE}/sitemap.xml)`,
  '',
].join('\n');
write('llms.txt', llms);
write('llms-full.txt', pages.map((p) => renderMd(p)).join('\n\n---\n\n'));

// Data API (static JSON).
const api = {
  'weapons.json': R.allWeapons,
  'passives.json': R.passives,
  'items.json': R.allItems,
  'enemies.json': R.enemies,
  'bosses.json': R.bossOrder,
  'biomes.json': R.biomes,
  'events.json': R.events,
  'dogs.json': R.dogs,
  'pois.json': R.pois,
  'grok-bots.json': R.botHelps,
  'recipes.json': { evolutions: R.evolutions.map(({ id, from, catalyst }) => ({ id, from, catalyst })), unions: R.unions.map(({ id, from }) => ({ id, from })), itemEvolutions: R.evolvedItems.map(({ id, from, catalyst }) => ({ id, from, catalyst })) },
  'config.json': GAME,
  'difficulty.json': DIFF,
  'text.json': TEXT,
};
const meta = { apiVersion: 'v1', build: BUILD, wiki: { updated: BUILT_AT, commit: WIKI_COMMIT, versions: `${SITE}/versions`, liveCheck: `${SITE}/api/live-build` }, source: 'https://tibo.dog/', license: 'Game data belongs to its owner; provided for reference by an unofficial fan wiki.' };
const apiPaths = [];
for (const [f, data] of Object.entries(api)) {
  const body = JSON.stringify({ meta, data }, null, 1);
  write(`api/v1/${f}`, body);
  write(`api/${f}`, body);
  apiPaths.push(`/api/v1/${f}`, `/api/${f}`);
}
const indexBody = JSON.stringify({ meta, versioning: 'Path-versioned. /api/v1/* is stable; /api/* is an alias of the latest version. Breaking changes ship as /api/v2/ and v1 stays available for at least 90 days with a Deprecation header.', endpoints: [...Object.keys(api).map((f) => ({ path: `/api/v1/${f}`, description: `tibo.dog ${f.replace('.json', '')} data` })), { path: '/api/v1/live-build', description: 'Live check: loads tibo.dog now and says whether it still serves the build this wiki documents' }], docs: `${SITE}/api`, openapi: `${SITE}/openapi.json` }, null, 1);
write('api/v1/index.json', indexBody);
write('api/index.json', indexBody);
apiPaths.push('/api/v1/index.json', '/api/index.json');
write('openapi.json', JSON.stringify(openapi(Object.keys(api)), null, 1));

// OpenSearch.
write(
  'opensearch.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">\n<ShortName>${SITE_NAME}</ShortName>\n<Description>Search the unofficial tibo.dog wiki</Description>\n<Url type="text/html" template="${SITE}/search?q={searchTerms}"/>\n</OpenSearchDescription>\n`,
);

// Paths manifest for the middleware (Markdown negotiation and 404s).
// The middleware's live build check needs the documented build and the known versions.
const known = BUILDS.map(({ version, main, commit, status }) => ({ version, main, commit, status }));
const documented = { version: BUILD.version, main: BUILD.main, commit: BUILD.commit, synced: BUILD.updated ?? BUILD.researched };
writeFileSync(new URL('./paths.js', import.meta.url), `// Generated by build.mjs. Page paths and build info for middleware.js.\nexport default ${JSON.stringify(pages.map((p) => p.path))};\nexport const API = ${JSON.stringify(apiPaths)};\nexport const DOCUMENTED = ${JSON.stringify(documented)};\nexport const KNOWN = ${JSON.stringify(known)};\n`);

// 404 pages.
const nf = {
  path: '/404',
  title: 'Page not found',
  description: 'This page does not exist on the tibo.dog Wiki.',
  body: `The page you asked for does not exist.\n\n- [Main page](/)\n- [All pages](/all-pages)\n- [Search](/search)\n- Machine-readable index: [/llms.txt](/llms.txt)\n`,
};
write('404.html', renderHtml(nf, pages));
write('404.md', renderMd(nf));

console.log(`Built ${pages.length} pages (${pages.length * 2} HTML+MD files) into dist/`);

function openapi(files) {
  const obj = (description, properties, required = []) => ({ type: 'object', description, properties, required, additionalProperties: true });
  const str = (d) => ({ type: 'string', description: d });
  const num = (d) => ({ type: 'number', description: d });
  const anyObj = (d) => ({ type: 'object', description: d, additionalProperties: true });
  const S = {
    'weapons.json': obj('A weapon definition', { id: str('Weapon id, e.g. peeler'), tier: { type: 'string', enum: ['base', 'evolved', 'union'], description: 'Weapon tier' }, on: str('Trigger; "dash" for dash weapons'), base: anyObj('Raw level-1 stats: damage, cooldown, amount, area, speed, duration, pierce, knockback, interval'), levels: { type: 'array', description: 'Per-level stat deltas for levels 2..8', items: anyObj('Stat deltas') }, weight: num('Offer weight'), behavior: anyObj('Attack behaviour parameters; kind names the attack type'), from: { description: 'Source weapon id(s) for evolutions and unions', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] }, catalyst: str('Catalyst passive or item id') }, ['id', 'tier', 'base', 'behavior']),
    'passives.json': obj('A passive definition', { id: str('Passive id'), stat: str('Stat key raised'), perLevel: { description: 'Increase per level, or cumulative values by level', oneOf: [{ type: 'number' }, { type: 'array', items: { type: 'number' } }] }, maxLevel: num('Maximum level'), weight: num('Offer weight') }, ['id', 'stat', 'perLevel', 'maxLevel']),
    'items.json': obj('An item definition', { id: str('Item id'), tier: str('base or evolved'), rarity: { type: 'integer', minimum: 0, maximum: 4, description: '0 Common .. 4 Legendary' }, mods: anyObj('Stat changes'), effect: anyObj('Triggered effect; kind is onHit, onKill or onHurt'), maxStacks: num('Stack limit'), from: str('Source item for evolved items'), catalyst: str('Catalyst passive for evolved items') }, ['id', 'tier', 'rarity', 'mods']),
    'enemies.json': obj('An enemy definition', { id: str('Enemy id'), behavior: anyObj('Movement/attack behaviour'), hp: num('Base HP'), speed: num('Speed'), damage: num('Contact damage'), radius: num('Body radius'), xp: num('XP value'), goldChance: num('Chance to drop gold'), mass: num('Mass') }, ['id', 'hp', 'damage']),
    'bosses.json': obj('A boss definition, in boss order', { id: str('Boss id'), hp: num('Base HP'), speed: num('Speed'), damage: num('Contact damage'), attack: anyObj('Main attack'), attackEvery: num('Seconds between main attacks'), telegraph: num('Telegraph seconds'), patternEvery: num('Seconds between bullet patterns'), patterns: { type: 'array', items: anyObj('Bullet pattern'), description: 'Bullet patterns' }, xp: num('XP value') }, ['id', 'hp', 'attack', 'patterns']),
    'biomes.json': obj('A biome definition', { id: str('Biome id'), placement: anyObj('Climate or landmark placement'), enemies: { type: 'array', description: 'Five enemy tiers', items: { type: 'array', items: { type: 'string' } } }, hazard: { description: 'Ground hazard or null', oneOf: [anyObj('Hazard'), { type: 'null' }] }, goldMult: num('Gold multiplier'), xpMult: num('XP multiplier'), poiWeights: anyObj('Point-of-interest weights') }, ['id', 'placement', 'enemies']),
    'events.json': obj('A world event', { id: str('Event id'), effect: anyObj('Event effect; kind is wall, swarm, lootRunner or goldRush') }, ['id', 'effect']),
    'dogs.json': obj('A dog definition', { id: str('Dog id'), ability: anyObj('Ability parameters'), aura: anyObj('Aura stat bonuses'), levelUps: { type: 'array', items: anyObj('Training multipliers'), description: 'Training level multipliers' }, weight: num('Spawn weight'), legendary: { type: 'boolean', description: 'Legendary dog' } }, ['id', 'ability', 'aura']),
    'pois.json': obj('A point-of-interest kind', { kind: str('POI kind'), radius: num('Radius') }, ['kind']),
    'grok-bots.json': obj('A Grok Bot helper', { id: str('Bot id'), help: anyObj('Help effect'), weight: num('Spawn weight') }, ['id', 'help']),
  };
  const errorResponses = {
    '4XX': { description: 'Client error, e.g. unknown endpoint (404)', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    '5XX': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
  };
  const envelope = (f) => {
    const item = S[f];
    const data = item
      ? { type: 'array', description: `Array of ${f.replace('.json', '')}`, items: item }
      : f === 'recipes.json'
        ? obj('Recipe tables', { evolutions: { type: 'array', items: obj('Evolution', { id: str('Result weapon'), from: str('Base weapon'), catalyst: str('Catalyst') }, ['id', 'from', 'catalyst']) }, unions: { type: 'array', items: obj('Union', { id: str('Result weapon'), from: { type: 'array', items: { type: 'string' } } }, ['id', 'from']) }, itemEvolutions: { type: 'array', items: obj('Item evolution', { id: str('Result item'), from: str('Base item'), catalyst: str('Catalyst passive') }, ['id', 'from', 'catalyst']) } }, ['evolutions', 'unions', 'itemEvolutions'])
        : anyObj(`${f.replace('.json', '')} object`);
    return { type: 'object', description: 'Response envelope', properties: { meta: { $ref: '#/components/schemas/Meta' }, data }, required: ['meta', 'data'] };
  };
  return {
    openapi: '3.1.0',
    info: {
      title: `${SITE_NAME} data API`,
      version: '1.0.0',
      description: `Read-only JSON of tibo.dog game data extracted from build ${BUILD.boot} (researched ${BUILD.researched}). Static files, no authentication. Versioning: paths are prefixed /api/v1/; breaking changes ship under a new prefix and v1 stays available for at least 90 days with a Deprecation header. Errors are JSON objects with error.code, error.message and error.hint.`,
      contact: { name: 'tibo.dog Wiki', url: `${SITE}/contact`, email: 'me@pcstyle.dev' },
    },
    servers: [{ url: SITE }],
    paths: Object.fromEntries([
      ['/api/v1/index.json', { get: { operationId: 'listEndpoints', summary: 'List all data endpoints', description: 'Returns build metadata, the versioning policy and the list of JSON endpoints.', responses: { 200: { description: 'Endpoint list', content: { 'application/json': { schema: obj('Endpoint index', { meta: { $ref: '#/components/schemas/Meta' }, versioning: str('Versioning policy'), endpoints: { type: 'array', items: obj('Endpoint', { path: str('Path'), description: str('What it returns') }, ['path']) }, docs: str('Docs URL'), openapi: str('OpenAPI URL') }, ['meta', 'endpoints']) } } }, ...errorResponses } } }],
      ['/api/v1/live-build', { get: { operationId: 'checkLiveBuild', summary: 'Compare the live game with the wiki', description: 'Loads https://tibo.dog/ at request time, reads the entry script name it serves and compares it with the build this wiki documents. Not cached.', responses: { 200: { description: 'Comparison', content: { 'application/json': { schema: obj('Live build check', { status: { type: 'string', enum: ['up-to-date', 'game-updated', 'wiki-ahead'], description: 'up-to-date: the live game serves the documented build. game-updated: tibo.dog serves a build the wiki has not documented. wiki-ahead: tibo.dog serves an older build the wiki already moved past.' }, message: str('Plain-English result'), checkedAt: str('ISO time of the check'), live: anyObj('Build served by tibo.dog: main, version (if known)'), documented: anyObj('Build this wiki documents: version, main, commit, synced') }, ['status', 'live', 'documented', 'checkedAt']) } } }, 502: { description: 'tibo.dog could not be reached or parsed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } } } } }],
      ...files.map((f) => {
        const n = f.replace('.json', '');
        const op = 'get' + n.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
        return [`/api/v1/${f}`, { get: { operationId: op, summary: `Get ${n} data`, description: `Returns the raw tibo.dog ${n} definitions wrapped as {meta, data}. Values are the game's internal numbers.`, responses: { 200: { description: `${n} data`, content: { 'application/json': { schema: envelope(f) } } }, ...errorResponses } } }];
      }),
    ]),
    components: {
      schemas: {
        Meta: obj('Build and source metadata', { apiVersion: str('API version, v1'), build: anyObj('Game build file names and research date'), source: str('Game URL'), license: str('Usage note') }, ['apiVersion', 'build', 'source']),
        Error: obj('Error response', { error: obj('Error details', { code: str('Machine-readable error code, e.g. not_found'), message: str('Human-readable message'), hint: str('How to resolve the error'), status: { type: 'integer', description: 'HTTP status' } }, ['code', 'message']) }, ['error']),
      },
    },
  };
}
