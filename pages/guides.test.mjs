import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firstSentence } from './guides.mjs';

test('quick tips keep the whole first sentence of a tip', () => {
  // Full stops inside decimals, links, parentheses, code and abbreviations do not end the sentence.
  assert.equal(
    firstSentence('Wait 2.6 s (see [Stats](/stats). Really.) and use `a.B` e.g. Butter. Then dash.'),
    'Wait 2.6 s (see [Stats](/stats). Really.) and use `a.B` e.g. Butter.',
  );
  // A bold lead is the tip's own summary; inline code citations are dropped.
  assert.equal(firstSentence('**Sidestep the charge early.** The lane locks.'), 'Sidestep the charge early.');
  assert.equal(firstSentence('Keep moving <small>[sim-X.js: `a.b`]</small>. Then rest.'), 'Keep moving.');
  // No sentence break: the whole tip.
  assert.equal(firstSentence('one line only'), 'one line only');
});

test('the boss guide lists bosses in the order they arrive', async () => {
  // The guide promises arrival order; alphabetical order put 17:00 before 14:00.
  const { guidePages } = await import('./guides.mjs');
  const { bossPages } = await import('./entities.mjs');
  const guide = guidePages(bossPages()).find((p) => p.path === '/guides/bosses');
  const times = [...guide.body.matchAll(/<small class="when">(\d+):(\d+)<\/small>/g)].map((m) => +m[1] * 60 + +m[2]);
  assert.equal(times.length, 13);
  assert.deepEqual(times, [...times].sort((a, b) => a - b));
});
