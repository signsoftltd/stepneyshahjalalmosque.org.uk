<?php
/* Shared page end: the footer and the scripts. $page['scripts'] and $page['after'] add the page's own (see init.php). */
defined('HIUK') or exit;
?>
<?php if (!in_app()): /* inside the mobile app: no footer */ ?>
<!-- ============ Footer ============ -->
<footer class="footer wrap on-dark">
  <div class="pattern"></div>
  <div class="container site-container footer-in">
    <div class="news" id="newsletter">
      <div class="row site-row align-items-center gy-4 gx-lg-5">
        <div class="col-12"><h2>Stay <em>connected</em></h2></div>
        <div class="col-12">
          <form id="newsForm" class="d-flex" novalidate aria-label="Newsletter sign-up">
            <label class="visually-hidden" for="n-email">Email address</label>
            <input id="n-email" class="form-control news-input" type="email" placeholder="Your email address" autocomplete="email">
            <button class="btn site-btn btn-sun" type="submit">Subscribe</button>
          </form>
          <p class="news-status" id="newsStatus" role="status" hidden></p>
        </div>
      </div>
    </div>
    <div class="f-grid">
      <div class="row site-row gy-4 gx-lg-5">
        <div class="col-12">
          <div class="f-brand">
            <a class="brand" href="<?= home_url() ?>" aria-label="Stepney Shah Jalal Mosque, home"><img class="brand-logo" src="assets/images/logo-full.png" alt="Stepney Shahjalal Mosque &amp; Cultural Centre" width="312" height="99" loading="lazy"></a>
            <p>A mosque and community centre serving worshippers, families and neighbours through prayer, education and care. Registered charity no. 1115709.</p>
            <div class="socials d-flex">
          <a href="<?= home_url() ?>" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/></svg></a>
          <a href="<?= home_url() ?>" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg></a>
          <a href="<?= home_url() ?>" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/></svg></a>
          <a href="<?= home_url() ?>" aria-label="WhatsApp channel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-13.2 8L3 21l1-4.6A9 9 0 1 1 21 12z"/></svg></a>
            </div>
            <div class="f-links" aria-label="Our sister organisations">
              <a class="btn site-btn btn-glass site-btn-sm" href="https://borunamadrasah.org" target="_blank" rel="noopener">Boruna Madrasa<svg class="ico" style="width:14px;height:14px"><use href="#i-arrow-ur"/></svg></a>
              <a class="btn site-btn btn-glass site-btn-sm" href="https://alkhalil.org.uk" target="_blank" rel="noopener">Al Khalil<svg class="ico" style="width:14px;height:14px"><use href="#i-arrow-ur"/></svg></a>
              <a class="btn site-btn btn-glass site-btn-sm" href="https://deentv.uk" target="_blank" rel="noopener">Deen TV<svg class="ico" style="width:14px;height:14px"><use href="#i-arrow-ur"/></svg></a>
            </div>
          </div>
        </div>
        <div class="col-12 f-cols-col"><nav class="f-cols row site-row row-cols-2 row-cols-md-4" aria-label="Footer">
          <div class="col"><h3>Explore</h3><a href="<?= home_url('#prayer') ?>">Prayer Times</a><a href="timetable">Prayer Timetable</a><a href="events">Events</a><a href="donations">Donations</a><a href="services">Services</a><a href="about">About Us</a><a href="<?= home_url('#faq') ?>">FAQs</a></div>
          <div class="col"><h3>Get involved</h3><a href="<?= home_url('#donate') ?>" data-give="Zakat">Pay Zakat</a><a href="services">Madrasa enrolment</a><a href="contact">Volunteer</a><a href="#newsletter">Newsletter</a></div>
          <?php if (is_home()): ?>
          <div class="col"><h3>Today</h3><span>Fajr <span class="tnum" data-pt="Fajr"></span></span><span>Dhuhr <span class="tnum" data-pt="Dhuhr"></span></span><span>Asr <span class="tnum" data-pt="Asr"></span></span><span>Maghrib <span class="tnum" data-pt="Maghrib"></span></span><span>Isha <span class="tnum" data-pt="Isha"></span></span></div>
<?php else: ?>
          <div class="col"><h3>Legal</h3><a href="privacy-policy">Privacy Policy</a><a href="privacy-policy#cookies">Cookies</a><button class="ck-open" type="button" data-cookie-settings>Cookie settings</button></div>
