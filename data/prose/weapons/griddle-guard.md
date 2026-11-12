## Overview

Griddle Guard unites [Cast Iron](/weapons/cast-iron) and [Hash Bulwark](/weapons/hash-bulwark). Own both evolutions and open a [chest](/chests) to combine them and free a weapon slot. It keeps orbiting hash browns for protection and adds automatic pan swings, plus a swing at the spot where a hash brown blocks a bullet.

## How it works

- **Block hits and bullets.** Raw Amount 4 plus Tibo's base +1 gives five hash browns. Each can absorb 34 damage from a hit before armor; a spent hash brown regrows every 1.8 s before cooldown bonuses. Enemy bullets that touch an orbiting hash brown also spend it. <small>[start-rows-DXdqa7Ea.js: ``kind:`guard`,size:7,orbitRadius:18,burst:90,soak:34``]</small>
- **Burst into freezing shards.** A spent hash brown bursts within 90 × Area units for 260 base damage plus scaled thorns. Ordinary pests hit receive 0.9 s of freeze before Duration bonuses; bosses are not frozen. The orbit radius is 18 × √Area. <small>[sim-CjfoLCzS.js: `Y(e,r.damage+l.thorns*l.damageMult,t.src,t.slot,r.knockback)`]</small>
- **Swing both ways.** The automatic swings use 12% of the weapon's damage: 31.2 before bonuses. Their separate cooldown is 60% of the guard cooldown, or 1.08 s before bonuses. Swings alternate front and back, with later pairs offset downwards. A bullet block also triggers a swing at that hash brown's position. <small>[sim-CjfoLCzS.js: `Ak.damage=n.damage*t.damage,Ak.cooldown=n.cooldown*t.cooldown`]</small>
- **Swat bullets back.** A swing converts bullets in its box into homing shots, using 2.5 times the uncharged swing damage (78 before bonuses), Pierce 5 and speed 250 before projectile-speed bonuses. <small>[sim-CjfoLCzS.js: `s.damage[v]=r.damage*n.mult,s.pierce[v]=n.pierce`]</small>
- **Charge on elite kills.** As with Cast Iron, each elite death adds a charge, up to three. The next automatic swing volley spends them: each adds 35% size and 75% swing damage. The reactive swing at a broken guard is uncharged. <small>[sim-CjfoLCzS.js: ``e.kind===`guard`?e.swing?.charge:void 0``]</small>

**Measured** on original engines `main-chVaZCYa.js` → `main-BlAVw0Co.js`, Standard/Normal, seeds `s1/s2/s3`: only the new union resolver combines the two evolved partners, in either order, and frees one slot. Missing-partner and base-weapon controls do not combine. Direct new-engine controls confirm five guards, the three-charge cap and spend, a bullet block consuming one guard, a reactive homing shot dealing 78 before bonuses, and its Pierce 5. Supplied equipment, bullets and clocks are fixtures, not natural union acquisition or representative DPS. Sixty-second stepped controls retain the original optional rules; Frying Pan, Cast Iron, Hash Brown Shield and Hash Bulwark damage matches the old build in every seed.

## Tips

- **Keep the protection intact.** A block spends a hash brown, so repeated hits can exhaust the ring before it regrows.
- **Use one catalyst for both halves.** Starch Plating evolves both Frying Pan and Hash Brown Shield, then still reduces damage left after the guard's soak.
