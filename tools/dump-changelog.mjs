// Extracts the in-game "What's new" notes from a mirrored build's changelog-panel chunk into changelog.json.
// Usage: node tools/dump-changelog.mjs <assets dir> <main chunk> <out file>
// The English notes are written inline in the chunk as lingui calls (`o._({id, message:[text]})`);
// the i18n-*-changelog chunks only hold translations. Arrays are found by code shape, not by minified
// names, and evaluated in a sandbox. Anything unexpected throws so the updater stops loudly.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

// Compare the published journal, not build-introduction claims. Keep both sides in the report.
export function compareChangelog(before, after) {
  const rows = (c) => [
    ...c.unreleased.map((line, index) => ({ line, date: null, version: 'next', index })),
    ...c.days.flatMap((d) => d.waves.flatMap((w) => w.lines.map((line, index) => ({ line, date: d.date, version: w.version, index })))),
  ];
  const key = (r) => r.line.id ?? r.line.msgId;
  const old = new Map(rows(before).map((r) => [key(r), r]));
  const next = new Map(rows(after).map((r) => [key(r), r]));
  const changes = [];
  for (const id of new Set([...old.keys(), ...next.keys()])) {
    const a = old.get(id),
      b = next.get(id);
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      changes.push({ type: !a ? 'added' : !b ? 'removed' : 'revised or regrouped/reordered', id, before: a ?? null, after: b ?? null });
    }
  }
  const groups = (c) => c.days.map((d) => ({ date: d.date, versions: d.waves.map((w) => w.version) }));
  if (JSON.stringify(groups(before)) !== JSON.stringify(groups(after))) {
    changes.push({ type: 'date/version groups changed', before: groups(before), after: groups(after) });
  }
  return changes;
}

