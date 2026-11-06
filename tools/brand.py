# Draws the tibodog.wiki brand kit: the pixel mark (open book with a paw print), favicons,
# the Apple touch icon and the social preview card. Run: python3 -I tools/brand.py
# The mark is original art for the fan wiki; the preview card also shows game sprites from public/icons.
import io
import os
import struct
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PUB = os.path.join(ROOT, 'public')
FONTS = os.path.join(PUB, 'fonts')
DISPLAY = os.path.join(FONTS, 'cinzel-latin-700-normal.woff2')
BODY = os.path.join(FONTS, 'marcellus-latin-400-normal.woff2')

COLORS = {
    'K': '#05060d',  # outline (game focus shade)
    'C': '#f4ecd8',  # page (game ink)
    'S': '#c2b495',  # page shade and text lines (game dim ink)
    'O': '#e6c06a',  # gilded cover and heading line
    'D': '#b07a2c',  # spine, gold shadow
    'P': '#1c223c',  # paw, night navy
    'N': '#141a30',  # small tile fill
    'G': '#c9a24f',  # small tile rim
}

PAW = [
    '..PP..PP..',
    '..PP..PP..',
    'PP......PP',
    'PP.PPPP.PP',
    '..PPPPPP..',
    '.PPPPPPPP.',
    '.PPPPPPPP.',
    '..PP..PP..',
]

PAGE = '..KCCCCCCCCCCCSKKSCCCCCCCCCCCK..'
BOOK = [
    '...KKKKKKK............KKKKKKK...',
    '..KCCCCCCCKKK......KKKCCCCCCCK..',
    '..KCCCCCCCCCCKK..KKCCCCCCCCCCK..',
    *[PAGE] * 13,
    '..KSSSSSSSSSSSSKKSSSSSSSSSSSSK..',
    '.KOKKKKKKKKKKKKKKKKKKKKKKKKKKOK.',
    '.KOOOOOOOOOOOOODDOOOOOOOOOOOOOK.',
    '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
]


def put(grid, x, y, rows):
    for j, row in enumerate(rows):
        for i, c in enumerate(row):
            if c != '.':
                grid[y + j][x + i] = c


def mark32():
    g = [['.'] * 32 for _ in range(32)]
    put(g, 0, 6, BOOK)
    # Left page: an orange heading and four text lines.
    for y, x0, x1, c in [(5, 4, 10, 'O'), (7, 4, 13, 'S'), (9, 4, 12, 'S'), (11, 4, 13, 'S'), (13, 4, 10, 'S')]:
        for x in range(x0, x1 + 1):
            g[6 + y][x] = c
    put(g, 18, 6 + 5, PAW)  # right page
    return g


def tile(size):
    # Night-navy tile with a gold rim and clipped corners, the frame every icon size shares.
    g = [['.'] * size for _ in range(size)]
    for y in range(size):
        for x in range(size):
            if min(x, size - 1 - x) + min(y, size - 1 - y) >= 1:
                g[y][x] = 'G' if x in (0, size - 1) or y in (0, size - 1) else 'N'
    return g


def tile16():
    # 16 px: the same open book as the full mark, simplified to read in a browser tab.
    # Cream pages, text lines and a gold cover on the tile; the paw needs 32 px to read, so it starts there.
    g = tile(16)
    put(g, 2, 3, [
        'CCCC....CCCC',
        'CCCCCSSCCCCC',
        'COOOCSSCSSSC',
        'CCCCCSSCCCCC',
        'CSSSCSSCSSSC',
        'CCCCCSSCCCCC',
        'CSSCCSSCSSCC',
        'SSSSSSSSSSSS',
        'OOOOOODOOOOO',
    ])
    return g


def tile_mark(scale):
    # 32/64 px icon frames and the touch icon: the full mark on the same tile as the 16 px icon.
    im = to_image(tile(32), scale)
    m = to_image(mark32(), scale)
    im.alpha_composite(m)
    return im


def to_image(grid, scale=1):
    h, w = len(grid), len(grid[0])
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    for y, row in enumerate(grid):
        for x, c in enumerate(row):
            if c != '.':
                im.putpixel((x, y), Image.new('RGB', (1, 1), COLORS[c]).getpixel((0, 0)) + (255,))
    return im.resize((w * scale, h * scale), Image.NEAREST)


def to_svg(grid):
    rects = []
    for y, row in enumerate(grid):
        x = 0
        while x < len(row):
            c = row[x]
            n = 1
            while x + n < len(row) and row[x + n] == c:
                n += 1
            if c != '.':
                rects.append(f'<rect x="{x}" y="{y}" width="{n}" height="1" fill="{COLORS[c]}"/>')
            x += n
    body = ''.join(rects)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" shape-rendering="crispEdges">'
        f'<title>tibodog.wiki</title>{body}</svg>\n'
    )


def gold_text(im, xy, text, font):
    # Cinzel lettering filled with the game's title gold gradient, over a dark drop shadow.
    d = ImageDraw.Draw(im)
    x, y = xy
    d.text((x, y + 4), text, font=font, fill='#05060d')
    box = d.textbbox((x, y), text, font=font)
    mask = Image.new('L', im.size, 0)
    ImageDraw.Draw(mask).text((x, y), text, font=font, fill=255)
    grad = Image.new('RGB', im.size)
    gd = ImageDraw.Draw(grad)
    top, bot = box[1], box[3]
    stops = [(0, (0xff, 0xf6, 0xd2)), (.45, (0xf2, 0xd0, 0x7a)), (1, (0xb8, 0x82, 0x2f))]
    for yy in range(top, bot + 1):
        t = (yy - top) / max(1, bot - top)
        for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
            if t0 <= t <= t1:
                k = (t - t0) / (t1 - t0)
                gd.line([(0, yy), (im.width, yy)], fill=tuple(round(a + (b - a) * k) for a, b in zip(c0, c1)))
    im.paste(grad, (0, 0), mask)
    return box


