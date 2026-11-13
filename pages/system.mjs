// Guide, mechanics and meta pages.
import { R, GAME, STORY, FORMULA, DIFF, BUILD, BUILT_AT, utc, t, name, link, ilink, icon, fmt, pct, RARITY, slug, statLabel } from '../lib/data.mjs';
import { table, flatRows, json, SRC_REG, SRC_TEXT, BOSS_MIN } from './entities.mjs';
import { SITE } from '../lib/render.mjs';
import { MECH } from './mechanics.mjs';
import { readFileSync } from 'node:fs';

const SRC_CFG = 'Game config object exported by `intro-shared-B7v_WfRS.js` (`view`, `player`, `dash`, `difficulty`, `win`, `scaling`, … keys)';
const SRC_ABOUT = '[About tibo.dog](https://tibo.dog/about/) and [tibo.dog llms.txt](https://tibo.dog/llms.txt), read 2026-11-02';
const SRC_UI = 'Inline English UI strings in `boot-Bm3x3QN9.js`';

const guide = (p) => ({ crumbs: [], ...p });

export function systemPages(entityPages) {
  const pages = [];
  const add = (p) => pages.push(guide(p));

  // ---------- Main page ----------
  const card = (u, title, sub, ic) => `<a href="${u}">${ic ? icon(...ic.split('/')) : ''}<strong>${title}</strong><span>${sub}</span></a>`;
  add({
    path: '/',
    title: 'tibodog.wiki',
    // The header already shows the site name, so the page opens with what the wiki does for a player.
    eyebrow: 'The unofficial tibo.dog wiki',
    h1: 'Every weapon, boss and build in tibo.dog',
    // Four sections need no table of contents; the rail would only take width from the task cards.
    toc: false,
    // The band behind the title is a real frame of the game (public/home-scene*.webp), not drawn art.
    hero: 'Pictured: Tibo 7 s into Story mode, potato weapons firing (tibo.dog screenshot, 2026-11-06).',
    description: `Unofficial, source-cited wiki for tibo.dog: all ${R.allWeapons.length} weapons, ${R.evolutions.length} evolutions, ${R.passives.length} passives, ${R.allItems.length} items, ${R.dogs.length} dogs, ${R.enemies.length} enemies, ${R.bosses.length} bosses and ${R.biomes.length} biomes, with stats from the game build.`,
    // Short, so the task cards arrive in the first phone screen; how a run works is on Getting started.
    lead: `The unofficial fan wiki for [tibo.dog](https://tibo.dog/), a free survivors-like by [poteto](https://x.com/poteto) that plays in the browser and inside X posts. Stats come from the game's own code, and every page lists its sources.`,
    body: `## Start here\n\n<div class="cards tasks">\n${[
      card('/getting-started', 'New to the game?', 'How a run works, from the first dash to 20:00', 'dog/corgi'),
      card('/strategy', 'Plan a build', 'Weapons, evolutions and passives that work together', 'weapon/mashquake'),
      card('/guides/bosses', 'Beat the next boss', 'Every boss in arrival order, with the move that saves you', 'boss/harvester'),
    ].join('\n')}\n</div>\n\n## Browse\n\n<div class="cards">\n${[
      card('/weapons', 'Weapons', `${R.baseWeapons.length} base, ${R.evolutions.length} evolutions, ${R.unions.length} unions`, 'weapon/spud-cannon'),
      card('/evolutions', 'Evolutions', 'Every recipe and catalyst', 'weapon/mashquake'),
      card('/passives', 'Passives', `${R.passives.length} stat upgrades`, 'passive/butter-pat'),
      card('/items', 'Items', `${R.items.length} items, ${R.evolvedItems.length} evolved`, 'item/kaboom-spud'),
      card('/dogs', 'Dogs', `${R.dogs.length} dogs for Tibo's pack`, 'dog/corgi'),
      card('/enemies', 'Enemies', `${R.enemies.length} pests`, 'enemy/aphid'),
      card('/bosses', 'Bosses', `${Object.keys(BOSS_MIN).length} timed bosses, plus endgame forms`, 'boss/harvester'),
      card('/biomes', 'Biomes', `${R.biomes.length} biomes and hazards`, 'enemy/sand-crab'),
      card('/points-of-interest', 'Points of interest', `${R.pois.length} shrines, shops and machines`, 'item/coupon-book'),
      card('/modes', 'Modes', 'Story, Easy, Normal, Hard, Nightmare', 'item/cursed-crown'),
      card('/stats', 'Stats & formulas', 'How every stat is calculated', 'item/crit-chip'),
      card('/strategy', 'Strategy', 'Build advice, labelled by evidence', 'passive/four-eyed-spud'),
    ].join('\n')}\n</div>\n\n` +
      `## Quick facts\n\n` + table(['', ''], [
        ['Developer', '[poteto](https://x.com/poteto)'],
        ['Genre', 'Survivors-like, 2.5D pixel art'],
        ['Platform', 'Web browser and X posts (installable web app)'],
        ['Price', 'Free, no account'],
        ['Goal', `Survive ${GAME.win.timeSec / 60} minutes. No win screen: the run keeps going after 20:00 (\`win.mode\`: \`${GAME.win.mode}\`) and counts as survived`],
        ['Boss at 20:00', ilink('boss', GAME.win.finalBoss)],
        ['Weapon / passive slots', `${GAME.player.weaponSlots} / ${GAME.player.passiveSlots}`],
        ['Dog pack', `Up to ${GAME.dogs.maxPack}`],
        ['Languages', '27'],
        ['Game version documented', `[${BUILD.version}](/versions) (\`${BUILD.main}\`), wiki updated ${utc(BUILT_AT)}`],
      ]) +
      `\n## About this wiki\n\nEvery number on this wiki comes from the game's own deployed code and content tables, not from memory or guesswork. Pages separate **verified** values (read from the code) from **inference** (our interpretation). See [Sources & method](/sources) and the list of [coverage gaps](/coverage).\n\nFor agents: every page has a Markdown version at the same URL plus \`.md\` (this page: [/index.md](/index.md)), and requests with \`Accept: text/markdown\` get Markdown directly. See [/llms.txt](/llms.txt) and the [data API](/api).\n`,
    sources: [SRC_ABOUT, SRC_REG, SRC_CFG],
    search: 'home main page',
  });

  // ---------- Getting started ----------
  add({
    path: '/getting-started',
    title: 'Getting started',
    description: 'How a tibo.dog run works: movement, dashing, level-ups, chests, dogs and the 20-minute goal.',
    body: MECH.gettingStarted(),
    sources: [SRC_ABOUT, SRC_CFG, SRC_UI],
    search: 'beginner guide how to play basics',
  });

  // ---------- Points of interest ----------
  add({
    path: '/points-of-interest',
    title: 'Points of interest',
    description: `All ${R.pois.length} points of interest in tibo.dog: shrines, crates, shops, machines and dogs, with costs and activation times.`,
    body: MECH.pois(),
    sources: [SRC_REG, SRC_TEXT, SRC_CFG],
    search: 'poi shrine vendor microwave crate slots kennel tunnel lantern freezer',
  });

  for (const p of MECH.guides()) add(p);

  // ---------- Secrets (system pages miss build.mjs's prose pass, so read it here) ----------
  add({
    path: '/secrets',
    title: 'Secrets and easter eggs',
    description: 'Spoilers: the hidden jokes, scripted lines and reveals in tibo.dog, with how to trigger each one.',
    body: readFileSync(new URL('../data/prose/secrets.md', import.meta.url), 'utf8'),
    sources: ['Deployed tibo.dog JavaScript, quoted inline', 'Headless runs with `tools/play.mjs` and browser play on tibo.dog, 2026-11-05'],
    search: 'secrets easter eggs spoilers hidden jokes taunt fries alex suit day 28 cut-in reset zombie',
  });

  // ---------- Mechanics reference ----------
  const raw = readFileSync(new URL('../data/mechanics-notes.md', import.meta.url), 'utf8')
    .replace(/^# .*\n+Build:.*\n+/m, '')
    .replace(/^## \d+\. \(pending\)\n+/gm, '')
    .replace(/## \d+\. Stats, mods, effects, behaviors\n+\(pending\)\n+/g, '')
    .replace(/- Recipe tables \(from `sim.pt`\): see `notes\/recipes.md` appended below.\n/, '- Recipe tables: see [Evolutions](/evolutions).\n');
  add({
    path: '/mechanics-reference',
    title: 'Mechanics reference',
    description: 'Full research notes on tibo.dog mechanics with a verbatim code quote for every claim: formulas, level-ups, evolutions, points of interest, schedules and dogs.',
    lead: 'These are the original research notes behind the guide pages, preserved against build `boot-DIJlLGwy.js` / `sim-DQNACfZS.js`. **They describe that historical build, not the current game.** Use the individual guide and entity pages for current values. The notes and their **Verified** or **Inferred** labels are unchanged; the original source bundles were unavailable for rechecking in this update. See [Versions & updates](/versions).',
    body: raw,
    sources: ['Deployed tibo.dog JavaScript, quoted inline'],
    search: 'mechanics reference formulas code citations research notes',
  });

  // ---------- Search ----------
  add({
    path: '/search',
    title: 'Search',
    description: 'Search tibodog.wiki, the unofficial tibo.dog wiki.',
    body: `<h2 id="search-heading">Search</h2>\n<ol id="search-page-results"></ol>\n<noscript>Search needs JavaScript. Every page is listed on <a href="/all-pages">All pages</a> and in the <a href="/sitemap.xml">sitemap</a>.</noscript>\n`,
    sources: [],
    bare: true,
  });

  // ---------- All pages ----------
  const all = [...entityPages, ...pages].filter((p) => p.path !== '/search');
  const groups = {};
  for (const p of all) (groups[p.crumbs?.[0]?.[0] ?? 'Guides'] ??= []).push(p);
  add({
    path: '/all-pages',
    title: 'All pages',
    description: `Every page on tibodog.wiki (${all.length + 1} pages).`,
    body: Object.entries(groups)
      .map(([g, list]) => `## ${g}\n\n${list.sort((a, b) => a.title.localeCompare(b.title)).map((p) => `- [${p.title}](${p.path})`).join('\n')}\n`)
      .join('\n'),
    sources: [],
    search: 'index sitemap list',
  });

  // ---------- Meta pages ----------
  add({
    path: '/sources',
    title: 'Sources & method',
    description: 'How tibodog.wiki was researched: game build, files, extraction method and how verified facts are separated from inference.',
    body: MECH.sources(),
    sources: [],
    search: 'sources citations method research version',
  });
  add({
    path: '/versions',
    title: 'Versions & updates',
    description: 'Average updates per day and week, version history, when the wiki was last updated, and a live check against tibo.dog.',
    body: MECH.versions(),
    sources: [],
    search: 'version versions update updated changelog patch build live check date frequency average daily weekly',
  });
  add({
    path: '/coverage',
    title: 'Coverage gaps',
    description: 'What tibodog.wiki does not cover yet or could not verify.',
    body: MECH.coverage(),
    sources: [],
    search: 'gaps missing unknown todo',
  });
  add({
    path: '/api',
    title: 'Data API',
    description: 'Read-only JSON API with the raw tibo.dog game data used by this wiki.',
    body: `The wiki publishes the raw game data it was built from as static JSON. No key, no authentication. CORS is open.\n\n- Index: [/api/v1/index.json](/api/v1/index.json)\n- OpenAPI 3.1 description: [/openapi.json](/openapi.json)\n\nEvery response is \`{ "meta": {...}, "data": ... }\`. \`meta.build\` names the game files and research date.\n\n## Versioning\n\nPaths are versioned: \`/api/v1/…\` is stable. \`/api/…\` without a version is an alias of the latest version. Breaking changes will ship under \`/api/v2/\`, and v1 will stay available for at least 90 days with a \`Deprecation\` header. Data changes when the game changes; \`meta.build\` tells you which game build a response reflects.\n\n## Rate limits\n\nThe API is static files on Vercel's CDN. There is no per-client rate limit and no rate-limit headers; please cache responses (they send \`Cache-Control: public, max-age=3600\`).\n\n` +
      table(['Endpoint', 'Contents'], [
        ['`/api/v1/weapons.json`', `All ${R.allWeapons.length} weapons (base, evolved, union)`],
        ['`/api/v1/runes.json`', `${(R.runes ?? []).length} runes: source weapon families, axes, effects and raw multipliers`],
        ['`/api/v1/passives.json`', `${R.passives.length} passives`],
        ['`/api/v1/items.json`', `${R.allItems.length} items including evolved items`],
        ['`/api/v1/enemies.json`', `${R.enemies.length} enemies`],
        ['`/api/v1/bosses.json`', `${R.bosses.length} bosses in boss order`],
        ['`/api/v1/biomes.json`', `${R.biomes.length} biomes`],
        ['`/api/v1/events.json`', `${R.events.length} events`],
        ['`/api/v1/dogs.json`', `${R.dogs.length} dogs`],
        ['`/api/v1/pois.json`', `${R.pois.length} point-of-interest kinds`],
        ['`/api/v1/grok-bots.json`', `${R.botHelps.length} Grok Bot helpers`],
        ['`/api/v1/recipes.json`', 'Evolution, union and item evolution recipes'],
        ['`/api/v1/config.json`', 'Main game config (player, dash, scaling, economy, …)'],
        ['`/api/v1/difficulty.json`', 'Difficulty multipliers'],
        ['`/api/v1/text.json`', 'English names and descriptions keyed by content id'],
        ['`/api/v1/localized-text.json`', 'Official names and descriptions in all 27 languages, with source hashes'],
        ['`/api/v1/coverage.json`', 'Generated explanation ownership, recorded measurements and retained scenarios for registry entities and gear rules'],
      ]) +
      `\n## Mechanics inventory\n\n[Download the inventory](/api/v1/coverage.json), or run \`node tools/coverage-inventory.mjs --json\` to rebuild it locally. \`data.entries\` includes entity IDs, attack families, definition hashes, explanation links and recorded evidence. \`data.summary\` and \`data.groups\` count missing explanations, partial family guides, entries with no recorded measurement and entries with no retained scenario. These are separate, overlapping categories—not a count of untested game mechanics.\n\nEvery build regenerates the inventory; missing owners, removed evidence targets and missing scenario files fail the build. Scenario evidence is bound to its game build, definition hash and script hash: a mismatch marks it \`needs-rerun\`, not current coverage. Historical prose reports keep their stated build or remain undated. Shared evidence is assigned only to named entities; a global combat report is not a test for every entry. This inventories catalog entities and exported gear rules, not every runtime-only subsystem or every interaction.\n\n` +
      `\n## Localized text\n\n[Download localized text](/api/v1/localized-text.json). In the response, \`data.text.fr.weapon.peeler.desc\` is the official French Peeler description; \`data.text.fr.rune\` contains rune names and descriptions. \`data.locales\` lists language tags and directions; \`data.game\` identifies the original revision; \`data.sources\` gives URLs and SHA-256 hashes. Strings, placeholders and absent translations are copied as published, not translated or filled in by the wiki. Interface text and changelogs are not included. The updater refreshes this export alongside the game catalogs.\n\n` +
      `\n## Errors\n\nUnknown endpoints return HTTP 404 with a JSON body:\n\n\`\`\`json\n{"error":{"code":"not_found","status":404,"message":"No API endpoint at /api/x.json.","hint":"GET /api/index.json lists every endpoint; /openapi.json describes them."}}\n\`\`\`\n\n## Example\n\n\`\`\`sh\ncurl -s ${SITE}/api/v1/recipes.json | jq '.data.evolutions[] | select(.catalyst=="hot-sauce")'\n\`\`\`\n\n## Markdown pages\n\nAny wiki page is available as Markdown by adding \`.md\` to its path, or by sending \`Accept: text/markdown\`.\n`,
    sources: [],
    search: 'api json data openapi developers',
  });
  add({
    path: '/about',
    title: 'About',
    description: 'About tibodog.wiki, the unofficial tibo.dog fan wiki: who maintains it, what it covers and how it relates to the game.',
    body: `**tibodog.wiki** is an unofficial fan reference for [tibo.dog](https://tibo.dog/), the free browser survivors-like by [poteto](https://x.com/poteto). It is not made by, affiliated with or endorsed by the developer; the name only says which game it covers.\n\n<p class="brand-mark"><img src="/logo.svg" width="96" height="96" alt="tibodog.wiki logo: an open book with a paw print"></p>\n\nThe logo, an open book with a paw print, is original art made for this wiki, not a game sprite. It is drawn by [\`tools/brand.py\`](https://github.com/pc-style/tibodog-wiki/blob/main/tools/brand.py) along with the favicons and the link preview image. The look follows tibo.dog's own gilded menus: night-navy panels, gold rims, and open-licence typefaces: [Cinzel](https://github.com/NDISCOVER/Cinzel) for titles, as in the game, and [Source Serif 4](https://github.com/adobe-fonts/source-serif) for reading text (SIL Open Font License, licence texts in [\`public/fonts\`](https://github.com/pc-style/tibodog-wiki/tree/main/public/fonts)).\n\n## What it covers\n\nWeapons, evolutions, unions, passives, items and item evolutions, dogs, enemies, bosses, biomes, events, points of interest, Grok Bots, visitors, difficulty modes, story mode, stat formulas, level-ups, chests, curse, controls, unlocks and strategy. The design follows community game wikis such as minecraft.wiki: one page per thing, an infobox with the key numbers, tables you can sort, and links between related pages.\n\n## How it is made\n\nThe content is generated from data extracted from the deployed game (build \`${BUILD.boot}\`, researched ${BUILD.researched}). Descriptions in quotes are the game's own English text. Interpretations are marked as such. See [Sources & method](/sources).\n\n## Maintainer\n\nMaintained by Adam Krupa ([pcstyle.dev](https://pcstyle.dev), [GitHub](https://github.com/pc-style)). See [Contact](/contact) for corrections.\n\n## Game art and text\n\nSprites, names and descriptions belong to the game's owner and are reproduced at small size for identification and reference. If the developer would like anything changed or removed, use the [contact page](/contact).\n`,
    sources: [SRC_ABOUT],
    search: 'about wiki maintainer',
  });
  add({
    path: '/contact',
    title: 'Contact',
    description: 'How to report a mistake or request a change on tibodog.wiki.',
    body: `Found a wrong number, an outdated page or something missing? Get in touch with the maintainer.\n\n- Email: [me@pcstyle.dev](mailto:me@pcstyle.dev)\n- GitHub: [pc-style](https://github.com/pc-style)\n- Website: [pcstyle.dev](https://pcstyle.dev)\n\nPlease include the page URL, what is wrong and, if you can, where the correct information comes from (a game version, a screenshot or a developer post).\n\n## For the game's developer\n\nThis wiki is unofficial. If you are the developer of tibo.dog and want something corrected, credited differently or removed, email the address above and it will be handled promptly.\n\n## Not for game support\n\nThis wiki cannot help with problems in the game itself, accounts or saves. For the game, see [tibo.dog](https://tibo.dog/) and its maker, [poteto on X](https://x.com/poteto).\n`,
    sources: [],
    search: 'contact email corrections report',
  });
  add({
    path: '/privacy',
    title: 'Privacy',
    description: 'Privacy policy of tibodog.wiki: no accounts, no cookies, no analytics scripts.',
    body: `This wiki is a static website. It has no accounts, sets no cookies and runs no analytics or advertising scripts.\n\n## What is processed\n\n- **Hosting logs.** The site is hosted on Vercel. Like any web host, Vercel processes request data such as IP address, user agent and the page requested in order to serve pages and protect the service. See [Vercel's privacy policy](https://vercel.com/legal/privacy-policy).\n- **Search.** Search runs entirely in your browser against a static index file. Search terms are not sent anywhere except as part of the page URL when you submit the search form.\n- **Local storage.** None.\n\n## The game\n\nThis policy covers only the wiki. tibo.dog itself has its own [privacy page](https://tibo.dog/privacy), which describes the anonymous gameplay analytics the game records and how to turn them off in the game's Settings.\n\n## Contact\n\nQuestions about this policy: see [Contact](/contact).\n\nLast updated ${BUILD.researched}.\n`,
    sources: [],
    search: 'privacy cookies',
  });
  return pages;
}
