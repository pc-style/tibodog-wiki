// Verified facts gathered from code reading and official sources that are not plain data tables.
// Each note cites its source. Keep inference explicitly labelled.
import { readFileSync } from 'node:fs';
import { R, GAME, BUILD, BUILDS, ilink, link, name, fmt, pct, t, utc } from '../lib/data.mjs';

const tbl = (head, rows) =>
  `| ${head.join(' | ')} |\n|${head.map(() => '---').join('|')}|\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}\n`;

const TRIVIA = 'https://x.com/poteto/status/2117043478140276847';
const LAUNCH = 'https://x.com/poteto/status/2117004709198475365';

export const NOTES = {
  unlocks: `Story and the four base difficulties are available from the start. Select **Open World** on the title screen, then press **RESET** to open the difficulty dialog. Gear persists between runs; surviving a Nightmare ladder level to 20:00 unlocks the next. See [Nightmare ladder](/modes#nightmare-ladder).

## Level picker

**Verified** (\`boot-CxcYXMy8.js\` and \`title-gear-parts-T9yLlDYR.js\`):

- **Choose a mode, then press RESET.** The title has **Story**, **Daily** and **Open World** selection buttons. Only the selected mode has a gold fill; an unselected Daily uses the same dark fill as the other modes. Selecting a mode does not open a dialog. RESET starts Story, opens the Daily preview, or opens the Open World difficulty dialog; the latter two still have their own **Start** button. Arrow keys move between available modes; Enter or Space selects and activates the focused mode. <small>[boot-CxcYXMy8.js: \`\` .title-button[aria-pressed=true]{--title-note-opacity:1;color:var(--ui-ink-on-accent);background:var(--ui-primary) \`\`]</small> <small>[title-gear-parts-T9yLlDYR.js: \`n.setAttribute(\`aria-pressed\`,String(t===e.mode()))\`]</small> <small>[boot-CxcYXMy8.js: \`case\`daily\`:return t?.openTitleDaily(e.app,c),\`idle\`\`]</small> <small>[title-gear-parts-T9yLlDYR.js: \`className:\`ui-panel run-dialog\`,testId:\`run-dialog\`\`]</small>
- **Return to the last mode after Story.** Starting a run saves Story, Daily or Open World as \`picker.lastMode\`, separately from the last non-Story difficulty. Merely highlighting a mode does not save it. Before Story is completed, the title still defaults to Story even if Daily or Open World was saved. Reaching Story's ending sets \`storyDone\`, makes Easy the fallback difficulty and selects Open World for the next visit; later visits can restore the saved mode. Story stays available (see [Replaying Story](/story-mode#replaying-story)). <small>[boot-CxcYXMy8.js: \`e.view().selected===sp?\`story\`:i.lastMode\`]</small> <small>[boot-CxcYXMy8.js: \`storyDone:!0,lastPick:n.afterStory,lastMode:\`openWorld\`\`]</small>
- Nightmare has a numbered level selector. A fresh save starts at **N1**, with both arrows disabled until another level is unlocked. See [Nightmare ladder](/modes#nightmare-ladder) for the N2–N5 rules, scaling and tested progression limits.

## Recipe discovery

**Verified** (\`run-records-B7vnc93R.js\`, \`recipe-view-B2N-8UIN.js\`): the game remembers every evolution, union and item evolution you have made. Recipe hints on cards always name weapon evolutions and unions, but an **item evolution's result shows as “???”** until you have made it once. <small>[recipe-view-B2N-8UIN.js: \`\` case\`itemEvolution\`:return i.unlocked(s.result)?h(p(t( \`\`]</small>

## Encyclopedia

**Verified** (\`run-records-B7vnc93R.js\`, \`encyclopedia-screen-_qsn3tNP.js\`): the in-game encyclopedia has shelves for weapons, passives, items, evolutions, enemies, bosses, biomes and dogs. An entry shows as “???” until you have seen it: a weapon or passive counts once it is offered on a card or owned, an item once it is offered (chest, Fry Cart, Microwave) or owned, an enemy or boss once one is on the field, a dog once it is in your pack or offered in a swap (strays on the ground do not count), and a biome once you enter it. This wiki lists everything, including entries you have not found yet.

## Saved settings

Settings, the analytics choice, the picker state and discoveries are kept in the browser. Gear also has a Save Code and optional backup flow; clearing browser data is not a substitute for keeping that code. The [privacy page](https://tibo.dog/privacy) describes the game's storage policy.

## Grok Bot promo

**Verified** config: a Grok Bot promotion (\`https://x.ai/bot?tibodog\`) appears as its own panel after every death, before the end screen, including runs that survived 20:00 (\`ad: {trigger: "everyDeath", everyN: 3, showAfterWin: true}\`; \`everyN\` only applies to the unused \`everyNth\` trigger). Its exit button (“Next” or “Reset”) unlocks after a 2 s countdown; closing it opens the end screen. The Story ending uses the same panel with a “Play Easy” button.
`,
  settings: `**Verified** from the settings panel (\`settings-panel-CjM-Peg_.js\`) and defaults in \`boot-CxcYXMy8.js\`. Tabs: Sound, Language, Comfort, Graphics, Privacy.

| Setting | Options | Default |
|---|---|---|
| Music volume | slider | full |
| Sound volume | slider | full |
| Language | 27 languages | browser language, unless the address has \`?lang=\` (see [Languages](/controls#languages)) |
| Color-blind mode | Off, Protanopia, Deuteranopia, Tritanopia (with a Danger / XP / Health colour preview) | Off |
| Weapon effects | slider | full |
| Screen shake | Off, Low, Full | Full |
| Flashing effects | On / Off | On |
| Damage numbers | On / Off | On |
| Hitbox (“Shows where shots hit Tibo.”) | On / Off | On |
| Recommended picks | On / Off | On |
| Map tips (“Explains each new place on the map once.”) | On / Off (Comfort tab) | On |
| Quality | Auto, Very low, Low, Medium, High | Auto |
| Battery saver | Off, On, Auto (Graphics tab) | Off |
| Analytics (“Anonymous gameplay stats help poteto improve the game. No name, account or IP address is recorded.”) | On / Off | On (off by default in the EU and EEA, per the game's privacy page) |

**Very low** is a manual setting below Low. It removes weapon effects and debris, caps scene rendering at 640,000 pixels in large windows, and uses a 1× HUD pixel ratio. Enemy shots and attack warnings remain visible. Auto does not descend into Very low: Low is still its bottom tier. This reduces rendering work; it is not a measurement of battery life or temperature. <small>[quality-CTVMwgh3.js: \`hudPixelRatio:1,maxScenePixels:64e4,weaponEffects:0\`]</small> <small>[auto-track-C00STmoP.js: \`high:\`medium\`,medium:\`low\`,low:\`low\`,verylow:\`verylow\`\`]</small>

### View and menu scale

The camera now sits farther back. Its requested zoom factor is 1.15, but the view is capped to keep its corners inside the spawn ring; it is not a promise of 15% more visible area at every window shape. Menus and the HUD use shared spacing and text scales, with text growing in large desktop windows. <small>[boot-CxcYXMy8.js: \`camera:{zoom:1.15}\`]</small> <small>[scene-CbBToSV-.js: \`Math.max(1,Math.min(e.level,(e.ring-va.popMargin)/t))\`]</small>

SwiftShader uses flattened sprite geometry instead of instancing. The official journal describes smoother software rendering; this is not a measured speed-up on physical devices. <small>[boot-CxcYXMy8.js: \`flatInstances:(c=cl(),al.test(c))\`]</small>

### Battery saver

**Loading behavior**: On now limits drawing immediately, before the extra Battery saver module has downloaded. That module is requested only once a run is active or its intro has started, rather than from the menu. The same pacing object is kept when loading finishes; Auto's power and load checks still need the module. Controlled old/new probes covered Off, Auto and On in the menu, run and both intro states; after loading, On still admitted 30 of 60 callbacks at 60 Hz, versus 60 for Off and idle Auto. <small>[boot-CxcYXMy8.js: \`\` r===void 0?(this.pace.hold(n===\`on\`),n===\`on\`&&(e.loop.pace=this.pace)):r.frame(e,t) \`\`]</small>

**Verified**: On targets 30 drawn frames a second; it does not change the simulation's tick rate. Auto saves power while an unplugged battery is at 20% or less, under serious/critical CPU pressure when the browser exposes it, or after 30 hot one-second observation windows during active play. A window is hot when work exceeds 60% of its time or average frames take more than 1.25 times their target interval; a cool window reduces the accumulated count by one. Heat-triggered saving lasts until a new run state. Graphics quality accounts for the intentional slower drawing rather than treating it as an accidental frame-rate drop. <small>[battery-saver-CnJGt96p.js: \`\` this.hotWindows>=this.cfg.hotWindows&&(this.heat=n?\`slow\`:\`load\`) \`\`]</small> <small>[battery-saver-CnJGt96p.js: \`\` t(!r.charging&&r.level<=e) \`\`]</small> <small>[boot-CxcYXMy8.js: \`\` batterySaver:{windowSec:1,hotDuty:.6,slowRatio:1.25,hotWindows:30,lowBattery:.2} \`\`]</small>

Measured with this build's actual Battery saver module and controlled frame/power inputs: On admitted 30 of 60 callbacks at 60 Hz, while Off and idle Auto admitted 60. Sustained 11 ms work per 16.67 ms frame activated Auto after about 30.48 s; sustained 25 ms frames against a 16.67 ms target activated it after 30 s. At 9 ms work it stayed off. An unplugged battery at 20.1% did not trigger it; 20.0% did, and charging cleared that trigger. These probes check the controller, not real-device temperature or battery-life improvements.

Map tips explain a nearby, unused point of interest once per kind. Read tips are remembered in this browser across runs; turning tips off does not clear that history. The first tip includes a link to turn them off in Settings. Tips wait while overlays or story scenes block them. <small>[boot-CxcYXMy8.js: \`\` var gs=\`tibo.poi-tips-setting.v1\` \`\`]</small> <small>[poi-tip-rule-CJEBW_Ni.js: \`\` n=\`tibo.poi-tips.v1\` \`\`]</small>

Other open tabs pick up a changed Map tips setting the next time they read it. A storage-clear event also clears the cached setting; with no saved value, tips default to On. This synchronizes the setting, not the history of read tips. <small>[boot-CxcYXMy8.js: \`\` e.key!==\`tibo.poi-tips-setting.v1\`&&e.key!==null||(n=void 0) \`\`]</small>

The hitbox setting shows a bright green ring with a dark edge on both sides at Tibo's enemy-shot collision centre; it does not change collision size. Color-blind modes give the ring its own color: pink-red for protanopia, teal for deuteranopia and magenta for tritanopia. The colored stroke is 3 CSS pixels wide, or 2 when the viewport's shorter side is 320 CSS pixels or less; the dark stroke underneath is 7 or 5 pixels wide, respectively. <small>[scene-CbBToSV-.js: \`sie={line:3,halo:7},cie={line:2,halo:5}\`]</small> <small>[scene-CbBToSV-.js: \`\` lie={off:{line:\`#23f000\`,halo:ir},protanopia:{line:\`#ee5566\`,halo:ir},deuteranopia:{line:\`#11aa88\`,halo:ir},tritanopia:{line:\`#ff22ff\`,halo:ir}} \`\`]</small> <small>[scene-CbBToSV-.js: \`u=a.cfg.player.hitRadius\`]</small>

Updating settings saved before version 3 turns the hitbox on once, even if it was off; you can turn it off again. <small>[boot-CxcYXMy8.js: \`\` field:\`hitbox\`,from:3 \`\`]</small>

If the game closed unexpectedly, it restarts on Low quality: “The game closed unexpectedly last time, so it started on Low. Pick a quality to switch back.” Repeated crashes start lean 3D at half resolution, without adaptive quality or automatic climbing. This is not a 2D renderer. <small>[boot-CxcYXMy8.js: \`return{params:t.params,settings:n,lean:!0}\`]</small>

### Graphics recovery

**Auto quality** starts at High on every device and lowers quality as needed. Failed adaptive scene construction tries one tier lower (High → Medium → Low); the tracker remembers the lower tier and can hold it across visits. This is separate from the lean recovery after a graphics crash. <small>[auto-track-C00STmoP.js: \`\` return i({...e,tier:r[e.tier],climb:!1},t) \`\`]</small>

**Verified**: play stops while the renderer is not ready. The run also waits at the endgame boundary until its lazy content, simulation and view are ready. Failed scene downloads retry after 1 s, then 2 s, 4 s and at most 8 s between attempts. A failed early sprite-page download can be retried too. There is no flat 2D fallback or renderer-selection URL parameter. <small>[main-T9nqT8ni.js: \`!this.renderer.ready()||(this.endgameWait??=Ve({chunks:this.chunks,host:this.hud.root})).holds(this.game.state)\`]</small> <small>[hd2d-renderer-PGvZjCyR.js: \`this.retrySec=Math.min(a.renderer.retryMaxSec,2*this.retrySec)\`]</small>

After WebGL context loss, the game waits up to 5 s for restoration, then tries a fresh context. If that recovery also fails, graphics stop. Scene construction has a separate recovery path: its first failure retries 3D on Low at half resolution, with adaptive quality off; another construction failure stops graphics. The stopped screen says “The 3D graphics stopped” and offers **Reload** and **Copy link**; input and audio stop too. Missing WebGL 2 at startup still shows the unsupported-device screen. <small>[hd2d-renderer-PGvZjCyR.js: \`this.failed?{...i,softwareGl:!0}\`]</small> <small>[boot-CxcYXMy8.js: \`tier:\`low\`,scale:zn.minScale,adaptive:!1,climb:!1\`]</small> <small>[no-webgl2-screen-CEDPyQRP.js: \`The 3D graphics stopped\`]</small>

An active intro or landing cutscene ends as skipped if its renderer stops reporting ready. <small>[boot-CxcYXMy8.js: \`if(this.host.renderer.cutscene()!==\`ready\`)return void this.end(!0);\`]</small>`,
  modesExtra: `## Level picker\n\nThe title offers **Story**, **Daily** and **Open World**. Choose Open World, select Easy, Normal, Hard or Nightmare in its dialog, then press Start. All four base choices are available from the start; Nightmare's numbered levels have separate unlocks. See [Nightmare ladder](#nightmare-ladder). After Story's ending, Easy becomes the fallback selection, while Story remains on the title screen. See [Replaying Story](/story-mode#replaying-story). <small>[title-gear-parts-T9yLlDYR.js: \`className:\`ui-panel run-dialog\`,testId:\`run-dialog\`\`]</small>\n\n## Level links\n\nA \`difficulty\` link, such as \`https://tibo.dog/?difficulty=hard\`, starts Easy, Normal, Hard or Nightmare directly, without the intro. Story and invalid values are ignored; shared-run links ignore this parameter. <small>[boot-CxcYXMy8.js: \`\` e.runFrom=t.relaunch?\`press\`:\`param\` \`\`]</small>\n\n## Shared runs\n\nA shared link records the run's difficulty. The reader withholds reconstructed scores for impossible-looking capped values; ladder runs use their own level-sensitive bounds. These client checks are not proof of server validation. <small>[run-score-B--1WCZe.js: \`t.tally.peakEnemies>l()\`]</small>\n\n### High-score replay submissions\n\nWith analytics consent, an ended-run ID and a session ID, the client can POST shared stats and encoded inputs to \`/replay\`. Base-level thresholds are **124,904 Easy; 74,546 Normal; 88,143 Hard; 137,597 Nightmare**. The client accepts match, mismatch or known skipped replies; malformed replies and network failures become unavailable. Requests omit credentials and referrer information. <small>[boot-CxcYXMy8.js: \`topScore:{easy:124904,normal:74546,hard:88143,nightmare:137597}\`]</small> <small>[run-replay-Ddb9oy-1.js: \`\` cache:\`no-store\`,credentials:\`omit\`,referrerPolicy:\`no-referrer\` \`\`]</small>\n`,
  controlsExtra: `## Other keys\n\n**Verified** (key map in \`boot-CxcYXMy8.js\` and the game's input code):\n\n| Key | Action |\n|---|---|\n| P | Pause / resume during a run (Escape also works) |\n| M | Mute / unmute |\n| T | Auto-advance story lines on or off |\n| Space | Skip story lines |\n| R | Play again (end screen) |\n| S | Share (end screen) |\n| Escape | Back |\n| Enter / Space | Activate the focused button |\n| Arrow keys | Move focus in lists |\n\nCards are numbered 1, 2, 3 (4) in order. The on-screen hint relabels W A S D for AZERTY, QWERTZ, Dvorak and Colemak layouts.\n\n## Dash details\n\n**Verified**: a dash moves 48 units over 9 ticks (0.15 s), each charge recharges in 5 s, Tibo starts with 1 charge and the input is buffered for 6 ticks. Tibo ignores normal damage while dashing (and during \`dashGrace\` from Ghost Pepper). A touch flick is a stroke of at least 30 px over the last 120 ms, moving at least 400 px/s when the finger lifts, or 900 px/s while it is still down (\`dash.flickPx\`, \`flickWindowMs\`, \`flickPxPerSec\`, \`heldFlickPxPerSec\`).\n\n`,
  modeCaptions: [
    ['Story', 'A short first game. Play this first.'],
    ['Easy', 'Fewer, weaker pests and a tougher Tibo.'],
    ['Normal', 'The game as designed.'],
    ['Hard', 'More pests, harder hits, tougher bosses.'],
    ['Nightmare', 'Crowds, a curse and no revives.'],
  ],
  storyCaption: 'A short first game. Play this first.',
  statsExtra: `## Armor\n\n**Verified**: damage taken = \`damage × (1 − min(0.85, armor / (5 × attacker level + armor)))\`. Attacker level is \`10 + minutes\`, +5 for elites, +10 for bosses.${'  '}<small>[sim-Cn6iREtF.js: \`function pc(e,t,n){let r=n.armor;return Math.min(r.cap,Et(e,r.k*t))}\`]</small>\n\nSo armor loses value over a run: 50 armor blocks 50% from a level-10 pest at 0:00 but 25% from a level-30 pest at 20:00. Reduction is capped at 85%. Guard weapons with charges subtract a fixed soak amount from a hit before armor; the hit is cancelled only if the soak is at least the damage.\n\n` +
    `While [frozen by the Deep Freezer](/bosses/deep-freezer#ice-cube-fan), Tibo takes another 25% less damage after guard, armor and Nightmare's boss-hit cap. This also reduces terrain damage; it is separate from the armor percentages below. <small>[sim-Cn6iREtF.js: \`(e,l*(1-pc(s.armor,i,e.cfg)),n,r)*(u?1-e.cfg.player.freezeDamageCut:1)\`]</small>\n\n` +
    tbl(['Armor', 'vs level 10 (0:00)', 'vs level 20 (10:00)', 'vs level 30 (20:00)', 'vs boss at 20:00 (level 40)'], [10, 20, 50, 100, 200].map((a) => [a, ...[10, 20, 30, 40].map((l) => `${Math.round(Math.min(0.85, a / (5 * l + a)) * 100)}%`)])) +
    `\nComputed from the formula.\n\n## Crit\n\n**Verified**: each hit crits with chance \`effective crit chance + the weapon's own critBonus\`; a crit multiplies damage by \`2 + crit damage\`. Hits on elites and bosses are first multiplied by \`1 + elite damage\`.  <small>[sim-Cn6iREtF.js: \`let l=o.critChance+a.critBonus[r];l>0&&e.rng.next()<l&&(u*=o.critMult,d=!0)\`]</small>\n\n## Dodge\n\n**Verified**: when a hit would damage Tibo, dodge (evasion) is rolled right after the invulnerability checks; a success cancels the hit entirely. Damage from biome terrain and hazard pools is never dodged.\n\n## Weapon details\n\n- **Verified**: the amount bonus does not apply to \`aura\`, \`cone\`, \`nuke\` and \`ring\` weapons.\n- **Verified**: [Andrew's pairing ring](/visitors#andrew) and [Frenzy Fryer](/points-of-interest#frenzy-fryer) multiply weapon timer speed, separately from the cooldown stat's 60% cap. The cooldown floor is 0.05 s (15 s for \`nuke\` weapons) multiplied by that fire-rate factor before the faster countdown; the bonuses do not lower the floor's effective interval. Weapons with no cooldown at all (Steam Vent, whose aura hits on its own timer) stay at 0. <small>[sim-Cn6iREtF.js: \`\` let o=(a===\`nuke\`?e.cfg.reset.minCooldownSec:.05)*cy(e) \`\`]</small> <small>[sim-Cn6iREtF.js: \`function hy(e,t){let n=t-my(e);return n>1e-9?n:0}\`]</small>\n- **Verified**: ${'Mezzaluna'} and ${'Moon Cleaver'} (\`hpEdge\`) deal \`0.8 + (lowHpBonus + 0.2) × missing HP fraction\` times damage: 0.8× at full HP, up to 2.2× (Mezzaluna) or 2.6× (Moon Cleaver) near 0 HP.\n- **Verified**: projectiles fired by \`onHurt\` items (Porcupine Spud, Fry Volcano) deal \`(damage × (1 + 0.15 × minutes) + thornsShare × thorns) × damage multiplier\`, so they grow over the run. The thorns share is 1 for Porcupine Spud and 1.5 for Fry Volcano.\n\n## Luck\n\n**Verified**: luck gives a 4th level-up card with chance \`min(1, luck)\`, bigger chests (\`× (1 + luck)\` on the 3- and 5-reward chances) and rarer items (rarity *n* weight × \`(1 + luck)^n\`). In-game: “Better odds of a fourth level-up card, bigger chests and rarer items.”\n\n## Healing and revives\n\n- **Verified**: recovery heals that many HP per second; heal on kill heals per kill. Both are capped at max HP.\n- **Verified**: outside Story, a revive restores ${pct(GAME.player.reviveHp)} max HP and grants ${GAME.revive.graceSec} s of invulnerability. The burst knocks back visible enemies and bosses whose bodies overlap its ${GAME.revive.radius}-unit radius (push ${GAME.revive.push}), freezes pests and elites for ${GAME.revive.stunSec} s, and slows bosses to ${pct(GAME.revive.bossSlow)} speed for ${GAME.revive.stunSec} s while delaying their next pattern. Nearby enemy shots are cleared. <small>[intro-shared-DvfEr63Y.js: \`revive:{graceSec:4,radius:160,push:900,stunSec:5,bossSlow:.5,clearsBullets:!0}\`]</small> <small>[sim-Cn6iREtF.js: \`let n=e.enemies,r={kind:\`freeze\`,seconds:e.cfg.revive.stunSec}\`]</small> <small>[sim-Cn6iREtF.js: \`i={kind:\`slow\`,factor:n.bossSlow,seconds:n.stunSec}\`]</small>\n- **Verified**: Story keeps its ${GAME.story.invulnSec} s grace and ${GAME.story.burstRadius}-unit pest knockback burst; its revive does not apply the non-Story freeze or boss slow. Nightmare allows no revives and removes Second Spud from the item pool.\n\n`,
  xpPow: 'Powers use the deterministic power function (`x^y`) exported by `boot-CxcYXMy8.js`.',
  xpTableNote: 'Computed from the formula; this is the requirement before XP gain multipliers.',

  officialSources: `The developer's [build trivia thread](${TRIVIA}) (2026-11-01) was used for history and Story mode flow.`,

  strategy() {
    const multi = {};
    for (const e of R.evolutions) (multi[e.catalyst] ??= []).push(ilink('weapon', e.id));
    for (const e of R.evolvedItems) (multi[e.catalyst] ??= []).push(ilink('item', e.id));
    const top = Object.entries(multi).filter(([, v]) => v.length >= 3).sort((a, b) => b[1].length - a[1].length);
    return `Strategy advice is **inference** unless marked **Verified**: it is reasoning from the game's numbers, not developer guidance. No official tips have been published by the developer as of ${BUILD.researched}.\n\n` +
      `## Know the clock\n\n- **Verified**: a run counts as survived at 20:00, when ${ilink('boss', GAME.win.finalBoss)} arrives; there is no win screen and the run goes on. Boss HP is multiplied ×3 from minute 16, ×4 from 18 and ×6 from 20 (\`bosses.hpSteps\`).\n- **Verified**: from 20:00, enemy HP and damage use five-minute phases, with stronger cycles every 20 minutes (see [Enemy scaling](/enemy-scaling)). Each boss you beat raises a [Spud Forge](/points-of-interest#spud-forge) that sells a limit break.\n- **Inference**: plan for a strong single-target or elite-damage source by minute 15 to handle the boss HP steps. Save gold for forges if you plan to keep going.\n\n` +
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
      `- **Update 1 testing.** The original short combat report records Sprout Squad damage **0 / 9.91 / 0** across three seeds, not zero in every run. Follow-up trigger-specific probes cover ten conditional passives, eleven items and all four new dogs: **105 passing cases** across three seeds, including 30 full-Game integration cases for movement, dashing, contact damage and dog abilities. Each affected entity page now reports its observed trigger, setup and controls. Direct rule calls, granted entities, fixed targets and forced counters do **not** settle natural acquisition, every stacking/target interaction, sustained proc limits or practical build strength. Nightmare's picker, stored-level controls, 20:00 unlock watcher and N1–N5 early-boss counts are tested (see [Nightmare ladder](/modes#nightmare-ladder)); a real N1 browser run ended at 2:09, so a naturally earned 20-minute clear remains unverified. Gear drop odds and server claims still need appropriate evidence.\n` +
      `- **Raw parameters and per-weapon attack code.** Every weapon, item, boss, event, dog and biome page now explains its raw parameters (\`hitInterval\`, \`fling\`, \`snap\`, pattern \`motion\` …) in plain language, read from the sim code. Most of those readings are not yet confirmed by measured play. The [Spittlebug's paired orbiting bubbles](/enemies/spittlebug) are now measured on both builds 44 and 45 with the same seed and setup on all four difficulties: three single shots became two pairs, with opposite orbit phases and difficulty-scaled separation. This settles that attack's shot count and motion, not every enemy pattern.\n` +
      `- **Hidden or easter-egg content.** The scripted jokes and reveals found in the code are on [Secrets](/secrets), most of them seen in play. Not yet seen on screen: poteto's 20:00 taunt, Andrew's cheers, the fries lines after the second knock-out, and Alex's join text outside Story. Content drawn only into sprite art was not searched.\n` +
      `- **Patch history.** Every entry of the in-game **What's new** panel is now on [History](/history#official-patch-notes). Still open: the panel does not explain changes it leaves out, so smaller code changes are known only from the wiki's own build comparisons; and X search was rate-limited during the original research on 2026-11-02, so some developer replies may be missing from the timeline.\n` +
      `- **Server-side score checks.** The client posts qualifying runs to \`/replay\`. Shared cards can now show Verified or FORGED and Daily runs have boards (see [Modes](/modes#leaderboards)). The client and public UI do not independently prove the server's validation rules.\n` +
      `- **Other languages.** How the game picks its 27 languages, and every entity's name in each of them, are on [Controls](/controls#languages). Descriptions, interface text and the translated in-game changelogs are not mirrored; the wiki itself is English only.\n` +
      `- **Battery saver.** Controlled probes of the current build's actual controller confirmed drawing cadence, sustained-load/slow-frame thresholds, power-trigger precedence, the 20% battery boundary and new-run heat reset (see [Settings](/controls#battery-saver)). Actual temperature and battery-life savings on physical devices remain unmeasured.\n` +
      `- **Earlier hands-on testing.** Most values come from code. Earlier same-input comparisons of build 41 (\`main-B2gf34bA.js\`) with build 43 (\`main-DG5OYSdZ.js\`) measured late-game scaling, charger windups (0.5 → 0.6 s after 20:00), a boss kill creating a forge (0 → 1), its 2,500-gold purchase, weapon/passive breaks and long-run score arithmetic. Original-game clock-warp probes from the endgame review confirmed the four [endgame phases](/endgame), their terrain and boss boundaries, family spawning and all three Crossroads choices, with old-build and Story controls. They do not establish a naturally earned 40-minute route, every family attack, random outcome, repeated-forge route or music transition.\n` +
      `- **Future updates.** The game changes often. Use **Check live game for updates** at the top of any page to compare the live game with this wiki, or see [Versions & updates](/versions). Detected builds still need review before deployment.\n`;
  },
};

