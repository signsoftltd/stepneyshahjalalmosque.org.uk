/* Stepney Shah Jalal Mosque app: "update available" popup. Once per app launch (on the home screen) asks config.js
   updateCheckUrl ?platform=android|ios&current=<app version from index.html?v=>. With has_update it offers
   "Update now", which asks the native app to update:
     Android: the JavaScript interface Android.updateApp()
     iOS:     window.webkit.messageHandlers.actionMessageHandler.postMessage({ action: 'updateApp' })
   Outside the apps (no Android / iOS bridge, e.g. a browser) nothing is checked. If the reply says the update is
   required (force / force_update / mandatory), there is no "Later". */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const CFG = window.HIUK_CONFIG || {};
    const { esc } = HIUK.util;
    const DONE = 'hiuk_app_update_checked';

    const ios = () => window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.actionMessageHandler;
    const android = () => window.Android && typeof window.Android.updateApp === 'function';
    const platform = android() ? 'android' : ios() ? 'ios' : null;

    function updateApp() {
      try {
        if (android()) window.Android.updateApp();
        else if (ios()) window.webkit.messageHandlers.actionMessageHandler.postMessage({ action: 'updateApp' });
        return true;
      } catch (e) { return false; }
    }

    function show(d) {
      const force = d.force === true || d.force_update === true || d.mandatory === true || d.force === 1 || d.force_update === 1;
      const version = String(d.new_version || '').trim();
      const note = String(d.message || d.notes || '').trim();
      const el = document.createElement('div');
      el.className = 'pop up-pop';
      el.innerHTML = `<div class="pop-back"${force ? '' : ' data-up-later'}></div>
        <div class="pop-card" role="dialog" aria-modal="true" aria-labelledby="upTitle" aria-describedby="upText">
          <div class="pop-body up-body">
            <span class="up-ico" aria-hidden="true">${HIUK.icon('download')}</span>
            <h2 id="upTitle">Update available</h2>
            <p id="upText">A new version of the app${version ? ` (version ${esc(version)})` : ''} is ready. Update now for the latest features and fixes.</p>
            ${note ? `<p class="up-note">${esc(note)}</p>` : ''}
            <div class="up-actions">
              <button class="btn-main" type="button" data-up-now>Update now</button>
              ${force ? '' : '<button class="btn-line" type="button" data-up-later>Later</button>'}
            </div>
          </div>
        </div>`;
      document.body.appendChild(v.own(el));
      const close = () => { el.classList.remove('is-open'); setTimeout(() => el.remove(), 250); };
      el.addEventListener('click', (e) => {
        if (e.target.closest('[data-up-now]')) {
          if (!updateApp()) { HIUK.toast('Update failed. Please use the app store.'); return; }
          if (!force) close();
        } else if (e.target.closest('[data-up-later]')) close();
      });
      if (!force) v.on(document, 'keydown', function onKey(e) { if (e.key === 'Escape' && el.isConnected) { close(); document.removeEventListener('keydown', onKey); } });
      requestAnimationFrame(() => { el.classList.add('is-open'); el.querySelector('[data-up-now]').focus(); });
    }

    // once per launch: the app opens the home screen afresh each time it starts
    let checked = null;
    try { checked = sessionStorage.getItem(DONE); } catch (e) { /* storage off: check */ }
    if (!platform || !CFG.updateCheckUrl || checked) return;
    try { sessionStorage.setItem(DONE, '1'); } catch (e) { /* not saved */ }

    const url = CFG.updateCheckUrl + '?platform=' + platform + '&current=' + encodeURIComponent(HIUK.appVersion || '');
    fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((d) => { if (d && (d.has_update === true || d.has_update === 1 || d.has_update === '1' || d.has_update === 'true')) show(d); })
      .catch(() => {}); // offline: check again next launch
  });
})();
