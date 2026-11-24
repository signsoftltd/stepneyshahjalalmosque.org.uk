/* Stepney Shah Jalal Mosque: Hijri dates from the Hijri calendar API (Sign Soft; address in config.js).
   GET <api>?year=2026 returns { "18-10-2026": "07-05-1448", ... }: one entry per Gregorian date (DD-MM-YYYY),
   with the Hijri day-month-year as the value. Each year is saved in the browser for a day.
   If the API can't be reached (and nothing is saved), dates fall back to the browser's Umm al-Qura calendar.

   window.HIUKHijri
     .ready([years])    Promise: loads those years (default: this year, and next year during December). Never rejects.
     .get(date)         { day, month, year } or null
     .format(date, style)
                        'long'   7 Jumada-Al-Awwal 1448 AH    'medium' 7 Jumada-Al-Awwal 1448
                        'short'  7 Jum. I 1448                'day'    7 Jum. I
                        'day-long' 7 Jumada-Al-Awwal
                        'ar'     ٧ جمادى الأولى ١٤٤٨ هـ
     .monthName(month, 'long' | 'short' | 'ar')   month 1-12 */
(function () {
  'use strict';
  const URL = window.HIUK_HIJRI || 'https://apps.signsoft.co.uk/api/hijri-calendar.php';
  const MAX_AGE = 24 * 3600 * 1000;
  // [long, short, Arabic]
  const MONTHS = [
    ['Muharram', 'Muh.', 'محرم'],
    ['Safar', 'Saf.', 'صفر'],
    ['Rabi-Al-Awwal', 'Rab. I', 'ربيع الأول'],
    ['Rabi-Al-Thani', 'Rab. II', 'ربيع الآخر'],
    ['Jumada-Al-Awwal', 'Jum. I', 'جمادى الأولى'],
    ['Jumada-Al-Thani', 'Jum. II', 'جمادى الآخرة'],
    ['Rajab', 'Raj.', 'رجب'],
    ["Sha'baan", 'Sha.', 'شعبان'],
    ['Ramadhan', 'Ram.', 'رمضان'],
    ['Shawwal', 'Shaw.', 'شوال'],
    ["Dhul Qa'dah", 'Dhul-Q.', 'ذو القعدة'],
    ['Dhul Hijjah', 'Dhul-H.', 'ذو الحجة']
  ];
  const pad = (n) => String(n).padStart(2, '0');
  const keyOf = (d) => pad(d.getDate()) + '-' + pad(d.getMonth() + 1) + '-' + d.getFullYear();
  const arDigits = (n) => String(n).replace(/\d/g, (c) => '٠١٢٣٤٥٦٧٨٩'[c]);

  const data = {};    // year -> { 'DD-MM-YYYY': [day, month, year] }
  const loading = {}; // year -> Promise

  function parse(obj) {
    const out = {};
    Object.keys(obj || {}).forEach((g) => {
      const m = /^(\d{1,2})-(\d{1,2})-(\d{3,4})$/.exec(String(obj[g]));
      if (m && Number(m[2]) >= 1 && Number(m[2]) <= 12) out[g] = [Number(m[1]), Number(m[2]), Number(m[3])];
    });
    return out;
  }

  function load(year) {
    if (loading[year]) return loading[year];
    const ck = 'hiuk_hijri_' + year;
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(ck) || 'null'); } catch (e) { saved = null; }
    const savedOk = saved && saved.days && Object.keys(saved.days).length >= 300;
    if (savedOk && Date.now() - saved.at < MAX_AGE) { data[year] = saved.days; return (loading[year] = Promise.resolve(true)); }
    loading[year] = fetch(URL + (URL.indexOf('?') < 0 ? '?' : '&') + 'year=' + year, { headers: { Accept: 'application/json' } })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((json) => {
        const days = parse(json);
        if (Object.keys(days).length < 300) throw new Error('Unexpected Hijri calendar format');
        data[year] = days;
        try { localStorage.setItem(ck, JSON.stringify({ at: Date.now(), days })); } catch (e) { /* storage full or blocked */ }
        return true;
      })
      .catch(() => {
        if (savedOk) { data[year] = saved.days; return true; } // offline: last saved copy
        loading[year] = null; // try again next time
        return false;
      });
    return loading[year];
  }

  // only if the API can't be reached: the browser's Umm al-Qura calendar
  function calc(date) {
    try {
      const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(date);
      const num = (t) => parseInt((parts.find((p) => p.type === t) || {}).value, 10);
      const r = [num('day'), num('month'), num('year')];
      return r.every((n) => n > 0) ? r : null;
    } catch (e) { return null; }
  }

  function get(date) {
    const y = data[date.getFullYear()];
    const r = (y && y[keyOf(date)]) || calc(date);
    return r ? { day: r[0], month: r[1], year: r[2] } : null;
  }

  function format(date, style) {
    const h = get(date);
    if (!h) return '';
    const M = MONTHS[h.month - 1];
    switch (style) {
      case 'ar': return `${arDigits(h.day)} ${M[2]} ${arDigits(h.year)} هـ`;
      case 'medium': return `${h.day} ${M[0]} ${h.year}`;
      case 'short': return `${h.day} ${M[1]} ${h.year}`;
      case 'day': return `${h.day} ${M[1]}`;
      case 'day-long': return `${h.day} ${M[0]}`;
      default: return `${h.day} ${M[0]} ${h.year} AH`;
    }
  }

  const api = {
    ready(years) {
      const now = new Date();
      const list = years || [now.getFullYear()].concat(now.getMonth() === 11 ? [now.getFullYear() + 1] : []);
      return Promise.all(list.map(load)).then(() => api);
    },
    get,
    format,
    monthName(month, style) { const M = MONTHS[month - 1]; return M ? M[style === 'short' ? 1 : style === 'ar' ? 2 : 0] : ''; }
  };
  api.ready(); // start loading straight away
  window.HIUKHijri = api;
})();
