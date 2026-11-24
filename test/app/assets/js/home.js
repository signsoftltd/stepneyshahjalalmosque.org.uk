/* Hefazothe Islam UK app: home screen. Today's dates, the next prayer with a countdown, the day's timetable
   (any day, with the arrows or a swipe) and this week's Jumu'ah. Updates every second and when the app
   comes back to the front. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const { esc, fmt12, toMin, at, addDays, sameDay, dateText, pad } = HIUK.util;
    const $ = (id) => document.getElementById(id);
    let shownDay = new Date(); // the day shown in the timetable
    let loaded = false;        // the prayer times have come: until then index.html's placeholders stay

    /* ---- Header dates (the Hijri date moves on at Maghrib) ---- */
    function renderDates(now) {
      $('dateG').textContent = dateText(now, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const h = HIUK.hijri.today(now);
      $('dateH').textContent = HIUK.hijri.format(h, 'long');
      $('dateAr').textContent = HIUK.hijri.format(h, 'ar');
    }

    /* ---- Next prayer and countdown ---- */
    let lastNextKey = '';
    function renderNext(now) {
      const nx = HIUK.times.next(now);
      if (!nx) {
        $('nextName').textContent = '—'; $('nextCount').textContent = '--:--:--';
        $('nextAr').textContent = $('nextBegins').textContent = $('nextJamaah').textContent = '';
        return;
      }
      const secs = Math.max(0, Math.floor((nx.at - now) / 1000));
      $('nextCount').textContent = pad(Math.floor(secs / 3600)) + ':' + pad(Math.floor(secs % 3600 / 60)) + ':' + pad(secs % 60);
      // progress from the previous prayer to the next
      const prev = previousPrayerTime(nx.at);
      const pct = prev ? Math.min(100, Math.max(0, (now - prev) / (nx.at - prev) * 100)) : 0;
      $('nextBar').style.width = pct.toFixed(1) + '%';
      const key = nx.prayer.key + nx.at.getTime();
      if (key === lastNextKey) return;
      lastNextKey = key;
      $('nextName').textContent = nx.prayer.name;
      $('nextAr').textContent = nx.prayer.ar;
      $('nextBegins').textContent = 'Begins ' + fmt12(nx.prayer.begins) + (sameDay(nx.at, now) ? '' : ' tomorrow');
      const jam = [nx.prayer.jamaah, nx.prayer.jamaah2].filter(Boolean).map(fmt12);
      $('nextJamaah').textContent = jam.length ? "Jama'ah " + jam.join(' & ') : '';
      renderDay(); // the "next" mark in the list moves on too
    }
    function previousPrayerTime(nextAt) {
      for (let back = 0; back < 2; back++) {
        const day = addDays(nextAt, -back);
        const list = (HIUK.times.forDate(day) || []).filter((p) => p.key !== 'Sunrise').map((p) => at(day, p.begins)).filter((t) => t < nextAt);
        if (list.length) return list[list.length - 1];
      }
      return null;
    }

    /* ---- The day's timetable ---- */
    // the prayer whose time it is now, shown green until its time ends: Fajr until sunrise, Dhuhr until Asr, Asr
    // until Maghrib, Maghrib until Isha, Isha all night until Fajr (after midnight too); '' from sunrise to Dhuhr
    function waqtNow(now) {
      const list = HIUK.times.forDate(now) || [];
      if (list.length && now < at(now, list[0].begins)) return 'Isha'; // before Fajr: still last night's Isha
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        if (p.key === 'Sunrise' || at(now, p.begins) > now) continue;
        if (!list[i + 1] || now < at(now, list[i + 1].begins)) return p.key; // Isha: until tomorrow's Fajr
      }
      return '';
    }
    function renderDay() {
      const now = new Date();
      const isToday = sameDay(shownDay, now);
      const list = HIUK.times.forDate(shownDay);
      $('dayTitle').textContent = isToday ? 'Today' : sameDay(shownDay, addDays(now, 1)) ? 'Tomorrow' : sameDay(shownDay, addDays(now, -1)) ? 'Yesterday' : dateText(shownDay, { weekday: 'long' });
      $('daySub').textContent = dateText(shownDay, { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + HIUK.hijri.format(shownDay, 'short');
      $('dayToday').hidden = isToday;
      if (!list) { $('ptList').innerHTML = '<li class="pt-empty">Prayer times are not available. Please connect to the internet and try again.</li>'; return; }
      const nx = isToday ? HIUK.times.next(now) : null;
      const cur = isToday ? waqtNow(now) : '';
      $('ptList').innerHTML = list.map((p) => {
        const t = at(shownDay, p.begins);
        const isNow = p.key === cur;
        // today: after Isha the next prayer is tomorrow's Fajr, marked on today's Fajr row
        const isNext = nx && nx.prayer.key === p.key && (isToday || sameDay(nx.at, shownDay));
        const past = isToday && t <= now && !isNow && !isNext;
        const cls = [isNow ? 'is-now' : '', isNext ? 'is-next' : '', past ? 'is-past' : '', p.key === 'Sunrise' ? 'is-sun' : ''].join(' ').trim();
        const jam = [p.jamaah, p.jamaah2].filter(Boolean).map((j) => `<span>${fmt12(j)}</span>`).join('') || '<span class="dim">—</span>';
        return `<li class="${cls}"${isNow ? ' aria-current="time"' : ''}>
          <span class="pt-name"><b>${esc(p.name)}</b><span lang="ar" dir="rtl">${esc(p.ar)}</span></span>
          <span class="pt-t"><time>${fmt12(p.begins)}</time>${isNext ? '<em>Next</em>' : ''}</span>
          <span class="pt-t pt-j">${jam}</span>
        </li>`;
      }).join('');
    }
    function go(days) { if (!loaded) return; shownDay = days === 0 ? new Date() : addDays(shownDay, days); renderDay(); }
    $('dayPrev').addEventListener('click', () => go(-1));
    $('dayNext').addEventListener('click', () => go(1));
    $('dayToday').addEventListener('click', () => go(0));
    // swipe left / right on the timetable to change day
    (function () {
      const el = $('ptList');
      let x0 = null, y0 = null;
      el.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
      el.addEventListener('touchend', (e) => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
        x0 = null;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
      }, { passive: true });
    })();

    /* ---- Jumu'ah this week ---- */
    function renderJumuah(now) {
      const j = HIUK.times.jumuah(now);
      if (!j) { $('jumDate').textContent = ''; $('jumTimes').innerHTML = ''; return; }
      $('jumDate').textContent = sameDay(j.date, now) ? 'Today' : dateText(j.date, { weekday: 'long', day: 'numeric', month: 'long' });
      const rows = [['Begins', j.begins]].concat(j.times.map((t, i) => [(i ? '2nd' : '1st') + " Jama'ah", t]));
      $('jumTimes').innerHTML = rows.map(([label, t]) => `<div><dt>${label}</dt><dd class="tnum">${fmt12(t)}</dd></div>`).join('');
    }

    /* ---- A note only when the times may be out of date (offline on first use, or nothing loaded) ---- */
    function renderStatus() {
      const s = HIUK.times.source;
      const text = s === 'builtin' ? 'Offline: showing the timetable built into the app. Connect to the internet to update.'
        : s === 'none' ? 'Prayer times could not be loaded. Please connect to the internet.' : '';
      $('status').textContent = text;
      $('status').hidden = !text;
    }

    /* ---- Start, then update every second ---- */
    let today = '', lastWaqt = '';
    function tick() {
      if (!loaded) return; // still the placeholders
      const now = new Date();
      if (now.toDateString() !== today) { // new day (or first run)
        if (today && sameDay(shownDay, addDays(now, -1))) shownDay = now; // keep following "today" past midnight
        today = now.toDateString();
        renderDay(); renderJumuah(now);
      }
      const w = waqtNow(now);
      if (w !== lastWaqt) { lastWaqt = w; renderDay(); } // a prayer's time began or ended
      renderDates(now);
      renderNext(now);
    }
    Promise.all([HIUK.times.ready, HIUK.hijri.ready()]).then(() => {
      loaded = true;
      renderStatus();
      tick();
      v.every(tick, 1000);
    });
    // pulled down to refresh (pull.js): draw everything again with the new times
    v.on(document, 'hiuk:times', () => { today = ''; lastNextKey = ''; renderStatus(); tick(); });
    // back in front (e.g. after the phone was locked): update now, and fetch new times if the saved ones are old
    v.on(document, 'visibilitychange', () => {
      if (document.hidden) return;
      tick();
      const cfg = window.HIUK_CONFIG || {};
      if (HIUK.times.source !== 'live' && (!HIUK.times.savedAt || Date.now() - HIUK.times.savedAt > (cfg.timetableMaxAge || 0))) {
        HIUK.times.refresh().then(() => { today = ''; renderStatus(); tick(); }).catch(() => {});
      }
    });
  });
})();
