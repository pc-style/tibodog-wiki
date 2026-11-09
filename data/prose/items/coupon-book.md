## Overview

Coupon Book is an Uncommon item that lowers the price of everything Tibo buys with gold. Each copy adds 0.12 to the purchase discount stat. Prices are multiplied by `1 − x / (1 + x)` ([Stats](/stats#diminishing-returns)), so one copy takes 10.7% off, two take 19.4% off and three take 26.5% off. Discounts from more copies keep shrinking but never reach 100%. <small>[sim-BwchEhls.js: `i[r.chestPriceMult]=1-Pt(e.chestDiscount,n.discountK)`]</small>

It has weight 6 out of 78 among Uncommon items, about 1.9% of item rolls at luck 0, which makes it the rarest Uncommon item. It has no evolution.

## How it works

The discount applies to:

- [Potato Crates](/points-of-interest#potato-crate), whose price rises with every crate bought.
- [Fry Cart](/points-of-interest#fry-cart) items.
- [Tater Slots](/points-of-interest#tater-slots) spins, which cost half the current crate price, rounded up. <small>[sim-BwchEhls.js: `Math.ceil(Rd(e)*e.cfg.taterSlots.priceFraction)`]</small>
- Dog level training at the [Dog Kennel](/points-of-interest#dog-kennel).

**Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, seed `wiki`, standard mode, normal difficulty; copies added with `giveItem`): the game's `chestPriceMult` stat read 0.8929, 0.8065 and 0.7353 for 1 to 3 copies, which is 10.7%, 19.4% and 26.5% off.

It does not change [chest](/chests) rewards. The [Microwave](/points-of-interest#microwave) currently costs an item rather than gold, so the discount does not matter there.

## Tips

- **Take it if you plan to spend gold.** Coupon Book pays off when you plan to spend a lot of gold. It pairs naturally with gold gain from [Golden Gravy](/items/golden-gravy) or [Golden Fry](/passives/golden-fry).
- Crate prices climb quickly (30, 72, 115, 159 gold and up), so the same percentage saves more gold on later crates.
