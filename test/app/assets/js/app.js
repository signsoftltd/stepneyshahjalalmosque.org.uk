/* Stepney Shah Jalal Mosque app: shared by every screen.
   - helpers (formatting, saved data), the background pattern and light/dark theme
   - the parts every screen has, added here so each page stays short: icons, the bottom tabs
     (Home, Tasbih, Donate, Qibla, Settings), the side menu (menu button) and sharing the app (share button)
   A page's content is <div class="view" data-page="time"> (nav.js swaps it with HTMX), and its header buttons
   have data-menu-open / data-share. HIUK.shell.view() does the per-screen parts each time a screen is shown.
   Plain scripts (no modules) so the app also runs from local files inside the Android and iOS apps. */
(function () {
  'use strict';
  const HIUK = (window.HIUK = window.HIUK || {});
  const CFG = window.HIUK_CONFIG || {};

  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  HIUK.util = {
    pad,
    esc,
    // "13:05" -> minutes after midnight
    toMin: (hm) => { const [h, m] = String(hm).split(':').map(Number); return h * 60 + m; },
    // "13:05" -> "1:05 pm", or "13:05" with the 24-hour clock (Settings)
    fmt12: (hm) => {
      if (!hm) return '—';
      const [h, m] = hm.split(':').map(Number);
      return HIUK.clock24() ? pad(h) + ':' + pad(m) : (h % 12 || 12) + ':' + pad(m) + ' ' + (h >= 12 ? 'pm' : 'am');
    },
    // the time of a Date the same way
    fmtTime: (d) => HIUK.util.fmt12(pad(d.getHours()) + ':' + pad(d.getMinutes())),
    // a Date at "HH:MM" on the same day as `date`
    at: (date, hm) => { const t = new Date(date); const [h, m] = hm.split(':').map(Number); t.setHours(h, m, 0, 0); return t; },
    addDays: (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; },
    sameDay: (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(),
    dateText: (d, opts) => d.toLocaleDateString('en-GB', opts),
    arDigits: (n) => String(n).replace(/\d/g, (c) => '٠١٢٣٤٥٦٧٨٩'[c])
  };

  // localStorage that never throws (it can be off or full in some webviews)
  HIUK.store = {
    get(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* not saved */ } }
  };

  /* ---- Time format (Settings): 12-hour (default) or 24-hour ---- */
  HIUK.clock24 = (on) => {
    if (on !== undefined) HIUK.store.set('hiuk_app_clock', on ? '24' : '12');
    return HIUK.store.get('hiuk_app_clock') === '24';
  };

  /* ---- App version: the Android / iOS app opens index.html?v=1.0. It is kept, as the other screens open
     without it; config.js appVersion until the app has passed one. ---- */
  HIUK.appVersion = (function () {
    const VKEY = 'hiuk_app_version';
    let v = null;
    try { v = new URLSearchParams(location.search).get('v'); } catch (e) { /* old webview */ }
    v = v && v.trim().slice(0, 20);
    if (v && /^[\w.+\- ]+$/.test(v)) { HIUK.store.set(VKEY, v); return v; }
    return HIUK.store.get(VKEY) || CFG.appVersion || '1.0';
  })();

  /* ---- Background pattern (8-point star tile, as on the website), used by .pattern ---- */
  (function () {
    function star(cx, cy, R) {
      return 'M' + [0, 3, 6, 1, 4, 7, 2, 5].map((k) => { const a = k * Math.PI / 4 + Math.PI / 8; return (cx + R * Math.cos(a)).toFixed(2) + ' ' + (cy + R * Math.sin(a)).toFixed(2); }).join(' L') + 'Z';
    }
    const s = 84, R = s * 0.36, pts = [[s / 2, s / 2], [0, 0], [s, 0], [0, s], [s, s]];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><g fill="none" stroke="#F47A1E" stroke-width="1"><path d="${pts.map(([x, y]) => star(x, y, R)).join(' ')}"/>${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${(R * 0.38).toFixed(2)}"/>`).join('')}</g></svg>`;
    document.documentElement.style.setProperty('--pat', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
  })();

  /* ---- Icons used across the app (<svg class="ico"><use href="#i-NAME"/></svg>) ---- */
  const ICONS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    home: '<path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5.5h4V20"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    wifi: '<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
    share: '<path d="M12 15V3M8 7l4-4 4 4"/><path d="M6 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    repeat: '<path d="M17 2.5 20.5 6 17 9.5"/><path d="M3.5 11.5V10a4 4 0 0 1 4-4h13M7 21.5 3.5 18 7 14.5"/><path d="M20.5 12.5V14a4 4 0 0 1-4 4h-13"/>',
    sound: '<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4zM15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    minus: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
    plus: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16zM10 20.5a2 2 0 0 0 4 0"/>',
    silent: '<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4zM16 9.5l5 5M21 9.5l-5 5"/>',
    facebook: '<path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
    crescent: '<path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 15a7 7 0 0 1-5-11.5z"/><path d="m18 6 .6 1.4 1.4.6-1.4.6L18 10l-.6-1.4L16 8l1.4-.6z"/>',
    book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v14H6.5A1.5 1.5 0 0 0 5 18.5zM5 18.5A1.5 1.5 0 0 0 6.5 20H19"/><path d="M9 7h6M9 10h4"/>',
    star: '<path d="m12 2.5 2.4 3.6 4.3-.8-.8 4.3 3.6 2.4-3.6 2.4.8 4.3-4.3-.8-2.4 3.6-2.4-3.6-4.3.8.8-4.3L2.5 12l3.6-2.4-.8-4.3 4.3.8z"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 7h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5V18M8.5 18h.01M12 18h.01"/>',
    live: '<circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5a3 3 0 0 1 0 6M17.5 14a5 5 0 0 1 3 5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    undo: '<path d="M4 4v5h5"/><path d="M4.6 15a8 8 0 1 0 1.9-8.3L4 9"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    beads: '<circle cx="12" cy="4.5" r="1.6"/><circle cx="17.3" cy="6.7" r="1.6"/><circle cx="19.5" cy="12" r="1.6"/><circle cx="17.3" cy="17.3" r="1.6"/><circle cx="6.7" cy="6.7" r="1.6"/><circle cx="4.5" cy="12" r="1.6"/><circle cx="6.7" cy="17.3" r="1.6"/><path d="M12 19.5v2.5M10.5 22h3"/>',
    // a hand holding a heart (as on the website's donation button)
    donate: '<path d="M14 4.4c-.9-1.2-2.9-1.1-3.5.4-.4 1 .1 2 .9 2.7L14 9.7l2.6-2.2c.8-.7 1.3-1.7.9-2.7-.6-1.5-2.6-1.6-3.5-.4z"/><path d="M3 13.5h3.5l2.8 0c1.1 0 2 .9 2 2H7.5"/><path d="M11.3 15.5h3.9l4.1-2.5c.8-.5 1.9-.1 2.1.8.1.5-.1 1-.5 1.3l-5.2 4.4H3"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    mega: '<path d="M3 10v4h3l6 4V6L6 10H3zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    left: '<path d="m15 6-6 6 6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    mosque: '<path d="M12 2v2M12 4c-3 2-5 4-5 7h10c0-3-2-5-5-7zM4 21V12M20 21V12M2 21h20M8 21v-5a4 4 0 0 1 8 0v5"/>'
  };
  const icon = (name, cls) => `<svg class="ico${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  HIUK.icon = icon;

  // Screens: the bottom tabs, in order. href null = not built yet ("coming soon").
  const TABS = [
    { key: 'home', label: 'Home', icon: 'home', href: 'index.html' },
    { key: 'tasbih', label: 'Tasbih', icon: 'beads', href: 'tasbih.html' },
    { key: 'donate', label: 'Donate', icon: 'donate', href: 'donate.html' },
    { key: 'qibla', label: 'Qibla', icon: 'compass', href: 'qibla.html' },
    { key: 'settings', label: 'Settings', icon: 'gear', href: 'settings.html' }
  ];
  // Side menu (the logo goes to the home screen). web: a website page shown in the app (config.js webPages);
  // url: opens outside the app. Without href / web / url: "coming soon".
  const MENU = [
    { label: 'Full Year Calendar', icon: 'cal', href: 'time.html', key: 'time' },
    { label: 'Ramadhan Timetable', icon: 'crescent', href: 'ramadan.html', key: 'ramadan' },
    { label: 'Digital Tasbih', icon: 'beads', href: 'tasbih.html', key: 'tasbih' },
    { label: 'News & Events', icon: 'mega', web: 'events' },
    { label: 'Daily Duas', icon: 'book', href: 'duas.html', key: 'duas' },
    { label: '99 Names Of Allah', icon: 'star', href: 'names.html', key: 'names' },
    { label: 'Qibla Compass', icon: 'compass', href: 'qibla.html', key: 'qibla' },
    { label: 'Zakat Calculator', icon: 'calc', web: 'zakat' },
    { label: 'Live Stream', icon: 'live', href: 'live.html', key: 'live' },
    { label: 'Donate', icon: 'donate', href: 'give.html', key: 'give' },
    { label: 'Services', icon: 'people', web: 'services' },
    { label: 'About Us', icon: 'info', web: 'about' },
    { label: 'Contact Us', icon: 'phone', web: 'contact' },
    { label: 'Settings', icon: 'gear', href: 'settings.html', key: 'settings' }
  ];
  const SOCIAL = [
    { label: 'Facebook', icon: 'facebook', url: CFG.facebookUrl },
    { label: 'YouTube', icon: 'youtube', url: CFG.youtubeUrl },
    { label: 'Our website', icon: 'globe', url: CFG.website }
  ];

  // key: the screen it opens (a page's data-page, or web-zakat etc.), to mark the current one
  function link(item, cls, key, inner) {
    let attrs;
    if (item.href) attrs = `href="${item.href}"`;
    else if (item.web && (CFG.webPages || {})[item.web]) attrs = `href="web.html#${item.web}"`;
    else if (item.url) attrs = `href="${esc(item.url)}" target="_blank" rel="noopener"`;
    else attrs = `href="#" data-soon="${esc(item.label)}"`;
    return `<a class="${cls}" ${attrs}${key ? ` data-key="${esc(key)}"` : ''}>${inner}</a>`;
  }

  // built once; the screens' content changes inside it (nav.js)
  function buildShell() {
    const sprite = document.createElement('div');
    sprite.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${Object.keys(ICONS).map((k) => `<symbol id="i-${k}" viewBox="0 0 24 24">${ICONS[k]}</symbol>`).join('')}</svg>`;
    document.body.prepend(sprite.firstChild);

    const tabs = document.createElement('nav');
    tabs.className = 'tabs';
    tabs.setAttribute('aria-label', 'Main');
    // Donate (the middle tab) is a raised round button
    tabs.innerHTML = TABS.map((t) => link(t, 'tab' + (t.key === 'donate' ? ' tab-donate' : ''), t.key,
      t.key === 'donate' ? `<i class="tab-donate-btn">${icon(t.icon)}</i><span>${esc(t.label)}</span>` : `${icon(t.icon)}<span>${esc(t.label)}</span>`)).join('');
    (document.querySelector('.app') || document.body).appendChild(tabs);

    const drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.id = 'drawer';
    drawer.hidden = true;
    drawer.innerHTML = `
      <div class="drawer-back" data-menu-close></div>
      <div class="drawer-panel" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="drawerTitle">
        <div class="drawer-head">
          <div class="pattern" aria-hidden="true"></div>
          <div class="drawer-top">
            <div class="drawer-brand">
              <img class="brand-full" id="drawerTitle" src="assets/images/logo-full.png" alt="${esc(CFG.name || 'Stepney Shah Jalal Mosque')}" width="312" height="99">
            </div>
            <button class="icon-btn theme-btn" type="button" role="switch" aria-checked="false" aria-label="Dark mode" data-theme-toggle>${icon('moon', 'i-moon')}${icon('sun', 'i-sun')}</button>
          </div>
          <div class="drawer-social">${SOCIAL.map((s) => link(s, 'social-btn', '', icon(s.icon)).replace('<a ', `<a aria-label="${esc(s.label)}" `)).join('')}</div>
        </div>
        <nav class="drawer-body" aria-label="All screens">
          <ul class="drawer-list">${MENU.map((m) => `<li>${link(m, 'drawer-row', m.key || (m.web ? 'web-' + m.web : ''), `${icon(m.icon)}<span>${esc(m.label)}</span>${icon(m.url ? 'external' : 'chev', 'chev')}`)}</li>`).join('')}</ul>
          <p class="drawer-foot">App version ${esc(HIUK.appVersion)}<br>Design &amp; developed by ${CFG.developer ? `<a href="${esc(CFG.developer.url)}" target="_blank" rel="noopener">${esc(CFG.developer.name)}</a>` : 'Sign Soft Ltd'}</p>
        </nav>
      </div>`;
    document.body.appendChild(drawer);
  }

  /* ---- Each time a screen is shown (nav.js calls this with the screen's scope v; v.el is its .view) ---- */
  HIUK.shell = {
    view(v) {
      const page = document.body.getAttribute('data-page') || '';
      // the current tab and side-menu item
      document.querySelectorAll('.tabs [data-key], .drawer-list [data-key]').forEach((a) => {
        if (a.getAttribute('data-key') === page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });

      // a header that stays at the top (<div class="sticky-head">): its height as --head-h, so things that
      // stick below it (table column names, a bar of buttons) and jumps to a section stop just under it
      const sticky = v.el.querySelector('.sticky-head');
      if (sticky) {
        const headH = () => root.style.setProperty('--head-h', sticky.offsetHeight + 'px');
        headH();
        if (window.ResizeObserver) v.observe(new ResizeObserver(headH)).observe(sticky);
        else v.on(window, 'resize', headH);
      } else root.style.removeProperty('--head-h');

      // home: the top buttons stay on screen (app.css); their background shows once the page has scrolled
      const homeBar = page === 'home' && v.el.querySelector('.top .top-bar');
      if (homeBar) {
        const stuck = () => homeBar.classList.toggle('is-stuck', window.scrollY > 4);
        v.on(window, 'scroll', stuck, { passive: true });
        stuck();
      }


      markTheme();
      HIUK.textSize();
    }
  };

  /* ---- Side menu ---- */
  let lastFocus = null;
  function openMenu() {
    const d = document.getElementById('drawer');
    if (!d) return;
    lastFocus = document.activeElement;
    // already showing (pulled open with a swipe): slide the rest of the way now; otherwise from closed
    if (d.hidden) { d.hidden = false; requestAnimationFrame(() => d.classList.add('is-open')); } else d.classList.add('is-open');
    document.body.classList.add('no-scroll');
    document.querySelectorAll('[data-menu-open]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    // no close button: a tap beside it or a swipe left closes it
    const panel = d.querySelector('.drawer-panel');
    if (panel) panel.focus({ preventScroll: true });
  }
  function closeMenu() {
    const d = document.getElementById('drawer');
    if (!d || d.hidden) return;
    d.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    document.querySelectorAll('[data-menu-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    setTimeout(() => { d.hidden = true; }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  HIUK.menu = { open: openMenu, close: closeMenu };

  /* ---- Swipe: the side menu follows the finger ----
     Right from the left side of the screen pulls it open, left pushes it closed. On letting go it slides the rest
     of the way: open if pulled past a third (or flicked), otherwise back. Starts within the left 90px (Android's own
     back gesture takes the very edge), not on something that scrolls sideways or has its own swipe (the home
     timetable), nor while a popup or sheet is open. On website pages only the strip down the left edge works (see
     .frame-wrap::before), since touches on the page itself go to the website. */
  (function () {
    const EDGE = 90, LOCK = 10;
    let g = null;   // the gesture: { mode, x0, y0, d, panel, back, w, dragging, x, t, vx }
    const sideways = (el) => {
      for (; el && el !== document.body; el = el.parentElement) {
        if (el.id === 'ptList' || el.matches('input,textarea,iframe,.s-step')) return true;
        const o = getComputedStyle(el).overflowX;
        if ((o === 'auto' || o === 'scroll') && el.scrollWidth > el.clientWidth) return true;
      }
      return false;
    };
    // how far open: 0 closed .. 1 open
    function place(p) {
      g.panel.style.transform = `translateX(${(-102 + p * 102).toFixed(2)}%)`;
      g.back.style.opacity = p.toFixed(3);
    }
    function release(s) {
      s.d.classList.remove('is-dragging');
      s.panel.style.transform = '';
      s.back.style.opacity = '';
    }
    document.addEventListener('touchstart', (e) => {
      g = null;
      if (e.touches.length !== 1) return;
      const t = e.touches[0], d = document.getElementById('drawer');
      if (!d) return;
      const open = !d.hidden && d.classList.contains('is-open');
      let mode;
      if (open) mode = 'close';
      else if (d.hidden && t.clientX <= EDGE && !document.querySelector('.pop:not([hidden]), .sheet:not([hidden])') && !sideways(e.target)) mode = 'open';
      else return;
      g = { mode, x0: t.clientX, y0: t.clientY, d, panel: d.querySelector('.drawer-panel'), back: d.querySelector('.drawer-back'), dragging: false, x: t.clientX, t: e.timeStamp, vx: 0 };
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!g) return;
      const t = e.touches[0], dx = t.clientX - g.x0, dy = t.clientY - g.y0;
      if (!g.dragging) {
        if (Math.abs(dx) < LOCK && Math.abs(dy) < LOCK) return;
        // up / down (scrolling), or the wrong way: not a menu swipe
        if (Math.abs(dy) > Math.abs(dx) || (g.mode === 'open' ? dx < 0 : dx > 0)) { g = null; return; }
        g.dragging = true;
        g.w = g.panel.offsetWidth || 300;
        g.d.classList.add('is-dragging');
        if (g.mode === 'open') g.d.hidden = false;
      }
      // speed, for a flick
      const dt = e.timeStamp - g.t;
      if (dt > 0) g.vx = (t.clientX - g.x) / dt;
      g.x = t.clientX; g.t = e.timeStamp;
      const p = g.mode === 'open' ? dx / g.w : 1 + dx / g.w;
      g.p = Math.min(1, Math.max(0, p));
      place(g.p);
      if (e.cancelable) e.preventDefault();   // the finger is moving the menu (not the page, nor the browser's back gesture)
    }, { passive: false });
    function end() {
      if (!g || !g.dragging) { g = null; return; }
      const s = g, open = s.vx > 0.35 ? true : s.vx < -0.35 ? false : s.p > (s.mode === 'open' ? 0.33 : 0.67);
      g = null;
      release(s);   // slides from where the finger left it (the transitions are back on)
      if (open) { if (s.mode === 'open') openMenu(); }
      else if (s.mode === 'close') closeMenu();
      else setTimeout(() => { if (!s.d.classList.contains('is-open')) s.d.hidden = true; }, 260);
    }
    document.addEventListener('touchend', end, { passive: true });
    document.addEventListener('touchcancel', end, { passive: true });
  })();

  /* ---- Share the app ----
     The apps share themselves: window.Android.shareApp(), or { action: 'shareApp' } to the iOS script message handler
     actionMessageHandler. The native app can instead provide window.HIUKNative.share(jsonString) to open the phone's
     share sheet (Android's webview has no navigator.share). Otherwise the browser's share sheet, or copy the link. */
  HIUK.share = function () {
    if (window.Android && typeof window.Android.shareApp === 'function') { window.Android.shareApp(); return; }
    const ios = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.actionMessageHandler;
    if (ios) { ios.postMessage({ action: 'shareApp' }); return; }
    const data = { title: CFG.name || 'Stepney Shah Jalal Mosque', text: CFG.shareText || '', url: CFG.shareUrl || CFG.website || '' };
    if (window.HIUKNative && typeof window.HIUKNative.share === 'function') { window.HIUKNative.share(JSON.stringify(data)); return; }
    if (navigator.share) { navigator.share(data).catch(() => {}); return; }
    const text = (data.text ? data.text + ' ' : '') + data.url;
    HIUK.copy(text).then((ok) => HIUK.toast(ok ? 'Link copied: paste it to share the app' : data.url));
  };
  /* Vibration: navigator.vibrate(pattern) where the phone has it (Android), or { action: 'haptic' } to the iOS
     script message handler (iOS webviews have no navigator.vibrate). HIUK.canHaptic(): whether either is there. */
  const iosHaptic = () => !(typeof navigator.vibrate === 'function') && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.actionMessageHandler;
  HIUK.canHaptic = () => typeof navigator.vibrate === 'function' || !!iosHaptic();
  HIUK.haptic = function (pattern) {
    try {
      if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern);
      else if (iosHaptic()) iosHaptic().postMessage({ action: 'haptic' });
    } catch (e) { /* the phone couldn't */ }
  };
  // copies text -> Promise: whether it worked
  HIUK.copy = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(() => true, () => copyOld(text));
    return Promise.resolve(copyOld(text));
  };
  function copyOld(text) {
    try {
      const t = document.createElement('textarea');
      t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      const ok = document.execCommand('copy');
      t.remove();
      return ok;
    } catch (e) { return false; }
  }

  /* ---- Light / dark: day mode, whatever the phone is set to, until the user picks dark ---- */
  const root = document.documentElement;
  function applyTheme() {
    const isDark = HIUK.store.get('hiuk_app_theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    root.classList.add('theme-set');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#16100F' : '#4B1020');
    markTheme();
    document.dispatchEvent(new CustomEvent('hiuk:theme', { detail: { dark: isDark } }));
  }
  // the dark mode switches (the side menu's, and Settings')
  function markTheme() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-checked', String(isDark)));
  }
  HIUK.isDark = () => root.getAttribute('data-theme') === 'dark';
  applyTheme();

  /* ---- No zooming, selecting or copying (as an app; typing boxes are left alone) ---- */
  const typing = (el) => !!(el && el.closest && el.closest('input,textarea,[contenteditable="true"]'));
  ['copy', 'cut', 'contextmenu', 'selectstart', 'dragstart'].forEach((type) => document.addEventListener(type, (e) => { if (!typing(e.target)) e.preventDefault(); }));
  // iOS ignores user-scalable=no: stop pinching (gesture events) and a second finger
  ['gesturestart', 'gesturechange'].forEach((type) => document.addEventListener(type, (e) => e.preventDefault()));
  document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener('keydown', (e) => {
    // desktop browsers: Ctrl/Cmd + plus, minus, 0 zoom
    if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault();
  });
  document.addEventListener('wheel', (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });

  /* ---- Text size (Settings): the whole app a little smaller or bigger ---- */
  const TEXT = { small: 0.9, normal: 1, large: 1.12, xlarge: 1.25 };
  HIUK.TEXT_SIZES = TEXT;
  HIUK.textSize = (pick) => {
    if (pick) HIUK.store.set('hiuk_app_text', pick);
    const v = HIUK.store.get('hiuk_app_text');
    const size = TEXT[v] ? v : 'normal';
    if (size === 'normal') root.removeAttribute('data-text'); else root.setAttribute('data-text', size);
    // website pages in a frame: only the website is scaled (app.css .frame-zoom)
    root.classList.toggle('frame-zoom', !!(document.body && document.body.classList.contains('page-frame')));
    return size;
  };
  HIUK.textSize();

  /* ---- Short messages at the bottom of the screen ---- */
  let toastTimer = 0;
  HIUK.toast = function (text) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  };

  /* ---- One click handler for the shared buttons ---- */
  // the Donate tab and Donate Online button inside the Android and iOS apps: the app opens its own donation screen. Capture, to come before HTMX (nav.js)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tab-donate,[data-donate-online]')) return;
    const android = window.Android && typeof window.Android.donateOnline === 'function';
    const ios = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.actionMessageHandler;
    if (!android && !ios) return;
    e.preventDefault();
    e.stopPropagation();
    // the app's theme now, so its donation screen can match: 'dark' or 'light'
    const theme = HIUK.isDark() ? 'dark' : 'light';
    if (android) window.Android.donateOnline(theme);
    else ios.postMessage({ action: 'donateOnline', theme: theme });
  }, true);
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-menu-open],[data-menu-close],[data-share],[data-theme-toggle],[data-soon]');
    if (!el) return;
    if (el.hasAttribute('data-menu-open')) openMenu();
    else if (el.hasAttribute('data-menu-close')) closeMenu();
    else if (el.hasAttribute('data-share')) HIUK.share();
    else if (el.hasAttribute('data-theme-toggle')) { HIUK.store.set('hiuk_app_theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); applyTheme(); }
    else if (el.hasAttribute('data-soon')) { e.preventDefault(); closeMenu(); HIUK.toast(el.getAttribute('data-soon') + ' is coming soon'); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---- Loading screen (app.css: body::before / ::after) ----
     It goes once the page is built and its fonts are in (at most 1.5 seconds; not waiting for pictures or a
     website page in a frame, which show their own loading), and shows again while going to another screen. */
  function pageReady() {
    const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(() => requestAnimationFrame(() => root.classList.add('is-ready')));
  }
  document.addEventListener('click', (e) => {
    // moving between screens with HTMX (nav.js) needs no loading screen
    if (HIUK.nav && HIUK.nav.on) return;
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(tel|mailto|https?):/i.test(href)) return;
    // the same page with only a different #part (web.html reloads itself for that)
    if (a.pathname === location.pathname && a.hash && a.pathname.indexOf('web.html') < 0) return;
    root.classList.add('is-leaving');
  });
  // coming back with the phone's back button (page kept in memory): no loading screen
  window.addEventListener('pageshow', (e) => { if (e.persisted) { root.classList.remove('is-leaving'); root.classList.add('is-ready'); } });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { buildShell(); applyTheme(); pageReady(); });
  else { buildShell(); applyTheme(); pageReady(); }
})();
