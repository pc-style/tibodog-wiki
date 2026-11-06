// Draws a 1200x630 social preview card for each page: the gilded game panel, the page's section,
// title and description, and its sprite in a gold medallion (Tibo where the page has none).
import { readFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { ICONS } from './data.mjs';
import { NAV } from './render.mjs';

const W = 1200;
const H = 630;
const file = (rel) => new URL(`../${rel}`, import.meta.url);
const font = (name, f, weight) => ({ name, weight, style: 'normal', data: readFileSync(file(`lib/og-fonts/${f}.ttf`)) });
const FONTS = [
  font('Cinzel', 'cinzel-latin-700-normal', 700),
  font('Cinzel', 'cinzel-latin-ext-700-normal', 700),
  font('Marcellus', 'marcellus-latin-400-normal', 400),
  font('Marcellus', 'marcellus-latin-ext-400-normal', 400),
];
const LOGO = `data:image/svg+xml;base64,${readFileSync(file('public/logo.svg')).toString('base64')}`;
// The page's own sprite in the medallion, or Tibo when it has none. Sprites are enlarged here by a whole
// number with nearest-neighbour sampling and drawn 1:1, because the SVG renderer would smooth them.
async function sprite(p) {
  const [cat, id] = p.infobox?.icon?.split('/') ?? [];
  const m = ICONS[cat]?.[id];
  const [rel, w, h, k] = m
    ? [`public/icons/${m.file}`, m.nativeW, m.nativeH, Math.max(1, Math.floor(210 / Math.max(m.nativeW, m.nativeH)))]
    : ['public/tibo.png', 39, 87, 3];
  const buf = await sharp(readFileSync(file(rel))).resize(w * k, h * k, { kernel: 'nearest' }).png().toBuffer();
  return { src: `data:image/png;base64,${buf.toString('base64')}`, w: w * k, h: h * k };
}

const h = (type, style, ...children) => ({ type, props: { style, children: children.flat().filter((c) => c != null) } });
const img = (src, w, ht, style = {}) => ({ type: 'img', props: { src, width: w, height: ht, style: { imageRendering: 'pixelated', ...style } } });

const diamond = (x, y) => h('div', { position: 'absolute', left: x - 8, top: y - 8, width: 16, height: 16, background: '#f3d488', transform: 'rotate(45deg)' });

export function ogLabel(p) {
  const section = p.crumbs?.[0]?.[0] ?? ({ guides: 'Guide', tips: 'Quick tips' })[p.tab] ?? (p.path === '/' ? 'The unofficial tibo.dog wiki' : NAV.find(([, list]) => list.some(([, u]) => u === p.path))?.[0] ?? 'Wiki');
  const cap = p.infobox?.caption;
  const one = (s) => s.toLowerCase().replace(/ies$/, 'y').replace(/s$/, '');
  return cap && one(cap) !== one(section) ? `${section} · ${cap}` : section;
}

export async function ogImage(p, url) {
  const s = await sprite(p);
  const title = p.title;
  // Cinzel caps run wide: keep titles to about two lines in the 680 px column.
  const size = title.length > 32 ? 46 : title.length > 20 ? 54 : title.length > 11 ? 64 : 76;
  const tree = h('div', {
    width: W, height: H, display: 'flex', position: 'relative', fontFamily: 'Marcellus',
    backgroundColor: '#05060d', backgroundImage: 'radial-gradient(ellipse 80% 90% at 36% 42%, #1c223c 0%, #0b0e1c 55%, #05060d 100%)',
  },
  h('div', { position: 'absolute', left: 28, top: 28, width: W - 56, height: H - 56, border: '2px solid #d8b25a' }),
  h('div', { position: 'absolute', left: 37, top: 37, width: W - 74, height: H - 74, border: '1px solid #6e5a32' }),
  diamond(29, 29), diamond(W - 29, 29), diamond(29, H - 29), diamond(W - 29, H - 29),
  h('div', { position: 'absolute', left: 88, top: 78, width: 680, height: H - 156, display: 'flex', flexDirection: 'column' },
    // The home card's title is already the site name, so it skips the brand row.
    p.path === '/' ? null : h('div', { display: 'flex', alignItems: 'center', fontFamily: 'Cinzel', fontSize: 28, color: '#e6c06a', marginBottom: 44 },
      img(LOGO, 48, 48, { marginRight: 14 }), 'tibodog.wiki'),
    h('div', { display: 'flex', marginTop: p.path === '/' ? 40 : 0, fontFamily: 'Cinzel', fontSize: 24, letterSpacing: 3, color: '#c9a24f', textTransform: 'uppercase' }, ogLabel(p)),
    h('div', {
      display: 'flex', marginTop: 10, fontFamily: 'Cinzel', fontSize: size, lineHeight: 1.08, color: '#f2d07a',
      backgroundImage: 'linear-gradient(180deg, #fff6d2 0%, #f2d07a 45%, #b8822f 100%)', backgroundClip: 'text',
    }, title),
    h('div', { display: 'block', marginTop: 22, fontSize: 28, lineHeight: 1.35, color: '#f4ecd8', lineClamp: 3 }, p.description),
    h('div', { display: 'flex', flexGrow: 1 }),
    h('div', { display: 'flex', width: 432, height: 1, background: '#6e5a32', marginBottom: 14 }),
    h('div', { display: 'flex', fontFamily: 'Cinzel', fontSize: 22, color: '#e6c06a' }, url.replace(/^https:\/\//, '').replace(/\/$/, ''))),
  h('div', {
    position: 'absolute', left: 820, top: 155, width: 300, height: 300, borderRadius: 150, border: '4px solid #c9a24f',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundImage: 'radial-gradient(circle at 42% 38%, #333a5e 0%, #141a30 60%, #0b0d1c 100%)',
  }, img(s.src, s.w, s.h)));
  const svg = await satori(tree, { width: W, height: H, fonts: FONTS });
  const png = new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();
  // A full 256-colour palette without dithering keeps sprite edges hard and the backdrop gradients smooth,
  // at about 60 KB a card instead of 220 KB for true colour.
  return sharp(png).png({ palette: true, quality: 100, effort: 7, dither: 0 }).toBuffer();
}
