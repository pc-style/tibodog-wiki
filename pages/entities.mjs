// Entity pages: weapons, passives, items, dogs, enemies, bosses, biomes, events.
import {
  R, GAME, t, W, P, I, E, B, BI, EV, D, name, path, icon, link, ilink, kindOf, fmt, pct, signedPct,
  RARITY, recipes, enemyBiomes, statLabel, slug,
} from '../lib/data.mjs';

const SRC_REG = '`registry` object exported by `boot-CyXYlW39.js` (the game\'s content definitions)';
const SRC_TEXT = 'English names and descriptions from `i18n-en-content-D4gK8lyk.js`';
const RAW_NOTE =
  'Values are the raw numbers from the game\'s definitions, before Tibo\'s global stat multipliers, difficulty and time scaling. Field names in `code` are the game\'s internal names. Attack descriptions such as “Melee slash” are this wiki\'s summary of the internal attack `kind`.';

const table = (head, rows) =>
  `| ${head.join(' | ')} |\n|${head.map(() => '---').join('|')}|\n${rows
    .map((r) => `| ${r.map((c) => String(c ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ')} |`)
    .join('\n')}\n`;

const json = (o) => '`' + JSON.stringify(o) + '`';

// Flatten nested behaviour parameters into key/value rows.
function flatRows(obj, prefix = '') {
  const rows = [];
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length) rows.push(...flatRows(v, key));
    else rows.push([`\`${key}\``, Array.isArray(v) ? json(v) : v && typeof v === 'object' ? '(present)' : fmt(v)]);
  }
  return rows;
}

const WSTATS = [
  ['damage', 'Damage'],
  ['cooldown', 'Cooldown (s)'],
  ['amount', 'Amount'],
  ['area', 'Area'],
  ['speed', 'Speed'],
  ['duration', 'Duration (s)'],
  ['pierce', 'Pierce'],
  ['knockback', 'Knockback'],
  ['interval', 'Interval (s)'],
];

const BEHAVIOR = {
  pool: 'Leaves a damaging area on the ground',
  spiral: 'Fires projectiles in a spiral',
  cone: 'Hits a cone in front of Tibo',
  targetShot: 'Shoots at a targeted enemy',
  facingShot: 'Shoots in the direction Tibo faces',
  beam: 'Fires a beam',
  turret: 'Places a turret',
  slash: 'Melee slash',
  boomerang: 'Thrown projectile that returns',
  guard: 'Defensive guard around Tibo',
  homing: 'Homing projectiles',
  nova: 'Burst centred on Tibo',
  tether: 'Tether between Tibo and enemies',
  rain: 'Projectiles fall from above',
  nuke: 'Large screen-wide blast',
  ring: 'Ring around Tibo',
  strike: 'Strikes at enemy positions',
  bouncer: 'Bouncing projectiles',
  orbit: 'Projectiles orbit Tibo',
  explosive: 'Explodes on impact',
  lob: 'Lobbed (arcing) projectile',
  chain: 'Chains between enemies',
  aura: 'Constant aura around Tibo',
  mine: 'Places mines',
  familiar: 'Summons a helper',
};
const behaviorText = (k) => (BEHAVIOR[k] ? `${BEHAVIOR[k]} (\`${k}\`)` : `\`${k}\``);

const ONHIT = { slow: 'Slows', freeze: 'Freezes', burn: 'Burns' };

const tierLabel = { base: 'Base weapon', evolved: 'Evolution', union: 'Union' };

