// Local-only preparation experiment. Does not approve or publish.
// node tools/journal-only.mjs <old cache> <new cache> <shadow receipt> <output directory>
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, basename, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { parse, parseExpressionAt } from 'acorn';
import { extractChangelog } from './dump-changelog.mjs';
import { sameBuild } from './same-build.mjs';
import { verifyJournalCapture } from './shadow-update.mjs';
import { measureProcess } from './update-measurements.mjs';
import { ASSET } from './fetch-build.mjs';
import { fetchOfficialData, applyOfficialData } from './official-data.mjs';

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const need = (condition, message) => { if (!condition) throw new Error(message); };

// Only the three known pure journal data expressions may differ. Helpers,
// comparator, renderer, imports and every other reachable byte remain compared.
// Do not erase an arbitrary chunk or accept code because its current output agrees.
export function journalSkeleton(source) {
  const tree = parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
  const sorted = source.match(/([\w$]+)\.toSorted\(([\w$]+)\)\.map\(\w+=>[\w$]+\(\w+\.id,\w+\.note\(\)\)\)/);
  const history = source.match(/\.\.\.([\w$]+)\.map\((\w+)=>\2\(\)\)\]/);
  need(sorted && history, 'Unknown journal render shape');
  const constructors = new Map();
  const translations = [];
  for (const fn of tree.body.filter((n) => n.type === 'FunctionDeclaration')) {
    const params = fn.params.map((p) => p.name);
    const result = fn.body.body.length === 1 && fn.body.body[0].type === 'ReturnStatement' && fn.body.body[0].argument;
    if (params.length === 2 && fn.params.every((p) => p.type === 'Identifier') && result?.type === 'ObjectExpression' && result.properties.every((p) =>
      p.type === 'SpreadElement' ? p.argument.type === 'Identifier' && params.includes(p.argument.name) :
        p.type === 'Property' && !p.computed && !p.method && p.kind === 'init' && p.key.type === 'Identifier' && p.value.type === 'Identifier' && params.includes(p.value.name))) {
      const shape = result.properties.map((p) => p.type === 'SpreadElement' ? `...${params.indexOf(p.argument.name)}` : `${p.key.name}:${params.indexOf(p.value.name)}`).join(',');
      if (['kind:0,text:1', '...0,about:1', '...1,id:0'].includes(shape)) constructors.set(fn.id.name, 2);
    }
  }
  const object = (node, keys) => {
    need(node?.type === 'ObjectExpression', 'Journal data must be an object');
    const entries = node.properties.map((p) => {
      need(p.type === 'Property' && !p.computed && !p.method && p.kind === 'init' && p.key.type === 'Identifier', 'Unknown journal property');
      return [p.key.name, p.value];
    });
    need(new Set(entries.map(([k]) => k)).size === entries.length && entries.every(([k]) => keys.includes(k)), 'Unknown or duplicate journal field');
    return Object.fromEntries(entries);
  };
  const string = (n) => need(n?.type === 'TemplateLiteral' && n.expressions.length === 0 || n?.type === 'Literal' && typeof n.value === 'string', 'Journal data must be a plain string');
  const array = (n, check) => { need(n?.type === 'ArrayExpression', 'Journal data must be an array'); n.elements.forEach(check); };
  const note = (n) => {
    need(n?.type === 'CallExpression' && !n.optional, 'Unknown note expression');
    if (n.callee.type === 'Identifier' && constructors.has(n.callee.name)) {
      need(n.arguments.length === constructors.get(n.callee.name), 'Unexpected constructor arguments');
      for (const arg of n.arguments) {
        if (arg.type === 'CallExpression') note(arg);
        else if (arg.type === 'ObjectExpression') {
          const about = object(arg, ['kind', 'id']);
          need(about.kind && about.id, 'Unknown note about shape');
          Object.values(about).forEach(string);
        } else string(arg);
      }
    } else {
      need(n.callee.type === 'MemberExpression' && !n.callee.computed && n.callee.object.type === 'Identifier' && n.callee.property.name === '_' && n.arguments.length === 1, 'Unknown note call');
      const message = object(n.arguments[0], ['id', 'message']);
      string(message.id);
      need(message.message?.elements?.length === 1, 'Unknown translation message');
      array(message.message, string);
      translations.push([message.id.type === 'Literal' ? message.id.value : message.id.quasis[0].value.cooked, source.slice(n.callee.start, n.callee.end)]);
    }
  };
  const day = (n) => {
    const d = object(n, ['date', 'waves']); string(d.date);
    array(d.waves, (wave) => { const w = object(wave, ['version', 'lines']); string(w.version); array(w.lines, note); });
  };
  const declaration = (name) => {
    const nodes = tree.body.filter((n) => n.type === 'VariableDeclaration').flatMap((n) => n.declarations).filter((n) => n.id.name === name);
    need(nodes.length === 1 && nodes[0].init?.type === 'ArrayExpression', 'Unknown journal declaration');
    return nodes[0].init;
  };
  const unreleased = declaration(sorted[1]), prior = declaration(history[1]);
  array(unreleased, (n) => {
    const entry = object(n, ['id', 'added', 'note']); string(entry.id); string(entry.added);
    need(entry.note?.type === 'ArrowFunctionExpression' && entry.note.params.length === 0 && !entry.note.async, 'Unknown note thunk');
    note(entry.note.body);
  });
  array(prior, (n) => {
    need(n?.type === 'FunctionExpression' && !n.async && !n.generator && !n.id && n.params.length === 0 && n.body.body.length === 1 && n.body.body[0].type === 'ReturnStatement', 'Unknown dated thunk');
    day(n.body.body[0].argument);
  });
  const inlineAt = source.indexOf('[{date:`');
  need(inlineAt !== -1, 'Unknown inline journal');
  const inline = parseExpressionAt(source, inlineAt, { ecmaVersion: 'latest' });
  const spread = inline.elements.at(-1);
  need(spread?.type === 'SpreadElement' && source.slice(spread.start, spread.end) === history[0].slice(0, -1), 'Unknown history expansion');
  inline.elements.slice(0, -1).forEach(day);
  const ranges = [[unreleased, 'UNRELEASED'], [prior, 'HISTORY'], [inline, 'DATED']].sort(([a], [b]) => b.start - a.start);
  for (const [node, label] of ranges) {
    need(!source.slice(node.start, node.end).match(ASSET), 'Journal data contains asset dependencies');
    source = source.slice(0, node.start) + `\`${label}\`` + source.slice(node.end);
  }
  return source + JSON.stringify(translations.sort(([a], [b]) => a.localeCompare(b)));
}

