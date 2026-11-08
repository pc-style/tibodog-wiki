import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { journalRows, verifyJournalCapture, verifyFullSnapshot } from './shadow-update.mjs';

const journal = {
  build: 'main-fixture1.js',
  unreleased: [{ id: 'fresh', kind: 'item', text: 'Fresh' }],
  days: [
    { date: '2026-11-07', waves: [{ version: 'oldcode', lines: [{ kind: 'fix', text: 'Fix' }] }] },
    { date: '2026-11-06', waves: [{ version: 'older12', lines: [{ kind: 'ui', text: 'Older' }] }] },
  ],
};

test('journal verifier checks complete ordered records, current code, build and expanded dates', () => {
  const rows = [
    { date: '2026-11-07', version: 'newcode', kind: 'item', text: 'Fresh' },
    { date: '2026-11-07', version: 'oldcode', kind: 'fix', text: 'Fix' },
    { date: '2026-11-06', version: 'older12', kind: 'ui', text: 'Older' },
  ];
  assert.deepEqual(journalRows(journal, 'newcode'), rows);
  const capture = { main: journal.build, surface: 'panel', url: 'http://localhost/', dates: ['2026-11-07', '2026-11-06'], expanded: ['true', 'true'], rows };
  assert.deepEqual(verifyJournalCapture(journal, 'newcode', capture), { records: 3, dates: 2, codes: 3 });
  // agent-browser may serialize object keys alphabetically; only row order matters.
  const reorderedKeys = rows.map(({ date, version, kind, text }) => ({ date, kind, text, version }));
  assert.deepEqual(verifyJournalCapture(journal, 'newcode', { ...capture, rows: reorderedKeys }), { records: 3, dates: 2, codes: 3 });
  assert.deepEqual(verifyJournalCapture(journal, 'newcode', { ...capture, surface: 'full', url: 'http://localhost/changelog', expanded: [] }), { records: 3, dates: 2, codes: 3 });
  for (const mutate of [
    (c) => { c.rows.pop(); },
    (c) => { c.rows.reverse(); },
    (c) => { c.rows[0].version = 'next'; },
    (c) => { c.rows[1].text = 'Changed'; },
    (c) => { c.rows[1].kind = 'balance'; },
    (c) => { c.rows[2].date = '2026-11-05'; },
    (c) => { c.rows.push(c.rows[0]); },
    (c) => { c.dates.reverse(); },
    (c) => { c.expanded[1] = 'false'; },
    (c) => { c.main = 'main-stale123.js'; },
    (c) => { c.url = 'about:blank'; },
    (c) => { c.rows = []; },
  ]) {
    const wrong = structuredClone(capture); mutate(wrong);
    assert.throws(() => verifyJournalCapture(journal, 'newcode', wrong));
  }
});

test('saved full pages require matching revision, source, digest and a successful capture stage', () => {
  const html = '<html>Original server page</html>';
  const source = { ...journal, source: { sha256: 'journal-digest' } };
  const prior = { binding: { builds: { new: {
    main: journal.build, journal: source.source,
    fullPage: { status: 'available', main: journal.build, htmlSha256: createHash('sha256').update(html).digest('hex') },
  } } }, stages: [{ name: 'full-page:new', status: 'passed' }] };
  assert.equal(verifyFullSnapshot(source, prior, html).main, journal.build);
  assert.throws(() => verifyFullSnapshot(source, prior, html + 'changed'), /digest mismatch/);
  for (const mutate of [
    (p) => { p.binding.builds.new.main = 'main-stale123.js'; },
    (p) => { p.binding.builds.new.journal.sha256 = 'other-source'; },
    (p) => { p.binding.builds.new.fullPage.main = 'main-stale123.js'; },
    (p) => { p.binding.builds.new.fullPage.status = 'unavailable'; },
    (p) => { p.stages[0].status = 'failed'; },
  ]) {
    const wrong = structuredClone(prior); mutate(wrong);
    assert.throws(() => verifyFullSnapshot(source, wrong, html), /digest mismatch/);
  }
});

