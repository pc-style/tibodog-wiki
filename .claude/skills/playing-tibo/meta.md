# Build guidance from shared runs

## Scope and recommendation

Analyzed on **2026-11-08**: 99 unique shared runs from `/tmp/top-runs-links.txt`, all **Daily day 20765 (November 8), Nightmare**, ladder N1–N22. All 99 contain Storm Sage set-rule damage; this is a fixed-kit sample, not 99 independent choices of the best gear set. The reader rejected none and flagged none as forged, but these unsigned links are **not independently replay-verified**. No new gameplay or controlled build comparison was performed for this analysis.

**For this Storm Sage Daily, build Starch Supercell first, then consider Root Current; prioritize synergistic damage items rather than filling every slot with unrelated weapons.** This is an observed successful pattern, not a proven optimal pick order. For Open World, use it as a candidate only if the actual worn set and starting offers fit. Do not recommend replacing today's fixed Daily gear with personal gear.

The input file changed during the initial inspection; the results below use the complete 99-link snapshot with SHA-256 `0095ef876af594c23051c528e69ba715d1ba130e40617670313d5d96143974f7`, not the initial partial read. Preserve a fresh snapshot before repeating the analysis.

## Weapon and passive plan

| Priority | Path | Why this sample supports it |
|---|---|---|
| Core | Starch Chain + Hot Sauce → Gratin Arc; Starch Bolt + Sprouting Eyes → Thunder Tuber; combine the two evolutions → **Starch Supercell** | Supercell appears in 77/99 runs and all first 10 ladder-ranked rows. Hot Sauce and Sprouting Eyes appear in 95/99 and 78/99, respectively, and both in all first 10. |
| Secondary | Root Spikes + Masher Grip → Taproot Eruption; Potato Battery + Root Network → Spud Grid; combine → **Root Current** | Root Current appears in 19/99 and 5/10 first rows, including N22 and N14. Strong secondary evidence, not mandatory in every successful run. |
| Flexible | Starch Puddle + Butter Pat → **Gratin Puddle** | A storm-class pool supported by Static Step; present in the highest-score N9 run. Use when this catalyst fits the remaining passive slots. |
| Situational | Fry Lance + Spud Sneakers → **Railfry**; Julienne Dash + Butter Socks → **Waffle Cut** | Railfry and Waffle Cut appear in 22/99 and 21/99. Useful alternatives, not a reason to delay the core. Waffle Cut is dash-triggered and does not itself qualify for Static Step. |

These are current registry recipes, not acquisition guarantees. Use the ordinary evolution/union eligibility rules; simply holding a level-one base and catalyst is not a completed evolution. The two-union core uses **four passive slots**: Hot Sauce, Sprouting Eyes, Masher Grip and Root Network. Choose the remaining two deliberately: Butter Pat for Gratin Puddle, Four-Eyed Spud for All-Seeing Spud, mobility/survival, or another needed catalyst. Do not promise every optional path in six slots. An evolved weapon can bias partner offers, but does not guarantee them.

**Move between volleys.** Storm Sage's full-set Static Step earns a spark per 20 units walked, up to eight. Eligible non-dash storm volleys can spend one to fork hits to another target strictly less than 80 units away at triple damage in build 169 (`main-cl5j-uRS.js`); the November 8 sample above predates this change and used double damage. Empty sparks lengthen eligible nonzero cooldowns by 30%. These are rule-strength-1 values; gear strength and ladder scaling can alter scaled bonuses. Spud Dynamo, Dynamo Coil and the starch pools also qualify. Do not stand still just because the weapon auto-fires, or assume dash attacks feed the same rule. Orbit contacts reuse their activation's spark decision, rather than spending a fresh spark on every contact.

Build 169 also restores the full-set storm-only new-weapon filter and adds +30% global might and another +25% storm attack rate at strength 1. This narrows eligible offers, not a guarantee of a particular draw or an extra slot. Original build-168/169 controls with three supplied normal-quality, power-0 pieces (strength 0.7) measure +21% global weapon damage and storm cooldowns divided by 1.175; partial sets remain unchanged. These current controls do not replay or re-rank the dated shared-run sample.

## Item priorities

The link's item section is **up to eight damage-dealing item rows**, not the inventory. It omits non-damaging utility items and stack counts, and retains base-item damage after evolution. Frequencies below cannot rank every shop item or establish absence from the run.

1. **Static Tot → Storm Tot with Root Network.** Storm Tot appears in 22/99 damage lists. It is the strongest recorded item in N22 (35,498,476 damage) and the highest-score N9 run (2,678,278,538). Its on-hit chain/clap effect complements frequent hits; Root Network also serves the Root Current path. This is the clearest item target for this sample, not a guaranteed shop offer.
2. **Heavy Russet → Meteor Russet with Masher Grip.** Meteor appears in 11/99 damage lists; N14 records 47,413,050 and the N9 score leader 576,696,038. It upgrades the on-hit bonk and adds a meteor blast; Masher Grip already serves Taproot Eruption. Prefer this shared-catalyst path when offered rather than spending a new passive slot unnecessarily.
3. **Wandering Eyes → All-Seeing Spud with Four-Eyed Spud.** All-Seeing appears in 5/99 lists, including 42,658,184 damage in N14. Kill-triggered seekers use the killed enemy's max HP as their damage basis. Strong optional crowd-clear candidate, but its extra passive competes with defense and other catalysts. Wandering Eyes itself contributes 556,304,650 in the N9 score leader; the evolved item is not a prerequisite for useful damage.

