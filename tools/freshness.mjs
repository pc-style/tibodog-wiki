// Read-only freshness check: how far this checkout, the live game and the production wiki have drifted.
// Usage: node tools/freshness.mjs [--no-fetch] [--offline]
//   Runs from .agents/resume on every orb wake, so it must stay fast (about 5 s worst case) and never
//   change the checkout: it only runs `git fetch`, reads refs and status, and makes two HTTP GETs.
// Prints one line per kind of drift and writes the observations to .cache/freshness.json.
// Three separate questions, never mixed:
//   git     is this checkout behind, ahead of, or diverged from origin/main, and is it dirty?
//   game    does tibo.dog serve the build that origin/main documents (data/build.json)?
//   deploy  does production report the origin/main commit (/api/index.json meta.wiki.commit)?
// This is a diagnostic, not a gate: before pushing or deploying, fetch, rebase and recheck explicitly.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const GAME = 'https://tibo.dog/';
export const WIKI = 'https://tibodog-wiki.vercel.app';

// Pure: turns raw observations into one verdict per kind. null means "could not observe".
export function classify(o) {
  const git = !o.git ? { status: 'unknown', note: 'not a git checkout' }
    : o.git.behind === null ? { status: 'unknown', note: 'origin/main not available' }
    : o.git.ahead && o.git.behind ? { status: 'diverged', note: `${o.git.ahead} ahead, ${o.git.behind} behind origin/main; rebase before pushing` }
    : o.git.behind ? { status: 'behind', note: `${o.git.behind} commit(s) behind origin/main; pull --ff-only${o.git.dirty ? ' after committing or stashing your own changes' : ''}` }
    : o.git.ahead ? { status: 'ahead', note: `${o.git.ahead} unpushed commit(s)` }
    : { status: 'current', note: 'matches origin/main' };
  if (git.status !== 'unknown' && o.git.dirty) git.note += `; ${o.git.dirty} uncommitted path(s) (may belong to another agent: do not reset them)`;
  if (o.git && !o.git.fetched && git.status !== 'unknown') git.note += '; fetch failed, origin/main may be stale';

  const game = !o.liveMain ? { status: 'unknown', note: 'tibo.dog not reachable' }
    : !o.documentedMain ? { status: 'unknown', note: 'documented build not readable' }
    : o.liveMain === o.documentedMain ? { status: 'current', note: `tibo.dog serves ${o.liveMain}, as documented` }
    : { status: 'drift', note: `tibo.dog serves ${o.liveMain}; origin/main documents ${o.documentedMain}. Check the monitor and recent threads before updating` };

  const short = o.originMain?.slice(0, 7);
  const deploy = !o.deployedCommit ? { status: 'unknown', note: 'production commit not reported' }
    : !short ? { status: 'unknown', note: 'origin/main not available' }
    : o.deployedCommit === short ? { status: 'current', note: `production runs ${short} (origin/main)` }
    : { status: 'lag', note: `production runs ${o.deployedCommit}; origin/main is ${short}. One owner deploys; coordinate first` };
  return { git, game, deploy };
}

const sh = (args, timeout) => {
  try { return execFileSync('git', args, { encoding: 'utf8', timeout, stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; }
};
const get = async (url) => {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(3000), headers: { 'cache-control': 'no-cache' } });
    return r.ok ? await r.text() : null;
  } catch { return null; }
};

export async function observe({ fetchGit = true, online = true } = {}) {
  const inRepo = sh(['rev-parse', '--is-inside-work-tree'], 2000) === 'true';
  const fetched = inRepo && fetchGit ? sh(['fetch', '--quiet', 'origin', 'main'], 4000) !== null : false;
  const originMain = inRepo ? sh(['rev-parse', '--verify', '-q', 'origin/main'], 2000) : null;
  const counts = originMain ? sh(['rev-list', '--left-right', '--count', 'HEAD...origin/main'], 2000)?.split(/\s+/).map(Number) : null;
  const git = inRepo ? {
    fetched,
    branch: sh(['rev-parse', '--abbrev-ref', 'HEAD'], 2000),
    head: sh(['rev-parse', 'HEAD'], 2000),
    ahead: counts ? counts[0] : null,
    behind: counts ? counts[1] : null,
    dirty: (sh(['status', '--porcelain'], 3000) ?? '').split('\n').filter(Boolean).length,
  } : null;
  let documentedMain = null;
  try { documentedMain = JSON.parse(sh(['show', 'origin/main:data/build.json'], 2000)).main ?? null; } catch {}
  const [page, index] = online ? await Promise.all([get(`${GAME}?fresh=${Date.now()}`), get(`${WIKI}/api/index.json?fresh=${Date.now()}`)]) : [null, null];
  let deployedCommit = null;
  try { deployedCommit = JSON.parse(index).meta.wiki.commit ?? null; } catch {}
  return { checkedAt: new Date().toISOString(), originMain, git, documentedMain, liveMain: page?.match(/main-[A-Za-z0-9_-]+\.js/)?.[0] ?? null, deployedCommit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const o = await observe({ fetchGit: !process.argv.includes('--no-fetch'), online: !process.argv.includes('--offline') });
  const v = classify(o);
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  try { mkdirSync(join(root, '.cache'), { recursive: true }); writeFileSync(join(root, '.cache/freshness.json'), JSON.stringify({ ...o, verdict: v }, null, 1) + '\n'); } catch {}
  console.log(`freshness ${o.checkedAt}`);
  for (const [k, r] of Object.entries(v)) console.log(`  ${k.padEnd(6)} ${r.status}: ${r.note}`);
}
