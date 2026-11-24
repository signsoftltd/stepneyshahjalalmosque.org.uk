/* Hefazothe Islam UK app: Tasbih. A dhikr counter for five dhikr, each with its own count and target (kept on the
   phone, so leaving the screen loses nothing). "Save" adds the count to the history and starts again.
   Audio: plays assets/audio/<id>.mp3 if the file is there; otherwise the phone's Arabic voice, where it has one. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const { esc, pad } = HIUK.util;
    const $ = (id) => document.getElementById(id);

    const DHIKR = [
      // the name of Allah is written plainly (الله, لله) so the font draws it as one word
      { id: 'subhanallah', ar: 'سُبْحَانَ الله', name: 'SubhanAllah', en: 'Glory be to Allah' },
      { id: 'alhamdulillah', ar: 'الْحَمْدُ لله', name: 'Alhamdulillah', en: 'All praise is for Allah' },
      { id: 'allahuakbar', ar: 'الله أَكْبَرُ', name: 'Allahu Akbar', en: 'Allah is the Greatest' },
      { id: 'lailahaillallah', ar: 'لَا إِلَٰهَ إِلَّا الله', name: 'La ilaha illallah', en: 'There is no god but Allah' },
      { id: 'astaghfirullah', ar: 'أَسْتَغْفِرُ الله', name: 'Astaghfirullah', en: 'I seek the forgiveness of Allah' }
    ];
    const byId = (id) => DHIKR.find((d) => d.id === id) || DHIKR[0];
    const TARGETS = [33, 34, 99, 100, 500, 1000];
    const STATE_KEY = 'hiuk_tasbih', HIST_KEY = 'hiuk_tasbih_history', HIST_MAX = 1000;

    const saved = HIUK.store.get(STATE_KEY) || {};
    const state = { current: byId(saved.current).id, counts: saved.counts || {}, targets: saved.targets || {}, vibrate: saved.vibrate !== false };
    let history = HIUK.store.get(HIST_KEY) || [];   // [{ id, count, target, at }] newest first
    const keep = () => HIUK.store.set(STATE_KEY, state);
    const count = () => state.counts[state.current] || 0;
    const target = () => state.targets[state.current] || 33;
    const canVibrate = HIUK.canHaptic();
    const buzz = (p) => { if (canVibrate && state.vibrate) HIUK.haptic(p); };
    const num = (n) => n.toLocaleString('en-GB');

    /* ---- dhikr picker ---- */
    $('tPick').innerHTML = DHIKR.map((d) => `<button class="t-chip" type="button" role="radio" data-id="${d.id}"><span lang="ar" dir="rtl">${esc(d.ar)}</span><small>${esc(d.name)}</small></button>`).join('');
    $('tPick').addEventListener('click', (e) => {
      const b = e.target.closest('[data-id]');
      if (!b || b.dataset.id === state.current) return;
      stopAudio();
      state.current = b.dataset.id;
      keep();
      show();
      b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });

    /* ---- the counter ---- */
    function show() {
      const d = byId(state.current), n = count(), t = target();
      document.querySelectorAll('.t-chip').forEach((c) => c.setAttribute('aria-checked', String(c.dataset.id === d.id)));
      $('tAr').textContent = d.ar;
      $('tName').textContent = d.name;
      $('tEn').textContent = d.en;
      $('tTargetVal').textContent = num(t);
      $('tTap').setAttribute('aria-label', `Count ${d.name}`);
      showCount();
    }
    function showCount() {
      const n = count(), t = target(), rounds = Math.floor(n / t), done = n >= t;
      $('tCount').textContent = num(n);
      $('tOf').textContent = 'of ' + num(t);
      // the ring fills towards the target, then again for each further round
      const part = n === 0 ? 0 : (n % t === 0 ? 100 : (n % t) / t * 100);
      $('tRing').style.strokeDasharray = `${part.toFixed(2)} 100`;
      $('tRound').hidden = rounds < 1;
      $('tRound').textContent = rounds === 1 ? 'Target reached' : `Target × ${rounds}`;
      $('tTap').classList.toggle('is-done', done);
      $('tHint').textContent = done ? 'Keep going, or save to your history' : 'Tap the circle to count';
      $('tUndo').disabled = n === 0;
    }
    function setCount(n) { state.counts[state.current] = Math.max(0, n); keep(); showCount(); }

    $('tTap').addEventListener('click', () => {
      const n = count() + 1;
      setCount(n);
      if (n % target() === 0) {
        buzz([90, 70, 90]);
        HIUK.toast(n === target() ? `Target reached: ${num(n)} ${byId(state.current).name}` : `${num(n)} ${byId(state.current).name}`);
      } else buzz(15);
      // a small pulse on each count
      const c = $('tTap');
      c.classList.remove('pulse'); void c.offsetWidth; c.classList.add('pulse');
    });
    $('tUndo').addEventListener('click', () => { if (count() > 0) setCount(count() - 1); });

    /* ---- vibrate setting (phones that can: Android, and the iOS app) ---- */
    if (canVibrate) {
      $('tVibe').hidden = false;
      $('tVibe').setAttribute('aria-checked', String(state.vibrate));
      $('tVibe').addEventListener('click', () => {
        state.vibrate = !state.vibrate; keep();
        $('tVibe').setAttribute('aria-checked', String(state.vibrate));
      });
    }

    /* ---- bottom sheet ---- */
    let sheetFocus = null;
    function openSheet(title, html) {
      sheetFocus = document.activeElement;
      $('tSheetTitle').textContent = title;
      $('tSheetBody').innerHTML = html;
      $('tSheet').hidden = false;
      requestAnimationFrame(() => $('tSheet').classList.add('is-open'));
      const first = $('tSheetBody').querySelector('input,button');
      if (first) first.focus();
    }
    function closeSheet() {
      if ($('tSheet').hidden) return;
      $('tSheet').classList.remove('is-open');
      setTimeout(() => { $('tSheet').hidden = true; }, 220);
      if (sheetFocus && sheetFocus.focus) sheetFocus.focus();
    }
    // confirm with our own window (alert/confirm are not shown in every webview)
    function ask(title, text, okLabel, onOk) {
      openSheet(title, `<p class="sheet-text">${esc(text)}</p>
        <div class="sheet-actions"><button class="btn-line" type="button" data-sheet-close>Cancel</button><button class="btn-main btn-danger" type="button" data-ok>${esc(okLabel)}</button></div>`);
      $('tSheetBody').querySelector('[data-ok]').addEventListener('click', () => { closeSheet(); onOk(); });
    }
    $('tSheet').addEventListener('click', (e) => { if (e.target.closest('[data-sheet-close]')) closeSheet(); });
    v.on(document, 'keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

    /* ---- target ---- */
    $('tTarget').addEventListener('click', () => {
      const t = target();
      openSheet('Set a target', `
        <p class="sheet-text">How many times for ${esc(byId(state.current).name)}?</p>
        <div class="t-targets">${TARGETS.map((n) => `<button type="button" data-t="${n}" aria-pressed="${n === t}">${num(n)}</button>`).join('')}</div>
        <form class="t-own" id="tOwn" novalidate>
          <label for="tOwnVal">Your own</label>
          <input id="tOwnVal" type="number" inputmode="numeric" min="1" max="100000" step="1" placeholder="e.g. 70" value="${TARGETS.includes(t) ? '' : t}">
          <button class="btn-main" type="submit">Set</button>
        </form>`);
      const set = (n) => {
        if (!(n >= 1 && n <= 100000)) { HIUK.toast('Choose a number from 1 to 100,000'); return; }
        state.targets[state.current] = n; keep(); show(); closeSheet();
      };
      $('tSheetBody').querySelectorAll('[data-t]').forEach((b) => b.addEventListener('click', () => set(Number(b.dataset.t))));
      $('tOwn').addEventListener('submit', (e) => { e.preventDefault(); set(Math.round(Number($('tOwnVal').value))); });
    });

    /* ---- reset and save ---- */
    $('tReset').addEventListener('click', () => {
      const n = count();
      if (!n) { HIUK.toast('The count is already 0'); return; }
      ask('Reset the count?', `${num(n)} ${byId(state.current).name} will be cleared without saving.`, 'Reset', () => setCount(0));
    });
    $('tSave').addEventListener('click', () => {
      const n = count();
      if (!n) { HIUK.toast('Count first, then save'); return; }
      history.unshift({ id: state.current, count: n, target: target(), at: new Date().toISOString() });
      if (history.length > HIST_MAX) history.length = HIST_MAX;
      HIUK.store.set(HIST_KEY, history);
      setCount(0);
      view.at = startOf('day', new Date());
      showHistory();
      buzz(30);
      HIUK.toast(`Saved: ${num(n)} ${byId(state.current).name}`);
    });

    /* ---- history: by day, month or year, with statistics ---- */
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayKey = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    const sameDay = HIUK.util.sameDay;
    const startOf = (by, d) => by === 'day' ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : by === 'month' ? new Date(d.getFullYear(), d.getMonth(), 1) : new Date(d.getFullYear(), 0, 1);
    const step = (by, d, n) => by === 'day' ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + n) : by === 'month' ? new Date(d.getFullYear(), d.getMonth() + n, 1) : new Date(d.getFullYear() + n, 0, 1);
    const view = { by: ['day', 'month', 'year'].includes(saved.view) ? saved.view : 'day', at: startOf('day', new Date()) };
    let picked = -1;   // the bar tapped in the month / year chart

    function periodLabel(by, d) {
      if (by === 'year') return String(d.getFullYear());
      if (by === 'month') return MONTHS[d.getMonth()] + ' ' + d.getFullYear();
      const now = new Date(), text = HIUK.util.dateText(d, { day: 'numeric', month: 'long', year: 'numeric' });
      if (sameDay(d, now)) return 'Today, ' + text;
      if (sameDay(d, HIUK.util.addDays(now, -1))) return 'Yesterday, ' + text;
      return HIUK.util.dateText(d, { weekday: 'short' }) + ' ' + text;
    }
    const sum = (list) => list.reduce((s, h) => s + h.count, 0);
    const tile = (label, value, sub) => `<div><small>${esc(label)}</small><b class="tnum">${value}</b>${sub ? `<span>${sub}</span>` : ''}</div>`;
    // days in a row with something saved, up to today (or yesterday, if nothing yet today)
    function streak() {
      const days = new Set(history.map((h) => dayKey(new Date(h.at))));
      let d = new Date(), n = 0;
      if (!days.has(dayKey(d))) d = HIUK.util.addDays(d, -1);
      while (days.has(dayKey(d))) { n++; d = HIUK.util.addDays(d, -1); }
      return n;
    }

    function showHistory() {
      $('tClear').hidden = !history.length;
      const s = streak();
      $('tLife').innerHTML = history.length
        ? `All time: <b class="tnum">${num(sum(history))}</b> recited in ${num(history.length)} ${history.length === 1 ? 'session' : 'sessions'}${s ? ` · <span><b class="tnum">${s}</b>-day streak</span>` : ''}`
        : 'Saved counts appear here. Count, then tap <b>Save</b>.';
      document.querySelectorAll('.t-seg [data-view]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === view.by)));

      const by = view.by, start = startOf(by, view.at), end = step(by, start, 1), now = new Date();
      const list = history.map((h, i) => Object.assign({ i, d: new Date(h.at) }, h)).filter((h) => h.d >= start && h.d < end);
      $('tPeriod').textContent = periodLabel(by, start);
      const first = history.length ? startOf(by, new Date(history[history.length - 1].at)) : startOf(by, now);
      $('tPrev').disabled = start <= first;
      $('tNext').disabled = end > now;

      // statistics: days so far in this period (the current month or year isn't over yet)
      const total = sum(list), met = list.filter((h) => h.count >= h.target).length;
      const daysSoFar = Math.max(1, Math.round((Math.min(end, startOf('day', HIUK.util.addDays(now, 1))) - start) / 864e5));
      const active = new Set(list.map((h) => dayKey(h.d))).size;
      let tiles;
      if (by === 'day') {
        const kinds = new Set(list.map((h) => h.id)).size;
        tiles = tile('Recited', num(total)) + tile('Sessions', num(list.length)) + tile('Targets met', num(met)) + tile('Dhikr', `${kinds}<i> of ${DHIKR.length}</i>`);
      } else {
        // the bars: one per day of the month, or per month of the year
        const bins = by === 'month' ? new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate() : 12;
        const vals = new Array(bins).fill(0), sess = new Array(bins).fill(0);
        list.forEach((h) => { const k = by === 'month' ? h.d.getDate() - 1 : h.d.getMonth(); vals[k] += h.count; sess[k]++; });
        const best = vals.indexOf(Math.max(...vals));
        const binName = (k, long) => by === 'month' ? HIUK.util.dateText(new Date(start.getFullYear(), start.getMonth(), k + 1), { weekday: long ? 'long' : 'short', day: 'numeric', month: long ? 'long' : 'short' }) : (long ? MONTHS[k] + ' ' + start.getFullYear() : MONTHS[k].slice(0, 3));
        tiles = tile('Recited', num(total)) + tile('Days active', `${active}<i> of ${daysSoFar}</i>`) +
          tile('Average a day', num(Math.round(total / daysSoFar))) +
          tile(by === 'month' ? 'Best day' : 'Best month', total ? num(vals[best]) : '—', total ? esc(binName(best)) : '');
        showChart(by, vals, sess, binName, start, now);
      }
      $('tStats').innerHTML = tiles;
      if (by === 'day') $('tChart').hidden = true;

      // by dhikr, in the usual order; bar lengths are the share of the period's total
      const per = DHIKR.map((d) => ({ d, n: sum(list.filter((h) => h.id === d.id)) })).filter((x) => x.n);
      const top = Math.max(1, ...per.map((x) => x.n));
      $('tBreak').innerHTML = per.length ? `<h4 class="t-sub">By dhikr</h4><ul class="t-break">${per.map((x) => `<li>
          <span class="t-row-ar" lang="ar" dir="rtl">${esc(x.d.ar)}</span>
          <span class="t-break-main"><span><b>${esc(x.d.name)}</b><span class="tnum">${num(x.n)} <small>${Math.round(x.n / total * 100)}%</small></span></span><i class="t-bar"><i style="width:${(x.n / top * 100).toFixed(1)}%"></i></i></span>
        </li>`).join('')}</ul>`
        : `<p class="t-empty">Nothing saved ${by === 'day' ? (sameDay(start, now) ? 'today yet' : 'on this day') : 'in ' + periodLabel(by, start)}.</p>`;

      // the day's sessions, newest first
      $('tList').innerHTML = by === 'day' && list.length ? `<h4 class="t-sub">Sessions</h4><ul class="t-rows">${list.map((h) => {
        const x = byId(h.id), done = h.count >= h.target, time = HIUK.util.fmtTime(h.d);
        return `<li>
          <span class="t-row-ar" lang="ar" dir="rtl">${esc(x.ar)}</span>
          <span class="t-row-main"><b>${esc(x.name)}</b><small>${time} · target ${num(h.target)}</small></span>
          <span class="t-row-n tnum${done ? ' is-done' : ''}">${num(h.count)}${done ? HIUK.icon('check') : ''}</span>
          <button class="t-del" type="button" data-del="${h.i}" aria-label="Delete ${num(h.count)} ${esc(x.name)} at ${time}">${HIUK.icon('close')}</button>
        </li>`;
      }).join('')}</ul>` : '';
    }

    function showChart(by, vals, sess, binName, start, now) {
      const max = Math.max(...vals), chart = $('tChart');
      chart.hidden = false;
      const isNow = (k) => by === 'month' ? sameDay(new Date(start.getFullYear(), start.getMonth(), k + 1), now) : start.getFullYear() === now.getFullYear() && k === now.getMonth();
      const label = (k) => by === 'year' ? MONTHS[k].slice(0, 3) : ([0, 7, 14, 21, 28].includes(k) ? k + 1 : '');
      if (picked >= vals.length) picked = -1;
      const read = picked < 0
        ? `<span class="t-read-hint">${max ? 'Tap a bar to see the ' + (by === 'month' ? 'day' : 'month') : 'Nothing saved yet in this ' + by}</span>`
        : `<span><b>${esc(binName(picked, true))}</b> · <span class="tnum">${num(vals[picked])}</span> recited${sess[picked] ? ` in ${sess[picked]} ${sess[picked] === 1 ? 'session' : 'sessions'}` : ''}</span>` +
          (vals[picked] ? `<button type="button" class="t-open" data-open="${picked}">View ${by === 'month' ? 'day' : 'month'}${HIUK.icon('chev')}</button>` : '');
      chart.innerHTML = `<div class="t-read" aria-live="polite">${read}</div>
        <div class="t-plot${by === 'year' ? ' is-year' : ''}">
          ${max ? `<span class="t-max tnum">${num(max)}</span>` : ''}
          ${vals.map((v, k) => `<button type="button" class="t-col${k === picked ? ' is-picked' : ''}${isNow(k) ? ' is-now' : ''}" data-bin="${k}" aria-label="${esc(binName(k, true))}: ${num(v)}"><i style="height:${max && v ? Math.max(3, v / max * 100).toFixed(1) : 0}%"></i><small>${label(k)}</small></button>`).join('')}
        </div>`;
    }
    $('tChart').addEventListener('click', (e) => {
      const bar = e.target.closest('[data-bin]'), open = e.target.closest('[data-open]');
      if (open) {
        const k = Number(open.dataset.open), s = startOf(view.by, view.at);
        view.at = view.by === 'month' ? new Date(s.getFullYear(), s.getMonth(), k + 1) : new Date(s.getFullYear(), k, 1);
        setView(view.by === 'month' ? 'day' : 'month');
      } else if (bar) { picked = Number(bar.dataset.bin) === picked ? -1 : Number(bar.dataset.bin); showHistory(); }
    });
    function setView(by) { view.by = by; picked = -1; state.view = by; keep(); showHistory(); }
    document.querySelector('.t-seg').addEventListener('click', (e) => {
      const b = e.target.closest('[data-view]');
      if (b && b.dataset.view !== view.by) setView(b.dataset.view);
    });
    $('tPrev').addEventListener('click', () => { view.at = step(view.by, startOf(view.by, view.at), -1); picked = -1; showHistory(); });
    $('tNext').addEventListener('click', () => { view.at = step(view.by, startOf(view.by, view.at), 1); picked = -1; showHistory(); });
    $('tList').addEventListener('click', (e) => {
      const b = e.target.closest('[data-del]');
      if (!b) return;
      const h = history[Number(b.dataset.del)];
      if (!h) return;
      ask('Delete this recitation?', `${num(h.count)} ${byId(h.id).name} will be removed from your history.`, 'Delete', () => {
        history = history.filter((x) => x !== h);
        HIUK.store.set(HIST_KEY, history);
        showHistory();
      });
    });
    $('tClear').addEventListener('click', () => {
      ask('Clear your history?', `All ${num(history.length)} saved recitations will be removed. This can't be undone.`, 'Clear all', () => {
        history = []; HIUK.store.set(HIST_KEY, history); showHistory();
      });
    });

    /* ---- audio ---- */
    let audio = null, run = 0;   // run: changes on each Listen / Stop, so a finished old one doesn't repeat
    const isPlaying = () => $('tListen').getAttribute('aria-pressed') === 'true';
    const playing = (on) => {
      $('tListen').setAttribute('aria-pressed', String(on));
      $('tListen').querySelector('span').textContent = on ? 'Stop' : 'Listen';
    };
    function stopAudio() {
      run++;
      if (audio) { audio.pause(); audio = null; }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      playing(false);
    }
    function speak(d, r) {
      const tts = window.speechSynthesis;
      if (!tts || typeof SpeechSynthesisUtterance !== 'function') { HIUK.toast('Audio is not available on this device'); playing(false); return; }
      const voices = tts.getVoices(), voice = voices.find((v) => /^ar/i.test(v.lang));
      if (voices.length && !voice) { HIUK.toast('No Arabic voice on this device'); playing(false); return; }
      const u = new SpeechSynthesisUtterance(d.ar);
      u.lang = voice ? voice.lang : 'ar-SA';
      if (voice) u.voice = voice;
      u.rate = 0.8;
      u.onend = () => {
        if (r !== run) return;
        // repeat on: say it again after a short pause
        if (state.repeat && isPlaying()) setTimeout(() => { if (r === run && isPlaying()) speak(d, r); }, 700);
        else playing(false);
      };
      u.onerror = () => { if (r === run) playing(false); };
      tts.cancel();
      tts.speak(u);
    }

    /* ---- repeat: the recitation plays again and again until Stop ---- */
    const showRepeat = () => {
      $('tRepeat').setAttribute('aria-pressed', String(!!state.repeat));
      $('tRepeat').setAttribute('aria-label', state.repeat ? 'Repeat is on' : 'Repeat is off');
    };
    $('tRepeat').addEventListener('click', () => {
      state.repeat = !state.repeat;
      keep();
      showRepeat();
      if (audio) audio.loop = !!state.repeat;
      HIUK.toast(state.repeat ? 'Repeat on: plays until you stop it' : 'Repeat off');
    });
    showRepeat();
    $('tListen').addEventListener('click', () => {
      if (isPlaying()) { stopAudio(); return; }
      const d = byId(state.current), r = ++run;
      playing(true);
      const a = (audio = new Audio(`assets/audio/${d.id}.mp3`));
      a.loop = !!state.repeat;
      a.addEventListener('ended', () => { if (audio === a) { audio = null; playing(false); } });
      // no recording in the app: use the phone's voice
      a.addEventListener('error', () => { if (audio === a) { audio = null; speak(d, r); } });
      a.play().catch((err) => { if (audio === a && err && err.name !== 'AbortError') { audio = null; speak(d, r); } });
    });
    if (window.speechSynthesis) window.speechSynthesis.getVoices(); // starts loading the voices list

    show();
    showHistory();
    // bring the chosen dhikr into view in the row (without scrolling the page)
    const chip = document.querySelector('.t-chip[aria-checked="true"]'), row = $('tPick');
    row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
    // the history's "Today" changes at midnight
    v.on(document, 'visibilitychange', () => { if (!document.hidden) showHistory(); else stopAudio(); });
    // going to another screen stops the recitation
    v.cleanup(() => { run++; if (audio) { audio.pause(); audio = null; } if (window.speechSynthesis) window.speechSynthesis.cancel(); });
  });
})();
