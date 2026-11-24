/* Hefazothe Islam UK: event cards and "Read more" dialog, loaded from the admin panel's posts API.
   Used by the home page (site.js) and the all-events page (events.php). */
window.HIUKEvents = (function () {
  'use strict';
  // Events and FAQs are managed in the admin panel; the address is set in config.js.
  const API_BASE = window.HIUK_API || 'https://admin.hefazotheislamuk.org/api/public';
  const API = API_BASE + '/posts';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const fmt12 = (hm) => { if (!hm) return ''; const [h, m] = hm.split(':').map(Number); return (h % 12 || 12) + ':' + pad(m) + ' ' + (h >= 12 ? 'pm' : 'am'); };
  function starPath(cx, cy, R) {
    const order = [0, 3, 6, 1, 4, 7, 2, 5];
    return 'M' + order.map((k) => {
      const a = k * Math.PI / 4 + Math.PI / 8;
      return (cx + R * Math.cos(a)).toFixed(2) + ' ' + (cy + R * Math.sin(a)).toFixed(2);
    }).join(' L') + 'Z';
  }

  // Placeholder artwork for events without an image, used in turn
  const ART = [
    { bg: '#2C3494', line: '#F8A662', icon: 'i-lamp' },
    { bg: '#F8E6D2', line: '#9A4709', icon: 'i-quran' },
    { bg: '#DCEEDF', line: '#14844C', icon: 'i-sprout' },
    { bg: '#F2DEE0', line: '#7F2230', icon: 'i-users' },
    { bg: '#141A55', line: '#F8A662', icon: 'i-play' },
    { bg: '#7F2230', line: '#FBD9B5', icon: 'i-mosque' }
  ];
  function eventArt(i, id) {
    const a = ART[i % ART.length];
    const s = 44, R = s * .36;
    const d = [[s / 2, s / 2], [0, 0], [s, 0], [0, s], [s, s]].map(([x, y]) => starPath(x, y, R)).join(' ');
    return `<svg viewBox="0 0 400 250" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
      <defs><pattern id="${id}" width="${s}" height="${s}" patternUnits="userSpaceOnUse"><path d="${d}" fill="none" stroke="${a.line}" stroke-width=".8"/></pattern>
      <radialGradient id="${id}g" cx=".72" cy=".6" r=".6"><stop offset="0" stop-color="${a.line}" stop-opacity=".22"/><stop offset="1" stop-color="${a.line}" stop-opacity="0"/></radialGradient></defs>
      <rect width="400" height="250" fill="${a.bg}"/><rect width="400" height="250" fill="url(#${id})" opacity=".22"/><rect width="400" height="250" fill="url(#${id}g)"/>
      <g fill="none" stroke="${a.line}" stroke-width="1.3" opacity=".85"><path d="M232 260 V150 C232 112 260 88 290 76 C320 88 348 112 348 150 V260"/><path d="M216 260 V146 C216 100 250 72 290 58 C330 72 364 100 364 146 V260" opacity=".45"/></g>
      <g transform="translate(266 136) scale(2)" fill="none" stroke="${a.line}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><use href="#${a.icon}" width="24" height="24"/></g>
    </svg>`;
  }

  function when(e, withYear) {
    const d = new Date(e.date + 'T12:00');
    const opts = { weekday: 'short', day: 'numeric', month: 'short' };
    if (withYear) opts.year = 'numeric';
    return d.toLocaleDateString('en-GB', opts) + (e.time ? ' · ' + fmt12(e.time) : '');
  }

  function card(e, i, o) {
    const d = new Date(e.date + 'T12:00');
    return `<article class="ev card">
      <div class="ev-art">${e.image ? `<img src="${esc(e.image)}" alt="" loading="lazy">` : eventArt(i, o.uid + i)}
        <span class="badge tag">${esc(e.type_label || 'Event')}</span>
        <span class="ev-cal"><small>${d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}</small><b>${d.getDate()}</b></span></div>
      <div class="ev-body card-body">
        <div class="ev-meta"><span><svg class="ico"><use href="#i-clock"/></svg><time datetime="${esc(e.date + (e.time ? 'T' + e.time : ''))}">${when(e, o.withYear)}</time></span>${e.loc ? `<span><svg class="ico"><use href="#i-pin"/></svg>${esc(e.loc)}</span>` : ''}</div>
        <h3>${esc(e.title)}</h3><p>${esc(e.text)}</p>
        <button class="link-arrow ev-more" type="button" data-ev="${i}" style="margin-top:auto">Read more<svg class="ico"><use href="#i-arrow"/></svg></button>
      </div></article>`;
  }

  let dlg = null;
  function openDialog(e, i, o) {
    if (!dlg) {
      dlg = document.createElement('div');
      dlg.className = 'modal fade ck-modal ev-modal';
      dlg.tabIndex = -1;
      dlg.setAttribute('aria-labelledby', 'evDlgTitle');
      dlg.innerHTML = '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"><div class="modal-content ck-dialog"></div></div>';
      document.body.appendChild(dlg);
      dlg.addEventListener('click', (ev) => { if (ev.target.closest('a[href^="#"]')) bootstrap.Modal.getOrCreateInstance(dlg).hide(); });
    }
    // body is HTML from the admin panel's rich text editor, already cleaned by the API (allowlisted tags, attributes and URLs)
    const details = e.body || `<p>${esc(e.text)}</p>`;
    dlg.querySelector('.modal-content').innerHTML = `
      <div class="ev-art ev-modal-art">${e.image ? `<img src="${esc(e.image)}" alt="">` : eventArt(i, 'epm')}<span class="badge tag">${esc(e.type_label || 'Event')}</span></div>
      <div class="ck-head"><h2 id="evDlgTitle">${esc(e.title)}</h2><button class="ck-x" type="button" data-bs-dismiss="modal" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
      <div class="ev-modal-body">
        <div class="ev-meta"><span><svg class="ico"><use href="#i-clock"/></svg>${when(e, true)}</span>${e.loc ? `<span><svg class="ico"><use href="#i-pin"/></svg>${esc(e.loc)}</span>` : ''}</div>
        <div class="ev-rich">${details}</div>
      </div>
      <div class="ck-foot"><a class="btn site-btn btn-em" href="${esc(o.contactHref)}">Ask about this event</a></div>`;
    bootstrap.Modal.getOrCreateInstance(dlg).show();
  }

  /**
   * Load events into `grid`.
   * opts: api (defaults to API above), query ('upcoming=1'), limit (5), more (a "Load more" button, optional),
   *       empty (message), contactHref ('contact'), withYear (false)
   * Returns { show(query, empty) } to switch lists, e.g. upcoming / past.
   */
  function mount(grid, opts) {
    const o = Object.assign({ api: API, query: 'upcoming=1', limit: 5, more: null, empty: 'No upcoming events yet. Check back soon.', contactHref: 'contact', withYear: false }, opts);
    o.uid = (grid.id || 'ev') + '-';
    let list = [], offset = 0, req = 0;

    function render() {
      grid.innerHTML = list.length ? list.map((e, i) => card(e, i, o)).join('') : `<p class="empty">${esc(o.empty)}</p>`;
    }
    function load(append) {
      const mine = ++req;
      if (!append) { grid.innerHTML = '<p class="empty">Loading events…</p>'; if (o.more) o.more.hidden = true; }
      if (o.more) o.more.disabled = true;
      fetch(`${o.api}?type=event&${o.query}&limit=${o.limit}&offset=${offset}`, { headers: { Accept: 'application/json' } })
        .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then((data) => {
          if (mine !== req) return; // a newer request replaced this one
          const posts = (data && data.posts) || [];
          list = append ? list.concat(posts) : posts;
          offset += posts.length;
          render();
          if (o.more) { o.more.hidden = !data.has_more; o.more.disabled = false; o.more.textContent = 'Load more events'; }
        })
        .catch(() => {
          if (mine !== req) return;
          if (append && o.more) { o.more.disabled = false; o.more.textContent = 'Could not load more. Try again'; return; }
          grid.innerHTML = `<p class="empty">Events could not be loaded right now. Please try again later or <a href="${esc(o.contactHref)}">contact us</a>.</p>`;
        });
    }

    grid.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.ev-more');
      const i = btn ? Number(btn.dataset.ev) : -1;
      if (list[i]) openDialog(list[i], i, o);
    });
    if (o.more) o.more.addEventListener('click', () => load(true));
    load(false);

    return {
      show(query, empty) { o.query = query; if (empty) o.empty = empty; list = []; offset = 0; load(false); }
    };
  }

  return { mount, apiBase: API_BASE };
})();
