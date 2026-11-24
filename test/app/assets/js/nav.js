/* Hefazothe Islam UK app: moving between screens with HTMX (assets/js/vendor/htmx.min.js).
   The shell (side menu, bottom tabs, icons, alerts) is built once by app.js. Each page's own content is
     <div id="view"><div class="view" data-page="time" data-scripts="time.js makrooh.js"> header, main </div></div>
   and tapping a link to another screen fetches that page and swaps in only its .view (hx-boost on <body>).
   - Screens' scripts are loaded once and run each time their screen is shown: HIUK.view(function (v) { ... })
     gets a scope v; v.on / v.every / v.later / v.observe / v.own / v.cleanup end when the screen goes.
   - history.back shows the previous screen again (history.pushState); the Android app's back button goes to Home (window.goBack).
   - If a page can't be fetched (a webview that doesn't let the app's pages read its other files, see README)
     the link opens the normal way, and the rest of this launch does too. */
(function () {
  'use strict';
  const CFG = window.HIUK_CONFIG || {};
  const root = document.documentElement;
  const OFF = 'hiuk_app_nav_off';
  const SELECT = '#view > .view';
  const file = (src) => String(src || '').split('#')[0].split('?')[0].split('/').pop();
  const SCREEN = /^[\w-]+\.html$/;

  /* ---- a screen's scope: what it starts, ended when it goes ---- */
  function scope(el) {
    const done = [];
    let alive = true;
    return {
      el,
      get alive() { return alive; },
      on(target, type, fn, opts) { if (!alive) return; target.addEventListener(type, fn, opts); done.push(() => target.removeEventListener(type, fn, opts)); },
      every(fn, ms) { if (!alive) return 0; const id = setInterval(fn, ms); done.push(() => clearInterval(id)); return id; },
      later(fn, ms) { if (!alive) return 0; const id = setTimeout(fn, ms); done.push(() => clearTimeout(id)); return id; },
      observe(obs) { if (alive) done.push(() => obs.disconnect()); else obs.disconnect(); return obs; },
      own(node) { if (alive) done.push(() => node.remove()); return node; },
      cleanup(fn) { if (alive) done.push(fn); else fn(); },
      end() { alive = false; done.splice(0).reverse().forEach((f) => { try { f(); } catch (e) { /* already gone */ } }); }
    };
  }

  /* ---- screens' scripts ---- */
  const VIEWS = {}, waiting = {};
  HIUK.view = function (mount) {
    const name = file(document.currentScript && document.currentScript.src);
    VIEWS[name] = mount;
  };
  function load(name) {
    if (VIEWS[name]) return Promise.resolve();
    if (waiting[name]) return waiting[name];
    return (waiting[name] = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'assets/js/' + name;
      s.onload = s.onerror = () => { delete waiting[name]; resolve(); };
      document.body.appendChild(s);
    }));
  }

  /* ---- where we are: HIUK.route { url, page, hash } (hash without #) ---- */
  function setRoute(url) {
    const u = new URL(url, location.href);
    let hash = u.hash.slice(1);
    try { hash = decodeURIComponent(hash); } catch (e) { /* keep it as it is */ }
    HIUK.route = { url: u.href, page: file(u.pathname) || 'index.html', hash };
  }
  setRoute(location.href);
  // web.html#zakat -> config.js webPages.zakat (About when the #part isn't one of them)
  HIUK.webPage = function () {
    const pages = CFG.webPages || {}, key = pages[HIUK.route.hash] ? HIUK.route.hash : 'about';
    return Object.assign({ key, title: 'Hefazothe Islam UK', sub: '', path: '' }, pages[key]);
  };

  /* ---- showing a screen ---- */
  let scopes = [], current = null;
  function leave() { scopes.splice(0).forEach((s) => s.end()); current = null; }
  function enter(el) {
    current = el;
    const page = el.getAttribute('data-page') || '';
    document.body.setAttribute('data-page', page === 'web' ? 'web-' + HIUK.webPage().key : page);
    document.body.classList.toggle('page-frame', el.hasAttribute('data-frame'));
    const shell = scope(el);
    scopes.push(shell);
    if (HIUK.shell) HIUK.shell.view(shell);   // app.js: the header's home button, current tab, sticky header...
    const names = (el.getAttribute('data-scripts') || '').split(/\s+/).filter(Boolean);
    return names.reduce((p, name) => p.then(() => load(name)).then(() => {
      if (current !== el || !VIEWS[name]) return;
      const v = scope(el);
      scopes.push(v);
      try { VIEWS[name](v); } catch (e) { if (window.console) console.error(name, e); }
    }), Promise.resolve());
  }

  /* ---- HTMX ---- */
  const htmx = window.htmx;
  let off = false;
  try { off = sessionStorage.getItem(OFF) === '1'; } catch (e) { /* storage off: try */ }
  const on = !!(htmx && document.getElementById('view') && !off);
  HIUK.nav = { on, go };

  // opens a screen the normal way (a full page load, with the loading screen)
  function open(url) { root.classList.add('is-leaving'); location.href = url; }
  // shows a screen: through HTMX when it works
  function go(url, fromHistory) {
    if (!on) { open(url); return; }
    next = { url: new URL(url, location.href).href, fromHistory: !!fromHistory };
    htmx.ajax('GET', next.url, { target: '#view', select: SELECT, swap: 'innerHTML' });
  }

  let next = null;   // { url, fromHistory, y } the screen being fetched
  if (htmx) {
    htmx.config.historyEnabled = false;          // history is kept here (pushState) with the screens' URLs
    htmx.config.selfRequestsOnly = false;        // the app's pages are file:// ones; htmx:validateUrl keeps it to them
    htmx.config.scrollIntoViewOnBoost = false;   // scrolled here
    htmx.config.defaultSwapDelay = 0;
    htmx.config.defaultSettleDelay = 0;
    htmx.config.globalViewTransitions = true;    // crossfade between screens (app.css); older webviews fade in instead
    // a file:// page read by the webview answers with status 0
    htmx.config.responseHandling = [{ code: '204', swap: false }, { code: '^0$', swap: true }].concat(htmx.config.responseHandling.slice(1));
  }
  if (on) {
    const b = document.body;
    b.setAttribute('hx-boost', 'true');
    b.setAttribute('hx-target', '#view');
    b.setAttribute('hx-select', SELECT);
    b.setAttribute('hx-swap', 'innerHTML');
    b.setAttribute('hx-push-url', 'false');

    const bar = document.createElement('div');
    bar.className = 'nav-bar';
    bar.setAttribute('aria-hidden', 'true');
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(bar));

    // only the app's own screens are swapped in; anything else (tel:, another site...) opens as before
    document.addEventListener('htmx:validateUrl', (e) => {
      const u = e.detail.url;
      const mine = u.protocol === location.protocol && (u.protocol === 'file:' || u.host === location.host) && SCREEN.test(file(u.pathname));
      if (!mine) { e.preventDefault(); open(u.href); }
    });
    document.addEventListener('htmx:beforeRequest', (e) => {
      if (e.detail.target !== document.getElementById('view')) return;
      // a tapped link (go() has set it already for the back button)
      if (!next) next = { url: new URL(e.detail.pathInfo.requestPath, location.href).href, fromHistory: false };
      // remember where this screen was scrolled to, for coming back
      try { history.replaceState(Object.assign({}, history.state, { y: window.scrollY }), ''); } catch (err) { /* no history */ }
      if (HIUK.menu) HIUK.menu.close();
      root.classList.add('is-navigating');
    });
    document.addEventListener('htmx:afterRequest', () => root.classList.remove('is-navigating'));
    document.addEventListener('htmx:beforeSwap', (e) => {
      if (e.detail.target === document.getElementById('view') && e.detail.shouldSwap) leave();
    });
    document.addEventListener('htmx:afterSwap', (e) => {
      if (e.detail.target !== document.getElementById('view') || !next) return;
      const n = next;
      next = null;
      const el = document.querySelector(SELECT);
      if (!el) { open(n.url); return; }   // not a screen of the app
      setRoute(n.url);
      if (!n.fromHistory) {
        const state = { hiuk: n.url, y: 0 };
        try { history.pushState(state, '', n.url); } catch (err) {
          // file:// pages can't put another file's address in the history: keep it in the state only
          try { history.pushState(state, ''); } catch (err2) { /* no history */ }
        }
      }
      const y = n.fromHistory ? (history.state && history.state.y) || 0 : 0;
      window.scrollTo(0, 0);
      if (!document.startViewTransition) {
        root.classList.add('view-in');
        setTimeout(() => root.classList.remove('view-in'), 240);
      }
      enter(el).then(() => { if (y) window.scrollTo(0, y); });
    });
    // couldn't fetch the page (or not found): open it the normal way
    const failed = (remember) => (e) => {
      const url = (next && next.url) || (e.detail.pathInfo && new URL(e.detail.pathInfo.requestPath, location.href).href);
      next = null;
      root.classList.remove('is-navigating');
      if (remember) { try { sessionStorage.setItem(OFF, '1'); } catch (err) { /* not saved */ } }
      if (url) open(url);
    };
    document.addEventListener('htmx:sendError', failed(true));
    document.addEventListener('htmx:responseError', failed(false));
    document.addEventListener('htmx:timeout', failed(false));
    document.addEventListener('htmx:onLoadError', failed(true));

    // the phone's back button
    window.addEventListener('popstate', (e) => {
      const s = e.state;
      if (s && s.hiuk) go(s.hiuk, true);
    });
    try { history.replaceState(Object.assign({}, history.state, { hiuk: location.href }), ''); } catch (e) { /* no history */ }
  }

  // the Android app's back button calls this: Home hands it back to the app, any other screen goes to Home
  window.goBack = function () {
    if (document.body.getAttribute('data-page') !== 'home') go('index.html');
    else if (window.Android && typeof window.Android.goBack === 'function') window.Android.goBack();
  };

  // without HTMX: web.html#zakat -> web.html#about only changes the #part, so load the other website page
  if (!on) window.addEventListener('hashchange', () => { if (document.querySelector('.view[data-frame="web"]')) location.reload(); });

  // the first screen (after app.js has built the shell)
  function first() {
    const el = document.querySelector(SELECT);
    if (el) enter(el);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', first);
  else first();
})();
