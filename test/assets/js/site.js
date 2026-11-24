/* Stepney Shah Jalal Mosque: site settings (prayer times, donations) and page behaviour. Events and FAQs come from the admin panel. */
/* =================================================================
   ADMIN SETTINGS
   Everything the mosque team normally updates lives in this block.
   Times are 24-hour "HH:MM". Dates are "YYYY-MM-DD".
   ================================================================= */
const SITE = {
  city: 'London',

  /* FAQs are managed in the admin panel (FAQs) and loaded from the API. */

  // Photos (optional). Paste an image address to replace an illustration.
  images: { hero: 'assets/images/dome.jpg' },

  // Prayer and Jumu'ah times come from the yearly timetable (prayer-times.js; its address is in config.js).
  // The current appeal is managed in the admin panel (Home Page > Appeal; banner.js).

  announcements: [
    { tag: "Jumu'ah", tone: 'sun', date: '2026-09-24', featured: true, title: "Second Jumu'ah congregation moves to 2:00 pm", text: 'From this Friday the second khutbah begins at 2:00 pm to ease parking and overflow in the main hall. The sisters’ hall remains open for both congregations.' },
    { tag: 'Eid', tone: 'sun', date: '2026-09-22', title: 'Eid prayer arrangements for 1448', text: 'Three congregations will be held in the main hall and the park. Times are confirmed after the moon sighting.' },
    { tag: 'Janazah', tone: 'grey', date: '2026-09-21', title: 'Janazah notice: [Name of the deceased]', text: 'Inna lillahi wa inna ilayhi raji’un. The Janazah prayer will be held after Dhuhr on [date].' },
    { tag: 'Madrasa', tone: '', date: '2026-09-20', title: 'Evening madrasa enrolment now open', text: 'Places for ages 5–14 for the new term. Register online or at reception after Maghrib.' },
    { tag: 'Building', tone: 'rose', date: '2026-09-18', title: 'Wudu area refurbishment: phase two', text: "The brothers’ wudu area closes for two weeks. Temporary facilities are by the east entrance." },
    { tag: 'Community', tone: '', date: '2026-09-15', title: 'Volunteers needed for the food bank', text: 'Help pack and deliver parcels on Saturday mornings. Sign up at the office.' }
  ]

  // Events are managed in the admin panel (Posts); the API address is set in events.js.
};
/* ======================= end of admin settings ======================= */