// Narrower than arbitrary regrouping: only existing next notes may graduate to
// dated waves. Existing dated notes/groups retain exact order and metadata.
export function journalGraduation(before, after) {
  const rows = (j) => [...j.unreleased.map((line) => ({ line, date: null, version: 'next' })), ...j.days.flatMap((d) => d.waves.flatMap((w) => w.lines.map((line) => ({ line, date: d.date, version: w.version }))))];
  const index = (j) => {
    const map = new Map();
    for (const row of rows(j)) {
      need(typeof row.line.msgId === 'string' && !map.has(row.line.msgId), 'Missing or duplicate message identity');
      map.set(row.line.msgId, row);
    }
    return map;
  };
  const old = index(before), next = index(after), moved = [];
  need(old.size === next.size && [...old.keys()].every((id) => next.has(id)), 'Notes added or removed');
  for (const [key, a] of old) {
    const b = next.get(key);
    if (isDeepStrictEqual(a, b)) continue;
    const { added, ...line } = a.line;
    need(a.version === 'next' && b.version !== 'next' && typeof a.line.id === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(added ?? '') && Number.isFinite(Date.parse(added)) && b.date === added.slice(0, 10) && isDeepStrictEqual(line, b.line), 'Text, identity, publication or existing dated note changed');
    moved.push({ id: line.id, msgId: key, publishedAt: added, from: 'next', date: b.date, version: b.version });
  }
  need(moved.length > 0, 'No next-to-dated graduation');
  const ids = new Set(moved.map((m) => m.msgId));
  need(isDeepStrictEqual(moved.map((m) => m.msgId), rows(after).filter((r) => ids.has(r.line.msgId)).map((r) => r.line.msgId)), 'Moved-note display order changed');
  need(isDeepStrictEqual(before.unreleased.filter((l) => !ids.has(l.msgId)), after.unreleased), 'Remaining next-note order changed');
  const remaining = after.days.map((d) => ({ ...d, waves: d.waves.map((w) => ({ ...w, lines: w.lines.filter((l) => !ids.has(l.msgId)) })).filter((w) => w.lines.length) })).filter((d) => d.waves.length);
  need(isDeepStrictEqual(before.days, remaining), 'Existing dated group/order changed');
  return moved;
}

