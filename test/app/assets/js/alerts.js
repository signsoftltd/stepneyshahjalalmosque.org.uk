/* Stepney Shah Jalal Mosque app: prayer alerts (set on the Settings screen).
   - Adhan: at the start of each prayer, the Adhan or a short alert (or nothing), chosen per prayer
   - Jama'ah reminder: a set number of minutes before each Jama'ah (both Jumu'ah Jama'ahs on Fridays)
   - Qadha reminder: a set number of minutes before the prayer's time ends, so it isn't missed:
     Fajr ends at sunrise, Dhuhr at Asr, Asr at Maghrib, Maghrib at Isha, Isha at the next day's Fajr
   - Auto silent mode: the phone goes silent a set number of minutes before each Jama'ah and back to normal a set
     number of minutes after it starts, both chosen per prayer. Only the native app can do this (window.HIUKNative.scheduleSilent(json), see README).
   Delivery: a webview can't alert when the app is closed, so the schedule is handed to the native app each time a
   screen with this script opens: Android's window.Android.setAzan / setReminder / setSilent, or otherwise
   window.HIUKNative.scheduleNotifications(json), or the iOS app's setAzan / setReminder messages (see README).
   While the app is open (or without the native part, e.g. in a browser) alerts are shown and played here.
   Needs data.js (HIUK.times). */
