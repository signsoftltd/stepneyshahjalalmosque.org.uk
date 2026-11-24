/* Stepney Shah Jalal Mosque app: a website page shown inside the app, in its app mode (?app=1: no website header or
   footer), in the app's light or dark theme. Used by the Donate tab (config.js donateUrl) and by web.html for the
   other website pages: web.html#zakat, #events, #services, #about, #contact (config.js webPages; nav.js HIUK.webPage()).
   Payments on the donations page are taken by the Sign Soft donation app (Stripe, Apple Pay, Google Pay, PayPal). */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const CFG = window.HIUK_CONFIG || {};
    const $ = (id) => document.getElementById(id);
    const frame = $('frame'), loading = $('frameLoading'), offline = $('frameOffline');
    let timer = 0;
    v.cleanup(() => clearTimeout(timer));

    // web.html: which website page, its title in the header
    let base = CFG.donateUrl || 'https://hefazotheislamuk.org/donations';
    if (v.el.getAttribute('data-frame') === 'web') {
      const p = HIUK.webPage();
      $('webTitle').textContent = p.title;
      $('webSub').textContent = p.sub || '';
      frame.title = p.title;
      document.title = p.title + ' | Stepney Shah Jalal Mosque';
      base = (CFG.webBase || 'https://hefazotheislamuk.org/') + p.path;
    }
    const pageUrl = () => base + (base.indexOf('?') < 0 ? '?' : '&') + 'app=1&theme=' + (HIUK.isDark() ? 'dark' : 'light');

    function show(state) {
      loading.hidden = state !== 'loading';
      offline.hidden = state !== 'offline';
      frame.hidden = state !== 'page';
    }

    function load() {
      if (navigator.onLine === false) { show('offline'); return; }
      show('loading');
      clearTimeout(timer);
      // a page that never finishes loading (no connection) shows the offline message
      timer = setTimeout(() => { if (!frame.dataset.loaded) show('offline'); }, 20000);
      delete frame.dataset.loaded;
      frame.src = pageUrl();
    }

    frame.addEventListener('load', () => {
      if (!frame.src) return;
      frame.dataset.loaded = '1';
      clearTimeout(timer);
      show('page');
    });
    $('frameRetry').addEventListener('click', load);
    v.on(window, 'online', () => { if (!frame.dataset.loaded) load(); });
    v.on(window, 'offline', () => { if (!frame.dataset.loaded) show('offline'); });
    // the app's theme changed: show the page in the new theme
    v.on(document, 'hiuk:theme', () => { if (frame.src && frame.src !== pageUrl()) load(); });

    load();
  });
})();
