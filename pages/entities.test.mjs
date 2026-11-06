import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dogPages } from './entities.mjs';

test('dog pages describe active special abilities, not zero-radius fetch fallbacks', () => {
  const pages = dogPages();
  for (const [id, ability] of [['sigkitten', 'sigstop'], ['husky', 'howl'], ['newfoundland', 'catch'], ['retriever', 'fetch']]) {
    const page = pages.find((p) => p.path === `/dogs/${id}`);
    const shown = page.infobox.rows.find(([label]) => label === 'Ability')[1];
    assert.ok(shown.includes(`\`${ability}\``), `${id}: ${shown}`);
    if (ability !== 'fetch') {
      assert.ok(!shown.includes('Brings pickups'));
    }
  }
});