(function () {
  'use strict';
  const HIUK = (window.HIUK = window.HIUK || {});
  const { at, addDays, fmt12, pad, esc } = HIUK.util;
  const KEY = 'hiuk_app_alerts';
  const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const all = (v) => PRAYERS.reduce((o, p) => (o[p] = v, o), {});
  const DEFAULTS = {
    adhan: { on: false, prayers: all('adhan') },             // 'adhan' | 'alert' | 'off'; off until turned on in Settings
    jamaah: { on: false, prayers: all(true), mins: all(15) },  // minutes before, for each prayer
    qadha: { on: false, prayers: all(true), mins: all(30) },
    silent: { on: false, prayers: all(true), mins: all(5), after: all(20) }  // minutes before each Jama'ah, and after it starts
  };
  const NATIVE_MAX = 60;  // iPhone keeps at most 64 waiting notifications per app
  const DAYS = 7;

  function get() {
    const s = HIUK.store.get(KEY) || {};
    const out = {};
    Object.keys(DEFAULTS).forEach((k) => {
      out[k] = Object.assign({}, DEFAULTS[k], s[k] || {});
      out[k].prayers = Object.assign({}, DEFAULTS[k].prayers, (s[k] || {}).prayers || {});
      // earlier versions had one number for all prayers ("before")
      if (DEFAULTS[k].mins) out[k].mins = Object.assign({}, (s[k] || {}).before ? all(s[k].before) : DEFAULTS[k].mins, (s[k] || {}).mins || {});
      delete out[k].before;
    });
    // silent mode's "after" was one number for all prayers at first
    const after = (s.silent || {}).after;
    out.silent.after = Object.assign({}, typeof after === 'number' ? all(after) : DEFAULTS.silent.after, after && typeof after === 'object' ? after : {});
    return out;
  }
  function set(s) { HIUK.store.set(KEY, s); sync(); }

  // "05:00" -> "05:00 AM" in the notifications (just "05:00" with the 24-hour clock)
  const noticeTime = (hm) => fmt12(hm).toUpperCase().replace(/^\d:/, '0$&');

  /* ---- the alerts from `from` for `days` days ---- */
  function plan(from, days) {
    const s = get(), list = [];
    // i = -1: the night before, whose Isha reminder comes after midnight (only that one)
    for (let i = -1; i < days; i++) {
      const day = addDays(from, i), night = i < 0;
      const today = HIUK.times.forDate(day), tomorrow = HIUK.times.forDate(addDays(day, 1));
      if (!today) continue;
      const by = (k, l) => (l || []).find((p) => p.key === k);
      PRAYERS.forEach((key, n) => {
        const p = by(key, today);
        if (!p || !p.begins || (night && key !== 'Isha')) return;
        const name = p.name, stamp = day.getFullYear() + pad(day.getMonth() + 1) + pad(day.getDate());
        // Adhan, or a short alert with the same text
        const mode = s.adhan.prayers[key];
        if (!night && s.adhan.on && mode !== 'off') {
          const jam = [p.jamaah, p.jamaah2].filter(Boolean).map(noticeTime).join(' & ');
          const adhan = mode === 'adhan';
          list.push({ id: `adhan-${stamp}-${key}`, kind: adhan ? 'adhan' : 'alert', prayer: key, day: i, at: at(day, p.begins),
            title: `${name} Adhan`, body: `Begins: ${noticeTime(p.begins)}` + (jam ? `, Jama'ah: ${jam}` : ''), sound: adhan ? (key === 'Fajr' ? 'adhan-fajr' : 'adhan') : 'alert' });
        }
        // Jama'ah reminder
        if (!night && s.jamaah.on && s.jamaah.prayers[key]) {
          const mins = s.jamaah.mins[key];
          [p.jamaah, p.jamaah2].filter(Boolean).forEach((j, k, arr) => {
            const label = arr.length > 1 ? `${name} ${k ? '2nd' : '1st'} Jama'ah` : `${name} Jama'ah`;
            list.push({ id: `jamaah-${stamp}-${key}-${k}`, kind: 'jamaah', prayer: key, day: i, second: k > 0, at: new Date(at(day, j) - mins * 60000),
              title: `${label} Reminder`, body: `Jama'ah Time: ${noticeTime(j)}`, sound: 'alert' });
          });
        }
        // Qadha reminder: before the prayer's time ends
        if (s.qadha.on && s.qadha.prayers[key]) {
          let end = null;
          if (key === 'Fajr') { const sr = by('Sunrise', today); end = sr && at(day, sr.begins); }
          else if (key === 'Isha') { const f = by('Fajr', tomorrow); end = f && at(addDays(day, 1), f.begins); }
          else { const nx = by(PRAYERS[n + 1], today); end = nx && at(day, nx.begins); }
          const start = at(day, p.begins);
          // a missed Jumu'ah is prayed as Dhuhr
          const pName = key === 'Dhuhr' ? 'Dhuhr' : name;
          if (end && end > start) {
            const when = new Date(Math.max(end - s.qadha.mins[key] * 60000, start.getTime()));
            const endText = noticeTime(pad(end.getHours()) + ':' + pad(end.getMinutes()));
            list.push({ id: `qadha-${stamp}-${key}`, kind: 'qadha', prayer: key, day: night ? DAYS : i, at: when,
              title: `${pName} time is about to end.`, body: `Time ends at ${endText}. Kindly ensure you have performed your Salah.`, sound: 'alert' });
          }
        }
      });
    }
    return list.sort((a, b) => a.at - b.at);
  }

  /* ---- auto silent mode: [{ id, prayer, title, start, end }] from `from` for `days` days ---- */
  function silentPlan(from, days) {
    const s = get().silent, list = [];
    if (!s.on) return list;
    for (let i = 0; i < days; i++) {
      const day = addDays(from, i), today = HIUK.times.forDate(day);
      if (!today) continue;
      const stamp = day.getFullYear() + pad(day.getMonth() + 1) + pad(day.getDate());
      PRAYERS.forEach((key) => {
        const p = today.find((x) => x.key === key);
        if (!p || !s.prayers[key]) return;
        [p.jamaah, p.jamaah2].filter(Boolean).forEach((j, k) => {
          const t = at(day, j), start = new Date(t - s.mins[key] * 60000), end = new Date(t.getTime() + s.after[key] * 60000);
          const last = list[list.length - 1];
          // Friday's two Jama'ahs close together: one silent time
          if (last && start <= last.end) { last.end = new Date(Math.max(last.end, end)); return; }
          list.push({ id: `silent-${stamp}-${key}-${k}`, prayer: key, day: i, second: k > 0, title: `${p.name} Jama'ah`, start, end });
        });
      });
    }
    return list;
  }

  /* ---- hand the schedule to the app; alerts while the app is open ---- */
  const androidHas = (name) => window.Android && typeof window.Android[name] === 'function';
  const androidAlerts = () => androidHas('setAzan') && androidHas('setReminder');
  const hiukNative = () => window.HIUKNative && typeof window.HIUKNative.scheduleNotifications === 'function';
  // the iOS app's script message handler: the same alarms as Android, as messages
  const iosAlerts = () => !androidAlerts() && !hiukNative() && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.actionMessageHandler;
  const native = () => !!(androidAlerts() || hiukNative() || iosAlerts());
  const silentNative = () => androidHas('setSilent') || (window.HIUKNative && typeof window.HIUKNative.scheduleSilent === 'function');
  const dateArgs = (d) => [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(String);
  const timeArgs = (d) => [d.getHours(), d.getMinutes()].map(String);

  /* The apps' alarm ids, by prayer (n: Fajr 1 .. Isha 5) and day (0 = today .. 6). Each prayer has an 8th slot, used
     for the 2nd Jumu'ah Jama'ah. A prayer set to Alert is a setAzan in the Adhan's slot, with alertOnly (the Adhan
     or the short alert, never both). Passed alarms are left out, as they would go off straight away. */
  const isAzan = (a) => a.kind === 'adhan' || a.kind === 'alert';
  function alarmId(a) {
    const n = PRAYERS.indexOf(a.prayer) + 1;
    if (isAzan(a)) return String(10 * n + a.day);
    return String(a.kind === 'jamaah' ? 100 * n + (a.second ? 7 : a.day) : 1000 + 100 * n + a.day);
  }
  // Android: setAzan(id, year, month, day, hour, minute, title, body, alertOnly 'true' | 'false')
  function setAndroidAlerts(list) {
    const A = window.Android;
    A.cancelAzan('all'); A.cancelReminder('allJamaah'); A.cancelReminder('allQazaa');
    list.forEach((a) => {
      const when = dateArgs(a.at).concat(timeArgs(a.at));
      if (isAzan(a)) A.setAzan(alarmId(a), ...when, a.title, a.body, String(a.kind === 'alert'));
      else A.setReminder(alarmId(a), ...when, a.title, a.body);
    });
  }
  // iOS: the same calls as messages, { action: 'cancelAzan' | 'cancelReminder', wakto } and
  // { action: 'setAzan' | 'setReminder', id, year, month, day, hour, minute, title, body, sound }, setAzan with
  // alertOnly true | false. The soonest NATIVE_MAX only, for iOS's limit
  function setIosAlerts(list) {
    const M = iosAlerts();
    M.postMessage({ action: 'cancelAzan', wakto: 'all' });
    M.postMessage({ action: 'cancelReminder', wakto: 'allJamaah' });
    M.postMessage({ action: 'cancelReminder', wakto: 'allQazaa' });
    list.slice(0, NATIVE_MAX).forEach((a) => {
      const [year, month, day, hour, minute] = dateArgs(a.at).concat(timeArgs(a.at));
      const msg = { action: isAzan(a) ? 'setAzan' : 'setReminder', id: alarmId(a), year, month, day, hour, minute, title: a.title, body: a.body, sound: a.sound };
      if (isAzan(a)) msg.alertOnly = a.kind === 'alert';
      M.postMessage(msg);
    });
  }
  // cancelling also drops the "off" alarm of a silent time already running, so that one is set again from now.
  // setSilent takes one date: a silent time past midnight ends at 23:59
  function setAndroidSilent(quiet, now) {
    const A = window.Android;
    ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'].forEach((w) => A.cancelSilent(w));
    quiet.forEach((q) => {
      const n = PRAYERS.indexOf(q.prayer) + 1, slot = q.second ? 7 : q.day;
      const start = q.start < now ? now : q.start;
      const end = q.end.getDate() === start.getDate() ? timeArgs(q.end) : ['23', '59'];
      A.setSilent(String(10 * n + slot), String(100 + 10 * n + slot), ...dateArgs(start), ...timeArgs(start), ...end);
    });
  }

  let timers = [];
  function sync() {
    return HIUK.times.ready.then(() => {
      const now = new Date();
      const list = plan(new Date(now.getFullYear(), now.getMonth(), now.getDate()), DAYS).filter((a) => a.at > now);
      if (androidAlerts()) {
        try { setAndroidAlerts(list); } catch (e) { /* the app couldn't take it */ }
      } else if (hiukNative()) {
        try {
          window.HIUKNative.scheduleNotifications(JSON.stringify({
            version: 1,
            items: list.slice(0, NATIVE_MAX).map((a) => ({ id: a.id, kind: a.kind, prayer: a.prayer, time: a.at.getTime(), title: a.title, body: a.body, sound: a.sound }))
          }));
        } catch (e) { /* the app couldn't take it */ }
      } else if (iosAlerts()) {
        try { setIosAlerts(list); } catch (e) { /* the app couldn't take it */ }
      }
      // auto silent mode: only the app can silence the phone (an empty list cancels it)
      if (silentNative()) {
        const quiet = silentPlan(new Date(now.getFullYear(), now.getMonth(), now.getDate()), DAYS).filter((q) => q.end > now);
        try {
          if (androidHas('setSilent')) setAndroidSilent(quiet, now);
          else window.HIUKNative.scheduleSilent(JSON.stringify({
            version: 1,
            items: quiet.map((q) => ({ id: q.id, prayer: q.prayer, start: q.start.getTime(), end: q.end.getTime() }))
          }));
        } catch (e) { /* the app couldn't take it */ }
      }
      timers.forEach(clearTimeout);
      timers = [];
      // the app shows its own notifications, so only alert here without it
      if (!native()) list.filter((a) => a.at - now < 864e5).forEach((a) => timers.push(setTimeout(() => show(a), a.at - now)));
      return list;
    });
  }

  /* ---- an alert on screen, with the Adhan or a short tone ---- */
  let audio = null, onEnd = null;
  function ended() { const f = onEnd; onEnd = null; if (f) f(); }
  function stop() {
    if (audio) { audio.pause(); audio = null; }
    const el = document.getElementById('alertPop');
    if (el) el.classList.remove('show');
    ended();
  }
  function tone() {
    try {
      const C = window.AudioContext || window.webkitAudioContext, ctx = new C();
      [0, 0.28].forEach((t, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = i ? 660 : 880; o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.5);
        o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.55);
      });
    } catch (e) { /* no sound */ }
  }
  // the Adhan recordings: assets/audio/adhan.mp3 (and adhan-fajr.mp3 for Fajr); a tone if they are missing
  // done(): called once when the sound has finished or is stopped
  function play(sound, done) {
    if (done !== undefined) { ended(); onEnd = done; }
    if (sound === 'alert') { tone(); setTimeout(ended, 900); return; }
    const a = (audio = new Audio(`assets/audio/${sound}.mp3`));
    const fallback = () => {
      if (audio !== a) return;
      audio = null;
      if (sound === 'adhan-fajr') play('adhan'); else { tone(); setTimeout(ended, 900); }
    };
    a.addEventListener('error', fallback);
    a.addEventListener('ended', () => { if (audio === a) stop(); });
    a.play().catch((e) => { if (e && e.name !== 'AbortError') fallback(); });
  }
  function show(a) {
    let el = document.getElementById('alertPop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'alertPop'; el.className = 'alert-pop'; el.setAttribute('role', 'alert');
      document.body.appendChild(el);
      el.addEventListener('click', (e) => { if (e.target.closest('[data-alert-stop]')) stop(); });
    }
    const icon = a.kind === 'adhan' || a.kind === 'alert' ? 'mosque' : a.kind === 'jamaah' ? 'clock' : 'bell';
    el.innerHTML = `${HIUK.icon(icon)}<div><b>${esc(a.title)}</b><span>${esc(a.body)}</span></div>
      <button type="button" data-alert-stop>${a.kind === 'adhan' ? 'Stop' : 'OK'}</button>`;
    el.classList.add('show');
    play(a.sound, null);
    if (a.kind !== 'adhan') setTimeout(() => { if (!audio) el.classList.remove('show'); }, 20000);
  }

  HIUK.alerts = { PRAYERS, get, set, plan, silentPlan, sync, preview: play, stop, native, silentNative };
  sync();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  document.addEventListener('hiuk:times', sync);   // pulled down to refresh (pull.js): new times, new alerts
})();
