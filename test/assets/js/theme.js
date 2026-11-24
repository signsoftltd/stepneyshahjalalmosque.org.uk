/* Stepney Shah Jalal Mosque: light / dark mode. Load in <head> (before the page draws) so the right theme
   shows straight away. Light (day) mode, whatever the device is set to, until the visitor picks a theme with a .theme-btn.
   The choice is remembered permanently only if the visitor allowed "Preferences" in the cookie
   banner; otherwise it lasts until the browser is closed. */
(function () {
  'use strict';
  var KEY = 'hiuk-theme', root = document.documentElement;
  function chosen() {
    try { return localStorage.getItem(KEY) || sessionStorage.getItem(KEY); } catch (e) { return null; }
  }
  function current() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }

  function updateButtons() {
    var dark = current() === 'dark';
    var label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    Array.prototype.forEach.call(document.querySelectorAll('.theme-btn'), function (b) {
      b.setAttribute('aria-label', label);
      b.setAttribute('title', label);
      var text = b.querySelector('.theme-label');
      if (text) text.textContent = dark ? 'Light mode' : 'Dark mode';
    });
  }
  function apply(theme) {
    root.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    updateButtons();
  }
  function save(theme) {
    try {
      if (window.HIUK_CONSENT && window.HIUK_CONSENT.allows('prefs')) {
        localStorage.setItem(KEY, theme);
        sessionStorage.removeItem(KEY);
      } else {
        sessionStorage.setItem(KEY, theme);
      }
    } catch (e) {}
  }

  // day mode unless the visitor picked dark (the device's dark setting is not followed)
  apply(chosen() || 'light');

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.theme-btn')) return;
    var next = current() === 'dark' ? 'light' : 'dark';
    apply(next);
    save(next);
  });

  // cookie banner choice changed: keep or drop the long-term copy accordingly
  document.addEventListener('hiuk:consent', function (e) {
    var t = chosen();
    try {
      if (e.detail && e.detail.prefs) { if (t) save(t); }
      else { localStorage.removeItem(KEY); if (t) sessionStorage.setItem(KEY, t); }
    } catch (err) {}
  });

  document.addEventListener('DOMContentLoaded', updateButtons);
})();
