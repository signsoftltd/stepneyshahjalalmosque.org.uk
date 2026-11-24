/* Hefazothe Islam UK app: Ramadhan timetable (config.js ramadanUrl). Saved on the phone, so it also works offline.
   The card at the top: before Ramadhan, the days until it begins; during it, today's Sehri and Iftar with a
   countdown to the next one; after it, Eid Mubarak. Today's row is highlighted in the table. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const CFG = window.HIUK_CONFIG || {};
    const { esc, pad, sameDay, addDays } = HIUK.util;
    const $ = (id) => document.getElementById(id);
    const KEY = 'hiuk_app_ramadan';

    // "06:03 AM" -> "06:03", "05:03 PM" -> "17:03"
    function to24(s) {
      const m = /^\s*(\d{1,2}):(\d{2})\s*([AP])\.?M\.?\s*$/i.exec(String(s || ''));
      if (!m) return /^\d{1,2}:\d{2}$/.test(String(s || '').trim()) ? String(s).trim().padStart(5, '0') : null;
      let h = Number(m[1]) % 12;
      if (m[3].toUpperCase() === 'P') h += 12;
      return pad(h) + ':' + m[2];
    }
    // "07-02-27" -> 7 February 2027
    function toDate(s) {
      const m = /^(\d{1,2})-(\d{1,2})-(\d{2,4})$/.exec(String(s || '').trim());
      if (!m) return null;
      const y = Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3]);
      return new Date(y, Number(m[2]) - 1, Number(m[1]));
    }
    function parse(data) {
      const days = (data && Array.isArray(data.times) ? data.times : []).map((t) => ({
        n: Number(t.sl), date: toDate(t.date), sehri: to24(t.sehri), iftar: to24(t.iftar)
      })).filter((d) => d.date && d.sehri && d.iftar);
      if (!days.length) throw new Error('Unexpected Ramadhan timetable');
      return { title: String(data.title || 'Ramadhan Timetable'), eid: String(data.eid || ''), saf: String(data.saf || ''), days };
    }
    const at = (d, hm) => HIUK.util.at(d, hm);

    function load() {
      const saved = HIUK.store.get(KEY);
      const fresh = saved && saved.data && Date.now() - saved.at < (CFG.ramadanMaxAge || 0);
      if (fresh) return Promise.resolve(saved.data);
      return fetch(CFG.ramadanUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' })
        .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then((json) => { parse(json); HIUK.store.set(KEY, { at: Date.now(), data: json }); return json; })
        .catch(() => (saved && saved.data) || null); // offline: the saved copy
    }

    /* ---- the page ---- */
    let R = null;
    function render() {
      // "Ramadhan Timetable - 2027/1447" -> "Timetable · 2027 · 1447 AH"
      const years = (/(\d{4})\s*\/\s*(\d{4})/.exec(R.title) || []);
      $('rSub').textContent = years[1] ? `Timetable · ${years[1]} · ${years[2]} AH` : R.title;
      // "Eid Salah: 8:00am and 10:00am" -> label and value
      const info = (s, icon) => {
        if (!s) return '';
        const i = s.indexOf(':');
        const label = i > 0 ? s.slice(0, i) : '', value = i > 0 ? s.slice(i + 1).trim() : s;
        return `<div class="r-chip">${HIUK.icon(icon)}<span>${label ? `<small>${esc(label)}</small>` : ''}<b>${esc(value)}</b></span></div>`;
      };
      $('rInfo').innerHTML = info(R.eid, 'mosque') + info(R.saf, 'donate');
      const today = new Date();
      const fmt = HIUK.util.fmt12;
      $('rRows').innerHTML = R.days.map((d) => {
        const isToday = sameDay(d.date, today), past = !isToday && d.date < today, fri = d.date.getDay() === 5;
        return `<tr class="${isToday ? 'is-today' : past ? 'is-past' : ''}${fri ? ' is-fri' : ''}"${isToday ? ' id="rToday" aria-current="date"' : ''}>
          <th scope="row"><span class="r-n">${d.n}</span></th>
          <td><b>${esc(HIUK.util.dateText(d.date, { day: 'numeric', month: 'short' }))}</b><small>${esc(HIUK.util.dateText(d.date, { weekday: 'short' }))}</small></td>
          <td class="tnum">${fmt(d.sehri)}</td>
          <td class="tnum">${fmt(d.iftar)}</td>
        </tr>`;
      }).join('');
      tick();
    }

    // hh:mm:ss until `to`
    const left = (to, now) => { const s = Math.max(0, Math.floor((to - now) / 1000)); return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`; };
    function tick() {
      if (!R) return;
      const now = new Date(), fmt = HIUK.util.fmt12, days = R.days;
      const first = days[0], last = days[days.length - 1];
      const today = days.find((d) => sameDay(d.date, now));
      let html;
      if (!today && now < first.date) {
        // before Ramadhan
        const n = Math.round((first.date - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
        html = `<p class="r-kicker">Ramadhan Mubarak</p>
          <h2>${n === 1 ? 'Ramadhan begins tomorrow' : `Ramadhan begins in <span class="tnum">${n}</span> days`}</h2>
          <p class="r-sub">${esc(HIUK.util.dateText(first.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))} · first Sehri ends ${fmt(first.sehri)}</p>`;
      } else if (!today) {
        // after Ramadhan
        html = `<p class="r-kicker">Eid Mubarak</p><h2>Ramadhan has ended</h2>
          <p class="r-sub">May Allah accept our fasts and prayers. The timetable for ${esc(HIUK.util.dateText(first.date, { month: 'long' }))}–${esc(HIUK.util.dateText(last.date, { month: 'long', year: 'numeric' }))} is below.</p>`;
      } else {
        // during Ramadhan: count down to Sehri ending, then to Iftar, then to tomorrow's Sehri
        const sehri = at(today.date, today.sehri), iftar = at(today.date, today.iftar);
        const tomorrow = days.find((d) => sameDay(d.date, addDays(now, 1)));
        const evening = now >= iftar;   // after Iftar: the next Sehri is tomorrow's
        const sehriDay = evening && tomorrow ? tomorrow : today;
        let next = null, target = null;
        if (now < sehri) { next = 'sehri'; target = sehri; }
        else if (!evening) { next = 'iftar'; target = iftar; }
        else if (tomorrow) { next = 'sehri'; target = at(tomorrow.date, tomorrow.sehri); }
        html = `<p class="r-kicker">Day ${today.n} of ${days.length}</p>
          <div class="r-times">
            <div class="${next === 'sehri' ? 'is-next' : ''}"><small>Sehri ends${sehriDay !== today ? ' · tomorrow' : ''}</small><b class="tnum">${fmt(sehriDay.sehri)}</b></div>
            <div class="${next === 'iftar' ? 'is-next' : ''}"><small>Iftar</small><b class="tnum">${fmt(today.iftar)}</b></div>
          </div>
          ${target ? `<p class="r-count"><span>${next === 'sehri' ? 'Sehri ends in' : 'Iftar in'}</span> <b class="tnum">${left(target, now)}</b></p>`
            : '<p class="r-count"><span>The last fast is complete. Eid Mubarak!</span></p>'}`;
      }
      if ($('rNow').innerHTML !== html) $('rNow').innerHTML = html;
    }

    load().then((data) => {
      try { R = data && parse(data); } catch (e) { R = null; }
      if (!R) { $('rEmpty').textContent = 'The Ramadhan timetable could not be loaded. Please connect to the internet and try again.'; return; }
      $('rEmpty').hidden = true;
      $('rBody').hidden = false;
      render();
      v.every(tick, 1000);
      // past midnight: today's row moves on
      let day = new Date().toDateString();
      v.every(() => { if (new Date().toDateString() !== day) { day = new Date().toDateString(); render(); } }, 30000);
    });
  });
})();
