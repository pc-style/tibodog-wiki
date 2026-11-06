// Mirrors a tibo.dog build (index.html and every hashed asset it references) into .cache/<main chunk>/.
// Usage: node tools/fetch-build.mjs [--site https://tibo.dog/] [main-XXXXXXXX.js]
// Prints JSON: { main, dir, count, chunks: {base: file} }
// Old hashed files often 404 on tibo.dog; the detector's R2 archive keeps every build it saw.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = process.argv.includes('--site') ? process.argv[process.argv.indexOf('--site') + 1] : 'https://tibo.dog/';
export const ARCHIVE = process.env.TIBO_ARCHIVE ?? 'https://tibodog-game-detector.pcstyle.workers.dev/archive/';
export const ASSET = /[A-Za-z0-9_.-]+-[A-Za-z0-9_-]{8}\.(?:js|css|png|webp|jpg|svg|json|wasm|woff2|mp3|ogg|wav)\b/g;
const TEXT = /\.(js|css|svg|json)$/;
const UA = { 'user-agent': 'tibodog-wiki-updater (+https://www.tibodog.wiki/about)' };

// Tries each URL in order; returns bytes or null when every source answers 404.
async function get(urls) {
  let last;
  for (const url of urls) {
    const r = await fetch(url, { headers: UA }).catch((e) => ({ ok: false, status: e.message }));
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    last = `${r.status} ${url}`;
  }
  if (/^404 /.test(last)) return null;
  throw new Error(last);
}

// Mirrors the build whose entry chunk is `main`, or the one index.html serves now.
export async function mirror(site = SITE, main) {
  let html = null;
  if (!main) {
    html = (await get([site])).toString();
    main = html.match(/assets\/(main-[A-Za-z0-9_-]{8}\.js)/)?.[1];
    if (!main) throw new Error('no main chunk in index.html');
  }
  const root = join(ROOT, '.cache', main.replace(/\.js$/, ''));
  const dir = join(root, 'assets');
  mkdirSync(dir, { recursive: true });
  const index = join(root, 'index.html');
  if (html) writeFileSync(index, html);
  else if (!existsSync(index)) {
    // The served HTML of an old build exists only in the archive.
    const archived = await get([new URL(`${main}/index.html`, ARCHIVE).href]).catch(() => null);
    if (archived) writeFileSync(index, archived);
  }
  const seen = new Set();
  const queue = [main, ...(existsSync(index) ? readFileSync(index, 'utf8').match(ASSET) ?? [] : [])];
  while (queue.length) {
    const batch = queue.splice(0, 16).filter((f) => !seen.has(f));
    batch.forEach((f) => seen.add(f));
    await Promise.all(
      batch.map(async (f) => {
        const p = join(dir, f);
        if (!existsSync(p)) {
          const body = await get([new URL(`assets/${f}`, site).href, new URL(`assets/${f}`, ARCHIVE).href]);
          if (!body) {
            if (f === main) throw new Error(`404 ${main} on ${site} and in the archive`);
            return; // a name-shaped string that is not a file
          }
          writeFileSync(p, body);
        }
        if (TEXT.test(f)) for (const m of readFileSync(p, 'utf8').match(ASSET) ?? []) if (!seen.has(m)) queue.push(m);
      }),
    );
  }
  const files = [...seen].filter((f) => existsSync(join(dir, f)));
  const chunks = Object.fromEntries(files.filter((f) => f.endsWith('.js')).map((f) => [f.replace(/-[A-Za-z0-9_-]{8}\.js$/, ''), f]));
  return { main, dir, files, chunks };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const m = await mirror(SITE, process.argv.slice(2).find((a) => /^main-.*\.js$/.test(a)));
  console.log(JSON.stringify({ main: m.main, dir: m.dir, count: m.files.length, chunks: m.chunks }, null, 1));
}
