## Overview

Thorny Jacket is an uncommon item that adds 8 thorns. Copies stack additively. With no luck it is about 2.6% of random item rolls (25% Uncommon × 8/78). It is the only item that gives thorns.

## How it works

- **Contact damage.** When an enemy's body touches Tibo and its contact attack is ready, it takes damage equal to Tibo's thorns. Each enemy's contact attack has a 0.5 s cooldown, so a touching enemy takes thorns at most twice a second. Bosses count too. Enemy shots do not trigger thorns.
- **Dodges still count.** Thorns are dealt whenever the contact attack goes off, even if Tibo dodges it or is invulnerable. <small>[sim-nIcq_DHZ.js: `` rd(e,u*_D(e,l,n),vD(e,l,n),!1,t.level[l]),s<=0||(Y(e,s,P(e,`thorny-jacket`,xa(`thorny-jacket`)),-1,0) ``]</small>
- **Measured** (build 41 `main-B2gf34bA.js`, headless `tools/play.mjs`, standard mode, normal difficulty; one Thorny Jacket and 200 [Ghost Skins](/items/ghost-skin) (90.9% dodge) added with `giveItem`; HP refilled every tick; Tibo standing still from 0:00; later level-ups taking the first offer; 180 s on seeds `s1`–`s3`). Each dodge was traced to the attack that caused it. All 159 dodged body contacts dealt thorns in the same tick. The 8 dodged enemy bullets and area attacks dealt none.
- **Flat damage.** Contact thorns are not multiplied by damage bonuses, so 8 thorns stay 8 damage all run. Crits and elite damage still apply to the hit.
- **Other uses.** Thorns also add to [Porcupine Spud](/items/porcupine-spud) fries (×1) and [Fry Volcano](/items/fry-volcano) fries (×1.5), and to the shards of [Hash Brown Shield](/weapons/hash-brown-shield) and [Hash Bulwark](/weapons/hash-bulwark). In all of those, thorns are multiplied by the damage multiplier.

## Tips

- **Take it to boost fries and shards.** On its own, 8 flat damage falls behind enemy HP within minutes (see [Enemy scaling](/enemy-scaling)). Its value is mostly in boosting Porcupine Spud, Fry Volcano and the hash brown shields, where it adds to every projectile or shard.
