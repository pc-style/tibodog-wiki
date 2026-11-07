// Checks tibo.dog for a new game build and refreshes the wiki's data from it.
//
// Usage: node tools/update.mjs [--apply] [--auto] [--force]
//   (no flag)  mirror the live build, report what changed, change nothing
//   --apply    also write data/, icons and build.json, rename chunk names and quotes in pages/,
//              then rebuild and recheck every quote
//   --force    recheck a reviewed build; pending reviews always resume without overwriting evidence
//   --auto     with --apply, refuse all writes unless the automatic lane accepts the build
//
// Writes .cache/<main>/report.md. Last stdout line is "status: <s>", where s is
//   up-to-date    live build is the documented one and every history entry is reviewed
//   identical     the whole build matches the documented one apart from file hashes and its own
//                 commit id (tools/same-build.mjs); --apply records it as reviewed, so it ships
//                 without an agent review
//   needs-review  game data, sim/boot logic or quoted code changed; a person or agent must
//                 update the affected pages (see report) before deploying
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, cpSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mirror } from './fetch-build.mjs';
import { compareChangelog, extractChangelog } from './dump-changelog.mjs';
import { sameBuild } from './same-build.mjs';
import { numericUpdate } from './numeric-update.mjs';
import { fetchOfficialData, applyOfficialData } from './official-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(ROOT);
const apply = process.argv.includes('--apply');
const auto = process.argv.includes('--auto');
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
const builds = JSON.parse(readFileSync('data/builds.json', 'utf8'));
const pending = builds.filter((b) => b.status === 'unreviewed');
const live = await mirror();
console.log(`documented: ${build.main}  live: ${live.main}`);
if (live.main === build.main && (!force || pending.length)) {
  // Reapplying would compare the updated data to itself and erase the original review report.
  const currentJournal = extractChangelog(live.dir, live.main);
  const savedJournal = JSON.parse(readFileSync('data/changelog.json', 'utf8'));
  const drift = compareChangelog(savedJournal, currentJournal);
  const journalReview = drift.length || savedJournal.source?.sha256 !== currentJournal.source.sha256;
  if (journalReview) console.log(`journal review required (original reports preserved): ${JSON.stringify(drift)}`);
  for (const b of pending) {
    console.log(`review required: ${b.main}`);
    const report = join(ROOT, '.cache', b.main.replace(/\.js$/, ''), 'report.md');
    if (existsSync(report)) console.log(`report: ${report}`);
  }
  console.log(`status: ${pending.length || journalReview ? 'needs-review' : 'up-to-date'}`);
  process.exit(0);
}
const cache = dirname(live.dir);
const report = [`# tibo.dog build ${live.main}`, '', `Checked ${new Date().toISOString()}. Wiki documented \`${build.main}\`.`, ''];
let review = pending.map((b) => `unreviewed build ${b.main}`);

// 1. Previous build (for code diffs). Prefer the local mirror; old CDN assets may be deleted.
let prev = null;
try {
  prev = await mirror(undefined, build.main);
} catch (e) {
  report.push(`Previous build ${build.main} could not be fetched (${e.message}); code diff skipped.`, '');
  review.push('previous build unavailable, code not diffed');
}