// Every English entry of the in-game What's new panel, extracted from the documented build.
const CHANGELOG = JSON.parse(readFileSync(new URL('../data/changelog.json', import.meta.url), 'utf8'));

function patchNotes() {
  const C = CHANGELOG.chunk;
  const cite = (q, file = C) => `<small>[${file}: \`\` ${q} \`\`]</small>`;
  // The panel shows each kind as an icon only; these words are the wiki's names for the icons.
  const KIND = { weapon: 'Weapon', item: 'Item', dog: 'Dog', boss: 'Boss', story: 'Story', balance: 'Balance', fix: 'Fix', ui: 'Interface', language: 'Language', art: 'Art' };
  const byCommit = new Map(BUILDS.filter((b) => b.commit).map((b) => [b.commit.slice(0, 7), b]));
  const own = BUILD.commit.slice(0, 7);
  const days = CHANGELOG.days;
  const waves = days.flatMap((d) => d.waves);
  const count = CHANGELOG.unreleased.length + waves.reduce((n, w) => n + w.lines.length, 0);
  const matched = waves.filter((w) => byCommit.has(w.version)).length;
  const line = (l) => `- **${KIND[l.kind]}** · ${l.text}${l.about ? ` (${link(l.about.kind, l.about.id)})` : ''} ${cite(`id:\`${l.msgId}\``)}`;
  const wave = (w) => {
    const b = byCommit.get(w.version);
    return `**\`${w.version}\`**${b ? ` · same commit as [wiki build ${b.version}](/versions#version-history)` : ''} ${cite(`version:\`${w.version}\``)}\n\n${w.lines.map(line).join('\n')}\n`;
  };
  const day = (d, i) => {
    const n = d.waves.reduce((k, w) => k + w.lines.length, 0) + (i === 0 ? CHANGELOG.unreleased.length : 0);
    const next = i === 0 && CHANGELOG.unreleased.length
      ? `**\`${own}\`** · listed under your version: notes not yet given a version of their own ${cite('return e===`next`?t.listed?void 0:t.version:e')}\n\n${CHANGELOG.unreleased.map(line).join('\n')}\n\n`
      : '';
    return `### ${utc(d.date)}\n\n${n} changes, in panel order. ${cite(`date:\`${d.date}\``)}\n\n${next}${d.waves.map(wave).join('\n')}`;
  };
  return `## Official patch notes\n\n` +
    `These are all ${count} entries in the game's **What's new** panel in build ${BUILD.version} (\`${CHANGELOG.build}\`), copied word for word in display order: dates newest first, with the current-version group sorted by the game's own note comparator. Open it from **What's new** on the Reset screen, or visit [the game's full changelog](https://tibo.dog/changelog). When a newer version is out, the title-screen button becomes **Update game**.\n\n` +
    `- **Verified**: the English text is written inside \`${C}\` itself; the \`i18n-*-changelog-*.js\` chunks hold the other languages' translations. ${cite('case`en`:return{}')}\n` +
    `- **Verified**: the panel groups notes by date (${days.length} dates), and each date by short commit codes (${waves.length} codes). Each note has an icon for its kind; the bold kind names below are the wiki's words for those icons. ${cite('case`balance`:return`M8 2.75v10M5.25 13.25h5.5M3 4.75h10M3 4.75 1.5 8.5h3zM13 4.75 11.5 8.5h3z`')}\n` +
    `- **Verified**: notes not yet given a code of their own are listed first, under the code of the version you are playing, tagged **Your version**. ${CHANGELOG.unreleased.length ? `In build ${BUILD.version} that is ${CHANGELOG.unreleased.length} notes, shown under \`${own}\`.` : `Build ${BUILD.version} has no such notes, so the panel shows no current-version group.`}\n` +
    `- **Verified**: ${matched} codes equal the commit of a build this wiki compared, and are linked to it. The other codes match no build the wiki compared.\n` +
    `- **Provenance limit**: matching codes link the two histories; they do not prove that every grouped note first shipped in that build, or that every earlier feature remains unchanged. For example, the wiki first saw the Spud Freezer banner fix and shared-run difficulty in wiki build 3 (\`6dcf252\`), but the panel files them under \`bd52bae\` and \`454878b\`. A current-version group can likewise combine notes first observed across several builds.\n` +
    `- **Date limit**: journal dates are reproduced as published, not converted to UTC. Their timezone is not established by the notes. Wiki observation/deployment times are UTC; a deployment time does not establish when a journal entry was published.\n` +
    `- **Inference**: the panel summarises changes players notice. It does not list every code change: no entry mentions wiki build 5's change, which hides banners while the screen is fully dark during Story's knock-down sequence.\n\n` +
    `Extraction provenance: [official source chunk](${CHANGELOG.source.url}), SHA-256 \`${CHANGELOG.source.sha256}\`, extracted ${CHANGELOG.extracted}. Browser/export verification and its limits are recorded in the [journal audit](#journal-audit). A successful extraction alone is not a new browser verification.\n\n` +
    days.map(day).join('\n');
}