test('shadow CLI binds receipts to sources, preserves failures and never invokes publishing', () => {
  for (const scenario of ['success', 'corrupt', 'missing']) {
    const root = mkdtempSync(join(tmpdir(), 'wiki-shadow-'));
    try {
      for (const d of ['tools', 'data', 'bin']) mkdirSync(join(root, d));
      for (const file of ['shadow-update.mjs', 'dump-changelog.mjs', 'same-build.mjs']) copyFileSync(new URL(file, import.meta.url), join(root, 'tools', file));
      symlinkSync(new URL('../node_modules', import.meta.url), join(root, 'node_modules'), 'dir');
      writeFileSync(join(root, 'package.json'), '{"type":"module"}');
      writeFileSync(join(root, 'data/builds.json'), '[{"main":"main-oldbuild.js","status":"reviewed","evidence":"Do not rewrite history"}]');
      // Only read-only Git commands are allowed. Any publisher would fail this boundary.
      writeFileSync(join(root, 'bin/git'), '#!/bin/sh\ncase "$1" in rev-parse) printf aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa;; diff) ;; *) exit 99;; esac\n', { mode: 0o755 });
      const source = 'function g(a,b){return a.id<b.id?-1:1}function k(kind,text){return{kind,text}}function y(id,n){return{...n,id}}var u=[{id:`a`,added:`2026-11-07`,note:()=>k(`ui`,o._({id:`A`,message:[`Fresh`]}))}],h=[function(){return{date:`2026-11-06`,waves:[{version:`oldcode`,lines:[k(`fix`,o._({id:`OLD`,message:[`Older`]}))]}]}}];u.toSorted(g).map(n=>y(n.id,n.note()));var d=[{date:`2026-11-07`,waves:[{version:`dated12`,lines:[]}]},...h.map(n=>n())];';
      const assets = { 'changelog-panel-fixture1.js': source };
      for (const main of ['main-oldbuild.js', 'main-newbuild.js']) {
        const dir = join(root, '.cache', main.slice(0, -3));
        mkdirSync(join(dir, 'assets'), { recursive: true });
        writeFileSync(join(dir, 'index.html'), `<script src="/assets/${main}"></script>`);
        writeFileSync(join(dir, 'assets', main), 'import "./changelog-panel-fixture1.js"');
        writeFileSync(join(dir, 'assets/changelog-panel-fixture1.js'), source);
      }
      writeFileSync(join(root, 'tools/fetch-build.mjs'), `
        import {join} from 'node:path';
        export const ASSET=/[A-Za-z0-9_.-]+-[A-Za-z0-9_-]{8}\\.js/g;
        export const ARCHIVE='https://archive.invalid/';
        export async function mirror(site,main){
          if(process.env.SCENARIO==='missing')throw new Error('Archive missing');
          return {main,dir:join(${JSON.stringify(root)},'.cache',main.slice(0,-3),'assets'),files:[main,'changelog-panel-fixture1.js'],chunks:{}};
        }`);
      const digest = (s) => createHash('sha256').update(s).digest('hex');
      const files = Object.entries(assets).map(([name, body]) => ({ name, size: Buffer.byteLength(body), sha256: digest(body) }));
      writeFileSync(join(root, 'request.mjs'), `
        globalThis.fetch=async(url)=>{
          const main=new URL(url).pathname.split('/')[1];
          return Response.json({main,archivedAt:'2026-11-07T23:00:00Z',files:[
            {name:main,size:${Buffer.byteLength('import "./changelog-panel-fixture1.js"')},sha256:${JSON.stringify(digest('import "./changelog-panel-fixture1.js"'))}},
            ...${JSON.stringify(files)}.map(f=>({...f,sha256:process.env.SCENARIO==='corrupt'?'bad':f.sha256}))
          ]});
        };`);
      const before = readFileSync(join(root, 'data/builds.json'), 'utf8');
      const result = spawnSync(process.execPath, ['tools/shadow-update.mjs', 'main-oldbuild.js', 'main-newbuild.js'], {
        cwd: root, encoding: 'utf8', timeout: 10000,
        env: { ...process.env, SCENARIO: scenario, PATH: `${root}/bin:${process.env.PATH}`, NODE_OPTIONS: `--import=${join(root, 'request.mjs')}` },
      });
      assert.equal(result.status, scenario === 'success' ? 0 : 1, result.stdout + result.stderr);
      const out = join(root, '.cache/shadow', readdirSync(join(root, '.cache/shadow'))[0]);
      const receipt = JSON.parse(readFileSync(join(out, 'receipt.json')));
      assert.equal(receipt.status, scenario === 'success' ? 'complete' : 'failed');
      assert.equal(receipt.binding.oldMain, 'main-oldbuild.js');
      assert.equal(receipt.binding.newMain, 'main-newbuild.js');
      assert.equal(receipt.binding.tools['shadow-update.mjs'], digest(readFileSync(join(root, 'tools/shadow-update.mjs'))));
      assert.ok(receipt.stages.filter((s) => s.status !== 'not-run').every((s) => s.startedAt && s.completedAt && s.durationMs >= 0));
      assert.match(receipt.publishingDecision, /unchanged/);
      assert.equal(readFileSync(join(root, 'data/builds.json'), 'utf8'), before);
      if (scenario === 'success') {
        const packet = JSON.parse(readFileSync(join(out, 'packet.json')));
        assert.equal(packet.journalChanges.length, 0);
        assert.equal(packet.priorWikiEvidence.entries[0].evidence, 'Do not rewrite history');
        assert.equal(receipt.stages.at(-1).status, 'not-run');
      } else {
        assert.equal(receipt.stages.at(-1).status, 'failed');
        assert.match(receipt.error, scenario === 'missing' ? /Archive missing/ : /digest mismatch/);
      }
      // CLI rejects accidental delivery flags before doing work.
      assert.throws(() => execFileSync(process.execPath, ['tools/shadow-update.mjs', 'main-oldbuild.js', 'main-newbuild.js', '--ship'], { cwd: root, stdio: 'pipe' }));
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
});
