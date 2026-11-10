// Extracts every entity's name in each of the game's languages from the i18n-<lang>-content chunks.
// Usage: node tools/i18n-names.mjs [assets dir] [boot chunk] [main chunk] [out file]
//   Defaults: the build in data/build.json, its .cache/<main>/assets (mirrored if missing), data/i18n-names.json.
//   tools/update.mjs passes all four for the live build.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mirror } from './fetch-build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = JSON.parse(readFileSync(join(ROOT, 'data/build.json'), 'utf8'));
const [, , dirArg, bootChunk = BUILD.boot, mainChunk = BUILD.main, out = join(ROOT, 'data/i18n-names.json')] = process.argv;
let dir = dirArg ?? join(ROOT, '.cache', mainChunk.replace(/\.js$/, ''), 'assets');
if (!existsSync(join(dir, bootChunk))) dir = (await mirror(undefined, mainChunk)).dir;

const boot = readFileSync(join(dir, bootChunk), 'utf8');
const languageChunk = boot.match(/\.\/(language-ahead-[A-Za-z0-9_-]{8}\.js)/)?.[1];
const source = boot + (languageChunk ? readFileSync(join(dir, languageChunk), 'utf8') : '');
// The language list: [{tag, endonym, englishName, dir}, ...] in the order the Settings panel shows it.
const languages = [...source.matchAll(/\{tag:`([^`]+)`,endonym:`([^`]+)`,englishName:`([^`]+)`,dir:`(ltr|rtl)`\}/g)].map((m) => ({ tag: m[1], endonym: m[2], englishName: m[3], dir: m[4] }));
if (languages.length < 2 || languages[0].tag !== 'en') throw new Error(`language list not found in ${bootChunk}`);
// English loads its own content chunk; every other language loads a ui and a content chunk.
for (const l of languages) {
  const m = source.match(new RegExp(`\\./(i18n-${l.tag}-content-[A-Za-z0-9_-]{8}\\.js)`));
  if (!m) throw new Error(`no content chunk for ${l.tag}`);
  l.chunk = m[1];
}
// Keys the game always shows in English, whatever the language.
const always = boot.match(/new Set\(\[((?:`content\.[^`]+`,?)+)\]\)/)?.[1].match(/content\.[^`]+/g) ?? [];

// Each content chunk is a module that only exports its messages, like tools/dump-build.mjs loads the English one.
const messages = async (f) => {
  const m = (await import(join(dir, f))).messages;
  if (!m || typeof m !== 'object') throw new Error(`no messages in ${f}`);
  return m;
};
const text = (v) => (v.every((p) => typeof p === 'string') ? v.join('') : null);

const FIELDS = { weapon: ['name'], passive: ['name'], item: ['name'], dog: ['name', 'breed'], enemy: ['name'], boss: ['name', 'title'], biome: ['name'], event: ['name'], poi: ['name'], botHelp: ['name'] };
const all = Object.fromEntries(await Promise.all(languages.map(async (l) => [l.tag, await messages(l.chunk)])));
const en = all.en;
const names = {};
const fallback = [];
const raw = {};
for (const key of Object.keys(en).sort()) {
  const [, kind, id, field] = key.match(/^content\.(\w+)\.(.+)\.(\w+)$/) ?? [];
  if (!FIELDS[kind]?.includes(field)) continue;
  const row = {};
  for (const l of languages) {
    const v = all[l.tag][key];
    // Missing keys, and keys on the always-English list, fall back to the English text in the game.
    if (v === undefined || always.includes(key)) {
      if (l.tag !== 'en') fallback.push(`${key} ${l.tag}`);
      row[l.tag] = text(en[key]);
    } else {
      row[l.tag] = text(v);
      if (row[l.tag] === null) throw new Error(`${key} ${l.tag} has placeholders`);
    }
  }
  const entry = ((names[kind] ??= {})[id] ??= {});
  entry[field] = row;
  // A verbatim quote of one translated name, for the page's code citation (tools/check-quotes.mjs).
  if (field === 'name' && !always.includes(key)) entry.cite = cite(key);
}

function cite(key) {
  for (const l of languages.filter((l) => /^[a-z]+$/.test(l.tag) && l.tag !== 'en')) {
    const src = (raw[l.chunk] ??= readFileSync(join(dir, l.chunk), 'utf8'));
    const quote = src.match(new RegExp(`"${key.replace(/\./g, '\\.')}":\\[[^\\]]*\\]`))?.[0];
    if (quote && !/[\\`]/.test(quote)) return { chunk: l.chunk, quote };
  }
  throw new Error(`no citable translation for ${key}`);
}

writeFileSync(out, JSON.stringify({ build: { main: mainChunk, boot: bootChunk }, languages, alwaysEnglish: always, fallback, names }, null, 1) + '\n');
console.log(`${languages.length} languages, ${Object.values(names).reduce((n, k) => n + Object.keys(k).length, 0)} entities, ${fallback.length} English fallbacks -> ${out}`);
