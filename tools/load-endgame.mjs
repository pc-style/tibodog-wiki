// Use the game's own lazy loader so the registry, lookup refresh callbacks and
// endgame simulation are installed together, just as they are in the browser.
import { readFile } from 'node:fs/promises';

export async function loadEndgame(boot) {
  const register = Object.values(boot).find((v) => typeof v === 'function' && /beforeSim&&/.test(String(v)));
  const loader = Object.values(boot).find((v) => typeof v === 'function' && /chunks:[\w$]+\.chunks,view:new/.test(String(v)));
  if (!register || !loader) return; // Builds before lazy endgame content.
  const fetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => String(url).startsWith('file:')
    ? new Response(await readFile(new URL(url)))
    : fetch(url, options);
  try {
    register();
    const pending = [];
    loader({ host: document.body, chunks: { slot: (arrive) => ({ want() { pending.push(arrive()); } }) } }).want();
    await Promise.all(pending);
  } finally {
    globalThis.fetch = fetch;
  }
}
