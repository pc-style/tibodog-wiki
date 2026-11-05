import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { extractChangelog, compareChangelog } from './dump-changelog.mjs';

// Declaration order intentionally differs from render order; ties use the game's own comparator.
const journalSource = 'function g(a,b){return a.added===b.added?(a.id<b.id?-1:1):(a.added<b.added?-1:1)}function k(kind,text){return{kind,text}}function y(id,n){return{...n,id}}var u=[{id:`z`,added:`2026-11-04`,note:()=>k(`ui`,o._({id:`Z`,message:[`Last`]}))},{id:`b`,added:`2026-11-03`,note:()=>k(`balance`,o._({id:`B`,message:[`Second`]}))},{id:`a`,added:`2026-11-03`,note:()=>k(`fix`,o._({id:`A`,message:[`First`]}))}],h=[function(){return{date:`2026-11-01`,waves:[{version:`123abcd`,lines:[k(`art`,o._({id:`OLD`,message:[`Older`]}))]}]}}];u.toSorted(g).map(n=>y(n.id,n.note()));var d=[{date:`2026-11-04`,waves:[{version:`456abcd`,lines:[y(`new`,k(`weapon`,o._({id:`NEW`,message:[`Newest dated`]})))]}]},...h.map(n=>n())];';

test('journal extraction preserves all days, render sorting, text and source provenance', () => {
  const root = mkdtempSync(join(tmpdir(), 'wiki-journal-'));
  try {
    const chunk = 'changelog-panel-fixture1.js';
    writeFileSync(join(root, chunk), journalSource);
    const result = extractChangelog(root, 'main-fixture1.js');
    assert.deepEqual(result.unreleased.map((l) => l.text), ['First', 'Second', 'Last']);
    assert.deepEqual(result.days.map((d) => [d.date, d.waves[0].version, d.waves[0].lines[0].text]), [
      ['2026-11-04', '456abcd', 'Newest dated'], ['2026-11-01', '123abcd', 'Older'],
    ]);
    assert.deepEqual(result.source, { url: `https://tibo.dog/assets/${chunk}`, sha256: createHash('sha256').update(journalSource).digest('hex') });
    writeFileSync(join(root, chunk), journalSource.replace('id:`NEW`', 'id:`OLD`'));
    assert.throws(() => extractChangelog(root, 'main-fixture1.js'), /duplicate note msgId/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('journal comparison reports omissions, revisions, metadata, grouping and order, ignoring extraction dates', () => {
  const before = { unreleased: [{ id: 'a', msgId: 'A', kind: 'ui', text: 'First' }, { msgId: 'B', kind: 'fix', text: 'Second' }], days: [{ date: '2026-11-01', waves: [{ version: '123abcd', lines: [] }] }] };
  const after = structuredClone(before);
  after.extracted = 'tomorrow';
  assert.deepEqual(compareChangelog(before, after), []);
  after.unreleased.reverse();
  assert.equal(compareChangelog(before, after).length, 2);
  after.unreleased = [];
  after.days[0].waves[0].lines = [{ ...before.unreleased[0], text: 'Revised', kind: 'balance', msgId: 'A2' }];
  after.days[0].date = '2026-11-02';
  const changes = compareChangelog(before, after);
  assert.equal(changes.find((c) => c.id === 'B').type, 'removed');
  const moved = changes.find((c) => c.id === 'a');
  assert.equal(moved.before.version, 'next');
  assert.equal(moved.after.version, '123abcd');
  assert.equal(moved.after.line.text, 'Revised');
  assert.equal(moved.after.line.kind, 'balance');
  assert.ok(changes.some((c) => c.type === 'date/version groups changed'));
  assert.equal(compareChangelog(after, before).find((c) => c.id === 'B').type, 'added');
});

test('quote repair updates prose source labels even when the quoted code is unchanged', () => {
  const root = mkdtempSync(join(tmpdir(), 'wiki-quotes-'));
  try {
    for (const dir of ['dist', 'pages', 'data/prose/weapons', 'assets']) mkdirSync(join(root, dir), { recursive: true });
    const old = '[sim-previous.js: `damage:22`]';
    const current = '[sim-current1.js: `damage:22`]';
    writeFileSync(join(root, 'assets/sim-current1.js'), 'export default {damage:22}');
    writeFileSync(join(root, 'dist/lance.md'), old);
    writeFileSync(join(root, 'data/prose/weapons/lance.md'), old);
    writeFileSync(join(root, 'data/mechanics-notes.md'), old);
    execFileSync(process.execPath, [new URL('./check-quotes.mjs', import.meta.url).pathname, join(root, 'assets'), '--write'], { cwd: root });
    assert.equal(readFileSync(join(root, 'data/prose/weapons/lance.md'), 'utf8'), current);
    assert.equal(readFileSync(join(root, 'data/mechanics-notes.md'), 'utf8'), old);
    writeFileSync(join(root, 'dist/lance.md'), current);
    // Another chunk with the same prefix must not override the exact named source.
    writeFileSync(join(root, 'assets/sim-wrapper1.js'), 'export default "wrapper"');
    const result = execFileSync(process.execPath, [new URL('./check-quotes.mjs', import.meta.url).pathname, join(root, 'assets')], { cwd: root, encoding: 'utf8' });
    assert.match(result, /unchanged: 1, renamed: 0, moved: 0, unresolved: 0/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('moved quotes retain their text and change only their own source label', () => {
  const root = mkdtempSync(join(tmpdir(), 'wiki-moved-quotes-'));
  try {
    for (const dir of ['dist', 'pages', 'data/prose', 'assets']) mkdirSync(join(root, dir), { recursive: true });
    const quote = 'cache:`no-store`,credentials:`omit`';
    writeFileSync(join(root, 'assets/boot-current1.js'), 'otherCode');
    writeFileSync(join(root, 'assets/replay-current1.js'), quote);
    writeFileSync(join(root, 'dist/modes.md'), `[boot-current1.js: \`\` ${quote} \`\`]`);
    writeFileSync(join(root, 'pages/modes.mjs'), `citeCode(BOOT, '${quote}')\n[boot-current1.js: \`otherCode\`]`);
    writeFileSync(join(root, 'data/prose/modes.md'), `[boot-current1.js: \`\` ${quote} \`\`]`);
    execFileSync(process.execPath, [new URL('./check-quotes.mjs', import.meta.url).pathname, join(root, 'assets'), '--write'], { cwd: root });
    assert.equal(readFileSync(join(root, 'pages/modes.mjs'), 'utf8'), `citeCode('replay-current1.js', '${quote}')\n[boot-current1.js: \`otherCode\`]`);
    assert.equal(readFileSync(join(root, 'data/prose/modes.md'), 'utf8'), `[replay-current1.js: \`\` ${quote} \`\`]`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('extracts boss definitions and encounter order from either registry layout', () => {
  const root = mkdtempSync(join(tmpdir(), 'wiki-dump-'));
  try {
    writeFileSync(join(root, 'package.json'), '{"type":"module"}');
    writeFileSync(join(root, 'content.js'), 'export default {"content.boss.first.name":["First"]}');
    for (const split of [false, true]) {
      const defs = '[{id:"first",hp:650},{id:"second",hp:9000}]';
      const bosses = `{boss:()=>{},bosses:${defs},bossOrder:[${defs}[1],${defs}[0]]}`;
      writeFileSync(join(root, 'boot.js'), `export default {weapon:()=>{},allWeapons:[],${split ? 'bossIds:["first","second"]' : `...${bosses}`}}`);
      writeFileSync(join(root, 'sim.js'), `const defaults={alive:1,floorShare:0,shotPuddleSec:1},levels={easy:{...defaults,alive:.8}}; export default ${split ? bosses : '{}'};`);
      execFileSync(process.execPath, [new URL('./dump-build.mjs', import.meta.url).pathname, root, 'boot.js', 'sim.js', 'content.js', join(root, 'out')]);
      const registry = JSON.parse(readFileSync(join(root, 'out', 'registry.json')));
      assert.deepEqual(registry.bosses, [{ id: 'first', hp: 650 }, { id: 'second', hp: 9000 }]);
      assert.deepEqual(registry.bossOrder.map((b) => b.id), ['second', 'first']);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

for (const scenario of [
  { name: 'resumes review of the documented build', pending: 'main-current1.js' },
  { name: 'does not erase an interrupted review with --force', pending: 'main-current1.js', force: true },
  { name: 'keeps older unreviewed builds visible', pending: 'main-previous.js' },
  { name: 'reports up-to-date only when all builds are reviewed' },
  { name: 'detects a dropped journal note even when the game build is unchanged', drift: true },
]) {
  test(scenario.name, () => {
    const root = mkdtempSync(join(tmpdir(), 'wiki-update-'));
    try {
      mkdirSync(join(root, 'tools'));
      mkdirSync(join(root, 'data'));
      const cache = join(root, '.cache', 'main-current1');
      mkdirSync(join(cache, 'assets'), { recursive: true });
      copyFileSync(new URL('./update.mjs', import.meta.url), join(root, 'tools', 'update.mjs'));
      copyFileSync(new URL('./dump-changelog.mjs', import.meta.url), join(root, 'tools', 'dump-changelog.mjs'));
      writeFileSync(join(cache, 'assets', 'changelog-panel-fixture1.js'), journalSource);
      const journal = extractChangelog(join(cache, 'assets'), 'main-current1.js');
      if (scenario.drift) journal.unreleased.pop();
      writeFileSync(join(root, 'data', 'changelog.json'), JSON.stringify(journal));
      writeFileSync(join(root, 'tools', 'fetch-build.mjs'), `export async function mirror() {
        return { main: 'main-current1.js', dir: ${JSON.stringify(join(cache, 'assets'))} };
      }`);
      writeFileSync(join(root, 'data', 'build.json'), JSON.stringify({ main: 'main-current1.js' }));
      const history = scenario.pending
        ? [{ main: scenario.pending, status: 'unreviewed' }]
        : [{ main: 'main-current1.js', status: 'reviewed' }];
      if (scenario.pending && scenario.pending !== 'main-current1.js') {
        history.push({ main: 'main-current1.js', status: 'reviewed' });
      }
      writeFileSync(join(root, 'data', 'builds.json'), JSON.stringify(history));
      const report = '# Original review\nDiff against the last reviewed build.\n';
      writeFileSync(join(cache, 'report.md'), report);
      const output = execFileSync(process.execPath, [join(root, 'tools', 'update.mjs'), '--apply', ...(scenario.force ? ['--force'] : [])], { encoding: 'utf8' });
      assert.match(output, new RegExp(`status: ${scenario.pending || scenario.drift ? 'needs-review' : 'up-to-date'}\\n$`));
      if (scenario.pending) assert.ok(output.includes(scenario.pending));
      assert.equal(readFileSync(join(cache, 'report.md'), 'utf8'), report);
      assert.deepEqual(JSON.parse(readFileSync(join(root, 'data', 'builds.json'), 'utf8')), history);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}

test('crops additional weapon icons from the flagged atlas without replacing early icons', () => {
  const root = mkdtempSync(join(tmpdir(), 'wiki-icons-'));
  try {
    const frame = { x: 0, y: 0, w: 2, h: 1 };
    const sprite = { icon: { frames: [frame] } };
    const early = { sprites: { 'icon-old': sprite }, pixelSize: {} };
    const flagged = { sprites: { 'icon-old': sprite, 'icon-new': sprite }, pixelSize: { 'icon-new': 0.5 } };
    writeFileSync(join(root, 'atlas-early.json'), JSON.stringify(early));
    writeFileSync(join(root, 'atlas-late.json'), JSON.stringify({ sprites: {}, pixelSize: {} }));
    writeFileSync(join(root, 'atlas-flagged.json'), JSON.stringify(flagged));
    const registry = { allWeapons: [{ id: 'old' }, { id: 'new' }], passives: [], allItems: [], enemies: [], bosses: [], dogs: [] };
    writeFileSync(join(root, 'registry.json'), JSON.stringify(registry));
    execFileSync('python3', ['-I', '-c', `
from PIL import Image
import sys
Image.new('RGBA', (2, 1), (255, 0, 0, 255)).save(sys.argv[1]+'/early.png')
Image.new('RGBA', (2, 1), (0, 0, 0, 0)).save(sys.argv[1]+'/late.png')
Image.new('RGBA', (2, 1), (0, 255, 0, 255)).save(sys.argv[1]+'/flagged.png')
`, root]);
    const pages = { early: 'early.png', late: 'late.png' };
    const crop = () => {
      writeFileSync(join(root, 'pages.json'), JSON.stringify(pages));
      execFileSync('python3', [new URL('./icons.py', import.meta.url).pathname, root, root, join(root, 'registry.json'), join(root, 'out')]);
      return JSON.parse(readFileSync(join(root, 'out', 'manifest.json')));
    };
    const before = crop();
    assert.deepEqual(Object.keys(before.weapon), ['old']);
    assert.equal(before.missing[0].id, 'new');
    pages.flagged = 'flagged.png';
    const after = crop();
    assert.deepEqual(after.missing, []);
    assert.deepEqual(Object.keys(after.weapon), ['old', 'new']);
    assert.equal(after.weapon.old.w, 8);
    assert.equal(after.weapon.new.w, 4);
    assert.equal(after.weapon.new.h, 2);
    execFileSync('python3', ['-I', '-c', `
from PIL import Image
import sys
assert Image.open(sys.argv[1]+'/out/weapon/old.png').getpixel((0,0)) == (255,0,0,255)
assert Image.open(sys.argv[1]+'/out/weapon/new.png').getpixel((0,0)) == (0,255,0,255)
`, root]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
