// Event entry point: code does detection, import, checks, Git and live verification.
// Exit 20 requests writing/schema work; failures preserve the isolated worktree.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv.includes('--ship')) throw new Error('Use --ship for delivery, or tools/update.mjs for a read-only check');
const lock = join(root, '.amp/detector/automatic.lock');
mkdirSync(dirname(lock), { recursive: true });
try { mkdirSync(lock); } catch (e) {
  if (e.code !== 'EEXIST') throw e;
  console.error('automatic: blocked (another programmatic update owns delivery; inspect the lock before retrying)');
  process.exit(1);
}
let cwd = root;
const run = (cmd, args) => execFileSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 64 << 20, timeout: 600000 });
const git = (...args) => run('git', args).trim();
const get = async (url) => {
  const r = await fetch(`${url}${url.includes('?') ? '&' : '?'}fresh=${Date.now()}`, { headers: { 'cache-control': 'no-cache' }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
  return r.text();
};
const tests = () => ['tools', 'pages', 'tools/detector'].flatMap((d) => readdirSync(join(cwd, d)).filter((f) => f.endsWith('.test.mjs')).map((f) => `${d}/${f}`));
const checks = (main) => {
  for (const args of [['build.mjs'], ['tools/check-quotes.mjs', `.cache/${main.slice(0, -3)}/assets`], ['check-middleware.mjs'], ['--test', ...tests()]]) console.log(run('node', args));
  git('diff', '--check');
};
let clean = false;
let worktree;
try {
  if (git('status', '--porcelain')) throw new Error('Host has concurrent changes; preserved them, no automatic fetch/rebase');
  git('fetch', '--quiet', 'origin', 'main');
  const documented = JSON.parse(git('show', 'origin/main:data/build.json'));
  const html = await get('https://tibo.dog/');
  const main = html.match(/assets\/(main-[A-Za-z0-9_-]{8}\.js)/)?.[1];
  if (!main) throw new Error('Game entry parse failed');
  const history = JSON.parse(git('show', 'origin/main:data/builds.json'));
  if (main === documented.main && history.every((b) => b.status === 'reviewed')) {
    const api = JSON.parse(await get('https://www.tibodog.wiki/api/index.json'));
    if (api.meta.wiki.commit !== git('rev-parse', 'origin/main').slice(0, 7)) throw new Error('Reviewed revision not live yet; inspect existing Git deployment');
    console.log(`automatic: up-to-date ${main}`);
    clean = true;
  } else {
    worktree = mkdtempSync(join(tmpdir(), 'tibodog-auto-'));
    git('worktree', 'add', '--detach', worktree, 'origin/main');
    cwd = worktree;
    symlinkSync(join(root, 'node_modules'), join(cwd, 'node_modules'), 'dir');
    mkdirSync(join(root, '.cache'), { recursive: true });
    symlinkSync(join(root, '.cache'), join(cwd, '.cache'), 'dir');
    console.log(run('node', ['build.mjs']));
    const output = run('node', ['tools/update.mjs', '--apply', '--auto']);
    console.log(output);
    if (!/^status: (identical|numeric|up-to-date)$/m.test(output)) {
      console.log(`automatic: needs-review; preserved ${worktree}; report .cache/${main.slice(0, -3)}/report.md`);
      process.exitCode = 20;
    } else {
      checks(main);
      git('add', 'data', 'pages', 'public/icons', 'paths.js');
      git('commit', '-m', `Update game data automatically: ${main}`);
      git('fetch', '--quiet', 'origin', 'main');
      git('rebase', 'origin/main');
      // A second updater may have changed the documented build. Never merge two releases.
      const remoteBuild = JSON.parse(git('show', 'origin/main:data/build.json'));
      if (remoteBuild.main !== documented.main) throw new Error('Concurrent updater changed the baseline; do not push');
      checks(main);
      const sha = git('rev-parse', 'HEAD');
      git('push', 'origin', 'HEAD:main');
      const ci = await fetch(readFileSync(join(root, '.amp/detector/webhook-url'), 'utf8').trim(), {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': `ci-${sha}` },
        body: JSON.stringify({ id: `ci-${sha}`, type: 'ci.subscribe', sha }), signal: AbortSignal.timeout(20000),
      });
      if (!ci.ok) throw new Error('Pushed; CI subscription delivery needs recovery');
      // Observe the existing Git integration; never trigger a duplicate deployment.
      const deadline = Date.now() + 10 * 60 * 1000;
      let live = false;
      let deployment;
      while (Date.now() < deadline) {
        const statuses = JSON.parse(run('gh', ['api', `repos/pc-style/tibodog-wiki/commits/${sha}/status`]));
        deployment = statuses.statuses.find((s) => /vercel/i.test(s.context));
        if (deployment?.state === 'failure' || deployment?.state === 'error') throw new Error(`Git deployment failed: ${deployment.target_url}`);
        const api = JSON.parse(await get('https://www.tibodog.wiki/api/index.json'));
        if (deployment?.state === 'success' && api.meta.wiki.commit === sha.slice(0, 7) && api.meta.build.main === main) { live = true; break; }
        await new Promise((resolve) => setTimeout(resolve, 15000));
      }
      if (!live) throw new Error('Pushed, but production readiness/live verification timed out');
      git('fetch', '--quiet', 'origin', 'main');
      if (git('rev-parse', 'origin/main') !== sha) throw new Error('origin/main advanced during delivery; recheck latest deployment');
      // Compare every published Markdown page, not just a status endpoint.
      const pages = [];
      const walk = (dir) => { for (const f of readdirSync(join(cwd, 'dist', dir), { withFileTypes: true })) { const p = join(dir, f.name); if (f.isDirectory()) walk(p); else if (p.endsWith('.md')) pages.push(p); } };
      walk('');
      // Only the two labelled wiki-deployment-time cells differ between local
      // and Vercel builds. Publication, research and measurement dates stay exact.
      const normalized = (s) => s.replace(/(\| Wiki last updated \| \*\*)[^*\n]+(\*\*)/g, '$1BUILD_TIME$2')
        .replace(/(\), wiki updated )[^|\n]+(?= \|)/g, '$1BUILD_TIME');
      for (let i = 0; i < pages.length; i += 8) await Promise.all(pages.slice(i, i + 8).map(async (p) => {
        const text = await get(`https://www.tibodog.wiki/${p}`);
        if (normalized(text) !== normalized(readFileSync(join(cwd, 'dist', p), 'utf8'))) throw new Error(`Live page differs: ${p}`);
      }));
      const versions = await get('https://www.tibodog.wiki/versions');
      if (versions.includes('Not reviewed yet')) throw new Error('Live history still contains an unreviewed build');
      const receipt = { main, sha, commit: `https://github.com/pc-style/tibodog-wiki/commit/${sha}`, deployment: deployment.target_url, pages: pages.length, checkedAt: new Date().toISOString() };
      writeFileSync(join(root, '.amp/detector/automatic-receipt.json'), JSON.stringify(receipt, null, 2));
      console.log(`automatic: shipped ${JSON.stringify(receipt)}`);
      clean = true;
    }
  }
} catch (e) {
  console.error(`automatic: blocked: ${e.message}${worktree ? `; preserved ${worktree}` : ''}`);
  process.exitCode = 1;
} finally {
  if (worktree && clean) { cwd = root; git('worktree', 'remove', worktree); }
  rmSync(lock, { recursive: true });
}