def frame(d, x0, y0, x1, y1):
    # Double gold rule with diamond corners, like the game's gilded panels.
    d.rectangle([x0, y0, x1, y1], outline='#d8b25a', width=2)
    d.rectangle([x0 + 8, y0 + 8, x1 - 8, y1 - 8], outline='#6e5a32', width=1)
    for cx, cy in [(x0, y0), (x1, y0), (x0, y1), (x1, y1)]:
        d.polygon([(cx, cy - 7), (cx + 7, cy), (cx, cy + 7), (cx - 7, cy)], fill='#f3d488')


def medallion(im, path, cx, cy, r=62):
    # A sprite in a round night plate with a gold ring, as the game frames its icons.
    plate = Image.new('RGBA', (2 * r, 2 * r), (0, 0, 0, 0))
    pd = ImageDraw.Draw(plate)
    for i in range(r, 0, -1):
        t = i / r
        c = tuple(round(a + (b - a) * t) for a, b in zip((0x33, 0x3a, 0x5e), (0x0b, 0x0d, 0x1c)))
        pd.ellipse([r - i - r * .1, r - i - r * .15, r + i - r * .1, r + i - r * .15], fill=c + (255,))
    mask = Image.new('L', plate.size, 0)
    ImageDraw.Draw(mask).ellipse([0, 0, 2 * r - 1, 2 * r - 1], fill=255)
    disc = Image.new('RGBA', plate.size, (0, 0, 0, 0))
    disc.paste(plate, (0, 0), mask)
    ImageDraw.Draw(disc).ellipse([0, 0, 2 * r - 1, 2 * r - 1], outline='#c9a24f', width=3)
    im.paste(disc, (cx - r, cy - r), disc)
    s = Image.open(os.path.join(PUB, 'icons', path)).convert('RGBA')
    k = max(1, int(84 // max(s.size))) if max(s.size) <= 100 else 1 / -(-max(s.size) // 100)
    s = s.resize((max(1, int(s.width * k)), max(1, int(s.height * k))), Image.NEAREST)
    im.paste(s, (cx - s.width // 2, cy - s.height // 2), s)


def og(mark):
    W, H = 1200, 630
    im = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(im)
    # Night vignette, brightest a little above centre (the game's scrim).
    for i in range(700, 0, -4):
        t = i / 700
        c = tuple(round(a + (b - a) * t) for a, b in zip((0x1c, 0x22, 0x3c), (0x05, 0x06, 0x0d)))
        d.ellipse([430 - i * 1.3, 280 - i, 430 + i * 1.3, 280 + i], fill=c)
    frame(d, 28, 28, W - 29, H - 29)

    m = mark.crop((1, 6, 31, 26)).resize((30 * 5, 20 * 5), Image.NEAREST)
    im.paste(m, (88, 92), m)
    gold_text(im, (84, 210), 'tibodog.wiki', ImageFont.truetype(DISPLAY, 86))
    body = ImageFont.truetype(BODY, 36)
    d.text((88, 336), 'The unofficial fan wiki for tibo.dog', font=body, fill='#f4ecd8')
    small = ImageFont.truetype(BODY, 26)
    d.text((88, 394), 'Weapons, evolutions, items, dogs, enemies,', font=small, fill='#c2b495')
    d.text((88, 428), 'bosses and formulas, sourced from the live game', font=small, fill='#c2b495')
    d.line([(88, 494), (520, 494)], fill='#6e5a32', width=1)
    d.text((88, 510), 'www.tibodog.wiki', font=ImageFont.truetype(DISPLAY, 26), fill='#e6c06a')

    icons = ['weapon/spud-cannon.png', 'item/kaboom-spud.png', 'dog/corgi.png',
             'passive/hot-sauce.png', 'enemy/potato-beetle.png', 'boss/harvester.png']
    for i, p in enumerate(icons):
        medallion(im, p, 870 + (i % 2) * 160, 150 + (i // 2) * 165)
    return im


if __name__ == '__main__':
    big = mark32()
    mark = to_image(big)
    with open(os.path.join(PUB, 'logo.svg'), 'w') as f:
        f.write(to_svg(big))
    tile_mark(2).save(os.path.join(PUB, 'favicon.png'), optimize=True)
    # favicon.ico with PNG frames, all on the same gilded tile: the simplified book at 16 px,
    # the full book-and-paw mark at 32 and 64 px.
    frames = []
    for im in [to_image(tile16()), tile_mark(1), tile_mark(2)]:
        buf = io.BytesIO()
        im.save(buf, 'PNG', optimize=True)
        frames.append((im.width, buf.getvalue()))
    head = struct.pack('<HHH', 0, 1, len(frames))
    offset, entries = 6 + 16 * len(frames), b''
    for w, data in frames:
        entries += struct.pack('<BBBBHHII', w % 256, w % 256, 0, 0, 1, 32, len(data), offset)
        offset += len(data)
    with open(os.path.join(PUB, 'favicon.ico'), 'wb') as f:
        f.write(head + entries + b''.join(d for _, d in frames))
    # Touch icon: the same gilded tile as the favicon, filling the square (iOS rounds the corners).
    apple = Image.new('RGB', (180, 180), '#0b0e1c')
    t = tile_mark(5)
    apple.paste(t, ((180 - t.width) // 2, (180 - t.height) // 2), t)
    apple.save(os.path.join(PUB, 'apple-touch-icon.png'), optimize=True)
    og(mark).save(os.path.join(PUB, 'og.png'), optimize=True)
    print('wrote logo.svg favicon.png favicon.ico apple-touch-icon.png og.png')
