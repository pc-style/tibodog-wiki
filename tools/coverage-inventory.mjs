// Registry-driven documentation inventory. Presence is not a semantic audit or a test pass.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const hash = (s) => createHash('sha256').update(s).digest('hex');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const GROUPS = {
  weapon: ['allWeapons', 'weapons'], passive: ['passives', 'passives'], item: ['allItems', 'items'],
  enemy: ['enemies', 'enemies'], boss: ['bosses', 'bosses'], dog: ['dogs', 'dogs'],
  biome: ['biomes', 'biomes'], event: ['events', 'events'], poi: ['pois', 'points-of-interest'],
  botHelp: ['botHelps', 'grok-bots'],
};
const read = (path) => {
  try { return readFileSync(new URL(path, ROOT), 'utf8'); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
};

function sections(body) {
  return [...body.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)]
    .map((m) => ({ heading: m[1], text: m[2].trim() }));
}

const narrative = (text) => text.replace(/```[\s\S]*?```|<small>[\s\S]*?<\/small>/g, '')
  .split('\n').filter((l) => !/^\s*[|<]/.test(l)).join(' ').trim();

function measurements(text, path) {
  return text.split(/\n\s*\n/).filter((p) =>
    /^(?:\*\*Measured\*\*|Measured\b|Checked\b|Controlled\b|Original[- ](?:engine|function|client)\b)/i.test(p.trim()) &&
    /\b(?:measured|checked|checks|controls|cases|ran|passed|confirmed)\b/i.test(p))
    .map((p) => ({ path, text: p.trim(), builds: [...new Set([
      ...[...p.matchAll(/main-[A-Za-z0-9_-]{8}(?:\.js)?/g)].map((m) => m[0].replace(/\.js$/, '')),
      ...[...p.matchAll(/\bbuild[ -](\d+)(?:\/(\d+))?/gi)].flatMap((m) => [m[1], m[2]].filter(Boolean)),
    ])] }));
}

function family(def) {
  if (Array.isArray(def.effects) && def.axis) return [def.axis, ...def.effects.map((e) => e.kind)].join('/');
  let v = def.behavior ?? def.effect ?? def.trick ?? def.flagged ?? def.ability ?? def.attack ?? def.hazard ?? def.help ?? def.rule;
  const parts = [];
  while (v) {
    if (v.kind) parts.push(v.kind);
    if (v.phase) parts.push(v.phase);
    if (v.proc?.kind) parts.push(v.proc.kind);
    v = v.variant;
  }
  return parts.join('/') || (def.stat ? `stat/${def.stat}` : def.mods ? 'stat modifiers' : 'definition');
}

