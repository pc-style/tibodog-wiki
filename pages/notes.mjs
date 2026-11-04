// Verified facts gathered from code reading and official sources that are not plain data tables.
// Each note cites its source. Keep inference explicitly labelled.
import { R, GAME, BUILD, BUILDS, ilink, link, name, fmt, pct, t } from '../lib/data.mjs';

const tbl = (head, rows) =>
  `| ${head.join(' | ')} |\n|${head.map(() => '---').join('|')}|\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}\n`;

const TRIVIA = 'https://x.com/poteto/status/2117043478140276847';
const LAUNCH = 'https://x.com/poteto/status/2117004709198475365';

export const NOTES = {
  unlocks: `tibo.dog has no unlock tree: every level is playable from the start and nothing is bought between runs. What the game remembers is stored in the browser.

## Level picker

**Verified** (\`boot-_THj2ukE.js\`, run picker config \`runPicker: {afterStory: "easy", storyDoneOn: "ending"}\`):

- Until you reach the Story ending, the picker shows **Story, Easy, Normal, Hard and Nightmare**, with Story selected and featured (“A short first game. Play this first.”). <small>[boot-_THj2ukE.js: \`return e.storyDone?{picks:Bi,selected:(n=e.lastPick,(n===Ki?void 0:n)??t.afterStory),featured:void 0}:{picks:Ui,selected:Ki,featured:Ki}\`]</small>
- Reaching the Story ending sets \`storyDone\`. From then on the picker lists **Easy to Nightmare** and pre-selects your last pick, or Easy. The Story end screen offers “Play Easy”.
- Nothing else gates a level. Whether Story can be replayed from another screen after it leaves the picker is not verified here (the config has \`storyOnStats: true\`).

## Recipe discovery

**Verified** (\`run-records-BNaO_VcG.js\`, \`recipe-view-EtC59ogI.js\`): the game remembers every evolution, union and item evolution you have made. Recipe hints on cards always name weapon evolutions and unions, but an **item evolution's result shows as “???”** until you have made it once. <small>[recipe-view-EtC59ogI.js: \`\` case\`itemEvolution\`:return a.unlocked(s.result)?h(p(c( \`\`]</small>

## Encyclopedia

**Verified** (\`run-records-BNaO_VcG.js\`, \`encyclopedia-screen-xM1XJlPv.js\`): the in-game encyclopedia has shelves for weapons, passives, items, evolutions, enemies, bosses, biomes and dogs. An entry shows as “???” until you have seen it: a weapon or passive counts once it is offered on a card or owned, an item once it is offered (chest, Fry Cart, Microwave) or owned, an enemy or boss once one is on the field, a dog once it is in your pack or offered in a swap (strays on the ground do not count), and a biome once you enter it. This wiki lists everything, including entries you have not found yet.

## Saved settings

Settings, the analytics choice, the picker state and discoveries are kept in the browser (the [privacy page](https://tibo.dog/privacy) says progress is kept on the device). Clearing site data resets them.

## Grok Bot promo

**Verified** config: a Grok Bot promotion (\`https://x.ai/bot?tibodog\`) appears as its own panel after every death, before the end screen, including runs that survived 20:00 (\`ad: {trigger: "everyDeath", everyN: 3, showAfterWin: true}\`; \`everyN\` only applies to the unused \`everyNth\` trigger). Its exit button (“Next” or “Reset”) unlocks after a 2 s countdown; closing it opens the end screen. The Story ending uses the same panel with a “Play Easy” button.
`,
  settings: `**Verified** from the settings panel (\`settings-panel-DTvd_uZ3.js\`) and defaults in \`boot-_THj2ukE.js\`. Tabs: Sound, Language, Comfort, Graphics, Privacy.

| Setting | Options | Default |
|---|---|---|
| Music volume | slider | full |
| Sound volume | slider | full |
| Language | 27 languages | browser language |
| Color-blind mode | Off, Protanopia, Deuteranopia, Tritanopia (with a Danger / XP / Health colour preview) | Off |
| Weapon effects | slider | full |
| Screen shake | Off, Low, Full | Full |
| Flashing effects | On / Off | On |
| Damage numbers | On / Off | On |
| Hitbox (“Shows where shots hit Tibo.”) | On / Off | Off |
| Recommended picks | On / Off | On |
| Quality | Auto, Low, Medium, High | Auto |
| Analytics (“Anonymous gameplay stats help poteto improve the game. No name, account or IP address is recorded.”) | On / Off | On (off by default in the EU and EEA, per the game's privacy page) |

If the game closed unexpectedly, it restarts on Low quality: “The game closed unexpectedly last time, so it started on Low. Pick a quality to switch back.”

### Graphics recovery

**Verified**: play stops while the renderer is not ready. Failed scene downloads retry after 1 s, then 2 s, 4 s and at most 8 s between attempts, rather than immediately switching to the 2D fallback. A failed early sprite-page download can be retried too. <small>[main-D4sszisV.js: \`if(!this.renderer.ready())return\`loading\`;\`]</small> <small>[hd2d-renderer-Byr_HsOf.js: \`this.retrySec=Math.min(o.renderer.retryMaxSec,2*this.retrySec)\`]</small>

After WebGL context loss, the game waits up to 5 s for restoration, then tries a fresh context. If that recovery also fails, it can still fall back to 2D. Scene construction has a separate recovery path: its first failure retries 3D on Low at half resolution, with adaptive quality off; another construction failure uses the fallback. Missing WebGL 2 at startup still shows the unsupported-device screen. <small>[hd2d-renderer-Byr_HsOf.js: \`this.failed?{...r,softwareGl:!0}\`]</small> <small>[boot-_THj2ukE.js: \`tier:\`low\`,scale:C.minScale,adaptive:!1,climb:!1\`]</small>

An active intro or landing cutscene ends as skipped if its renderer stops reporting ready. <small>[boot-_THj2ukE.js: \`if(this.host.renderer.cutscene()!==\`ready\`)return void this.end(!0);\`]</small>`,
  modesExtra: `## Level picker\n\nAll levels are open from the start. After the Story ending, Story leaves the picker and Easy is pre-selected. See [Unlocks](/unlocks).\n\n## Level links\n\n**Verified**: a link with a \`difficulty\` parameter, for example \`https://tibo.dog/?difficulty=hard\`, starts a run on that level straight from the title screen, without the intro. It accepts \`easy\`, \`normal\`, \`hard\` and \`nightmare\`; \`story\` and other values are not accepted, and shared run links ignore it. <small>[boot-_THj2ukE.js: \`\` e.runFrom=t.relaunch?\`press\`:\`param\` \`\`]</small>\n\n## Shared runs\n\nFinished runs can be shared as links under \`https://tibo.dog/r/\` (the game's llms.txt). The developer says the deterministic simulation lets the server replay a posted run to check a high score, and that each run gets a generated preview image ([trivia thread](https://x.com/poteto/status/2117043478140276847)).\n\n**Verified**: a shared run link records the run's difficulty, and the shared run page shows it as a level badge. <small>[run-address-tGtsL8kj.js: \`tally:e.tally,difficulty:e.difficulty\`]</small>\n\n**Verified**: the shared-run reader withholds a reconstructed score when kills reach the link format's 10,000,000 cap, peak enemies exceed 550, or a weapon/item damage total reaches its format cap in a run shorter than 90 minutes. This is a client-side score-display check, not proof of server validation. <small>[run-address-tGtsL8kj.js: \`e.tally.peakEnemies>Math.max(\`]</small>\n`,
  controlsExtra: `## Other keys\n\n**Verified** (key map in \`boot-_THj2ukE.js\` and the game's input code):\n\n| Key | Action |\n|---|---|\n| P | Pause / resume during a run (Escape also works) |\n| M | Mute / unmute |\n| T | Auto-advance story lines on or off |\n| Space | Skip story lines |\n| R | Play again (end screen) |\n| S | Share (end screen) |\n| Escape | Back |\n| Enter / Space | Activate the focused button |\n| Arrow keys | Move focus in lists |\n\nCards are numbered 1, 2, 3 (4) in order. The on-screen hint relabels W A S D for AZERTY, QWERTZ, Dvorak and Colemak layouts.\n\n## Dash details\n\n**Verified**: a dash moves 48 units over 9 ticks (0.15 s), each charge recharges in 5 s, Tibo starts with 1 charge and the input is buffered for 6 ticks. Tibo ignores normal damage while dashing (and during \`dashGrace\` from Ghost Pepper). A touch flick is a stroke of at least 30 px over the last 120 ms, moving at least 400 px/s when the finger lifts, or 900 px/s while it is still down (\`dash.flickPx\`, \`flickWindowMs\`, \`flickPxPerSec\`, \`heldFlickPxPerSec\`).\n\n## Gamepad\n\nNo gamepad controls were found; the code only records that a gamepad was connected (for analytics).\n\n`,
  modeCaptions: [
    ['Story', 'A short first game. Play this first.'],
    ['Easy', 'Fewer, weaker pests and a tougher Tibo.'],
    ['Normal', 'The game as designed.'],
    ['Hard', 'More pests, harder hits, tougher bosses.'],
    ['Nightmare', 'Crowds, a curse and no revives.'],
  ],
  storyCaption: 'A short first game. Play this first.',
  statsExtra: `## Armor\n\n**Verified**: damage taken = \`damage × (1 − min(0.85, armor / (5 × attacker level + armor)))\`. Attacker level is \`10 + minutes\`, +5 for elites, +10 for bosses.${'  '}<small>[sim-CQySaEYD.js: \`function ti(e,t,n){let r=n.armor;return Math.min(r.cap,Le(e,r.k*t))}\`]</small>\n\nSo armor loses value over a run: 50 armor blocks 50% from a level-10 pest at 0:00 but 25% from a level-30 pest at 20:00. Reduction is capped at 85%. Guard weapons with charges subtract a fixed soak amount from a hit before armor; the hit is cancelled only if the soak is at least the damage.\n\n` +
    tbl(['Armor', 'vs level 10 (0:00)', 'vs level 20 (10:00)', 'vs level 30 (20:00)', 'vs boss at 20:00 (level 40)'], [10, 20, 50, 100, 200].map((a) => [a, ...[10, 20, 30, 40].map((l) => `${Math.round(Math.min(0.85, a / (5 * l + a)) * 100)}%`)])) +
    `\nComputed from the formula.\n\n## Crit\n\n**Verified**: each hit crits with chance \`effective crit chance + the weapon's own critBonus\`; a crit multiplies damage by \`2 + crit damage\`. Hits on elites and bosses are first multiplied by \`1 + elite damage\`.  <small>[sim-CQySaEYD.js: \`let c=o.critChance+a.critBonus[r];c>0&&e.rng.next()<c&&(l*=o.critMult,u=!0)\`]</small>\n\n## Dodge\n\n**Verified**: when a hit would damage Tibo, dodge (evasion) is rolled right after the invulnerability checks; a success cancels the hit entirely. Damage from biome terrain and hazard pools is never dodged.\n\n## Weapon details\n\n- **Verified**: the amount bonus does not apply to \`aura\`, \`cone\`, \`nuke\` and \`ring\` weapons.\n- **Verified**: a weapon's cooldown never goes below 0.05 s (15 s for \`nuke\` weapons), and the [Frenzy Fryer](/points-of-interest#frenzy-fryer) lowers that floor while it is active. Weapons with no cooldown at all (Steam Vent, whose aura hits on its own timer) stay at 0.\n- **Verified**: ${'Mezzaluna'} and ${'Moon Cleaver'} (\`hpEdge\`) deal \`0.8 + (lowHpBonus + 0.2) × missing HP fraction\` times damage: 0.8× at full HP, up to 2.2× (Mezzaluna) or 2.6× (Moon Cleaver) near 0 HP.\n- **Verified**: projectiles fired by \`onHurt\` items (Porcupine Spud, Fry Volcano) deal \`(damage × (1 + 0.15 × minutes) + thornsShare × thorns) × damage multiplier\`, so they grow over the run. The thorns share is 1 for Porcupine Spud and 1.5 for Fry Volcano.\n\n## Luck\n\n**Verified**: luck gives a 4th level-up card with chance \`min(1, luck)\`, bigger chests (\`× (1 + luck)\` on the 3- and 5-reward chances) and rarer items (rarity *n* weight × \`(1 + luck)^n\`). In-game: “Better odds of a fourth level-up card, bigger chests and rarer items.”\n\n## Healing and revives\n\n- **Verified**: recovery heals that many HP per second; heal on kill heals per kill. Both are capped at max HP.\n- **Verified**: outside Story, a revive restores ${pct(GAME.player.reviveHp)} max HP and grants ${GAME.revive.graceSec} s of invulnerability. The burst knocks back visible enemies and bosses whose bodies overlap its ${GAME.revive.radius}-unit radius (push ${GAME.revive.push}), freezes pests and elites for ${GAME.revive.stunSec} s, and slows bosses to ${pct(GAME.revive.bossSlow)} speed for ${GAME.revive.stunSec} s while delaying their next pattern. Nearby enemy shots are cleared. <small>[sim-CQySaEYD.js: \`revive:{graceSec:4,radius:160,push:900,stunSec:5,bossSlow:.5,clearsBullets:!0}\`]</small> <small>[sim-CQySaEYD.js: \`let n=e.enemies,r={kind:\`freeze\`,seconds:e.cfg.revive.stunSec}\`]</small> <small>[sim-CQySaEYD.js: \`i={kind:\`slow\`,factor:n.bossSlow,seconds:n.stunSec}\`]</small>\n- **Verified**: Story keeps its ${GAME.story.invulnSec} s grace and ${GAME.story.burstRadius}-unit pest knockback burst; its revive does not apply the non-Story freeze or boss slow. Nightmare allows no revives and removes Second Spud from the item pool.\n\n`,
  xpPow: 'Powers use the deterministic power function (`x^y`) exported by `boot-_THj2ukE.js`.',
  xpTableNote: 'Computed from the formula; this is the requirement before XP gain multipliers.',

  officialSources: `The developer's [build trivia thread](${TRIVIA}) (2026-11-01) was used for history and Story mode flow.`,

  strategy() {
    const multi = {};
    for (const e of R.evolutions) (multi[e.catalyst] ??= []).push(ilink('weapon', e.id));
    for (const e of R.evolvedItems) (multi[e.catalyst] ??= []).push(ilink('item', e.id));
    const top = Object.entries(multi).filter(([, v]) => v.length >= 3).sort((a, b) => b[1].length - a[1].length);
    return `Strategy advice is **inference** unless marked **Verified**: it is reasoning from the game's numbers, not developer guidance. No official tips have been published by the developer as of ${BUILD.researched}.\n\n` +
      `## Know the clock\n\n- **Verified**: a run counts as survived at 20:00, when ${ilink('boss', GAME.win.finalBoss)} arrives; there is no win screen and the run goes on. Boss HP is multiplied ×3 from minute 16, ×4 from 18 and ×6 from 20 (\`bosses.hpSteps\`).\n- **Verified**: after 20:00, enemy HP and damage multiply ×4 for every extra minute of overtime (see [Enemy scaling](/enemy-scaling)). Long overtime runs need very high damage.\n- **Inference**: plan for a strong single-target or elite-damage source by minute 15 to handle the boss HP steps.\n\n` +
      `## Plan evolutions around catalysts\n\n- **Verified**: an evolution needs the base weapon at max level (8) plus its catalyst; see [Evolutions](/evolutions).\n- **Verified**: these catalysts unlock three or more recipes, so one passive slot can serve several evolutions:\n\n${tbl(['Catalyst', 'Recipes'], top.map(([id, v]) => [ilink(R.passives.find((p) => p.id === id) ? 'passive' : 'item', id), v.join(', ')]))}\n- **Inference**: pick weapons whose catalysts overlap so your ${GAME.player.passiveSlots} passive slots cover more evolutions.\n\n` +
      `## Cooldown has a cap\n\n- **Verified**: cooldown reduction is capped at 60% (\`cooldownCap\`). Past that, more ${ilink('passive', 'chives')} or ${ilink('item', 'chive-charm')} does nothing.\n\n` +
      `## Crit and dodge have diminishing returns\n\n- **Verified**: crit chance and dodge use \`x / (1 + x)\`. ${ilink('passive', 'hot-sauce')} at level 5 gives 0.30 crit points = 23% crit chance, not 30%. Each extra point is worth less.\n- **Verified**: crit damage starts at ×2 and ${ilink('passive', 'sour-cream')} adds +0.2 per level.\n\n` +
      `## Curse is a trade\n\n- **Verified**: each curse you *take* (a Moldy Shrine you accept, or Nightmare's starting curse) adds extra elites and bosses; the curse stat itself (also raised by Rotten Spud and Cursed Crown) makes pests tougher and raises XP and gold gain by 50% of its value, but adds no elites or bosses. See [Curse](/curse).\n- **Inference**: take curse when your build already clears comfortably and you want faster levels; avoid it on a shaky run.\n\n` +
      `## Protect Tibo\n\n- **Verified**: ${ilink('dog', 'corgi')} freezes nearby enemies, ${ilink('dog', 'collie')} pushes them back, ${ilink('dog', 'saint-bernard')} heals when health is low, ${ilink('dog', 'pomeranian')} blocks a hit.\n- **Verified**: ${ilink('weapon', 'frying-pan')} and ${ilink('weapon', 'hash-brown-shield')} are defensive weapons (\`reflect\` / \`guard\` behaviour); ${ilink('passive', 'starch-plating')} adds 20 armor per level.\n- **Inference**: damage totals at the end of a run undervalue these, because their value is damage you did not take.\n\n` +
      `## Early economy\n\n- **Verified**: ${ilink('passive', 'potato-magnet')} (+25% pickup range per level) and ${ilink('passive', 'fertilizer')} (+8% XP gain per level) speed up levelling; ${ilink('passive', 'fertilizer')} is also a catalyst for ${ilink('weapon', 'big-fry')} and ${ilink('weapon', 'overgrowth')}.\n- **Inference**: economy picks pay off most early; late in a run a damage or defence pick is usually worth more.\n\n` +
      `## Use the map\n\n- **Verified**: biomes differ in gold and XP multipliers (up to ×1.4 gold in ${link('biome', 'coin-laundromat')} and ×1.2 XP in ${link('biome', 'crop-circle')}) and in hazards. See [Biomes](/biomes).\n- **Verified**: the [Spud Whetstone](/points-of-interest#spud-whetstone) levels up a weapon, the [Seed Vault](/points-of-interest#seed-vault) gives rerolls, a skip and a banish, and the [Frenzy Fryer](/points-of-interest#frenzy-fryer) gives 20 s of ×1.4 fire rate.\n`;
  },

  coverage() {
    return `What this wiki could not cover or verify as of ${BUILD.researched} (build \`${BUILD.boot}\`):\n\n` +
      `- **Exact meaning of some raw parameters.** Weapon, boss, item and event pages list raw parameters (\`hitInterval\`, \`fling\`, \`snap\`, pattern \`motion\` …) under the game's internal names. Their precise in-game effect was not traced for every weapon.\n` +
      `- **Per-weapon attack code.** Damage, cooldown, amount and level values are verified; how each attack kind uses area, speed, duration and interval was not traced weapon by weapon.\n` +
      `- **Story replay.** After the Story ending, Story leaves the level picker; whether it can be replayed from another screen is not verified.\n` +
      `- **Point-of-interest tiers.** Beetle Nests and Boss Lairs scale with a POI tier; how the tier is assigned (likely distance) was not traced.\n` +
      `- **Hidden or easter-egg content.** The developer says the game has easter eggs (“i hope you enjoy it and find all the easter eggs”, [launch post](${LAUNCH})). Content outside the data tables is not covered.\n` +
      `- **Patch history.** The game has an in-game changelog (\`changelog-panel-zzeAm4SM.js\`), but its summaries do not list every code change. The [History](/history) page combines first-party posts with this wiki's reviewed build comparisons. X search was rate-limited during the original research on 2026-11-02, so some developer replies may be missing.\n` +
      `- **Leaderboards and shared runs.** Shared run links live under \`/r/\`; no public leaderboard page was found.\n` +
      `- **Other languages.** English text only; the game has 27 languages.\n` +
      `- **Hands-on testing.** Values come from code, not from measuring play.\n` +
      `- **Future updates.** The game changes often. Use **Check live game for updates** at the top of any page to compare the live game with this wiki, or see [Versions & updates](/versions). Detected builds still need review before deployment.\n`;
  },
};

