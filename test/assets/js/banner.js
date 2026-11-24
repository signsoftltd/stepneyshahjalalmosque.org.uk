/* Stepney Shah Jalal Mosque: home page banner (hero) text, buttons and pictures from the admin panel (Banner),
   and the "About the mosque" section's picture and text (Home Page > About Section).
   The banner in index.php is the built-in default; this replaces it once the settings load,
   and leaves it as it is if they can't be loaded. */
(function () {
  'use strict';
  const hero = document.getElementById('top');
  if (!hero) return;

  const API = (window.HIUK_API || 'https://manage.stepneyshahjalalmosque.org.uk/api/public') + '/banner';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (key) => hero.querySelector(`[data-banner="${key}"]`);
  // same rule as the admin panel: pages, #sections, /paths, web addresses, mailto: and tel:
  const safeLink = (url) => /^(https?:\/\/[^\s<>"]+|mailto:[^\s<>"]+|tel:[+\d\s()-]+|#[\w-]+|\.?\/[^\s<>"]*|[\w-]+(\.html|\.php)?(#[\w-]+)?)$/i.test(String(url || '').trim());
  // links saved in the admin panel may use the old page.html form: use the clean address (zakat.html -> zakat, index.html#prayer -> ./#prayer)
  const cleanLink = (url) => String(url || '').trim().replace(/^index\.(html|php)(?=#|$)/i, './').replace(/^([\w-]+)\.(html|php)(?=#|$)/i, '$1');
  // tint kept over an uploaded background photo so the white text stays readable (as in theme.css)
  const TINT = 'linear-gradient(100deg,rgba(20,35,75,.92) 0,rgba(27,47,99,.72) 55%,rgba(27,47,99,.55) 100%)';

  function setText(key, value) {
    const node = el(key);
    if (!node || typeof value !== 'string') return;
    node.textContent = value;
    node.hidden = value.trim() === '';
  }

  function apply(b) {
    setText('kicker', b.kicker);
    if (el('bismillah')) el('bismillah').hidden = b.show_bismillah === false;

    // *highlighted* words become <em>, everything else is plain text
    if (typeof b.heading === 'string' && b.heading.trim()) {
      el('heading').innerHTML = b.heading.split('*').map((part, i) => (i % 2 ? `<em>${esc(part)}</em>` : esc(part))).join('');
    }
    setText('subtitle', b.subtitle);

    (b.buttons || []).forEach((btn, i) => {
      const a = el('btn' + (i + 1));
      if (!a || !btn) return;
      const show = typeof btn.text === 'string' && btn.text.trim() !== '' && safeLink(btn.link);
      a.hidden = !show;
      if (!show) return;
      a.querySelector('span').textContent = btn.text;
      a.setAttribute('href', cleanLink(btn.link));
      if (/^https?:\/\//i.test(btn.link)) { a.target = '_blank'; a.rel = 'noopener'; } else { a.removeAttribute('target'); a.removeAttribute('rel'); }
    });

    (b.facts || []).forEach((text, i) => {
      const f = el('fact' + (i + 1));
      if (!f || typeof text !== 'string') return;
      f.querySelector('span').textContent = text;
      f.hidden = text.trim() === '';
    });

    const images = b.images || {};
    if (images.photo) {
      const ph = document.getElementById('heroPhoto');
      if (ph) {
        ph.innerHTML = `<img src="${esc(images.photo)}" alt="" style="object-position:50% 50%">`;
        ph.hidden = false;
        const art = hero.querySelector('.arch-art');
        if (art) art.style.visibility = 'hidden';
      }
    }
    if (images.background) {
      const bg = document.getElementById('heroBg');
      if (bg) bg.style.backgroundImage = `${TINT},url("${encodeURI(images.background)}")`;
    }
    if (images.about) aboutPicture(images.about);
    if (b.about_section) aboutText(b.about_section);
    if (b.appeal) appeal(b.appeal);
  }

  // "Current appeal" (Home Page > Appeal): shown only when switched on in the admin panel
  function appeal(a) {
    const box = document.getElementById('appeal');
    if (!box || !a.enabled) return;
    const part = (key) => box.querySelector(`[data-appeal="${key}"]`);
    const gbp = (n) => '£' + Number(n || 0).toLocaleString('en-GB', { maximumFractionDigits: 0 });
    const raised = Math.max(0, Number(a.raised) || 0), goal = Math.max(0, Number(a.goal) || 0);
    const pct = goal > 0 ? Math.min(100, Math.floor(raised / goal * 100)) : 0;
    part('kicker').textContent = a.kicker || '';
    part('kicker').hidden = !a.kicker;
    part('title').innerHTML = String(a.title || '').split('*').map((s, i) => (i % 2 ? `<em>${esc(s)}</em>` : esc(s))).join('');
    part('text').textContent = a.text || '';
    part('text').hidden = !(a.text || '').trim();
    part('raised').textContent = gbp(raised);
    part('goal').textContent = gbp(goal);
    part('percent').textContent = pct + '%';
    const bar = box.querySelector('.appeal-bar');
    bar.setAttribute('aria-valuenow', String(pct));
    bar.setAttribute('aria-valuetext', `${gbp(raised)} raised of ${gbp(goal)} (${pct}%)`);
    bar.classList.toggle('is-short', pct < 14); // label after the fill while the fill is too short to hold it
    const btn = part('button');
    if (a.button && a.button.text && safeLink(a.button.link)) {
      btn.querySelector('span').textContent = a.button.text;
      btn.setAttribute('href', cleanLink(a.button.link));
      if (/^https?:\/\//i.test(a.button.link)) { btn.target = '_blank'; btn.rel = 'noopener'; } else { btn.removeAttribute('target'); btn.removeAttribute('rel'); }
      btn.hidden = false;
    } else btn.hidden = true;
    if (a.image) {
      box.querySelector('.appeal-bg').style.backgroundImage = `url("${encodeURI(a.image)}")`;
      box.querySelector('.appeal').classList.add('has-photo');
    }
    box.hidden = false;
    // fill the bar when it comes into view
    const fill = () => bar.style.setProperty('--pct', pct + '%');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { fill(); io.disconnect(); } }, { threshold: 0.3 });
      io.observe(bar);
    } else fill();
  }

  // "About the mosque" text (Home Page > About Section). Each part keeps its built-in text if it isn't sent.
  function aboutText(a) {
    const box = document.getElementById('about');
    if (!box) return;
    const part = (key) => box.querySelector(`[data-about="${key}"]`);
    const highlight = (text) => String(text).split('*').map((s, i) => (i % 2 ? `<em>${esc(s)}</em>` : esc(s))).join('');
    const show = (node, on) => { if (node) node.hidden = !on; };

    if (part('kicker') && typeof a.kicker === 'string') { part('kicker').textContent = a.kicker; show(part('kicker'), a.kicker.trim() !== ''); }
    if (part('heading') && typeof a.heading === 'string' && a.heading.trim()) part('heading').innerHTML = highlight(a.heading);
    // one <p> per paragraph, in place of the built-in one
    const body = part('body');
    if (body && Array.isArray(a.paragraphs)) {
      const ps = a.paragraphs.filter((t) => typeof t === 'string' && t.trim()).map((t) => {
        const p = document.createElement('p'); p.textContent = t; return p;
      });
      box.querySelectorAll('[data-about="body-extra"]').forEach((n) => n.remove());
      if (ps.length) {
        body.textContent = ps[0].textContent; body.hidden = false;
        let after = body;
        ps.slice(1).forEach((p) => { p.dataset.about = 'body-extra'; after.after(p); after = p; });
      } else body.hidden = true;
    }
    const quote = part('quote');
    if (quote && typeof a.quote === 'string') { quote.textContent = a.quote.trim() ? `“${a.quote.trim().replace(/^["“]|["”]$/g, '')}”` : ''; show(quote, a.quote.trim() !== ''); }
    // card on the picture
    const imam = part('imam');
    if (imam && 'imam' in a) {
      if (a.imam && a.imam.name) {
        // initials of the name (e.g. "Abdul Karim" -> AK); a "[placeholder]" keeps the built-in ones
        if (!/^\s*\[/.test(a.imam.name)) {
          const words = a.imam.name.replace(/[^\p{L}\s'’]/gu, ' ').trim().split(/\s+/).filter(Boolean);
          const initials = (words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] || '').slice(0, 2)).toUpperCase();
          imam.querySelector('.avatar').textContent = initials || '·';
        }
        imam.querySelector('b').textContent = a.imam.name;
        imam.querySelector('span').textContent = a.imam.role || '';
        show(imam, true);
      } else show(imam, false);
    }
    const values = part('values');
    if (values && Array.isArray(a.values)) {
      values.innerHTML = a.values.map((v) => `<div class="value col"><b>${esc(v.title)}</b><span>${esc(v.text || '')}</span></div>`).join('');
      show(values, a.values.length > 0);
    }
    const fac = part('facilities');
    if (fac && Array.isArray(a.facilities)) {
      const icon = (n) => (/^[a-z][a-z-]*$/.test(n || '') ? n : 'check');
      const head = typeof a.facilities_heading === 'string' && a.facilities_heading.trim() ? `<h4>${esc(a.facilities_heading)}</h4>` : '';
      fac.innerHTML = head + a.facilities.map((f) => `<span><svg class="ico"><use href="#i-${icon(f.icon)}"/></svg>${esc(f.text)}</span>`).join('');
      show(fac, a.facilities.length > 0);
    }
    const link = part('link');
    if (link && 'link' in a) {
      if (a.link && a.link.text && safeLink(a.link.link)) {
        link.querySelector('span').textContent = a.link.text;
        link.setAttribute('href', cleanLink(a.link.link));
        if (/^https?:\/\//i.test(a.link.link)) { link.target = '_blank'; link.rel = 'noopener'; } else { link.removeAttribute('target'); link.removeAttribute('rel'); }
        show(link, true);
      } else show(link, false);
    }
  }

  // "About the mosque": put the photo inside the existing pointed arch (same clip shape and outline)
  function aboutPicture(url) {
    const svg = document.querySelector('#about .about-visual svg');
    const arch = svg && svg.querySelector('g[clip-path="url(#aClip)"]');
    if (!arch) return;
    const NS = 'http://www.w3.org/2000/svg';
    const img = document.createElementNS(NS, 'image');
    img.setAttribute('href', url);
    img.setAttribute('x', '0');
    img.setAttribute('y', '0');
    img.setAttribute('width', '500');
    img.setAttribute('height', '620');
    img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    arch.replaceChildren(img); // replaces the drawn prayer hall; the arch outline outside this group stays
    svg.setAttribute('aria-label', 'Photo of the mosque');
  }

  fetch(API, { headers: { Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then((data) => { if (data && data.success) apply(data); })
    .catch(() => {}); // keep the built-in banner
})();