export function historyPage() {
  const rows = [
    ['2026-10-28', 'poteto teases a new domain: “i bought a new domain too”.', 'https://x.com/poteto/status/2115314718370054312'],
    ['2026-10-29', 'Development starts: the repository\'s initial commit is dated Oct 28, 2026, 9:07 PM PDT (screenshot in the trivia thread).', TRIVIA],
    ['2026-10-31', '“this is gonna be really fun! look out for it some time tomorrow”.', 'https://x.com/poteto/status/2116662792631746861'],
    ['2026-11-01', 'Launch: “Day 28/ tibo\'s game has landed … i had a blast making it with grok bot and cursor! i hope you enjoy it and find all the easter eggs … you should be able to play it inside of X too”.', LAUNCH],
    ['2026-11-01', 'Build trivia thread (see below). Says the game supports 10 languages.', TRIVIA],
    ['2026-11-02', 'Developer reply: “this was a bug, fixed it :D”, replying to a player report about the dialogue box and Grok Bot link. Which behaviour was the bug is not stated; the official journal also records fixes dated November 1.', 'https://x.com/poteto/status/2117119937907192161'],
    ...BUILDS.slice(1).map((b) => [b.seen, `Observed game build: game version ${b.version} (\`${b.boot}\`, \`${b.sim}\`${b.commit ? `, commit \`${b.commit}\`` : ''}). ${b.changes}`, '/versions#version-history']),
    ['by 2026-11-02', 'The game lists 27 languages on its About page and llms.txt (up from 10 in the trivia thread). The official journal dates additions through Hausa and Nigerian Pidgin to November 1 and Arabic, Persian, Hebrew and Urdu to November 2; these are journal dates, not independently measured introduction times.', '/history#official-patch-notes'],
  ];
  const body = `tibo.dog was made by [poteto](https://x.com/poteto) with Grok Bot and Cursor and launched on 2026-11-01. This page has two separate parts: the game's own [patch notes](#official-patch-notes), copied from its in-game **What's new** panel (also published on the [official changelog](https://tibo.dog/changelog) in all 27 languages), and a [timeline](#timeline) of the developer's posts and this wiki's build comparisons.\n\n` +
    patchNotes() +
    '\n' + readFileSync(new URL('../data/journal-audit.md', import.meta.url), 'utf8') + '\n' +
    `\n## Live-build observations on November 5\n\nThe wiki reviewed \`main-DG5OYSdZ.js\` after build 41 (\`main-B2gf34bA.js\`) and build 42 (\`main-BnCKpQy_.js\`). Later observations did not follow that order:\n\n- The release coordinator reported \`main-B2gf34bA.js\` around 00:43 UTC and at 01:43:21 UTC (the response's Cloudflare Date header). At the latter check, \`/version.json\` reported \`6f02b53732ba258fd4bc8cd298c779da7ad31e43\`; requests for \`main-DG5OYSdZ.js\` and \`boot-BAouheRt.js\` returned 404.\n- This wiki's updater independently saw the same B2 entry and version response at 01:57:24, 01:57:29 and 01:57:33 UTC; the DG assets also returned 404.\n- Since about 02:08 UTC, monitor/coordinator checks saw \`main-C2skBLTa.js\`; the updater confirmed it at 02:09:20 UTC, with \`/version.json\` reporting \`71b0c5ec900735e0142742cd4c2e1d9975b11c5e\`. C2 retains DG's gameplay changes and adds Battery saver.\n\nSources: no-cache requests to [the game entry](https://tibo.dog/) and [version.json](https://tibo.dog/version.json), plus the named asset requests. These are observations of served responses, not proof of a deployment rollback or repository history. Hashes above are values reported by \`/version.json\`; caching or region differences cannot be ruled out. The original build-41, build-42 and DG reviews remain in [Versions](/versions#version-history).\n\n` +
    `\n## Timeline\n\nThe developer's posts and the builds this wiki compared. Build descriptions are the wiki's own reading of the code, not official notes.\n\n` +
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
    description: 'Every official tibo.dog patch note from the in-game What\'s new panel, plus the development and release history from the developer\'s own posts.',
    body,
    sources: [`In-game What's new panel (\`${CHANGELOG.chunk}\`, build \`${CHANGELOG.build}\`)`, `[Launch post](${LAUNCH})`, `[Build trivia thread](${TRIVIA})`, '[About tibo.dog](https://tibo.dog/about/)'],
    search: 'history release launch patch notes changelog what\'s new updates fixes',
  };
}
