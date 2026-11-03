// Smoke test for middleware.js; run after build.mjs, before deploying.
const m = await import('./middleware.js');
const cases = [
  ['/', 'text/html', 'next'], ['/', 'text/markdown', 'rewrite'], ['/weapons/peeler', 'text/markdown', 'rewrite'],
  ['/nope', 'text/markdown', 404], ['/api/v1/weapons.json', '*/*', 'next'], ['/api/v1/nope.json', '*/*', 404], ['/weapons/peeler.md', '*/*', 'next'], ['/nope.md', '*/*', 404],
];
let bad = 0;
for (const [u, accept, want] of cases) {
  const r = m.default(new Request('https://x.test' + u, { headers: { accept } }));
  const got = r.headers.get('x-middleware-rewrite') ? 'rewrite' : r.headers.get('x-middleware-next') ? 'next' : r.status;
  if (got !== want) { bad++; console.error(`FAIL ${u} (${accept}): got ${got}, want ${want}`); }
}
if (bad) process.exit(1);
console.log(`middleware ok (${cases.length} cases)`);
