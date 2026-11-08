import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { journalGraduation, journalSkeleton, prepareJournalOnly } from './journal-only.mjs';
import { extractChangelog } from './dump-changelog.mjs';
import { journalRows } from './shadow-update.mjs';

const hash = (s) => createHash('sha256').update(s).digest('hex');
const note = 'k(`balance`,o._({id:`A`,message:[`More often, not stronger.`]}))';
const oldNote = 'k(`fix`,o._({id:`OLD`,message:[`Prior note without stable id.`]}))';
const source = (next) => `function k(kind,text){return{kind,text}}function y(id,n){return{...n,id}}function g(a,b){return a.added<b.added?-1:1}var u=[${next ? '' : `{id:\`a\`,added:\`2026-11-07T23:19:38Z\`,note:()=>${note}}`}],h=[function(){return{date:\`2026-11-06\`,waves:[{version:\`111aaaa\`,lines:[${oldNote}]}]}}];u.toSorted(g).map(n=>y(n.id,n.note()));var d=[{date:\`2026-11-07\`,waves:[${next ? `{version:\`222bbbb\`,lines:[y(\`a\`,${note})]},` : ''}{version:\`000aaaa\`,lines:[k(\`ui\`,o._({id:\`UI\`,message:[\`Other dated note.\`]}))]}]},...h.map(n=>n())];`;

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'journal-only-'));
  const beforeRoot = join(root, 'main-oldbuild'), afterRoot = join(root, 'main-newbuild'), evidence = join(root, 'evidence');
  mkdirSync(evidence);
  const receipt = { status: 'complete', stages: [{ name: 'browser:new', status: 'passed' }], binding: { builds: {} }, artifacts: {} };
  const artifact = (name, value) => { const bytes = JSON.stringify(value); writeFileSync(join(evidence, name), bytes); receipt.artifacts[name] = hash(bytes); return bytes; };
  for (const [dir, next, key] of [[beforeRoot, false, 'old'], [afterRoot, true, 'new']]) {
    mkdirSync(join(dir, 'assets'), { recursive: true });
    const files = { 'changelog-panel-fixture1.js': source(next), 'boot-fixture1.js': 'export{}', 'sim-fixture1.js': 'export{}', 'i18n-en-content-fixture1.js': 'export{}' };
    const html = '<script src="/assets/changelog-panel-fixture1.js"></script><script src="/assets/boot-fixture1.js"></script><script src="/assets/sim-fixture1.js"></script><script src="/assets/i18n-en-content-fixture1.js"></script>';
    writeFileSync(join(dir, 'index.html'), html);
    for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, 'assets', name), text);
    const journal = extractChangelog(join(dir, 'assets'), `main-${next ? 'new' : 'old'}build.js`);
    const manifest = artifact(`${key}-manifest.json`, { main: journal.build, files: Object.entries(files).map(([name, text]) => ({ name, size: Buffer.byteLength(text), sha256: hash(text) })) });
    receipt.binding.builds[key] = { main: journal.build, journal: journal.source, htmlSha256: hash(html), manifest: { sha256: hash(JSON.stringify(JSON.parse(manifest), null, 2)) }, verifiedAssets: 4, gameCommit: '333cccc12345' };
  }
  const before = extractChangelog(join(beforeRoot, 'assets'), 'main-oldbuild.js'), after = extractChangelog(join(afterRoot, 'assets'), 'main-newbuild.js');
  for (const surface of ['panel', 'full']) artifact(`${surface}.json`, { main: after.build, surface, url: `https://tibo.dog/${surface === 'panel' ? '' : 'changelog'}`, rows: journalRows(after, '333cccc'), dates: ['2026-11-07', '2026-11-06'], expanded: ['true', 'true'] });
  const receiptFile = join(evidence, 'receipt.json');
  writeFileSync(receiptFile, JSON.stringify(receipt));
  const history = [{ main: before.build, status: 'reviewed', evidence: 'Mechanic introduced earlier, not today.' }];
  return { root, beforeRoot, afterRoot, before, after, receipt, receiptFile, history, prepare: () => prepareJournalOnly(beforeRoot, afterRoot, receiptFile, history, before) };
}

