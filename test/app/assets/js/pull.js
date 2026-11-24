/* Hefazothe Islam UK app: pull down to refresh the prayer data (home and Time screens).
   From the top of the screen, pulling down past READY and letting go fetches the timetable and Hijri dates again,
   then sends the 'hiuk:times' event on document: the screens redraw, makrooh.js fetches its times, alerts.js
   schedules the alerts again. Offline, what is saved stays as it is and a message says so. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const READY = 60, MAX = 90, LOCK = 6;
    const el = document.createElement('div');
    el.className = 'pull';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<i></i>';
    document.body.appendChild(v.own(el));
    const ring = el.firstChild;

    let g = null, busy = false;   // the gesture: { x0, y0, pulling, d }
    function place(d) {
      el.style.transform = `translateY(${d + 4}px)`;
      el.style.opacity = Math.min(1, d / READY).toFixed(2);
      ring.style.transform = `rotate(${d * 4}deg)`;
      el.classList.toggle('is-ready', d >= READY);
    }
    function clear(...classes) {
      el.classList.remove(...classes);
      el.style.transform = el.style.opacity = ring.style.transform = '';
    }
    function refresh() {
      busy = true;
      el.classList.add('is-busy');
      clear('is-pulling', 'is-ready');
      const seen = new Promise((r) => setTimeout(r, 500));   // long enough to see that it did something
      Promise.all([HIUK.times.refresh(), HIUK.hijri.refresh(), seen]).then(() => {
        document.dispatchEvent(new Event('hiuk:times'));
        HIUK.toast('Prayer times updated');
      }, () => HIUK.toast("Couldn't update. Check your internet.")).then(() => {
        busy = false;
        el.classList.remove('is-busy');
      });
    }

    v.on(document, 'touchstart', (e) => {
      g = null;
      if (busy || e.touches.length !== 1 || window.scrollY > 0) return;
      if (document.querySelector('.pop:not([hidden]), .sheet:not([hidden]), .drawer.is-open')) return;
      g = { x0: e.touches[0].clientX, y0: e.touches[0].clientY, pulling: false, d: 0 };
    }, { passive: true });
    v.on(document, 'touchmove', (e) => {
      if (!g) return;
      const t = e.touches[0], dx = t.clientX - g.x0, dy = t.clientY - g.y0;
      if (!g.pulling) {
        if (Math.abs(dx) < LOCK && Math.abs(dy) < LOCK) return;
        // scrolling up, or a swipe sideways (the side menu, the timetable's days): not a pull
        if (dy <= 0 || Math.abs(dx) >= dy || window.scrollY > 0) { g = null; return; }
        g.pulling = true;
        g.y0 = t.clientY;
        el.classList.add('is-pulling');
      }
      g.d = Math.min(MAX, Math.max(0, (t.clientY - g.y0) * 0.5));
      place(g.d);
      if (e.cancelable) e.preventDefault();   // the finger is moving the pull (not the page)
    }, { passive: false });
    const end = (e) => {
      const s = g;
      g = null;
      if (!s || !s.pulling) return;
      if (e.type === 'touchend' && s.d >= READY) refresh();
      else clear('is-pulling', 'is-ready');
    };
    v.on(document, 'touchend', end, { passive: true });
    v.on(document, 'touchcancel', end, { passive: true });
  });
})();
