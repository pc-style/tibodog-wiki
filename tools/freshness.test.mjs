import test from 'node:test';
import assert from 'node:assert/strict';
import { classify } from './freshness.mjs';

const base = {
  originMain: '1c9ba3858a26680b45bfb88c4805de28d5e1bb46',
  git: { fetched: true, ahead: 0, behind: 0, dirty: 0 },
  documentedMain: 'main-C2skBLTa.js',
  liveMain: 'main-C2skBLTa.js',
  deployedCommit: '1c9ba38',
};
const with_ = (patch) => classify({ ...base, ...patch });

test('everything in step is current on all three axes', () => {
  const v = classify(base);
  assert.deepEqual([v.git.status, v.game.status, v.deploy.status], ['current', 'current', 'current']);
});

test('the three kinds of drift are reported independently', () => {
  // Git behind only: game and deploy still compare against origin/main, not HEAD.
  const v = with_({ git: { ...base.git, behind: 2 } });
  assert.deepEqual([v.git.status, v.game.status, v.deploy.status], ['behind', 'current', 'current']);
  // Live game moved: git and deploy are unaffected.
  const g = with_({ liveMain: 'main-NEWBUILD.js' });
  assert.deepEqual([g.git.status, g.game.status, g.deploy.status], ['current', 'drift', 'current']);
  // Production lags origin/main: git and game are unaffected.
  const d = with_({ deployedCommit: '94fe7f3' });
  assert.deepEqual([d.git.status, d.game.status, d.deploy.status], ['current', 'current', 'lag']);
});

test('ahead plus behind is diverged, and dirty trees are warned about, never cleaned', () => {
  const v = with_({ git: { fetched: true, ahead: 1, behind: 3, dirty: 4 } });
  assert.equal(v.git.status, 'diverged');
  assert.match(v.git.note, /4 uncommitted path\(s\).*do not reset/);
  assert.equal(with_({ git: { ...base.git, ahead: 2 } }).git.status, 'ahead');
});

test('missing observations are unknown, not current', () => {
  const v = with_({ liveMain: null, deployedCommit: null, git: { fetched: false, ahead: null, behind: null, dirty: 0 } });
  assert.deepEqual([v.git.status, v.game.status, v.deploy.status], ['unknown', 'unknown', 'unknown']);
  assert.equal(classify({ ...base, git: null }).git.status, 'unknown');
  // A failed fetch still reports the comparison but flags it as possibly stale.
  assert.match(with_({ git: { ...base.git, fetched: false } }).git.note, /fetch failed/);
});

test('deploy compares the 7-character production commit with the full origin/main SHA', () => {
  assert.equal(with_({ deployedCommit: '1c9ba38' }).deploy.status, 'current');
  assert.equal(with_({ deployedCommit: '1c9ba39' }).deploy.status, 'lag');
});
