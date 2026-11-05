// Decides whether two mirrored builds are the same game apart from file hashes and the build's own commit id.
// Usage: node tools/same-build.mjs .cache/<old main> .cache/<new main>
// Prints JSON { identical, files, roots, unmatched } and exits 0 when identical, 1 otherwise.
//
// Every asset name `role-HASH.ext` is replaced by its role, so a file must still reference the same roles.
// Repeated hashing over the reference graph then gives each file an identity that also covers what its
// references contain, so two files of the same role cannot swap dependencies unnoticed. Binary files
// compare by bytes. Anything that differs in any other way is a real change and needs review.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { ASSET } from './fetch-build.mjs';

const TEXT = /\.(js|css|svg|json|html)$/;
const sha = (s) => createHash('sha256').update(s).digest('hex');
const role = (f) => f.replace(/-[A-Za-z0-9_-]{8}(\.\w+)$/, '$1');

// The build's own git commit, embedded in several files in full or shortened; it changes every build.
function ownCommit(root) {
  const boot = readdirSync(join(root, 'assets')).filter((f) => /^(boot|death-flow)-.*\.js$/.test(f));
  const found = boot.map((f) => readFileSync(join(root, 'assets', f), 'utf8').match(/commit:\(?[\w$]+[=(]`([0-9a-f]{7,40})`/)?.[1]);
  return found.filter(Boolean).sort((x, y) => y.length - x.length)[0];
}

// Files reachable from `entry`, each with a label (content with asset names reduced to roles) and its references.
function load(root, entry) {
  const own = ownCommit(root);
  const nodes = new Map();
  const stack = [entry];
  while (stack.length) {
    const name = stack.pop();
    const path = name === 'index.html' ? join(root, name) : join(root, 'assets', name);
    if (nodes.has(name) || !existsSync(path)) continue;
    const bytes = readFileSync(path);
    if (!TEXT.test(name)) {
      nodes.set(name, { label: sha(bytes), refs: [] });
      continue;
    }
    const text = own ? bytes.toString('utf8').replace(/`([0-9a-f]{7,40})`/g, (m, h) => (own.startsWith(h) ? '`COMMIT`' : m)) : bytes.toString('utf8');
    const refs = [];
    const body = text.replace(ASSET, (m) => (refs.push(m), `\0${role(m)}\0`));
    nodes.set(name, { label: sha(body), refs });
    stack.push(...refs);
  }
  return nodes;
}

// Weisfeiler-Lehman refinement: each round folds the references' colours into a file's colour.
function colours(nodes) {
  let c = new Map([...nodes].map(([n, v]) => [n, v.label]));
  for (let round = 0; round < 16; round++) {
    const next = new Map([...nodes].map(([n, v]) => [n, sha(c.get(n) + v.refs.map((r) => c.get(r) ?? `missing:${role(r)}`).join(','))]));
    const stable = new Set(next.values()).size === new Set(c.values()).size;
    c = next;
    if (stable) break;
  }
  return c;
}

export function sameBuild(oldRoot, newRoot) {
  // Compare from the served HTML when both builds have it, else from each entry script.
  const indexed = [oldRoot, newRoot].every((r) => existsSync(join(r, 'index.html')));
  const [a, b] = [oldRoot, newRoot].map((r) => load(r, indexed ? 'index.html' : `${basename(r)}.js`));
  const [ca, cb] = [colours(a), colours(b)];
  const count = (c) => [...c.values()].reduce((m, v) => m.set(v, (m.get(v) ?? 0) + 1), new Map());
  const [na, nb] = [count(ca), count(cb)];
  const unmatched = [
    ...[...ca].filter(([, v]) => (nb.get(v) ?? 0) < na.get(v)).map(([n]) => `old ${n}`),
    ...[...cb].filter(([, v]) => (na.get(v) ?? 0) < nb.get(v)).map(([n]) => `new ${n}`),
  ];
  // Files whose own content changed, before the change spreads to everything that imports them.
  const labels = (g) => new Set([...g.values()].map((v) => v.label));
  const [la, lb] = [labels(a), labels(b)];
  const changed = [...[...a].filter(([, v]) => !lb.has(v.label)).map(([n]) => `old ${n}`), ...[...b].filter(([, v]) => !la.has(v.label)).map(([n]) => `new ${n}`)];
  return { identical: a.size > 0 && a.size === b.size && unmatched.length === 0, files: [a.size, b.size], roots: indexed ? 'index.html' : 'entry script', changed, unmatched: unmatched.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = sameBuild(process.argv[2], process.argv[3]);
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.identical ? 0 : 1);
}
