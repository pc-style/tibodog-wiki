// Read-only adapter for the public, revision-scoped game data API. Config and
// difficulty deliberately continue to come from dump-build's extracted fallback.
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = 'https://tibo.dog/data/v1/';
const TYPES = {
  weapons: ['weapon', 'allWeapons', 'baseWeapons', 'evolutions', 'unions'],
  passives: ['passive', 'passives'],
  items: ['item', 'allItems', 'items', 'evolvedItems'],
  enemies: ['enemy', 'enemies'], bosses: ['boss', 'bosses', 'bossOrder'],
  biomes: ['biome', 'biomes'], events: ['event', 'events'], dogs: ['dog', 'dogs'],
  pois: ['poi', 'pois'], 'bot-helps': ['botHelp', 'botHelps'],
};
const TEXT_FIELDS = {
  weapon: ['name', 'desc'], passive: ['name', 'desc'], item: ['name', 'desc'],
  enemy: ['name'], boss: ['name', 'title', 'desc'], biome: ['name', 'desc'],
  event: ['name', 'announce'], dog: ['name', 'breed', 'desc'],
  poi: ['name', 'desc'], botHelp: ['name', 'desc'], rarity: ['name'],
  shrine: ['label'], dailyWeather: ['name', 'desc'], gear: ['name', 'desc'],
  gearSet: ['name'], varietyPlace: ['name', 'desc'], setRule: ['label', 'desc'],
};
const fail = (message) => { throw new Error(`official data: ${message}`); };
const object = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const requireObject = (v, label) => { if (!object(v)) fail(`${label}: expected object`); };
const keys = (v, allowed, label) => {
  requireObject(v, label);
  for (const k of Object.keys(v)) if (!allowed.includes(k)) fail(`${label}: unknown field ${k}; schema review required`);
};
const idOK = (s) => typeof s === 'string' && /^[A-Za-z0-9][A-Za-z0-9-]*$/.test(s);

