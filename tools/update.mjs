// Checks tibo.dog for a new game build and refreshes the wiki's data from it.
//
// Usage: node tools/update.mjs [--apply] [--force]
//   (no flag)  mirror the live build, report what changed, change nothing
//   --apply    also write data/, icons and build.json, rename chunk names and quotes in pages/,
//              then rebuild and recheck every quote
//   --force    run even if the live build is the one the wiki documents
//
// Writes .cache/<main>/report.md. Last stdout line is "status: <s>", where s is
//   up-to-date    live build is the documented one
//   clean         only renames, art or translations changed; safe to deploy unreviewed
//   needs-review  game data, sim/boot logic or quoted code changed; a person or agent must
//                 update the affected pages (see report) before deploying
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, cpSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mirror } from './fetch-build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(ROOT);
const apply = process.argv.includes('--apply');
const force = process.argv.includes('--force');
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 << 20, ...opts });
const tryRun = (cmd, args) => {
  try {
    return { ok: true, out: run(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    return { ok: false, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};
const base = (f) => f.replace(/-[A-Za-z0-9_-]{8}\.js$/, '');
const today = new Date().toISOString().slice(0, 10);
const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

const build = JSON.parse(readFileSync('data/build.json', 'utf8'));
const live = await mirror();
console.log(`documented: ${build.main}  live: ${live.main}`);
if (live.main === build.main && !force) {
  console.log('status: up-to-date');
  process.exit(0);
}
const cache = dirname(live.dir);
const report = [`# tibo.dog build ${live.main}`, '', `Checked ${new Date().toISOString()}. Wiki documented \`${build.main}\`.`, ''];
let review = [];

// 1. Previous build (for code diffs). Hashed assets usually stay on the CDN.
let prev = null;
try {
  prev = await mirror(undefined, build.main);
} catch (e) {
  report.push(`Previous build ${build.main} could not be fetched (${e.message}); code diff skipped.`, '');
  review.push('previous build unavailable, code not diffed');
}

// 2. Dump game data.
const C = live.chunks;
const commit = readFileSync(join(live.dir, C['death-flow'] ?? ''), 'utf8').match(/commit:[\w$]+\(`([0-9a-f]{7,40})`\)/)?.[1] ?? null;
run('node', ['tools/dump-build.mjs', live.dir, C.boot, C.sim, C['i18n-en-content'], join(cache, 'data')]);
const diff = JSON.parse(run('node', ['tools/diff-data.mjs', 'data', join(cache, 'data'), '--json']));
report.push(`Game commit: \`${commit ?? 'not found'}\` (was \`${build.commit}\`).`, '', '## Data changes', '');
if (diff.changes.length) {
  review.push(`${diff.changes.length} data change(s)`);
  for (const c of diff.changes) report.push(`- \`${c.path}\`: \`${JSON.stringify(c.old)}\` → \`${JSON.stringify(c.new)}\``);
} else report.push('None. Registry, English text and config values are identical.');
report.push('');

// 3. Code diff of the simulation and boot modules.
if (prev) {
  report.push('## Logic changes (sim and boot, ignoring renamed identifiers)', '');
  for (const b of ['sim', 'boot']) {
    const out = run('python3', ['-I', 'tools/code-diff.py', join(prev.dir, prev.chunks[b]), join(live.dir, C[b]), '60']);
    const n = Number(out.match(/hunks: (\d+)\s*$/)?.[1] ?? 0);
    report.push(`### ${b}: ${n} hunk(s)`, '');
    if (n) {
      review.push(`${b}: ${n} logic hunk(s)`);
      report.push('```', out.trim(), '```', '');
    }
  }
  const added = Object.keys(C).filter((b) => !prev.chunks[b]);
  const removed = Object.keys(prev.chunks).filter((b) => !C[b]);
  report.push(`New chunks: ${added.join(', ') || 'none'}. Removed chunks: ${removed.join(', ') || 'none'}.`, '');
}

// 4. Icons.
const atlasDir = join(cache, 'atlas');
mkdirSync(atlasDir, { recursive: true });
const files = readdirSync(live.dir);
const pick = (re) => files.find((f) => re.test(f));
run('node', ['--input-type=module', '-e', `
  import fs from 'node:fs';
  const e = await import(${JSON.stringify(join(live.dir, pick(/^atlas\.generated-.{8}\.js$/)))});
  const l = await import(${JSON.stringify(join(live.dir, pick(/^atlas-late\.generated-.{8}\.js$/)))});
  fs.writeFileSync(${JSON.stringify(join(atlasDir, 'atlas-early.json'))}, JSON.stringify(Object.values(e)[0]));
  fs.writeFileSync(${JSON.stringify(join(atlasDir, 'atlas-late.json'))}, JSON.stringify(Object.values(l)[0]));`]);
writeFileSync(join(atlasDir, 'pages.json'), JSON.stringify({ early: pick(/^atlas-[A-Za-z0-9_-]{8}\.png$/), late: pick(/^atlas-late-[A-Za-z0-9_-]{8}\.png$/) }));
run('python3', ['tools/icons.py', live.dir, atlasDir, join(cache, 'data', 'registry.json'), join(cache, 'icons')]);
const iconDiff = run('python3', ['-I', '-c', `
import json,os,sys
from PIL import Image, ImageChops
old,new='public/icons',${JSON.stringify(join(cache, 'icons'))}
m=json.load(open(old+'/manifest.json')); n=json.load(open(new+'/manifest.json')); out=[]
for c in ['weapon','passive','item','enemy','boss','dog']:
  for k,v in n[c].items():
    o=m[c].get(k)
    if not o: out.append('new %s/%s'%(c,k)); continue
    a=Image.open(os.path.join(old,o['file'])).convert('RGBA'); b=Image.open(os.path.join(new,v['file'])).convert('RGBA')
    if a.size!=b.size or ImageChops.difference(a,b).getbbox(): out.append('changed %s/%s'%(c,k))
  out+=['gone %s/%s'%(c,k) for k in m[c] if k not in n[c]]
print('\\n'.join(out))`]).trim();
report.push('## Icons', '', iconDiff ? iconDiff.split('\n').map((l) => `- ${l}`).join('\n') : 'All icons pixel-identical.', '');
if (/^(new|gone)/m.test(iconDiff)) review.push('icons added or removed');

if (!apply) {
  // Quote check without touching sources.
  const q = tryRun('node', ['tools/check-quotes.mjs', live.dir]);
  report.push('## Quoted code', '', '```', q.out.trim(), '```', '');
  if (!q.ok) review.push('quoted code no longer found');
} else {
  // 5. Write data, icons and build info.
  for (const f of ['registry.json', 'config.json', 'en-content.json', 'difficulty.json']) cpSync(join(cache, 'data', f), join('data', f));
  if (iconDiff) cpSync(join(cache, 'icons'), 'public/icons', { recursive: true });
  const renames = Object.fromEntries(
    Object.entries(prev?.chunks ?? {}).filter(([b, f]) => C[b] && C[b] !== f).map(([, f]) => [f, C[base(f)]]),
  );
  writeFileSync('data/build.json', JSON.stringify({ researched: today, updated: now, site: build.site, commit, main: live.main, boot: C.boot, sim: C.sim, content: C['i18n-en-content'] }, null, 1) + '\n');

  // 6. Chunk names in page sources. Text about past builds lives in data/builds.json and is not touched.
  let renamed = 0;
  for (const p of readdirSync('pages').filter((f) => f.endsWith('.mjs')).map((f) => join('pages', f))) {
    const s = readFileSync(p, 'utf8');
    writeFileSync(p, s.replace(/[a-z0-9.-]+-[A-Za-z0-9_-]{8}\.js/g, (f) => (renames[f] ? (renamed++, renames[f]) : f)));
  }
  report.push(`## Applied`, '', `Renamed ${renamed} chunk reference(s) in pages/.`, '');

  // 7. Rebuild, fix renamed quotes, rebuild, recheck.
  const b1 = tryRun('node', ['build.mjs']);
  if (!b1.ok) {
    review.push('build failed after the data update');
    report.push('### Build failed', '', '```', b1.out.trim().slice(-4000), '```', '');
  } else {
    const fix = tryRun('node', ['tools/check-quotes.mjs', live.dir, '--write']);
    run('node', ['build.mjs']);
    const q = tryRun('node', ['tools/check-quotes.mjs', live.dir]);
    report.push('### Quoted code', '', '```', fix.out.trim(), '', q.out.trim(), '```', '');
    if (!q.ok) review.push('quoted code no longer found');
    const mw = tryRun('node', ['check-middleware.mjs']);
    if (!mw.ok) review.push('middleware check failed');
  }
}

const status = review.length ? 'needs-review' : 'clean';
if (apply) {
  // 8. Log the build. An unreviewed entry shows as "Not reviewed yet" on /sources until someone
  // updates the affected pages, writes the change summary and sets status to "reviewed".
  const builds = JSON.parse(readFileSync('data/builds.json', 'utf8'));
  if (!builds.some((b) => b.main === live.main)) {
    builds.push({
      seen: today, main: live.main, boot: C.boot, sim: C.sim, commit,
      status: status === 'clean' ? 'reviewed' : 'unreviewed',
      updated: now,
      changes: status === 'clean'
        ? 'Game data, English text, difficulty table, icons and game logic are identical (renamed code only).'
        : `Detected: ${review.join('; ')}.`,
    });
    writeFileSync('data/builds.json', JSON.stringify(builds, null, 1) + '\n');
    tryRun('node', ['build.mjs']);
  }
}
report.splice(3, 0, `**Status: ${status}**${review.length ? ` (${review.join('; ')})` : ''}`, '');
writeFileSync(join(cache, 'report.md'), report.join('\n') + '\n');
console.log(`report: ${join(cache, 'report.md')}`);
console.log(`status: ${status}`);
