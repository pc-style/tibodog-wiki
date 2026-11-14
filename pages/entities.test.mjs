import { test } from 'node:test';
import assert from 'node:assert/strict';
import { biomePages, bossPages, dogPages, enemyPages, passivePages, weaponPages } from './entities.mjs';

test('boss HP tables show second-based schedule boundaries in minutes', () => {
  const body = bossPages().find((p) => p.path === '/bosses/harvester').body;
  assert.match(body, /\| 12 \| 3 \|/);
  assert.match(body, /\| 13\.5 \| 4 \|/);
  assert.match(body, /\| 15 \| 6 \|/);
  assert.doesNotMatch(body, /undefined|NaN/);
});

test('weapon infobox slow percentages show reduction, not remaining speed', () => {
  const pages = weaponPages();
  for (const [id, reduction] of [['starch-puddle', '45%'], ['gratin-puddle', '65%']]) {
    const page = pages.find((p) => p.path === `/weapons/${id}`);
    const shown = Object.fromEntries(page.infobox.rows)['On hit'];
    assert.ok(shown.includes(`−${reduction} speed`), shown);
  }
});

test('weapon rune sections follow source associations, not prefixes or evolved names', () => {
  const pages = weaponPages();
  const peeler = pages.find((p) => p.path === '/weapons/peeler').body;
  assert.match(peeler, /Backhand/);
  assert.match(peeler, /Haymaker/);
  assert.match(peeler, /Wide Peel/);
  assert.doesNotMatch(peeler, /Tot Sniper/);
  assert.match(pages.find((p) => p.path === '/weapons/tot-toss').body, /Tot Sniper/);
  assert.doesNotMatch(pages.find((p) => p.path === '/weapons/mandoline-fury').body, /## Weapon runes/);
});

test('dog pages describe active special abilities, not zero-radius fetch fallbacks', () => {
  const pages = dogPages();
  for (const [id, ability] of [['sigkitten', 'sigstop'], ['husky', 'howl'], ['newfoundland', 'catch'], ['retriever', 'fetch'], ['saluki', 'gale'], ['shiba', 'spirits'], ['whippet', 'tug']]) {
    const page = pages.find((p) => p.path === `/dogs/${id}`);
    const shown = page.infobox.rows.find(([label]) => label === 'Ability')[1];
    assert.ok(shown.includes(`\`${ability}\``), `${id}: ${shown}`);
    if (ability !== 'fetch') {
      assert.ok(!shown.includes('Brings pickups'));
    }
    if (id === 'shiba') {
      assert.match(Object.fromEntries(page.infobox.rows)['Ability every'], /Elite or boss death/);
    }
  }
});

test('Loot Sling describes automatic copies without changing the pickup-only wedge slings', () => {
  const pages = weaponPages();
  for (const id of ['loot-sling', 'gem-sling', 'gem-catapult']) {
    const page = pages.find((p) => p.path === `/weapons/${id}`);
    const rows = Object.fromEntries(page.infobox.rows);
    assert.match(rows.Trigger, /XP gem pickups/);
    if (id === 'loot-sling') {
      assert.match(rows.Trigger, /Automatic/);
      assert.match(rows.Attack, /evolved attacks/);
      assert.doesNotMatch(rows.Attack, /wedges/);
    } else {
      assert.doesNotMatch(rows.Trigger, /Automatic/);
      assert.match(rows.Attack, /wedges/);
    }
  }
});

test('Sprout Squad needs deaths while Root Legion also generates seedlings automatically', () => {
  const pages = weaponPages();
  const squad = Object.fromEntries(pages.find((p) => p.path === '/weapons/sprout-squad').infobox.rows);
  const legion = Object.fromEntries(pages.find((p) => p.path === '/weapons/root-legion').infobox.rows);
  assert.equal(squad.Trigger, 'Pest deaths');
  assert.match(squad.Attack, /seek nearby targets and bite/);
  assert.equal(legion.Trigger, 'Automatic reinforcements and pest deaths');
});

test('conditional effects and endgame placement keep their meaning after schema promotion', () => {
  const passive = passivePages().find((p) => p.path === '/passives/couch-potato');
  assert.match(Object.fromEntries(passive.infobox.rows).Stat, /couchPotato/);
  assert.match(passive.body, /"rampPerSec": 0.04/);
  assert.doesNotMatch(passive.body, /undefined/);
  const biome = biomePages().find((p) => p.path === '/biomes/russet-moor');
  assert.match(Object.fromEntries(biome.infobox.rows).Placement, /Endgame phase: endgameHunt/);
  const enemies = enemyPages();
  assert.match(enemies.find((p) => p.path === '/enemies/hunt-crow').body, /Hunt endgame enemy/);
  assert.doesNotMatch(enemies.find((p) => p.path === '/enemies/aphid').body, /Hunt endgame enemy/);
});