export function historyPage() {
  const rows = [
    ['2026-10-28', 'poteto teases a new domain: “i bought a new domain too”.', 'https://x.com/poteto/status/2115314718370054312'],
    ['2026-10-29', 'Development starts: the repository\'s initial commit is dated Oct 28, 2026, 9:07 PM PDT (screenshot in the trivia thread).', TRIVIA],
    ['2026-10-31', '“this is gonna be really fun! look out for it some time tomorrow”.', 'https://x.com/poteto/status/2116662792631746861'],
    ['2026-11-01', 'Launch: “Day 28/ tibo\'s game has landed … i had a blast making it with grok bot and cursor! i hope you enjoy it and find all the easter eggs … you should be able to play it inside of X too”.', LAUNCH],
    ['2026-11-01', 'Build trivia thread (see below). Says the game supports 10 languages.', TRIVIA],
    ['2026-11-02', 'First known post-launch fix: “this was a bug, fixed it :D”, replying to a player report about the dialogue box and Grok Bot link. Which behaviour was the bug is not stated.', 'https://x.com/poteto/status/2117119937907192161'],
    ...BUILDS.slice(1).map((b) => [b.seen, `New game build: game version ${b.version} (\`${b.boot}\`, \`${b.sim}\`${b.commit ? `, commit \`${b.commit}\`` : ''}). ${b.changes} No announcement found.`, '/versions#version-history']),
    ['by 2026-11-02', 'The game lists 27 languages on its About page and llms.txt (up from 10 in the trivia thread). No announcement found; exact date unknown.', 'https://tibo.dog/about/'],
  ];
  const body = `tibo.dog was made by [poteto](https://x.com/poteto) with Grok Bot and Cursor and launched on 2026-11-01. This timeline combines the developer's posts with this wiki's reviewed build comparisons. The game also has an in-game changelog (\`changelog-panel-zzeAm4SM.js\`); build comparisons distinguish newly changed code from notes added later about older releases.\n\n## Timeline\n\n` +
    tbl(['Date (UTC)', 'Event', 'Source'], rows.map(([d, e, u]) => [d, e, u.startsWith('/') ? `[details](${u})` : `[post](${u})`])) +
    `\n## How it was made\n\nFrom the developer's [build trivia thread](${TRIVIA}) (quotes):\n\n` +
    [
      'started working on the game as a side project 4 days ago, landing ~1,150 PRs',
      'used TLA+ heavily to find bugs in the game\'s various state machines: the story, cutscenes, the game\'s systems',
      'game engine is mostly custom. three.js draws the 3D scene, but the simulation, post-processing and audio are all ours',
      'the simulation is fully deterministic, so every run replays exactly from its inputs. when you post a high score, the server replays your whole run to check it isn\'t cheated',
      'my favorite feature: the music seamlessly transitions into different music for the various biomes, continuing the previous melody',
      'no audio files. all the music and sound effects are synthesized live in the browser by a custom Game Boy-style chip (two pulse voices, a wave voice, noise) plus a synthwave layer',
      'all the pixel art is code. every sprite is a file drawn with one shared palette and packed into a sprite atlas at build time',
      'it runs inside an X post, from the 245px card up to full screen. the bar is 60 fps with 500 enemies on a mid-range phone',
      'bots play the game headless to tune each difficulty against target survival rates',
    ].map((q) => `> ${q}`).join('\n>\n') +
    `\n\nThe current difficulty table has internal \`mixReach\` balance targets, not measured survival rates (see [Modes](/modes#design-targets)).\n\n## Story mode bug fixes before launch\n\nThe trivia thread includes a chart of Story-mode bugs found with TLA+ before launch, with pull request numbers (#929, #933, #943, #988, #1013, #1080, #1094, #1191). Examples: “The gear chest gave Tibo a second Peeler, via a Grok Bot level-up”; “The 8 s auto-pick cut poteto's level-up lesson”.\n`;
  return {
    path: '/history',
    title: 'History',
    description: 'Development and release history of tibo.dog from the developer\'s own posts: launch on 2026-11-01, build trivia and fixes.',
    body,
    sources: [`[Launch post](${LAUNCH})`, `[Build trivia thread](${TRIVIA})`, '[About tibo.dog](https://tibo.dog/about/)'],
    search: 'history release launch patch notes changelog',
  };
}
