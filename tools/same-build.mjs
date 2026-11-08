// Decides whether two mirrored builds are the same game apart from file hashes and the build's own commit id.
// Usage: node tools/same-build.mjs .cache/<old main> .cache/<new main>
// Prints JSON { identical, files, roots, unmatched } and exits 0 when identical, 1 otherwise.
//
// Every asset name `role-HASH.ext` is replaced by its role, so a file must still reference the same roles.
// Repeated hashing over the reference graph then gives each file an identity that also covers what its
// references contain, so two files of the same role cannot swap executable imports unnoticed.
// Only the game's known parallel fetch lists and warm-cache manifest are unordered.
// Binary files compare by bytes. The optional numeric mode also preserves the JS syntax tree.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { ASSET } from './fetch-build.mjs';
import { parse, parseExpressionAt } from 'acorn';

const TEXT = /\.(js|css|svg|json|html)$/;
const sha = (s) => createHash('sha256').update(s).digest('hex');
const role = (f) => f.replace(/-[A-Za-z0-9_-]{8}(\.\w+)$/, '$1');

// The build's own git commit, embedded in several files in full or shortened; it changes every build.
function ownCommit(root) {
  const boot = readdirSync(join(root, 'assets')).filter((f) => /^(boot|death-flow)-.*\.js$/.test(f));
  const sources = boot.map((f) => readFileSync(join(root, 'assets', f), 'utf8'));
  const found = sources.map((s) => s.match(/commit:\(?[\w$]+[=(]`([0-9a-f]{7,40})`/)?.[1]);
  const own = found.filter(Boolean).sort((x, y) => y.length - x.length)[0];
  if (!own) return;
  // New boot modules keep the full SHA in a separate binding; death-flow only
  // embeds its 12-character prefix. Extend only to one uniquely matching SHA.
  const full = new Set(sources.flatMap((s) => [...s.matchAll(/`([0-9a-f]{40})`/g)].map((m) => m[1])).filter((h) => h.startsWith(own)));
  return full.size === 1 ? [...full][0] : own;
}

// Files reachable from `entry`, each with a label (content with asset names reduced to roles) and its references.
function load(root, entry, numbers, journal) {
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
    let text = own ? bytes.toString('utf8').replace(/`([0-9a-f]{7,40})`/g, (m, h) => (own.startsWith(h) ? '`COMMIT`' : m)) : bytes.toString('utf8');
    if (journal && /^changelog-panel-[A-Za-z0-9_-]{8}\.js$/.test(name)) text = journal(text);
    // Retry dependencies are fetched with Promise.all, not executed in array
    // order. Hashed-name sorting can swap two same-role preload entries on a
    // rebuild. Preserve actual imports and specifier keys in their exact order.
    const ranges = [];
    const arrays = (n) => {
      if (!n || typeof n !== 'object') return;
      if (n.type === 'ArrayExpression' && n.elements.every((e) => e?.type === 'Literal' && typeof e.value === 'string' && /^(?:\.\/|assets\/)/.test(e.value))) ranges.push([n.start, n.end]);
      else for (const v of Object.values(n)) if (Array.isArray(v)) v.forEach(arrays); else if (v && typeof v === 'object') arrays(v);
    };
    const marker = 'import.meta.url,url=>import(url),(';
    const retryStart = text.indexOf('function __tiboRetry(spec){return((spec,base,load,deps)=>{');
    if (retryStart !== -1) {
      const retry = parseExpressionAt(text, retryStart, { ecmaVersion: 'latest', sourceType: 'module' });
      const source = text.slice(retryStart, retry.end);
      if (source.includes('Promise.all([url,...deps.map(dep=>new URL(dep,base).href)].map(fetchOnce))')) {
        const at = text.indexOf(marker, retryStart);
        if (at !== -1 && at < retry.end) {
          const expr = parseExpressionAt(text, at + marker.length, { ecmaVersion: 'latest', sourceType: 'module' });
          if (expr.type === 'LogicalExpression' && expr.operator === '??' && expr.left.object?.type === 'ObjectExpression') arrays(expr.left.object);
        }
      }
    }
    if (/^warm-list-[A-Za-z0-9_-]{8}\.json$/.test(name)) arrays(parseExpressionAt(text, 0, { ecmaVersion: 'latest' }));
    const refs = [];
    const groups = [];
    let body = text.replace(ASSET, (m, offset) => {
      groups.push(ranges.findIndex(([start, end]) => offset > start && offset < end));
      refs.push(m);
      return `ASSET:${role(m)}`;
    });
    if (numbers && name.endsWith('.js')) {
      // Parse, never regex-strip: digits inside strings, property names, regexes,
      // operators and control flow must still compare exactly. Fail closed on syntax changes.
      const tree = parse(body, { ecmaVersion: 'latest', sourceType: 'module' });
      const clean = (node, key = '') => {
        if (!node || typeof node !== 'object') return node;
        if (Array.isArray(node)) return node.map((n) => clean(n));
        return Object.fromEntries(Object.entries(node).filter(([k]) => !['start', 'end', 'raw'].includes(k)).map(([k, v]) =>
          [k, k === 'value' && node.type === 'Literal' && typeof v === 'number' && key !== 'key' ? 'NUMBER' : clean(v, k)]));
      };
      body = JSON.stringify(clean(tree));
    }
    nodes.set(name, { label: sha(body), refs, groups });
    stack.push(...refs);
  }
  return nodes;
}

// Weisfeiler-Lehman refinement: each round folds the references' colours into a file's colour.
function colours(nodes) {
  let c = new Map([...nodes].map(([n, v]) => [n, v.label]));
  for (let round = 0; round < 16; round++) {
    const next = new Map([...nodes].map(([n, v]) => {
      const refs = v.refs.map((r) => c.get(r) ?? `missing:${role(r)}`);
      for (const group of new Set(v.groups?.filter((g) => g !== -1))) {
        const indexes = v.groups.flatMap((g, i) => g === group ? [i] : []);
        const sorted = indexes.map((i) => refs[i]).sort();
        indexes.forEach((i, k) => { refs[i] = sorted[k]; });
      }
      return [n, sha(c.get(n) + refs.join(','))];
    }));
    const stable = new Set(next.values()).size === new Set(c.values()).size;
    c = next;
    if (stable) break;
  }
  return c;
}

export function sameBuild(oldRoot, newRoot, { numbers = false, journal = null } = {}) {
  // Compare from the served HTML when both builds have it, else from each entry script.
  const indexed = [oldRoot, newRoot].every((r) => existsSync(join(r, 'index.html')));
  const [a, b] = [oldRoot, newRoot].map((r) => load(r, indexed ? 'index.html' : `${basename(r)}.js`, numbers, journal));
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
  const identical = a.size > 0 && a.size === b.size && unmatched.length === 0;
  // The local journal experiment needs source correspondence, not the last
  // filename sharing a role. Ambiguous graph identities remain unresolved.
  const mapping = journal && identical ? Object.fromEntries([...ca].map(([name, colour]) => {
    const matches = [...cb].filter(([next, value]) => role(next) === role(name) && value === colour).map(([next]) => next);
    return [name, matches.includes(name) ? name : matches.length === 1 ? matches[0] : null];
  })) : null;
  return { identical, files: [a.size, b.size], roots: indexed ? 'index.html' : 'entry script', changed, unmatched: unmatched.length, ...(mapping ? { mapping } : {}) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = sameBuild(process.argv[2], process.argv[3]);
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.identical ? 0 : 1);
}