// Whole-build comparison decides whether this is only a rebuild of the documented game.
const same = prev ? sameBuild(dirname(prev.dir), dirname(live.dir)) : null;
if (same) {
  report.push('## Whole-build comparison', '', same.identical
    ? `All ${same.files[1]} files reachable from the ${same.roots} match \`${build.main}\` after mapping file hashes and the build's own commit id.`
    : `Changed files (${same.files[0]} → ${same.files[1]} reachable from the ${same.roots}):\n\n${same.changed.map((c) => `- \`${c}\``).join('\n')}`, '');
  if (!same.identical) review.push(`${same.changed.length} changed file(s)`);
}

// 2. Dump game data.
const C = live.chunks;
const commit = readFileSync(join(live.dir, C['death-flow'] ?? ''), 'utf8').match(/commit:[\w$]+\(`([0-9a-f]{7,40})`\)/)?.[1] ?? null;
run('node', ['tools/dump-build.mjs', live.dir, C.boot, C.sim, C['i18n-en-content'], join(cache, 'data')]);
run('node', ['tools/dump-changelog.mjs', live.dir, live.main, join(cache, 'data', 'changelog.json')]);
const notes = (f) => existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : { unreleased: [], days: [] };
const journalChanges = compareChangelog(notes('data/changelog.json'), notes(join(cache, 'data', 'changelog.json')));
const diff = JSON.parse(run('node', ['tools/diff-data.mjs', 'data', join(cache, 'data'), '--json']));
// The first-party export owns catalog values. Cross-check against this exact
// mirrored revision; keep extraction for config/difficulty, absent from the public API.
const official = await fetchOfficialData(commit);
const imported = applyOfficialData({
  registry: JSON.parse(readFileSync(join(cache, 'data/registry.json'), 'utf8')),
  content: JSON.parse(readFileSync(join(cache, 'data/en-content.json'), 'utf8')),
}, official);
writeFileSync(join(cache, 'data/registry.json'), JSON.stringify(imported.registry, null, 1));
writeFileSync(join(cache, 'data/en-content.json'), JSON.stringify(imported.content, null, 1));
writeFileSync(join(cache, 'official-data.json'), JSON.stringify(official, null, 1));
report.push(`Game commit: \`${commit ?? 'not found'}\` (was \`${build.commit}\`).`, '', '## Data changes', '');
if (diff.changes.length) {
  review.push(`${diff.changes.length} data change(s)`);
  for (const c of diff.changes) report.push(`- \`${c.path}\`: \`${JSON.stringify(c.old)}\` → \`${JSON.stringify(c.new)}\``);
} else report.push('None. Registry, English text and config values are identical.');
report.push('', '## In-game journal changes', '', 'Official grouping/publication is not proof of when gameplay first changed. Reconcile with old/new source and measured evidence; retain both histories.', '');
if (journalChanges.length) {
  review.push(`${journalChanges.length} journal change(s), including removals/revisions/regrouping`);
  for (const change of journalChanges) report.push(`- ${change.type}${change.id ? ` (${change.id})` : ''}: ${JSON.stringify(change.before)} → ${JSON.stringify(change.after)}`);
} else report.push('None.');
report.push('');
// Entity names in the other languages (pages/entities.mjs, /controls#languages). Changed translations are
// safe to deploy; a changed language list changes the /controls table and its prose, so it needs review.
run('node', ['tools/i18n-names.mjs', live.dir, C.boot, live.main, join(cache, 'data', 'i18n-names.json')]);
const l10n = (f) => existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : { languages: [], names: {} };
const [oldL10n, newL10n] = [l10n('data/i18n-names.json'), l10n(join(cache, 'data', 'i18n-names.json'))];
const langList = (d) => d.languages.map((l) => `${l.tag} ${l.endonym} ${l.dir}`).join(', ');
const nameRows = (d) => Object.entries(d.names).flatMap(([kind, ids]) => Object.entries(ids).flatMap(([id, e]) =>
  Object.entries(e).filter(([f]) => f !== 'cite').map(([f, row]) => [`${kind}.${id}.${f}`, JSON.stringify(row)])));
const oldRows = new Map(nameRows(oldL10n));
const changedNames = nameRows(newL10n).filter(([k, v]) => oldRows.get(k) !== v).map(([k]) => k);
report.push('## Names in other languages', '');
if (langList(oldL10n) !== langList(newL10n)) {
  review.push('language list changed');
  report.push(`Language list changed: ${langList(oldL10n)} → ${langList(newL10n)}`, '');
}
report.push(changedNames.length ? changedNames.map((k) => `- \`${k}\` new or retranslated`).join('\n') : 'No name changes.', '');

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
// Use the game's own ordered manifest/image pairs; several optional sheets contain icons.
writeFileSync(join(atlasDir, 'pages.json'), JSON.stringify({ early: pick(/^atlas-[A-Za-z0-9_-]{8}\.png$/), late: pick(/^atlas-late-[A-Za-z0-9_-]{8}\.png$/) }));
run('node', ['--input-type=module', '-'], { input: `
  import fs from 'node:fs';
  import { basename } from 'node:path';
  import { loadGame } from './tools/play.mjs';
  const { boot } = await loadGame(${JSON.stringify(live.main)});
  const fetch = globalThis.fetch;
  globalThis.fetch = (url, options) => String(url).startsWith('file:')
    ? Promise.resolve(new Response(fs.readFileSync(new URL(url)))) : fetch(url, options);
  const optional = Object.values(boot).find(v => Array.isArray(v) && v.some(p => typeof p?.manifest === 'function' && typeof p?.url === 'function')) ?? [];
  const file = ${JSON.stringify(join(atlasDir, 'pages.json'))};
  const pages = JSON.parse(fs.readFileSync(file));
  pages.optional = [];
  for (const [index, page] of optional.entries()) {
    const phase = page.phase + '-' + index;
    fs.writeFileSync(${JSON.stringify(atlasDir)} + '/atlas-' + phase + '.json', JSON.stringify(await page.manifest()));
    pages.optional.push({ phase, image: basename(await page.url()) });
  }
  fs.writeFileSync(file, JSON.stringify(pages));` });
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

const prose = existsSync('data/prose') ? readdirSync('data/prose', { recursive: true }).filter((f) => f.endsWith('.md')).map((f) => ({ path: `data/prose/${f}`, text: readFileSync(`data/prose/${f}`, 'utf8') })) : [];
const numericSame = prev && !same.identical ? sameBuild(dirname(prev.dir), dirname(live.dir), { numbers: true }) : same;
const decision = numericUpdate({ changes: diff.changes, same, numericSame, pending, prose });
if (journalChanges.length) decision.reasons.push('journal text or publication changed');
if (langList(oldL10n) !== langList(newL10n)) decision.reasons.push('language schema changed');
if (iconDiff) decision.reasons.push('art changed');
decision.automatic = decision.reasons.length === 0;
report.push('## Automatic update decision', '', decision.automatic ? 'Existing numeric values or an identical rebuild; no agent review required.' : decision.reasons.map((r) => `- ${r}`).join('\n'), '');

