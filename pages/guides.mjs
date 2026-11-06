// The Guides and Quick tips tabs. Both are built from the "## Tips" sections of the hand-written
// entity prose (data/prose/<section>/<id>.md), so every tip stays the same sourced text as on its page.
import { readFileSync, existsSync } from 'node:fs';

const TOPICS = [
  { id: 'bosses', icon: 'boss/harvester', title: 'Boss guide', short: 'Bosses', one: 'boss', desc: 'How to fight every boss, in the order the bosses arrive.' },
  { id: 'biomes', icon: 'enemy/sand-crab', title: 'Biome survival guide', short: 'Biomes', one: 'biome', desc: 'What each biome throws at you and how to play it.' },
  { id: 'enemies', icon: 'enemy/aphid', title: 'Enemy field guide', short: 'Enemies', one: 'enemy', desc: 'How to handle each pest that has its own tricks.' },
  { id: 'events', icon: 'enemy/golden-scarab', title: 'Event guide', short: 'Events', one: 'event', desc: 'What to do when a timed event starts.' },
  { id: 'weapons', icon: 'weapon/spud-cannon', title: 'Weapon guide', short: 'Weapons', one: 'weapon', desc: 'How to get the most out of every weapon, evolution and union.' },
  { id: 'passives', icon: 'passive/butter-pat', title: 'Passive guide', short: 'Passives', one: 'passive', desc: 'When each stat upgrade is worth picking.' },
  { id: 'items', icon: 'item/kaboom-spud', title: 'Item guide', short: 'Items', one: 'item', desc: 'How each item and evolved item changes a run.' },
  { id: 'dogs', icon: 'dog/corgi', title: 'Dog guide', short: 'Dogs', one: 'dog', desc: "Picking and using the dogs in Tibo's pack." },
];

const BASICS = [
  ['/getting-started', 'Getting started', 'How a run works, start to finish'],
  ['/strategy', 'Strategy', 'Build advice grounded in the game data'],
  ['/controls', 'Controls', 'Keys, touch, dash and settings'],
  ['/story-mode', 'Story mode', 'The short first game'],
  ['/endgame', 'Endgame', 'What changes after 20:00'],
];

const SOURCE = 'Tips sections of the linked wiki pages; each page lists its own sources';

// The tip bullets of one prose file, each as Markdown without its leading "- ".
function tipsOf(path) {
  const f = new URL(`../data/prose${path}.md`, import.meta.url);
  if (!existsSync(f)) return [];
  const m = readFileSync(f, 'utf8').match(/^## Tips\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  if (!m) return [];
  return m[1].trim().split(/\n(?=- )/).map((t) => t.replace(/^- /, '').replace(/\n\s+/g, ' ').trim()).filter(Boolean);
}

// The first sentence of a tip, for Quick tips: a bold lead if there is one, else up to the first
// full stop outside links, parentheses and code. Inline code citations are dropped.
export function firstSentence(tip) {
  const t = tip.replace(/\s*<small>[\s\S]*?<\/small>/g, '').trim();
  const bold = t.match(/^\*\*(.+?)\*\*/);
  if (bold) return bold[1].replace(/[.:]$/, '.').replace(/([^.!?])$/, '$1.');
  let depth = 0, tick = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === '`') tick = !tick;
    if (tick) continue;
    if (c === '(' || c === '[') depth++;
    if (c === ')' || c === ']') depth--;
    if (depth === 0 && /[.!?]/.test(c) && /^\s+[A-Z“"(]/.test(t.slice(i + 1)) && !/\b(e\.g|i\.e|vs|approx|ca)$/i.test(t.slice(0, i))) {
      return t.slice(0, i + 1);
    }
  }
  return t;
}

const iconOf = (p) => (p.infobox?.icon ? `{{icon:${p.infobox.icon}}}` : '');
// Arrival time as minutes; pages without one keep their order after the timed ones (stable sort).
const minutes = (p) => { const m = /^(\d+):(\d+)/.exec(arrives(p) ?? ''); return m ? +m[1] + m[2] / 60 : 1e9; };
const arrives = (p) => p.infobox?.rows?.find((r) => r[0] === 'Arrives')?.[1]?.replace(/\s*\(\[[^\]]*\]\([^)]*\)\)/, '');

