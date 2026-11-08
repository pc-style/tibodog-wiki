**Spoiler warning.** This page gives away the jokes, scripted lines and character reveals hidden in tibo.dog, including who is inside the amusing suit. If you want to find them yourself, play first.

The developer's launch post says the game has easter eggs (“i hope you enjoy it and find all the easter eggs”, [launch post](https://x.com/poteto/status/2117004709198475365)). This page lists the hidden or easy-to-miss content found in game build 41 (`main-B2gf34bA.js`) outside the data tables: scripted lines, cutscenes and jokes. Mechanics behind the visitors are on [Visitors](/visitors) and [Story mode](/story-mode).

## How this was checked

Every entry quotes the game code. Each was also seen in play, in one of two ways:

The named code citations below have been rechecked against build 43 (`main-DG5OYSdZ.js`). The play measurements retain their original build attribution; they were not rerun for this page's build-43 citation refresh.

- **Browser**: live https://tibo.dog/ in the orb's Chromium on 2026-11-05: one Story run and one Normal run. The live site already served a newer build (`main-BnCKpQy_.js`), but its intro, phone hint, taunt, fries, cut-in, Alex reveal, Story-line and boss-entrance chunks contain the same English lines as build 41, and the poteto and Alex settings are unchanged. Random seeds, no shortcuts.
- **Headless**: `node tools/play.mjs --god --seed <seed> <scenario>` on build 41, Normal difficulty, standard mode, seeds `s1` to `s6`, 20.5 minutes each. `--god` (HP refilled every tick) was the only shortcut; no `give` or `warp`.

## Day 28

The title screen header counts up from “Day 1/” to “Day 28/” in 1.2 s, easing out. With reduced motion on, it shows Day 28 straight away. <small>[boot-Bulg2Z1J.js: `let t=Math.min(1,(e-_e)/1.2),n=1+Math.floor(27*function(e){return 1-(1-e)*(1-e)}(t))`]</small> <small>[boot-Bulg2Z1J.js: `let he=U(),ge=he?28:1`]</small> The intro cutscene chunk is named `day-28` and also draws “Day 28/”. <small>[intro-scene-CEmsirnC.js: ``message:[`Day `,[`day`],`/`],values:{day:28}``]</small> *Inference*: this matches the developer's launch post, which opens with “Day 28/ tibo's game has landed”.

## The intro: “i smell fear”

Starting a run from the title screen plays a short comic. A man's phone buzzes, poteto texts him a tibo.dog picture and “i smell fear”, a RESET button flares up, and a portal pulls him in. Tibo then lands in the field. <small>[intro-scene-CEmsirnC.js: ``message:[`i smell fear`]``]</small>

- Outside Story the intro shows “Hold to skip”, and the **Skip intro** setting skips it. Story's intro cannot be skipped. <small>[boot-Bulg2Z1J.js: ``e.skipIntro&&hl(t===`story`)``]</small> <small>[boot-Bulg2Z1J.js: `function hl(e){return!e||E.sceneSkip.inStory}`]</small> <small>[boot-Bulg2Z1J.js: `sceneSkip:{inStory:!1}`]</small>
- Seen in the browser at the start of both the Story run and the Normal run, each started from the title screen.

## poteto's phone hint

Early in a run, a phone in the corner shows a text from poteto: “if you die in the game you die irl. survive for 20 mins!” <small>[hint-phone-D1QF6Bza.js: `if you die in the game you die irl. survive for 20 mins!`]</small> Seen in the Normal run at 0:12, next to the controls hint.

## amusing is Alex in a suit

[amusing](/bosses/amusing), the 2:00 boss, is a mascot suit, and Alex is inside it.