if (!apply || auto) {
  // Quote check without touching sources.
  const q = tryRun('node', ['tools/check-quotes.mjs', live.dir]);
  report.push('## Quoted code', '', '```', q.out.trim(), '```', '');
  if (!q.ok) {
    review.push('quoted code no longer found');
    decision.automatic = false;
    decision.reasons.push('authored citations need updating');
  }
}
if (apply && auto && !decision.automatic) {
  report.push('Automatic apply refused without changing tracked files.', ...decision.reasons.map((r) => `- ${r}`));
  writeFileSync(join(cache, 'report.md'), report.join('\n') + '\n');
  console.log(`report: ${join(cache, 'report.md')}`);
  console.log('status: needs-review');
  process.exit(0);
}
if (apply) {
  // 5. Write data, icons and build info.
  for (const f of ['registry.json', 'config.json', 'en-content.json', 'difficulty.json', 'changelog.json', 'i18n-names.json']) cpSync(join(cache, 'data', f), join('data', f));
  if (iconDiff) cpSync(join(cache, 'icons'), 'public/icons', { recursive: true });
  const renames = Object.fromEntries(
    Object.entries(prev?.chunks ?? {}).filter(([b, f]) => C[b] && C[b] !== f).map(([, f]) => [f, C[base(f)]]),
  );
  writeFileSync('data/build.json', JSON.stringify({ researched: today, updated: now, site: build.site, commit, main: live.main, boot: C.boot, sim: C.sim, content: C['i18n-en-content'] }, null, 1) + '\n');

  // 6. Chunk names in page sources. Text about past builds lives in data/builds.json and is not touched.
  let renamed = 0;
  const sources = [
    ...readdirSync('pages').filter((f) => f.endsWith('.mjs')).map((f) => join('pages', f)),
    ...(existsSync('data/prose') ? readdirSync('data/prose', { recursive: true }).filter((f) => f.endsWith('.md')).map((f) => join('data/prose', f)) : []),
  ];
  for (const p of sources) {
    const s = readFileSync(p, 'utf8');
    // In prose, main-*.js names the build a "Measured" run used; that stays true after an update.
    const keep = (f) => p.startsWith('data/prose') && f.startsWith('main-');
    writeFileSync(p, s.replace(/[a-z0-9.-]+-[A-Za-z0-9_-]{8}\.js/g, (f) => (renames[f] && !keep(f) ? (renamed++, renames[f]) : f)));
  }
  report.push(`## Applied`, '', `Renamed ${renamed} chunk reference(s) in pages/ and data/prose/.`, '');

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

const status = decision.automatic && !review.some((r) => /failed|quoted code/.test(r)) ? (same?.identical ? 'identical' : 'numeric') : 'needs-review';
if (apply) {
  // 8. Log the build. An unreviewed entry shows as "Not reviewed yet" on /versions until someone
  // updates the affected pages, writes the change summary and sets status to "reviewed".
  if (!builds.some((b) => b.main === live.main)) {
    // build.mjs rejects `changes` over 280 chars; a long detection list goes to `evidence` instead.
    const detected = `Detected: ${review.join('; ')}.`;
    builds.push({
      seen: today, main: live.main, boot: C.boot, sim: C.sim, commit,
      status: ['identical', 'numeric'].includes(status) ? 'reviewed' : 'unreviewed',
      updated: now,
      ...(status === 'numeric'
        ? { changes: `Updated ${diff.changes.length} numeric values from the official game data.`, evidence: `Automatic numeric-only AST and schema comparison against ${build.main}; first-party export ${official.index.game.commit}; ${same.files[1]} reachable files checked. No changed authored text, entities or logic structure.` }
        : status === 'identical'
        ? { changes: 'No gameplay changes; a rebuild of the same game.', evidence: `Automatic whole-build comparison (tools/same-build.mjs): all ${same.files[1]} files reachable from the ${same.roots} match ${build.main} after mapping file hashes and the build's own commit id.` }
        : detected.length <= 280 ? { changes: detected } : { changes: 'Detected changes; see review evidence.', evidence: detected }),
    });
    writeFileSync('data/builds.json', JSON.stringify(builds, null, 1) + '\n');
    tryRun('node', ['build.mjs']);
  }
}
report.splice(3, 0, `**Status: ${status}**${review.length ? ` (${review.join('; ')})` : ''}`, '');
writeFileSync(join(cache, 'report.md'), report.join('\n') + '\n');
console.log(`report: ${join(cache, 'report.md')}`);
console.log(`status: ${status}`);
