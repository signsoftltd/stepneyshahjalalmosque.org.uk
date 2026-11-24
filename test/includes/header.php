<?php
/* Shared page start: <head>, the prayer bar (home page only), the header and the mobile menu. Set $page first (see init.php). */
defined('HIUK') or exit;
?>
<!doctype html>
<html lang="en"<?= app_theme() !== '' ? ' data-theme="' . e(app_theme()) . '"' : '' ?><?= in_app() ? ' class="in-app"' : '' ?>>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#006738">
<?php if (app_theme() === ''): /* inside the app, the app chooses light or dark */ ?>
<script src="<?= asset('assets/js/theme.js') ?>"></script>
<?php endif; ?>
<title><?= e($page['title']) ?></title>
<meta name="description" content="<?= e($page['description']) ?>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@300;400;500;600;700&family=Amiri:wght@400;700&family=Reem+Kufi:wght@400;500&display=swap">
<?= $page['head'] ?? '' ?>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" crossorigin="anonymous">
<!-- Icons -->
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" href="assets/images/icons/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="assets/images/icons/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<!-- Sharing (Facebook, WhatsApp, LinkedIn, X). The address comes from SITE_URL in includes/init.php. -->
<link rel="canonical" href="<?= e(SITE_URL . '/' . ($page['path'] ?? '')) ?>">
<meta property="og:site_name" content="Stepney Shah Jalal Mosque">
<meta property="og:type" content="<?= e($page['og_type'] ?? 'article') ?>">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="<?= e(SITE_URL . '/' . ($page['path'] ?? '')) ?>">
<meta property="og:title" content="<?= e($page['title']) ?>">
<meta property="og:description" content="<?= e($page['description']) ?>">
<meta property="og:image" content="<?= e(SITE_URL) ?>/assets/images/share.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Stepney Shah Jalal Mosque logo: working for humanity since 1999">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($page['title']) ?>">
<meta name="twitter:description" content="<?= e($page['description']) ?>">
<meta name="twitter:image" content="<?= e(SITE_URL) ?>/assets/images/share.jpg">
<link rel="stylesheet" href="<?= asset('assets/css/theme.css') ?>">

<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
</head>
<body>
<!-- ============ Icon sprite ============ -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <symbol id="i-mosque" viewBox="0 0 24 24"><path d="M12 2v2M12 4c-3 2-5 4-5 7h10c0-3-2-5-5-7zM4 21V12M20 21V12M2 21h20M8 21v-5a4 4 0 0 1 8 0v5"/></symbol>
  <symbol id="i-quran" viewBox="0 0 24 24"><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2zM12 6v14"/></symbol>
  <symbol id="i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></symbol>
  <symbol id="i-heart" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/></symbol>
  <symbol id="i-coins" viewBox="0 0 24 24"><ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3M3 12v5c0 1.7 2.7 3 6 3"/><ellipse cx="16" cy="13" rx="5" ry="2.5"/><path d="M11 13v4.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V13"/></symbol>
  <symbol id="i-cap" viewBox="0 0 24 24"><path d="M22 9 12 4 2 9l10 5 10-5zM6 11v5c3.5 2.5 8.5 2.5 12 0v-5M22 9v6"/></symbol>
  <symbol id="i-mega" viewBox="0 0 24 24"><path d="M3 10v4h3l6 4V6L6 10H3zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-arrow-ur" viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></symbol>
  <symbol id="i-chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
  <symbol id="i-rings" viewBox="0 0 24 24"><circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M10 4h4l-2 3z"/></symbol>
  <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 21c0-9 5-15 15-16-1 10-7 15-15 16zM5 21l8-8"/></symbol>
  <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></symbol>
  <symbol id="i-basket" viewBox="0 0 24 24"><path d="M3 10h18l-2 10H5zM8 10l4-6 4 6"/></symbol>
  <symbol id="i-family" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14c2.8 0 5 1.8 5 4.5"/></symbol>
  <symbol id="i-pencil" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol>
  <symbol id="i-nav" viewBox="0 0 24 24"><path d="m3 11 19-9-9 19-2-8-8-2z"/></symbol>
  <symbol id="i-drop" viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></symbol>
  <symbol id="i-car" viewBox="0 0 24 24"><path d="M3 17v-5l2-5h14l2 5v5zM3 12h18M7 17v2M17 17v2"/></symbol>
  <symbol id="i-access" viewBox="0 0 24 24"><circle cx="12" cy="4" r="1.6"/><path d="M8 8h8M12 8v6h4l2 5M12 14"/><path d="M7.5 11.5a5 5 0 1 0 6.5 7"/></symbol>
  <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5z"/></symbol>
  <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M16 4.5a3.5 3.5 0 0 1 0 7M22 20c0-3-2-5.3-5-5.9"/></symbol>
  <symbol id="i-bell" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></symbol>
  <symbol id="i-lamp" viewBox="0 0 24 24"><path d="M12 2v2M9 4h6l-1 2h-4zM8 6h8l1 3-1 8H8L7 9zM9 17l-1 3h8l-1-3"/><path d="M10.5 10.5h3v3h-3z"/></symbol>
  <symbol id="i-sprout" viewBox="0 0 24 24"><path d="M12 21v-9M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 10c0-3 2.5-5 6-5 0 3.5-2.5 5-6 5z"/></symbol>
  <symbol id="i-brand" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="1.6"><rect x="10" y="10" width="28" height="28" rx="4"/><rect x="10" y="10" width="28" height="28" rx="4" transform="rotate(45 24 24)"/></g><path d="M24 15.5c-3.2 2.2-5.5 4.4-5.5 7.8h11c0-3.4-2.3-5.6-5.5-7.8zM18.5 25.5h11v7h-11z" fill="currentColor"/></symbol>
