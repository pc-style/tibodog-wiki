---
name: playing-tibo
description: Plays and analyzes tibo.dog runs using the game's sim and shared-run reader. Use for build and item decisions, gameplay probes, wiki claims, or coverage gaps.
---

# Play tibo.dog

Reading minified code tells you what the game *should* do. Playing it shows what it *does*. Use both: find the mechanic in the code, then confirm it with a run, and cite the code quote as usual. A measurement is evidence in your report; the wiki still cites code, and can add a sentence such as "Measured in a headless run (seed `wiki`, build 39): …".

There are two ways to play:

| Need | Use |
|---|---|
| Numbers, timings, damage, drop rates, boss attacks, what a parameter changes, anything inside a run | **Headless sim** (`tools/play.mjs`) |
| Menus, Story flow, cutscenes, shared runs (`/r/…`), settings, encyclopedia, anything outside the sim | **Browser** (agent-browser on https://tibo.dog/) |

## Choosing a build

Read [meta.md](meta.md) for the November 8 Nightmare Daily sample, exact evolution paths, item priorities and evidence limits. Its starting recommendation is **Storm Sage → Starch Supercell**, then **Root Current** when the necessary slots and catalysts are available; **Storm Tot** and **Meteor Russet** are high-value item targets. Keep moving to feed Static Step sparks. This is a dated, fixed-kit Daily recommendation, not an all-mode tier list.

For new run links, use the game's `run-address-*.js` reader and card resolver, including extension sections, rather than reverse-engineering the binary format or scraping screenshots. Count a weapon's presence as damage history, not proof it occupies a final slot. Include item and set-rule damage separately. Compare within the same day, difficulty and ladder level; Nightmare ranks ladder before score. Recheck the live build and current recipes before reusing the recommendation. The reader workflow and limitations are in [meta.md](meta.md#refreshing-the-evidence).

## Headless sim

`tools/play.mjs` loads the game's own `sim-*.js` chunk in Node and steps it at 60 ticks per second, about 400× faster than real time. Runs are deterministic: the same seed and inputs give the same result. With no `--build`, it plays the build in `data/build.json` and mirrors that build into `.cache/` first if needed.

```sh
node tools/play.mjs --minutes 5                  # autoplay summary: weapons, damage by source, kills, events
node tools/play.mjs --god --seed s1 scenario.mjs # run your own experiment
node tools/play.mjs --build main-XXXXXXXX.js --minutes 2   # smoke-test a new build
```

Options: `--seed`, `--mode` (`standard`, `story`), `--difficulty` (`easy`, `normal`, `hard`, `nightmare`), `--god` (HP refilled every tick; hits still land and are recorded).

A scenario is a module whose default export gets a `Run` and returns JSON. Write one per question, in a scratch directory outside the repo, and delete it when you are done:

```js
// How much does Peeler deal alone in 60 s while Tibo stands still?
export default async (run) => {
  run.give('weapon', 'peeler');
  run.stop().step(60);
  return { peeler: run.summary().damageBySource.peeler, hits: run.events.filter((e) => e.type === 'playerHit').length };
};
```

`Run` API:

- `move(dx, dy)`, `stop()`, `dash(dx, dy)`: input, as a stick direction.
- `step(seconds, each?)`: advance time; `each(run)` runs before every tick, so you can steer and record, and returning `true` stops early.
- `give('weapon' | 'passive', id)`: one level, through the game's own level-up pick (so evolutions, unions and catalysts behave normally). `give('item', id)` or `giveItem(id)`: one stack, through the same item map and stat recompute that chests use.
- `warp(seconds)`: move the run clock forward. Bosses, events and spawn tiers follow the clock; for example `warp(600)` reaches the 10:00 boss.
- `stat(name)`, `stats()`: final stats after the game's formulas (`damageMult`, `cooldownMult`, `critChance`, `armor`, …).
- `summary()`, `weapons()`, `events` (every sim event with its time `t`), `choices` (every card offered and picked), `state` (the raw sim state), `game` (the raw `Game`: `setInput`, `dash`, `step`, `choice`, `choose`, `runLog`).
- `policy`: how choices are answered. The default takes the first offer. Pass `new Run(api, { policy: (choice, run) => ({ type: 'pick', index }) })` from your own script, or set `run.policy` in a scenario.

Raw state is struct-of-arrays: `state.enemies.hp[i]`, `state.player.x[state.me]`, `state.enemies.pool.count`. Look at `Object.keys(run.state.<thing>)` before guessing.

### Rules for headless evidence

- State the build, seed, mode, difficulty and every `give`/`warp` you used. Without them a number cannot be reproduced.
- `give`, `warp` and `--god` are shortcuts. They skip how you would normally get there, so do not use them to support claims about *how* you get something (drop odds, unlock order). Play those naturally, across several seeds.
- Report spread across seeds (at least 3 to 5) for anything random. One seed is an anecdote.
- If `tools/play.mjs` cannot find `Game`, the stat enum or the recompute function in a new build, fix the lookup in `tools/play.mjs`; the lookups match code shape, not minified names. Do not paper over it.

## Browser

The orb's Chromium has WebGL 2 and runs the live game. Load `using-agent-browser` first for its commands. Then:

1. `agent-browser open https://tibo.dog/`, then `agent-browser set viewport 1280 720 2`.
2. Choose a difficulty by its button text (`agent-browser find text "Normal" click`). Start the run by clicking the big RESET button: `agent-browser mouse move 640 290`, then `mouse down`, then `mouse up`. Story is the button under it.
3. agent-browser cannot hold keys, so inject [hold-keys.js](hold-keys.js) with `agent-browser eval --stdin < .claude/skills/playing-tibo/hold-keys.js`. Then call `__hold('Space', 2500)` to skip a cutscene, and `__hold('KeyD', 2000)` and so on to walk (WASD). Level-up cards take `1`, `2`, `3` (`agent-browser press 1`); `R` rerolls, `X` skips, `B` banishes.
4. Screenshot each state you rely on, inspect it, and keep the ones you cite under `.amp/in/artifacts/`.

The browser always plays the **live** build. Check that it matches the build you are documenting before you cite it.

## Closing coverage gaps

The open questions live on `/coverage` (`pages/system.mjs`). When a run settles one, update the page text that made the claim and remove or narrow the coverage bullet in the same change. Say in the commit or report which run settled it.