Bonfire Spud, Spicy Croquette and their paths also have substantial contributions. Base Freezer Burn requires frozen kills, so it needs a freeze source; its evolution **Glacier Spud removes that requirement** (`frozenOnly: false`). Do not transfer a base item's limitation to its evolution. Total damage across unequal runs is not controlled DPS; a single long run heavily skews aggregate item rankings. Do not infer recursive proc chains, exact proc rates in play, or a universal tier list from these totals.

## Representative evidence

Nightmare compares ladder level before score. The first row is not the highest-score row, and the N9 score leader does not outrank N22.

| Run ID | Ladder / score | Key recorded damage |
|---|---|---|
| `bt7e9ff9s3516` | N22 / 34,548 | Storm Sage 49,392,854; Storm Tot 35,498,476; Supercell 7,990,945; Waffle Cut 2,420,105; Root Current 1,438,447 |
| `s2pv13r22b5e5` | N14 / 58,670 | Storm Sage 106,026,030; Meteor Russet 47,413,050; All-Seeing Spud 42,658,184; Supercell 21,832,681; Root Current 11,019,211 |
| `bbhey0gb3xqda` | N9 / 853,972 (highest score in sample) | Storm Tot 2,678,278,538; Storm Sage 2,153,973,480; Supercell 598,016,275; Meteor Russet 576,696,038; Wandering Eyes 556,304,650 |

Across the 99 runs, the median Storm Sage share is **53.0% of decoded source + item + set-rule damage**. This denominator is only the retained rows, not necessarily all actual damage. Never credit that separate set row to Supercell or count it as another weapon. Historical base/evolution/dog/helper rows also remain in `sources`; 20 rows do not mean 20 equipped weapons or dogs. Zero-damage dogs may provide utility and should not be ranked by damage alone.

The links omit build metadata, full gear and start sections; the set row identifies a set contribution, not exact gear powers or affixes. Recipe interpretation used the live-matching wiki build **`main-B15wsGXi.js`**, game commit **`de1088288f3c`**, sim **`sim-BOrXOAif.js`**. The runs' exact producing builds are unknown. Do not relabel them as runs proven to originate in that build.

## Refreshing the evidence

1. Snapshot the supplied links and hash the snapshot. Record retrieval date, sample size, duplicate IDs, parse failures, Daily day, difficulty and ladder groups. Check the live `https://tibo.dog/` asset against `data/build.json` and mirror it with the existing pipeline if needed. Do not mutate saves, submit scores or request gear rewards just to inspect runs.
2. Load the original reader after `loadGame()` installs the harness's browser stubs. In a scratch scenario run through `node tools/play.mjs <scenario.mjs>`, use the supplied `api`:

   ```js
   import { readFileSync, readdirSync } from 'node:fs';
   import { pathToFileURL } from 'node:url';
   export default async (_run, api) => {
     const link = readFileSync('/tmp/top-runs-links.txt', 'utf8').trim().split(/\n/)[0];
     const file = readdirSync(api.dir).find(f => /^run-address-/.test(f));
     const mod = await import(pathToFileURL(`${api.dir}/${file}`).href);
     // These exports are confirmed for main-B15wsGXi.js; inspect a new chunk first.
     const decoded = mod.s(new URL(link).search);
     if (decoded.kind !== 'link') return decoded;
     const summary = decoded.link.summary;
     const card = mod.a(summary);
     return { summary, card };
   };
   ```

   The example reads the first full URL; iterate the snapshot's lines for the complete sample. `mod.s` validates ID/data consistency and reads gear, Daily, ladder, set-rule, limit-break and exact-amount extensions; the lower-level summary reader alone silently misses those sections. `mod.a` resolves stable numeric keys to current definitions and reconstructs the score and forged flag. Inspect exports again after chunk changes; minified export names are not an API. Keep invalid/forged rows separate and state missing fields rather than inventing them. A matching ID is an integrity hash, not a server signature.
3. Group comparable runs before counting recipes, retained item rows and damage shares. Compare final passives and milestone history, not just the damage-row ordering. Do not infer exact final weapon slots from retained historical rows. Recheck recipes in `data/registry.json` and the original sim; check the live journal through `tools/dump-changelog.mjs` / `tools/update.mjs` if explaining changes between builds. This sample alone establishes no introduction dates.
4. For claims of superiority, run matched original-engine scenarios across at least 3–5 seeds with the same set, gear, ladder, movement, clock and item stacks. Report all grants, warps and HP refills; these fixtures do not establish natural acquisition, representative survival or server acceptance. Until then, label the recommendation observational. Keep dated results here, not as timeless rules in SKILL.md.

Decoder source URLs are `https://tibo.dog/assets/` plus the filenames below. SHA-256 of the mirrored source used:

| Chunk | SHA-256 |
|---|---|
| `run-address-BdJVgIW1.js` | `5ddf5e3918df404c6b1bd3a9cd3b11c8e6e6a747cf5a3d68f33b11e4aa15e8ec` |
| `run-summary-state-RZAhpuZI.js` | `ea2cf0b6836791f5419a27ce58ba8880ba0f25f7e018faedcb6e96f2f71da567` |
| `sim-BOrXOAif.js` | `1fc51a78e9d872c876a549a00bd01983f52e5be16239c3d0f7cdc5894b5ed50a` |