- **Entrance boast**: amusing arrives with four lines, in this order: “well well well if it isnt the chatjippity guy”, “muse cooks chatjippity its not even close”, “and dots lmao who even asked for dots”, “alright enough ima beat u up now lil bro”. <small>[boss-entrance-scene-DWXi3xpp.js: `well well well if it isnt the chatjippity guy`]</small> <small>[boss-entrance-scene-DWXi3xpp.js: `alright enough ima beat u up now lil bro`]</small> <small>[boot-Bulg2Z1J.js: ``amusingBoast:{modes:[`standard`,`story`]``]</small>
- **Text messages outside Story**: in Story the lines are spoken in the dialogue box. In other runs, amusing and Alex send them as texts to the corner phone while the run continues. <small>[boot-Bulg2Z1J.js: ``function _l(e){return e.mode!==`story`&&!e.scenes}``]</small> <small>[changelog-panel-9iqUoTsi.js: `Outside Story, amusing and Alex text poteto's phone while you keep playing`]</small> Both forms were seen: the dialogue box in Story at 0:17, and the text in the Normal run at 2:03.
- **Reveal**: when amusing dies, the suit splits open and Alex is inside. Whether Alex joins is decided by the seed: 25% of normal runs, every Story run ([Visitors](/visitors#alex)).
- **Story**: a reveal cutscene shows Alex climbing out, with the caption “Alex joins Tibo”. Alex then pouts “no fair!! the suit was lagging” and “you just got lucky tibo. hmph”, and adds “alright FINE i'll try chatjippity, lets kill some zombies”. <small>[alex-reveal-scene-BpIiUjqd.js: ``message:[`Alex joins Tibo`]``]</small> <small>[sim-DRV1ehYp.js: `no fair!! the suit was lagging`]</small> <small>[boot-Bulg2Z1J.js: ``alexLine:{holdSec:3,poutModes:[`standard`,`story`]``]</small> Seen in the browser at 0:35 of the Story run.
- **Other runs, Alex joins**: there is no cutscene. Alex only texts “alright FINE i'll try chatjippity, lets kill some zombies”. <small>[sim-DRV1ehYp.js: `return!this.texting(t)&&this.shownFor!==t&&!e.over`]</small> <small>[sim-DRV1ehYp.js: ``this.sendTexts({beat:`join`,lines:[MA]})``]</small> <small>[sim-DRV1ehYp.js: `alright FINE i'll try chatjippity, lets kill some zombies`]</small> Code only; the Normal run's Alex stayed asleep.
- **Alex stays asleep**: a thud plays, Alex peeks out of the suit, and Alex sends “I'll get you next time, Tibo...”. Outside Story it arrives as a text. <small>[sim-DRV1ehYp.js: ``this.app.audio.playSfx(`thud`,1)``]</small> <small>[sim-DRV1ehYp.js: ``this.sendTexts({beat:`asleep`,lines:[jA]})``]</small> <small>[sim-DRV1ehYp.js: `I'll get you next time, Tibo...`]</small> Seen in the Normal run at 2:07.
- Headless, Alex joined on seeds `s1`, `s2`, `s4` and `s5` and stayed asleep on `s3` and `s6`. Across 2,000 seeds (`a0` to `a1999`, checked when each run is created), 483 joined (24%), matching the 25% chance.

## poteto's visit: “hold still, tibo”

When poteto arrives, a cut-in banner sweeps across the screen. It shows poteto's portrait, poteto raising a mallet and the words “hold still, tibo”. Then the bonk lands. <small>[visit-cut-in-scene-DFuoyAE1.js: ``e?.type===`potetoVisit`&&e.phase===`arrive`&&(r=!0)``]</small> <small>[visit-cut-in-scene-DFuoyAE1.js: ``message:[`hold still, `,[`TIBO`]]``]</small>

- In normal runs the visit comes once, between 4:00 and 12:00; the bonk stuns Tibo, and 25% of visits drop a gift chest ([Visitors](/visitors#poteto)). Headless, poteto arrived at 9:56 (`s1`), 6:12 (`s2`), 4:55 (`s3`), 4:56 (`s4`), 5:31 (`s5`) and 6:12 (`s6`). The bonk landed about 1.8 s after arrival and always stunned without a knock-out. Gift chests dropped on `s2`, `s3` and `s4`.
- In Story the same cut-in opens the ending, where poteto knocks Tibo and Alex out ([Story mode](/story-mode#ending)). Seen in the browser at 0:50 of the Story run.

## Revive fries

Each time Tibo is knocked out and gets back up, poteto throws a box of fries and comments. Outside Story this needs a [revival](/stats); in Story every knock-out outside the deathless phases is revived ([Story mode](/story-mode)). <small>[deferred-ui-D3-yCcY3.js: `Each time you're knocked out, poteto drops a box of fries to revive you.`]</small> The line depends on how many times Tibo has been down this run: <small>[sim-DRV1ehYp.js: ``function WA(e,t){return qc(e)?t.script.line(t.down,function(e){return e.story.phase===`bossFight`?`amusing`:`zombies`}(e)):t.script.revive(t.down)}``]</small> <small>[fries-line-script-By1trwro.js: `function a(e){return o(e<3?e:e+1,e)}`]</small>

| Knock-out | Story | Other runs |
|---|---|---|
| 1st | “you dummy, take this.” | same |
| 2nd | “again? fine. take another one.” | same |
| 3rd | “get up. he's a mascot, tibo.” during the amusing fight, otherwise “get up. they're just zombies, tibo.” | “do you know what these fries cost?” |
| 4th | “do you know what these fries cost?” | “the floor is not a strategy.” |
| 5th | “the floor is not a strategy.” | “i'm keeping count now. for science.” |
| 6th | “i'm keeping count now. for science.” | “these are my last fries. i mean it.” |
| 7th | “these are my last fries. i mean it.” | “ok i lied. i made this game. infinite fries.” |
| 8th | “ok i lied. i made this game. infinite fries.” | “order number 8. no comment.” |
| 9th and later | “order number N. no comment.” | “order number N. no comment.” |

The lines are quoted from the fries script. <small>[fries-line-script-By1trwro.js: `ok i lied. i made this game. infinite fries.`]</small> <small>[fries-line-script-By1trwro.js: ``message:[`order number `,[`count`],`. no comment.`]``]</small> The first two Story lines were seen in the browser. Outside Story the line arrives as a text, like amusing's boast (code only; the Normal run had no revive).

## poteto's 20:00 taunt

A run that reaches 20:00 outside Story gets one text from poteto, 1 s after the win, on screen for about 6 s. <small>[taunt-text-CBb0EMVx.js: ``return e.mode!==`standard`||e.over||!e.run.won?-1:e.runClock-e.run.wonAt``]</small> <small>[boot-Bulg2Z1J.js: `tauntText:{arriveSec:1,slideInSec:.3,leaveSec:6.25,slideOutSec:.5`]</small> Each difficulty has four lines, and the run's seed picks one: <small>[taunt-text-CBb0EMVx.js: ``new s(`taunt:${a}`).int(0,c-1)``]</small>

| Difficulty | Lines (pick 0 to 3) |
|---|---|
| Easy | “20 minutes on easy? cute.” · “ok now try a real difficulty” · “training wheels off next time?” · “easy mode. i'm telling everyone” |
| Normal | “fine. you're decent. the pests disagree” · “not bad. hard mode is right there” · “20 mins on normal. i'll allow it” · “The Harvester says hi btw” |
| Hard | “wait you're still alive?? alex owes me $5” · “hard mode, 20 mins. ok show-off” · “i made it hard on purpose. rude” · “ok that was actually impressive” |
| Nightmare | “who even are you. go touch grass” · “nightmare?? please go to sleep” · “i'm calling the devs. oh wait” · “ok i'm nerfing you tonight” |

The lines are quoted from the taunt script. <small>[taunt-text-CBb0EMVx.js: `wait you're still alive?? alex owes me $5`]</small> <small>[taunt-text-CBb0EMVx.js: ``message:[[`boss`],` says hi btw`]``]</small> The Normal line names the 20:00 boss, [The Harvester](/bosses/harvester). Headless, the `win` event fired at exactly 20:00 on all six seeds, and the game's own random generator gave picks 1 (`s1`), 3 (`s2`), 3 (`s3`), 1 (`s4`), 1 (`s5`) and 0 (`s6`). The taunt itself is drawn by the page, not the sim, so it was not seen on screen; reaching 20:00 in the browser was not attempted.

## Reset Zombie barks

[Reset Zombies](/enemies/reset-zombie) beg for the reset button in speech bubbles: “pls reset”, “give reset pls”, “where reset”, “reset me 2”, “is reset here?”, “1 reset pls”, “need reset...”, “u has reset?”, “press reset 4 me”, “no brains. reset pls” and “2x usage for plus users”. <small>[boot-Bulg2Z1J.js: ``"reset-zombie":{color:`#9aa1b8`,speech:`resetPlea`}``]</small> <small>[boot-Bulg2Z1J.js: ``message:[`2x usage for plus users`]``]</small> Each bubble stays 2.6 s. A new one starts about every 1.8 s (randomised ×0.6 to ×1.4), with at most 3 on screen, and a zombie that has spoken stays quiet for 8 s. <small>[boot-Bulg2Z1J.js: `sayForSec:2.6,everySec:1.8,quietSec:8,maxBubbles:3`]</small> Seen in the Story run (“u has reset?”, “2x usage for plus users”, “give reset pls”, “need reset...”).

## Andrew's code-review cheers

While [Andrew](/visitors#andrew) pairs with Tibo, he cheers in code-review speak: “LGTM!”, “nit: dodge left”, “ship it!”, “approved!”, “+1, no notes” and “tests are green!”. <small>[coworker-lines-C_UwMrFT.js: ``message:[`nit: dodge left`]``]</small> <small>[coworker-lines-C_UwMrFT.js: ``message:[`+1, no notes`]``]</small> Code only: Andrew's visit (18:00 to 22:00) was reached only headlessly, where he arrived on four of six seeds (`s1`, `s2`, `s3`, `s6`) between 18:14 and 19:24.

## Story ending lines

poteto's closing monologue (“i managed to get into the game.”, “and you picked story mode?? story mode??”, “mwahahahaha”, “try a real difficulty.”) is on [Story mode](/story-mode#ending). <small>[story-line-script-BcdpNJPd.js: `you couldn't even lose. i made sure of that.`]</small> Seen in the browser at 0:52 of the Story run.

## What was not found

A search of build 41's code turned up none of the following:

- **Cheat codes or secret key sequences.** The keyboard handler maps only the documented [controls](/controls); no Konami-style sequence exists. <small>[boot-Bulg2Z1J.js: ``keys:{reroll:`KeyR`,skip:`KeyX`,banish:`KeyB`,back:`Escape`,pause:`KeyP`,playAgain:`KeyR`,share:`KeyS`,mainMenu:`KeyH`,dash:`Space`,autoAdvance:`KeyT`,skipLines:`Space`}``]</small>
- **Developer URL switches on the live site.** The game reads `?seed=`, `?speed=`, `?intro=0`, `?difficulty=`, `?late=`, `?story=1` and others only in a debug build. The deployed build hard-codes debug off, so only the run's difficulty (from a shared link or an update relaunch) carries over. <small>[boot-Bulg2Z1J.js: `e.debugBuild?r:function(e){return{seed:void 0,timeScale:1,skipIntro:!1`]</small> <small>[main-CTQH2__w.js: ``),$=!1,``]</small> <small>[main-CTQH2__w.js: `ge({debugBuild:$,start:function(e,t){`]</small>
- **Daily runs.** Daily is now a visible title-screen option, with a shared seed, loadout, weather and a board per difficulty. It is not a hidden holiday event. Ordinary runs still use random seeds. See [Daily, gear and Nightmare ladder](/modes#daily-gear-and-nightmare-ladder). <small>[boot-Bulg2Z1J.js: ``seed:{mode:`random`,fixed:`TIBO`}``]</small>
- **Hidden points of interest.** Every point-of-interest kind in the registry is listed on [Points of interest](/points-of-interest).

*Inference*: an absence is only as good as the search. The search covered the build's non-translation chunks for key handlers, dates, URL parameters and every English UI line. Content drawn only as images (for example signs inside sprite art) was not checked.
