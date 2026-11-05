// Checks that every game-code quote cited in the built wiki still exists in the game build.
// Quotes look like "[sim-Cy57yi5h.js: `code`]" in dist/*.md. A quote that is no longer found
// is searched again with its short minified names as wildcards; a unique match is a rename.
//
// Usage: node tools/check-quotes.mjs <assets dir> [--write]
//   --write  replaces renamed quotes in pages/*.mjs and data/prose/**/*.md (only where the old quote appears verbatim).
// Exit code 1 if any quote is unresolved.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [assets] = process.argv.slice(2);
if (!existsSync('dist')) throw new Error('dist/ is missing; run node build.mjs first');
const write = process.argv.includes('--write');
const files = readdirSync(assets).filter((f) => f.endsWith('.js'));
const byBase = Object.fromEntries(files.map((f) => [f.replace(/-[A-Za-z0-9_-]{8}\.js$/, ''), f]));
const src = Object.fromEntries(files.map((f) => [f, readFileSync(join(assets, f), 'utf8')]));

// The mechanics reference reproduces research notes written against an older build on purpose.
const SKIP = new Set(['dist/mechanics-reference.md']);
const mdFiles = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.md') && !SKIP.has(p)) mdFiles.push(p);
  }
})('dist');

const RE = /\[([a-z0-9.-]+-[A-Za-z0-9_-]{8}\.js): (`+) ?([\s\S]+?) ?\2\]/g;
const quotes = new Map(); // key file|quote -> {file, quote, pages:Set}
for (const p of mdFiles) {
  for (const m of readFileSync(p, 'utf8').matchAll(RE)) {
    const key = `${m[1]}|${m[3]}`;
    if (!quotes.has(key)) quotes.set(key, { file: m[1], quote: m[3], pages: new Set() });
    quotes.get(key).pages.add(p);
  }
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Turn a quote into a pattern where short identifiers (minified names) match any short identifier.
function fuzzy(q) {
  let out = '';
  const re = /[A-Za-z_$][\w$]*|[^A-Za-z_$]+/g;
  let m;
  while ((m = re.exec(q))) {
    const tok = m[0];
    const prev = q[m.index - 1];
    const isIdent = /^[A-Za-z_$]/.test(tok);
    out += isIdent && tok.length <= 3 && prev !== '.' && !/^(if|for|let|var|new|do|in|of|try|NaN)$/.test(tok) ? '[A-Za-z_$][\\w$]{0,2}' : esc(tok);
  }
  return new RegExp(out, 'g');
}

const results = { ok: 0, renamed: [], moved: [], unresolved: [] };
for (const q of quotes.values()) {
  if (src[q.file]?.includes(q.quote)) {
    results.ok++;
    continue;
  }
  const base = q.file.replace(/-[A-Za-z0-9_-]{8}\.js$/, '');
  const cur = byBase[base];
  if (cur && src[cur].includes(q.quote)) {
    if (cur === q.file) results.ok++;
    else results.renamed.push({ ...q, newFile: cur, newQuote: q.quote });
    continue;
  }
  const pat = fuzzy(q.quote);
  const hits = cur ? [...src[cur].matchAll(pat)].map((m) => m[0]) : [];
  const uniq = [...new Set(hits)];
  if (uniq.length === 1) {
    results.renamed.push({ ...q, newFile: cur, newQuote: uniq[0] });
    continue;
  }
  // Code may have moved to another chunk.
  const elsewhere = files.filter((f) => f !== cur && src[f].includes(q.quote));
  if (elsewhere.length === 1) results.moved.push({ ...q, newFile: elsewhere[0], newQuote: q.quote });
  else results.unresolved.push({ ...q, candidates: uniq.length });
}

const show = (r) => `${r.file}: ${r.quote.slice(0, 90)}${r.newQuote && r.newQuote !== r.quote ? `\n    → ${r.newFile}: ${r.newQuote.slice(0, 90)}` : r.newFile ? ` → ${r.newFile}` : ''}`;
console.log(`quotes: ${quotes.size}, unchanged: ${results.ok}, renamed: ${results.renamed.length}, moved: ${results.moved.length}, unresolved: ${results.unresolved.length}`);
for (const r of results.unresolved) console.log(`UNRESOLVED ${show(r)} (${r.candidates} fuzzy matches) in ${[...r.pages].join(', ')}`);
for (const r of results.moved) console.log(`MOVED ${show(r)}`);

if (write) {
  const sources = readdirSync('pages').filter((f) => f.endsWith('.mjs')).map((f) => join('pages', f));
  if (existsSync('data/prose')) sources.push(...readdirSync('data/prose', { recursive: true }).filter((f) => f.endsWith('.md')).map((f) => join('data/prose', f)));
  let edits = 0;
  const missed = [];
  for (const r of [...results.renamed, ...results.moved]) {
    // A moved quote must change its named asset, not every citation of that asset.
    // Page templates use cite/citeCode; prose and notes contain Markdown directly.
    if (r.newFile !== r.file) {
      for (const p of sources) {
        const s = readFileSync(p, 'utf8');
        let next = s;
        for (const fn of ['cite', 'citeCode']) {
          for (const label of [`'${r.file}'`, ...(r.file.startsWith('boot-') ? ['BOOT'] : r.file.startsWith('sim-') ? ['SIM'] : [])]) {
            next = next.split(`${fn}(${label}, '${r.quote}')`).join(`${fn}('${r.newFile}', '${r.newQuote}')`);
          }
        }
        for (const ticks of ['`', '\\`', '``', '\\`\\`']) {
          for (const space of ['', ' ']) {
            const from = `[${r.file}: ${ticks}${space}${r.quote.replaceAll('`', ticks.includes('\\') ? '\\`' : '`')}${space}${ticks}]`;
            const to = from.replace(`[${r.file}:`, `[${r.newFile}:`);
            next = next.split(from).join(to);
          }
        }
        if (next !== s) { writeFileSync(p, next); edits++; }
      }
    }
    // update.mjs renames page chunks, but hand-written prose can still name the old build.
    if (r.newFile !== r.file && results.renamed.includes(r)) {
      for (const p of sources) {
        const s = readFileSync(p, 'utf8');
        const from = `[${r.file}:`;
        if (s.includes(from)) {
          writeFileSync(p, s.split(from).join(`[${r.newFile}:`));
          edits++;
        }
      }
    }
    if (r.newQuote === r.quote) continue;
    let found = false;
    // Quotes inside template literals have their backticks escaped in the source.
    const forms = [[r.quote, r.newQuote], [r.quote.replaceAll('`', '\\`'), r.newQuote.replaceAll('`', '\\`')]];
    for (const p of sources) {
      let s = readFileSync(p, 'utf8');
      for (const [from, to] of forms) {
        if (!s.includes(from)) continue;
        s = s.split(from).join(to);
        writeFileSync(p, s);
        edits++;
        found = true;
        break;
      }
    }
    if (!found) missed.push(r);
  }
  console.log(`rewrote ${edits} quote(s) in pages/ and data/prose/`);
  for (const r of missed) console.log(`NOT IN SOURCE VERBATIM (fix by hand): ${show(r)}`);
  if (missed.length) process.exitCode = 1;
}
if (results.unresolved.length) process.exitCode = 1;
