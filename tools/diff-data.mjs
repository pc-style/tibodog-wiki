// Compares two dumped data dirs (registry.json, config.json, en-content.json).
// Config exports are matched by shape because minified export names change per build.
// Usage: node tools/diff-data.mjs <old dir> <new dir> [--json]
import { readFileSync } from 'node:fs';

const [oldDir, newDir] = process.argv.slice(2);
const load = (d, f) => JSON.parse(readFileSync(`${d}/${f}`, 'utf8'));

const changes = [];
function walk(a, b, path) {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    if (Array.isArray(a) && a.every((x) => x && x.id) && b.every((x) => x && x.id)) {
      const A = Object.fromEntries(a.map((x) => [x.id, x]));
      const B = Object.fromEntries(b.map((x) => [x.id, x]));
      for (const id of new Set([...Object.keys(A), ...Object.keys(B)])) walk(A[id], B[id], `${path}[${id}]`);
      return;
    }
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], `${path}.${k}`);
    return;
  }
  changes.push({ path, old: a, new: b });
}

// Registry and content: plain structural diff.
walk(load(oldDir, 'registry.json'), load(newDir, 'registry.json'), 'registry');
walk(load(oldDir, 'en-content.json'), load(newDir, 'en-content.json'), 'content');
const noSrc = (d) => { const { _source, ...rest } = load(d, 'difficulty.json'); return rest; };
walk(noSrc(oldDir), noSrc(newDir), 'difficulty');

// Config: pair each old export with the new export whose key set overlaps most.
const oc = load(oldDir, 'config.json');
const nc = load(newDir, 'config.json');
const keys = (v) => new Set(Array.isArray(v) ? [`len${v.length}`, ...v.flatMap((x) => (x && typeof x === 'object' ? Object.keys(x) : [String(x)]))] : Object.keys(v));
const score = (a, b) => {
  const A = keys(a), B = keys(b);
  const inter = [...A].filter((k) => B.has(k)).length;
  return inter / Math.max(A.size, B.size, 1);
};
const rename = {};
const used = new Set();
for (const [ok, ov] of Object.entries(oc)) {
  const side = ok.split('.')[0];
  let best = null, bs = 0;
  for (const [nk, nv] of Object.entries(nc)) {
    if (used.has(nk) || nk.split('.')[0] !== side) continue;
    const s = JSON.stringify(ov) === JSON.stringify(nv) ? 2 : score(ov, nv);
    if (s > bs) (best = nk), (bs = s);
  }
  if (best && bs >= 0.5) {
    used.add(best);
    rename[ok] = best;
    walk(ov, nc[best], `config[${ok}→${best}]`);
  } else changes.push({ path: `config[${ok}]`, old: 'export', new: 'no match in new build' });
}
for (const nk of Object.keys(nc)) if (!used.has(nk)) changes.push({ path: `config[${nk}]`, old: undefined, new: 'new export' });

const out = { rename, changes };
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 1));
else {
  console.log('config export renames:', Object.entries(rename).filter(([a, b]) => a !== b).map(([a, b]) => `${a}→${b}`).join(' '));
  console.log(`${changes.length} changes`);
  for (const c of changes) console.log(`${c.path}: ${JSON.stringify(c.old)?.slice(0, 160)} → ${JSON.stringify(c.new)?.slice(0, 160)}`);
}
