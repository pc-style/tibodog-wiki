## Overview

Second Helping turns snacks eaten while already at full HP into a lasting damage bonus. Each qualifying snack adds 1 percentage point to Tibo's damage multiplier, capped at +10% per copy, up to five copies (+50%). Extra copies raise the cap, not the gain per snack.

## How it works

- **Be full before the snack heals.** The pickup calls the full-snack check before healing. A snack that takes Tibo from 149 to 150 HP does not count; the next snack at 150 does. <small>[sim-BI7WLnza.js: `e.moreVariety!==void 0&&Ri().fullSnack(e),ju(e,o)`]</small>
- **Fill each new cap.** One copy needs 10 qualifying snacks; five copies need 50 total. Picking up another copy does not multiply damage already earned. <small>[sim-BI7WLnza.js: `return Math.round(e.cap/e.perSnack)`]</small>
- [Picnic](/events/picnic) produces eligible snacks. [Warm Bowl](/items/warm-bowl) heals directly, so standing in its pool does not itself award snack stacks, though it can help Tibo reach full HP first.

## Tips

- **Heal before collecting spare snacks.** Only surplus healing becomes damage. Do not pass up a needed heal just to preserve a possible future bonus.
