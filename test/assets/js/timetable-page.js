/* Stepney Shah Jalal Mosque: full prayer timetable (timetable.php), one month at a time, from the yearly
   timetable (prayer-times.js). Today's row is highlighted, with its next prayer marked; ?m=YYYY-MM opens a month. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const body = $('#ttBody');
  if (!body) return;
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toMin = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
  const fmt12 = (hm) => { if (!hm) return '—'; const [h, m] = hm.split(':').map(Number); return (h % 12 || 12) + ':' + pad(m) + ' ' + (h >= 12 ? 'pm' : 'am'); };
  // Hijri dates from the Hijri calendar API (hijri.js)
  const hijri = (d, style) => window.HIUKHijri ? HIUKHijri.format(d, style) : '';
  const hijriOf = (d) => (window.HIUKHijri && HIUKHijri.get(d)) || null;
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const MONTHS = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleDateString('en-GB', { month: 'long' }));
  const COLS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const sel = $('#ttSelect'), title = $('#ttMonth'), hijriEl = $('#ttHijri'), prev = $('#ttPrev'), next = $('#ttNext');
  const year = window.HIUKTimes ? HIUKTimes.year : new Date().getFullYear();
  let month = new Date().getMonth();
  // a month from the address (?m=2026-03), if it's in the timetable's year
  const want = /^(\d{4})-(\d{2})$/.exec(new URLSearchParams(location.search).get('m') || '');
  if (want && Number(want[1]) === year && want[2] >= '01' && want[2] <= '12') month = Number(want[2]) - 1;

  sel.innerHTML = MONTHS.map((m, i) => `<option value="${i}">${m} ${year}</option>`).join('');

  function nextPrayer(list, now) {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const p = list.find((x) => x.key !== 'Sunrise' && toMin(x.begins) > nowMin);
    return p ? p.key : null;
  }

  function render() {
    const now = new Date();
    const first = new Date(year, month, 1), last = new Date(year, month + 1, 0);
    title.textContent = `${MONTHS[month]} ${year}`;
    sel.value = String(month);
    prev.disabled = month === 0; next.disabled = month === 11;
    // the Islamic months this month spans, e.g. "Rabi-Al-Thani – Jumada-Al-Awwal 1448 AH"
    const a = hijriOf(first), z = hijriOf(last);
    const mn = (h) => HIUKHijri.monthName(h.month, 'long');
    hijriEl.textContent = !a || !z ? ''
      : a.month === z.month && a.year === z.year ? `${mn(z)} ${z.year} AH`
      : a.year === z.year ? `${mn(a)} – ${mn(z)} ${z.year} AH` : `${mn(a)} ${a.year} – ${mn(z)} ${z.year} AH`;
    let h = '';
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
      const list = HIUKTimes.forDate(d);
      if (!list) continue;
      const isToday = sameDay(d, now), fri = d.getDay() === 5;
      const nextKey = isToday ? nextPrayer(list, now) : null;
      const byKey = Object.fromEntries(list.map((p) => [p.key, p]));
      h += `<tr class="${[isToday ? 'today' : '', fri ? 'fri' : ''].join(' ').trim()}"${isToday ? ' aria-current="date" id="ttTodayRow"' : ''}>`;
      h += `<th scope="row"><span class="tt-day"><b>${d.getDate()}</b> ${d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>` +
        `<small>${esc(hijri(d, 'day-long'))}</small>${isToday ? '<span class="tt-badge">Today</span>' : ''}</th>`;
      h += COLS.map((k) => {
        const p = byKey[k];
        if (!p) return `<td data-label="${k}">—</td>`;
        const label = p.name; // "Jumu'ah" on Fridays
        const jam = [p.jamaah, p.jamaah2].filter(Boolean).map(fmt12).join(' · ');
        const isNext = nextKey === k;
        return `<td data-label="${esc(label)}"${isNext ? ' class="tt-next"' : ''}>` +
          (fri && k === 'Dhuhr' ? '<span class="tt-jum">Jumu\'ah</span>' : '') +
          `<b>${fmt12(p.begins)}</b>${jam ? `<small>${jam}</small>` : ''}${isNext ? '<span class="sr"> (next prayer)</span>' : ''}</td>`;
      }).join('');
      h += '</tr>';
    }
    body.innerHTML = h || `<tr><td colspan="7" class="tt-msg">No times for this month.</td></tr>`;
    $('#ttToday').hidden = !(now.getFullYear() === year);
  }

  function go(m, push) {
    month = Math.max(0, Math.min(11, m));
    render();
    if (push) { const u = new URL(location.href); u.searchParams.set('m', `${year}-${pad(month + 1)}`); history.replaceState(null, '', u); }
  }

  function unavailable() {
    body.innerHTML = '<tr><td colspan="7" class="tt-msg">The timetable could not be loaded right now. Please refresh the page, or call us on 07878 561130.</td></tr>';
    [prev, next, sel].forEach((el) => { el.disabled = true; });
  }

  if (!window.HIUKTimes) { unavailable(); return; }
  // Hijri dates for the timetable's year (the Hijri calendar never fails: it falls back to a calculation)
  Promise.all([HIUKTimes.ready, window.HIUKHijri ? HIUKHijri.ready([year]) : null]).then(() => {
    render();
    prev.addEventListener('click', () => go(month - 1, true));
    next.addEventListener('click', () => go(month + 1, true));
    sel.addEventListener('change', () => go(Number(sel.value), true));
    $('#ttToday').addEventListener('click', () => {
      if (month !== new Date().getMonth()) go(new Date().getMonth(), true);
      const row = $('#ttTodayRow');
      if (row) { row.scrollIntoView({ behavior: 'smooth', block: 'center' }); row.classList.add('flash'); setTimeout(() => row.classList.remove('flash'), 1600); }
    });
    $('#ttPrint').addEventListener('click', () => window.print());
    // keep today's highlight and next prayer up to date (e.g. a page left open past a prayer or midnight)
    let key = '';
    setInterval(() => {
      const n = new Date(), list = HIUKTimes.forDate(n);
      const k = n.toDateString() + '|' + (list ? nextPrayer(list, n) : '');
      if (key && k !== key) render();
      key = k;
    }, 30000);
  }, unavailable);
})();
