// Loads the data extracted from the deployed tibo.dog build and exposes lookup helpers.
import { readFileSync } from 'node:fs';

const load = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), 'utf8'));

export const R = load('registry.json');
export const CFG = load('config.json');
export const TEXT = load('en-content.json');
export const DIFF = load('difficulty.json');
export const ICONS = load('../public/icons/manifest.json');

// Minified export names change with every game build, and objects move between the sim and boot
// chunks, so find each config object by its keys wherever it is exported.
const cfgBy = (...keys) => {
  const hits = Object.values(CFG).filter((v) => v && typeof v === 'object' && keys.every((x) => x in v));
  if (hits.length !== 1) throw new Error(`config object with keys ${keys.join(', ')}: ${hits.length} matches, expected 1`);
  return hits[0];
};
export const GAME = cfgBy('player', 'dash', 'scaling', 'win');
export const STORY = cfgBy('startChest', 'firstRush', 'ending');
export const FORMULA = cfgBy('critK', 'evasionK', 'cooldownCap');

// Which game build the data came from. Written by tools/update.mjs.
export const BUILD = load('build.json');
// Every game build this wiki has compared, oldest first. tools/update.mjs appends new ones.
export const BUILDS = load('builds.json');
// The game shows no version number, so the wiki numbers builds in the order it first saw them.
BUILDS.forEach((b, i) => (b.version = i + 1));
BUILD.version = BUILDS.find((b) => b.main === BUILD.main)?.version ?? null;
// When this copy of the wiki was built, which is when the deploy that serves it was made.
export const BUILT_AT = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
export const WIKI_COMMIT = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null;
// "2026-11-03T17:29:46Z" -> "3 Nov 2026, 17:29 UTC"; a bare date stays a date.
export const utc = (iso) => {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  return iso.length <= 10 ? day : `${day}, ${d.toISOString().slice(11, 16)} UTC`;
};

export const t = (key) => {
  const v = TEXT[`content.${key}`];
  return v ? v.join('') : undefined;
};

export const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
export const W = byId(R.allWeapons);
export const P = byId(R.passives);
export const I = byId(R.allItems);
export const E = byId(R.enemies);
export const B = byId(R.bosses);
export const BI = byId(R.biomes);
export const EV = byId(R.events);
export const D = byId(R.dogs);

export const name = {
  weapon: (id) => t(`weapon.${id}.name`) ?? id,
  passive: (id) => t(`passive.${id}.name`) ?? id,
  item: (id) => t(`item.${id}.name`) ?? id,
  enemy: (id) => t(`enemy.${id}.name`) ?? id,
  boss: (id) => t(`boss.${id}.name`) ?? id,
  biome: (id) => t(`biome.${id}.name`) ?? id,
  event: (id) => t(`event.${id}.name`) ?? id,
  dog: (id) => t(`dog.${id}.name`) ?? id,
  poi: (id) => t(`poi.${id}.name`) ?? id,
  botHelp: (id) => t(`botHelp.${id}.name`) ?? id,
};

export const path = {
  weapon: (id) => `/weapons/${id}`,
  passive: (id) => `/passives/${id}`,
  item: (id) => `/items/${id}`,
  enemy: (id) => `/enemies/${id}`,
  boss: (id) => `/bosses/${id}`,
  biome: (id) => `/biomes/${id}`,
  event: (id) => `/events/${id}`,
  dog: (id) => `/dogs/${id}`,
  poi: (id) => `/points-of-interest#${slug(name.poi(id))}`,
};

export function slug(s) {
  return String(s)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Token replaced by an <img> in HTML and removed in Markdown.
export const icon = (cat, id) => (ICONS[cat]?.[id] ? `{{icon:${cat}/${id}}}` : '');

export const link = (cat, id) => `[${name[cat](id)}](${path[cat](id)})`;
export const ilink = (cat, id) => `${icon(cat, id)}${link(cat, id)}`;

// Which category a catalyst id belongs to.
export const kindOf = (id) =>
  W[id] ? 'weapon' : P[id] ? 'passive' : I[id] ? 'item' : D[id] ? 'dog' : E[id] ? 'enemy' : B[id] ? 'boss' : null;

export function fmt(n, digits = 3) {
  if (n === undefined || n === null) return '';
  if (typeof n !== 'number') return String(n);
  // Five-digit and larger whole numbers get thousands separators (16,000) so they scan in tables.
  if (Number.isInteger(n)) return Math.abs(n) >= 10000 ? n.toLocaleString('en-US') : String(n);
  return String(Number(n.toFixed(digits)));
}
export const pct = (n) => `${fmt(n * 100, 2)}%`;
export const signedPct = (n) => `${n >= 0 ? '+' : ''}${fmt(n * 100, 2)}%`;

export const RARITY = [0, 1, 2, 3, 4].map((i) => t(`rarity.${i}.name`));

export const recipes = {
  evolutionOf: (weaponId) => R.evolutions.filter((e) => e.from === weaponId),
  unionsOf: (weaponId) => R.unions.filter((u) => u.from.includes(weaponId)),
  catalystFor: (id) => R.evolutions.filter((e) => e.catalyst === id),
  itemCatalystFor: (id) => R.evolvedItems.filter((e) => e.catalyst === id),
  itemEvolutionOf: (itemId) => R.evolvedItems.filter((e) => e.from === itemId),
};

// Biomes where an enemy appears, with its tier index (1-based).
export function enemyBiomes(enemyId) {
  const out = [];
  for (const b of R.biomes) {
    b.enemies.forEach((tier, i) => {
      if (tier.includes(enemyId)) out.push({ biome: b.id, tier: i + 1 });
    });
  }
  return out;
}

export const STAT_LABEL = {
  might: 'Damage',
  area: 'Area',
  cooldown: 'Cooldown',
  amount: 'Projectiles (amount)',
  speed: 'Projectile speed',
  duration: 'Duration',
  maxHp: 'Max HP',
  maxHpPct: 'Max HP (%)',
  armor: 'Armor',
  recovery: 'Recovery (HP/s)',
  moveSpeed: 'Move speed',
  critChance: 'Crit points',
  critDamage: 'Crit damage',
  evasion: 'Dodge points',
  curse: 'Curse',
  healOnKill: 'Heal on kill',
  thorns: 'Thorns',
  eliteDamage: 'Damage to elites and bosses',
  growth: 'XP gain',
  magnet: 'Pickup range',
  greed: 'Gold gain',
  luck: 'Luck',
  revival: 'Revivals',
  pierce: 'Pierce',
  knockback: 'Knockback',
  explodeOnKill: 'Explode-on-kill chance',
  chestDiscount: 'Purchase discount',
  dashCharges: 'Dash charges',
  dashCooldown: 'Dash cooldown',
  dashGrace: 'Post-dash invulnerability (s)',
};
export const statLabel = (k) => STAT_LABEL[k] ?? k;
