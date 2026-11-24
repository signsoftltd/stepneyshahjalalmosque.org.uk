/* Stepney Shah Jalal Mosque app: Settings. Prayer alerts (saved by alerts.js, which also schedules them) and appearance. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const $ = (id) => document.getElementById(id);
    const A = HIUK.alerts, { esc, fmt12, pad, sameDay, addDays } = HIUK.util;
    const AR = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
    const MODES = [['adhan', 'Adhan'], ['alert', 'Alert'], ['off', 'Off']];
    let s = A.get();

    $('sSilNote').hidden = A.silentNative();
    // iPhones and iPads don't let apps silence the phone: no auto silent mode there
    const ios = !window.Android && !/Android/i.test(navigator.userAgent) && (!!(window.webkit && window.webkit.messageHandlers) || /iPhone|iPad|iPod/i.test(navigator.userAgent));
    $('sSilCard').hidden = ios;
    // auto silent mode, per prayer: minutes before the Jama'ah [min, max], and after it starts
    const SIL = { mins: [0, 30], after: [5, 60] };

    function save() { A.set(s); show(); }

    /* ---- build the controls once ---- */
    $('sAdhanList').innerHTML = A.PRAYERS.map((p) => `<li>
        <span class="s-pname">${p}<small lang="ar" dir="rtl">${AR[p]}</small></span>
        <span class="s-seg" role="radiogroup" aria-label="${p}">${MODES.map(([v, l]) => `<button type="button" role="radio" data-prayer="${p}" data-mode="${v}">${l}</button>`).join('')}</span>
      </li>`).join('');
    // reminders: each prayer can be ticked, with its own minutes
    document.querySelectorAll('.s-remind').forEach((box) => {
      box.innerHTML = A.PRAYERS.map((p) => `<li data-prayer="${p}">
          <button class="s-tick" type="button" role="checkbox" data-toggle>${HIUK.icon('check')}<span class="s-pname">${p}<small lang="ar" dir="rtl">${AR[p]}</small></span></button>
          <span class="s-step">
            <button class="round-btn" type="button" data-step="-5" aria-label="${p}: 5 minutes less">${HIUK.icon('minus')}</button>
            <output class="tnum" aria-live="polite"></output>
            <button class="round-btn" type="button" data-step="5" aria-label="${p}: 5 minutes more">${HIUK.icon('plus')}</button>
          </span>
        </li>`).join('');
    });
    const stepper = (p, f, label) => `<span class="s-ba" data-field="${f}"><small>${label}</small><span class="s-step">
        <button class="round-btn" type="button" data-step="-5" aria-label="${p} ${label.toLowerCase()}: 5 minutes less">${HIUK.icon('minus')}</button>
        <output class="tnum" aria-live="polite"></output>
        <button class="round-btn" type="button" data-step="5" aria-label="${p} ${label.toLowerCase()}: 5 minutes more">${HIUK.icon('plus')}</button>
      </span></span>`;
    $('sSilList').innerHTML = A.PRAYERS.map((p) => `<li data-prayer="${p}">
        <button class="s-tick" type="button" role="checkbox" data-toggle>${HIUK.icon('check')}<span class="s-pname">${p}<small lang="ar" dir="rtl">${AR[p]}</small></span></button>
        <span class="s-bas">${stepper(p, 'mins', 'Before')}${stepper(p, 'after', 'After')}</span>
      </li>`).join('');
    // "5 min before, 20 min after each Jama'ah", or "Fajr 5/20, Dhuhr 10/15 ..." when they differ
    function silentSummary() {
      const on = A.PRAYERS.filter((p) => s.silent.prayers[p]);
      if (!on.length) return 'No prayers ticked';
      const b = on.map((p) => s.silent.mins[p]), a = on.map((p) => s.silent.after[p]);
      if (b.every((m) => m === b[0]) && a.every((m) => m === a[0])) return `${b[0]} min before, ${a[0]} min after each Jama'ah` + (on.length < A.PRAYERS.length ? ` (${on.join(', ')})` : '');
      return on.map((p) => `${p} ${s.silent.mins[p]}/${s.silent.after[p]}`).join(', ') + ' min before/after';
    }
    // "15 minutes before each Jama'ah", or "Fajr 30, Dhuhr 10 ... minutes before" when they differ
    function summary(k, what) {
      const on = A.PRAYERS.filter((p) => s[k].prayers[p]);
      if (!on.length) return 'No prayers ticked';
      const mins = on.map((p) => s[k].mins[p]);
      if (mins.every((m) => m === mins[0])) return `${mins[0]} minutes before ${what}` + (on.length < A.PRAYERS.length ? ` (${on.join(', ')})` : '');
      return on.map((p) => `${p} ${s[k].mins[p]}`).join(', ') + ' minutes before';
    }

    /* ---- show the saved settings ---- */
    function show() {
      const sw = (id, on) => $(id).setAttribute('aria-checked', String(on));
      sw('sAdhanOn', s.adhan.on); sw('sJamOn', s.jamaah.on); sw('sQadOn', s.qadha.on); sw('sSilOn', s.silent.on);
      $('sAdhanMore').hidden = !s.adhan.on; $('sJamMore').hidden = !s.jamaah.on; $('sQadMore').hidden = !s.qadha.on; $('sSilMore').hidden = !s.silent.on;
      $('sJamSub').textContent = s.jamaah.on ? summary('jamaah', "each Jama'ah") : "Before each Jama'ah";
      $('sQadSub').textContent = s.qadha.on ? summary('qadha', 'the prayer time ends') : 'Before the prayer time ends';
      $('sSilSub').textContent = s.silent.on ? silentSummary() : "Silent during each Jama'ah";
      $('sSilList').querySelectorAll('li').forEach((li) => {
        const p = li.dataset.prayer, on = !!s.silent.prayers[p];
        li.classList.toggle('is-off', !on);
        li.querySelector('[data-toggle]').setAttribute('aria-checked', String(on));
        li.querySelectorAll('[data-field]').forEach((box) => {
          const f = box.dataset.field, v = s.silent[f][p];
          box.querySelector('output').innerHTML = `${v}<small> min</small>`;
          box.querySelector('[data-step="-5"]').disabled = !on || v <= SIL[f][0];
          box.querySelector('[data-step="5"]').disabled = !on || v >= SIL[f][1];
        });
      });
      document.querySelectorAll('.s-seg [data-mode]').forEach((b) => b.setAttribute('aria-checked', String(s.adhan.prayers[b.dataset.prayer] === b.dataset.mode)));
      document.querySelectorAll('.s-remind').forEach((box) => {
        const k = box.dataset.for;
        box.querySelectorAll('li').forEach((li) => {
          const p = li.dataset.prayer, on = !!s[k].prayers[p], v = s[k].mins[p];
          li.classList.toggle('is-off', !on);
          li.querySelector('[data-toggle]').setAttribute('aria-checked', String(on));
          li.querySelector('output').innerHTML = `${v}<small> min</small>`;
          li.querySelector('[data-step="-5"]').disabled = !on || v <= Number(box.dataset.min);
          li.querySelector('[data-step="5"]').disabled = !on || v >= Number(box.dataset.max);
        });
      });
      showNext();
    }

    /* ---- changes ---- */
    [['sAdhanOn', 'adhan'], ['sJamOn', 'jamaah'], ['sQadOn', 'qadha'], ['sSilOn', 'silent']].forEach(([id, k]) => $(id).addEventListener('click', () => { s[k].on = !s[k].on; save(); }));
    $('sAdhanList').addEventListener('click', (e) => {
      const b = e.target.closest('[data-mode]');
      if (b) { s.adhan.prayers[b.dataset.prayer] = b.dataset.mode; save(); }
    });
    document.querySelectorAll('.s-remind').forEach((box) => box.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-prayer]'), k = box.dataset.for;
      if (!li) return;
      const p = li.dataset.prayer;
      if (e.target.closest('[data-toggle]')) s[k].prayers[p] = !s[k].prayers[p];
      else {
        const b = e.target.closest('[data-step]');
        if (!b) return;
        s[k].mins[p] = Math.min(Number(box.dataset.max), Math.max(Number(box.dataset.min), s[k].mins[p] + Number(b.dataset.step)));
      }
      save();
    }));
    $('sSilList').addEventListener('click', (e) => {
      const li = e.target.closest('li[data-prayer]');
      if (!li) return;
      const p = li.dataset.prayer, b = e.target.closest('[data-step]');
      if (e.target.closest('[data-toggle]')) s.silent.prayers[p] = !s.silent.prayers[p];
      else if (b) {
        const f = b.closest('[data-field]').dataset.field;
        s.silent[f][p] = Math.min(SIL[f][1], Math.max(SIL[f][0], s.silent[f][p] + Number(b.dataset.step)));
      } else return;
      save();
    });

    /* ---- time format: 12-hour or 24-hour ---- */
    const clockBtns = document.querySelectorAll('[data-clock]');
    const showClock = () => clockBtns.forEach((b) => b.setAttribute('aria-checked', String((b.dataset.clock === '24') === HIUK.clock24())));
    showClock();
    clockBtns.forEach((b) => b.addEventListener('click', () => {
      HIUK.clock24(b.dataset.clock === '24');
      showClock(); show();
      A.sync();   // the alerts' texts carry times too
    }));

    /* ---- text size ---- */
    const textBtns = document.querySelectorAll('[data-text-size]');
    const showText = (size) => textBtns.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.textSize === size)));
    showText(HIUK.textSize());
    textBtns.forEach((b) => b.addEventListener('click', () => showText(HIUK.textSize(b.dataset.textSize))));

    /* ---- try the Adhan ---- */
    let trying = false;
    const trySet = (on) => { trying = on; $('sTry').querySelector('span').textContent = on ? 'Stop' : 'Play the Adhan'; $('sTry').setAttribute('aria-pressed', String(on)); };
    $('sTry').addEventListener('click', () => {
      if (trying) A.stop();
      else { trySet(true); A.preview('adhan', () => trySet(false)); }
    });

    /* ---- the next few alerts ---- */
    const KIND = { adhan: ['mosque', 'Adhan'], alert: ['mosque', 'Alert'], jamaah: ['clock', "Jama'ah reminder"], qadha: ['bell', 'Qadha reminder'], silent: ['silent', 'Auto silent mode'] };
    function showNext() {
      HIUK.times.ready.then(() => {
        const now = new Date(), from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const hm = (d) => fmt12(pad(d.getHours()) + ':' + pad(d.getMinutes()));
        // (silent mode only happens in the app)
        const quiet = (A.silentNative() ? A.silentPlan(from, 3) : []).map((q) => ({ kind: 'silent', at: q.start, title: `${q.title}: silent until ${hm(q.end)}` }));
        const list = A.plan(from, 3).concat(quiet).filter((a) => a.at > now).sort((a, b) => a.at - b.at).slice(0, 6);
        $('sNext').innerHTML = list.length ? list.map((a) => {
          const day = sameDay(a.at, now) ? 'Today' : sameDay(a.at, addDays(now, 1)) ? 'Tomorrow' : HIUK.util.dateText(a.at, { weekday: 'short' });
          return `<li>${HIUK.icon(KIND[a.kind][0])}<span><b>${esc(a.title.split('\n')[0])}</b><small>${KIND[a.kind][1]}</small></span><time class="tnum">${day}<b>${fmt12(pad(a.at.getHours()) + ':' + pad(a.at.getMinutes()))}</b></time></li>`;
        }).join('') : '<li class="s-none">All alerts are off.</li>';
      });
    }

    show();
    // keep the list current while the screen is open
    v.every(showNext, 60000);
  });
})();
