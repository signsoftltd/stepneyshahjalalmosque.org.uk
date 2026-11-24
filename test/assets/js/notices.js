/* Hefazothe Islam UK: notices from the admin panel (Notices).
   - a scrolling text bar (marquee) across the very top of the page
   - a popup message, shown once per visitor, once per visit or on every page (as set in the admin panel)
   Nothing is shown if the settings can't be loaded. */
(function () {
  'use strict';
  const API = (window.HIUK_API || 'https://admin.hefazotheislamuk.org/api/public') + '/notices';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // same rule as the admin panel: pages, #sections, /paths, web addresses, mailto: and tel:
  const safeLink = (url) => /^(https?:\/\/[^\s<>"]+|mailto:[^\s<>"]+|tel:[+\d\s()-]+|#[\w-]+|\.?\/[^\s<>"]*|[\w-]+(\.html|\.php)?(#[\w-]+)?)$/i.test(String(url || '').trim());
  // links saved in the admin panel may use the old page.html form: use the clean address (zakat.html -> zakat, index.html#prayer -> ./#prayer)
  const cleanLink = (url) => String(url || '').trim().replace(/^index\.(html|php)(?=#|$)/i, './').replace(/^([\w-]+)\.(html|php)(?=#|$)/i, '$1');
  const isHome = /(^|\/)(index(\.html|\.php)?)?$/i.test(location.pathname);
  // "#prayer" on another page means the home page section
  const href = (link) => { link = cleanLink(link); return /^#/.test(link) && !document.querySelector(link) ? './' + link : link; };
  const external = (link) => /^https?:\/\//i.test(link) && !link.startsWith(location.origin);
  // runs of Arabic letters (with the spaces and punctuation between words), shown in the site's Arabic font
  const AR = '؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿';
  const AR_RUN = new RegExp(`[${AR}]+(?:[\\s\\u200c\\u200d.,!:()\\-]*[${AR}]+)*`, 'g');
  const arWrap = (html) => html.replace(AR_RUN, (m) => `<span class="ar-run" lang="ar" dir="rtl">${m}</span>`);
  // the same for text already in the page (popup message from the rich text editor)
  function arWrapNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) { AR_RUN.lastIndex = 0; if (AR_RUN.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode); }
    nodes.forEach((n) => {
      if (n.parentElement && n.parentElement.closest('.ar-run')) return;
      const tmp = document.createElement('span');
      tmp.innerHTML = arWrap(esc(n.nodeValue));
      n.replaceWith(...tmp.childNodes);
    });
  }
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = (type) => ({
    get(k) { try { return window[type].getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window[type].setItem(k, v); } catch (e) { /* storage blocked: popup may show again */ } }
  });

  /* ---- Scrolling bar ---- */
  const SPEED = { slow: 40, normal: 70, fast: 110 }; // pixels per second

  function marquee(m) {
    if (!m || !m.enabled || !Array.isArray(m.items) || !m.items.length) return;
    if (m.pages === 'home' && !isHome) return;
    const item = (it, hidden) => {
      const text = arWrap(esc(it.text));
      if (!it.link || !safeLink(it.link)) return `<span class="mq-item">${text}</span>`;
      const ext = external(it.link) ? ' target="_blank" rel="noopener"' : '';
      return `<a class="mq-item" href="${esc(href(it.link.trim()))}"${ext}${hidden ? ' tabindex="-1"' : ''}>${text}</a>`;
    };
    const group = (hidden) => m.items.map((it) => item(it, hidden) + '<span class="mq-sep" aria-hidden="true">✦</span>').join('');

    const bar = document.createElement('div');
    bar.className = 'mq';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Announcements');
    bar.innerHTML = `<div class="mq-view"><div class="mq-track"><div class="mq-group">${group(false)}</div></div></div>
      <button class="mq-btn" type="button" aria-pressed="false" aria-label="Pause announcements"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="mq-pause" d="M9 6v12M15 6v12"/><path class="mq-play" d="m8 5 11 7-11 7z"/></svg></button>`;
    const first = document.querySelector('.utility') || document.getElementById('siteHeader');
    if (first) first.parentNode.insertBefore(bar, first); else document.body.prepend(bar);

    const track = bar.querySelector('.mq-track'), btn = bar.querySelector('.mq-btn');
    if (reduce) { bar.classList.add('is-static'); btn.hidden = true; return; } // no movement: the messages can be scrolled sideways instead

    // repeat the messages so one copy is at least as wide as the screen, then add a second copy (hidden from screen readers)
    // and move the track by exactly one copy so the loop is seamless
    function build() {
      const g = track.querySelector('.mq-group');
      track.querySelectorAll('.mq-group[aria-hidden]').forEach((n) => n.remove());
      g.innerHTML = group(false);
      const one = g.scrollWidth || 1;
      const reps = Math.max(1, Math.ceil(bar.clientWidth / one));
      if (reps > 1) g.innerHTML = group(false) + Array(reps - 1).fill(`<span class="mq-rep" aria-hidden="true">${group(true)}</span>`).join('');
      const copy = g.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
      track.appendChild(copy);
      track.style.setProperty('--mq-dur', (g.scrollWidth / (SPEED[m.speed] || SPEED.normal)).toFixed(1) + 's');
      bar.classList.add('is-moving');
    }
    build();
    let w = window.innerWidth;
    window.addEventListener('resize', () => { if (window.innerWidth !== w) { w = window.innerWidth; build(); } });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);

    btn.addEventListener('click', () => {
      const paused = bar.classList.toggle('is-paused');
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? 'Play announcements' : 'Pause announcements');
    });
  }

  /* ---- Popup ---- */
  function popup(p) {
    if (!p || !p.enabled || !window.bootstrap) return;
    if (p.pages === 'home' && !isHome) return;
    const key = 'hiuk_popup_seen';
    const id = String(p.id || '1');
    const local = store('localStorage'), session = store('sessionStorage');
    if (p.frequency === 'once' && local.get(key) === id) return;
    if (p.frequency === 'session' && session.get(key) === id) return;

    const title = String(p.title || '').trim();
    const btn = p.button && p.button.text && safeLink(p.button.link) ? p.button : null;
    const dlg = document.createElement('div');
    dlg.className = 'modal fade ck-modal ev-modal nt-modal';
    dlg.tabIndex = -1;
    dlg.setAttribute(title ? 'aria-labelledby' : 'aria-label', title ? 'ntDlgTitle' : 'Announcement');
    const close = '<button class="ck-x" type="button" data-bs-dismiss="modal" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
    // body_html comes from the admin panel's rich text editor, already cleaned by the API (allowlisted tags, attributes and URLs)
    dlg.innerHTML = `<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"><div class="modal-content ck-dialog">
      ${p.image ? `<div class="nt-img"><img src="${esc(p.image)}" alt="">${title ? '' : close}</div>` : ''}
      ${title || !p.image ? `<div class="ck-head">${title ? `<h2 id="ntDlgTitle">${esc(title)}</h2>` : '<span></span>'}${close}</div>` : ''}
      ${p.body_html ? `<div class="ev-modal-body"><div class="ev-rich">${p.body_html}</div></div>` : ''}
      ${btn ? `<div class="ck-foot"><a class="btn site-btn btn-em" href="${esc(href(btn.link.trim()))}"${external(btn.link) ? ' target="_blank" rel="noopener"' : ''}>${esc(btn.text)}</a></div>` : '<div class="nt-end"></div>'}
    </div></div>`;
    document.body.appendChild(dlg);
    arWrapNodes(dlg.querySelector('.modal-content'));
    // links to sections of this page close the popup first
    dlg.addEventListener('click', (e) => { if (e.target.closest('a[href^="#"]')) bootstrap.Modal.getOrCreateInstance(dlg).hide(); });

    let tries = 0;
    function show() {
      // wait until the visitor has answered the cookie notice (it is removed then)
      if (document.querySelector('.ck-banner')) { setTimeout(show, 1000); return; }
      // and while another popup (cookie settings, an event, the menu) is open
      if (document.querySelector('.modal.show, .offcanvas.show') && tries++ < 20) { setTimeout(show, 1500); return; }
      if (p.frequency === 'once') local.set(key, id);
      if (p.frequency === 'session') session.set(key, id);
      bootstrap.Modal.getOrCreateInstance(dlg).show();
    }
    setTimeout(show, Math.max(0, Math.min(30, Number(p.delay) || 0)) * 1000);
  }

  fetch(API, { headers: { Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then((d) => {
      if (!d || !d.success) return;
      marquee(d.marquee);
      popup(d.popup);
    })
    .catch(() => {}); // no notices
})();
