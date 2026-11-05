import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sameBuild } from './same-build.mjs';

// index.html -> main -> boot and two "fx" chunks of the same role; index.html -> CSS -> PNG.
// `h` is a two-letter hash prefix, so each build has its own file names.
function build(h, { commit = 'a'.repeat(40), fx = ['spin()', 'fade()'], swap = false, png = 'PNG1' } = {}) {
  const name = (role, ext = 'js') => `${role}-${h}${role.slice(0, 2)}0000.${ext}`;
  const [fx1, fx2] = [`fx-${h}one000.js`, `fx-${h}two000.js`];
  const files = {
    [name('main')]: `import"./${name('boot')}";import"./${swap ? fx2 : fx1}";import"./${swap ? fx1 : fx2}";`,
    [name('boot')]: `var g={commit:(t=\`${commit}\`)},s=\`${commit.slice(0, 12)}\`;`,
    [fx1]: fx[0],
    [fx2]: fx[1],
    [name('style', 'css')]: `.a{background:url(${name('atlas', 'png')})}`,
    [name('atlas', 'png')]: png,
  };
  const root = join(mkdtempSync(join(tmpdir(), 'same-build-')), name('main').replace(/\.js$/, ''));
  mkdirSync(join(root, 'assets'), { recursive: true });
  for (const [f, body] of Object.entries(files)) writeFileSync(join(root, 'assets', f), body);
  writeFileSync(join(root, 'index.html'), `<script src="/assets/${name('main')}"></script><link href="/assets/${name('style', 'css')}">`);
  return root;
}

test('a rebuild that only renames files and changes its own commit is identical', () => {
  assert.equal(sameBuild(build('Aa'), build('Bb', { commit: 'b'.repeat(40) })).identical, true);
});

test('a code change is not identical and names the changed chunk', () => {
  const r = sameBuild(build('Aa'), build('Bb', { fx: ['spin()', 'fade(2)'] }));
  assert.equal(r.identical, false);
  assert.deepEqual(r.changed, ['old fx-Aatwo000.js', 'new fx-Bbtwo000.js']);
});

test('importing same-role chunks in a different order is a change', () => {
  assert.equal(sameBuild(build('Aa'), build('Bb', { swap: true })).identical, false);
});

test('a changed image reached only through CSS is a change', () => {
  assert.equal(sameBuild(build('Aa'), build('Bb', { png: 'PNG2' })).identical, false);
});
