/* Stepney Shah Jalal Mosque: About Us page content from the admin panel (About Us).
   about.php holds the built-in default; this replaces it once the content loads, and leaves
   it as it is if it can't be loaded. Contact details and facilities stay as written in the page. */
(function () {
  'use strict';
  const API = (window.HIUK_API || 'https://manage.stepneyshahjalalmosque.org.uk/api/public') + '/about';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const highlight = (t) => String(t).split('*').map((part, i) => (i % 2 ? `<em>${esc(part)}</em>` : esc(part))).join('');
  const safeLink = (url) => /^(https?:\/\/[^\s<>"]+|mailto:[^\s<>"]+|tel:[+\d\s()-]+|#[\w-]+|\.?\/[^\s<>"]*|[\w-]+(\.html|\.php)?(#[\w-]+)?)$/i.test(String(url || '').trim());
  // links saved in the admin panel may use the old page.html form: use the clean address (zakat.html -> zakat, index.html#prayer -> ./#prayer)
  const cleanLink = (url) => String(url || '').trim().replace(/^index\.(html|php)(?=#|$)/i, './').replace(/^([\w-]+)\.(html|php)(?=#|$)/i, '$1');
  const icon = (name) => (/^[a-z-]+$/.test(name || '') ? name : 'mosque');
  // placeholder text in [square brackets] keeps its "to do" look
  const todo = (t) => (/^\s*\[.*\]\s*$/s.test(t) ? ' class="ab-todo"' : '');
  const GEMS = ['', 'ind', 'grn', 'sun'];
  const one = (sel) => document.querySelector(sel);

  const RENDER = {
    milestones: (it, i, all) => `<li><span class="ab-year">${esc(it.label)}</span><div><h3>${esc(it.title)}</h3>${it.body ? `<p${todo(it.body)}>${esc(it.body)}</p>` : ''}</div></li>`,
    values: (it, i) => `<div class="ab-value"><span class="gem ${GEMS[i % 4]}"><svg class="ico"><use href="#i-${icon(it.icon)}"/></svg></span><b>${esc(it.title)}</b>${it.body ? `<span>${esc(it.body)}</span>` : ''}</div>`,
    cards: (it, i) => {
      const link = it.label && safeLink(it.link) ? `<a class="link-arrow" href="${esc(cleanLink(it.link))}"${/^https?:/i.test(it.link) ? ' target="_blank" rel="noopener"' : ''}>${esc(it.label)}<svg class="ico"><use href="#i-arrow"/></svg></a>` : '';
      return `<div class="ab-card"><span class="gem sm ${GEMS[i % 4]}"><svg class="ico"><use href="#i-${icon(it.icon)}"/></svg></span><h3>${esc(it.title)}</h3>${it.body ? `<p${todo(it.body)}>${esc(it.body)}</p>` : ''}${link}</div>`;
    }
  };

  function apply(d) {
    const t = d.text || {};
    document.querySelectorAll('[data-ab]').forEach((el) => {
      const key = el.dataset.ab;
      if (key === 'photo') return;
      const v = t[key];
      if (typeof v !== 'string') return;
      if (key === 'story_html') el.innerHTML = v; // already cleaned by the admin panel's HTML filter
      else if (/_heading$/.test(key)) { if (v.trim()) el.innerHTML = highlight(v); }
      else el.textContent = v;
      el.hidden = !v.trim();
    });

    if (d.photo) {
      const img = one('[data-ab="photo"]');
      if (img) { img.src = d.photo; img.alt = 'Photo of the mosque'; img.style.objectPosition = '50% 50%'; }
    }

    Object.keys(RENDER).forEach((list) => {
      const box = one(`[data-ab-list="${list}"]`);
      if (!box || !Array.isArray(d[list])) return;
      const keep = [...box.querySelectorAll('[data-ab-keep]')];
      box.innerHTML = d[list].map(RENDER[list]).join('');
      keep.forEach((k) => box.appendChild(k));
      // hide the whole section when its list is empty (values share a section with the mission, so only the list)
      const hideEl = list === 'values' ? box : box.closest('section');
      if (hideEl && !d[list].length && !keep.length) hideEl.hidden = true;
    });
  }

  fetch(API, { headers: { Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then((data) => { if (data && data.success) apply(data); })
    .catch(() => {}); // keep the built-in page
})();