export function weaponPages() {
  const pages = [];
  for (const w of R.allWeapons) {
    const n = name.weapon(w.id);
    const desc = t(`weapon.${w.id}.desc`) ?? '';
    const maxLevel = w.levels ? w.levels.length + 1 : undefined;
    const starter = GAME.player.startWeapons.includes(w.id);
    const potetoGift = GAME.poteto.newWeapons.includes(w.id);
    const evo = recipes.evolutionOf(w.id);
    const unions = recipes.unionsOf(w.id);
    const onHit = w.behavior.onHit;

    const rows = [
      ['Type', tierLabel[w.tier]],
      ['Trigger', w.on === 'dash' ? 'When Tibo dashes' : 'Automatic (cooldown)'],
      ['Attack', behaviorText(w.behavior.kind)],
      ['On hit', onHit ? `${ONHIT[onHit.kind] ?? onHit.kind}${onHit.factor ? ` (×${fmt(onHit.factor)} speed` : ''}${onHit.seconds ? `${onHit.factor ? ', ' : ' ('}${fmt(onHit.seconds)} s)` : onHit.factor ? ')' : ''}` : ''],
      ...WSTATS.map(([k, l]) => [l, fmt(w.base[k])]),
      ['Max level', maxLevel],
      ['Offer weight', w.weight],
    ];
    if (w.from && w.tier === 'evolved') rows.push(['Evolves from', `${ilink('weapon', w.from)} (level 8) + ${ilink(kindOf(w.catalyst), w.catalyst)}`]);
    if (w.tier === 'union') rows.push(['Union of', w.from.map((x) => ilink('weapon', x)).join(' + ')]);
    for (const e of evo) rows.push(['Evolves into', `${ilink('weapon', e.id)} (with ${ilink(kindOf(e.catalyst), e.catalyst)})`]);
    for (const u of unions) rows.push(['Union', `${ilink('weapon', u.id)} (with ${u.from.filter((x) => x !== w.id).map((x) => ilink('weapon', x)).join(', ')})`]);

    let body = '';
    body += `## Stats\n\n${RAW_NOTE}\n\n`;
    if (w.levels) {
      const cur = { ...w.base };
      const used = WSTATS.filter(([k]) => w.levels.some((l) => l[k] !== undefined));
      const lrows = [[1, 'Acquired', ...used.map(([k]) => fmt(cur[k]))]];
      w.levels.forEach((l, i) => {
        for (const [k, v] of Object.entries(l)) cur[k] = (cur[k] ?? 0) + v;
        const change = Object.entries(l)
          .map(([k, v]) => `${v >= 0 ? '+' : ''}${fmt(v)} ${WSTATS.find((s) => s[0] === k)?.[1].replace(/ \(s\)/, '').toLowerCase() ?? k}`)
          .join(', ');
        lrows.push([i + 2, change, ...used.map(([k]) => fmt(cur[k]))]);
      });
      body += `### Level progression\n\nEach level-up adds the listed change to the weapon's raw values. Totals are cumulative.\n\n`;
      body += table(['Level', 'Change', ...used.map(([, l]) => l)], lrows) + '\n';
      body += `### Base values\n\n` + table(['Stat', 'Level 1'], WSTATS.map(([k, l]) => [l, fmt(w.base[k])])) + '\n';
    } else {
      body += `${tierLabel[w.tier]}s have no level-ups in the game data; they use these fixed raw values.\n\n`;
      body += table(['Stat', 'Value'], WSTATS.map(([k, l]) => [l, fmt(w.base[k])])) + '\n';
    }
    body += `### Behaviour parameters\n\nRaw parameters of the attack (\`behavior\`), copied from the game definition. Their exact in-game effect is not documented by the game; names are descriptive only.\n\n`;
    body += table(['Parameter', 'Value'], flatRows(w.behavior)) + '\n';

    body += `## Obtaining\n\n`;
    const obt = [];
    if (w.tier === 'base') {
      obt.push(`Offered as a card on level-up (offer weight ${w.weight}).`);
      if (starter) obt.push('Listed in the game\'s `player.startWeapons` pool (see [Level-up](/level-up)).');
      if (potetoGift) obt.push('Can be given by [poteto\'s visit](/visitors) (listed in `poteto.newWeapons`).');
    }
    if (w.tier === 'evolved')
      obt.push(`Get ${ilink('weapon', w.from)} to level 8 while owning ${ilink(kindOf(w.catalyst), w.catalyst)} (any level), then open a [chest](/chests). See [Evolutions](/evolutions).`);
    if (w.tier === 'union')
      obt.push(`Own ${w.from.map((x) => ilink('weapon', x)).join(' and ')} (each max-level or evolved, at least one a level-8 base weapon), then open a [chest](/chests). The union replaces both weapons and frees a slot. See [Evolutions](/evolutions#unions).`);
    body += obt.map((x) => `- ${x}`).join('\n') + '\n\n';

    if (evo.length || unions.length) {
      body += `## Evolution\n\n`;
      body += table(
        ['Result', 'Requires', 'Type'],
        [
          ...evo.map((e) => [ilink('weapon', e.id), `${ilink('weapon', w.id)} (max level) + ${ilink(kindOf(e.catalyst), e.catalyst)}`, 'Evolution']),
          ...unions.map((u) => [ilink('weapon', u.id), u.from.map((x) => ilink('weapon', x)).join(' + '), 'Union']),
        ],
      ) + '\n';
    }
    body += `## Data\n\n\`\`\`json\n${JSON.stringify(w, null, 2)}\n\`\`\`\n`;

    pages.push({
      path: path.weapon(w.id),
      title: n,
      section: 'Weapons',
      crumbs: [['Weapons', '/weapons']],
      description: `${n} is ${/^[aeiou]/i.test(tierLabel[w.tier]) ? 'an' : 'a'} ${tierLabel[w.tier].toLowerCase()} in tibo.dog. ${desc}`.trim(),
      lead: `**${n}** is ${/^[aeiou]/i.test(tierLabel[w.tier]) ? 'an' : 'a'} ${tierLabel[w.tier].toLowerCase()} in tibo.dog. In-game description: “${desc}”`,
      infobox: { title: n, icon: `weapon/${w.id}`, caption: tierLabel[w.tier], rows },
      body,
      sources: [SRC_REG, SRC_TEXT],
      search: `${n} ${w.id} weapon ${w.behavior.kind}`,
    });
  }
  return pages;
}

function weaponRow(w) {
  return [
    `${icon('weapon', w.id)}${link('weapon', w.id)}`,
    w.on === 'dash' ? 'Dash' : 'Auto',
    `\`${w.behavior.kind}\``,
    fmt(w.base.damage),
    fmt(w.base.cooldown),
    fmt(w.base.amount),
    w.behavior.onHit?.kind ?? '',
  ];
}

export function weaponIndex() {
  const base = R.baseWeapons;
  let body = `tibo.dog has **${R.allWeapons.length} weapons**: ${base.length} base weapons, ${R.evolutions.length} evolutions and ${R.unions.length} unions. Weapons fire on their own; Tibo holds up to ${GAME.player.weaponSlots} at once. Base weapons level up to level 8 from level-up cards; evolutions and unions replace them (see [Evolutions](/evolutions)).\n\n`;
  body += `${RAW_NOTE}\n\n`;
  const head = ['Weapon', 'Trigger', 'Attack', 'Damage', 'Cooldown (s)', 'Amount', 'On hit'];
  body += `## Base weapons\n\n` + table([...head, 'Evolves into'], base.map((w) => [...weaponRow(w), recipes.evolutionOf(w.id).map((e) => ilink('weapon', e.id)).join(', ')])) + '\n';
  body += `## Evolutions\n\n` + table([...head, 'From'], R.evolutions.map((w) => [...weaponRow(w), `${ilink('weapon', w.from)} + ${ilink(kindOf(w.catalyst), w.catalyst)}`])) + '\n';
  body += `## Unions\n\n` + table([...head, 'From'], R.unions.map((w) => [...weaponRow(w), w.from.map((x) => ilink('weapon', x)).join(' + ')])) + '\n';
  body += `## Dash weapons\n\nThese weapons trigger when Tibo dashes instead of on a cooldown: ${R.allWeapons.filter((w) => w.on === 'dash').map((w) => ilink('weapon', w.id)).join(', ')}.\n`;
  return {
    path: '/weapons',
    title: 'Weapons',
    description: `All ${R.allWeapons.length} weapons in tibo.dog with base stats, attack types and evolutions.`,
    body,
    sources: [SRC_REG, SRC_TEXT],
    search: 'weapons list',
  };
}

