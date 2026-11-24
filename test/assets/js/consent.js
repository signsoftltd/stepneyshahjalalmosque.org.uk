/* Cookie consent. Strictly necessary storage needs no consent. "Preferences" covers the events
   filter. "Analytics" sends an anonymous page-view count to the admin panel (see loadAnalytics),
   only after the visitor opts in. Needs Bootstrap's JS bundle; reads window.HIUK_API from config.js. */
(function () {
  'use strict';
  var KEY = 'hiuk-consent', VERSION = 1, MAXAGE = 365 * 864e5;
  var state = null, mem = null;
  function read() {
    try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.v === VERSION && Date.now() - r.ts < MAXAGE) return r; } catch (e) {}
    return mem && Date.now() - mem.ts < MAXAGE ? mem : null;
  }
  // Anonymous visit counter: adds one to today's totals for this page. No identifiers are sent or stored.
  var counted = false;
  function loadAnalytics() {
    if (counted || !window.HIUK_API) return;
    counted = true;
    var visit = '1';
    try { if (sessionStorage.getItem('hiuk-visit')) visit = '0'; else sessionStorage.setItem('hiuk-visit', '1'); }
    catch (e) { visit = document.referrer && document.referrer.indexOf(location.host) !== -1 ? '0' : '1'; }
    var ref = '';
    try { var h = new URL(document.referrer).host; if (h !== location.host) ref = h; } catch (e) {}
    var w = window.innerWidth, coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    var data = new URLSearchParams({
      path: '/' + location.pathname.split('/').pop(),
      visit: visit,
      ref: visit === '1' ? ref : '',
      device: w < 768 ? 'mobile' : (coarse && w < 1200 ? 'tablet' : 'desktop')
    });
    var url = window.HIUK_API + '/track';
    try { if (navigator.sendBeacon && navigator.sendBeacon(url, data)) return; } catch (e) {}
    try { fetch(url, { method: 'POST', body: data, mode: 'no-cors', keepalive: true }); } catch (e) {}
  }
  function save(prefs, analytics) {
    state = mem = { v: VERSION, ts: Date.now(), prefs: !!prefs, analytics: !!analytics };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    if (!prefs) { try { localStorage.removeItem('hiuk-cat'); } catch (e) {} }
    if (analytics) loadAnalytics();
    document.dispatchEvent(new CustomEvent('hiuk:consent', { detail: state }));
  }
  state = read();
  var api = window.HIUK_CONSENT = {
    allows: function (k) { return !!(state && state[k]); },
    open: function () { openPrefs(); }
  };
  if (state && state.analytics) loadAnalytics();

  var policy = document.documentElement.getAttribute('data-policy') || 'privacy-policy';
  var banner, dlg, lastFocus;
  var X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  function closeBanner() { if (banner) { banner.remove(); banner = null; } }
  function showBanner() {
    if (banner) return;
    banner = document.createElement('section');
    banner.className = 'ck-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = '<h2>Your privacy</h2><p>We use essential storage to run this site. With your permission we also remember choices such as your events filter. We never sell your data. See our <a href="' + policy + '#cookies">cookie policy</a>.</p>' +
      '<div class="ck-actions"><button class="btn site-btn btn-sun" type="button" data-a="all">Accept all</button><button class="btn site-btn ck-ghost" type="button" data-a="none">Reject non-essential</button></div>' +
      '<button class="ck-link" type="button" data-a="manage">Manage preferences</button>';
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]'); if (!b) return;
      if (b.dataset.a === 'all') { save(true, true); closeBanner(); }
      else if (b.dataset.a === 'none') { save(false, false); closeBanner(); }
      else openPrefs();
    });
    document.body.appendChild(banner);
  }
  function buildDialog() {
    dlg = document.createElement('div');
    dlg.className = 'modal fade ck-modal';
    dlg.id = 'ckModal';
    dlg.tabIndex = -1;
    dlg.setAttribute('aria-labelledby', 'ckTitle');
    dlg.setAttribute('aria-hidden', 'true');
    dlg.innerHTML = '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"><div class="modal-content ck-dialog"><form novalidate>' +
      '<div class="ck-head"><h2 id="ckTitle">Cookie preferences</h2><button class="ck-x" type="button" data-bs-dismiss="modal" aria-label="Close">' + X + '</button></div>' +
      '<p class="ck-intro">Choose which optional storage you allow. You can change this at any time from the footer. Read the <a href="' + policy + '#cookies">cookie policy</a>.</p>' +
      '<div class="ck-cats">' +
      cat('Strictly necessary', 'Remembers your cookie choice and keeps the site working. Always on.', 'ckN', true, true) +
      cat('Preferences', 'Remembers choices you make, such as the events category you last viewed.', 'ckP', false, false) +
      cat('Analytics', 'Counts your visit anonymously so we can see which pages help people most. No personal details are recorded.', 'ckA', false, false) +
      '</div><div class="ck-foot"><button class="btn site-btn btn-line" type="button" data-s="none">Reject non-essential</button><button class="btn site-btn btn-line" type="button" data-s="all">Accept all</button><button class="btn site-btn btn-ind" type="button" data-s="save">Save choices</button></div></form></div></div>';
    function cat(t, d, id, on, dis) {
      return '<div class="ck-cat"><b id="' + id + 'L">' + t + '</b><p>' + d + '</p><div class="form-check form-switch ck-sw"><input class="form-check-input ck-sw-input" type="checkbox" role="switch" id="' + id + '" aria-labelledby="' + id + 'L"' + (on ? ' checked' : '') + (dis ? ' disabled' : '') + '></div></div>';
    }
    dlg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-s]'); if (!b) return;
      var p = dlg.querySelector('#ckP'), a = dlg.querySelector('#ckA');
      if (b.dataset.s === 'all') save(true, true);
      else if (b.dataset.s === 'none') save(false, false);
      else save(p.checked, a.checked);
      closeBanner(); modal().hide();
    });
    dlg.addEventListener('hidden.bs.modal', function () { if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true }); });
    document.body.appendChild(dlg);
  }
  function modal() { return window.bootstrap.Modal.getOrCreateInstance(dlg); }
  function openPrefs() {
    lastFocus = document.activeElement;
    if (!dlg) buildDialog();
    dlg.querySelector('#ckP').checked = api.allows('prefs');
    dlg.querySelector('#ckA').checked = api.allows('analytics');
    modal().show();
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); openPrefs(); }
  });
  if (!state) showBanner();
})();
