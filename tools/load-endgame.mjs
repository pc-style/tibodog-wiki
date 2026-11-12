// Use the game's own lazy loader so the registry, lookup refresh callbacks and
// endgame simulation are installed together, just as they are in the browser.
import { readFile } from 'node:fs/promises';

export async function loadEndgame(boot, sim = {}) {
  const runHooks = Object.values(sim).find((v) => typeof v?.runHooks === 'function')?.runHooks;
  const register = Object.values(boot).find((v) => typeof v === 'function' && /beforeSim&&/.test(String(v)));
  const loader = Object.values(boot).find((v) => typeof v === 'function' && /chunks:[\w$]+\.chunks,view:new/.test(String(v)));
  if (!runHooks && (!register || !loader)) return; // Builds before lazy endgame content.
  const fetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => String(url).startsWith('file:')
    ? new Response(await readFile(new URL(url)))
    : fetch(url, options);
  try {
    const pending = [];
    const chunks = { slot: (arrive) => ({ want() { pending.push(arrive()); } }) };
    if (runHooks) {
      // Current clients register and request lazy content through the simulation's
      // public run hooks. Request content without showing a localized loading
      // overlay: a stopped run can prefetch but cannot enter a phase.
      runHooks({ chunks, hud: { root: document.body } }).endgameHolds({
        bigUpdate: { endgameHunt: true }, endgameLive: { built: false },
        endgameShared: { built: false }, // Current run state; endgameLive above supports older builds.
        over: true, clock: { ticks: 0 },
      });
    } else {
      register();
      loader({ host: document.body, chunks }).want();
    }
    await Promise.all(pending);
  } finally {
    globalThis.fetch = fetch;
  }
}
