import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { loadGame, Run } from './play.mjs';

test('headless runs install original combat and area rules from either chunk layout', async () => {
  for (const separate of [false, true]) {
    const main = `main-${randomUUID()}.js`;
    const dir = new URL(`../.cache/${main.slice(0, -3)}/assets/`, import.meta.url);
    mkdirSync(dir, { recursive: true });
    try {
      writeFileSync(new URL(main, dir), '');
      writeFileSync(new URL('boot-12345678.js', dir), 'export const registry = { weapon() {}, allWeapons: [] };');
      writeFileSync(new URL('sim-12345678.js', dir), `export const sim = { Game: class {
        constructor(options) { this.state = { recordEvents: false, options }; }
      } };`);
      const rules = 'export const original = { rules: { act: "original combat" }, areas: { lay: "original areas" } };';
      writeFileSync(new URL('run-extras-12345678.js', dir), separate
        ? 'throw new Error("UI extras must not load for a headless run");'
        : rules.replace('rules:', 'choicePanel() {}, rules:'));
      if (separate) writeFileSync(new URL('run-rules-12345678.js', dir), rules);
      const api = await loadGame(main);
      const run = new Run(api);
      assert.equal(run.state.options.legendary.act, 'original combat');
      assert.equal(run.state.options.areas.lay, 'original areas');
    } finally {
      rmSync(new URL('../', dir), { recursive: true, force: true });
    }
  }
});
