<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'about',
	'title' => 'About Us | Hefazothe Islam UK',
	'description' => 'About Hefazothe Islam UK: a mosque and community centre on Barking Road, East London, working for humanity since 1999 through worship, education and care.',
	'nav' => 'about',
	'scripts' => [
		'assets/js/about.js',
	],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark app-meta-only">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">About us</span>
      <h1>Our <em>story</em></h1>
      <p data-ab="hero_subtitle">A place of worship, learning and belonging in East London, working for humanity since 1999.</p>
      <div class="pol-meta"><span>Established 1999</span><span class="app-hide">534 Barking Road, London E13</span><span>Registered charity 1115709</span></div>
    </div>
  </section>

  <!-- Content is managed in the admin panel (About Us); this is the built-in default. Placeholders in [square brackets] are for the mosque team to replace. -->

  <!-- ============ Who we are ============ -->
  <section class="section wrap ab-section" aria-labelledby="ab-who">
    <div class="container site-container">
      <div class="row site-row align-items-center gy-5 gx-lg-5">
        <div class="col-lg-5">
          <figure class="ab-photo"><img data-ab="photo" src="assets/images/dome.jpg" alt="The green dome and minarets of the mosque at sunset"></figure>
        </div>
        <div class="col-lg-7">
          <div class="ab-copy">
            <span class="kicker">Who we are</span>
            <h2 id="ab-who" data-ab="story_heading">A house of prayer, a <em>home</em> for every generation</h2>
            <div class="ab-story ev-rich" data-ab="story_html">
              <p>Hefazothe Islam UK was established in 1999 and has worked for humanity ever since, welcoming worshippers and serving families across East London every day of the week.</p>
              <p class="ab-todo">[Add your history here: who founded the mosque, how it began and how it has grown. Two or three short paragraphs work well.]</p>
              <p>Today the mosque is a centre for the five daily prayers and Jumu'ah, for Quran and Islamic learning at every age, and for practical care, from the food bank to counselling and Zakat assistance.</p>
            </div>
            <blockquote class="quote" data-ab="quote">“Our doors are open to everyone who seeks the remembrance of Allah, and to every neighbour who needs a hand.”</blockquote>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ Journey ============ -->
  <section class="section wrap band" aria-labelledby="ab-journey">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">Our journey</span><h2 id="ab-journey" data-ab="journey_heading">Milestones along <em>the way</em></h2></div>
      </div>
      <ol class="ab-timeline" data-ab-list="milestones">
        <li><span class="ab-year">1999</span><div><h3>Hefazothe Islam UK is founded</h3><p class="ab-todo">[How it started: the first prayers, the founders and the first home of the mosque.]</p></div></li>
        <li><span class="ab-year">[Year]</span><div><h3>[Milestone]</h3><p class="ab-todo">[For example: moving to 534 Barking Road, opening the madrasa or the sisters' prayer hall.]</p></div></li>
        <li><span class="ab-year">[Year]</span><div><h3>[Milestone]</h3><p class="ab-todo">[For example: launching the food bank or a building project.]</p></div></li>
        <li><span class="ab-year">Today</span><div><h3>Serving the whole community</h3><p>Five daily prayers and Jumu'ah, classes for children and adults, a weekly food bank and family support, open to everyone.</p></div></li>
      </ol>
    </div>
  </section>

  <!-- ============ Mission & values ============ -->
  <section class="section wrap" aria-labelledby="ab-mission">
    <div class="container site-container">
      <div class="row site-row gy-4 gx-lg-5 align-items-center">
        <div class="col-lg-5">
          <div class="ab-copy">
            <span class="kicker">What guides us</span>
            <h2 id="ab-mission" data-ab="mission_heading">Our <em>mission</em></h2>
            <p data-ab="mission_text">To serve our community through worship, education and unity: keeping a house of prayer open to all, passing on the knowledge of the Quran and Sunnah, and caring for every neighbour in need.</p>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="ab-values" data-ab-list="values">
            <div class="ab-value"><span class="gem"><svg class="ico"><use href="#i-mosque"/></svg></span><b>Ihsan</b><span>Excellence in worship and service</span></div>
            <div class="ab-value"><span class="gem ind"><svg class="ico"><use href="#i-quran"/></svg></span><b>Knowledge</b><span>Learning for every age</span></div>
            <div class="ab-value"><span class="gem grn"><svg class="ico"><use href="#i-users"/></svg></span><b>Unity</b><span>One community, many backgrounds</span></div>
            <div class="ab-value"><span class="gem sun"><svg class="ico"><use href="#i-check"/></svg></span><b>Trust</b><span>Transparent with every pound</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ What we do ============ -->
  <section class="section wrap band" aria-labelledby="ab-do">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">What we do</span><h2 id="ab-do" data-ab="services_heading">Serving our <em>community</em></h2></div>
        <a class="btn site-btn btn-ind site-btn-lg" href="services">All services<svg class="ico arr"><use href="#i-arrow"/></svg></a>
      </div>
      <div class="ab-grid" data-ab-list="cards">
        <div class="ab-card"><span class="gem sm"><svg class="ico"><use href="#i-mosque"/></svg></span><h3>Worship</h3><p>Five daily prayers, two Jumu'ah congregations, Taraweeh in Ramadan and Eid prayers.</p><a class="link-arrow" href="./#prayer">Prayer times<svg class="ico"><use href="#i-arrow"/></svg></a></div>
        <div class="ab-card"><span class="gem sm ind"><svg class="ico"><use href="#i-cap"/></svg></span><h3>Education</h3><p>Children's madrasa, Quran classes with Tajweed and Hifz, and Islamic classes for adults.</p><a class="link-arrow" href="events">Classes &amp; events<svg class="ico"><use href="#i-arrow"/></svg></a></div>
        <div class="ab-card"><span class="gem sm grn"><svg class="ico"><use href="#i-basket"/></svg></span><h3>Welfare</h3><p>A weekly food bank, confidential counselling, family support and Zakat assistance.</p><a class="link-arrow" href="zakat">Zakat calculator<svg class="ico"><use href="#i-arrow"/></svg></a></div>
        <div class="ab-card"><span class="gem sm sun"><svg class="ico"><use href="#i-family"/></svg></span><h3>Life events</h3><p>Nikah ceremonies, marriage guidance, and funeral and Janazah support for families.</p><a class="link-arrow" href="contact">Speak to our team<svg class="ico"><use href="#i-arrow"/></svg></a></div>
      </div>
    </div>
  </section>

  <!-- ============ People ============ -->
  <section class="section wrap" aria-labelledby="ab-people">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">Our people</span><h2 id="ab-people" data-ab="people_heading">Imam, trustees &amp; <em>volunteers</em></h2></div>
      </div>
      <div class="ab-grid" data-ab-list="people">
        <div class="ab-card ab-person"><div class="avatar" aria-hidden="true">Im</div><h3>[Imam's name]</h3><span class="ab-role">Head Imam · Hafiz &amp; Alim</span><p class="ab-todo">[A short introduction: where the Imam studied and what he teaches.]</p></div>
        <div class="ab-card ab-person"><div class="avatar" aria-hidden="true">Ch</div><h3>[Name]</h3><span class="ab-role">Chair of Trustees</span><p class="ab-todo">[One or two lines about their role.]</p></div>
        <div class="ab-card ab-person"><div class="avatar" aria-hidden="true">Tr</div><h3>[Name]</h3><span class="ab-role">Trustee</span><p class="ab-todo">[One or two lines about their role.]</p></div>
        <div class="ab-card ab-person" data-ab-keep><div class="avatar" aria-hidden="true"><svg class="ico"><use href="#i-heart"/></svg></div><h3>Our volunteers</h3><span class="ab-role">The heart of the mosque</span><p>From the food bank to teaching and events, volunteers keep our community going. We would love your help.</p><a class="link-arrow" href="contact">Get involved<svg class="ico"><use href="#i-arrow"/></svg></a></div>
      </div>
    </div>
  </section>

  <!-- ============ Visit ============ -->
  <section class="section wrap band" aria-labelledby="ab-visit">
    <div class="container site-container">
      <div class="row site-row g-4 gx-lg-5">
        <div class="col-lg-6">
          <div class="ab-copy">
            <span class="kicker">Visit us</span>
            <h2 id="ab-visit" data-ab="visit_heading">Everyone is <em>welcome</em></h2>
            <p data-ab="visit_text">Visitors of every background are welcome. Please dress modestly, remove your shoes before entering the prayer hall and be mindful of prayer times. For group or school visits, please get in touch in advance.</p>
          </div>
          <div class="facilities mt-4">
            <h4>Facilities</h4>
            <span><svg class="ico"><use href="#i-mosque"/></svg>Main prayer hall</span>
            <span><svg class="ico"><use href="#i-users"/></svg>Sisters' prayer hall</span>
            <span><svg class="ico"><use href="#i-drop"/></svg>Wudu facilities</span>
            <span><svg class="ico"><use href="#i-quran"/></svg>Classrooms &amp; library</span>
            <span><svg class="ico"><use href="#i-access"/></svg>Step-free access</span>
            <span><svg class="ico"><use href="#i-car"/></svg>On-site parking</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="ab-visit">
            <div><svg class="ico"><use href="#i-pin"/></svg><span><small>Address</small>534 Barking Road<br>London, E13 8QE<br>United Kingdom</span></div>
            <div><svg class="ico"><use href="#i-clock"/></svg><span><small>Opening hours</small>Masjid: Fajr – Isha, daily<br>Office: Mon–Fri, 10am–6pm</span></div>
            <div><svg class="ico"><use href="#i-phone"/></svg><span><small>Phone</small><a href="tel:+447878561130">07878 561130</a></span></div>
            <div><svg class="ico"><use href="#i-mail"/></svg><span><small>Email</small><a href="mailto:info@hefazotheislamuk.org">info@hefazotheislamuk.org</a></span></div>
            <div class="ab-visit-ctas">
              <a class="btn site-btn btn-ind" href="https://www.google.com/maps/dir/?api=1&amp;destination=534+Barking+Road+London+E13+8QE" target="_blank" rel="noopener"><svg class="ico"><use href="#i-nav"/></svg>Get directions</a>
              <a class="btn site-btn btn-line" href="contact">Send a message<svg class="ico arr"><use href="#i-arrow"/></svg></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ Get involved ============ -->
  <section class="section wrap" aria-labelledby="ab-cta">
    <div class="container site-container">
      <div class="ab-cta on-dark">
        <div class="pattern"></div>
        <div class="ab-cta-in">
          <span class="kicker">Get involved</span>
          <h2 id="ab-cta" data-ab="cta_heading">Be part of <em>our story</em></h2>
          <p data-ab="cta_text">Your donations, time and prayers keep our doors open for the next generation.</p>
          <div class="hero-ctas d-flex flex-wrap justify-content-center">
            <a class="btn site-btn btn-sun site-btn-lg" href="donations"><svg class="ico"><use href="#i-heart"/></svg>Donate</a>
            <a class="btn site-btn btn-glass site-btn-lg" href="contact">Volunteer<svg class="ico arr"><use href="#i-arrow"/></svg></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
