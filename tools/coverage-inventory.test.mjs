import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createInventory, coverageMarkdown } from './coverage-inventory.mjs';

const hash = (s) => createHash('sha256').update(s).digest('hex');
function fixture() {
  const registry = Object.fromEntries(['allWeapons', 'passives', 'allItems', 'enemies', 'bosses', 'dogs', 'biomes', 'events', 'pois', 'botHelps'].map((k) => [k, []]));
  registry.allWeapons = ['explained', 'table-only', 'recipe-only', 'new-attack'].map((id) => ({ id, behavior: { kind: 'shot' } }));
  registry.passives = [{ id: 'flat', stat: 'maxHp' }, { id: 'conditional', stat: 'maxHp', effect: { kind: 'onHurt' } }];
  registry.enemies = [{ id: 'family-pest', behavior: { kind: 'chase' } }];
  registry.botHelps = [{ id: 'helper', help: { kind: 'shield' } }];
  const config = { renamedExport: [{ set: 'gear-set', rule: { kind: 'ruleKind' } }] };
  const pages = [
    ...registry.allWeapons.map((w) => ({ path: `/weapons/${w.id}`, title: w.id, body: '## Behaviour parameters\n\nRaw data, not an explanation.' })),
    ...registry.passives.map((p) => ({ path: `/passives/${p.id}`, title: p.id, body: '## Levels\n\nGenerated totals.' })),
    { path: '/enemies/family-pest', title: 'Family pest', body: 'See [family](/endgame#hunt).' },
    { path: '/stats', body: '## Stat conversion\n\nShared formulas.' },
    { path: '/grok-bots', body: '| Bot | Help | Parameters |\n| Bubble | Shields Tibo | `{"kind":"shield"}` |' },
    { path: '/modes', body: '## Gear set rules\n\n| Gear Set — Rule | Clears nearby shots. [sim-12345678.js: `` kind:`ruleKind` ``] |\n\nOriginal-engine controls ran a named set and checked its cap.' },
  ];
  const files = {
    'data/prose/weapons/explained.md': '## How it works\n\nHits the nearest target twice, not each target once.\n\n**Measured** in `main-12345678.js`, supplied targets, seed `wiki`: two hits.',
    'data/prose/weapons/table-only.md': '## How it works\n\n| Field | Value |\n|---|---|\n| count | 2 |\n\n```json\n{"count":2}\n```',
    'data/prose/weapons/recipe-only.md': '## Evolution\n\nMax this weapon and open a chest.',
    'tools/scenario.mjs': 'assert.equal(result.hits, 2);',
  };
  return { registry, config, pages, build: { main: 'main-87654321.js', commit: 'abcdef1' }, readFile: (p) => files[p] ?? null, files };
}

test('inventory counts actual ownership, not files, raw tables, recipe prose or broad gear mentions', () => {
  const f = fixture();
  const result = createInventory(f);
  const entry = (key) => result.entries.find((e) => e.key === key);
  assert.equal(entry('weapon:explained').explanation.status, 'present');
  for (const id of ['table-only', 'recipe-only', 'new-attack']) assert.equal(entry(`weapon:${id}`).explanation.status, 'missing');
  assert.equal(entry('passive:flat').explanation.status, 'generated-stat');
  assert.equal(entry('passive:conditional').explanation.status, 'missing');
  assert.equal(entry('enemy:family-pest').explanation.status, 'partial');
  assert.equal(entry('botHelp:helper').explanation.status, 'shared');
  assert.equal(entry('gear:gear-set').explanation.status, 'shared');
  assert.equal(entry('gear:gear-set').measurements.length, 0, 'a global report must not silently cover every gear rule');
  assert.deepEqual(entry('weapon:explained').measurements[0].builds, ['main-12345678']);
  assert.equal(result.summary.total, 9);
  assert.equal(result.summary.missing, 4);
  assert.equal(result.summary.partial, 1);
  assert.match(coverageMarkdown(result), /4 missing explanations; 1 partial entries/);
  f.config.renamedExport.push({ set: 'new-set', rule: { kind: 'ruleKind' } });
  const next = createInventory(f);
  assert.equal(next.summary.total, 10);
  assert.equal(next.entries.find((e) => e.key === 'gear:new-set').explanation.status, 'missing');
});

test('scenario evidence stays revision-bound and missing or orphaned evidence fails checks', () => {
  const f = fixture();
  f.evidence = { scenarios: { 'weapon:explained': [{ file: 'tools/scenario.mjs', main: f.build.main,
    definitionSha256: hash(JSON.stringify(f.registry.allWeapons[0])), scriptSha256: hash(f.files['tools/scenario.mjs']) }] },
    reports: [{ keys: ['gear:gear-set'], path: '/modes', startsWith: 'Original-engine controls ran a named set', scope: 'Only the named rule, historical supplied state' }] };
  let result = createInventory(f);
  assert.equal(result.entries[0].scenarios[0].status, 'recorded-current');
  assert.equal(result.entries.at(-1).measurements.length, 1);
  f.build.main = 'main-00000000.js';
  assert.equal(createInventory(f).entries[0].scenarios[0].status, 'needs-rerun');
  f.build.main = 'main-87654321.js';
  f.registry.allWeapons[0].behavior.kind = 'cone';
  assert.equal(createInventory(f).entries[0].scenarios[0].status, 'needs-rerun');
  f.registry.allWeapons[0].behavior.kind = 'shot';
  f.files['tools/scenario.mjs'] += '\n// changed test';
  assert.equal(createInventory(f).entries[0].scenarios[0].status, 'needs-rerun');
  delete f.files['tools/scenario.mjs'];
  assert.throws(() => createInventory(f), /missing scenario/);
  f.evidence = { scenarios: { 'weapon:gone': [] } };
  assert.throws(() => createInventory(f), /removed\/unknown weapon:gone/);
  f.evidence = { reports: [{ keys: ['gear:gear-set'], path: '/modes', startsWith: 'Removed evidence' }] };
  assert.throws(() => createInventory(f), /missing shared measurement/);
});

test('dog families use promoted tricks rather than fallback abilities', () => {
  const f = fixture();
  f.registry.dogs = [{ id: 'howler', ability: { kind: 'fetch' }, trick: { kind: 'howl' } }];
  f.pages.push({ path: '/dogs/howler', title: 'Howler', body: '' });
  assert.equal(createInventory(f).entries.find((e) => e.key === 'dog:howler').family, 'howl');
});

test('rune catalog presence stays partial and does not inherit its weapon combat measurements', () => {
  const f = fixture();
  f.registry.runes = [{ id: 'explained-target', weapon: 'explained', axis: 'target', effects: [{ kind: 'toughest' }] }];
  f.pages[0].body += '\n## Weapon runes\n\n| Rune | Effect |\n| Target | Biggest pest |';
  const rune = createInventory(f).entries.find((e) => e.key === 'rune:explained-target');
  assert.equal(rune.path, '/weapons/explained#weapon-runes');
  assert.equal(rune.family, 'target/toughest');
  assert.equal(rune.explanation.status, 'partial');
  assert.deepEqual(rune.measurements, []);
  assert.deepEqual(rune.scenarios, []);
  f.pages[0].body = '';
  assert.throws(() => createInventory(f), /missing rune section/);
});