</svg>

<a class="skip" href="#main">Skip to content</a>

<?php if (in_app()): ?>
<!-- Inside the mobile app: no header or menus, just the donation basket (opened by the donation app) on pages with donation forms -->
<?php if (uses_donations()): ?><div class="app-cart"><button class="btn site-btn btn-sun site-btn-sm d-cart-btn" type="button" aria-label="Donation basket"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4.4c-.9-1.2-2.9-1.1-3.5.4-.4 1 .1 2 .9 2.7L14 9.7l2.6-2.2c.8-.7 1.3-1.7.9-2.7-.6-1.5-2.6-1.6-3.5-.4z"/><path d="M3 13.5h3.5l2.8 0c1.1 0 2 .9 2 2H7.5"/><path d="M11.3 15.5h3.9l4.1-2.5c.8-.5 1.9-.1 2.1.8.1.5-.1 1-.5 1.3l-5.2 4.4H3"/></svg><span class="cart-subtotal">0.00</span></button></div><?php endif; ?>
<?php else: ?>
<?php if (is_home()): ?>
<!-- ============ Utility bar ============ -->
<div class="utility wrap">
  <div class="container site-container">
    <div class="u-left">
      <span class="u-date" id="uDate">Sunday 27 September 2026</span>
      <span class="u-sep u-date" aria-hidden="true"></span>
      <span class="u-date" id="uHijri"></span>
      <span class="u-sep d-none d-lg-block" aria-hidden="true"></span>
      <span class="u-next">Next: <b class="js-next-name">…</b> <span class="js-next-time"></span> · <span class="tnum js-count">--:--:--</span></span>
    </div>
    <div class="u-right d-none d-lg-flex">
      <a href="#faq">FAQs</a>
      <a href="#events">Live lectures</a>
      <a href="#newsletter">Newsletter</a>
      <a href="contact">Visit us</a>
    </div>
  </div>
</div>
<?php endif; ?>

