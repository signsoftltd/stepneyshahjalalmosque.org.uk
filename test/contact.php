<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'contact',
	'title' => 'Contact Us | Stepney Shah Jalal Mosque',
	'description' => 'Contact Stepney Shah Jalal Mosque: 534 Barking Road, London E13 8QE. Call 07878 561130, email info@hefazotheislamuk.org or send us a message.',
	'nav' => 'contact',
	'scripts' => [
		'assets/js/contact.js',
	],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark app-no-hero">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Contact us</span>
      <h1>Get in <em>touch</em></h1>
      <p>Visit the masjid, call or email the office, or send us a message and a member of the team will get back to you.</p>
      <div class="pol-meta"><span>534 Barking Road, London E13 8QE</span><span>07878 561130</span><span>Office: Mon–Fri, 10am–6pm</span></div>
    </div>
  </section>

  <section class="section wrap contact-page" id="contact" aria-labelledby="contact-title">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">Visit us</span><h2 id="contact-title">Contact &amp; <em>Location</em></h2></div>
        <a class="btn site-btn btn-ind site-btn-lg" id="directions" href="https://www.google.com/maps/dir/?api=1&amp;destination=534+Barking+Road+London+E13+8QE" target="_blank" rel="noopener"><svg class="ico" style="color:var(--o-400)"><use href="#i-nav"/></svg>Get Directions</a>
      </div>
      <div class="row site-row g-4">
       <div class="col-lg-7">
        <div class="c-left">
          <!-- Google Maps embed (loads when scrolled near) -->
          <div class="map map-embed">
            <iframe src="https://www.google.com/maps?q=534+Barking+Road,+London+E13+8QE,+UK&amp;z=16&amp;output=embed" title="Map showing Stepney Shah Jalal Mosque at 534 Barking Road, London E13 8QE" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
            <a class="map-open" href="https://www.google.com/maps/search/?api=1&amp;query=534+Barking+Road+London+E13+8QE" target="_blank" rel="noopener">Open in Google Maps<svg class="ico" style="width:14px;height:14px"><use href="#i-arrow-ur"/></svg></a>
          </div>
          <div class="info row site-row">
            <div class="col-sm-6"><div class="info-card card flex-row h-100"><svg class="ico"><use href="#i-pin"/></svg><div><small>Address</small><span>534 Barking Road<br>London, E13 8QE<br>United Kingdom</span></div></div></div>
            <div class="col-sm-6"><div class="info-card card flex-row h-100"><svg class="ico"><use href="#i-clock"/></svg><div><small>Opening hours</small><div class="hours"><i>Masjid</i><span>Fajr – Isha, daily</span><i>Office</i><span>Mon–Fri, 10am–6pm</span></div></div></div></div>
            <div class="col-sm-6"><div class="info-card card flex-row h-100"><svg class="ico"><use href="#i-phone"/></svg><div><small>Phone</small><span><a href="tel:+447878561130">07878 561130</a></span></div></div></div>
            <div class="col-sm-6"><div class="info-card card flex-row h-100"><svg class="ico"><use href="#i-mail"/></svg><div><small>Email</small><span><a href="mailto:info@hefazotheislamuk.org">info@hefazotheislamuk.org</a></span></div></div></div>
          </div>
        </div>
       </div>

       <div class="col-lg-5">
        <form class="c-form on-dark h-100" data-bs-theme="dark" id="contactForm" novalidate aria-labelledby="form-title">
          <div style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
          <div class="pattern"></div>
          <h3 id="form-title">Send us a <em style="color:var(--o-400)">message</em></h3>
          <p>We aim to reply within two working days.</p>
          <div class="row site-row g-3">
            <div class="field col-sm-6"><label class="form-label field-label" for="f-name">Full name</label><input class="form-control c-input" id="f-name" name="name" type="text" autocomplete="name" required><span class="err" hidden>Please enter your name.</span></div>
            <div class="field col-sm-6"><label class="form-label field-label" for="f-email">Email</label><input class="form-control c-input" id="f-email" name="email" type="email" autocomplete="email" required><span class="err" hidden>Please enter a valid email address.</span></div>
          </div>
          <div class="field"><label class="form-label field-label" for="f-topic">Enquiry about</label>
            <select class="form-select c-select" id="f-topic" name="topic"><option>General enquiry</option><option>Nikah &amp; marriage</option><option>Funeral &amp; Janazah</option><option>Classes &amp; madrasa</option><option>Donations &amp; Zakat</option><option>Counselling &amp; support</option><option>Venue hire</option></select></div>
          <div class="field"><label class="form-label field-label" for="f-msg">Message</label><textarea class="form-control c-input" id="f-msg" name="message" required></textarea><span class="err" hidden>Please write a short message.</span></div>
          <button class="btn site-btn btn-sun site-btn-lg" type="submit">Send message<svg class="ico arr"><use href="#i-arrow"/></svg></button>
          <div class="form-status" id="formStatus" role="status" hidden></div>
        </form>
       </div>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
