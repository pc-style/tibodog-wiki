// Progressive enhancement only: every page works without this script.
(() => {
  // On small screens, start with the navigation and the page contents collapsed.
  const narrowMq = window.matchMedia('(max-width: 860px)');
  let closed = [];
  try { const saved = JSON.parse(localStorage.getItem('tibo-wiki.nav-closed')); if (Array.isArray(saved)) closed = saved; } catch {}
  let narrow = narrowMq.matches;
  const menu = document.querySelector('.side-menu');
  if (menu && narrow) menu.open = false;
  // Crossing the breakpoint (rotating, resizing): the desktop sidebar is always shown, the phone menu starts closed.
  const q0 = document.getElementById('q');
  const placeholder = q0?.getAttribute('placeholder');
  narrowMq.addEventListener('change', (e) => {
    narrow = e.matches;
    if (menu) menu.open = !narrow;
    // Desktop gets back the groups the reader left open; the phone menu shows only the current group.
    for (const g of document.querySelectorAll('.nav-group')) {
      const here = !!g.querySelector('[aria-current]');
      g.open = here || (!narrow && !closed.includes(g.dataset.group));
    }
    if (q0) q0.setAttribute('placeholder', narrow && window.innerWidth <= 600 ? 'Search' : placeholder);
  });

  // Small screens: a Menu button in the sticky header opens the navigation as a panel under it,
  // so it is reachable anywhere on a long page. Without JavaScript the in-page Menu still works.
  const menuBtn = document.querySelector('.menu-btn');
  if (menu && menuBtn) {
    document.documentElement.classList.add('js');
    menuBtn.hidden = false;
    const sync = () => menuBtn.setAttribute('aria-expanded', String(menu.open));
    menuBtn.addEventListener('click', () => {
      menu.open = !menu.open;
      if (menu.open) (menu.querySelector('.menu-panel [aria-current]') ?? menu.querySelector('.menu-panel a'))?.focus({ preventScroll: true });
    });
    menu.addEventListener('toggle', () => {
      sync();
      // While the phone panel is open the page behind it is dimmed and does not scroll.
      document.documentElement.classList.toggle('menu-open', menu.open && narrow);
      // Only one overlay at a time: opening the menu closes search suggestions.
      if (menu.open && narrow) {
        const list = document.getElementById('search-results');
        if (list && !list.hidden) { list.hidden = true; q0?.setAttribute('aria-expanded', 'false'); q0?.removeAttribute('aria-activedescendant'); }
      }
    });
    // …and focusing search closes the menu, so suggestions are never hidden behind it.
    q0?.addEventListener('focus', () => { if (narrow && menu.open) menu.open = false; });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.open && narrow) { menu.open = false; menuBtn.focus(); }
    });
    // The phone panel closes when focus or a tap goes elsewhere, so it never hides the page it covers.
    const inside = (el) => el && (menu.contains(el) || menuBtn.contains(el));
    document.addEventListener('pointerdown', (e) => { if (narrow && menu.open && !inside(e.target)) menu.open = false; });
    menu.addEventListener('focusout', (e) => { if (narrow && menu.open && e.relatedTarget && !inside(e.relatedTarget)) menu.open = false; });
    sync();
  }
  // Phones: a placeholder that fits the narrow search box.
  if (narrow && window.matchMedia('(max-width: 600px)').matches) document.getElementById('q')?.setAttribute('placeholder', 'Search');
  if (narrow) for (const t of document.querySelectorAll('details.toc-in')) t.open = false;

  // Sidebar groups remember being folded on desktop; the group holding the current page always stays open.
  // On small screens only that group starts open, so the menu stays short (not remembered).
  // Only a reader's own click on a desktop group is saved, never a fold made by this script.
  const KEY = 'tibo-wiki.nav-closed';
  const groups = [...document.querySelectorAll('.nav-group')];
  const hasHere = groups.some((g) => g.querySelector('[aria-current]'));
  for (const g of groups) {
    const here = g.querySelector('[aria-current]');
    if (narrow) g.open = !!here || (!hasHere && g === groups[0]);
    else if (!here && closed.includes(g.dataset.group)) g.open = false;
    g.querySelector('summary').addEventListener('click', () => {
      if (narrowMq.matches) return;
      const set = new Set(closed);
      g.open ? set.add(g.dataset.group) : set.delete(g.dataset.group); // click runs before the fold changes
      closed = [...set];
      try { localStorage.setItem(KEY, JSON.stringify(closed)); } catch {}
    });
  }

  // Opening a link to a folded section (e.g. /quick-tips#weapons) unfolds it.
  const reveal = () => {
    const t = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    const d = t?.closest('details');
    if (d && !d.open) { d.open = true; t.scrollIntoView(); }
  };
  reveal();
  window.addEventListener('hashchange', reveal);

  // Keep the current page's sidebar link in view on long menus.
  const current = document.querySelector('.side [aria-current="page"]');
  const side = current?.closest('.side');
  if (side && side.scrollHeight > side.clientHeight) side.scrollTop = current.offsetTop - side.clientHeight / 3;

  // Keep the infobox in view while scrolling, but only when all of it fits on screen.
  const box = document.querySelector('.infobox');
  if (box) {
    const fit = () => box.classList.toggle('fits', box.offsetHeight + 96 <= window.innerHeight);
    fit();
    window.addEventListener('resize', fit);
  }

  // Show exact UTC times also in the reader's time zone, with how long ago they were.
  const ago = (ms) => {
    const m = Math.round(ms / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m} min ago`;
    const h = Math.round(m / 60);
    if (h < 48) return `${h} h ago`;
    return `${Math.round(h / 24)} days ago`;
  };
  const local = (d) => d.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
  for (const el of document.querySelectorAll('time[data-local]')) {
    const d = new Date(el.dateTime);
    if (isNaN(d)) continue;
    el.title = `${local(d)} (${d.toISOString()})`;
    if (el.dataset.local === 'ago') {
      el.textContent = ago(Date.now() - d);
    } else {
      el.textContent = local(d);
      el.insertAdjacentHTML('afterend', ` <span class="ago">(${ago(Date.now() - d)})</span>`);
    }
  }

  // Live check: does tibo.dog still serve the game build this wiki documents?
  const check = document.getElementById('live-check');
  const result = document.getElementById('live-result');
  if (check && result) {
    check.hidden = false;
    check.addEventListener('click', async () => {
      check.setAttribute('aria-busy', 'true');
      check.disabled = true;
      result.dataset.status = '';
      result.textContent = 'Checking tibo.dog…';
      try {
        const res = await fetch('/api/live-build', { cache: 'no-store' });
        const body = await res.json();
        result.dataset.status = res.ok ? body.status : 'error';
        const icon = { 'up-to-date': '✓', 'game-updated': '⚠', 'wiki-ahead': '⚠' }[body.status] ?? '✕';
        const msg = res.ok ? body.message : body.error?.message ?? `Check failed (HTTP ${res.status}).`;
        result.textContent = `${icon} ${msg} Checked ${new Date(body.checkedAt ?? Date.now()).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}.`;
      } catch {
        result.dataset.status = 'error';
        result.textContent = '✕ Could not reach the live check. Try again.';
      }
      check.disabled = false;
      check.removeAttribute('aria-busy');
      check.textContent = 'Check again';
    });
  }

  // Tables: numeric columns align right; tables with 4+ rows sort from a button in each header.
  // A leading dash ("—") marks a value the game sets elsewhere; it counts as empty.
  const num = (s) => {
    const m = s.replace(/,/g, '').match(/^[-+]?\d*\.?\d+/);
    return m ? parseFloat(m[0]) : NaN;
  };
  const blank = (v) => v === '' || v.startsWith('—');
  for (const table of document.querySelectorAll('table.wikitable')) {
    const rows = table.tBodies[0]?.rows;
    if (!rows) continue;
    const ths = [...(table.tHead?.rows[0]?.cells ?? [])];
    const cols = Math.max(...[...rows].map((r) => r.cells.length));
    for (let col = 1; col < cols; col++) {
      const vals = [...rows].map((r) => (r.cells[col]?.textContent ?? '').trim()).filter((v) => !blank(v));
      // Dates (2026-11-05) and clock times are labels, not quantities.
      if (vals.length && vals.every((v) => v.length <= 16 && !Number.isNaN(num(v)) && !/^\d{4}-\d\d|^\d+:\d\d/.test(v))) {
        ths[col]?.classList.add('num');
        for (const r of rows) r.cells[col]?.classList.add('num');
      }
    }
    // A pinned first column must not cover a cell that gets keyboard focus while scrolling sideways.
    const wrap = table.closest('.table-wrap');
    // Say so in words when a table has more columns than fit; the edge glow alone is easy to miss.
    if (wrap) {
      const hint = document.createElement('p');
      hint.className = 'scroll-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.textContent = 'Scroll sideways for more columns →';
      wrap.before(hint);
      // An overflowing table is a scroll region: keyboard users can focus it and scroll with the arrow keys.
      const fits = () => {
        // A wide text column at the end (Biomes, notes) wraps tighter before the table resorts to scrolling.
        table.style.removeProperty('--last-max');
        const last = ths[ths.length - 1];
        const extra = wrap.scrollWidth - wrap.clientWidth;
        if (extra > 1 && last && !last.classList.contains('num') && last.offsetWidth - extra - 2 >= 180) {
          table.style.setProperty('--last-max', `${last.offsetWidth - extra - 2}px`);
        }
        const over = wrap.scrollWidth > wrap.clientWidth + 1;
        hint.hidden = !over;
        if (over) {
          wrap.tabIndex = 0;
          wrap.setAttribute('role', 'region');
          let h = wrap.previousElementSibling;
          while (h && !/^H[1-3]$/.test(h.tagName)) h = h.previousElementSibling;
          wrap.setAttribute('aria-label', `${h ? h.textContent.replace(/^#/, '').trim() : document.title}, scrollable table`);
        } else {
          wrap.removeAttribute('tabindex');
          wrap.removeAttribute('role');
          wrap.removeAttribute('aria-label');
        }
      };
      fits();
      window.addEventListener('resize', fits);
      document.fonts?.ready.then(fits);
    }
    if (wrap && ths.length >= 3) {
      wrap.style.scrollPaddingLeft = `${ths[0]?.offsetWidth ?? 0}px`;
      // Browsers skip scrolling a partly visible control into view; bring the whole of it out from under the pin.
      wrap.addEventListener('focusin', (e) => e.target.scrollIntoView({ block: 'nearest', inline: 'nearest' }));
    }
    // Two-column tables are key/value lists; sorting them helps nobody.
    if (rows.length < 4 || ths.length < 3) continue;
    ths.forEach((th, col) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sort';
      btn.append(...th.childNodes);
      th.append(btn);
      th.dataset.sort = '';
      btn.addEventListener('click', () => {
        const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        for (const o of ths) o.removeAttribute('aria-sort');
        th.setAttribute('aria-sort', dir);
        const list = [...table.tBodies[0].rows];
        const vals = list.map((r) => (r.cells[col]?.textContent ?? '').trim());
        const numeric = vals.filter((v) => !blank(v)).every((v) => !Number.isNaN(num(v)));
        const key = (v) => (blank(v) ? (dir === 'ascending' ? Infinity : -Infinity) : num(v));
        const idx = list.map((r, i) => i);
        idx.sort((a, b) => {
          const x = vals[a], y = vals[b];
          const c = numeric ? (key(x) === key(y) ? 0 : key(x) < key(y) ? -1 : 1) : x.localeCompare(y);
          return dir === 'ascending' ? c : -c;
        });
        const body = table.tBodies[0];
        for (const i of idx) body.appendChild(list[i]);
        const status = document.getElementById('sort-status');
        if (status) status.textContent = `Sorted by ${btn.textContent.trim()}, ${dir}.`;
      });
    });
  }

  // Code blocks too wide for their box can be focused and scrolled from the keyboard.
  for (const pre of document.querySelectorAll('article pre')) {
    if (pre.scrollWidth > pre.clientWidth + 1) { pre.tabIndex = 0; pre.setAttribute('role', 'region'); pre.setAttribute('aria-label', 'Code, scrollable'); }
  }

  // Search.
  const input = document.getElementById('q');
  const list = document.getElementById('search-results');
  let index = null;
  const load = async () => {
    if (index) return index;
    const res = await fetch('/search-index.json');
    index = await res.json();
    return index;
  };
  const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
  const search = (q) => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return index
      .map((e) => {
        const title = norm(e.t), hay = norm(`${e.t} ${e.k} ${e.d} ${e.s}`);
        let score = 0;
        for (const t of terms) {
          if (!hay.includes(t)) return null;
          if (title === t) score += 100;
          else if (title.startsWith(t)) score += 40;
          else if (title.includes(t)) score += 20;
          else score += 2;
        }
        return { e, score: score - title.length / 100 };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.e);
  };
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // Suggestions follow the ARIA combobox pattern: focus stays in the box, options are announced
  // through aria-activedescendant, and options are not links of their own.
  const item = (e, i) =>
    `<li role="option" id="sopt-${i}" aria-selected="false" data-href="${e.u}">${e.i ? `<img class="ico" src="/icons/${e.i}.png" alt="" height="22">` : ''}<span>${esc(e.t)}</span><small>${esc(e.s)}</small></li>`;
  let sel = -1;
  if (input && list) {
    // Ctrl+K / Cmd+K focuses search (a modifier shortcut, so it can't fire while typing).
    const mac = /Mac|iP(hone|ad)/.test(navigator.platform);
    const key = document.querySelector('.search-key');
    if (key) { key.textContent = mac ? '⌘K' : 'Ctrl K'; key.hidden = false; }
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'k' && (mac ? e.metaKey : e.ctrlKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });
    const close = () => {
      list.hidden = true;
      sel = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    };
    const select = (i) => {
      const items = [...list.children];
      sel = i;
      items.forEach((li, k) => li.setAttribute('aria-selected', String(k === sel)));
      if (items[sel]) {
        input.setAttribute('aria-activedescendant', items[sel].id);
        items[sel].scrollIntoView({ block: 'nearest' });
      } else input.removeAttribute('aria-activedescendant');
    };
    input.addEventListener('focus', load, { once: true });
    input.addEventListener('input', async () => {
      await load();
      const res = search(input.value).slice(0, 10);
      list.innerHTML = res.map(item).join('');
      if (!res.length) return close();
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      select(-1);
    });
    input.addEventListener('keydown', (e) => {
      const n = list.children.length;
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && n && !list.hidden) {
        e.preventDefault();
        // Positions run -1 (the text box itself) to n - 1 and wrap around.
        const next = sel + (e.key === 'ArrowDown' ? 1 : -1);
        select(next >= n ? -1 : next < -1 ? n - 1 : next);
      } else if (e.key === 'Enter' && sel >= 0 && list.children[sel] && !list.hidden) {
        e.preventDefault();
        location.href = list.children[sel].dataset.href;
      } else if (e.key === 'Escape' && !list.hidden) {
        e.preventDefault();
        close();
      }
    });
    list.addEventListener('mousedown', (e) => e.preventDefault());
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-href]');
      if (li) location.href = li.dataset.href;
    });
    list.addEventListener('mousemove', (e) => {
      const li = e.target.closest('li[data-href]');
      if (li) select([...list.children].indexOf(li));
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search')) close();
    });
  }

  // Full results on /search.
  const out = document.getElementById('search-page-results');
  if (out) {
    const q = new URLSearchParams(location.search).get('q') ?? '';
    if (input) input.value = q;
    load().then(() => {
      const res = q ? search(q) : [];
      const h = document.getElementById('search-heading');
      if (h) h.textContent = q ? `${res.length} result${res.length === 1 ? '' : 's'} for “${q}”` : 'Search the wiki';
      if (!res.length) {
        const browse = 'browse: <a href="/all-pages">All pages</a> · <a href="/weapons">Weapons</a> · <a href="/bosses">Bosses</a> · <a href="/guides">Guides</a> · <a href="/quick-tips">Quick tips</a>';
        out.insertAdjacentHTML('afterend', q
          ? `<p class="no-results">Nothing matches “${esc(q)}”. Check the spelling, try a shorter word, or ${browse}</p>`
          : `<p class="no-results">Type a weapon, boss, item or topic in the search box at the top, or ${browse}</p>`);
      }
      out.innerHTML = res
        .map((e) => `<li><a href="${e.u}">${e.i ? `<img class="ico" src="/icons/${e.i}.png" alt="" height="22">` : ''}${esc(e.t)}</a> <small>(${esc(e.s)})</small><br>${esc(e.d)}</li>`)
        .join('');
    });
  }
})();
