import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sameBuild } from './same-build.mjs';

// index.html -> main -> boot and two "fx" chunks of the same role; index.html -> CSS -> PNG.
// `h` is a two-letter hash prefix, so each build has its own file names.
function build(h, { commit = 'a'.repeat(40), detachedCommit = false, otherSHA = 'c'.repeat(40), fx = ['spin()', 'fade()'], swap = false, preloadSwap = false, png = 'PNG1' } = {}) {
  const name = (role, ext = 'js') => `${role}-${h}${role.slice(0, 2)}0000.${ext}`;
  const [fx1, fx2] = [`fx-${h}one000.js`, `fx-${h}two000.js`];
  const files = {
    [name('main')]: `import"./${name('boot')}";import"./${swap ? fx2 : fx1}";import"./${swap ? fx1 : fx2}";function __tiboRetry(spec){return((spec,base,load,deps)=>{const fetched=deps===null?Promise.resolve():Promise.all([url,...deps.map(dep=>new URL(dep,base).href)].map(fetchOnce));return fetched})(spec,import.meta.url,url=>import(url),({"./${fx1}":["./${preloadSwap ? fx2 : fx1}","./${preloadSwap ? fx1 : fx2}"]}[spec]??[]))}`,
    [name('boot')]: `var g={commit:(t=\`${detachedCommit ? commit.slice(0, 12) : commit}\`)},s=\`${commit}\`,other=\`${otherSHA}\`;`,
    [fx1]: fx[0],
    [fx2]: fx[1],
    [name('style', 'css')]: `.a{background:url(${name('atlas', 'png')})}`,
    [name('atlas', 'png')]: png,
    [name('warm-list', 'json')]: JSON.stringify({ files: (preloadSwap ? [fx2, fx1] : [fx1, fx2]).map((f) => `assets/${f}`), locales: {} }),
  };
  const root = join(mkdtempSync(join(tmpdir(), 'same-build-')), name('main').replace(/\.js$/, ''));
  mkdirSync(join(root, 'assets'), { recursive: true });
  for (const [f, body] of Object.entries(files)) writeFileSync(join(root, 'assets', f), body);
  writeFileSync(join(root, 'index.html'), `<script src="/assets/${name('main')}"></script><link href="/assets/${name('style', 'css')}"><meta name="tibo-warm" content="/assets/${name('warm-list', 'json')}">`);
  return root;
}

test('a rebuild that only renames files and changes its own commit is identical', () => {
  assert.equal(sameBuild(build('Aa'), build('Bb', { commit: 'b'.repeat(40) })).identical, true);
  assert.equal(sameBuild(build('Aa', { detachedCommit: true }), build('Bb', { detachedCommit: true, commit: 'b'.repeat(40) })).identical, true);
  assert.equal(sameBuild(build('Aa', { detachedCommit: true }), build('Bb', { detachedCommit: true, commit: 'b'.repeat(40), otherSHA: 'd'.repeat(40) })).identical, false);
});

test('a code change is not identical and names the changed chunk', () => {
  const r = sameBuild(build('Aa'), build('Bb', { fx: ['spin()', 'fade(2)'] }));
  assert.equal(r.identical, false);
  assert.deepEqual(r.changed, ['old fx-Aatwo000.js', 'new fx-Bbtwo000.js']);
});

test('importing same-role chunks in a different order is a change', () => {
  assert.equal(sameBuild(build('Aa'), build('Bb', { swap: true })).identical, false);
  assert.equal(sameBuild(build('Aa'), build('Bb', { preloadSwap: true })).identical, true);
  assert.equal(sameBuild(build('Aa'), build('Bb', { preloadSwap: true, swap: true })).identical, false);
});

test('a changed image reached only through CSS is a change', () => {
  assert.equal(sameBuild(build('Aa'), build('Bb', { png: 'PNG2' })).identical, false);
});

test('numeric-only comparison accepts values but rejects text, schema and logic changes', () => {
  const compare = (a, b) => sameBuild(build('Aa', { fx: [a, 'fade()'] }), build('Bb', { fx: [b, 'fade()'] }), { numbers: true }).identical;
  assert.equal(compare('const stats={damage:14,cooldown:1.8}; hit(stats.damage*2)', 'const stats={damage:19,cooldown:0.7}; hit(stats.damage*3)'), true);
  for (const [a, b] of [
    ['hit(2)', 'heal(2)'], ['hit(2)', 'hit(2,3)'],
    ['hit("damage 2")', 'hit("damage 3")'], ['hit(`damage 2`)', 'hit(`damage 3`)'],
    ['hit(/x2/)', 'hit(/x3/)'], ['hit({2:4})', 'hit({3:4})'],
    ['hit(2+3)', 'hit(2*3)'], ['if(hp<2)die()', 'if(hp>2)die()'],
  ]) assert.equal(compare(a, b), false, `${a} versus ${b}`);
  assert.equal(sameBuild(build('Aa'), build('Bb', { png: 'PNG2' }), { numbers: true }).identical, false);
});
