/* Stepney Shah Jalal Mosque app: the whole year's prayer times (Time tab), month by month.
   Each day: date and Hijri day, then Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha (begins, with the Jama'ah below).
   Fridays show Jumu'ah. Today is highlighted and shown first; the month buttons jump to a month. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const { pad, toMin, sameDay, dateText } = HIUK.util;
    const $ = (id) => document.getElementById(id);
    const COLS = [['Fajr', 'Fajr'], ['Sunrise', 'Sunrise'], ['Dhuhr', 'Dhuhr'], ['Asr', 'Asr'], ['Maghrib', 'Maghrib'], ['Isha', 'Isha']];
    // "13:05" -> "1:05" (the column tells morning from evening; saves room on a phone), or "13:05" with the 24-hour clock
    const short = (hm) => { if (!hm) return '—'; const [h, m] = hm.split(':').map(Number); return (HIUK.clock24() ? pad(h) : h % 12 || 12) + ':' + pad(m); };
    const MONTHS = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1));

    function render() {
      const now = new Date();
      const year = now.getFullYear();
      const nx = HIUK.times.next(now);
      $('yearSub').textContent = year + ' · Stepney Shah Jalal Mosque, London';
      const mn = (h) => HIUK.hijri.monthName(h.month);

      $('months').innerHTML = MONTHS.map((d, i) => `<a class="month-chip" href="#m-${i}" data-month="${i}">${dateText(d, { month: 'short' })}</a>`).join('');

      let html = '';
      for (let m = 0; m < 12; m++) {
        const first = new Date(year, m, 1), last = new Date(year, m + 1, 0);
        const h1 = HIUK.hijri.get(first), h2 = HIUK.hijri.get(last);
        // the Islamic months this month spans, e.g. "Rabi-Al-Thani – Jumada-Al-Awwal 1448 AH"
        const hijriSpan = !h1 || !h2 ? ''
          : h1.month === h2.month && h1.year === h2.year ? `${mn(h1)} ${h1.year} AH`
          : h1.year === h2.year ? `${mn(h1)} – ${mn(h2)} ${h2.year} AH` : `${mn(h1)} ${h1.year} – ${mn(h2)} ${h2.year} AH`;
        let rows = '';
        for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
          const list = HIUK.times.forDate(d);
          if (!list) continue;
          const by = {}; list.forEach((p) => { by[p.key] = p; });
          const isToday = sameDay(d, now), fri = d.getDay() === 5;
          const nextKey = isToday && nx && sameDay(nx.at, d) ? nx.prayer.key : '';
          const h = HIUK.hijri.get(d);
          rows += `<tr class="${[isToday ? 'is-today' : '', fri ? 'is-fri' : ''].join(' ').trim()}"${isToday ? ' id="today" aria-current="date"' : ''}>
            <th scope="row"><b>${d.getDate()}</b><span>${dateText(d, { weekday: 'short' })}</span><small>${h ? h.day : ''}</small></th>
            ${COLS.map(([key]) => {
              const p = by[key];
              if (!p) return '<td>—</td>';
              const jam = [p.jamaah, p.jamaah2].filter(Boolean).map(short);
              return `<td${nextKey === key ? ' class="is-next"' : ''}><b>${short(p.begins)}</b>${jam.length ? `<small>${jam.join(' · ')}</small>` : ''}</td>`;
            }).join('')}
          </tr>`;
        }
        html += `<section class="month" id="m-${m}" aria-labelledby="mt-${m}">
          <div class="month-head"><h2 id="mt-${m}">${dateText(first, { month: 'long', year: 'numeric' })}</h2><p>${hijriSpan}</p></div>
          <table class="tt">
            <thead><tr><th scope="col">Date</th>${COLS.map(([, label]) => `<th scope="col">${label}</th>`).join('')}</tr></thead>
            <tbody>${rows || '<tr><td colspan="7" class="tt-none">No times for this month.</td></tr>'}</tbody>
          </table>
        </section>`;
      }
      $('year').innerHTML = html + '<p class="year-note">Times are begins, with the Jama\'ah below. On Fridays Dhuhr shows the two Jumu\'ah Jama\'ahs. Hijri dates may be adjusted after the moon is sighted.</p>';
    }

    // the month button of the month being looked at
    function watchMonths() {
      const chips = document.querySelectorAll('.month-chip');
      const mark = (i) => chips.forEach((c) => {
        const on = Number(c.dataset.month) === i;
        c.classList.toggle('is-active', on);
        if (on) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
        if (on && c.scrollIntoView && !c.dataset.seen) { c.parentNode.scrollTo({ left: c.offsetLeft - c.parentNode.clientWidth / 2 + c.offsetWidth / 2, behavior: 'smooth' }); }
      });
      if (!('IntersectionObserver' in window)) return;
      const io = v.observe(new IntersectionObserver((entries) => {
        const shown = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (shown) mark(Number(shown.target.id.slice(2)));
      }, { rootMargin: `-${$('timeHead').offsetHeight + 10}px 0px -55% 0px` }));
      document.querySelectorAll('.month').forEach((s) => io.observe(s));
      // "Today" button while today's row is off screen
      const today = $('today');
      if (today) {
        v.observe(new IntersectionObserver((es) => { $('toToday').hidden = es[0].isIntersecting; })).observe(today);
      }
    }

    function goToday(smooth) {
      const row = $('today');
      if (row) row.scrollIntoView({ block: 'center', behavior: smooth ? 'smooth' : 'auto' });
    }
    $('toToday').addEventListener('click', () => goToday(true));
    v.on(document, 'click', (e) => {
      const chip = e.target.closest('.month-chip');
      if (!chip) return;
      e.preventDefault();
      const sec = document.getElementById('m-' + chip.dataset.month);
      if (sec) sec.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });

    // always open at today, not where the page was last left
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    let started = false;
    function start() {
      if (started) return;
      if (!HIUK.times.forDate(new Date())) { $('year').innerHTML = '<p class="year-empty">The timetable could not be loaded. Please connect to the internet and try again.</p>'; return; }
      started = true;
      render();
      watchMonths();
      goToday(false);
      // keep "today" and the next prayer right if the app stays open past a prayer or midnight
      let key = '';
      v.every(() => {
        const n = new Date(), nx = HIUK.times.next(n);
        const k = n.toDateString() + (nx ? nx.prayer.key : '');
        if (key && k !== key) { const y = window.scrollY; render(); watchMonths(); window.scrollTo(0, y); }
        key = k;
      }, 30000);
    }
    Promise.all([HIUK.times.ready, HIUK.hijri.ready([new Date().getFullYear()])]).then(start);
    // pulled down to refresh (pull.js)
    v.on(document, 'hiuk:times', () => {
      if (!started) { start(); return; }
      const y = window.scrollY;
      render(); watchMonths(); window.scrollTo(0, y);
    });
  });
})();
