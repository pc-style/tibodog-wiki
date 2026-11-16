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
  const result = localizedTextExport(fetched, f.dumped);
  assert.equal(result.game.commit, COMMIT);
  assert.equal(result.simVersion, 'simulation-1');
  assert.deepEqual(result.locales, f.index.locales);
  assert.equal(result.text.fr.weapon.sample.desc, 'بطاطا {gain}% 🥔');
  assert.equal(result.text.en.setRule.sample.desc, 'Gain {gain}%.');
  assert.equal(result.text.fr.item, undefined, 'do not invent English fallbacks in upstream exports');
  assert.equal(result.sources.locales.fr.sha256, createHash('sha256').update(f.bodies['text/fr.json']).digest('hex'));
  const reordered = { ...fetched, text: { fr: fetched.text.fr, en: fetched.text.en },
    provenance: { ...fetched.provenance, fetchedAt: 'another fetch time' } };
  assert.equal(JSON.stringify(localizedTextExport(reordered, f.dumped)), JSON.stringify(result));
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
  f.dumped.content['content.rune.peeler-backhand.name'] = ['Backhand'];
  f.dumped.content['content.rune.peeler-backhand.desc'] = ['Slashes bat bullets back.'];
  assert.throws(() => applyOfficialData(f.dumped, result), /registry.runes: English IDs differ/);
  f.dumped.registry.runes = [{ id: 'peeler-backhand', weapon: 'sample', axis: 'target', effects: [] }];
  assert.deepEqual(localizedTextExport(result, f.dumped).text.fr.rune, { 'peeler-backhand': { name: 'Revers' } });
  assert.equal(localizedTextExport(result, f.dumped).text.en.rune['peeler-backhand'].desc, 'Slashes bat bullets back.');
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

test('optional weapon text and localization-only IDs survive without catalog or registry promotion', async () => {
  const f = fixture();
  const extra = { name: 'Unregistered text', desc: 'Keeps {gain}% 🥔.', where: 'A source string, not a verified acquisition rule.' };
  f.rewrite('text/en.json', (doc) => {
    doc.texts.weapon.sample.where = 'Optional registered-weapon text';
    doc.texts.weapon['text-only'] = extra;
    return doc;
  });
  f.rewrite('text/fr.json', (doc) => {
    doc.texts.weapon['text-only'] = { name: 'Texte seulement', where: 'Garde {gain}%.' };
    return doc;
  });
  f.dumped.content['content.weapon.sample.where'] = ['Optional registered-weapon text'];
  for (const [field, value] of Object.entries(extra)) {
    f.dumped.content[`content.weapon.text-only.${field}`] = field === 'desc' ? ['Keeps ', ['gain'], '% 🥔.'] : [value];
  }
  const fetched = await fetchOfficialData(COMMIT, f);
  const imported = applyOfficialData(f.dumped, fetched);
  assert.deepEqual(imported, f.dumped);
  assert.deepEqual(Object.keys(fetched.catalogs.weapons.entries), ['sample']);
  assert.deepEqual(imported.registry.allWeapons.map((w) => w.id), ['sample']);
  assert.equal(fetched.catalogs.weapons.entries.sample.where, undefined);
  const exported = localizedTextExport(fetched, f.dumped);
  assert.deepEqual(exported.text.en.weapon['text-only'], extra);
  assert.equal(exported.text.en.weapon.sample.where, 'Optional registered-weapon text');
  assert.deepEqual(exported.text.fr.weapon['text-only'], { name: 'Texte seulement', where: 'Garde {gain}%.' });
  assert.equal(exported.text.fr.weapon.sample.where, undefined);

  for (const id of ['sample', 'text-only']) {
    for (const bad of [undefined, ['Wrong source'], [[1, 'gain']]]) {
      const dumped = structuredClone(f.dumped);
      if (bad === undefined) delete dumped.content[`content.weapon.${id}.where`];
      else dumped.content[`content.weapon.${id}.where`] = bad;
      assert.throws(() => applyOfficialData(dumped, fetched), /unmapped English|English mismatch|unsupported compiled/);
      assert.throws(() => localizedTextExport(fetched, dumped), /unmapped English|English mismatch|unsupported compiled/);
    }
  }
  assert.throws(() => localizedTextExport(fetched), /dumped/);
  const promoted = structuredClone(fetched);
  promoted.catalogs.weapons.entries['text-only'] = { ...extra, id: 'text-only', def: {} };
  delete promoted.catalogs.weapons.entries['text-only'].where;
  assert.throws(() => applyOfficialData(f.dumped, promoted), /unmapped official/);
});