export function evolutionPage() {
  let body = `Evolutions turn a maxed base weapon into a stronger weapon. Unions merge two weapons into one. Item evolutions upgrade an item once a passive reaches max level. All recipes below come straight from the game's recipe tables.\n\n`;
  body += `## How evolving works\n\n**Verified** from the game code (\`sim-D7a25DGD.js\`):\n\n- **Evolutions, unions and item evolutions only happen when a chest is opened** (elite, boss, cursed-extra and poteto gift chests, and the Tater Slots jackpot). Potato Crates, the Fry Cart and the Microwave give items, not chest rolls. See [Chests](/chests).\n- **Weapon evolution**: the base weapon is at max level (8) and you own the catalyst at any level.\n- **Union**: you own both partner weapons (or the evolution of one); each is max-level base or evolved, and at least one is a max-level base weapon. The union takes the first weapon's slot and removes the second, freeing a slot. The game's text simplifies this to “Unites with X into Y when both reach LV 8”.\n- **Choice**: if a weapon can both evolve and unite, the chest asks “Evolve or unite?”.\n- **Item evolution**: you hold the base item and the catalyst passive is at **max level (5)**. On the next chest, every copy of the item turns into the evolved item, and the base item stops dropping.\n- There is no time gate (\`chests.evolutionGateSec\` = ${GAME.chests.evolutionGateSec}).\n- From level ${GAME.levelUp.catalystGuaranteeLevel} of a base weapon, the level-up guarantees its missing catalyst passive as the last card if you have a free passive slot (see [Level-up](/level-up#catalyst-guarantee)).\n\n`;
  body += `## Weapon evolutions\n\n` + table(
    ['Result', 'Base weapon', 'Catalyst', 'Catalyst type'],
    R.evolutions.map((e) => [ilink('weapon', e.id), ilink('weapon', e.from), ilink(kindOf(e.catalyst), e.catalyst), kindOf(e.catalyst) === 'passive' ? 'Passive' : 'Item']),
  ) + '\n';
  body += `## Unions\n\nA union consumes both weapons and frees a weapon slot.\n\n` + table(
    ['Result', 'Weapon A', 'Weapon B'],
    R.unions.map((u) => [ilink('weapon', u.id), ilink('weapon', u.from[0]), ilink('weapon', u.from[1])]),
  ) + '\n';
  body += `## Item evolutions\n\nThe catalyst passive must be at max level (5).\n\n` + table(
    ['Result', 'Item', 'Catalyst passive (level 5)'],
    R.evolvedItems.map((e) => [ilink('item', e.id), ilink('item', e.from), ilink('passive', e.catalyst)]),
  ) + '\n';
  // Catalyst usage
  const cat = {};
  for (const e of R.evolutions) (cat[e.catalyst] ??= []).push(ilink('weapon', e.id));
  for (const e of R.evolvedItems) (cat[e.catalyst] ??= []).push(ilink('item', e.id));
  body += `## Catalysts by use\n\nPassives that unlock more than one recipe are worth keeping a slot for.\n\n` + table(
    ['Catalyst', 'Recipes', 'Unlocks'],
    Object.entries(cat)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([id, list]) => [ilink(kindOf(id), id), list.length, list.join(', ')]),
  );
  return {
    path: '/evolutions',
    title: 'Evolutions',
    description: `Every weapon evolution (${R.evolutions.length}), union (${R.unions.length}) and item evolution (${R.evolvedItems.length}) recipe in tibo.dog.`,
    body,
    sources: [SRC_REG, 'Recipe definitions in `boot-CyXYlW39.js`; chest evolution code in `sim-D7a25DGD.js`'],
    search: 'evolutions recipes unions catalysts',
  };
}

function perLevelText(p) {
  if (Array.isArray(p.perLevel)) return `${json(p.perLevel)} (value at levels 1–${p.perLevel.length})`;
  return `${p.perLevel} per level`;
}

export function passivePages() {
  const pages = [];
  for (const p of R.passives) {
    const n = name.passive(p.id);
    const desc = t(`passive.${p.id}.desc`) ?? '';
    const evo = recipes.catalystFor(p.id);
    const ievo = recipes.itemCatalystFor(p.id);
    const rows = [
      ['Stat', `${statLabel(p.stat)} (\`${p.stat}\`)`],
      ['Per level', perLevelText(p)],
      ['Max level', p.maxLevel],
      ['At max level', Array.isArray(p.perLevel) ? fmt(p.perLevel[p.maxLevel - 1]) : fmt(p.perLevel * p.maxLevel)],
      ['Extra', p.extra ? `${statLabel(p.extra.stat)} (\`${p.extra.stat}\`) ${p.extra.perLevel} per level` : ''],
      ['Offer weight', p.weight],
      ['Catalyst for', [...evo.map((e) => ilink('weapon', e.id)), ...ievo.map((e) => ilink('item', e.id))].join(', ')],
    ];
    let body = `## Levels\n\n`;
    const lv = [];
    for (let i = 1; i <= p.maxLevel; i++) {
      const v = Array.isArray(p.perLevel) ? p.perLevel[i - 1] : p.perLevel * i;
      lv.push([i, fmt(v), p.extra ? fmt(p.extra.perLevel * i) : undefined].filter((x) => x !== undefined));
    }
    body += table(['Level', `${statLabel(p.stat)} (\`${p.stat}\`) total`, ...(p.extra ? [`${statLabel(p.extra.stat)} total`] : [])], lv) + '\n';
    body += `Totals are added to Tibo's stat sum. How each stat turns into a multiplier (caps and diminishing returns) is on [Stats](/stats).\n\n`;
    if (p.thermal) {
      body += `## Heat\n\nGPU has a heat mechanic (\`thermal\`). Values by level:\n\n` + table(
        ['Level', 'Heat cap', 'Cooling per second'],
        p.thermal.cap.map((c, i) => [i + 1, c, p.thermal.coolPerSec[i]]),
      ) + `\nMax heat per volley: ${p.thermal.maxVolleyHeat}. When heat is full, weapons fire at ${fmt(p.thermal.throttleRate)}× rate for ${p.thermal.throttleSec} s (matches the in-game text “weapons fire at half speed for 3s”).\n\n`;
    }
    if (evo.length || ievo.length) {
      body += `## Catalyst for\n\n` + table(
        ['Result', 'Also needs'],
        [
          ...evo.map((e) => [ilink('weapon', e.id), `${ilink('weapon', e.from)} at max level`]),
          ...ievo.map((e) => [ilink('item', e.id), ilink('item', e.from)]),
        ],
      ) + '\n';
    }
    body += `## Data\n\n\`\`\`json\n${JSON.stringify(p, null, 2)}\n\`\`\`\n`;
    pages.push({
      path: path.passive(p.id),
      title: n,
      crumbs: [['Passives', '/passives']],
      description: `${n} is a passive in tibo.dog. ${desc}`,
      lead: `**${n}** is a passive upgrade in tibo.dog. In-game description: “${desc}”`,
      infobox: { title: n, icon: `passive/${p.id}`, caption: 'Passive', rows },
      body,
      sources: [SRC_REG, SRC_TEXT],
      search: `${n} ${p.id} passive ${p.stat} ${statLabel(p.stat)}`,
    });
  }
  return pages;
}