export function guidePages(entityPages) {
  const topics = TOPICS.map((t) => ({
    ...t,
    path: `/guides/${t.id}`,
    entries: entityPages
      .filter((p) => p.path.startsWith(`/${t.id}/`))
      .map((p) => ({ page: p, tips: tipsOf(p.path) }))
      .filter((e) => e.tips.length)
      // Bosses follow the run's schedule (the topic description promises arrival order); the rest stay alphabetical.
      .sort((a, b) => minutes(a.page) - minutes(b.page)),
  }));
  const cards = (list) => `<div class="cards">\n${list.map(([u, title, sub, ic]) => `<a href="${u}">${ic ? `{{icon:${ic}}}` : ''}<strong>${title}</strong><span>${sub}</span></a>`).join('\n')}\n</div>\n`;

  const hub = {
    path: '/guides',
    tab: 'guides',
    crumbs: [],
    title: 'Guides',
    description: 'Practical tibo.dog guides: how to beat each boss, survive each biome and use every weapon, item, passive and dog, built from the tips on this wiki.',
    lead: 'Practical advice for playing tibo.dog, gathered by topic from the tips on every wiki page. Each guide links back to the full page with stats and sources. For the short version, see [Quick tips](/quick-tips).',
    body: `## Topic guides\n\n${cards(topics.map((t) => [t.path, t.title, `${t.desc} ${t.entries.length}\u00a0${t.short.toLowerCase()}.`, t.icon]))}\n## Start with the basics\n\n${cards(BASICS.map(([u, t, s]) => [u, t, s]))}`,
    sources: [SOURCE],
    search: 'guides guide how to play walkthrough advice',
  };

  const guides = topics.map((t) => ({
    path: t.path,
    tab: 'guides',
    crumbs: [['Guides', '/guides']],
    title: t.title,
    description: `${t.desc} Tips for ${t.entries.length} ${t.short.toLowerCase()} in tibo.dog, each linked to its full wiki page.`,
    lead: `${t.desc} Each entry starts with its key tip; open the rest under it. The same tips, with numbers and sources, are on each ${t.one}'s page.`,
    body: t.entries
      .map(({ page, tips }) => {
        const when = arrives(page) ? ` <small class="when">${arrives(page)}</small>` : '';
        // The first tip leads; the rest fold away so a long guide stays scannable.
        const more = tips.length > 1 ? `\n<details class="more"><summary>${tips.length - 1} more tip${tips.length > 2 ? 's' : ''}</summary>\n\n${tips.slice(1).map((x) => `- ${x}`).join('\n')}\n\n</details>\n` : '';
        return `## ${iconOf(page)}[${page.title}](${page.path})${when}\n\n${tips[0]}\n${more}`;
      })
      .join('\n'),
    sources: [SOURCE],
    search: `${t.short.toLowerCase()} guide tips how to`,
  }));

  const quick = {
    path: '/quick-tips',
    tab: 'tips',
    crumbs: [],
    title: 'Quick tips',
    description: 'One-line tibo.dog tips for every boss, biome, enemy, event, weapon, passive, item and dog, each linked to its wiki page.',
    lead: 'The short version: the first tip from each wiki page, grouped by topic. Follow a link for the full advice and the numbers behind it, or read the [Guides](/guides).',
    // One folded section per topic; a link to #topic unfolds it (site.js). The sidebar lists the topics, so no TOC.
    toc: false,
    body: topics
      .map((t) => `<details class="topic"><summary><h2 id="${t.id}">${t.short}</h2><small>${t.entries.length} tips</small></summary>\n\n${t.entries.map(({ page, tips }) => `- ${iconOf(page)}**[${page.title}](${page.path})**: ${firstSentence(tips[0])}`).join('\n')}\n\nMore in the [${t.title.toLowerCase()}](${t.path}).\n\n</details>\n`)
      .join('\n'),
    sources: [SOURCE],
    search: 'quick tips short advice cheat sheet',
  };

  return [hub, ...guides, quick];
}

// Sidebar groups for the Guides and Quick tips tabs.
export const GUIDE_NAV = [
  ['Guides', [['All guides', '/guides'], ...TOPICS.map((t) => [t.title, `/guides/${t.id}`])]],
  ['Basics', BASICS.map(([u, t]) => [t, u])],
];
export const TIPS_NAV = [['Quick tips', [['All quick tips', '/quick-tips'], ...TOPICS.map((t) => [t.short, `/quick-tips#${t.id}`])]]];
