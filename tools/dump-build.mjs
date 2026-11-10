// Loads a mirrored build's boot and sim modules in Node and writes registry.json,
// config.json and en-content.json next to it, in the same shape as data/.
// Usage: node tools/dump-build.mjs <assets dir> <boot file> <sim file> <content file> <out dir>
import { writeFileSync, mkdirSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { loadEndgame } from './load-endgame.mjs';

const [dir, bootF, simF, contentF, out] = process.argv.slice(2);
const P = new Proxy(function () {}, {
  get: (_, k) => (k === Symbol.toPrimitive ? () => 0 : k === 'then' ? undefined : P),
  apply: () => P,
  construct: () => P,
});
for (const k of ['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'location', 'matchMedia', 'requestAnimationFrame', 'HTMLElement', 'HTMLCanvasElement', 'Image', 'AudioContext', 'addEventListener', 'CSS', 'OffscreenCanvas', 'Worker', 'screen', 'devicePixelRatio', 'indexedDB', 'ResizeObserver', 'PerformanceObserver', 'FontFace', 'history'])
  if (!(k in globalThis)) try { globalThis[k] = P; } catch {}

const sim = await import(`${dir}/${simF}`);
const boot = await import(`${dir}/${bootF}`);
const content = await import(`${dir}/${contentF}`);
await loadEndgame(boot, sim);

const seen = new WeakSet();
const ser = (v, d, max) => {
  if (typeof v === 'function') return '[fn]';
  if (v === null || typeof v !== 'object') return v;
  if (v instanceof Map) return { __map: [...v].map(([k, x]) => [k, ser(x, d + 1, max)]) };
  if (v instanceof Set) return { __set: [...v].map((x) => ser(x, d + 1, max)) };
  if (ArrayBuffer.isView(v)) return { __typed: v.constructor.name, len: v.length };
  if (seen.has(v)) return '[ref]';
  if (d > max) return '[deep]';
  seen.add(v);
  const o = Array.isArray(v) ? v.map((x) => ser(x, d + 1, max)) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, ser(x, d + 1, max)]));
  seen.delete(v);
  return o;
};

const reg = Object.values(boot).find((v) => v && typeof v === 'object' && typeof v.weapon === 'function' && Array.isArray(v.allWeapons));
if (!reg) throw new Error('registry not found in boot');
const registry = {};
for (const [k, v] of Object.entries(reg)) registry[k] = ser(v, 0, 14);
// Newer builds keep only boss IDs in boot; simulation owns the full definitions and order.
if (!Array.isArray(reg.bosses)) {
  const bosses = Object.values(sim).find((v) => v && typeof v.boss === 'function' && Array.isArray(v.bosses) && Array.isArray(v.bossOrder));
  if (!bosses) throw new Error('boss definitions not found in sim');
  registry.bosses = ser(bosses.bosses, 0, 14);
  registry.bossOrder = ser(bosses.bossOrder, 0, 14);
}

const config = {};
const sharedFile = readdirSync(dir).find((f) => /^intro-shared(?:-[A-Za-z0-9_-]{8})?\.js$/.test(f));
const shared = sharedFile ? await import(pathToFileURL(`${dir}/${sharedFile}`).href) : {};
for (const [src, m] of [['sim', sim], ['boot', boot], ['intro-shared', shared]])
  for (const [k, v] of Object.entries(m))
    if (v && typeof v === 'object' && typeof v.weapon !== 'function') {
      try {
        const j = JSON.stringify(ser(v, 0, 10));
        if (j.length > 40) config[`${src}.${k}`] = JSON.parse(j);
      } catch {}
    }

const text = Object.values(content).find((v) => v && typeof v === 'object' && Object.keys(v).some((k) => k.startsWith('content.')));
if (!text) throw new Error('content strings not found');

// Difficulty bindings are private. Evaluate them in their original module context so
// overrides can use config bindings and helper calls, not just standalone literals.
async function difficulty() {
  const candidates = readdirSync(dir).filter((f) => /\.js$/.test(f)).map((file) => {
    const code = readFileSync(`${dir}/${file}`, 'utf8');
    return { file, code, match: code.match(/([\w$]+)=\{alive:1,floorShare:0,/) };
  }).filter((c) => c.match);
  if (candidates.length !== 1) throw new Error(`expected one difficulty defaults module, found ${candidates.length}`);
  const { file, code, match: m } = candidates[0];
  const literal = (start) => {
    let depth = 0;
    for (let i = start; i < code.length; i++) {
      if (code[i] === '{') depth++;
      else if (code[i] === '}' && --depth === 0) return code.slice(start, i + 1);
    }
    throw new Error('unbalanced literal');
  };
  const defStart = m.index + m[1].length + 1;
  const defaults = literal(defStart);
  const t = code.slice(defStart + defaults.length).match(/^,([\w$]+)=\{easy:\{/);
  if (!t) throw new Error('difficulty table not found after defaults');
  const table = literal(defStart + defaults.length + t[1].length + 2);
  const spread = new RegExp(`\\.\\.\\.${m[1].replace(/\$/g, '\\$')},?`, 'g');
  const temporary = `${dir}/.wiki-difficulty-${randomUUID()}.mjs`;
  try {
    writeFileSync(temporary, `${code}\nexport const __wikiDifficulty = {defaults:${m[1]},...${table.replace(spread, '')}};\n`);
    const { __wikiDifficulty } = await import(pathToFileURL(temporary).href);
    return { _source: `${file}: difficulty defaults and per-level overrides`, ...__wikiDifficulty };
  } finally {
    unlinkSync(temporary);
  }
}

mkdirSync(out, { recursive: true });
writeFileSync(`${out}/difficulty.json`, JSON.stringify(await difficulty(), null, 1));
writeFileSync(`${out}/registry.json`, JSON.stringify(registry, null, 1));
writeFileSync(`${out}/config.json`, JSON.stringify(config, null, 1));
writeFileSync(`${out}/en-content.json`, JSON.stringify(Object.fromEntries(Object.entries(text).sort(([a], [b]) => a.localeCompare(b))), null, 1));
console.log(JSON.stringify({ registry: Object.keys(registry).length, config: Object.keys(config), content: Object.keys(text).length }));