// JSON.parse accepts duplicate keys. Reject them, including nested definitions,
// before a later value can hide an earlier entity, path, or ID.
function parseJSON(source, label) {
  let value;
  try { value = JSON.parse(source); } catch { fail(`${label}: invalid JSON`); }
  const tokens = source.match(/"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}\[\],:]/g);
  let i = 0;
  function walk() {
    const token = tokens[i++];
    if (token === '{') {
      const seen = new Set();
      while (tokens[i] !== '}') {
        const key = JSON.parse(tokens[i++]);
        if (seen.has(key)) fail(`${label}: duplicate key ${key}`);
        seen.add(key); i++; walk();
        if (tokens[i] === ',') i++;
      }
      i++;
    } else if (token === '[') {
      while (tokens[i] !== ']') { walk(); if (tokens[i] === ',') i++; }
      i++;
    }
  }
  walk();
  return value;
}

function validateIndex(index, expectedCommit) {
  keys(index, ['schema', 'game', 'simVersion', 'locales', 'files'], 'index');
  keys(index.game, ['version', 'commit'], 'index.game');
  if (index.schema !== 1) fail('unsupported schema');
  if (!/^[a-f0-9]{40}$/.test(index.game.commit) ||
      typeof expectedCommit !== 'string' || !/^[a-f0-9]{7,40}$/.test(expectedCommit) ||
      !index.game.commit.startsWith(expectedCommit)) fail('game commit does not match expected commit');
  if (typeof index.game.version !== 'string' || typeof index.simVersion !== 'string') fail('invalid revision metadata');
  if (!Array.isArray(index.locales) || !index.locales.length || !Array.isArray(index.files)) fail('invalid index lists');
  const locales = new Set();
  for (const locale of index.locales) {
    keys(locale, ['tag', 'endonym', 'englishName', 'dir', 'file'], 'locale');
    if (!idOK(locale.tag) || locales.has(locale.tag) || locale.file !== `text/${locale.tag}.json` ||
        !['ltr', 'rtl'].includes(locale.dir) || typeof locale.endonym !== 'string' || typeof locale.englishName !== 'string') fail('invalid or duplicate locale');
    locales.add(locale.tag);
  }
  if (!locales.has('en')) fail('English locale missing');
  const files = new Map();
  for (const file of index.files) {
    keys(file, ['path', 'bytes'], 'index file');
    const allowed = Object.hasOwn(TYPES, String(file.path).replace(/\.json$/, '')) && file.path.endsWith('.json') ||
      file.path === 'config.json' || [...locales].some((tag) => file.path === `text/${tag}.json`) ||
      /^icons\/[A-Za-z0-9-]+\.png$/.test(file.path);
    if (!allowed || files.has(file.path) || !Number.isSafeInteger(file.bytes) || file.bytes <= 0) fail(`invalid, unknown or duplicate file ${file.path}`);
    files.set(file.path, file.bytes);
  }
  for (const path of [...Object.keys(TYPES).map((k) => `${k}.json`), ...[...locales].map((tag) => `text/${tag}.json`)]) {
    if (!files.has(path)) fail(`index missing ${path}`);
  }
  return files;
}

function validateData(catalogs, text, locales) {
  keys(catalogs, Object.keys(TYPES), 'catalogs');
  keys(text, locales, 'text locales');
  for (const kind of Object.keys(TYPES)) {
    const catalog = catalogs[kind];
    keys(catalog, ['kind', 'entries'], kind);
    if (catalog.kind !== kind) fail(`${kind}: wrong kind`);
    requireObject(catalog.entries, `${kind}.entries`);
    if (!Object.keys(catalog.entries).length) fail(`${kind}: empty catalog`);
    for (const [id, entry] of Object.entries(catalog.entries)) {
      keys(entry, ['id', 'def', 'icon', 'color', 'accent', 'legendary', ...TEXT_FIELDS[TYPES[kind][0]]], `${kind}.${id}`);
      if (!idOK(id) || entry.id !== id) fail(`${kind}.${id}: wrong ID`);
      requireObject(entry.def, `${kind}.${id}.def`);
      if ('id' in entry.def || (kind === 'pois' && 'kind' in entry.def)) fail(`${kind}.${id}: ID must be split from def`);
      for (const field of ['color', 'accent']) if (field in entry && typeof entry[field] !== 'string') fail(`${kind}.${id}: invalid ${field}`);
      if ('legendary' in entry && typeof entry.legendary !== 'boolean') fail(`${kind}.${id}: invalid legendary`);
      // Some shipped definitions have no published sprite yet.
      if ('icon' in entry && entry.icon !== null) {
        keys(entry.icon, ['file', 'width', 'height', 'pixelSize'], 'icon');
        if (entry.icon.file !== `icons/${id}.png` || !['width', 'height', 'pixelSize'].every((k) => typeof entry.icon[k] === 'number' && entry.icon[k] > 0)) fail(`${kind}.${id}: invalid icon`);
      }
    }
  }
  for (const tag of locales) {
    const locale = text[tag];
    keys(locale, ['locale', 'texts'], `text/${tag}`);
    if (locale.locale !== tag) fail(`text/${tag}: wrong locale`);
    keys(locale.texts, Object.keys(TEXT_FIELDS), `text/${tag}.texts`);
    for (const [type, entries] of Object.entries(locale.texts)) {
      requireObject(entries, `text/${tag}/${type}`);
      for (const [id, fields] of Object.entries(entries)) {
        if (!idOK(id)) fail(`text/${tag}/${type}: invalid ID`);
        keys(fields, TEXT_FIELDS[type], `text/${tag}/${type}/${id}`);
        if (!Object.keys(fields).length || Object.values(fields).some((v) => typeof v !== 'string')) fail(`text/${tag}/${type}/${id}: invalid fields`);
        if (tag !== 'en') {
          for (const field of Object.keys(fields)) if (!Object.hasOwn(text.en.texts[type]?.[id] ?? {}, field)) fail(`text/${tag}/${type}/${id}: unknown English mapping`);
        }
      }
    }
  }
  for (const [kind, [type]] of Object.entries(TYPES)) {
    const entries = catalogs[kind].entries;
    if (!isDeepStrictEqual(Object.keys(entries).sort(), Object.keys(text.en.texts[type] ?? {}).sort())) fail(`${kind}: English IDs differ`);
    for (const [id, entry] of Object.entries(entries)) {
      const fields = text.en.texts[type][id];
      for (const field of TEXT_FIELDS[type]) {
        if (typeof fields[field] !== 'string' || entry[field] !== fields[field]) fail(`${kind}.${id}.${field}: catalog/English mismatch`);
      }
    }
  }
}

/** Returns {index, catalogs: {[kind]: catalog}, text: {[locale]: document}, provenance}.
 * Every GET is bounded by a 20s AbortSignal; failures never silently fall back.
 */
export async function fetchOfficialData(expectedCommit, { request = fetch } = {}) {
  const resources = {};
  async function get(path, bytes) {
    const url = ROOT + path;
    const response = await request(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(20_000) });
    if (!response.ok) fail(`${path}: HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (bytes !== undefined && buffer.length !== bytes) fail(`${path}: bytes mismatch (expected ${bytes}, received ${buffer.length})`);
    const result = parseJSON(new TextDecoder('utf-8', { fatal: true }).decode(buffer), path);
    const provenance = { url, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex') };
    return { result, provenance };
  }
  const before = await get('index.json');
  const files = validateIndex(before.result, expectedCommit);
  const catalogs = {}, text = {};
  await Promise.all([...Object.keys(TYPES).map((kind) => [`${kind}.json`, catalogs, kind]),
    ...before.result.locales.map(({ tag, file }) => [file, text, tag])].map(async ([path, target, key]) => {
    const fetched = await get(path, files.get(path));
    target[key] = fetched.result; resources[path] = fetched.provenance;
  }));
  const after = await get('index.json');
  validateIndex(after.result, expectedCommit);
  if (!isDeepStrictEqual(before.result, after.result)) fail('index changed during fetch');
  validateData(catalogs, text, before.result.locales.map(({ tag }) => tag));
  return { index: before.result, catalogs, text, provenance: {
    game: before.result.game, simVersion: before.result.simVersion,
    fetchedAt: new Date().toISOString(), indexBefore: before.provenance, indexAfter: after.provenance, resources,
  } };
}

// Publish upstream text verbatim, including placeholders and missing translations.
// Stable locale order and content hashes keep rebuilds independent of fetch timing.
export function localizedTextExport(official) {
  const { index, text, provenance } = official;
  validateData(official.catalogs, text, index.locales.map(({ tag }) => tag));
  return {
    schema: 1, game: index.game, simVersion: index.simVersion, locales: index.locales,
    text: Object.fromEntries(index.locales.map(({ tag }) => [tag, text[tag].texts])),
    sources: { index: provenance.indexBefore,
      locales: Object.fromEntries(index.locales.map(({ tag, file }) => [tag, provenance.resources[file]])) },
  };
}

// Preserve serialized executable fields, but require all data fields to match.
function preserveFunctions(official, dumped) {
  if (Array.isArray(official)) return official.map((v, i) => preserveFunctions(v, dumped?.[i]));
  if (!object(official)) return official;
  const result = Object.fromEntries(Object.entries(official).map(([k, v]) => [k, preserveFunctions(v, dumped?.[k])]));
  if (object(dumped)) for (const [k, v] of Object.entries(dumped)) {
    if (v === '[fn]' && !Object.hasOwn(result, k)) result[k] = v;
  }
  return result;
}

// The dump is also the schema/mapping guard. No guessed IDs or unverified text.
export function applyOfficialData(dumped, official) {
  requireObject(dumped.registry, 'dumped.registry');
  requireObject(dumped.content, 'dumped.content');
  validateData(official.catalogs, official.text, Object.keys(official.text));
  const registry = { ...dumped.registry }, content = { ...dumped.content };
  for (const [kind, [, primary, ...aliases]] of Object.entries(TYPES)) {
    const entries = official.catalogs[kind].entries;
    for (const field of [primary, ...aliases]) {
      // Older/newer registries may expose an alias as a lookup function or omit
      // it altogether. Only the primary definition array is mandatory.
      if (field !== primary && (registry[field] === undefined || registry[field] === '[fn]')) continue;
      if (!Array.isArray(registry[field])) fail(`registry.${field}: expected array`);
      const seen = new Set();
      registry[field] = registry[field].map((old) => {
        if (field === 'bossOrder' && typeof old === 'string') {
          if (seen.has(old)) fail(`registry.${field}: duplicate ID ${old}`);
          if (!Object.hasOwn(entries, old)) fail(`registry.${field}: unmapped ID ${old}`);
          seen.add(old);
          return old;
        }
        requireObject(old, `registry.${field} entry`);
        const idKey = kind === 'pois' ? 'kind' : 'id';
        const id = old[idKey];
        if (seen.has(id)) fail(`registry.${field}: duplicate ID ${id}`);
        seen.add(id);
        if (!Object.hasOwn(entries, id)) fail(`registry.${field}: unmapped ID ${id}`);
        const definition = { [idKey]: id, ...entries[id].def };
        const replacement = preserveFunctions(definition, old);
        if (!isDeepStrictEqual(replacement, old)) fail(`registry.${field}.${id}: definition mismatch`);
        return replacement;
      });
      if ((field === primary || field === 'bossOrder') && !isDeepStrictEqual([...seen].sort(), Object.keys(entries).sort())) fail(`${kind}: unmapped official entries`);
    }
  }
  if (registry.bossIds !== undefined && (!Array.isArray(registry.bossIds) ||
      !isDeepStrictEqual([...registry.bossIds].sort(), Object.keys(official.catalogs.bosses.entries).sort()))) fail('registry.bossIds: IDs differ');
  for (const [type, entries] of Object.entries(official.text.en.texts)) {
    for (const [id, fields] of Object.entries(entries)) for (const [field, value] of Object.entries(fields)) {
      const key = `content.${type}.${id}.${field}`;
      const old = content[key];
      if (!Array.isArray(old)) fail(`${key}: unmapped English field`);
      // The game's compiled message representation uses [argumentName] tokens.
      const rendered = old.map((part) => {
        if (typeof part === 'string') return part;
        if (Array.isArray(part) && part.length === 1 && typeof part[0] === 'string') return `{${part[0]}}`;
        fail(`${key}: unsupported compiled text; schema review required`);
      }).join('');
      if (rendered !== value) fail(`${key}: English mismatch`);
      // Keep the compiled representation, rather than replacing it with raw ICU.
      content[key] = structuredClone(old);
    }
  }
  return { ...dumped, registry, content };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv[2] !== '--export-text') throw new Error('Usage: node tools/official-data.mjs --export-text [output.json]');
  const build = JSON.parse(readFileSync(new URL('../data/build.json', import.meta.url)));
  const output = process.argv[3] ?? new URL('../data/localized-text.json', import.meta.url);
  const exported = localizedTextExport(await fetchOfficialData(build.commit));
  writeFileSync(output, JSON.stringify(exported, null, 1) + '\n');
  console.log(`Exported original names and descriptions in ${exported.locales.length} languages for ${exported.game.commit}`);
}
