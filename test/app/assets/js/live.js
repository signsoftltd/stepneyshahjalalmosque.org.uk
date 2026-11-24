/* Hefazothe Islam UK app: Live stream. Asks config.js liveVideoUrl for the YouTube video id ({ video_id }) and plays
   it through config.js livePlayerUrl?v=<id> (YouTube only plays inside pages served over https). Without a video id:
   a message. Not saved on the phone (live or not has to be current): asks again every minute while there is no video,
   when the screen comes back to the front, and with "Check again". A video that is playing is left alone. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const CFG = window.HIUK_CONFIG || {};
    const $ = (id) => document.getElementById(id);
    const EVERY = 60 * 1000;
    let current = null, busy = false, timer = 0;

    function show(state, id) {
      $('lvLoading').hidden = state !== 'loading';
      $('lvNone').hidden = state !== 'none';
      $('lvOffline').hidden = state !== 'offline';
      $('lvBadge').hidden = state !== 'video';
      $('lvTip').hidden = state !== 'video';
      let frame = $('lvFrame');
      if (state === 'video') {
        if (!frame || current !== id) {
          if (frame) frame.remove();
          frame = document.createElement('iframe');
          frame.id = 'lvFrame';
          frame.className = 'lv-frame';
          frame.title = 'Live stream from Hefazothe Islam UK';
          frame.src = (CFG.livePlayerUrl || 'https://apps.signsoft.co.uk/web-apps/youtube/iframe.php') + '?v=' + encodeURIComponent(id);
          frame.setAttribute('frameborder', '0');
          frame.setAttribute('allowfullscreen', '');
          frame.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
          frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          $('lvScreen').appendChild(frame);
        }
        current = id;
      } else {
        if (frame) frame.remove();
        current = null;
      }
      const t = HIUK.util.fmtTime(new Date());
      $('lvStatus').textContent = state === 'video' ? 'Live now' : state === 'loading' ? '' : `Last checked ${t}`;
    }

    function check(manual) {
      if (busy) return;
      if (navigator.onLine === false) { if (!current) show('offline'); schedule(); return; }
      busy = true;
      $('lvCheck').disabled = true;
      if (!current && manual) show('loading');
      fetch(CFG.liveVideoUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' })
        .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then((d) => {
          const id = String((d && d.video_id) || '').trim();
          // a YouTube video id: letters, digits, - and _
          if (/^[\w-]{6,20}$/.test(id)) show('video', id);
          else { show('none'); if (manual) HIUK.toast('There is no live video at the moment'); }
        })
        .catch(() => { if (!current) show(navigator.onLine === false ? 'offline' : 'none'); })
        .then(() => { busy = false; $('lvCheck').disabled = false; schedule(); });
    }
    // while there is no video, ask again every minute (the stream may start any moment)
    function schedule() {
      clearTimeout(timer);
      if (!current && !document.hidden) timer = setTimeout(() => check(false), EVERY);
    }

    $('lvCheck').addEventListener('click', () => check(true));
    v.on(document, 'visibilitychange', () => { if (!document.hidden) check(false); else clearTimeout(timer); });
    v.on(window, 'online', () => check(false));
    v.on(window, 'offline', () => { if (!current) show('offline'); });
    v.cleanup(() => clearTimeout(timer));

    show('loading');
    check(false);
  });
})();
