import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fetchOfficialData, applyOfficialData, localizedTextExport } from './official-data.mjs';

const COMMIT = 'abcdef0123456789abcdef0123456789abcdef01';
const TYPES = {
  weapons: ['weapon', ['allWeapons', 'baseWeapons', 'evolutions', 'unions'], ['name', 'desc']],
  passives: ['passive', ['passives'], ['name', 'desc']],
  items: ['item', ['allItems', 'items', 'evolvedItems'], ['name', 'desc']],
  enemies: ['enemy', ['enemies'], ['name']],
  bosses: ['boss', ['bosses', 'bossOrder'], ['name', 'title', 'desc']],
  biomes: ['biome', ['biomes'], ['name', 'desc']],
  events: ['event', ['events'], ['name', 'announce']],
  dogs: ['dog', ['dogs'], ['name', 'breed', 'desc']],
  pois: ['poi', ['pois'], ['name', 'desc']],
  'bot-helps': ['botHelp', ['botHelps'], ['name', 'desc']],
};

function fixture() {
  const catalogs = {}, texts = {}, registry = { weapon: '[fn]', botShapes: [{ id: 'blob' }], bossIds: ['sample'] }, content = {};
  for (const [kind, [type, arrays, fields]] of Object.entries(TYPES)) {
    const english = Object.fromEntries(fields.map((field) => [field, `${type} ${field} 🥔`]));
    const entry = { id: 'sample', ...english, icon: null, def: { value: 3, nested: { count: 2 } } };
    catalogs[kind] = { kind, entries: { sample: entry } };
    texts[type] = { sample: english };
    for (const field of fields) content[`content.${type}.sample.${field}`] = [english[field]];
    for (const array of arrays) registry[array] = [{ [kind === 'pois' ? 'kind' : 'id']: 'sample', ...structuredClone(entry.def) }];
  }
  texts.setRule = { sample: { desc: 'Gain {gain}%.' } };
  content['content.setRule.sample.desc'] = ['Gain ', ['gain'], '%.'];
  content['content.untranslated.sample.name'] = ['Not exported'];
  const official = { catalogs, text: { en: { locale: 'en', texts }, fr: { locale: 'fr', texts: { weapon: { sample: { name: 'Patate' } } } } } };
  const bodies = Object.fromEntries(Object.entries(catalogs).map(([k, v]) => [`${k}.json`, JSON.stringify(v)]));
  for (const [tag, doc] of Object.entries(official.text)) bodies[`text/${tag}.json`] = JSON.stringify(doc);
  const index = { schema: 1, game: { version: COMMIT.slice(0, 7), commit: COMMIT }, simVersion: 'simulation-1',
    locales: ['en', 'fr'].map((tag) => ({ tag, endonym: tag, englishName: tag, dir: 'ltr', file: `text/${tag}.json` })),
    files: [...Object.entries(bodies).map(([path, body]) => ({ path, bytes: Buffer.byteLength(body) })), { path: 'config.json', bytes: 123 }],
  };
  const calls = [];
  let indexReads = 0;
  const f = { official, dumped: { registry, content, config: { extracted: true } }, bodies, index, calls,
    rewrite(path, transform) {
      bodies[path] = JSON.stringify(transform(JSON.parse(bodies[path])));
      index.files.find((file) => file.path === path).bytes = Buffer.byteLength(bodies[path]);
    },
    async request(url, options) {
      const path = url.replace('https://tibo.dog/data/v1/', '');
      calls.push({ path, options });
      if (path === 'index.json') {
        indexReads++;
        return new Response(JSON.stringify(indexReads === 2 && f.after ? f.after : index));
      }
      if (path === 'config.json' || path === f.forbidden) return new Response('Forbidden', { status: 403 });
      assert.ok(Object.hasOwn(bodies, path), `unexpected path: ${path}`);
      return new Response(bodies[path]);
    },
  };
  return f;
}