export function passiveIndex() {
  let body = `Passives raise Tibo's stats. Tibo holds up to ${GAME.player.passiveSlots} passives, each up to level 5. Many passives are also catalysts for [evolutions](/evolutions).\n\n`;
  body += table(
    ['Passive', 'Stat', 'Per level', 'Max', 'Catalyst for'],
    R.passives.map((p) => [
      `${icon('passive', p.id)}${link('passive', p.id)}`,
      statLabel(p.stat),
      Array.isArray(p.perLevel) ? p.perLevel.join(' / ') : fmt(p.perLevel),
      p.maxLevel,
      [...recipes.catalystFor(p.id).map((e) => ilink('weapon', e.id)), ...recipes.itemCatalystFor(p.id).map((e) => ilink('item', e.id))].join(', '),
    ]),
  );
  return {
    path: '/passives',
    title: 'Passives',
    description: `All ${R.passives.length} passives in tibo.dog with per-level stat values and the evolutions they unlock.`,
    body,
    sources: [SRC_REG, SRC_TEXT],
    search: 'passives list stats',
  };
}

function modsText(mods) {
  return Object.entries(mods ?? {})
    .map(([k, v]) => `${statLabel(k)} ${v >= 0 ? '+' : ''}${fmt(v)} (\`${k}\`)`)
    .join(', ');
}

function effectRows(effect) {
  if (!effect) return [];
  return flatRows(effect);
}

export function itemPages() {
  const pages = [];
  for (const it of R.allItems) {
    const n = name.item(it.id);
    const desc = t(`item.${it.id}.desc`) ?? '';
    const ievo = recipes.itemEvolutionOf(it.id);
    const asCatalyst = recipes.catalystFor(it.id);
    const rows = [
      ['Type', it.tier === 'evolved' ? 'Evolved item' : 'Item'],
      ['Rarity', `${RARITY[it.rarity]} (${it.rarity})`],
      ['Stat changes', modsText(it.mods) || 'None'],
      ['Effect', it.effect ? `\`${it.effect.kind}\`` : ''],
      ['Max stacks', it.maxStacks],
      ['Weight', it.weight],
      ['Evolves from', it.from ? `${ilink('item', it.from)} + ${ilink('passive', it.catalyst)}` : ''],
      ['Evolves into', ievo.map((e) => `${ilink('item', e.id)} (with ${ilink('passive', e.catalyst)})`).join(', ')],
    ];
    let body = '';
    if (Object.keys(it.mods ?? {}).length) body += `## Stat changes\n\n` + table(['Stat', 'Change'], Object.entries(it.mods).map(([k, v]) => [`${statLabel(k)} (\`${k}\`)`, fmt(v)])) + '\n';
    if (it.effect) {
      body += `## Effect\n\nTrigger: \`${it.effect.kind}\`${{ onHit: ' (when a weapon hits an enemy)', onKill: ' (when an enemy dies)', onHurt: ' (when Tibo is hit)' }[it.effect.kind] ?? ''}. Raw parameters:\n\n`;
      body += table(['Parameter', 'Value'], effectRows(it.effect)) + '\n';
      if (it.effect.proc.meteor) body += `### Meteor impact\n\n**Verified**: when this effect procs, the triggering hit waits ${GAME.items.meteorFallSec} s for the meteor to land, then receives the effect's damage multiplier if the original target still exists. The area blast lands at the position where the meteor was triggered, not the target's new position. At most 16 meteors can be pending; if all slots are occupied, the hit and blast happen immediately. <small>[sim-D7a25DGD.js: \`if(n>=0)return js(e,n,i),Ms(e,n,l,u,o,a),t.mult[n]=c.proc.mult,t.itemSrc[n]=s.src,t.paint[n]=s.paint,0\`]</small> <small>[sim-D7a25DGD.js: \`s=Math.max(1,f(e.cfg.items.meteorFallSec))\`]</small>\n\n`;
    }
    body += `## Obtaining\n\n`;
    if (it.tier === 'evolved') body += `- Hold ${ilink('item', it.from)} with ${ilink('passive', it.catalyst)} at level 5, then open a chest. See [Evolutions](/evolutions#item-evolutions).\n\n`;
    else body += `- Items come from [points of interest](/points-of-interest) such as the Fry Cart vendor, Potato Crates, the Microwave and Tater Slots, and from loot runners (Golden Scarab, Lost Saucer). Ordinary [chests](/chests) never give a new item; they can only evolve one you already hold. Rarity weights: ${GAME.economy.rarityWeights.map((w, i) => `${RARITY[i]} ${w}`).join(', ')}.\n\n`;
    if (asCatalyst.length) body += `## Catalyst for\n\n${asCatalyst.map((e) => `- ${ilink('weapon', e.id)}`).join('\n')}\n\n`;
    body += `## Data\n\n\`\`\`json\n${JSON.stringify(it, null, 2)}\n\`\`\`\n`;
    pages.push({
      path: path.item(it.id),
      title: n,
      crumbs: [['Items', '/items']],
      description: `${n} is ${/^[aeiou]/i.test(RARITY[it.rarity]) ? 'an' : 'a'} ${RARITY[it.rarity].toLowerCase()} ${it.tier === 'evolved' ? 'evolved ' : ''}item in tibo.dog. ${desc}`,
      lead: `**${n}** is ${/^[aeiou]/i.test(RARITY[it.rarity]) ? 'an' : 'a'} ${RARITY[it.rarity].toLowerCase()} ${it.tier === 'evolved' ? 'evolved ' : ''}item in tibo.dog. In-game description: “${desc}”`,
      infobox: { title: n, icon: `item/${it.id}`, caption: RARITY[it.rarity], rows },
      body,
      sources: [SRC_REG, SRC_TEXT],
      search: `${n} ${it.id} item ${RARITY[it.rarity]} ${Object.keys(it.mods ?? {}).join(' ')}`,
    });
  }
  return pages;
}

export function itemIndex() {
  let body = `Items give fixed stat changes or triggered effects. There are ${R.items.length} regular items and ${R.evolvedItems.length} evolved items. Rarity runs ${RARITY.join(', ')}.\n\n`;
  for (let r = 0; r < RARITY.length; r++) {
    const list = R.allItems.filter((x) => x.rarity === r);
    if (!list.length) continue;
    body += `## ${RARITY[r]}\n\n` + table(
      ['Item', 'Description', 'Type'],
      list.map((it) => [`${icon('item', it.id)}${link('item', it.id)}`, t(`item.${it.id}.desc`), it.tier === 'evolved' ? 'Evolved' : it.effect ? `Effect (\`${it.effect.kind}\`)` : 'Stats']),
    ) + '\n';
  }
  return {
    path: '/items',
    title: 'Items',
    description: `All ${R.allItems.length} items in tibo.dog by rarity, with effects and item evolutions.`,
    body,
    sources: [SRC_REG, SRC_TEXT],
    search: 'items list rarity',
  };
}