test('local CLI prepares unchanged-note graduation without approval or publishing and retains history', () => {
  const f = fixture();
  try {
    f.before.extracted = '2026-11-01'; // Extraction time is not publication time.
    const plan = f.prepare();
    assert.equal(plan.automatic, false);
    assert.deepEqual(plan.priorHistory, f.history);
    assert.equal(plan.moved[0].publishedAt, '2026-11-07T23:19:38Z');
    const target = join(f.root, 'checkout');
    mkdirSync(join(target, 'data'), { recursive: true });
    for (const [name, value] of Object.entries({ 'build.json': { main: f.before.build }, 'builds.json': f.history, 'changelog.json': f.before })) writeFileSync(join(target, 'data', name), JSON.stringify(value));
    writeFileSync(join(target, 'data/journal-audit.md'), 'Prior introduction evidence.\n');
    const bodies = {}, registry = {}, content = {}, texts = {};
    for (const [kind, type, primary, fields] of [
      ['weapons', 'weapon', 'allWeapons', ['name', 'desc']], ['passives', 'passive', 'passives', ['name', 'desc']],
      ['items', 'item', 'allItems', ['name', 'desc']], ['enemies', 'enemy', 'enemies', ['name']],
      ['bosses', 'boss', 'bosses', ['name', 'title', 'desc']], ['biomes', 'biome', 'biomes', ['name', 'desc']],
      ['events', 'event', 'events', ['name', 'announce']], ['dogs', 'dog', 'dogs', ['name', 'breed', 'desc']],
      ['pois', 'poi', 'pois', ['name', 'desc']], ['bot-helps', 'botHelp', 'botHelps', ['name', 'desc']],
    ]) {
      const english = Object.fromEntries(fields.map((field) => [field, `${type} ${field}`]));
      bodies[`${kind}.json`] = JSON.stringify({ kind, entries: { sample: { id: 'sample', def: {}, ...english } } });
      registry[primary] = [{ [kind === 'pois' ? 'kind' : 'id']: 'sample' }];
      texts[type] = { sample: english };
      for (const field of fields) content[`content.${type}.sample.${field}`] = [english[field]];
    }
    bodies['text/en.json'] = JSON.stringify({ locale: 'en', texts });
    bodies['index.json'] = JSON.stringify({ schema: 1, game: { version: '333cccc', commit: '333cccc12345'.padEnd(40, 'c') }, simVersion: 'fixture', locales: [{ tag: 'en', endonym: 'English', englishName: 'English', dir: 'ltr', file: 'text/en.json' }], files: Object.entries(bodies).map(([path, body]) => ({ path, bytes: Buffer.byteLength(body) })) });
    writeFileSync(join(target, 'data/registry.json'), JSON.stringify(registry));
    writeFileSync(join(target, 'data/en-content.json'), JSON.stringify(content));
    const requestFile = join(f.root, 'request.mjs'), requestSource = `const bodies=${JSON.stringify(bodies)};globalThis.fetch=async(url)=>{const path=String(url).replace('https://tibo.dog/data/v1/','');if(!Object.hasOwn(bodies,path))throw Error('Unexpected fixture URL');return new Response(bodies[path]);};`;
    writeFileSync(requestFile, requestSource);
    execFileSync('git', ['init', '-q'], { cwd: target });
    execFileSync('git', ['add', '.'], { cwd: target });
    execFileSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'baseline'], { cwd: target });
    const cli = (...extra) => spawnSync(process.execPath, [new URL('./journal-only.mjs', import.meta.url).pathname, f.beforeRoot, f.afterRoot, f.receiptFile, join(f.root, 'proposal'), ...extra], { cwd: target, encoding: 'utf8', env: { ...process.env, NODE_OPTIONS: `--import=${requestFile}`, TIBO_MEASUREMENTS_DIR: join(f.root, 'measurements') } });
    assert.equal(cli('--ship').status, 1);
    assert.equal(cli().status, 0);
    assert.equal(execFileSync('git', ['status', '--porcelain'], { cwd: target, encoding: 'utf8' }), '');
    writeFileSync(requestFile, 'globalThis.fetch=async()=>new Response("unavailable",{status:403});');
    assert.equal(cli('--apply-local').status, 1);
    assert.equal(execFileSync('git', ['status', '--porcelain'], { cwd: target, encoding: 'utf8' }), '');
    writeFileSync(requestFile, requestSource);
    const apply = cli('--apply-local');
    assert.equal(apply.status, 0, apply.stderr);
    const result = JSON.parse(readFileSync(join(target, 'data/builds.json')));
    assert.deepEqual(result.slice(0, -1), f.history);
    assert.equal(result.at(-1).status, 'unreviewed');
    assert.deepEqual(JSON.parse(readFileSync(join(target, 'data/changelog.json'))), f.after);
    assert.match(readFileSync(join(target, 'data/journal-audit.md'), 'utf8'), /^Prior introduction evidence\.[\s\S]*2026-11-07T23:19:38Z/);
    assert.equal(cli('--apply-local').status, 1);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test('near misses retain semantic review and cannot hide missing/duplicate notes or publication changes', () => {
  const f = fixture();
  try {
    for (const mutate of [
      (j) => { j.days[0].waves[0].lines[0].text = 'Stronger, not more often.'; },
      (j) => { j.days[0].waves[0].lines[0].kind = 'fix'; },
      (j) => { j.days[0].waves[0].lines[0].id = 'different'; },
      (j) => { j.days[0].waves[0].lines[0].msgId = 'different'; },
      (j) => { j.days[0].waves[0].lines[0].about = { kind: 'weapon', id: 'peeler' }; },
      (j) => { j.days[0].date = '2026-11-08'; },
      (j) => { j.days[1].waves[0].lines = []; },
      (j) => { j.days[1].waves[0].lines.push(j.days[0].waves[0].lines[0]); },
      (j) => { j.days[1].waves[0].version = 'other'; },
    ]) {
      const after = structuredClone(f.after); mutate(after);
      assert.throws(() => journalGraduation(f.before, after));
    }
    const twoBefore = structuredClone(f.before), twoAfter = structuredClone(f.after);
    twoBefore.unreleased.push({ ...twoBefore.unreleased[0], id: 'b', msgId: 'B', added: '2026-11-07T23:19:39Z' });
    const { added, ...second } = twoBefore.unreleased[1];
    twoAfter.days[0].waves[0].lines.push(second);
    assert.equal(journalGraduation(twoBefore, twoAfter).length, 2);
    twoAfter.days[0].waves[0].lines.reverse();
    assert.throws(() => journalGraduation(twoBefore, twoAfter), /display order/);
    f.history[0].status = 'unreviewed';
    assert.throws(f.prepare, /Unreviewed/);
    f.history[0].status = 'reviewed';
    f.receipt.status = 'failed'; writeFileSync(f.receiptFile, JSON.stringify(f.receipt));
    assert.throws(f.prepare, /browser evidence/);
    f.receipt.status = 'complete'; writeFileSync(f.receiptFile, JSON.stringify(f.receipt));
    const fullFile = join(f.root, 'evidence/full.json'), original = readFileSync(fullFile);
    const full = JSON.parse(original); full.rows.pop();
    const changed = JSON.stringify(full); writeFileSync(fullFile, changed);
    f.receipt.artifacts['full.json'] = hash(changed); writeFileSync(f.receiptFile, JSON.stringify(f.receipt));
    assert.throws(f.prepare, /Ordered journal/);
    writeFileSync(join(f.root, 'evidence/full.json'), '{}');
    assert.throws(f.prepare, /artifact digest/);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test('source proof rejects side effects and retains renderer/helper/other-asset changes', () => {
  const f = fixture();
  try {
    for (const bad of [source(false).replace(`note:()=>${note}`, `note:()=>steal()`), source(false).replace('date:`2026-11-07`', 'get date(){return `2026-11-07`}'), source(false).replace('More often, not stronger.', 'see image-Aaaaaaaa.png')]) assert.throws(() => journalSkeleton(bad));
    assert.notEqual(journalSkeleton(source(false)), journalSkeleton(source(true) + 'changedRenderer()'));
    assert.notEqual(journalSkeleton(source(false)), journalSkeleton(source(true).replace('a.added<b.added', 'a.added>b.added')));
    assert.notEqual(journalSkeleton(source(false)), journalSkeleton(source(true).replace('o._({id:`A`', 'other._({id:`A`')));
    writeFileSync(join(f.afterRoot, 'assets/sim-fixture1.js'), 'hit(999)');
    assert.throws(f.prepare, /Non-journal/);
    writeFileSync(join(f.beforeRoot, 'assets/sim-fixture1.js'), 'hit(999)');
    assert.throws(f.prepare, /Archive asset changed/);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});