test('fetches index around all allowlisted resources, checks UTF-8 bytes and records hashes; config 403 is not requested', async () => {
  const f = fixture();
  const result = await fetchOfficialData(COMMIT, f);
  assert.deepEqual(result.catalogs, f.official.catalogs);
  assert.deepEqual(result.text, f.official.text);
  assert.equal(f.calls[0].path, 'index.json');
  assert.equal(f.calls.at(-1).path, 'index.json');
  assert.equal(f.calls.length, 14);
  assert.ok(!f.calls.some(({ path }) => path === 'config.json'));
  for (const { options } of f.calls) {
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers['Cache-Control'], 'no-cache');
    assert.ok(options.signal instanceof AbortSignal);
  }
  assert.equal(result.provenance.game.commit, COMMIT);
  assert.equal(result.provenance.resources['weapons.json'].sha256, createHash('sha256').update(f.bodies['weapons.json']).digest('hex'));
  assert.deepEqual(result.provenance.indexBefore, result.provenance.indexAfter);
  assert.ok(Number.isFinite(Date.parse(result.provenance.fetchedAt)));
  await fetchOfficialData(COMMIT.slice(0, 12), fixture());
});

test('rejects wrong, missing, too-short or nonhex expected commits before fetching resources', async () => {
  for (const commit of ['1'.repeat(40), undefined, 'abc', 'not-a-commit']) {
    const f = fixture();
    await assert.rejects(fetchOfficialData(commit, f), /commit/);
    assert.equal(f.calls.length, 1);
  }
});

test('localized export preserves original descriptions, placeholders, RTL and absent translations with revision hashes', async () => {
  const f = fixture();
  f.index.locales.find((l) => l.tag === 'fr').dir = 'rtl';
  f.rewrite('text/fr.json', (doc) => {
    doc.texts.weapon.sample.desc = 'بطاطا {gain}% 🥔';
    return doc;
  });
  const fetched = await fetchOfficialData(COMMIT, f);
  const result = localizedTextExport(fetched);
  assert.equal(result.game.commit, COMMIT);
  assert.equal(result.simVersion, 'simulation-1');
  assert.deepEqual(result.locales, f.index.locales);
  assert.equal(result.text.fr.weapon.sample.desc, 'بطاطا {gain}% 🥔');
  assert.equal(result.text.en.setRule.sample.desc, 'Gain {gain}%.');
  assert.equal(result.text.fr.item, undefined, 'do not invent English fallbacks in upstream exports');
  assert.equal(result.sources.locales.fr.sha256, createHash('sha256').update(f.bodies['text/fr.json']).digest('hex'));
  const reordered = { ...fetched, text: { fr: fetched.text.fr, en: fetched.text.en },
    provenance: { ...fetched.provenance, fetchedAt: 'another fetch time' } };
  assert.equal(JSON.stringify(localizedTextExport(reordered)), JSON.stringify(result));
});

test('rejects commit, sim revision, and manifest drift on the final index', async () => {
  for (const mutate of [
    (i) => { i.game.commit = '1'.repeat(40); },
    (i) => { i.simVersion = 'simulation-2'; },
    (i) => { i.files[0].bytes++; },
  ]) {
    const f = fixture(); f.after = structuredClone(f.index); mutate(f.after);
    await assert.rejects(fetchOfficialData(COMMIT, f), /commit|index changed/);
  }
});