const DOG_DETAIL = {
  terrier: 'Darts at the nearest enemy within range 110 and deals `22 × power × damage`.',
  'saint-bernard': 'When Tibo is below 40% HP, runs over and heals `25 × power` HP.',
  greyhound: 'Sprints 150 units through enemies, dealing `30 × power × damage` to everything in the line.',
  retriever: 'Pulls gems, coins and snacks within `120 × √power` to Tibo (not chests or items).',
  collie: 'Pushes enemies within `46 × √power` away from Tibo.',
  dachshund: 'Digs up `round(6 × power)` coins; 20% chance of an extra find (70% a 30 HP snack, otherwise a reroll).',
  beagle: 'Points to the nearest unused POI within 900 units of the dog that Tibo can use (crates, shrines, shops, machines and strays) and drops `round(3 × power)` coins.',
  corgi: 'Freezes nearby enemies within `60 × √power` for `√power` seconds. Bosses are not frozen (in-game text).',
  pomeranian: 'Holds fluff charges (1, or 2 from level 3) that cancel the next hit on Tibo; spending one sneezes pests away (push 220, plus a 0.5 s stun from level 5).',
  pomchi: 'Marks the nearest elite or loot runner within 600 for `8 × power` seconds: it takes +25% damage. Marks at once by level: 1/1/2/2/3.',
  'zelda-and-link': 'Both Link\'s fluff and Zelda\'s marks, plus every 50 s an eclipse that adds a fluff charge and marks every pest within 110 (+10% damage taken for 1 s).',
};

const DOG_ABILITY = {
  sniff: 'Finds gold and points to nearby crates, shrines and dogs',
  herd: 'Shoves nearby enemies back',
  bark: 'Freezes nearby enemies (not bosses)',
  dig: 'Digs up gold, sometimes a snack or reroll',
  zoomies: 'Sprints through a line of enemies',
  listen: 'Marks an elite or loot runner to take more damage',
  puff: 'Blocks the next hit, then pushes pests away',
  fetch: 'Brings pickups from far away',
  rescue: 'Heals Tibo when health is low',
  bite: 'Bites the nearest enemy',
  eclipse: 'Shields Tibo and marks nearby pests',
};