<!-- ============ Header (Bootstrap navbar) ============ -->
<header class="site-header wrap" id="siteHeader">
  <nav class="navbar site-navbar navbar-expand-xl" aria-label="Main">
    <div class="container site-container d-flex align-items-center justify-content-between gap-4">
      <a class="navbar-brand brand m-0 p-0" href="<?= home_url() ?>" aria-label="Stepney Shah Jalal Mosque, home">
        <img class="brand-logo" src="assets/images/logo-full.png" alt="Stepney Shahjalal Mosque &amp; Cultural Centre" width="312" height="99">
      </a>
      <ul class="navbar-nav site-nav flex-row d-none d-xl-flex">
          <li class="nav-item"><a class="nav-link site-nav-link" href="<?= home_url() ?>"<?= nav_current('home') ?>>Home</a></li>
          <li class="nav-item"><a class="nav-link site-nav-link" href="about"<?= nav_current('about') ?>>About Us</a></li>
          <li class="nav-item"><a class="nav-link site-nav-link" href="services"<?= nav_current('services') ?>>What We Do</a></li>
          <li class="nav-item"><a class="nav-link site-nav-link" href="trustees"<?= nav_current('trustees') ?>>Trustees</a></li>
          <li class="nav-item"><a class="nav-link site-nav-link" href="events"<?= nav_current('events') ?>>News</a></li>
          <li class="nav-item"><a class="nav-link site-nav-link" href="donor-wall"<?= nav_current('donor-wall') ?>>Donor Wall</a></li>
          <li class="nav-item"><a class="nav-link site-nav-link" href="contact"<?= nav_current('contact') ?>>Contact Us</a></li>
      </ul>
      <div class="head-actions d-flex align-items-center gap-2">
        <a class="btn site-btn btn-sun site-btn-sm" href="donations"><svg class="ico"><use href="#i-heart"/></svg><span>Donate<span class="now"> Now</span></span></a>
        <button class="btn site-btn btn-sun site-btn-sm d-cart-btn" type="button" aria-label="Donation basket"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4.4c-.9-1.2-2.9-1.1-3.5.4-.4 1 .1 2 .9 2.7L14 9.7l2.6-2.2c.8-.7 1.3-1.7.9-2.7-.6-1.5-2.6-1.6-3.5-.4z"/><path d="M3 13.5h3.5l2.8 0c1.1 0 2 .9 2 2H7.5"/><path d="M11.3 15.5h3.9l4.1-2.5c.8-.5 1.9-.1 2.1.8.1.5-.1 1-.5 1.3l-5.2 4.4H3"/></svg><span class="cart-subtotal">0.00</span></button>
        <button class="menu-btn theme-btn d-none d-md-grid" type="button" aria-label="Switch to dark mode"><svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg><svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
        <button class="menu-btn d-xl-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mnav" aria-controls="mnav" aria-label="Open menu">
          <svg viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></svg>
        </button>
      </div>
    </div>
  </nav>
</header>

<!-- Mobile menu (Bootstrap offcanvas) -->
<div class="offcanvas offcanvas-top mnav" tabindex="-1" id="mnav" aria-label="Menu">
  <div class="pattern"></div>
  <div class="offcanvas-header mnav-top">
    <a class="brand" href="<?= home_url() ?>" aria-label="Stepney Shah Jalal Mosque, home"><img class="brand-logo" src="assets/images/logo-full.png" alt="Stepney Shahjalal Mosque &amp; Cultural Centre" width="312" height="99"></a>
    <div class="mnav-btns">
      <button class="menu-btn theme-btn" type="button" aria-label="Switch to dark mode"><svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg><svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
      <button class="menu-btn" type="button" data-bs-dismiss="offcanvas" aria-label="Close menu"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </div>
  </div>
  <div class="offcanvas-body mnav-body">
    <nav aria-label="Mobile">
        <ul class="mnav-list">
          <li><a class="nav-link mnav-link" href="<?= home_url() ?>"<?= nav_current('home') ?>>Home</a></li>
          <li><a class="nav-link mnav-link" href="about"<?= nav_current('about') ?>>About Us</a></li>
          <li><a class="nav-link mnav-link" href="services"<?= nav_current('services') ?>>What We Do</a></li>
          <li><a class="nav-link mnav-link" href="trustees"<?= nav_current('trustees') ?>>Trustees</a></li>
          <li><a class="nav-link mnav-link" href="events"<?= nav_current('events') ?>>News</a></li>
          <li><a class="nav-link mnav-link" href="donor-wall"<?= nav_current('donor-wall') ?>>Donor Wall</a></li>
          <li><a class="nav-link mnav-link" href="contact"<?= nav_current('contact') ?>>Contact Us</a></li>
        </ul>
    </nav>
    <div class="mnav-foot">
      <div class="mnav-prayer"><span>Next · <b class="js-next-name">…</b></span><span class="tnum js-count">--:--:--</span><span class="mnav-ar js-next-ar" lang="ar" dir="rtl"></span></div>
      <a class="btn site-btn btn-sun site-btn-lg" href="donations"><svg class="ico"><use href="#i-heart"/></svg>Donate Now</a>
    </div>
  </div>
</div>
<?php endif; /* in_app() */ ?>