export function prepareJournalOnly(oldRoot, newRoot, receiptFile, history, baselineJournal) {
  const oldMain = `${basename(oldRoot)}.js`, newMain = `${basename(newRoot)}.js`;
  need(oldMain !== newMain, 'Same-build repair needs review');
  need(history.at(-1)?.main === oldMain && history.every((b) => b.status === 'reviewed'), 'Unreviewed or wrong baseline history');
  const before = extractChangelog(join(oldRoot, 'assets'), oldMain), after = extractChangelog(join(newRoot, 'assets'), newMain);
  need(baselineJournal.build === before.build && baselineJournal.chunk === before.chunk && isDeepStrictEqual(baselineJournal.source, before.source) &&
    isDeepStrictEqual(baselineJournal.unreleased, before.unreleased) && isDeepStrictEqual(baselineJournal.days, before.days), 'Saved baseline journal differs from original source');
  const moved = journalGraduation(before, after);
  const whole = sameBuild(oldRoot, newRoot, { journal: journalSkeleton });
  need(whole.identical && whole.roots === 'index.html', 'Non-journal code/art/graph changed or HTML unavailable');
  const receipt = JSON.parse(readFileSync(receiptFile));
  need(receipt.status === 'complete' && receipt.stages.some((s) => s.name === 'browser:new' && s.status === 'passed'), 'Successful browser evidence required');
  for (const [key, main, journal] of [['old', oldMain, before], ['new', newMain, after]]) {
    const binding = receipt.binding?.builds?.[key];
    need(binding?.main === main && binding.journal?.sha256 === journal.source.sha256 && binding.htmlSha256 === hash(readFileSync(join(key === 'old' ? oldRoot : newRoot, 'index.html'))), 'Stale browser/source evidence');
    const manifestFile = `${key}-manifest.json`, bytes = readFileSync(join(dirname(receiptFile), manifestFile));
    // Shadow stores formatted manifest JSON; the binding digest is the original
    // HTTP bytes. Verify the saved artifact digest, not these different encodings.
    need(receipt.artifacts?.[manifestFile] === hash(bytes), 'Archive manifest digest mismatch');
    const manifest = JSON.parse(bytes), root = key === 'old' ? oldRoot : newRoot;
    need(manifest.main === main && whole.files[key === 'old' ? 0 : 1] === binding.verifiedAssets + 1, 'Archive coverage differs');
    for (const file of manifest.files) {
      need(basename(file.name) === file.name, 'Invalid archive path');
      const content = readFileSync(join(root, 'assets', file.name));
      need(content.length === file.size && hash(content) === file.sha256, `Archive asset changed: ${file.name}`);
    }
  }
  for (const file of ['panel.json', 'full.json']) {
    const bytes = readFileSync(join(dirname(receiptFile), file));
    need(receipt.artifacts?.[file] === hash(bytes), 'Browser artifact digest mismatch');
    verifyJournalCapture(after, receipt.binding.builds.new.gameCommit.slice(0, 7), JSON.parse(bytes));
  }
  return { schema: 1, status: 'local-candidate', automatic: false, publishing: 'disabled; explicit approval and integration required', oldMain, newMain,
    source: { before: before.source, after: after.source }, whole, moved,
    tools: Object.fromEntries(['journal-only.mjs', 'same-build.mjs', 'dump-changelog.mjs', 'shadow-update.mjs', 'official-data.mjs'].map((file) => [file, hash(readFileSync(new URL(file, import.meta.url)))])),
    priorHistorySha256: hash(JSON.stringify(history)), priorHistory: history,
    changes: 'Existing journal notes moved from next into a dated release group; no gameplay or note wording changes.',
    preservedPublication: moved, historicalIntroduction: 'Prior build history retained unchanged; grouping is not source introduction',
    requiredGates: ['build', 'quotes:0-unresolved', 'middleware', 'full-tests', 'freshness/rebase', 'exact-SHA deployment', 'canonical/all-pages'],
    gameCommit: receipt.binding.builds.new.gameCommit, journal: after };
}

