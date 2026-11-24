/* Stepney Shah Jalal Mosque app: Makrooh times, when salah is makrooh (disliked). config.js makroohUrl gives the minutes:
   after sunrise begins (from sunrise), and before Dhuhr (zawal) and Maghrib (sunset) begin (until they begin).
   Saved on the phone.
   - a popup with a progress bar while a period is on: opens by itself (once per period), closes when it ends;
     opening the app during a period shows it again; outside makrooh times it opens only from the card
   - the home screen's "Makrooh times" card (#mkCard): today's three periods; tapping it opens the popup
   Needs data.js (HIUK.times). */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const CFG = window.HIUK_CONFIG || {};
    const { esc, pad, at, fmt12 } = HIUK.util;
    const $ = (id) => document.getElementById(id);
    const KEY = 'hiuk_app_makrooh', SEEN = 'hiuk_app_makrooh_seen';
    const PERIODS = [
      // key in the API, the prayer time, after: the period starts at that time (otherwise it ends at it), name, what it is
      { api: 'sunrise', prayer: 'Sunrise', after: true, name: 'Sunrise', what: 'while the sun is rising' },
      { api: 'zuhr', prayer: 'Dhuhr', after: false, name: 'Zawal', what: 'at zawal, before Dhuhr' },
      { api: 'sunset', prayer: 'Maghrib', after: false, name: 'Sunset', what: 'before sunset' }
    ];
    let mins = null;   // { sunrise: 15, zuhr: 10, sunset: 10 }

    // { sunrise: 15, zuhr: 0, sunset: 10 }; 0 (or left out) = no makrooh period shown for that time; all 0 = none at all
    function parse(d) {
      if (!d || typeof d !== 'object') throw new Error('Unexpected makrooh times');
      const out = {};
      PERIODS.forEach((p) => {
        const v = d[p.api], n = v === undefined || v === null || v === '' ? 0 : Number(v);
        if (!isFinite(n) || n < 0 || n > 120) throw new Error('Unexpected makrooh times');
        out[p.api] = Math.round(n);
      });
      return out;
    }
    function load(force) {
      const saved = HIUK.store.get(KEY);
      if (!force && saved && saved.data && Date.now() - saved.at < (CFG.makroohMaxAge || 0)) return Promise.resolve(saved.data);
      return fetch(CFG.makroohUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' })
        .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then((json) => { const d = parse(json); HIUK.store.set(KEY, { at: Date.now(), data: d }); return d; })
        .catch(() => (saved && saved.data) || null); // offline: the saved copy
    }

    // today's periods: [{ id, name, what, start, end }]
    function periods(day) {
      const list = HIUK.times.forDate(day) || [];
      return PERIODS.map((p) => {
        const t = list.find((x) => x.key === p.prayer);
        if (!t || !t.begins || !mins[p.api]) return null;
        const time = at(day, t.begins), span = mins[p.api] * 60000;
        const start = p.after ? time : new Date(time - span), end = p.after ? new Date(time.getTime() + span) : time;
        return { id: day.toDateString() + ' ' + p.api, name: p.name, what: p.what, start, end };
      }).filter(Boolean);
    }
    const hm = (d) => fmt12(pad(d.getHours()) + ':' + pad(d.getMinutes()));
    // "11:39 – 11:49 am" (am/pm once when both are the same)
    const range = (a, b) => { const x = hm(a), y = hm(b); return !HIUK.clock24() && x.slice(-2) === y.slice(-2) ? `${x.slice(0, -3)} – ${y}` : `${x} – ${y}`; };
    const left = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return (s >= 3600 ? pad(Math.floor(s / 3600)) + ':' : '') + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60); };
    const seen = () => { try { return sessionStorage.getItem(SEEN); } catch (e) { return null; } };
    const setSeen = (id) => { try { sessionStorage.setItem(SEEN, id); } catch (e) { /* not saved */ } };

    /* ---- the popup ---- */
    let pop = null, popFor = null, lastFocus = null;
    function openPopup(p) {
      if (!pop) {
        pop = document.createElement('div');
        pop.className = 'pop mk-pop';
        pop.hidden = true;
        pop.innerHTML = `<div class="pop-back" data-mk-close></div>
          <div class="pop-card" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="mkPopTitle">
            <div class="pop-body mk-body" id="mkPopBody"></div>
          </div>`;
        document.body.appendChild(v.own(pop));
        pop.addEventListener('click', (e) => { if (e.target.closest('[data-mk-close]')) closePopup(); });
        v.on(document, 'keydown', (e) => { if (e.key === 'Escape' && pop && !pop.hidden) closePopup(); });
      }
      popFor = p || null;
      lastFocus = document.activeElement;
      pop.hidden = false;
      fill(new Date());
      requestAnimationFrame(() => { pop.classList.add('is-open'); pop.querySelector('.pop-card').focus({ preventScroll: true }); });
    }
    function closePopup() {
      if (!pop || pop.hidden) return;
      pop.classList.remove('is-open');
      setTimeout(() => { pop.hidden = true; }, 250);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    // the popup's content: the period that is on (progress bar and countdown), or today's periods and the next one
    function fill(now) {
      if (!pop || pop.hidden) return;
      const today = periods(now), on = today.find((p) => now >= p.start && now < p.end);
      let html;
      if (on) {
        const part = Math.min(100, Math.max(0, (now - on.start) / (on.end - on.start) * 100));
        html = `<span class="mk-badge">${HIUK.icon('sun')}Makrooh time now</span>
          <h2 id="mkPopTitle">${esc(on.name)}</h2>
          <p class="mk-text">It is makrooh (disliked) to pray salah now, ${esc(on.what)}. Please wait until this time has passed.</p>
          <div class="mk-bar" role="progressbar" aria-label="Makrooh time passed" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(part)}"><i style="width:${part.toFixed(1)}%"></i></div>
          <div class="mk-ends"><span class="tnum">${hm(on.start)}</span><span class="tnum">${hm(on.end)}</span></div>
          <p class="mk-left">Ends in <b class="tnum">${left(on.end - now)}</b></p>`;
      } else {
        const next = today.find((p) => p.start > now) || periods(HIUK.util.addDays(now, 1))[0];
        html = `<span class="mk-badge is-calm">${HIUK.icon('check')}Not a makrooh time</span>
          <h2 id="mkPopTitle">Makrooh times today</h2>
          <ul class="mk-pop-list">${today.map((p) => `<li class="${now >= p.end ? 'is-past' : ''}"><b>${esc(p.name)}</b><span class="tnum">${range(p.start, p.end)}</span></li>`).join('')}</ul>
          ${next ? `<p class="mk-left">Next: ${esc(next.name)} in <b class="tnum">${left(next.start - now)}</b></p>` : ''}`;
      }
      const body = $('mkPopBody');
      if (body.innerHTML !== html) body.innerHTML = html;
    }

    /* ---- the home screen card ---- */
    function card(now) {
      const list = $('mkList');
      if (!list) return;
      const html = periods(now).map((p) => {
        const on = now >= p.start && now < p.end, past = now >= p.end;
        return `<li class="${on ? 'is-on' : past ? 'is-past' : ''}"><b>${esc(p.name)}</b><span class="tnum">${range(p.start, p.end)}</span>${on ? '<em>Now</em>' : ''}</li>`;
      }).join('');
      if (list.innerHTML !== html) list.innerHTML = html;
      $('mkCard').hidden = !html;
    }

    /* ---- every second ---- */
    // opens by itself only while a period is on: once per period each app launch (seen is kept for the launch only)
    let wasOn = null;
    function tick() {
      const now = new Date(), on = periods(now).find((p) => now >= p.start && now < p.end);
      card(now);
      if (on && seen() !== on.id && (!pop || pop.hidden) && !document.querySelector('.pop:not(.mk-pop):not([hidden]), .drawer.is-open')) {
        setSeen(on.id);
        openPopup(on);
      }
      if (wasOn && !on) {
        if (pop && !pop.hidden && popFor) { closePopup(); HIUK.toast('The makrooh time has ended'); }
      }
      wasOn = on ? on.id : null;
      fill(now);
    }

    let started = false;
    function use(d) {
      if (!d) return;   // never loaded and offline: nothing shown
      try { mins = parse(d); } catch (e) { return; }
      if (started) { tick(); return; }
      started = true;
      const c = $('mkCard');
      if (c) {
        c.addEventListener('click', () => openPopup(null));
        c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPopup(null); } });
      }
      tick();
      v.every(tick, 1000);
    }
    Promise.all([load(), HIUK.times.ready]).then(([d]) => use(d));
    // pulled down to refresh (pull.js)
    v.on(document, 'hiuk:times', () => { load(true).then((d) => { if (v.alive) use(d); }); });
    HIUK.makrooh = { open: () => mins && openPopup(null) };
  });
})();