export function dogPages() {
  const pages = [];
  for (const d of R.dogs) {
    const n = name.dog(d.id);
    const breed = t(`dog.${d.id}.breed`);
    const desc = t(`dog.${d.id}.desc`) ?? '';
    const rows = [
      ['Name', n],
      ['Breed', breed],
      ['Ability', `${DOG_ABILITY[d.ability.kind] ?? ''} (\`${d.ability.kind}\`)`],
      ['Ability every', d.ability.every ? `${fmt(d.ability.every)} s` : ''],
      ['Aura', modsText(d.aura)],
      ['Legendary', d.legendary ? 'Yes' : 'No'],
      ['Max level', 1 + d.levelUps.length],
      ['Spawn weight', d.weight],
      ['Speed', d.speed],
    ];
    let body = `## Ability\n\n**Verified** (dog ability code in \`sim-D7a25DGD.js\` and \`run-extras-Dczyr38B.js\`): ${DOG_DETAIL[d.id] ?? ''} \`power\` is the training multiplier below; damage is Tibo's damage multiplier.\n\n` + table(['Parameter', 'Value'], flatRows(d.ability)) + '\n';
    body += `## Aura\n\nWhile in Tibo's pack, ${n} adds: ${modsText(d.aura)}.\n\n`;
    body += `## Training levels\n\nEach level multiplies the ability. \`every\` multiplies the time between uses (lower is faster), \`power\` multiplies its strength and \`aura\` scales the aura bonus. The multipliers below are copied from the game data.\n\n`;
    let every = 1, power = 1;
    const lr = [[1, '—', '—', '—', fmt(d.ability.every ?? 0) || '—', '1']];
    d.levelUps.forEach((l, i) => {
      every *= l.every ?? 1;
      power *= l.power ?? 1;
      lr.push([i + 2, fmt(l.every), fmt(l.power), fmt(l.aura), d.ability.every ? fmt(d.ability.every * every) : '—', fmt(power)]);
    });
    body += table(['Level', '`every` ×', '`power` ×', '`aura`', 'Ability interval (s)', 'Total power ×'], lr) + '\n';
    body += `**Verified**: ability power is the product of \`power\` multipliers, the interval is \`ability.every\` × the product of \`every\` multipliers, and the aura is multiplied by \`1 + sum of aura\` values.${' '}<small>[sim-D7a25DGD.js: \`function Et(e,t){let n=e.levelUps,r=1;for(let e=0;e<t-1;e++)r+=n[e]?.aura??0;return r}\`]</small>\n\n` + table(['Level', 'Aura at this level'], Array.from({ length: d.levelUps.length + 1 }, (_, i) => { const m = 1 + d.levelUps.slice(0, i).reduce((a, l) => a + (l.aura ?? 0), 0); return [i + 1, modsText(Object.fromEntries(Object.entries(d.aura).map(([k, v]) => [k, +(v * m).toFixed(4)])))]; })) + '\n';
    body += `## Obtaining\n\n${d.id === 'zelda-and-link' ? 'Hold both [Link](/dogs/pomeranian) and [Zelda](/dogs/pomchi): they fuse into Zelda & Link, keeping the higher level.' : d.legendary ? `${n} is a legendary dog (weight 0 in the normal pool). Each run, each of Link and Zelda is in the run with ${pct(GAME.dogs.legendaryChance)} chance; stray dogs at least 1200 units from the start take them from that queue.` : `Stray dogs appear as [Stray Dog](/points-of-interest#stray-dog) points of interest; walk onto one to recruit it. ${n}'s breed weight is ${d.weight}.`} See [Dogs](/dogs#getting-dogs).\n\n`;
    body += `## Data\n\n\`\`\`json\n${JSON.stringify(d, null, 2)}\n\`\`\`\n`;
    pages.push({
      path: path.dog(d.id),
      title: n,
      crumbs: [['Dogs', '/dogs']],
      description: `${n} the ${breed} is a ${d.legendary ? 'legendary ' : ''}dog in tibo.dog. ${desc}`,
      lead: `**${n}** the ${breed} is a ${d.legendary ? 'legendary ' : ''}dog that can join Tibo's pack. In-game description: “${desc}”`,
      infobox: { title: n, icon: `dog/${d.id}`, caption: breed, rows },
      body,
      sources: [SRC_REG, SRC_TEXT],
      search: `${n} ${breed} ${d.id} dog ${d.ability.kind}`,
    });
  }
  return pages;
}

export function dogIndex() {
  let body = `Dogs join Tibo's pack (up to ${GAME.dogs.maxPack} at once). Each has an ability and a passive aura, and can be trained up to level ${1 + R.dogs[0].levelUps.length}.\n\n`;
  body += table(
    ['Dog', 'Breed', 'Ability', 'Aura', 'Legendary'],
    R.dogs.map((d) => [`${icon('dog', d.id)}${link('dog', d.id)}`, t(`dog.${d.id}.breed`), t(`dog.${d.id}.desc`), modsText(d.aura), d.legendary ? 'Yes' : '']),
  ) + '\n';
  body += `## Getting dogs\n\nVerified config values (\`dogs\` in the game config):\n\n` + table(['Setting', 'Value'], [
    ['Max pack size (`maxPack`)', GAME.dogs.maxPack],
    ['First dog distance (`firstDogDistance`)', GAME.dogs.firstDogDistance],
    ['Legendary chance (`legendaryChance`)', pct(GAME.dogs.legendaryChance)],
    ['Dog Kennel level prices (`kennelPrices`)', GAME.dogs.kennelPrices.join(', ') + ' gold'],
    ['Kennel purchases (`kennelBuys`)', GAME.dogs.kennelBuys],
  ]) + `\n**Verified** (\`sim-D7a25DGD.js\`, \`run-extras-Dczyr38B.js\`):\n\n- The first stray is placed ${GAME.dogs.firstDogDistance} units from the start, or at the nearest free spot if another POI is there. Other strays appear as [Stray Dog](/points-of-interest#stray-dog) points of interest; the breed is weighted ${R.dogs.filter((d) => d.weight).sort((a, b) => b.weight - a.weight).map((d) => `${t(`dog.${d.id}.breed`)} ${d.weight}`).join(', ')}.\n- Walking onto a stray of a breed you already have **levels that dog up**. Otherwise it joins if the pack has room; with a full pack you choose “Swap out …” or “Keep my pack”.\n- **Legendary dogs**: each run, Link and Zelda are each in the run with ${pct(GAME.dogs.legendaryChance)} chance; strays in chunks whose centre is at least 1200 units from the start take them from that queue. Holding both fuses them into ${link('dog', 'zelda-and-link')}.\n- Dogs level up to 5. The [Dog Kennel](/points-of-interest#dog-kennel) sells levels at ${GAME.dogs.kennelPrices.join(' / ')} gold (× purchase price), up to ${GAME.dogs.kennelBuys} per kennel.\n- Every dog's aura is added to Tibo's stats like an item.\n`;
  return { path: '/dogs', title: 'Dogs', description: `All ${R.dogs.length} dogs in tibo.dog: abilities, auras, training and legendary dogs.`, body, sources: [SRC_REG, SRC_TEXT, 'Game config `dogs` from `boot-CyXYlW39.js`'], search: 'dogs pack breeds' };
}

const ENEMY_BEH = {
  chase: 'Walks toward Tibo',
  ranged: 'Keeps distance and shoots',
  charger: 'Charges in a line',
  tank: 'Slow and tough',
  flee: 'Runs away (loot runner)',
  swarm: 'Moves in a swarm',
  splitter: 'Splits when killed',
  wall: 'Forms a wall',
  exploder: 'Explodes',
};

export function enemyPages() {
  const pages = [];
  const summons = Object.fromEntries(R.bosses.filter((b) => b.attack?.minion).map((b) => [b.attack.minion, b.id]));
  for (const e of R.enemies) {
    const n = name.enemy(e.id);
    const biomes = enemyBiomes(e.id);
    const events = R.events.filter((ev) => ev.effect.enemy === e.id);
    const splitFrom = R.enemies.filter((x) => x.behavior.child === e.id);
    const rows = [
      ['Behaviour', `${ENEMY_BEH[e.behavior.kind] ?? ''} (\`${e.behavior.kind}\`)`],
      ['Base HP', fmt(e.hp)],
      ['Base damage', fmt(e.damage)],
      ['Speed', fmt(e.speed)],
      ['XP', fmt(e.xp)],
      ['Gold chance', pct(e.goldChance)],
      ['Radius', fmt(e.radius)],
      ['Mass', fmt(e.mass)],
    ];
    let body = `## Stats\n\nBase values before [time scaling](/enemy-scaling) and [difficulty](/modes).\n\n` + table(['Stat', 'Value'], rows.map(([k, v]) => [k, v])) + '\n';
    if (Object.keys(e.behavior).length > 1) body += `## Behaviour parameters\n\n` + table(['Parameter', 'Value'], flatRows(e.behavior)) + '\n';
    if (e.behavior.sharpPattern) body += `### Nightmare bullets\n\n**Verified**: Nightmare uses \`sharpPattern\` instead of \`pattern\`; other levels use the ordinary pattern. <small>[sim-D7a25DGD.js: \`return e.level.sharpPatterns&&n!==void 0?n:t.pattern\`]</small>\n\n` + table(['Parameter', 'Nightmare value'], flatRows(e.behavior.sharpPattern)) + '\n';
    body += `## Where it appears\n\n`;
    const where = [];
    for (const b of biomes) where.push(`${link('biome', b.biome)}, enemy tier ${b.tier}`);
    for (const ev of events) where.push(`Event: ${link('event', ev.id)}`);
    if (summons[e.id]) where.push(`Summoned by ${ilink('boss', summons[e.id])}`);
    for (const s of splitFrom) where.push(`Split from ${ilink('enemy', s.id)}`);
    if (e.id === 'reset-zombie') where.push('[Story mode](/story-mode) waves');
    body += where.length ? where.map((x) => `- ${x}`).join('\n') + '\n\n' : 'No biome, event or boss reference to this enemy was found in the content tables. It may be spawned by other game code.\n\n';
    body += `Biome tiers: each biome lists five enemy tiers; higher tiers appear as the run goes on (see [Enemy scaling](/enemy-scaling)).\n\n`;
    body += `## Data\n\n\`\`\`json\n${JSON.stringify(e, null, 2)}\n\`\`\`\n`;
    pages.push({
      path: path.enemy(e.id),
      title: n,
      crumbs: [['Enemies', '/enemies']],
      description: `${n} is an enemy in tibo.dog: ${fmt(e.hp)} base HP, ${fmt(e.damage)} damage, ${ENEMY_BEH[e.behavior.kind]?.toLowerCase() ?? e.behavior.kind}.`,
      lead: `**${n}** is an enemy (pest) in tibo.dog.`,
      infobox: { title: n, icon: `enemy/${e.id}`, caption: 'Enemy', rows },
      body,
      sources: [SRC_REG, SRC_TEXT],
      search: `${n} ${e.id} enemy pest ${e.behavior.kind}`,
    });
  }
  return pages;
}

export function enemyIndex() {
  let body = `There are ${R.enemies.length} regular enemies (pests). Values are base stats before time scaling and difficulty.\n\n`;
  body += table(
    ['Enemy', 'Behaviour', 'HP', 'Damage', 'Speed', 'XP', 'Biomes'],
    R.enemies.map((e) => [
      `${icon('enemy', e.id)}${link('enemy', e.id)}`,
      `\`${e.behavior.kind}\``,
      fmt(e.hp),
      fmt(e.damage),
      fmt(e.speed),
      fmt(e.xp),
      enemyBiomes(e.id).map((b) => `${link('biome', b.biome)} (T${b.tier})`).join(', '),
    ]),
  );
  return { path: '/enemies', title: 'Enemies', description: `All ${R.enemies.length} enemies in tibo.dog with HP, damage, speed, XP and biomes.`, body, sources: [SRC_REG, SRC_TEXT], search: 'enemies pests list' };
}

const BOSS_MIN = { amusing: 2, 'beetle-queen': 3, 'the-masher': 4, 'late-blight': 6, 'sir-strawman': 7, 'fryer-king': 8, 'great-wireworm': 10, 'the-mandoline': 12, 'deep-freezer': 14, 'grater-golem': 16, 'compost-titan': 17, 'ketchup-kraken': 18, harvester: 20 };
export function bossPages() {
  const pages = [];
  R.bosses.forEach((b) => {
    const n = name.boss(b.id);
    const title = t(`boss.${b.id}.title`);
    const desc = t(`boss.${b.id}.desc`) ?? '';
    const order = R.bossOrder.findIndex((x) => x.id === b.id) + 1;
    const rows = [
      ['Title', title],
      ['Order', `${order} of ${R.bossOrder.length}`],
      ['Arrives', BOSS_MIN[b.id] ? `${BOSS_MIN[b.id]}:00 ([schedule](/bosses#wave-schedule))` : ''],
      ['Base HP', fmt(b.hp)],
      ['Contact damage', fmt(b.damage)],
      ['Speed', fmt(b.speed)],
      ['Main attack', `\`${b.attack.kind}\` every ${fmt(b.attackEvery)} s`],
      ['Telegraph', `${fmt(b.telegraph)} s`],
      ['Bullet patterns', `${b.patterns.length}, every ${fmt(b.patternEvery)} s`],
      ['XP', fmt(b.xp)],
      ['Minute-20 boss', GAME.win.finalBoss === b.id ? 'Arrives at 20:00, when a run counts as survived' : ''],
    ];
    let body = `## Main attack\n\n` + table(['Parameter', 'Value'], flatRows(b.attack)) + '\n';
    if (b.attack.minion) body += `Summons ${ilink('enemy', b.attack.minion)}.\n\n`;
    for (const [heading, patterns] of [['Bullet patterns', b.patterns], ...(b.sharpPatterns ? [['Nightmare bullet patterns', b.sharpPatterns]] : [])]) {
      body += `## ${heading}\n\n`;
      if (heading === 'Nightmare bullet patterns') body += `**Verified**: on Nightmare these replace the ordinary patterns above; they use the same pattern interval. Other levels use the ordinary list. <small>[sim-D7a25DGD.js: \`return e.level.sharpPatterns&&n!==void 0?n:t.patterns\`]</small>\n\n`;
      body += table(
        ['Pattern', 'Count', 'Bursts', 'Bullet damage', 'Speed', 'Telegraph (s)', 'Extra'],
        patterns.map((p) => [`\`${p.kind}\``, p.count, p.bursts, p.damage, p.speed, p.telegraph, [p.onHit ? `on hit: ${json(p.onHit)}` : '', p.motion ? `motion: ${json(p.motion)}` : '', p.arc ? `arc ${p.arc}` : '', p.spin ? `spin ${p.spin}` : ''].filter(Boolean).join('; ')]),
      ) + '\n';
    }
    body += `## HP scaling\n\nBoss HP is multiplied by a step factor depending on the run time (\`bosses.hpSteps\`), and by the difficulty's boss HP multiplier (see [Modes](/modes)).\n\n` + table(
      ['From minute', 'HP ×', `${n} HP (Normal)`],
      GAME.bosses.hpSteps.map((s) => [s.minute, s.hpScale, fmt(b.hp * s.hpScale)]),
    ) + '\nOther time scaling may also apply; see [Enemy scaling](/enemy-scaling).\n\n';
    body += `## Data\n\n\`\`\`json\n${JSON.stringify(b, null, 2)}\n\`\`\`\n`;
    pages.push({
      path: path.boss(b.id),
      title: n,
      crumbs: [['Bosses', '/bosses']],
      description: `${n}, ${title}, is boss ${order} of ${R.bossOrder.length} in tibo.dog. ${desc}`,
      lead: `**${n}**, *${title}*, is a boss in tibo.dog. In-game description: “${desc}”`,
      infobox: { title: n, icon: `boss/${b.id}`, iconSize: 96, caption: title, rows },
      body,
      sources: [SRC_REG, SRC_TEXT, 'Game config `bosses.hpSteps` and `win.finalBoss` from `boot-CyXYlW39.js`'],
      search: `${n} ${title} ${b.id} boss`,
    });
  });
  return pages;
}

export function bossIndex() {
  let body = `There are ${R.bosses.length} bosses. The game keeps them in a fixed order (\`bossOrder\`). Bosses arrive on a fixed schedule; ${name.boss(GAME.win.finalBoss)} comes at 20:00, when a run counts as survived (there is no win screen). See the [wave schedule](#wave-schedule).\n\n`;
  body += table(
    ['#', 'Boss', 'Title', 'Base HP', 'Damage', 'Attack', 'XP'],
    R.bossOrder.map((b, i) => [i + 1, `${icon('boss', b.id)}${link('boss', b.id)}`, t(`boss.${b.id}.title`), fmt(b.hp), fmt(b.damage), `\`${b.attack.kind}\``, b.xp]),
  ) + '\n';
  body += `## Boss HP steps\n\n` + table(['From minute', 'HP ×'], GAME.bosses.hpSteps.map((s) => [s.minute, s.hpScale])) + '\n';
  return { path: '/bosses', title: 'Bosses', description: `All ${R.bosses.length} bosses in tibo.dog in order, with HP, attacks and bullet patterns.`, body, sources: [SRC_REG, SRC_TEXT], search: 'bosses list order' };
}

const HAZARD = { spores: 'Spore vents', chill: 'Frost patches', burn: 'Burning pools', slow: 'Slowing ground', thorns: 'Thorny brambles' };

export function biomePages() {
  const pages = [];
  for (const b of R.biomes) {
    const n = name.biome(b.id);
    const desc = t(`biome.${b.id}.desc`) ?? '';
    const rows = [
      ['Placement', b.placement.kind === 'landmark' ? `Landmark (radius ${b.placement.radius})` : `Climate (temperature ${b.placement.temperature}, moisture ${b.placement.moisture})`],
      ['Landmark event', b.placement.event ? link('event', b.placement.event) : ''],
      ['Hazard', b.hazard ? `${HAZARD[b.hazard.kind] ?? ''} (\`${b.hazard.kind}\`)` : 'None'],
      ['Gold ×', fmt(b.goldMult)],
      ['XP ×', fmt(b.xpMult)],
      ['Start biome', GAME.world.startBiome === b.id ? 'Yes' : ''],
    ];
    let body = `## Enemies\n\nEach biome lists its pests in five tiers.\n\n` + table(['Tier', 'Enemies'], b.enemies.map((tier, i) => [i + 1, tier.map((id) => ilink('enemy', id)).join(', ')])) + '\n';
    if (b.hazard) body += `## Hazard\n\n` + table(['Parameter', 'Value'], flatRows(b.hazard)) + '\n';
    body += `## Points of interest\n\nRelative spawn weights for points of interest in this biome (\`poiWeights\`). Each chunk tries to place up to ${b.poisPerChunk} (\`poisPerChunk\`) with 35% chance, otherwise ${b.poisPerChunk - 1}; crowded spots and the overtime taper can mean fewer.\n\n` + table(['Point of interest', 'Weight'], Object.entries(b.poiWeights).sort((a, c) => c[1] - a[1]).map(([k, v]) => [`[${name.poi(k)}](${path.poi(k)})`, v])) + '\n';
    body += `## Props\n\n${b.props.map((x) => `\`${x}\``).join(', ')} (${b.propsPerChunk} per chunk).\n\n`;
    body += `## Data\n\n\`\`\`json\n${JSON.stringify(b, null, 2)}\n\`\`\`\n`;
    pages.push({
      path: path.biome(b.id),
      title: n,
      crumbs: [['Biomes', '/biomes']],
      description: `${n} is a biome in tibo.dog. ${desc}`,
      lead: `**${n}** is a ${b.placement.kind === 'landmark' ? 'landmark ' : ''}biome in tibo.dog. In-game description: “${desc}”`,
      infobox: { title: n, caption: 'Biome', rows },
      body,
      sources: [SRC_REG, SRC_TEXT],
      search: `${n} ${b.id} biome`,
    });
  }
  return pages;
}