test('rune text exports verbatim and maps compiled English while rejecting unknown or malformed fields', async () => {
  const f = fixture();
  f.rewrite('text/en.json', (doc) => {
    doc.texts.rune = { 'peeler-backhand': { name: 'Backhand', desc: 'Slashes bat bullets back.' } };
    return doc;
  });
  f.rewrite('text/fr.json', (doc) => {
    doc.texts.rune = { 'peeler-backhand': { name: 'Revers' } };
    return doc;
  });
  const result = await fetchOfficialData(COMMIT, f);
  assert.deepEqual(localizedTextExport(result).text.fr.rune, { 'peeler-backhand': { name: 'Revers' } });
  assert.equal(localizedTextExport(result).text.en.rune['peeler-backhand'].desc, 'Slashes bat bullets back.');
  f.dumped.content['content.rune.peeler-backhand.name'] = ['Backhand'];
  f.dumped.content['content.rune.peeler-backhand.desc'] = ['Slashes bat bullets back.'];
  assert.throws(() => applyOfficialData(f.dumped, result), /registry.runes: English IDs differ/);
  f.dumped.registry.runes = [{ id: 'peeler-backhand', weapon: 'sample', axis: 'target', effects: [] }];
  assert.deepEqual(applyOfficialData(f.dumped, result), f.dumped);
  for (const runes of [[], [...f.dumped.registry.runes, ...f.dumped.registry.runes],
    [{ id: 'peeler-backhand', weapon: 'unknown', effects: [] }]]) {
    assert.throws(() => applyOfficialData({ ...f.dumped, registry: { ...f.dumped.registry, runes } }, result), /registry.runes/);
  }
  for (const fields of [{ damage: 1 }, { name: 3 }, { desc: null }, [], {}, { name: 'Backhand' }, { desc: 'Reflects' }, { name: 'Backhand', extra: 'No' }]) {
    const g = fixture();
    g.rewrite('text/en.json', (doc) => { doc.texts.rune = { 'peeler-backhand': fields }; return doc; });
    await assert.rejects(fetchOfficialData(COMMIT, g), /official data:/);
  }
  const g = fixture();
  g.rewrite('text/fr.json', (doc) => { doc.texts.rune = { 'peeler-backhand': { name: 'Revers' } }; return doc; });
  await assert.rejects(fetchOfficialData(COMMIT, g), /unknown English mapping/);
});

test('required catalog or locale HTTP403 fails rather than falling back', async () => {
  for (const path of ['weapons.json', 'text/fr.json']) {
    const f = fixture(); f.forbidden = path;
    await assert.rejects(fetchOfficialData(COMMIT, f), /HTTP 403/);
  }
});

test('rejects truncated resources, even when truncated JSON remains valid', async () => {
  const f = fixture(); f.bodies['weapons.json'] = '{}';
  await assert.rejects(fetchOfficialData(COMMIT, f), /bytes mismatch/);
  const g = fixture(); g.bodies['weapons.json'] = '{'; g.index.files[0].bytes = 1;
  await assert.rejects(fetchOfficialData(COMMIT, g), /invalid JSON/);
});

test('rejects duplicate JSON keys before parse can hide them', async () => {
  const f = fixture();
  f.bodies['weapons.json'] = f.bodies['weapons.json'].replace('"value":3', '"value":1,"value":3');
  f.index.files[0].bytes = Buffer.byteLength(f.bodies['weapons.json']);
  await assert.rejects(fetchOfficialData(COMMIT, f), /duplicate key value/);
});

test('rejects unknown schemas, unsafe paths, duplicate paths/locales, and missing catalog paths', async () => {
  for (const mutate of [
    (i) => { i.schema = 2; },
    (i) => { i.files[0].path = '../weapons.json'; },
    (i) => { i.files[0].path = 'new-type.json'; },
    (i) => { i.files.push(i.files[0]); },
    (i) => { i.locales.push(i.locales[0]); },
    (i) => { i.files.shift(); },
    (i) => { i.locales[0].file = 'https://example.com/en.json'; },
  ]) {
    const f = fixture(); mutate(f.index);
    await assert.rejects(fetchOfficialData(COMMIT, f), /official data:/);
  }
});

test('rejects wrong catalog kind/IDs, malformed shapes, English mismatch and unknown text types or translation IDs', async () => {
  for (const [path, mutate] of [
    ['weapons.json', (d) => { d.kind = 'items'; return d; }],
    ['weapons.json', (d) => { d.entries.sample.id = 'other'; return d; }],
    ['weapons.json', (d) => { d.entries.sample.def = []; return d; }],
    ['weapons.json', (d) => { d.entries.sample.def.id = 'sample'; return d; }],
    ['weapons.json', (d) => { d.entries.sample.name = 'Incorrect'; return d; }],
    ['text/en.json', (d) => { d.texts.unknownType = {}; return d; }],
    ['text/en.json', (d) => { delete d.texts.weapon.sample; return d; }],
    ['text/fr.json', (d) => { d.locale = 'en'; return d; }],
    ['text/fr.json', (d) => { d.texts.weapon.wrong = { name: 'No' }; return d; }],
  ]) {
    const f = fixture(); f.rewrite(path, mutate);
    await assert.rejects(fetchOfficialData(COMMIT, f), /official data:/);
  }
});