test('weapon text extensions still reject missing registered English, unsupported values and invalid translated mappings', async () => {
  for (const id of ['sample', 'text-only']) {
    for (const fields of [{ name: 7, desc: 'Text' }, { name: 'Text', desc: null },
      { name: 'Text', desc: 'Text', where: ['Array'] }, { name: 'Text', desc: 'Text', where: {} },
      { name: 'Text', desc: 'Text', damage: 'Unknown' }, {}, []]) {
      const f = fixture();
      f.rewrite('text/en.json', (doc) => { doc.texts.weapon[id] = fields; return doc; });
      await assert.rejects(fetchOfficialData(COMMIT, f), /official data:/);
    }
  }
  for (const mutate of [
    (doc) => { delete doc.texts.weapon.sample.name; },
    (doc) => { delete doc.texts.weapon.sample.desc; },
    (doc) => { doc.texts.weapon = { 'text-only': { name: 'Text', desc: 'Text' } }; },
  ]) {
    const f = fixture();
    f.rewrite('text/en.json', (doc) => { mutate(doc); return doc; });
    await assert.rejects(fetchOfficialData(COMMIT, f), /official data:/);
  }
  for (const [id, fields] of [['sample', { where: 'No English field' }],
    ['text-only', { name: 'No English ID' }], ['sample', { name: 7 }]]) {
    const f = fixture();
    f.rewrite('text/fr.json', (doc) => { doc.texts.weapon[id] = fields; return doc; });
    await assert.rejects(fetchOfficialData(COMMIT, f), /unknown English mapping|invalid fields/);
  }
  const f = fixture();
  f.rewrite('weapons.json', (doc) => { doc.entries.sample.where = 'Not a catalog field'; return doc; });
  await assert.rejects(fetchOfficialData(COMMIT, f), /unknown field where/);
});

