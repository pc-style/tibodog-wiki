import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numericUpdate } from './numeric-update.mjs';

test('numeric values publish automatically; new fields, text, code and unfinished work do not', () => {
  const input = { changes: [{ path: 'registry.allWeapons[whisk].base.damage', old: 14, new: 23 }], same: { identical: false }, numericSame: { identical: true } };
  assert.equal(numericUpdate(input).automatic, true);
  for (const change of [{ old: undefined, new: 23 }, { old: '14', new: '23' }, { old: 14, new: null }]) {
    assert.equal(numericUpdate({ ...input, changes: [{ ...input.changes[0], ...change }] }).automatic, false);
  }
  assert.equal(numericUpdate({ ...input, numericSame: { identical: false } }).automatic, false);
  assert.equal(numericUpdate({ ...input, pending: [{ main: 'pending' }] }).automatic, false);
  assert.equal(numericUpdate({ ...input, changes: [] }).automatic, false);
  assert.equal(numericUpdate({ changes: [], same: { identical: true } }).automatic, true);
});

test('only affected current prose needs a writing task; historical measurements remain historical', () => {
  const input = { changes: [{ path: 'registry.allWeapons[whisk].base.damage', old: 14, new: 23 }], numericSame: { identical: true } };
  const prose = (path, text) => [{ path: `data/prose/weapons/${path}.md`, text }];
  assert.equal(numericUpdate({ ...input, prose: prose('whisk', 'Deals 14 damage.') }).automatic, false);
  assert.equal(numericUpdate({ ...input, prose: prose('other', 'Deals 14 damage.') }).automatic, true);
  assert.equal(numericUpdate({ ...input, prose: prose('whisk', '**Measured** on an old build: 14 damage.') }).automatic, true);
  assert.equal(numericUpdate({ ...input, changes: [{ path: input.changes[0].path, old: 0.14, new: 0.23 }], prose: prose('whisk', 'Adds 14% damage.') }).automatic, false);
});
