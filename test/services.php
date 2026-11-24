<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'services',
	'title' => 'Services | Stepney Shah Jalal Mosque',
	'description' => 'Services at Stepney Shah Jalal Mosque: Nikah and marriage, funeral and Janazah support, counselling, Zakat assistance, a food bank, family support, and Quran and Islamic classes.',
	'nav' => 'services',
	'scripts' => [
		'assets/js/services.js',
	],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark app-no-hero">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Serving since 1999</span>
      <h1>Our <em>services</em></h1>
      <p>Worship, learning and care for every stage of life, open to everyone in our community.</p>
    </div>
  </section>

  <!-- Services are managed in the admin panel (Home page > Services), the same as on the home page -->
<?php $svc_class = ''; require __DIR__ . '/includes/services-section.php'; ?>

  <!-- ============ How to ask for help ============ -->
  <section class="section wrap band" aria-labelledby="svc-steps">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">Getting started</span><h2 id="svc-steps">How to <em>ask for help</em></h2></div>
      </div>
      <div class="ab-grid ab-3">
        <div class="ab-card"><span class="gem sm"><svg class="ico"><use href="#i-phone"/></svg></span><h3>1. Get in touch</h3><p>Call, email or send us a message, or speak to us at the masjid after any prayer.</p><a class="link-arrow" href="contact">Contact us<svg class="ico"><use href="#i-arrow"/></svg></a></div>
        <div class="ab-card"><span class="gem sm ind"><svg class="ico"><use href="#i-chat"/></svg></span><h3>2. Tell us what you need</h3><p>Our office team listens, answers your questions and puts you in touch with the right person.</p></div>
        <div class="ab-card"><span class="gem sm grn"><svg class="ico"><use href="#i-check"/></svg></span><h3>3. We take it from there</h3><p>We arrange a time that suits you, with care and in confidence, whatever your background.</p></div>
      </div>
    </div>
  </section>

  <!-- ============ Visit / contact ============ -->
  <section class="section wrap" aria-labelledby="svc-cta">
    <div class="container site-container">
      <div class="ab-cta on-dark">
        <div class="pattern"></div>
        <div class="ab-cta-in">
          <span class="kicker">We're here for you</span>
          <h2 id="svc-cta">Speak to <em>our team</em></h2>
          <p>Office: Mon–Fri, 10am–6pm · 534 Barking Road, London E13 8QE</p>
          <div class="hero-ctas d-flex flex-wrap justify-content-center">
            <a class="btn site-btn btn-sun site-btn-lg" href="tel:+447878561130"><svg class="ico"><use href="#i-phone"/></svg>07878 561130</a>
            <a class="btn site-btn btn-glass site-btn-lg" href="contact">Send a message<svg class="ico arr"><use href="#i-arrow"/></svg></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