test('enemy hints and text-only IDs stay source-bound without playable catalog promotion', async () => {
  const f = fixture();
  const extra = { name: 'Gilded Magpie', where: 'Calls {count} birds.' };
  f.rewrite('text/en.json', (doc) => {
    doc.texts.enemy.sample.where = 'Optional registered hint';
    doc.texts.enemy['text-only'] = extra;
    return doc;
  });
  f.rewrite('text/fr.json', (doc) => {
    doc.texts.enemy = { 'text-only': { where: 'Appelle {count} oiseaux.' } };
    return doc;
  });
  f.dumped.content['content.enemy.sample.where'] = ['Optional registered hint'];
  f.dumped.content['content.enemy.text-only.name'] = ['Gilded Magpie'];
  f.dumped.content['content.enemy.text-only.where'] = ['Calls ', ['count'], ' birds.'];
  const fetched = await fetchOfficialData(COMMIT, f);
  assert.deepEqual(applyOfficialData(f.dumped, fetched), f.dumped);
  const exported = localizedTextExport(fetched, f.dumped);
  assert.deepEqual(exported.text.en.enemy['text-only'], extra);
  assert.deepEqual(exported.text.fr.enemy, { 'text-only': { where: 'Appelle {count} oiseaux.' } });
  assert.equal(exported.text.en.enemy.sample.where, 'Optional registered hint');
  assert.deepEqual(Object.keys(fetched.catalogs.enemies.entries), ['sample']);
  assert.deepEqual(f.dumped.registry.enemies.map((e) => e.id), ['sample']);
  assert.equal(fetched.catalogs.enemies.entries.sample.where, undefined);
  for (const id of ['sample', 'text-only']) for (const bad of [undefined, ['Wrong'], [[1, 'count']]]) {
    const dumped = structuredClone(f.dumped);
    if (bad === undefined) delete dumped.content[`content.enemy.${id}.where`];
    else dumped.content[`content.enemy.${id}.where`] = bad;
    assert.throws(() => applyOfficialData(dumped, fetched), /unmapped English|English mismatch|unsupported compiled/);
    assert.throws(() => localizedTextExport(fetched, dumped), /unmapped English|English mismatch|unsupported compiled/);
  }
  const promoted = structuredClone(fetched);
  promoted.catalogs.enemies.entries['text-only'] = { id: 'text-only', name: extra.name, def: {} };
  assert.throws(() => applyOfficialData(f.dumped, promoted), /unmapped official/);
  assert.throws(() => localizedTextExport(promoted, f.dumped), /unmapped official/);
  for (const [path, mutate] of [
    ['text/en.json', (d) => { delete d.texts.enemy.sample; }],
    ['text/en.json', (d) => { d.texts.enemy.sample = { where: 'Missing name' }; }],
    ['text/en.json', (d) => { d.texts.enemy.sample.where = ['Not a string']; }],
    ['text/en.json', (d) => { d.texts.enemy['text-only'] = { name: 'Name', damage: 'Unknown' }; }],
    ['text/fr.json', (d) => { d.texts.enemy = { sample: { where: 'Missing English field' } }; }],
    ['text/fr.json', (d) => { d.texts.enemy = { unknown: { name: 'Unknown English ID' } }; }],
    ['enemies.json', (d) => { d.entries.sample.where = 'Not a catalog field'; }],
    ['text/en.json', (d) => { d.texts.boss['text-only'] = { name: 'No', title: 'No', desc: 'No' }; }],
  ]) {
    const g = fixture();
    g.rewrite(path, (d) => { mutate(d); return d; });
    await assert.rejects(fetchOfficialData(COMMIT, g), /official data:/);
  }
});

test('optional variety-place hints export verbatim only with compiled English equality', async () => {
  const f = fixture();
  f.rewrite('text/en.json', (doc) => {
    doc.texts.varietyPlace = { shrine: { name: 'Shrine', desc: 'Calls birds.', where: 'Beside you.' } };
    return doc;
  });
  f.rewrite('text/fr.json', (doc) => {
    doc.texts.varietyPlace = { shrine: { where: 'À côté de vous.' } };
    return doc;
  });
  for (const [field, value] of Object.entries({ name: 'Shrine', desc: 'Calls birds.', where: 'Beside you.' })) {
    f.dumped.content[`content.varietyPlace.shrine.${field}`] = [value];
  }
  const result = await fetchOfficialData(COMMIT, f);
  assert.deepEqual(applyOfficialData(f.dumped, result), f.dumped);
  assert.deepEqual(localizedTextExport(result, f.dumped).text.fr.varietyPlace.shrine, { where: 'À côté de vous.' });
  for (const bad of [undefined, ['Wrong']]) {
    const dumped = structuredClone(f.dumped);
    if (bad === undefined) delete dumped.content['content.varietyPlace.shrine.where'];
    else dumped.content['content.varietyPlace.shrine.where'] = bad;
    assert.throws(() => applyOfficialData(dumped, result), /unmapped English|English mismatch/);
    assert.throws(() => localizedTextExport(result, dumped), /unmapped English|English mismatch/);
  }
  for (const where of [[], null, 4]) {
    const g = fixture();
    g.rewrite('text/en.json', (doc) => { doc.texts.varietyPlace = { shrine: { where } }; return doc; });
    await assert.rejects(fetchOfficialData(COMMIT, g), /invalid fields/);
  }
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
