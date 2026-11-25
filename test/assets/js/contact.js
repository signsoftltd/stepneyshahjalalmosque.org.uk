/* Stepney Shah Jalal Mosque: "Send us a message" form on contact.php, sent to the admin panel's
   Messages inbox. The address comes from config.js. */
(function () {
  'use strict';
  const f = document.getElementById('contactForm');
  if (!f) return;
  const $ = (s, r = document) => r.querySelector(s);
  const API = (window.HIUK_API || 'https://manage.stepneyshahjalalmosque.org.uk/api/public') + '/contact';
  // "I'm not a robot" (recaptcha.js); its token is sent with the form as g-recaptcha-response
  const captcha = window.HIUKCaptcha ? HIUKCaptcha.attach(f, $('#contactCaptcha'), { onTick: () => { const st = $('#formStatus'); if (st.dataset.captcha) { st.hidden = true; delete st.dataset.captcha; } } }) : null;

  f.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const FIELDS = { name: '#f-name', email: '#f-email', message: '#f-msg' };
    const mark = (sel, good) => {
      const input = $(sel, f); input.parentElement.querySelector('.err').hidden = good; input.setAttribute('aria-invalid', String(!good));
      if (!good && ok) { input.focus(); ok = false; }
    };
    [['#f-name', (v) => v.trim().length > 1], ['#f-email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)], ['#f-msg', (v) => v.trim().length > 4]].forEach(([sel, test]) => mark(sel, test($(sel, f).value)));
    const st = $('#formStatus'), btn = $('button[type="submit"]', f);
    const show = (text, isError) => { st.textContent = text; st.classList.toggle('is-error', !!isError); st.hidden = false; };
    if (!ok) { st.hidden = true; return; }

    const token = captcha ? captcha.token() : '';
    if (captcha && !token) {
      st.dataset.captcha = '1';
      show('Please tick "I\'m not a robot" before sending your message.', true);
      captcha.start().then(() => captcha.reveal())
        .catch(() => show('The "I\'m not a robot" check could not load. Please check your connection and try again, or email info@stepneyshahjalalmosque.org.uk.', true));
      return;
    }

    const label = btn.firstChild.textContent;
    btn.disabled = true; btn.firstChild.textContent = 'Sending… ';
    st.hidden = true;
    const body = new URLSearchParams(new FormData(f));
    body.set('g-recaptcha-response', token);
    fetch(API, { method: 'POST', body: body, headers: { Accept: 'application/json' } })
      .then((r) => r.json().catch(() => ({})).then((data) => ({ r, data })))
      .then(({ r, data }) => {
        if (r.ok && data.success) {
          show(`Thank you, ${$('#f-name').value.trim().split(' ')[0]}. Your message has been sent and we aim to reply within two working days.`);
          f.reset();
          return;
        }
        if (data.errors) Object.keys(data.errors).forEach((k) => { if (FIELDS[k]) mark(FIELDS[k], false); });
        show(data.message || 'Sorry, your message could not be sent. Please try again or email info@stepneyshahjalalmosque.org.uk.', true);
      })
      .catch(() => show('Sorry, your message could not be sent. Please check your connection, or email info@stepneyshahjalalmosque.org.uk.', true))
      .finally(() => { btn.disabled = false; btn.firstChild.textContent = label; if (captcha) captcha.reset(); });
  });
})();
