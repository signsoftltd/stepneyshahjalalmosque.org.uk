/* Back-to-top button and scroll reveal */
(function () {
  'use strict';
  /* Close the Bootstrap offcanvas menu when a link inside it is used (data-bs-dismiss would target the link's #anchor instead). */
  var mnav = document.getElementById('mnav');
  if (mnav && window.bootstrap) mnav.addEventListener('click', function (e) { if (e.target.closest('a[href]')) window.bootstrap.Offcanvas.getOrCreateInstance(mnav).hide(); });
  // the mobile menu is hidden on wide screens (theme.css); close it properly if the window is widened while it is open
  var wide = window.matchMedia && window.matchMedia('(min-width: 1200px)');
  if (mnav && wide && window.bootstrap) wide.addEventListener('change', function (e) { var m = window.bootstrap.Offcanvas.getInstance(mnav); if (e.matches && m) m.hide(); });
  /* Bootstrap adds the dark layer behind a pop-up as a separate element, so it can't be styled through the
     pop-up's own classes: give it our class (site-backdrop, plus the pop-up's data-backdrop-class if any)
     as soon as it is added, and style that in theme.css instead of Bootstrap's .modal-backdrop. */
  var nextBackdrop = '';
  document.addEventListener('show.bs.modal', function (e) { nextBackdrop = (e.target.dataset && e.target.dataset.backdropClass) || ''; });
  if (window.MutationObserver) new MutationObserver(function (list) {
    list.forEach(function (m) {
      Array.prototype.forEach.call(m.addedNodes, function (n) {
        if (n.nodeType === 1 && n.classList.contains('modal-backdrop')) { n.classList.add('site-backdrop'); if (nextBackdrop) n.classList.add(nextBackdrop); }
      });
    });
  }).observe(document.body, { childList: true });
  /* Links to the old home page contact section (e.g. "#contact" in content from the admin panel)
     go to the contact page, since the contact section now lives on the contact page. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    if (/^(\.\/|index\.html)?#contact$/.test(a.getAttribute('href')) && !document.getElementById('contact')) {
      e.preventDefault();
      window.location.href = 'contact';
    }
  });
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Back to top ---- */
  var C = 2 * Math.PI * 24;
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'to-top'; btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg class="ring" viewBox="0 0 54 54" aria-hidden="true"><circle class="bg" cx="27" cy="27" r="24"/><circle class="fg" cx="27" cy="27" r="24" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/></svg><svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(btn);
  var fg = btn.querySelector('.fg'), tick = false;

  /* Height taken by bars fixed to the bottom of the screen (e.g. the donation app's sticky donate
     bar, whose height we don't control, and the Zakat page's summary bar), including bars stacked
     on top of each other. Looks at what is drawn along the bottom edge, then just above each bar.
     Shared: zakat.js uses it too. `exclude` is an element to ignore (the caller itself). */
  window.HIUK_bottomBars = function (exclude) {
    var h = window.innerHeight, y = h - 2, total = 0;
    for (var level = 0; level < 3; level++) {
      var found = null;
      // the first level also looks a little higher up, for buttons that float above the edge
      var probes = [];
      [0.25, 0.5, 0.92].forEach(function (fx) {
        (level === 0 ? [h - 2, h - 16, h - 32, h - 46] : [y]).forEach(function (py) { probes.push([fx, py]); });
      });
      probes.forEach(function (p) {
        var fx = p[0], y = p[1];
        // everything at this point, top first; skip the caller and this button so we can see what's underneath them
        var stack = document.elementsFromPoint ? document.elementsFromPoint(Math.round(window.innerWidth * fx), y) : [document.elementFromPoint(Math.round(window.innerWidth * fx), y)];
        var el = null;
        for (var i = 0; i < stack.length; i++) {
          var s = stack[i];
          if (!s || s === btn || btn.contains(s) || (exclude && (s === exclude || exclude.contains(s)))) continue;
          el = s; break;
        }
        for (; el && el !== document.body && el !== root; el = el.parentElement) {
          if (el.closest('.ck-banner, .modal, .offcanvas')) break;
          var pos = getComputedStyle(el).position;
          if (pos === 'fixed' || pos === 'sticky') {
            var r = el.getBoundingClientRect();
            // a bar or floating button (e.g. the donation app's "Quick Donate" pill): at least 120px wide,
            // reaches the line we're probing, not taller than a third of the screen
            // keep whichever reaches highest
            if (r.width >= 120 && r.bottom >= y - 4 && r.top < y && r.height < h / 3 && (!found || r.top < found.top)) found = r;
            break;
          }
        }
      });
      if (!found) break;
      total = Math.ceil(h - found.top);
      y = found.top - 2; // look for another bar sitting on top of this one
    }
    return total;
  };
  var lift = -1;
  function placeButton() {
    var bar = window.HIUK_bottomBars();
    if (bar === lift) return;
    lift = bar;
    // CSS keeps its usual 20px / 14px gap; with a bar, sit that gap above the bar instead
    btn.style.bottom = bar ? 'calc(' + bar + 'px + ' + (window.innerWidth <= 560 ? 14 : 20) + 'px)' : '';
  }

  function onScroll() {
    tick = false;
    var y = window.scrollY, max = Math.max(1, root.scrollHeight - window.innerHeight);
    btn.classList.toggle('is-shown', y > 600);
    fg.style.strokeDashoffset = (C * (1 - Math.min(1, y / max))).toFixed(1);
    placeButton();
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', function () { lift = -1; placeButton(); });
  // the donation bar is added by another script after the page loads, so check again shortly
  [800, 2000, 4500].forEach(function (ms) { setTimeout(placeButton, ms); });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    var t = document.getElementById('top') || document.querySelector('.site-header a'); if (t) { try { t.focus({ preventScroll: true }); } catch (e) {} }
  });
  onScroll();

  /* ---- Section reveal ---- */
  if (reduce || !('IntersectionObserver' in window)) return;
  var targets = [];
  Array.prototype.forEach.call(document.querySelectorAll('main > section:not(.hero):not(.pol-hero), main > section .container'), function () {});
  Array.prototype.forEach.call(document.querySelectorAll('main > section:not(.hero):not(.pol-hero):not(.daystrip)'), function (sec) {
    var box = sec.querySelector(':scope > .container') || sec;
    Array.prototype.forEach.call(box.children, function (c) {
      var cs = getComputedStyle(c), kids = c.children;
      if (c.classList.contains('pattern')) return;
      if ((cs.display === 'grid' || c.classList.contains('row')) && kids.length > 2 && kids.length <= 12 && !c.classList.contains('pol') && !c) {
        Array.prototype.forEach.call(kids, function (k, i) { k.style.setProperty('--d', Math.min(i, 6) * 80 + 'ms'); targets.push(k); });
      } else if (c.classList.contains('faq-row') || c.classList.contains('pol-row')) {
        Array.prototype.forEach.call(kids, function (k, i) { k.style.setProperty('--d', i * 100 + 'ms'); targets.push(k); });
      } else targets.push(c);
    });
  });
  var daystrip = document.querySelector('.daystrip'); if (daystrip) targets.push(daystrip);
  root.classList.add('js');
  targets.forEach(function (t) { t.classList.add('rv'); });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(function (t) { io.observe(t); });
  /* Safety net: never leave content hidden */
  setTimeout(function () { targets.forEach(function (t) { var r = t.getBoundingClientRect(); if (r.top < window.innerHeight) t.classList.add('in'); }); }, 1200);
})();
