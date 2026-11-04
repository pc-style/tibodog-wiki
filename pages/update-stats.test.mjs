import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateStats } from './update-stats.mjs';

test('update frequency includes quiet calendar days and derives all rates from the same sample', () => {
  const text = updateStats([
    ...Array.from({ length: 3 }, () => ({ seen: '2026-11-02' })),
    ...Array.from({ length: 4 }, () => ({ seen: '2026-11-06' })),
  ]);
  assert.match(text, /\*\*1\.4 updates\/day\*\* · \*\*9\.8 updates\/week\*\* · \*\*1 update every 17 h 9 min\*\*/);
  assert.match(text, /7 builds tracked over 5 UTC calendar days/);
  assert.match(text, /Weekly rate is an estimate/);
});

test('update frequency handles a single tracked day and empty history', () => {
  const text = updateStats(Array.from({ length: 16 }, () => ({ seen: '2026-11-04' })));
  assert.match(text, /\*\*16 updates\/day\*\* · \*\*112 updates\/week\*\* · \*\*1 update every 1 h 30 min\*\*/);
  assert.match(text, /16 builds tracked over 1 UTC calendar day /);
  assert.equal(updateStats([]), '');
});
