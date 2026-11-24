/* Hefazothe Islam UK: prayer times from the yearly timetable (Sign Soft timetable API, address in config.js).
   The API returns { times: [ ...one entry per day of the year, 1 January first... ], version } where each day has
   f1/f2 Fajr begins/Jama'ah, sun Sunrise, z1/z2 Dhuhr begins/Jama'ah (on Fridays z2 is the first Jumu'ah Jama'ah),
   a1/a2 Asr, m1/m2 Maghrib, i1/i2 Isha and j2 the second Jumu'ah Jama'ah, as "hh:mm AM" clock times
   (already in UK summer/winter time).

   window.HIUKTimes
     .ready            Promise, resolves once the timetable is loaded (rejects if it can't be loaded)
     .forDate(date)    the day's prayers: [{ key, name, ar, begins: 'HH:MM', jamaah: 'HH:MM' | null }], Fajr to Isha
                       with Sunrise; on Fridays Dhuhr becomes Jumu'ah, with `jamaah2` for the second Jama'ah
     .jumuah(date)     the Jumu'ah Jama'ah times for that date's Friday: ['HH:MM', 'HH:MM']
     .covers(date)     whether the timetable has that date (it covers one year)
     .year             the year the timetable is for (the current year) */
(function () {
  'use strict';
  const URL = window.HIUK_TIMETABLE || 'https://apps.signsoft.co.uk/api/clients/hefazotheislamuk/yearly-timetable.php';
  const CACHE_KEY = 'hiuk_timetable';
  const MAX_AGE = 6 * 3600 * 1000; // refresh the saved copy every 6 hours

  const PRAYERS = [
    { key: 'Fajr', name: 'Fajr', ar: 'الفجر', b: 'f1', j: 'f2' },
    { key: 'Sunrise', name: 'Sunrise', ar: 'الشروق', b: 'sun', j: null },
    { key: 'Dhuhr', name: 'Dhuhr', ar: 'الظهر', b: 'z1', j: 'z2' },
    { key: 'Asr', name: 'Asr', ar: 'العصر', b: 'a1', j: 'a2' },
    { key: 'Maghrib', name: 'Maghrib', ar: 'المغرب', b: 'm1', j: 'm2' },
    { key: 'Isha', name: 'Isha', ar: 'العشاء', b: 'i1', j: 'i2' }
  ];

  // "06:26 AM" -> "06:26", "01:00 PM" -> "13:00", "12:09 PM" -> "12:09", "12:05 AM" -> "00:05"
  function to24(s) {
    const m = /^\s*(\d{1,2}):(\d{2})\s*([AP])\.?M\.?\s*$/i.exec(String(s || ''));
    if (!m) return /^\d{1,2}:\d{2}$/.test(String(s || '').trim()) ? String(s).trim().padStart(5, '0') : null;
    let h = Number(m[1]) % 12;
    if (m[3].toUpperCase() === 'P') h += 12;
    return String(h).padStart(2, '0') + ':' + m[2];
  }

  const isLeap = (y) => new Date(y, 1, 29).getDate() === 29;
  // 0 for 1 January
  const dayOfYear = (d) => Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 1)) / 864e5);

  let days = null; // parsed timetable: one { f1: 'HH:MM', ... } per day
  const api = {
    year: new Date().getFullYear(),
    ready: null,
    covers(date) { return !!days && date.getFullYear() === api.year; },
    forDate(date) {
      const row = dayRow(date);
      if (!row) return null;
      const friday = date.getDay() === 5;
      return PRAYERS.map((p) => {
        const item = { key: p.key, name: p.name, ar: p.ar, begins: row[p.b], jamaah: p.j ? row[p.j] || null : null };
        if (friday && p.key === 'Dhuhr') Object.assign(item, { name: "Jumu'ah", ar: 'الجمعة', jamaah2: row.j2 || null });
        return item;
      }).filter((p) => p.begins);
    },
    jumuah(date) {
      const fri = new Date(date); fri.setDate(fri.getDate() + ((5 - fri.getDay() + 7) % 7));
      const row = dayRow(fri);
      return row ? [row.z2, row.j2].filter(Boolean) : [];
    }
  };

  // the timetable row for a date. The list has 365 or 366 days; line it up with this year's calendar
  // (skip 29 February if the list has it but the year doesn't, repeat 28 February in the opposite case)
  function dayRow(date) {
    if (!days) return null;
    let i = dayOfYear(date);
    const n = days.length, leap = isLeap(date.getFullYear());
    if (n >= 366 && !leap && i >= 59) i += 1;
    else if (n === 365 && leap && i >= 59) i = i === 59 ? 58 : i - 1;
    return days[Math.max(0, Math.min(i, n - 1))] || null;
  }

  function parse(data) {
    const list = data && Array.isArray(data.times) ? data.times : null;
    if (!list || list.length < 365) throw new Error('Unexpected timetable format');
    return list.map((t) => { const o = {}; Object.keys(t || {}).forEach((k) => { o[k] = to24(t[k]); }); return o; });
  }

  const store = {
    get() { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(v)); } catch (e) { /* storage full or blocked: just don't save */ } }
  };

  api.ready = new Promise((resolve, reject) => {
    const saved = store.get();
    const savedOk = saved && saved.year === api.year && Array.isArray(saved.days) && saved.days.length >= 365;
    if (savedOk && Date.now() - saved.at < MAX_AGE) { days = saved.days; resolve(api); return; }
    fetch(URL, { headers: { Accept: 'application/json' } })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((data) => {
        days = parse(data);
        store.set({ year: api.year, at: Date.now(), version: data.version || null, days });
        resolve(api);
      })
      .catch((err) => {
        if (savedOk) { days = saved.days; resolve(api); } // offline or the API is down: use the last saved copy
        else reject(err);
      });
  });
  api.ready.catch(() => {}); // callers handle the failure; avoid an "unhandled rejection" warning

  window.HIUKTimes = api;
})();
