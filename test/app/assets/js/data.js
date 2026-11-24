/* Hefazothe Islam UK app: prayer times and Hijri dates.
   Data comes from the APIs in config.js and is saved on the phone, so the app keeps working offline.
   Order of preference: saved copy (if recent) > live API > older saved copy > built-in copy (assets/data/builtin-data.js).

   HIUK.times
     .ready              Promise -> source: 'saved' | 'live' | 'builtin' | 'none' (never rejects)
     .forDate(date)      [{ key, name, ar, begins: 'HH:MM', jamaah, jamaah2 }] Fajr..Isha with Sunrise, or null;
                         on Fridays Dhuhr is Jumu'ah with its two Jama'ahs (jamaah, jamaah2)
     .jumuah(date)       { date, begins, times: ['HH:MM', 'HH:MM'] } for that week's Friday, or null
     .next(now)          { prayer, at: Date } the next prayer from `now` (tomorrow's Fajr after Isha), or null
     .refresh()          fetch the latest timetable now -> Promise
   HIUK.hijri
     .ready(years)       Promise (never rejects)
     .refresh()          fetch this year's Hijri dates now, however recent the saved ones are -> Promise (never rejects)
     .get(date)          { day, month, year } or null
     .format(date, style) 'long' 7 Jumada-Al-Awwal 1448 AH | 'short' 7 Jum. I | 'ar' ٧ جمادى الأولى ١٤٤٨ هـ
     .today(now)         the Hijri day for this moment: it begins at Maghrib */
