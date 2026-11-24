/* Hefazothe Islam UK: next prayer and countdown in the mobile menu (.js-next-name, .js-count) on every page
   except the home page, where site.js already does this. Times come from prayer-times.js. */
(function () {
  'use strict';
  const box = document.querySelector('.mnav-prayer');
  if (!box || !window.HIUKTimes) { if (box) box.hidden = true; return; }
  const pad = (n) => String(n).padStart(2, '0');
  const toMin = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
  const at = (date, hm) => { const t = new Date(date); const [h, m] = hm.split(':').map(Number); t.setHours(h, m, 0, 0); return t; };
  const set = (sel, text) => document.querySelectorAll(sel).forEach((el) => { if (el.textContent !== text) el.textContent = text; });

  function tick() {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const today = (HIUKTimes.forDate(now) || []).filter((p) => p.key !== 'Sunrise');
    let next = today.find((p) => toMin(p.begins) > nowMin), target;
    if (next) target = at(now, next.begins);
    else { // after Isha: tomorrow's Fajr
      const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
      next = (HIUKTimes.forDate(tomorrow) || []).find((p) => p.key !== 'Sunrise');
      if (!next) return;
      target = at(tomorrow, next.begins);
    }
    const secs = Math.max(0, Math.floor((target - now) / 1000));
    set('.js-next-name', next.name); // "Jumu'ah" on Fridays
    set('.js-next-ar', next.ar);
    set('.js-count', pad(Math.floor(secs / 3600)) + ':' + pad(Math.floor(secs % 3600 / 60)) + ':' + pad(secs % 60));
  }

  HIUKTimes.ready.then(() => { tick(); setInterval(tick, 1000); }, () => { box.hidden = true; });
})();
