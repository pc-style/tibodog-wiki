# Draws the tibodog.wiki brand kit: the pixel mark (open book with a paw print), favicons,
# the Apple touch icon and the social preview card. Run: python3 -I tools/brand.py
# The mark is original art for the fan wiki; the preview card also shows game sprites from public/icons.
import io
import os
import struct
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PUB = os.path.join(ROOT, 'public')
FONT = os.environ.get('BRAND_FONT', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')

COLORS = {
    'K': '#2a1d14',  # outline
    'C': '#fbf3e4',  # page
    'S': '#dccdb2',  # page shade and text lines
    'O': '#e8954a',  # cover, heading line (site --accent)
    'D': '#a3470d',  # spine (site light --link)
    'P': '#5a3a24',  # paw
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


def tile16():
    # Small sizes: the paw alone on an orange rounded tile, readable in a 16 px browser tab.
    g = [['.'] * 16 for _ in range(16)]
    for y in range(16):
        for x in range(16):
            corner = min(x, 15 - x) + min(y, 15 - y) < 2
            if not corner:
                g[y][x] = 'O'
    put(g, 3, 4, [r.replace('P', 'C') for r in PAW])
    return g


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


def og(mark):
    W, H = 1200, 630
    im = Image.new('RGB', (W, H), '#141210')
    d = ImageDraw.Draw(im)
    d.rectangle([0, H - 10, W, H], fill=COLORS['O'])

    def sprite(path, scale):
        s = Image.open(os.path.join(PUB, 'icons', path)).convert('RGBA')
        return s.resize((s.width * scale, s.height * scale), Image.NEAREST)

    boss = sprite('boss/harvester.png', 1)
    im.paste(boss, (W - boss.width - 56, 64), boss)

    m = mark.resize((128, 128), Image.NEAREST)
    im.paste(m, (64, 56), m)
    word = ImageFont.truetype(FONT, 84)
    x, y = 64, 210
    d.text((x, y), 'tibodog', font=word, fill='#ece7e0')
    d.text((x + d.textlength('tibodog', font=word), y), '.wiki', font=word, fill='#f0a868')
    sub = ImageFont.truetype(FONT.replace('-Bold', ''), 34)
    d.text((x + 2, 322), 'The unofficial fan wiki for tibo.dog', font=sub, fill='#d3ccc3')
    small = ImageFont.truetype(FONT.replace('-Bold', ''), 24)
    d.text((x + 2, 372), 'Weapons, evolutions, items, dogs, enemies, bosses', font=small, fill='#a39a8f')
    d.text((x + 2, 404), 'and formulas, sourced from the live game', font=small, fill='#a39a8f')

    row = ['weapon/peeler.png', 'weapon/hot-potato.png', 'passive/hot-sauce.png', 'item/sharp-peeler.png',
           'dog/corgi.png', 'dog/beagle.png', 'enemy/potato-beetle.png']
    sprites = [sprite(p, 2) for p in row]
    gap = (W - 2 * 64 - sum(s.width for s in sprites)) / (len(sprites) - 1)
    sx = 64
    for s in sprites:
        im.paste(s, (round(sx), H - 40 - s.height), s)
        sx += s.width + gap
    return im


if __name__ == '__main__':
    big = mark32()
    mark = to_image(big)
    with open(os.path.join(PUB, 'logo.svg'), 'w') as f:
        f.write(to_svg(big))
    to_image(big, 2).save(os.path.join(PUB, 'favicon.png'), optimize=True)
    # favicon.ico with PNG frames: the paw tile at 16 px, the full mark at 32 and 64 px.
    frames = []
    for im in [to_image(tile16()), mark, to_image(big, 2)]:
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
    apple = Image.new('RGB', (180, 180), '#1b1916')
    m4 = to_image(big, 5)
    apple.paste(m4, ((180 - m4.width) // 2, (180 - m4.height) // 2), m4)
    apple.save(os.path.join(PUB, 'apple-touch-icon.png'), optimize=True)
    og(mark).save(os.path.join(PUB, 'og.png'), optimize=True)
    print('wrote logo.svg favicon.png favicon.ico apple-touch-icon.png og.png')