(function () {
  'use strict';
  const HIUK = (window.HIUK = window.HIUK || {});
  const CFG = window.HIUK_CONFIG || {};
  const BUILTIN = window.HIUK_BUILTIN || {};
  const { toMin, at, addDays, arDigits } = HIUK.util;

  const fetchJson = (url) => fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });

  /* ======================= Prayer timetable ======================= */
  const PRAYERS = [
    { key: 'Fajr', name: 'Fajr', ar: 'الفجر', b: 'f1', j: 'f2' },
    { key: 'Sunrise', name: 'Sunrise', ar: 'الشروق', b: 'sun', j: null },
    { key: 'Dhuhr', name: 'Dhuhr', ar: 'الظهر', b: 'z1', j: 'z2' },
    { key: 'Asr', name: 'Asr', ar: 'العصر', b: 'a1', j: 'a2' },
    { key: 'Maghrib', name: 'Maghrib', ar: 'المغرب', b: 'm1', j: 'm2' },
    { key: 'Isha', name: 'Isha', ar: 'العشاء', b: 'i1', j: 'i2' }
  ];
  // "06:26 AM" -> "06:26", "01:00 PM" -> "13:00"
  function to24(s) {
    const m = /^\s*(\d{1,2}):(\d{2})\s*([AP])\.?M\.?\s*$/i.exec(String(s || ''));
    if (!m) return /^\d{1,2}:\d{2}$/.test(String(s || '').trim()) ? String(s).trim().padStart(5, '0') : null;
    let h = Number(m[1]) % 12;
    if (m[3].toUpperCase() === 'P') h += 12;
    return String(h).padStart(2, '0') + ':' + m[2];
  }
  const parseTimetable = (data) => {
    const list = data && Array.isArray(data.times) ? data.times : null;
    if (!list || list.length < 365) throw new Error('Unexpected timetable');
    return list.map((t) => { const o = {}; Object.keys(t || {}).forEach((k) => { o[k] = to24(t[k]); }); return o; });
  };
  const isLeap = (y) => new Date(y, 1, 29).getDate() === 29;
  const dayOfYear = (d) => Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 1)) / 864e5);

  const TT_KEY = 'hiuk_app_timetable';
  let days = null;

  function dayRow(date) {
    if (!days) return null;
    let i = dayOfYear(date);
    const n = days.length, leap = isLeap(date.getFullYear());
    if (n >= 366 && !leap && i >= 59) i += 1;          // the list has 29 February, this year doesn't
    else if (n === 365 && leap && i >= 59) i = i === 59 ? 58 : i - 1; // this year has it, the list doesn't
    return days[Math.max(0, Math.min(i, n - 1))] || null;
  }

  const times = {
    source: 'none',
    forDate(date) {
      const row = dayRow(date);
      if (!row) return null;
      const friday = date.getDay() === 5;
      return PRAYERS.map((p) => {
        const item = { key: p.key, name: p.name, ar: p.ar, begins: row[p.b], jamaah: p.j ? row[p.j] || null : null, jamaah2: null };
        if (friday && p.key === 'Dhuhr') Object.assign(item, { name: "Jumu'ah", ar: 'الجمعة', jamaah2: row.j2 || null });
        return item;
      }).filter((p) => p.begins);
    },
    jumuah(date) {
      const fri = addDays(date, (5 - date.getDay() + 7) % 7);
      const row = dayRow(fri);
      return row ? { date: fri, begins: row.z1, times: [row.z2, row.j2].filter(Boolean) } : null;
    },
    next(now) {
      for (let add = 0; add < 2; add++) {
        const day = addDays(now, add);
        const list = (times.forDate(day) || []).filter((p) => p.key !== 'Sunrise');
        const p = list.find((x) => at(day, x.begins) > now);
        if (p) return { prayer: p, at: at(day, p.begins) };
      }
      return null;
    },
    refresh() {
      return fetchJson(CFG.timetableUrl).then((data) => {
        days = parseTimetable(data);
        times.source = 'live';
        HIUK.store.set(TT_KEY, { year: new Date().getFullYear(), at: Date.now(), days });
        return 'live';
      });
    }
  };

  times.ready = (function () {
    const year = new Date().getFullYear();
    const saved = HIUK.store.get(TT_KEY);
    const savedOk = saved && saved.year === year && Array.isArray(saved.days) && saved.days.length >= 365;
    if (savedOk) { days = saved.days; times.source = 'saved'; times.savedAt = saved.at; }
    if (savedOk && Date.now() - saved.at < (CFG.timetableMaxAge || 0)) return Promise.resolve('saved');
    return times.refresh().catch(() => {
      if (savedOk) return 'saved';
      if (BUILTIN.timetable && BUILTIN.year === year) {
        try { days = parseTimetable(BUILTIN.timetable); times.source = 'builtin'; return 'builtin'; } catch (e) { /* fall through */ }
      }
      times.source = 'none';
      return 'none';
    });
  })();

  /* ======================= Hijri calendar ======================= */
  // English names as used on the website; short forms for small spaces; Arabic
  const MONTHS = [
    ['Muharram', 'Muh.', 'محرم'], ['Safar', 'Saf.', 'صفر'], ['Rabi-Al-Awwal', 'Rab. I', 'ربيع الأول'],
    ['Rabi-Al-Thani', 'Rab. II', 'ربيع الآخر'], ['Jumada-Al-Awwal', 'Jum. I', 'جمادى الأولى'], ['Jumada-Al-Thani', 'Jum. II', 'جمادى الآخرة'],
    ['Rajab', 'Raj.', 'رجب'], ["Sha'baan", 'Sha.', 'شعبان'], ['Ramadhan', 'Ram.', 'رمضان'],
    ['Shawwal', 'Shaw.', 'شوال'], ["Dhul Qa'dah", 'Dhul-Q.', 'ذو القعدة'], ['Dhul Hijjah', 'Dhul-H.', 'ذو الحجة']
  ];
  const pad = HIUK.util.pad;
  const keyOf = (d) => pad(d.getDate()) + '-' + pad(d.getMonth() + 1) + '-' + d.getFullYear();
  const hijriData = {};
  const hijriLoading = {};

  function parseHijri(obj) {
    const out = {};
    Object.keys(obj || {}).forEach((g) => {
      const m = /^(\d{1,2})-(\d{1,2})-(\d{3,4})$/.exec(String(obj[g]));
      if (m && Number(m[2]) >= 1 && Number(m[2]) <= 12) out[g] = [Number(m[1]), Number(m[2]), Number(m[3])];
    });
    return out;
  }
  function loadHijri(year, force) {
    if (hijriLoading[year] && !force) return hijriLoading[year];
    const key = 'hiuk_app_hijri_' + year;
    const saved = HIUK.store.get(key);
    const savedOk = saved && saved.days && Object.keys(saved.days).length >= 300;
    if (savedOk) hijriData[year] = saved.days;
    if (!force && savedOk && Date.now() - saved.at < (CFG.hijriMaxAge || 0)) return (hijriLoading[year] = Promise.resolve(true));
    if (!savedOk && BUILTIN.hijri && BUILTIN.hijri[year]) hijriData[year] = parseHijri(BUILTIN.hijri[year]); // until the live copy arrives
    hijriLoading[year] = fetchJson(CFG.hijriUrl + '?year=' + year).then((json) => {
      const parsed = parseHijri(json);
      if (Object.keys(parsed).length < 300) throw new Error('Unexpected Hijri calendar');
      hijriData[year] = parsed;
      HIUK.store.set(key, { at: Date.now(), days: parsed });
      return true;
    }).catch(() => { hijriLoading[year] = null; return !!hijriData[year]; });
    return hijriLoading[year];
  }
  // only when there is no data at all for that year: the phone's Umm al-Qura calendar
  function calc(date) {
    try {
      const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(date);
      const num = (t) => parseInt((parts.find((p) => p.type === t) || {}).value, 10);
      const r = [num('day'), num('month'), num('year')];
      return r.every((n) => n > 0) ? r : null;
    } catch (e) { return null; }
  }

  // this year, and next year's too in December
  const hijriYears = () => { const now = new Date(); return [now.getFullYear()].concat(now.getMonth() === 11 ? [now.getFullYear() + 1] : []); };
  const hijri = {
    ready(years) {
      return Promise.all((years || hijriYears()).map((y) => loadHijri(y))).then(() => hijri);
    },
    refresh() {
      return Promise.all(hijriYears().map((y) => loadHijri(y, true))).then(() => hijri);
    },
    get(date) {
      const y = hijriData[date.getFullYear()];
      const r = (y && y[keyOf(date)]) || calc(date);
      return r ? { day: r[0], month: r[1], year: r[2] } : null;
    },
    format(date, style) {
      const h = hijri.get(date);
      if (!h) return '';
      const M = MONTHS[h.month - 1];
      if (style === 'ar') return `${arDigits(h.day)} ${M[2]} ${arDigits(h.year)} هـ`;
      if (style === 'short') return `${h.day} ${M[1]}`;
      return `${h.day} ${M[0]} ${h.year} AH`;
    },
    monthName(month) { return (MONTHS[month - 1] || [''])[0]; },
    // the Islamic day begins at Maghrib: from then until midnight it is the next day's Hijri date
    today(now) {
      const maghrib = (times.forDate(now) || []).find((p) => p.key === 'Maghrib');
      return maghrib && now.getHours() * 60 + now.getMinutes() >= toMin(maghrib.begins) ? addDays(now, 1) : now;
    }
  };

  HIUK.times = times;
  HIUK.hijri = hijri;
})();
