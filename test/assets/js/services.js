/* Hefazothe Islam UK: home page "How we can help" section from the admin panel (Home page > Services).
   The section in index.php is the built-in default; this replaces it once the settings load,
   and leaves it as it is if they can't be loaded. */
(function () {
  'use strict';
  const section = document.getElementById('services');
  if (!section) return;

  const API = (window.HIUK_API || 'https://admin.hefazotheislamuk.org/api/public') + '/services';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // same rule as the admin panel: pages, #sections, /paths, web addresses, mailto: and tel:
  const safeLink = (url) => /^(https?:\/\/[^\s<>"]+|mailto:[^\s<>"]+|tel:[+\d\s()-]+|#[\w-]+|\.?\/[^\s<>"]*|[\w-]+(\.html|\.php)?(#[\w-]+)?)$/i.test(String(url || '').trim());
  // links saved in the admin panel may use the old page.html form: use the clean address (zakat.html -> zakat, index.html#prayer -> ./#prayer)
  const cleanLink = (url) => String(url || '').trim().replace(/^index\.(html|php)(?=#|$)/i, './').replace(/^([\w-]+)\.(html|php)(?=#|$)/i, '$1');
  const ext = (url) => (/^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener"' : '');
  const icon = (name) => (/^[a-z-]+$/.test(name) ? name : 'mosque');
  const el = (key) => section.querySelector(`[data-svc="${key}"]`);
  const highlight = (text) => text.split('*').map((part, i) => (i % 2 ? `<em>${esc(part)}</em>` : esc(part))).join('');

  function apply(d) {
    if (typeof d.kicker === 'string') el('kicker').textContent = d.kicker;
    if (typeof d.heading === 'string' && d.heading.trim()) el('heading').innerHTML = highlight(d.heading);
    if (typeof d.lede === 'string') { el('lede').textContent = d.lede; el('lede').hidden = !d.lede.trim(); }

    (d.columns || []).forEach((col, i) => {
      const card = section.querySelector(`[data-svc-col="${i + 1}"]`);
      if (!card || !col) return;
      card.querySelector('.svc-head').innerHTML =
        (col.arabic ? `<span class="num" lang="ar">${esc(col.arabic)}</span>` : '') +
        `<h3>${esc(col.title || '')}</h3>` + (col.desc ? `<p>${esc(col.desc)}</p>` : '');
      const items = (col.items || []).filter((it) => it && it.title && safeLink(it.link));
      card.querySelector('ul').innerHTML = items.length
        ? items.map((it) => `<li><a href="${esc(cleanLink(it.link))}"${ext(it.link)}><span class="gem sm"><svg class="ico"><use href="#i-${icon(it.icon)}"/></svg></span><span><b>${esc(it.title)}</b>${it.subtitle ? `<span>${esc(it.subtitle)}</span>` : ''}</span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>`).join('')
        : '';
      card.closest('[class*="col-"]').hidden = !items.length && !col.title;
    });

    const help = d.help || {};
    if (typeof help.text === 'string') el('help-text').textContent = help.text;
    const btn = el('help-btn'), b = help.button || {};
    if (btn && typeof b.text === 'string') {
      const show = b.text.trim() !== '' && safeLink(b.link);
      btn.hidden = !show;
      if (show) {
        btn.querySelector('span').textContent = b.text;
        btn.setAttribute('href', cleanLink(b.link));
        if (/^https?:\/\//i.test(b.link)) { btn.target = '_blank'; btn.rel = 'noopener'; }
      }
    }
    el('help').hidden = !(help.text || '').trim() && btn && btn.hidden;
  }

  fetch(API, { headers: { Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then((data) => { if (data && data.success) apply(data); })
    .catch(() => {}); // keep the built-in section
})();
