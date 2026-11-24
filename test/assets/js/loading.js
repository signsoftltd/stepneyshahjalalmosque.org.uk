/* Hefazothe Islam UK: the loading screen (theme.css "Loading screen"). Marks the page ready once it is built and its
   fonts are in (at most 1.5 seconds; not waiting for pictures), and shows the loading screen again while going to
   another page of the website. Loaded at the end of every page (footer.php). */
(function () {
  'use strict';
  var root = document.documentElement;

  function ready() {
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fonts, new Promise(function (r) { setTimeout(r, 1500); })]).then(function () {
      requestAnimationFrame(function () { root.classList.add('pl-ready'); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download') || a.hasAttribute('data-bs-toggle')) return;
    if (a.origin !== location.origin) return;                         // other websites, tel:, mailto:
    if (a.pathname === location.pathname && a.search === location.search) return; // a section of this page
    // after every other click handler: one that handles the link itself (a popup, the donation app) cancels it
    setTimeout(function () {
      if (e.defaultPrevented) return;
      root.classList.add('pl-leaving');
      setTimeout(function () { root.classList.remove('pl-leaving'); }, 8000); // a link that doesn't leave the page
    }, 0);
  });
  // back to a page kept in memory (the browser's back button): no loading screen
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { root.classList.remove('pl-leaving'); root.classList.add('pl-ready'); }
  });
})();
