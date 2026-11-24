/* Hefazothe Islam UK app: the website's popup message (admin panel > Notices), shown on the home screen.
   Same settings as on the website: shown once per person (until the popup is changed), once each time the app is
   opened ("once per visit"), or every time the home screen opens ("every page"); after the set delay; only between
   its start and end dates (the API leaves it out otherwise). Nothing is shown offline.
   Links from the admin panel are website pages: in the message, those the app has open in the app (Donate, Zakat,
   Events, About, timetable, home), the rest open in the phone's browser. The button's link always opens in the
   phone's browser. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const CFG = window.HIUK_CONFIG || {};
    const { esc } = HIUK.util;
    const KEY = 'hiuk_app_popup_seen';
    const BASE = CFG.webBase || 'https://hefazotheislamuk.org/';

    // Arabic runs in the message are shown in the app's Arabic font (as the website does)
    const AR = '؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿';
    const AR_RUN = new RegExp(`[${AR}]+(?:[\\s\\u200c\\u200d.,!:()\\-]*[${AR}]+)*`, 'g');
    function arWrap(root) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) { AR_RUN.lastIndex = 0; if (AR_RUN.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode); }
      nodes.forEach((n) => {
        const tmp = document.createElement('span');
        tmp.innerHTML = esc(n.nodeValue).replace(AR_RUN, (m) => `<span class="ar-run" lang="ar" dir="rtl">${m}</span>`);
        n.replaceWith(...tmp.childNodes);
      });
    }

    // a link from the admin panel -> { href, outside }
    const IN_APP = { '': 'index.html', index: 'index.html', donations: 'donate.html', timetable: 'time.html' };
    function appLink(link) {
      link = String(link || '').trim();
      if (/^(mailto:|tel:)/i.test(link)) return { href: link, outside: false };
      if (/^https?:\/\//i.test(link)) {
        // a full address on the website itself: treat it like a website page
        if (link.indexOf(BASE) !== 0) return { href: link, outside: true };
        link = link.slice(BASE.length);
      }
      if (/^#/.test(link)) return { href: 'index.html', outside: false };   // a section of the website's home page
      const page = link.replace(/^\.?\//, '').replace(/\.(html|php)$/i, '').replace(/#.*$/, '');
      if (page in IN_APP) return { href: IN_APP[page], outside: false };
      if ((CFG.webPages || {})[page]) return { href: 'web.html#' + page, outside: false };
      return { href: BASE + link.replace(/^\.?\//, ''), outside: true };
    }
    // the button's link: always the full address, opened in the phone's browser (openLink below)
    function webLink(link) {
      link = String(link || '').trim();
      if (/^(mailto:|tel:)/i.test(link)) return link;
      try { return new URL(link.replace(/^\.?\//, ''), BASE).href; } catch (e) { return BASE; }
    }
    // the apps open it outside: Android.openLink(url), or { action: 'openLink', url } to the iOS script message
    // handler. Without either (e.g. a browser), a new tab
    function openLink(url) {
      if (window.Android && typeof window.Android.openLink === 'function') { window.Android.openLink(url); return true; }
      const ios = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.actionMessageHandler;
      if (ios) { ios.postMessage({ action: 'openLink', url }); return true; }
      return false;
    }

    function show(p) {
      const title = String(p.title || '').trim();
      const btn = p.button && p.button.text ? p.button : null;
      const url = btn ? webLink(btn.link) : '', outside = !/^(mailto:|tel:)/i.test(url);
      const el = document.createElement('div');
      el.className = 'pop';
      el.innerHTML = `<div class="pop-back" data-pop-close></div>
        <div class="pop-card" role="dialog" aria-modal="true" tabindex="-1" ${title ? 'aria-labelledby="popTitle"' : 'aria-label="Announcement"'}>
          ${p.image ? `<img class="pop-img" src="${esc(p.image)}" alt="">` : ''}
          <div class="pop-body">
            ${title ? `<h2 id="popTitle">${esc(title)}</h2>` : ''}
            ${p.body_html ? `<div class="pop-text">${p.body_html}</div>` : ''}
            ${btn ? `<a class="btn-main pop-btn" href="${esc(url)}"${outside ? ' target="_blank" rel="noopener"' : ''}>${esc(btn.text)}</a>` : ''}
          </div>
        </div>`;
      // body_html is from the admin panel's rich text editor, already cleaned by the API; its links become app links
      el.querySelectorAll('.pop-text a[href]').forEach((a) => {
        const l = appLink(a.getAttribute('href'));
        a.setAttribute('href', l.href);
        if (l.outside) { a.target = '_blank'; a.rel = 'noopener'; } else a.removeAttribute('target');
      });
      arWrap(el.querySelector('.pop-card'));
      document.body.appendChild(v.own(el));

      const last = document.activeElement;
      const close = () => {
        el.classList.remove('is-open');
        document.removeEventListener('keydown', onKey);
        setTimeout(() => el.remove(), 250);
        if (last && last.focus) last.focus();
      };
      const onKey = (e) => { if (e.key === 'Escape') close(); };
      el.addEventListener('click', (e) => {
        const b = e.target.closest('.pop-btn');
        if (b && b.target === '_blank' && openLink(b.href)) e.preventDefault();
        if (e.target.closest('[data-pop-close]') || b) close();
      });
      v.on(document, 'keydown', onKey);
      requestAnimationFrame(() => { el.classList.add('is-open'); el.querySelector('.pop-card').focus({ preventScroll: true }); });
    }

    function maybeShow(p) {
      if (!p || !p.enabled) return;
      const id = String(p.id || '1');
      let local = null, session = null;
      try { local = localStorage.getItem(KEY); session = sessionStorage.getItem(KEY); } catch (e) { /* storage off: show it */ }
      if (p.frequency === 'once' && local === id) return;
      if (p.frequency === 'session' && session === id) return;
      let tries = 0;
      const go = () => {
        // not on top of the side menu or another window
        if (document.querySelector('.drawer.is-open, .sheet:not([hidden]), .pop:not([hidden])') && tries++ < 20) { v.later(go, 1500); return; }
        try { if (p.frequency === 'once') localStorage.setItem(KEY, id); if (p.frequency === 'session') sessionStorage.setItem(KEY, id); } catch (e) { /* not saved */ }
        show(p);
      };
      v.later(go, Math.max(0, Math.min(30, Number(p.delay) || 0)) * 1000);
    }

    if (!CFG.apiUrl) return;
    fetch(CFG.apiUrl + '/notices', { headers: { Accept: 'application/json' } })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((d) => { if (d && d.success) maybeShow(d.popup); })
      .catch(() => {}); // offline or no notices: no popup
  });
})();