export function createInventory({ registry, config, pages, build, evidence = {}, readFile = read }) {
  const byPath = new Map(pages.map((p) => [p.path, p]));
  const entries = [];
  const source = { registry: hash(JSON.stringify(registry)), config: hash(JSON.stringify(config)) };
  const add = (kind, def, path, label, shared) => {
    const id = def.id ?? def.kind;
    const key = `${kind}:${id}`;
    const page = byPath.get(path.split('#')[0]);
    if (!page) throw new Error(`Coverage: no owning page for ${key} (${path})`);
    const prosePath = `data/prose${path}.md`;
    const prose = path.includes('#') ? null : readFile(prosePath);
    const own = sections(prose ?? '').filter((s) => /^(?:How it works|Overview|Fight|Measured trigger|Measured ability|Extra dash)$/.test(s.heading) && narrative(s.text));
    let explanation = own.length ? { status: 'present', path: `${path}#${slug(own.find((s) => s.heading === 'How it works')?.heading ?? own[0].heading)}`,
      source: prosePath, sha256: hash(prose) } : { status: 'missing', path };
    // A flat modifier already has a generated level/stat table and shared conversion formulas.
    // Conditional effects and GPU heat must not get this exemption.
    if (!own.length && byPath.has('/stats') && (kind === 'passive' && def.stat && !def.effect && !def.thermal || kind === 'item' && Object.keys(def.mods ?? {}).length && !def.effect)) {
      explanation = { status: 'generated-stat', path, shared: '/stats', source: 'pages/entities.mjs' };
    }
    const phase = page.body.match(/\]\(\/endgame#(hunt|burrow|court|shell)\)/)?.[1];
    if (!own.length && ['enemy', 'boss'].includes(kind) && (phase || page.body.includes('## Endgame encounter\n'))) {
      explanation = { status: 'partial', path: phase ? `/endgame#${phase}` : '/endgame', reason: 'Family overview, not an entity attack walkthrough' };
    }
    if (shared) explanation = shared;
    let reports = measurements(prose ?? '', path);
    if (shared?.text) reports = measurements(shared.text, shared.path);
    for (const report of evidence.reports ?? []) {
      if (!report.keys.includes(key)) continue;
      const matches = (byPath.get(report.path)?.body ?? '').split(/\n\s*\n/).filter((p) => p.startsWith(report.startsWith));
      if (matches.length !== 1) throw new Error(`Coverage: ambiguous/missing shared measurement ${report.startsWith}`);
      reports.push(...measurements(matches[0], report.path).map((r) => ({ ...r, scope: report.scope })));
    }
    const scenarios = (evidence.scenarios?.[key] ?? []).map((e) => {
      const script = readFile(e.file);
      if (!script) throw new Error(`Coverage: missing scenario ${e.file}`);
      const current = e.main === build.main && e.definitionSha256 === hash(JSON.stringify(def)) && e.scriptSha256 === hash(script);
      return { ...e, status: current ? 'recorded-current' : 'needs-rerun' };
    });
    entries.push({ key, kind, id, name: label, path, family: family(def), definitionSha256: hash(JSON.stringify(def)), proseFile: prose === null ? null : prosePath,
      explanation: Object.fromEntries(Object.entries(explanation).filter(([k]) => k !== 'text')),
      measurements: reports, scenarios });
  };
  for (const [kind, [key, directory]] of Object.entries(GROUPS)) {
    if (!Array.isArray(registry[key])) throw new Error(`Coverage: missing registry.${key}`);
    for (const def of registry[key]) {
      const id = def.id ?? def.kind;
      const page = kind === 'poi' ? byPath.get('/points-of-interest') : kind === 'botHelp' ? byPath.get('/grok-bots') : byPath.get(`/${directory}/${id}`);
      let path = `/${directory}/${id}`, label = page?.title ?? id, shared;
      if (kind === 'poi') {
        // The owning generator puts each POI's internal kind in its named section.
        const section = sections(page?.body ?? '').find((s) => s.text.includes(`Internal kind \`${id}\``));
        if (!section) throw new Error(`Coverage: missing POI section for ${id}`);
        path = `/points-of-interest#${slug(section.heading)}`; label = section.heading;
        const action = section.text.split('\n').find((l) => /^- /.test(l) && !/^- (?:Internal kind|Biome weights)/.test(l));
        if (action) shared = { status: 'shared', path, source: 'pages/mechanics.mjs', text: section.text };
      } else if (kind === 'botHelp') {
        const row = page?.body.split('\n').find((l) => l.startsWith('| ') && l.includes('`' + JSON.stringify(def.help) + '`'));
        path = '/grok-bots'; label = id;
        if (row) { label = row.split('|')[1].trim(); shared = { status: 'shared', path, source: 'pages/mechanics.mjs', text: row }; }
      }
      add(kind, def, path, label, shared);
    }
  }
  for (const def of registry.runes ?? []) {
    const path = `/weapons/${def.weapon}#weapon-runes`;
    if (!byPath.get(`/weapons/${def.weapon}`)?.body.includes('## Weapon runes\n')) throw new Error(`Coverage: missing rune section for ${def.id}`);
    add('rune', def, path, def.id, { status: 'partial', path, source: 'pages/entities.mjs',
      reason: 'Published text, raw definition and shared effect rules; not a per-rune combat walkthrough' });
  }
  const sets = Object.entries(config).filter(([, v]) => Array.isArray(v) && v[0]?.set && v[0]?.rule);
  if (sets.length !== 1) throw new Error('Coverage: expected one exported gear-rule catalog');
  const modes = byPath.get('/modes');
  for (const def of sets[0][1]) {
    const row = modes?.body.split('\n').find((l) => l.startsWith('| ') &&
      slug(l.split('|')[1].split(' — ')[0].trim()) === def.set && l.includes(`kind:\`${def.rule.kind}\``));
    const shared = row ? { status: 'shared', path: '/modes#gear-set-rules', source: 'pages/mechanics.mjs', text: row } : null;
    add('gear', { id: def.set, ...def }, '/modes', row ? row.split('|')[1].trim() : def.set, shared);
  }
  const keys = new Set(entries.map((e) => e.key));
  for (const key of [...Object.keys(evidence.scenarios ?? {}), ...(evidence.reports ?? []).flatMap((r) => r.keys)]) {
    if (!keys.has(key)) throw new Error(`Coverage: evidence refers to removed/unknown ${key}`);
  }
  const count = (rows) => ({ total: rows.length, missing: rows.filter((e) => e.explanation.status === 'missing').length,
    partial: rows.filter((e) => e.explanation.status === 'partial').length,
    noRecordedMeasurement: rows.filter((e) => !e.measurements.length && !e.scenarios.length).length,
    noRetainedScenario: rows.filter((e) => !e.scenarios.length).length,
    currentScenario: rows.filter((e) => e.scenarios.some((s) => s.status === 'recorded-current')).length,
    scenarioNeedsRerun: rows.filter((e) => e.scenarios.some((s) => s.status === 'needs-rerun')).length });
  return { schema: 1, build: { main: build.main, commit: build.commit }, sources: source,
    summary: count(entries), groups: Object.fromEntries([...new Set(entries.map((e) => e.kind))].map((k) => [k, count(entries.filter((e) => e.kind === k))])), entries };
}

export function coverageMarkdown(inventory) {
  const { summary, entries } = inventory;
  const weapons = entries.filter((e) => e.kind === 'weapon');
  const noProse = weapons.filter((e) => !e.proseFile);
  const recipeOnly = weapons.filter((e) => e.proseFile && e.explanation.status === 'missing');
  const link = (e) => `[${e.name}](${e.path})`;
  const table = (fields) => `| Kind | ${fields.map(([label]) => label).join(' | ')} |\n|---|${fields.map(() => '---|').join('')}\n${Object.entries(inventory.groups).map(([k, n]) => `| ${k} | ${fields.map(([, field]) => n[field]).join(' | ')} |`).join('\n')}\n`;
  return `## Mechanics inventory\n\n**${summary.missing} missing explanations; ${summary.partial} partial entries**, out of ${summary.total} registry entities, runes and gear rules. Partial entries include family guides and rune catalogs, not complete combat walkthroughs. [Download every entry and its evidence](/api/v1/coverage.json). Generated on every build from the current registry, exported gear rules and page sections; not a model review.\n\n` +
    `An explanation can live on the entity page or a shared guide; it need not be titled “How it works”. Flat-stat tables linked to Stats are not missing prose. Presence is not a check of every parameter or interaction.\n\n` + table([['Entries', 'total'], ['Missing', 'missing'], ['Partial', 'partial']]) +
    `\n### Weapon prose scan, triaged\n\n${noProse.length} of ${weapons.length} weapons have no dedicated prose file; ${noProse.filter((e) => ['shared', 'generated-stat'].includes(e.explanation.status)).length} of those have a full shared explanation. ${recipeOnly.length} more have a file but no attack walkthrough${recipeOnly.length ? ` (${recipeOnly.map(link).join(', ')})` : ''}. Gear rules are checked separately against Modes, not counted as missing weapon prose.\n\n` +
    `\n### Missing explanations\n\n${Object.keys(inventory.groups).map((k) => { const rows = entries.filter((e) => e.kind === k && e.explanation.status === 'missing'); return rows.length ? `- **${k}:** ${rows.map(link).join(', ')}.\n` : ''; }).join('')}\n` +
    `<details><summary>Partial explanations needing attack detail (${summary.partial})</summary>\n\n${entries.filter((e) => e.explanation.status === 'partial').map(link).join(', ')}.\n\n</details>\n\n` +
    `<details><summary>Recorded evidence and missing reports (${summary.noRecordedMeasurement})</summary>\n\n“No report” means no located measurement; “No scenario” means no registered runnable script. These overlap and do not mean the entities were never tested.\n\n${table([['No report', 'noRecordedMeasurement'], ['No scenario', 'noRetainedScenario']])}\n${Object.keys(inventory.groups).map((k) => { const rows = entries.filter((e) => e.kind === k && !e.measurements.length && !e.scenarios.length); return rows.length ? `- **${k}:** ${rows.map(link).join(', ')}.\n` : ''; }).join('')}\n</details>\n\n` +
    `### Reading the evidence\n\nRetained scenarios: **${summary.currentScenario} entries with current-build results; ${summary.scenarioNeedsRerun} needing a rerun** after a game, definition or script change. This build generates the inventory; it does not rerun gameplay.\n\n“No recorded measurement” means none was found in the linked entity prose or explicitly mapped shared report—not proof nobody tested it. Old or unnamed builds stay historical or undated. The JSON includes each report's text, stated build, scenario command and revision status. Runtime-only systems and unrecorded scratch tests are outside this inventory.\n\n` +
    `### Cheapest next work\n\nReuse shared stat and attack-family explanations before writing more prose. New attack explanations need source-consumer reading; targeting, timing, proc caps and family attacks need controlled original-engine scenarios. Scripts can keep the inventory and parameter tables current, but cannot turn a raw table into a verified behavioral explanation. Private reward rules, natural survival and physical-device savings remain separate limits.\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  execFileSync(process.execPath, ['build.mjs'], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
  const report = JSON.parse(readFileSync(new URL('../dist/api/v1/coverage.json', import.meta.url))).data;
  console.log(JSON.stringify(process.argv.includes('--json') ? report : { build: report.build, summary: report.summary,
    groups: report.groups, gaps: report.entries.filter((e) => ['missing', 'partial'].includes(e.explanation.status)).map(({ key, path, family, explanation }) => ({ key, path, family, explanation })) }, null, 2));
}