test('apply maps duplicate array views and POI kind IDs without changing wiki shape, function fields or untranslated fields', () => {
  const f = fixture();
  f.dumped.registry.allWeapons[0].nested.calculate = '[fn]';
  const before = structuredClone(f.dumped);
  const result = applyOfficialData(f.dumped, f.official);
  assert.deepEqual(result, before);
  assert.deepEqual(f.dumped, before);
  assert.notEqual(result.registry.allWeapons[0], f.dumped.registry.allWeapons[0]);
  assert.notEqual(result.registry.allWeapons[0].nested, f.official.catalogs.weapons.entries.sample.def.nested);
  assert.equal(result.registry.pois[0].kind, 'sample');
  assert.ok(!('id' in result.registry.pois[0]));
  assert.equal(result.registry.weapon, '[fn]');
  assert.equal(result.registry.allWeapons[0].nested.calculate, '[fn]');
  assert.deepEqual(result.content['content.setRule.sample.desc'], ['Gain ', ['gain'], '%.']);
  assert.deepEqual(result.content['content.untranslated.sample.name'], ['Not exported']);
});

test('apply preserves string boss order, missing optional aliases and function-valued aliases', () => {
  const f = fixture();
  f.dumped.registry.bossOrder = ['sample'];
  delete f.dumped.registry.evolutions;
  f.dumped.registry.evolvedItems = '[fn]';
  assert.deepEqual(applyOfficialData(f.dumped, f.official), f.dumped);
  f.dumped.registry.bossOrder = ['wrong'];
  assert.throws(() => applyOfficialData(f.dumped, f.official), /unmapped ID/);
  f.dumped.registry.bossOrder = ['sample', 'sample'];
  assert.throws(() => applyOfficialData(f.dumped, f.official), /duplicate ID/);
  f.dumped.registry.bossOrder = [];
  assert.throws(() => applyOfficialData(f.dumped, f.official), /unmapped official/);
});

test('apply fails on definition mismatch in any array view, duplicate IDs, ID list drift and unmapped definitions', () => {
  for (const mutate of [
    (f) => { f.dumped.registry.baseWeapons[0].value++; },
    (f) => { f.dumped.registry.allWeapons.push(f.dumped.registry.allWeapons[0]); },
    (f) => { f.dumped.registry.bossIds = ['wrong']; },
    (f) => { f.dumped.registry.pois[0].kind = 'wrong'; },
    (f) => { f.dumped.registry.allWeapons = []; },
    (f) => { f.official.catalogs.weapons.entries.sample.def.extra = true; },
    (f) => { f.dumped.registry.allWeapons[0].nested.count = '[fn]'; },
  ]) {
    const f = fixture(); mutate(f);
    assert.throws(() => applyOfficialData(f.dumped, f.official), /mismatch|duplicate|IDs differ|unmapped/);
  }
});

test('apply fails on English mismatch, unmapped content and unsupported compiled messages', () => {
  for (const mutate of [
    (f) => { f.dumped.content['content.weapon.sample.name'] = ['Wrong']; },
    (f) => { delete f.dumped.content['content.weapon.sample.name']; },
    (f) => { f.dumped.content['content.setRule.sample.desc'] = [[1, 'gain']]; },
    (f) => { f.official.text.en.texts.gear = { unknown: { name: 'No mapping' } }; },
  ]) {
    const f = fixture(); mutate(f);
    assert.throws(() => applyOfficialData(f.dumped, f.official), /English mismatch|unmapped|unsupported compiled/);
  }
});