export function biomeIndex() {
  let body = `The world is generated in chunks of ${GAME.world.chunkSize} units. Climate biomes are placed by temperature and moisture; landmark biomes are smaller special areas (spaced about ${GAME.world.landmarkSpacing} units apart) that come with their own event. Every run starts in ${link('biome', GAME.world.startBiome)}.\n\n`;
  body += table(
    ['Biome', 'Placement', 'Hazard', 'Gold ×', 'XP ×', 'Description'],
    R.biomes.map((b) => [link('biome', b.id), b.placement.kind, b.hazard?.kind ?? '—', fmt(b.goldMult), fmt(b.xpMult), t(`biome.${b.id}.desc`)]),
  );
  return { path: '/biomes', title: 'Biomes', description: `All ${R.biomes.length} biomes in tibo.dog with hazards, enemies, gold and XP multipliers.`, body, sources: [SRC_REG, SRC_TEXT, 'Game config `world` from `boot-CyXYlW39.js`'], search: 'biomes map world' };
}

export function eventPages() {
  const pages = [];
  for (const ev of R.events) {
    const n = name.event(ev.id);
    const ann = t(`event.${ev.id}.announce`);
    const landmark = R.biomes.find((b) => b.placement.event === ev.id);
    const rows = [
      ['Announcement', `“${ann}”`],
      ['Kind', `\`${ev.effect.kind}\``],
      ['Enemy', ev.effect.enemy ? ilink('enemy', ev.effect.enemy) : ''],
      ['Biome', landmark ? link('biome', landmark.id) : ''],
    ];
    let body = `## Effect\n\n` + table(['Parameter', 'Value'], flatRows(ev.effect)) + '\n';
    body += landmark ? `This is the landmark event of ${link('biome', landmark.id)}.\n\n` : `This event is not tied to a landmark biome in the content tables.\n\n`;
    pages.push({
      path: path.event(ev.id),
      title: n,
      crumbs: [['Events', '/events']],
      description: `${n} is a world event in tibo.dog: “${ann}”`,
      lead: `**${n}** is a world event in tibo.dog. On screen: “${ann}”`,
      infobox: { title: n, caption: 'Event', rows },
      body,
      sources: [SRC_REG, SRC_TEXT],
      search: `${n} ${ev.id} event`,
    });
  }
  return pages;
}

export function eventIndex() {
  const body = `World events interrupt a run with a wall of pests, a swarm, a loot runner or a gold rush. Landmark biomes each have their own event.\n\n` + table(
    ['Event', 'Kind', 'Announcement', 'Landmark biome'],
    R.events.map((ev) => [link('event', ev.id), `\`${ev.effect.kind}\``, t(`event.${ev.id}.announce`), (() => { const b = R.biomes.find((x) => x.placement.event === ev.id); return b ? link('biome', b.id) : ''; })()]),
  );
  return { path: '/events', title: 'Events', description: `All ${R.events.length} world events in tibo.dog.`, body, sources: [SRC_REG, SRC_TEXT], search: 'events gold rush swarm' };
}

export { table, flatRows, modsText, json, SRC_REG, SRC_TEXT, RAW_NOTE, slug };
