"""Crops wiki icons out of a mirrored build's sprite atlases.

Usage: python3 tools/icons.py <assets dir> <atlas dir with atlas-early.json, atlas-late.json, pages.json> <registry.json> <out dir>

Icons mirror the game's own lookups: weapons, passives and items use the early atlas sprite
"icon-<id>" (anim "icon", frame 0); enemies, bosses and dogs use the first sprite found in the
early then late atlas with an "idle-front", "idle" or "walk" anim, frame 0.
Optional atlas pages supply additional icons without replacing earlier ones.
"""
import json, os, sys
from PIL import Image

A, ATLAS, REG, OUT = sys.argv[1:5]
reg = json.load(open(REG))
names = json.load(open(os.path.join(ATLAS, 'pages.json')))
pages = [
    (names['early'], json.load(open(os.path.join(ATLAS, 'atlas-early.json')))),
    (names['late'], json.load(open(os.path.join(ATLAS, 'atlas-late.json')))),
]
if 'flagged' in names:
    pages.append((names['flagged'], json.load(open(os.path.join(ATLAS, 'atlas-flagged.json')))))
for page in [*names.get('optional', []), *names.get('endgame', [])]:
    pages.append((page['image'], json.load(open(os.path.join(ATLAS, 'atlas-' + page['phase'] + '.json')))))
imgs = {name: Image.open(os.path.join(A, name)).convert('RGBA') for name, _ in pages}
early_name, early = pages[0]

icons = {}
for name, page in [pages[0], *pages[2:]]:
    for k, anims in page['sprites'].items():
        if k.startswith('icon-') and k[5:] not in icons and 'icon' in anims and anims['icon']['frames']:
            icons[k[5:]] = (name, k, 'icon', anims['icon']['frames'][0], page['pixelSize'].get(k, 1))

PRIO = ['idle-front', 'idle', 'walk', 'alpha']
sprites = {}
for name, page in pages:
    for k, anims in page['sprites'].items():
        if k.startswith('icon-') or k in sprites:
            continue
        for a in PRIO:
            fr = anims.get(a, {}).get('frames') or []
            if fr:
                sprites[k] = (name, k, a, fr[0], page['pixelSize'].get(k, 1))
                break


def vals(v):
    return v['__map'] if isinstance(v, dict) and '__map' in v else v


cats = {
    'weapon': ('allWeapons', icons, lambda d: d['id']),
    'passive': ('passives', icons, lambda d: d['id']),
    'item': ('allItems', icons, lambda d: d['id']),
    'enemy': ('enemies', sprites, lambda d: d['id']),
    'boss': ('bosses', sprites, lambda d: d.get('sprite') or d['id']),
    'dog': ('dogs', sprites, lambda d: d['id']),
}
manifest, missing = {}, []
for cat, (key, sheet, keyfn) in cats.items():
    os.makedirs(os.path.join(OUT, cat), exist_ok=True)
    manifest[cat] = {}
    for d in vals(reg[key]):
        id_, sk = d['id'], keyfn(d)
        hit = sheet.get(sk)
        if hit is None:
            why = ('no "icon-%s" sprite with an "icon" anim in early atlas' % sk) if sheet is icons else \
                  ('no sprite "%s" with idle-front/idle/walk anim in early or late atlas' % sk)
            missing.append({'category': cat, 'id': id_, 'reason': why})
            continue
        name, sprite, anim, f, px = hit
        crop = imgs[name].crop((f['x'], f['y'], f['x'] + f['w'], f['y'] + f['h']))
        if crop.getbbox() is None:
            missing.append({'category': cat, 'id': id_, 'reason': 'frame is fully transparent'})
            continue
        scale = 2 if px == 0.5 else 4  # pixelSize .5 sprites are authored at 2x density
        crop = crop.resize((f['w'] * scale, f['h'] * scale), Image.NEAREST)
        rel = '%s/%s.png' % (cat, id_)
        crop.save(os.path.join(OUT, rel))
        manifest[cat][id_] = {'file': rel, 'w': crop.width, 'h': crop.height,
                              'nativeW': f['w'], 'nativeH': f['h'], 'scale': scale,
                              'source': '%s sprite "%s" anim "%s" frame 0 @(%d,%d)' % (name, sprite, anim, f['x'], f['y'])}
manifest['missing'] = missing
json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print(json.dumps({c: len(manifest[c]) for c in cats} | {'missing': len(missing)}))
