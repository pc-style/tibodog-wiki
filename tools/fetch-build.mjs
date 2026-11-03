// Mirrors the live tibo.dog build into .cache/<main chunk>/ and dumps its data.
// Usage: node tools/fetch-build.mjs [--site https://tibo.dog/]
// Prints JSON: { main, dir, chunks: {base: file}, changed: bool }
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = process.argv.includes('--site') ? process.argv[process.argv.indexOf('--site') + 1] : 'https://tibo.dog/';
const CHUNK = /[A-Za-z0-9_.-]+-[A-Za-z0-9_-]{8}\.js/g;

async function get(url) {
  const r = await fetch(url, { headers: { 'user-agent': 'tibodog-wiki-updater (+https://tibodog-wiki.vercel.app/about)' } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

// Mirrors the build whose entry chunk is `main`, or the one index.html serves now.
export async function mirror(site = SITE, main) {
  const html = main ? null : await get(site);
  main ??= html.match(/assets\/(main-[A-Za-z0-9_-]{8}\.js)/)?.[1];
  if (!main) throw new Error('no main chunk in index.html');
  const dir = join(ROOT, '.cache', main.replace(/\.js$/, ''), 'assets');
  mkdirSync(dir, { recursive: true });
  if (html) writeFileSync(join(dir, '..', 'index.html'), html);
  const seen = new Set();
  const queue = [main];
  while (queue.length) {
    const batch = queue.splice(0, 16).filter((f) => !seen.has(f));
    batch.forEach((f) => seen.add(f));
    await Promise.all(
      batch.map(async (f) => {
        const p = join(dir, f);
        let src;
        if (existsSync(p)) src = readFileSync(p, 'utf8');
        else {
          try {
            src = await get(new URL(`assets/${f}`, site).href);
          } catch (e) {
            if (f === main) throw e;
            return; // a name-shaped string that is not a chunk
          }
          writeFileSync(p, src);
        }
        for (const m of src.match(CHUNK) ?? []) if (!seen.has(m)) queue.push(m);
      }),
    );
  }
  const files = [...seen].filter((f) => existsSync(join(dir, f)));
  // Sprite atlas images, needed for the icon crops.
  for (const f of files.filter((f) => /^atlas(-late)?-[A-Za-z0-9_-]{8}\.js$/.test(f))) {
    for (const png of readFileSync(join(dir, f), 'utf8').match(/atlas(-late)?-[A-Za-z0-9_-]{8}\.png/g) ?? []) {
      if (existsSync(join(dir, png))) continue;
      const r = await fetch(new URL(`assets/${png}`, site));
      if (!r.ok) throw new Error(`${r.status} ${png}`);
      writeFileSync(join(dir, png), Buffer.from(await r.arrayBuffer()));
    }
  }
  const chunks = Object.fromEntries(files.map((f) => [f.replace(/-[A-Za-z0-9_-]{8}\.js$/, ''), f]));
  return { main, dir, files, chunks };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const m = await mirror();
  console.log(JSON.stringify({ main: m.main, dir: m.dir, count: m.files.length, chunks: m.chunks }, null, 1));
}
