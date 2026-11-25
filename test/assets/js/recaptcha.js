/* Stepney Shah Jalal Mosque: Google reCAPTCHA v2 ("I'm not a robot") for the website's forms.
   The site key comes from the admin panel (GET /api/public/recaptcha), which also checks the tick on
   every submission. Google's script loads only when a visitor starts using a form, not on every page view.

   The box follows the site's day / night mode (theme.js sets html[data-theme]): Google's light box by day,
   its dark box at night, redrawn when the visitor switches (after their submission if they have already ticked it).

   Use:  const captcha = HIUKCaptcha.attach(form, slot, { onTick });
         captcha.token()   the tick's token, or '' if not ticked yet (also starts loading the box)
         captcha.reset()   untick after each submission (a token can only be used once)          */
(function () {
  'use strict';
  const API = (window.HIUK_API || 'https://manage.stepneyshahjalalmosque.org.uk/api/public') + '/recaptcha';
  let keyPromise = null, scriptPromise = null;
  const siteTheme = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  const boxes = []; // every attached form's box, to redraw when the mode changes

  function siteKey() {
    if (!keyPromise) {
      keyPromise = fetch(API, { headers: { Accept: 'application/json' } })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
        .then((d) => (d && d.site_key ? d.site_key : Promise.reject(new Error('No site key'))))
        .catch((e) => { keyPromise = null; throw e; }); // try again next time
    }
    return keyPromise;
  }

  function loadScript() {
    if (!scriptPromise) {
      scriptPromise = new Promise((resolve, reject) => {
        if (window.grecaptcha && window.grecaptcha.render) { resolve(); return; }
        window.hiukCaptchaLoaded = () => resolve();
        const s = document.createElement('script');
        s.src = 'https://www.google.com/recaptcha/api.js?onload=hiukCaptchaLoaded&render=explicit&hl=en';
        s.async = true; s.defer = true;
        s.onerror = () => { scriptPromise = null; s.remove(); reject(new Error('reCAPTCHA could not load')); };
        document.head.appendChild(s);
      });
    }
    return scriptPromise;
  }

  function attach(form, slot, opts) {
    opts = opts || {};
    let widget = null, starting = null, key = '', frame = null, drawnTheme = '', redrawLater = false;

    // (re)draw the box in the site's current mode, inside a frame (.captcha-frame) that trims Google's
    // own border and gives it the site's look; the standard box is 304px wide, a narrower space gets the compact one
    function draw() {
      if (frame) frame.remove();
      const size = slot.clientWidth && slot.clientWidth < 304 ? 'compact' : 'normal';
      frame = document.createElement('span');
      frame.className = 'captcha-frame' + (size === 'compact' ? ' is-compact' : '');
      slot.appendChild(frame);
      drawnTheme = siteTheme();
      redrawLater = false;
      widget = window.grecaptcha.render(frame, {
        sitekey: key, theme: drawnTheme, size,
        callback: () => { if (opts.onTick) opts.onTick(); }
      });
    }

    function start() {
      if (widget !== null) return Promise.resolve();
      if (!starting) {
        starting = Promise.all([siteKey(), loadScript()]).then(([k]) => {
          key = k;
          slot.hidden = false;
          draw();
        }).catch((e) => { starting = null; throw e; });
      }
      return starting;
    }

    const ticked = () => widget !== null && !!window.grecaptcha.getResponse(widget);
    // day / night switched: redraw now, or after the submission if the box is already ticked
    boxes.push(() => {
      if (widget === null || drawnTheme === siteTheme()) return;
      if (ticked()) redrawLater = true; else draw();
    });

    // start loading as soon as the visitor begins to use the form
    const begin = () => { start().catch(() => {}); };
    form.addEventListener('focusin', begin, { once: true });
    form.addEventListener('pointerdown', begin, { once: true });

    return {
      start,
      token() {
        if (widget === null) { begin(); return ''; }
        return window.grecaptcha.getResponse(widget) || '';
      },
      reset() {
        if (widget === null) return;
        if (redrawLater || drawnTheme !== siteTheme()) draw(); else window.grecaptcha.reset(widget);
      },
      // focus the box so the visitor sees what to tick
      reveal() { slot.hidden = false; slot.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    };
  }

  // follow the day / night switch (theme.js changes html[data-theme])
  new MutationObserver(() => boxes.forEach((redraw) => redraw()))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  window.HIUKCaptcha = { attach };
})();