// Imports are side-effect free so updater reports and regression fixtures use the same contract.
export function extractChangelog(dir, main) {
  const chunk = readdirSync(dir).find((f) => /^changelog-panel-[A-Za-z0-9_-]{8}\.js$/.test(f));
  if (!chunk) throw new Error(`no changelog-panel chunk in ${dir}`);
  const src = readFileSync(join(dir, chunk), 'utf8');

  // Index just past the bracket that closes the one opening at `start`, skipping template literals.
  function closeOf(start) {
    const stack = [];
    for (let i = start; i < src.length; i++) {
      const c = src[i];
      if (c === '`') {
        for (i++; i < src.length && src[i] !== '`'; i++) {
          if (src[i] === '\\') i++;
          else if (src[i] === '$' && src[i + 1] === '{') throw new Error(`interpolated template at ${i} in ${chunk}`);
        }
      } else if ('([{'.includes(c)) stack.push(c);
      else if (')]}'.includes(c)) {
        stack.pop();
        if (!stack.length) return i + 1;
      }
    }
    throw new Error(`unbalanced literal at ${start} in ${chunk}`);
  }
  const need = (m, what) => {
    if (!m) throw new Error(`${what} not found in ${chunk}; update tools/dump-changelog.mjs`);
    return m;
  };
  const literalOf = (name) => {
    const at = need(src.match(new RegExp(`(?:var |,)${name.replace('$', '\\$')}=\\[`)), `declaration of ${name}`);
    const start = at.index + at[0].length - 1;
    return src.slice(start, closeOf(start));
  };

  // Unreleased notes are sorted and wrapped at render time; dated history is a list of thunks.
  const sorted = need(src.match(/([\w$]+)\.toSorted\(([\w$]+)\)\.map\(\w+=>[\w$]+\(\w+\.id,\w+\.note\(\)\)\)/), 'unreleased notes');
  const [, unreleasedName, comparator] = sorted;
  const historyName = need(src.match(/\.\.\.([\w$]+)\.map\((\w+)=>\2\(\)\)\]/), 'dated history')[1];
  // The newest dates are inline: `<name>=[{date:...},...<history>.map(e=>e())]`.
  const inline = need(src.match(/[\w$]+=\[\{date:`/), 'inline newest dates');
  const inlineStart = inline.index + inline[0].indexOf('[');
  const days = src.slice(inlineStart, closeOf(inlineStart));
  // Helper functions (kind/text, about, id) sit between the imports and the unreleased array.
  const importsEnd = [...src.matchAll(/import\{[^}]*\}from"[^"]+";/g)].at(-1);
  const helpers = src.slice(
    importsEnd ? importsEnd.index + importsEnd[0].length : 0,
    src.search(new RegExp(`var ${unreleasedName.replace('$', '\\$')}=\\[`)),
  );
  if (!/^(function [\w$]+\([^)]*\)\{[^]*?\})+$/.test(helpers))
    throw new Error(`unexpected code before the notes in ${chunk}; update tools/dump-changelog.mjs`);

  // Lingui message call: `<obj>._({id:`x`,message:[`text`]})`. Only plain single-string messages are expected.
  const msgCall = /\b[\w$]+\._\(\{id:/g;
  const T = (d) => {
    if (!Array.isArray(d.message) || d.message.length !== 1 || typeof d.message[0] !== 'string')
      throw new Error(`unexpected message shape for ${d.id} in ${chunk}`);
    return { msgId: d.id, text: d.message[0] };
  };
  const code =
    `${helpers}\nconst ${unreleasedName}=${literalOf(unreleasedName)};\nconst ${historyName}=${literalOf(historyName)};\n({ unreleased: ${unreleasedName}.sort(${comparator}).map((n) => ({ ...n.note(), id: n.id, added: n.added })), days: ${days} });`.replace(
      msgCall,
      '__T({id:',
    );
  const data = vm.runInNewContext(code, { __T: T }, { timeout: 1000 });

  // Flatten {kind, text:{msgId,text}, about} into {id, kind, text, msgId, about}, keeping the existing file's key order.
  const line = ({ id, kind, text, about, added }) => {
    if (typeof text?.text !== 'string') throw new Error(`note ${id} has no message in ${chunk}`);
    return { id, kind, text: text.text, msgId: text.msgId, ...(about ? { about } : {}), ...(added ? { added } : {}) };
  };
  const result = {
    build: main,
    chunk,
    source: { url: `https://tibo.dog/assets/${chunk}`, sha256: createHash('sha256').update(src).digest('hex') },
    extracted: new Date().toISOString().slice(0, 10),
    note: "Every English entry of the in-game What's new panel, in display order: dates newest first; unreleased notes use the panel's own comparator, not declaration order. English is the source text inside the chunk; the i18n-*-changelog-*.js chunks hold translations only. unreleased: notes not yet given a version; the panel lists them first under the player's own version. Grouping is official publication history, not measured build-introduction evidence. Generated by tools/dump-changelog.mjs.",
    unreleased: data.unreleased.map(line),
    days: data.days.map((d) => ({ date: d.date, waves: d.waves.map((w) => ({ version: w.version, lines: w.lines.map(line) })) })),
  };
  const all = [...result.unreleased, ...result.days.flatMap((d) => d.waves.flatMap((w) => w.lines))];
  if (!result.days.length || !all.length) throw new Error(`empty journal in ${chunk}`);
  for (const field of ['id', 'msgId']) {
    const values = all.map((l) => l[field]).filter((v) => v !== undefined);
    if (new Set(values).size !== values.length) throw new Error(`duplicate note ${field} in ${chunk}`);
  }
  return JSON.parse(JSON.stringify(result));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [dir, main, out] = process.argv.slice(2);
  const result = extractChangelog(dir, main);
  writeFileSync(out, JSON.stringify(result, null, 1) + '\n');
  console.log(
    JSON.stringify({
      chunk: result.chunk,
      unreleased: result.unreleased.length,
      days: result.days.length,
      entries: result.days.reduce((n, d) => n + d.waves.reduce((m, w) => m + w.lines.length, 0), 0),
    }),
  );
}
