import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dogPages, weaponPages } from './entities.mjs';

test('dog pages describe active special abilities, not zero-radius fetch fallbacks', () => {
  const pages = dogPages();
  for (const [id, ability] of [['sigkitten', 'sigstop'], ['husky', 'howl'], ['newfoundland', 'catch'], ['retriever', 'fetch'], ['saluki', 'gale'], ['shiba', 'spirits'], ['whippet', 'tug']]) {
    const page = pages.find((p) => p.path === `/dogs/${id}`);
    const shown = page.infobox.rows.find(([label]) => label === 'Ability')[1];
    assert.ok(shown.includes(`\`${ability}\``), `${id}: ${shown}`);
    if (ability !== 'fetch') {
      assert.ok(!shown.includes('Brings pickups'));
    }
    if (id === 'shiba') {
      assert.match(Object.fromEntries(page.infobox.rows)['Ability every'], /Elite or boss death/);
    }
  }
});

test('Loot Sling describes automatic copies without changing the pickup-only wedge slings', () => {
  const pages = weaponPages();
  for (const id of ['loot-sling', 'gem-sling', 'gem-catapult']) {
    const page = pages.find((p) => p.path === `/weapons/${id}`);
    const rows = Object.fromEntries(page.infobox.rows);
    assert.match(rows.Trigger, /XP gem pickups/);
    if (id === 'loot-sling') {
      assert.match(rows.Trigger, /Automatic/);
      assert.match(rows.Attack, /evolved attacks/);
      assert.doesNotMatch(rows.Attack, /wedges/);
    } else {
      assert.doesNotMatch(rows.Trigger, /Automatic/);
      assert.match(rows.Attack, /wedges/);
    }
  }
});