(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const toMin = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
  const fmt12 = (hm) => { if (!hm) return '—'; const [h, m] = hm.split(':').map(Number); return (h % 12 || 12) + ':' + pad(m) + ' ' + (h >= 12 ? 'pm' : 'am'); };
  const gbp = (n) => '£' + Number(n).toLocaleString('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: n % 1 ? 2 : 0 });
  // Hijri date from the Hijri calendar API (hijri.js); style 'long', 'medium', 'short', 'day' or 'ar'
  const hijri = (d, style) => window.HIUKHijri ? HIUKHijri.format(d, style) : '';
  const hijriReady = window.HIUKHijri ? HIUKHijri.ready() : Promise.resolve();
  const setText = (sel, v) => $$(sel).forEach((el) => { el.textContent = v; });

  /* The geometric background pattern (--pat) is set in theme.css */

  /* Favicons are set in each page's <head> (favicon.ico and assets/images/icons/) */

  /* ---------- Optional hero photo ---------- */
  if (SITE.images.heroBg) { $('#heroBg').style.backgroundImage = `url("${SITE.images.heroBg}")`; }
  if (SITE.images.hero) {
    const ph = $('#heroPhoto');
    ph.innerHTML = `<img src="${esc(SITE.images.hero)}" alt="The green dome and minarets of the mosque at sunset" style="object-position:50% 62%">`;
    ph.hidden = false; const art = $('.arch-art'); if (art) art.style.visibility = 'hidden';
  }

  /* ---------- Prayer times (from the yearly timetable, prayer-times.js) ---------- */
  // the day's prayers, or null until the timetable has loaded. On Fridays Dhuhr is Jumu'ah, with two Jama'ahs.
  const timesFor = (date) => window.HIUKTimes ? HIUKTimes.forDate(date) : null;
  // Jama'ah time(s) of a prayer: "1:00 pm", or "1:00 pm · 1:45 pm" for the two Jumu'ah Jama'ahs
  const jamaahText = (p, sep) => [p.jamaah, p.jamaah2].filter(Boolean).map(fmt12).join(sep || ' · ');
  // the same for the prayer list: one span per time (shown on one line with " · ", or one per line on phones)
  const jamaahHtml = (p) => [p.jamaah, p.jamaah2].filter(Boolean).map((t) => `<span class="jt">${fmt12(t)}</span>`).join('');

  function nextFriday(d) { const x = new Date(d); const add = (5 - x.getDay() + 7) % 7; x.setDate(x.getDate() + add); return x; }

  // Static date content
  const now0 = new Date();
  const longDate = now0.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('#uDate').textContent = longDate;
  $('#sDate').textContent = longDate;
  $('#pDate').textContent = now0.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  // Today's Hijri date. The Islamic day begins at Maghrib, so from Maghrib until midnight it is
  // already the next day's Hijri date (Maghrib time from the timetable, once it has loaded).
  function hijriDay(now) {
    const maghrib = (timesFor(now) || []).find((p) => p.key === 'Maghrib');
    if (!maghrib || now.getHours() * 60 + now.getMinutes() < toMin(maghrib.begins)) return now;
    const next = new Date(now); next.setDate(next.getDate() + 1);
    return next;
  }
  let hijriShown = '';
  function showHijri(now) {
    const d = hijriDay(now);
    const text = hijri(d, 'long');
    if (text === hijriShown) return;
    hijriShown = text;
    $('#uHijri').textContent = text;
    $('#sHijri').textContent = text;
    $('#sHijriAr').textContent = hijri(d, 'ar');
    $('#pHijri').textContent = hijri(d, 'medium');
  }
  hijriReady.then(() => showHijri(new Date()));
  const fri = nextFriday(now0);
  $('#sFri').textContent = now0.getDay() === 5 ? 'Today' : fri.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  $('#sJum').textContent = '…';
  $('#year').textContent = now0.getFullYear();

  // Sun-path arc
  const NS = 'http://www.w3.org/2000/svg';
  // Two layouts: the wide one for tablets and desktops, and a compact one for phones, drawn in a
  // smaller space so the names and times stay readable when the arc is shrunk to a phone's width.
  const ARC_NARROW = window.matchMedia('(max-width: 759.98px)');
  const ARC_LAYOUT = {
    wide: { w: 1000, h: 270, x0: 70, xw: 860, base: 202, amp: 168, axis: [24, 976], fName: 17, fTime: 15, dy1: 34, dy2: 55, rNext: 9, rDot: 6.5, rSun: 5, pulse: 16, sun: 11, glow: 30, night: [46, 954, 160], fNight: 14, track: 2, prog: 3 },
    compact: { w: 600, h: 376, x0: 52, xw: 496, base: 286, amp: 186, axis: [14, 586], fName: 22, fTime: 19, dy1: 36, dy2: 64, rNext: 11, rDot: 8, rSun: 6.5, pulse: 20, sun: 13, glow: 34, night: [40, 560, 236], fNight: 18, track: 2.5, prog: 4 }
  };
  function renderArc(list, nowMin, nextName) {
    const svg = $('#arc');
    const L = ARC_NARROW.matches ? ARC_LAYOUT.compact : ARC_LAYOUT.wide;
    svg.setAttribute('viewBox', `0 0 ${L.w} ${L.h}`);
    const f = toMin(list[0].begins), e = toMin(list[list.length - 1].begins);
    const tOf = (m) => (m - f) / (e - f);
    const P = (t) => [L.x0 + L.xw * t, L.base - L.amp * Math.sin(Math.PI * t)];
    const pathTo = (t1) => { let d = ''; const n = 90; for (let i = 0; i <= n; i++) { const t = t1 * i / n; const [x, y] = P(t); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } return d; };
    const tn = tOf(nowMin);
    const tc = Math.max(0, Math.min(1, tn));
    const font = 'font-family="Manrope, system-ui, sans-serif"';
    const defs = `<defs><linearGradient id="arcG" x1="0" x2="1"><stop offset="0" stop-color="#467C12"/><stop offset="1" stop-color="#A8D56A"/></linearGradient>
      <radialGradient id="sunG"><stop offset="0" stop-color="#FFC27A"/><stop offset="1" stop-color="#FFC27A" stop-opacity="0"/></radialGradient></defs>`;
    // h: the arc, dots, names, times and moon (the drawing is fitted to these); under/over: the pulse
    // ring and the moving sun, which may reach a little past the fitted area
    let under = '', over = '';
    let h = `<line class="arc-axis" x1="${L.axis[0]}" y1="${L.base}" x2="${L.axis[1]}" y2="${L.base}" stroke="#E2D8CC" stroke-width="1.5"/>
      <path class="arc-track" d="${pathTo(1)}" fill="none" stroke="#DAD0C6" stroke-width="${L.track}" stroke-dasharray="2 7" stroke-linecap="round"/>`;
    if (tc > 0) h += `<path d="${pathTo(tc)}" fill="none" stroke="url(#arcG)" stroke-width="${L.prog}" stroke-linecap="round"/>`;
    const pts = list.map((p) => P(tOf(toMin(p.begins))));
    list.forEach((p, i) => {
      const [x, y] = pts[i];
      const isNext = p.name === nextName, past = toMin(p.begins) <= nowMin && tn <= 1.02;
      const sun = p.name === 'Sunrise';
      // compact layout: if the next point is close and lower (e.g. Maghrib before Isha), put this
      // point's name and time above its dot so they don't run into the neighbour's
      const nxt = pts[i + 1];
      const above = L === ARC_LAYOUT.compact && nxt && nxt[0] - x < 110 && nxt[1] > y;
      const yName = above ? y - L.dy2 + 8 : y + L.dy1, yTime = above ? y - 18 : y + L.dy2;
      if (isNext) under += `<circle class="pulse" cx="${x}" cy="${y}" r="${L.pulse}" fill="#1F6B3F" opacity=".35"/>`;
      // class names let the dark theme recolour these in CSS
      h += `<circle class="${isNext || past ? '' : 'arc-dot-up'}" cx="${x}" cy="${y}" r="${isNext ? L.rNext : sun ? L.rSun : L.rDot}" fill="${isNext ? '#1F6B3F' : past ? '#8CC63E' : '#FFFFFF'}" stroke="${isNext ? '#8CC63E' : past ? '#8CC63E' : '#1F6B3F'}" stroke-width="${isNext ? 3 : 2}"/>`;
      h += `<text class="${isNext ? 'arc-next' : sun ? 'arc-dim' : 'arc-name'}" x="${x}" y="${yName}" text-anchor="middle" ${font} font-size="${L.fName}" font-weight="${isNext ? 700 : 600}" fill="${isNext ? '#1F6B3F' : sun ? '#737D78' : '#121A16'}">${esc(p.name)}</text>`;
      h += `<text class="arc-time" x="${x}" y="${yTime}" text-anchor="middle" ${font} font-size="${L.fTime}" fill="#5A6660">${fmt12(p.begins)}</text>`;
    });
    if (tn >= 0 && tn <= 1) {
      const [sx, sy] = P(tn);
      over += `<circle cx="${sx}" cy="${sy}" r="${L.glow}" fill="url(#sunG)"/><circle cx="${sx}" cy="${sy}" r="${L.sun}" fill="#F8A83C" stroke="#fff" stroke-width="3"/>`;
    } else {
      const x = tn < 0 ? L.night[0] : L.night[1], ny = L.night[2];
      h += `<g transform="translate(${x} ${ny})"><circle r="13" fill="#3052A4"/><circle class="arc-moon-cut" cx="5" cy="-4" r="11" fill="#F7F9FA"/></g><text class="arc-dim" x="${x}" y="${ny - 20}" text-anchor="middle" ${font} font-size="${L.fNight}" fill="#737D78">Night</text>`;
    }
    svg.innerHTML = `${defs}<g>${under}</g><g class="arc-body">${h}</g><g>${over}</g>`;
    // keep only a small margin around the drawing: no empty space above a low arc (e.g. in winter).
    // (Can't be measured while the Today tab is hidden; it is redrawn when the tab is shown again.)
    let box = null;
    try { box = svg.querySelector('.arc-body').getBBox(); } catch (err) { box = null; }
    if (box && box.height > 0) {
      const pad = 10;
      svg.setAttribute('viewBox', `0 ${(box.y - pad).toFixed(1)} ${L.w} ${(box.height + pad * 2).toFixed(1)}`);
    }
  }

  // the prayer whose time it is now, shown green until its time ends: Fajr until sunrise, Dhuhr until Asr, Asr until
  // Maghrib, Maghrib until Isha, Isha all night until Fajr (after midnight too); '' from sunrise to Dhuhr
  function waqtNow(list, nowMin) {
    if (list.length && nowMin < toMin(list[0].begins)) return 'Isha'; // before Fajr: still last night's Isha
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      if (p.key === 'Sunrise' || toMin(p.begins) > nowMin) continue;
      if (!list[i + 1] || nowMin < toMin(list[i + 1].begins)) return p.key; // Isha: until tomorrow's Fajr
    }
    return '';
  }

  function renderRows(list, nowMin, nextName, nowDate) {
    let h = `<li class="hdr" aria-hidden="true"><span>Prayer</span><span>Begins</span><span>Jama'ah</span><span></span></li>`;
    const cur = waqtNow(list, nowMin);
    list.forEach((p) => {
      const m = toMin(p.begins), isNow = p.key === cur, isNext = p.name === nextName, past = m <= nowMin && !isNow && !isNext;
      const mins = isNext ? Math.max(1, Math.ceil((m - nowMin + 1440) % 1440)) : 0;
      const inTxt = mins >= 60 ? Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm' : mins + 'm';
      const status = isNow ? '<span>Now</span>' : isNext ? `<span class="chip chip-sun r-blink">Next · ${inTxt}</span>` : past ? '<span>Passed</span>' : p.name === 'Sunrise' ? '<span>No prayer</span>' : '';
      // on phones the status column is hidden: a "Next" badge by the time instead
      h += `<li class="${isNow ? 'now' : isNext ? 'next' : past ? 'past' : ''}"${isNow ? ' aria-current="time"' : ''}>
        <span class="r-name"><b>${esc(p.name)}</b><span lang="ar">${esc(p.ar)}</span></span>
        <span class="r-t"><time datetime="${p.begins}">${fmt12(p.begins)}</time>${isNext ? '<em class="r-next r-blink">Next</em>' : ''}</span>
        <span class="r-t${p.jamaah ? '' : ' dim'}">${p.jamaah ? jamaahHtml(p) : '—'}</span>
        <span class="r-s">${status}</span></li>`;
    });
    // on other days, a reminder of this week's Jumu'ah: that Friday's Dhuhr begins time and its two Jama'ahs
    const fri = nowDate.getDay() !== 5 ? (timesFor(nextFriday(nowDate)) || []).find((p) => p.key === 'Dhuhr') : null;
    if (fri) {
      h += `<li class="jrow"><span class="r-name"><b>Jumu'ah</b><span lang="ar">الجمعة</span></span>` +
        `<span class="r-t"><time datetime="${fri.begins}">${fmt12(fri.begins)}</time></span>` +
        `<span class="r-t${fri.jamaah ? '' : ' dim'}">${fri.jamaah ? jamaahHtml(fri) : '—'}</span>` +
        `<span class="r-s"><span class="chip chip-soft">Fridays</span></span></li>`;
    }
    $('#rows').innerHTML = h;
  }

  function renderWeek() {
    let h = '';
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const t = timesFor(d);
      if (!t) continue;
      h += `<tr${i === 0 ? ' class="today"' : ''}><th scope="row">${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}<small>${hijri(d, 'short')}</small></th>` +
        // data-label: the prayer name, shown above each time when the table becomes cards on phones
        t.map((p) => `<td data-label="${esc(p.name)}">${fmt12(p.begins)}${p.jamaah ? '<small>' + jamaahText(p) + '</small>' : ''}</td>`).join('') + '</tr>';
    }
    $('#week').innerHTML = h;
  }

  // shown in place of the times if the timetable can't be loaded
  function timesUnavailable() {
    const msg = 'Prayer times could not be loaded right now. Please refresh the page, or call us on 020 7265 8603.';
    $('#rows').innerHTML = `<li class="rows-msg">${esc(msg)}</li>`;
    $('#week').innerHTML = `<tr><td colspan="7" class="rows-msg">${esc(msg)}</td></tr>`;
    $('#arc').innerHTML = '';
    setText('.js-next-name', '—'); setText('.js-next-ar', ''); setText('.js-next-time', ''); setText('.js-next-jam', ''); setText('.js-count', '--:--:--');
    $('#sJum').textContent = '—';
  }

  let lastKey = '';
  function tick() {
    const d = new Date();
    const nowMin = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
    const list = timesFor(d);
    if (!list) return; // timetable not loaded yet
    showHijri(d); // moves on to the next Hijri date at Maghrib
    const prayersOnly = list.filter((p) => p.name !== 'Sunrise');
    let nx = prayersOnly.find((p) => toMin(p.begins) > nowMin);
    let target, prevMin;
    if (nx) {
      target = new Date(d); const [h, m] = nx.begins.split(':').map(Number); target.setHours(h, m, 0, 0);
      const idx = prayersOnly.indexOf(nx);
      prevMin = idx > 0 ? toMin(prayersOnly[idx - 1].begins) : toMin(prayersOnly[prayersOnly.length - 1].begins) - 1440;
    } else {
      const tm = new Date(d); tm.setDate(tm.getDate() + 1);
      nx = timesFor(tm).find((p) => p.name !== 'Sunrise');
      target = new Date(tm); const [h, m] = nx.begins.split(':').map(Number); target.setHours(h, m, 0, 0);
      prevMin = toMin(prayersOnly[prayersOnly.length - 1].begins);
    }
    const secs = Math.max(0, Math.floor((target - d) / 1000));
    const cd = pad(Math.floor(secs / 3600)) + ':' + pad(Math.floor(secs % 3600 / 60)) + ':' + pad(secs % 60);
    setText('.js-count', cd);
    const hh = Math.floor(secs / 3600), mm = Math.floor(secs % 3600 / 60);
    setText('.js-count-short', hh ? hh + 'h ' + pad(mm) + 'm' : mm + 'm ' + pad(secs % 60) + 's');
    const nextMinAbs = nowMin + secs / 60;
    const span = nextMinAbs - prevMin;
    const pct = span > 0 ? Math.min(100, Math.max(0, (nowMin - prevMin) / span * 100)) : 0;
    $$('.js-bar').forEach((el) => { el.style.width = pct.toFixed(2) + '%'; });

    const key = nx.name + '|' + d.getHours() + ':' + d.getMinutes();
    if (key !== lastKey) {
      lastKey = key;
      setText('.js-next-name', nx.name);
      setText('.js-next-ar', nx.ar);
      setText('.js-next-time', fmt12(nx.begins));
      setText('.js-next-jam', nx.jamaah ? "Jama'ah " + jamaahText(nx, ' & ') : '');
      renderArc(list, nowMin, nx.name);
      renderRows(list, nowMin, nx.name, d);
    }
  }
  if (window.HIUKTimes) {
    // the weekly table shows Hijri dates too, so wait for both (the Hijri calendar never fails: it falls back to a calculation)
    Promise.all([HIUKTimes.ready, hijriReady]).then(() => {
      renderWeek();
      // footer "Today" times and this week's Jumu'ah in the day strip
      timesFor(now0).forEach((p) => { $$(`[data-pt="${p.key}"]`).forEach((el) => { el.textContent = fmt12(p.begins); }); });
      $('#sJum').textContent = HIUKTimes.jumuah(now0).map(fmt12).join(' & ') || '—';
      tick();
      setInterval(tick, 1000);
    }, timesUnavailable);
  } else timesUnavailable();
  // phone <-> tablet width (e.g. rotating a phone): redraw the arc in the matching layout on the next tick
  const redrawArc = () => { lastKey = ''; };
  if (ARC_NARROW.addEventListener) ARC_NARROW.addEventListener('change', redrawArc); else if (ARC_NARROW.addListener) ARC_NARROW.addListener(redrawArc);

  // Tabs (Bootstrap pills)
  $$('#tab-today, #tab-week').forEach((t) => t.addEventListener('shown.bs.tab', () => { t.tabIndex = 0; $$('#tab-today, #tab-week').forEach((o) => { if (o !== t) o.tabIndex = -1; }); lastKey = ''; }));

  /* ---------- Events (cards and dialog live in events.js) ---------- */
  HIUKEvents.mount($('#events-grid'), { query: 'upcoming=1', limit: 5 });

  /* Donations are handled by the Sign Soft donation app (see donation.js and the .donation-root element) */

  /* ---------- Header: transparent over hero, solid after ---------- */
  const header = $('#siteHeader'), hero = $('#top');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const limit = hero.offsetTop + hero.offsetHeight - 140;
    header.classList.toggle('solid', window.scrollY > Math.max(40, limit * 0.55));
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  const links = $$('.site-nav .site-nav-link');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => { if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.map((a) => $(a.getAttribute('href'))).filter(Boolean).forEach((s) => io.observe(s));
  }

  /* ---------- FAQs (managed in the admin panel; answers may contain simple HTML, cleaned by the API) ---------- */
  (function () {
    const list = $('#faqList'); if (!list) return;
    list.innerHTML = '<p class="empty">Loading questions…</p>';
    list.addEventListener('show.bs.collapse', (e) => e.target.closest('.faq-item').classList.add('open'));
    list.addEventListener('hide.bs.collapse', (e) => e.target.closest('.faq-item').classList.remove('open'));
    fetch(HIUKEvents.apiBase + '/faqs', { headers: { Accept: 'application/json' } })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((data) => render((data && data.faqs) || []))
      .catch(() => { list.innerHTML = '<p class="empty">Questions could not be loaded right now. Please <a href="contact">contact us</a> and we will be glad to help.</p>'; });

    function render(faqs) {
    if (!faqs.length) { list.innerHTML = '<p class="empty">No questions have been added yet. Please <a href="contact">contact us</a> with yours.</p>'; return; }
    list.innerHTML = faqs.map((f, i) => `<div class="accordion-item faq-item${i === 0 ? ' open' : ''}"><div class="accordion-header faq-h" role="heading" aria-level="3"><button class="accordion-button faq-q${i === 0 ? '' : ' collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#faq-${i}" aria-expanded="${i === 0}" aria-controls="faq-${i}">${esc(f.q)}<span class="faq-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span></button></div><div id="faq-${i}" class="accordion-collapse collapse${i === 0 ? ' show' : ''}" data-bs-parent="#faqList"><div class="accordion-body faq-a"><p>${f.a}</p></div></div></div>`).join('');
    // Structured data for search engines
    const ld = document.createElement('script'); ld.type = 'application/ld+json';
    const plain = (h) => { const t = document.createElement('div'); t.innerHTML = h; return t.textContent; };
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })) });
    document.head.appendChild(ld);
    }
  })();

  /* ---------- Counters (final values visible at rest) ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        const el = en.target, n = +el.dataset.count, t0 = performance.now();
        const step = (t) => { const p = Math.min(1, (t - t0) / 1800), k = 1 - Math.pow(1 - p, 4); el.textContent = Math.round(n * k).toLocaleString('en-GB') + '+'; if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    }, { threshold: .6 });
    $$('[data-count]').forEach((el) => co.observe(el));
  }

  /* The contact form is on contact.php (contact.js) */

  /* Newsletter sign-up is handled by newsletter.js (shared by every page) */
})();