// Explicit isolated-checkout preparation only. Never marks a build reviewed or
// runs Git writes, network delivery, or a substitute for final correctness gates.
function applyJournalOnlyLocal(plan, root, newRoot) {
  need(plan.status === 'local-candidate' && plan.automatic === false, 'Not a local-only candidate');
  need(!execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim(), 'Local destination must be clean');
  const history = JSON.parse(readFileSync(join(root, 'data/builds.json')));
  const build = JSON.parse(readFileSync(join(root, 'data/build.json')));
  need(build.main === plan.oldMain && hash(JSON.stringify(history)) === plan.priorHistorySha256, 'Local baseline changed');
  need(JSON.parse(readFileSync(join(root, 'data/changelog.json'))).source.sha256 === plan.source.before.sha256, 'Local journal baseline changed');
  const files = readdirSync(join(newRoot, 'assets'));
  const chunk = (role) => { const matches = files.filter((f) => f.startsWith(`${role}-`) && /^.+-[A-Za-z0-9_-]{8}\.js$/.test(f)); need(matches.length === 1, `Ambiguous ${role} chunk`); return matches[0]; };
  const current = { boot: chunk('boot'), sim: chunk('sim'), content: chunk('i18n-en-content') };
  const renamed = (text, measured = false) => text.replace(/[a-z0-9.-]+-[A-Za-z0-9_-]{8}\.js/g, (f) => {
    if (measured && f.startsWith('main-')) return f;
    need(plan.whole.mapping[f] !== null, `Ambiguous source correspondence: ${f}`);
    return plan.whole.mapping[f] ?? f;
  });
  const writes = [];
  if (existsSync(join(root, 'data/difficulty.json'))) {
    const path = join(root, 'data/difficulty.json'), data = JSON.parse(readFileSync(path));
    need(typeof data._source === 'string', 'Unknown difficulty provenance');
    data._source = renamed(data._source);
    writes.push([path, JSON.stringify(data, null, 1)]);
  }
  if (existsSync(join(root, 'data/i18n-names.json'))) {
    const path = join(root, 'data/i18n-names.json'), data = JSON.parse(readFileSync(path));
    need(data.build?.main === plan.oldMain, 'Wrong translated-name baseline');
    data.build = { ...data.build, main: plan.newMain, boot: current.boot };
    writes.push([path, JSON.stringify(data, null, 1)]);
  }
  for (const dir of ['pages', 'data/prose']) if (existsSync(join(root, dir))) {
    for (const file of readdirSync(join(root, dir), { recursive: true }).filter((f) => /\.(mjs|md)$/.test(f))) {
      const path = join(root, dir, file), text = readFileSync(path, 'utf8');
      writes.push([path, renamed(text, dir === 'data/prose')]);
    }
  }
  for (const [path, text] of writes) writeFileSync(path, text);
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const json = (path, value) => writeFileSync(join(root, path), JSON.stringify(value, null, 1) + '\n');
  json('data/changelog.json', plan.journal);
  json('data/build.json', { ...build, ...current, main: plan.newMain, commit: plan.gameCommit, updated: now, researched: now.slice(0, 10) });
  history.push({ seen: now.slice(0, 10), main: plan.newMain, boot: current.boot, sim: current.sim, commit: plan.gameCommit, status: 'unreviewed', updated: now,
    changes: plan.changes, evidence: `Local-only journal graduation proof against ${plan.oldMain}; all ${plan.whole.files[1]} reachable files checked. Prior history unchanged. Requires release approval and all final gates.` });
  json('data/builds.json', history);
  const audit = `\n\n## Local journal graduation ${plan.newMain}\n\n${plan.changes}\n\n${plan.preservedPublication.map((m) => `- ${m.id} (${m.msgId}): original publication ${m.publishedAt}; now ${m.date}/${m.version}. Source introduction remains in prior build history.`).join('\n')}\n\nSources: ${plan.source.before.url} SHA-256 ${plan.source.before.sha256}; ${plan.source.after.url} SHA-256 ${plan.source.after.sha256}. Prior history SHA-256 ${plan.priorHistorySha256}.\n`;
  writeFileSync(join(root, 'data/journal-audit.md'), readFileSync(join(root, 'data/journal-audit.md'), 'utf8') + audit);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.cwd();
  const measurement = measureProcess(root, 'journal-only-local', { aiUsage: { status: 'not-used-in-this-process' } });
  try {
    const [oldRoot, newRoot, receipt, output, apply] = process.argv.slice(2);
    need(oldRoot && newRoot && receipt && output && (!apply || apply === '--apply-local') && process.argv.length <= 7, 'Use <old cache> <new cache> <shadow receipt> <output directory> [--apply-local]; no ship');
    const plan = measurement.sync('journal-only-proof', () => prepareJournalOnly(oldRoot, newRoot, receipt,
      JSON.parse(readFileSync(join(root, 'data/builds.json'))), JSON.parse(readFileSync(join(root, 'data/changelog.json')))));
    const official = await measurement.async('official-data', () => fetchOfficialData(plan.gameCommit));
    // Retain the first-party revision/schema/catalog guard. The whole-build
    // proof permits reuse of the reviewed dump, not bypassing API consistency.
    measurement.sync('official-catalog-consistency', () => applyOfficialData({ registry: JSON.parse(readFileSync(join(root, 'data/registry.json'))), content: JSON.parse(readFileSync(join(root, 'data/en-content.json'))) }, official));
    plan.officialData = official.provenance;
    if (apply) measurement.sync('local-prepare', () => applyJournalOnlyLocal(plan, root, newRoot));
    mkdirSync(output, { recursive: true });
    writeFileSync(join(output, 'proposal.json'), JSON.stringify(plan, null, 2) + '\n');
    console.log(`Local journal-only proposal: ${join(output, 'proposal.json')}; ${apply ? 'prepared unreviewed local changes; final gates still required' : 'no tracked writes'}; no publishing`);
    measurement.finish('local-candidate');
  } catch (error) { console.error(error.message); process.exitCode = 1; measurement.finish('needs-review'); }
}
