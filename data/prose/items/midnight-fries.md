## Current timing

Midnight Fries adds 5% damage, then grows by 6% per overtime **wave step** for one copy. Overtime steps are `max(0, director step − floor(win time / wave-step seconds))`. Ordinary Standard uses a 900-second win time and 45-second steps: step 21 is 15:45 and step 22 is 16:30. Story uses the same win time but 60-second steps, so its first two overtime steps are 16:00 and 17:00. This formula is unchanged from the preceding build. <small>[sim-DUXHKfs3.js: ``e?.kind===`overtime`&&(t+=e.perWaveStep*r)``]</small> <small>[sim-DUXHKfs3.js: ``return Math.max(0,e.director.lastStep-Math.floor(e.cfg.win.timeSec/e.waves.stepSec))``]</small>

The in-game description now fills its time, growth and seconds placeholders from the default win time, the item's effect and a 45-second display value. Its “After 15:00 … every 45 s” wording describes the ordinary schedule; the text formatter is not the runtime overtime calculation and does not switch that displayed interval to Story's 60 seconds. <small>[sim-DUXHKfs3.js: ``winSec:_t.win.timeSec,waveStepSec:45``]</small> <small>[sim-DUXHKfs3.js: ``time:r(t.winSec),growth:yx(n.perWaveStep),seconds:t.waveStepSec``]</small>

Original preceding/current callback controls, seed `cj-overtime`, Normal, one granted copy and supplied director steps immediately before, at and twice after each cutoff, matched ×1.05/1.05/1.113/1.17978. Standard without a Daily, Daily days 20779/20780 and Story were checked separately; the supplied Story cutoff is step 15, not step 20. These are controlled configuration/stat results, not natural acquisition, survival, all-mode coverage or server verification.

## Historical measured trigger

**Measured** in `main-Dy4d7hb5.js`, Standard/Normal, seeds `s1/s2/s3`, granted one stack, no gear or god HP: with the minute counter forced to 19/20/21/22, the original stat recompute gave damage ×1.05/1.05/1.113/1.17978. The unconditional 5% might is already present; the extra ×1.06 per overtime minute begins after minute 20. This is not a naturally survived 22-minute run.
