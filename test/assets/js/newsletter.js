/* Stepney Shah Jalal Mosque: "Stay connected" newsletter sign-up in the footer, saved to the admin panel
   (Subscribers). Used on every page; the address comes from config.js. */
(function () {
  'use strict';
  const form = document.getElementById('newsForm');
  if (!form) return;
  const input = document.getElementById('n-email');
  const status = document.getElementById('newsStatus');
  const btn = form.querySelector('button[type="submit"]');

  function show(text, isError) {
    status.textContent = text;
    status.classList.toggle('is-error', !!isError);
    status.hidden = false;
  }

  // "I'm not a robot" (recaptcha.js); the box sits just under the form and loads when the email box is used
  const slot = document.getElementById('newsCaptcha');
  const captcha = window.HIUKCaptcha && slot ? HIUKCaptcha.attach(form, slot, { theme: 'dark', onTick: () => { if (status.dataset.captcha) { status.hidden = true; delete status.dataset.captcha; } } }) : null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      show('Please enter a valid email address.', true);
      return;
    }
    input.removeAttribute('aria-invalid');

    const token = captcha ? captcha.token() : '';
    if (captcha && !token) {
      status.dataset.captcha = '1';
      show('Please tick "I\'m not a robot" to subscribe.', true);
      captcha.start().then(() => captcha.reveal())
        .catch(() => show('The "I\'m not a robot" check could not load. Please check your connection and try again.', true));
      return;
    }

    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Subscribing…';
    status.hidden = true;

    const body = new URLSearchParams({ email: email, source: '/' + location.pathname.split('/').pop(), recaptcha: token });
    fetch((window.HIUK_API || 'https://manage.stepneyshahjalalmosque.org.uk/api/public') + '/subscribe', { method: 'POST', body: body, headers: { Accept: 'application/json' } })
      .then((r) => r.json().catch(() => ({})).then((data) => ({ r, data })))
      .then(({ r, data }) => {
        if (r.ok && data.success) {
          show(data.message || 'Thank you for subscribing.');
          form.reset();
        } else {
          show(data.message || 'Sorry, we could not add you right now. Please try again later.', true);
        }
      })
      .catch(() => show('Sorry, we could not add you right now. Please check your connection and try again.', true))
      .finally(() => { btn.disabled = false; btn.textContent = label; if (captcha) captcha.reset(); });
  });
})();