<?php endif; ?>
          <div class="col"><h3>Contact</h3><span class="f-ct"><svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg><span>534 Barking Road<br>London, E13 8QE<br>United Kingdom</span></span><a class="f-ct" href="tel:+447878561130"><svg class="ico" aria-hidden="true"><use href="#i-phone"/></svg><span>07878 561130</span></a><a class="f-ct" href="mailto:info@hefazotheislamuk.org"><svg class="ico" aria-hidden="true"><use href="#i-mail"/></svg><span>info@<wbr>hefazotheislamuk.org</span></a></div>
        </nav></div>
      </div>
    </div>
    <div class="legal d-flex flex-wrap justify-content-between">
      <span>© <span id="year"><?= date('Y') ?></span> Stepney Shah Jalal Mosque. All rights reserved.</span>
      <span class="credit">Designed &amp; Developed by <a href="https://www.signsoft.co.uk" target="_blank" rel="noopener">Sign Soft Ltd.</a></span>
      <nav aria-label="Legal"><a href="privacy-policy">Privacy Policy</a><button class="ck-open" type="button" data-cookie-settings>Cookie settings</button><a href="<?= home_url() ?>">Terms &amp; Conditions</a></nav>
    </div>
  </div>
</footer>
<?php endif; ?>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="<?= asset('assets/js/config.js') ?>"></script>
<?php if (!in_app()): /* inside the app: no notices popup, cookie banner or visit counting, and the app has its own prayer times */ ?>
<script src="<?= asset('assets/js/notices.js') ?>" defer></script>
<script src="<?= asset('assets/js/consent.js') ?>"></script>
<script src="<?= asset('assets/js/prayer-times.js') ?>"></script>
<?php if (!is_home()): ?>
<script src="<?= asset('assets/js/next-prayer.js') ?>"></script>
<?php endif; ?>
<?php endif; ?>
<?php foreach ($page['scripts'] ?? [] as $src): ?>
<script src="<?= asset($src) ?>"></script>
<?php endforeach; ?>
<?php if (in_app()): ?>
<script>
/* Inside the mobile app: the background pattern, and links to other pages open outside the app (the app passes
   them to the phone's browser) instead of inside this screen */
(function () {
  'use strict';
  function starPath(cx, cy, R) {
    const order = [0, 3, 6, 1, 4, 7, 2, 5];
    return 'M' + order.map((k) => { const a = k * Math.PI / 4 + Math.PI / 8; return (cx + R * Math.cos(a)).toFixed(2) + ' ' + (cy + R * Math.sin(a)).toFixed(2); }).join(' L') + 'Z';
  }
  const s = 84, R = s * 0.36, pts = [[s / 2, s / 2], [0, 0], [s, 0], [0, s], [s, s]];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><g fill="none" stroke="#8CC63E" stroke-width="1"><path d="${pts.map(([x, y]) => starPath(x, y, R)).join(' ')}"/>${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${(R * .38).toFixed(2)}"/>`).join('')}</g></svg>`;
  document.documentElement.style.setProperty('--pat', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target) return;
    const href = a.getAttribute('href') || '';
    if (href === '' || href.charAt(0) === '#' || /^(javascript|tel|mailto):/i.test(href)) return;
    a.target = '_blank';
    a.rel = 'noopener';
  });
})();
</script>
<?php else: ?>
<script src="<?= asset('assets/js/newsletter.js') ?>"></script>
<?php endif; ?>
<?php if (!is_home() && !in_app()): ?>
<script>
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  function starPath(cx, cy, R) {
    const order = [0, 3, 6, 1, 4, 7, 2, 5];
    return 'M' + order.map((k) => { const a = k * Math.PI / 4 + Math.PI / 8; return (cx + R * Math.cos(a)).toFixed(2) + ' ' + (cy + R * Math.sin(a)).toFixed(2); }).join(' L') + 'Z';
  }
  const s = 84, R = s * 0.36, pts = [[s / 2, s / 2], [0, 0], [s, 0], [0, s], [s, s]];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><g fill="none" stroke="#8CC63E" stroke-width="1"><path d="${pts.map(([x, y]) => starPath(x, y, R)).join(' ')}"/>${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${(R * .38).toFixed(2)}"/>`).join('')}</g></svg>`;
  document.documentElement.style.setProperty('--pat', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  $('#siteHeader').classList.add('solid');
})();
</script>
<?php endif; ?>
<?= $page['after'] ?? '' ?>
<?php if (!in_app()): ?>
<script src="<?= asset('assets/js/ui.js') ?>"></script>
<?php endif; ?>
<?php if (uses_donations()): /* not inside the app on pages without donation forms (no quick donate button or basket there) */ ?>
<!-- Initialize Donation App (settings in assets/js/donation.js, shared by all pages) -->
<script src="https://donations.signsoft.co.uk/web-apps/v1/live/init.js?v=0.1041"></script>
<script src="<?= asset('assets/js/donation.js') ?>"></script>
<?php endif; ?>
<?php if (!in_app()): /* inside the app, the app shows its own loading screen */ ?>
<script src="<?= asset('assets/js/loading.js') ?>"></script>
<?php endif; ?>

</body>
</html>
