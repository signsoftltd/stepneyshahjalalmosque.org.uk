<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => '',
	'donations' => true,
	'title' => 'Stepney Shah Jalal Mosque',
	'description' => 'Stepney Shah Jalal Mosque, working for humanity since 1999 — prayer times, Jumu\'ah, events, Islamic education, Zakat and community services.',
	'nav' => 'home',
	'home' => true,
	'og_type' => 'website',
	'head' => <<<'HTML'
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Mosque","name":"Stepney Shah Jalal Mosque","foundingDate":"1999","description":"Mosque and Islamic community centre offering daily prayers, Jumu'ah, education, Zakat assistance and community welfare.","address":{"@type":"PostalAddress","streetAddress":"534 Barking Road","addressLocality":"London","postalCode":"E13 8QE","addressCountry":"GB"},"telephone":"+447878561130","email":"info@hefazotheislamuk.org"}
</script>
HTML,
	'scripts' => [
		'assets/js/events.js',
		'assets/js/hijri.js',
		'assets/js/site.js',
		'assets/js/banner.js',
		'assets/js/services.js',
		'assets/js/gallery.js',
		'assets/js/videos.js',
		'assets/js/zakat.js',
	],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <!-- ============ Hero ============ -->
  <section class="hero wrap on-dark" id="top" aria-labelledby="hero-title">
    <div class="hero-bg" id="heroBg" aria-hidden="true"></div>
    <div class="pattern pat-fade"></div>
    <div class="container site-container hero-wrap">
     <div class="row site-row align-items-center gy-5 gx-lg-5">
      <div class="hero-copy stagger col-lg-6">
        <!-- Banner text, buttons and pictures can be changed in the admin panel (Banner); this is the built-in default -->
        <span class="kicker" data-banner="kicker">Working for humanity · Est. 1999</span>
        <div class="bismillah" lang="ar" dir="rtl" data-banner="bismillah">بِسْمِ ٱللّٰهِ ٱلرَّحْمٰنِ ٱلرَّحِيمِ</div>
        <h1 id="hero-title" data-banner="heading">Welcome to <em>Stepney Shah Jalal</em> <span style="white-space:nowrap">Mosque</span></h1>
        <p class="hero-sub" data-banner="subtitle">Serving our community through worship, education and unity. A house of prayer and a home for every generation.</p>
        <div class="hero-ctas d-flex flex-wrap">
          <a class="btn site-btn btn-sun site-btn-lg" href="#prayer" data-banner="btn1"><svg class="ico"><use href="#i-clock"/></svg><span>Prayer Times</span></a>
          <a class="btn site-btn btn-glass site-btn-lg" href="donations" data-banner="btn2"><span>Donate Now</span><svg class="ico arr"><use href="#i-arrow"/></svg></a>
        </div>
        <div class="hero-facts">
          <span data-banner="fact1"><svg class="ico"><use href="#i-mosque"/></svg><span>Five daily prayers</span></span>
          <span data-banner="fact2"><svg class="ico"><use href="#i-users"/></svg><span>Sisters' prayer hall</span></span>
          <span data-banner="fact3"><svg class="ico"><use href="#i-access"/></svg><span>Step-free access</span></span>
        </div>
      </div>

      <div class="col-lg-6 d-flex justify-content-center">
       <div class="hero-visual">
        <svg class="arch-art" viewBox="0 0 460 590" role="img" aria-label="Illustration of the mosque at dusk with a green dome, framed by a pointed arch">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10154A"/><stop offset=".4" stop-color="#37144A"/><stop offset=".72" stop-color="#9A3040"/><stop offset="1" stop-color="#F58A38"/></linearGradient>
            <radialGradient id="glow" cx=".5" cy="1" r=".75"><stop offset="0" stop-color="#FFC27A" stop-opacity=".85"/><stop offset=".55" stop-color="#FFC27A" stop-opacity=".1"/><stop offset="1" stop-color="#FFC27A" stop-opacity="0"/></radialGradient>
            <linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3AE"/><stop offset="1" stop-color="#F58A38"/></linearGradient>
            <linearGradient id="dome" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#34A866"/><stop offset=".5" stop-color="#14844C"/><stop offset="1" stop-color="#0A4A2B"/></linearGradient>
            <clipPath id="archClip"><path d="M20 590 V250 C20 130 120 50 230 20 C340 50 440 130 440 250 V590 Z"/></clipPath>
            <mask id="cres"><rect width="460" height="590" fill="#fff"/><circle cx="328" cy="118" r="25" fill="#000"/></mask>
          </defs>
          <g clip-path="url(#archClip)">
            <rect width="460" height="590" fill="url(#sky)"/>
            <rect width="460" height="590" fill="url(#glow)"/>
            <g fill="#FFF1DD">
              <circle class="twinkle" cx="62" cy="130" r="1.3"/><circle class="twinkle" cx="112" cy="92" r="1"/><circle class="twinkle" cx="152" cy="162" r="1.5"/><circle class="twinkle" cx="204" cy="78" r="1.1"/><circle class="twinkle" cx="258" cy="118" r="1.2"/><circle class="twinkle" cx="392" cy="196" r="1.4"/><circle class="twinkle" cx="410" cy="150" r="1"/><circle class="twinkle" cx="92" cy="214" r="1"/><circle class="twinkle" cx="352" cy="226" r="1.2"/><circle class="twinkle" cx="182" cy="226" r=".9"/><circle class="twinkle" cx="300" cy="62" r="1"/><circle class="twinkle" cx="424" cy="258" r=".9"/><circle class="twinkle" cx="42" cy="270" r=".9"/><circle class="twinkle" cx="236" cy="178" r=".8"/>
            </g>
            <circle cx="310" cy="128" r="46" fill="#7DB832" opacity=".10"/>
            <circle cx="310" cy="128" r="27" fill="#7DB832" mask="url(#cres)"/>
            <g fill="#14060C">
              <path d="M0 528 Q230 506 460 528 V590 H0Z"/>
              <rect x="64" y="300" width="26" height="290"/><rect x="58" y="358" width="38" height="8" rx="2"/><rect x="60" y="300" width="34" height="6" rx="2"/><path d="M62 300 L77 248 L92 300Z"/><rect x="76" y="232" width="2" height="18"/><circle cx="77" cy="229" r="3"/>
              <rect x="370" y="300" width="26" height="290"/><rect x="364" y="358" width="38" height="8" rx="2"/><rect x="366" y="300" width="34" height="6" rx="2"/><path d="M368 300 L383 248 L398 300Z"/><rect x="382" y="232" width="2" height="18"/><circle cx="383" cy="229" r="3"/>
              <rect x="110" y="442" width="240" height="148"/>
              <rect x="160" y="412" width="140" height="32"/>
            </g>
            <g fill="url(#dome)">
              <path d="M118 444 C118 414 136 400 150 390 C164 400 182 414 182 444Z"/>
              <path d="M278 444 C278 414 296 400 310 390 C324 400 342 414 342 444Z"/>
              <path d="M158 414 C158 348 200 320 230 290 C260 320 302 348 302 414Z"/>
            </g>
            <rect x="228.5" y="258" width="3" height="34" fill="#A8D56A"/>
            <circle cx="230" cy="254" r="4.5" fill="#A8D56A"/>
            <g fill="url(#win)">
              <path d="M136 520 V496 a8 8 0 0 1 16 0 V520Z" opacity=".9"/>
              <path d="M172 520 V496 a8 8 0 0 1 16 0 V520Z" opacity=".75"/>
              <path d="M272 520 V496 a8 8 0 0 1 16 0 V520Z" opacity=".75"/>
              <path d="M308 520 V496 a8 8 0 0 1 16 0 V520Z" opacity=".9"/>
              <path d="M212 590 V540 a18 18 0 0 1 36 0 V590Z"/>
              <path d="M180 432 V424 a4 4 0 0 1 8 0 V432Z M204 432 V424 a4 4 0 0 1 8 0 V432Z M248 432 V424 a4 4 0 0 1 8 0 V432Z M272 432 V424 a4 4 0 0 1 8 0 V432Z" opacity=".65"/>
              <rect x="73" y="384" width="8" height="14" rx="4" opacity=".65"/><rect x="379" y="384" width="8" height="14" rx="4" opacity=".65"/>
            </g>
          </g>
          <path d="M20 590 V250 C20 130 120 50 230 20 C340 50 440 130 440 250 V590" fill="none" stroke="#A8D56A" stroke-width="1.4"/>
          <path d="M6 590 V248 C6 122 112 36 230 4 C348 36 454 122 454 248 V590" fill="none" stroke="#A8D56A" stroke-opacity=".38" stroke-width="1"/>
        </svg>
        <!-- To use a photo instead: set SITE.images.hero in the settings at the bottom of the page -->
        <div class="arch-photo" id="heroPhoto" hidden></div>

        <div class="glass" aria-live="off">
          <div class="g-row"><span class="lbl">Next prayer</span><span class="ar js-next-ar" lang="ar"></span></div>
          <div class="g-row"><span class="name js-next-name">…</span><span class="meta js-next-time"></span></div>
          <div class="g-row"><span class="count tnum js-count">--:--:--</span><span class="meta js-next-jam"></span></div>
          <div class="pbar"><i class="js-bar"></i></div>
        </div>
       </div>
      </div>
     </div>
    </div>
  </section>

  <!-- Day strip -->
  <div class="daystrip wrap">
    <div class="container site-container">
      <div class="daystrip-card row g-0">
        <div class="ds-item col-md-6 col-xl-3"><span class="ds-lbl">Today</span><span class="ds-val" id="sDate">Sunday 27 September 2026</span></div>
        <div class="ds-item col-md-6 col-xl-3"><span class="ds-lbl">Hijri date</span><span class="ds-val" id="sHijri">…</span><span class="ds-ar" id="sHijriAr" lang="ar" dir="rtl"></span></div>
        <div class="ds-item col-md-6 col-xl-3"><span class="ds-lbl">Jumu'ah · <span id="sFri">Fri 2 Oct</span></span><span class="ds-val" id="sJum">…</span></div>
        <a class="ds-cta col-md-6 col-xl-3" href="#prayer"><span><b>Today's prayer times</b><small>Begins, Jama'ah &amp; weekly timetable</small></span><span class="circle"><svg class="ico"><use href="#i-arrow"/></svg></span></a>
      </div>
    </div>
  </div>

  <!-- ============ Prayer times ============ -->
  <section class="section wrap" id="prayer" aria-labelledby="prayer-title">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro">
          <span class="kicker">Salah</span>
          <h2 id="prayer-title">Prayer <em>Times</em></h2>
          <p class="lede">Begins and Jama'ah times for London. The arc follows the sun through today's prayers so you can see at a glance where the day stands.</p>
        </div>
        <a class="btn site-btn btn-line site-btn-lg" href="timetable" id="viewWeek">View Full Timetable<svg class="ico arr"><use href="#i-arrow"/></svg></a>
      </div>

      <div class="row site-row gy-4">
       <div class="col-12">
        <div class="p-panel">
          <div class="p-panel-top d-flex flex-wrap justify-content-between align-items-center">
            <ul class="seg nav nav-pills" role="tablist" aria-label="Timetable view">
              <li class="nav-item" role="presentation"><button class="nav-link seg-btn active" type="button" role="tab" id="tab-today" data-bs-toggle="pill" data-bs-target="#panel-today" aria-controls="panel-today" aria-selected="true">Today</button></li>
              <li class="nav-item" role="presentation"><button class="nav-link seg-btn" type="button" role="tab" id="tab-week" data-bs-toggle="pill" data-bs-target="#panel-week" aria-controls="panel-week" aria-selected="false" tabindex="-1">This week</button></li>
            </ul>
            <span class="p-city"><span id="pDate">Sun 27 Sep</span> · <span id="pHijri"></span></span>
          </div>
          <div class="tab-content">
          <div class="tab-pane fade show active" id="panel-today" role="tabpanel" aria-labelledby="tab-today" tabindex="0">
            <div class="today-pane">
              <div class="arc-wrap"><svg class="arc" id="arc" viewBox="0 0 1000 300" role="img" aria-label="Today's prayers along the path of the sun"></svg></div>
              <ul class="rows" id="rows"></ul>
            </div>
          </div>
          <div class="tab-pane fade" id="panel-week" role="tabpanel" aria-labelledby="tab-week" tabindex="0">
            <div class="week table-responsive">
              <table class="table week-table align-middle">
                <caption class="visually-hidden">Prayer timetable for the next seven days, begins time with Jama'ah below</caption>
                <thead><tr><th scope="col">Date</th><th scope="col">Fajr</th><th scope="col">Sunrise</th><th scope="col">Dhuhr</th><th scope="col">Asr</th><th scope="col">Maghrib</th><th scope="col">Isha</th></tr></thead>
                <tbody id="week"></tbody>
              </table>
            </div>
          </div>
          </div>
        </div>
       </div>
      </div>
    </div>
  </section>

  <!-- ============ Current appeal (admin panel: Home Page > Appeal; hidden until it is switched on) ============ -->
  <section class="section wrap appeal-section" id="appeal" aria-labelledby="appeal-title" hidden>
    <div class="container site-container">
      <div class="appeal on-dark">
        <div class="appeal-bg" aria-hidden="true"></div>
        <div class="pattern"></div>
        <div class="appeal-in">
          <span class="kicker" data-appeal="kicker">Current appeal</span>
          <h2 id="appeal-title" data-appeal="title"></h2>
          <p class="appeal-text" data-appeal="text" hidden></p>
          <div class="appeal-bar" role="progressbar" aria-labelledby="appeal-title" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <span class="appeal-fill"></span><b class="appeal-pct" data-appeal="percent">0%</b>
          </div>
          <div class="appeal-nums">
            <div><b class="tnum" data-appeal="raised">£0</b><small>Raised</small></div>
            <div><b class="tnum" data-appeal="goal">£0</b><small>Goal</small></div>
          </div>
          <a class="btn site-btn btn-sun site-btn-lg" href="donations" data-appeal="button"><svg class="ico"><use href="#i-heart"/></svg><span>Donate Now</span></a>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ Events ============ -->
  <section class="section wrap" id="events" aria-labelledby="ev-title">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">What's on</span><h2 id="ev-title">Upcoming <em>Events</em></h2></div>
        <a class="btn site-btn btn-ind site-btn-lg" href="events">View All Events<svg class="ico arr"><use href="#i-arrow"/></svg></a>
      </div>
      <div class="events" id="events-grid" aria-live="polite"></div>
    </div>
  </section>

  <!-- ============ Services (also on the Services page) ============ -->
<?php $svc_class = 'band'; require __DIR__ . '/includes/services-section.php'; ?>

  <!-- ============ About ============ -->
  <section class="section wrap" id="about" aria-labelledby="about-title">
    <div class="container site-container">
     <div class="row site-row align-items-center gy-5 gx-lg-5">
      <div class="col-lg-5">
       <div class="about-visual">
        <svg viewBox="0 0 500 620" role="img" aria-label="Illustration of the prayer hall with arched windows and prayer rows">
          <defs>
            <clipPath id="aClip"><path d="M20 620 V270 C20 140 130 55 250 22 C370 55 480 140 480 270 V620 Z"/></clipPath>
            <linearGradient id="light" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF9EA"/><stop offset="1" stop-color="#F0D9A8"/></linearGradient>
            <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9E0CB"/><stop offset="1" stop-color="#DDD0B2"/></linearGradient>
            <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#044326"/><stop offset="1" stop-color="#006738"/></linearGradient>
            <pattern id="lattice" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9Z" fill="none" stroke="#8CC63E" stroke-width=".9" stroke-opacity=".55"/></pattern>
          </defs>
          <g clip-path="url(#aClip)">
            <rect width="500" height="620" fill="url(#wall)"/>
            <g>
              <path d="M90 390 V214 C90 186 108 168 130 152 C152 168 170 186 170 214 V390Z" fill="url(#light)"/>
              <path d="M90 390 V214 C90 186 108 168 130 152 C152 168 170 186 170 214 V390Z" fill="url(#lattice)"/>
              <path d="M200 390 V190 C200 156 224 134 250 116 C276 134 300 156 300 190 V390Z" fill="url(#light)"/>
              <path d="M200 390 V190 C200 156 224 134 250 116 C276 134 300 156 300 190 V390Z" fill="url(#lattice)"/>
              <path d="M330 390 V214 C330 186 348 168 370 152 C392 168 410 186 410 214 V390Z" fill="url(#light)"/>
              <path d="M330 390 V214 C330 186 348 168 370 152 C392 168 410 186 410 214 V390Z" fill="url(#lattice)"/>
              <g fill="none" stroke="#B8651F" stroke-width="2"><path d="M86 392 V214 C86 184 106 164 130 147 C154 164 174 184 174 214 V392"/><path d="M196 392 V190 C196 153 222 130 250 111 C278 130 304 153 304 190 V392"/><path d="M326 392 V214 C326 184 346 164 370 147 C394 164 414 184 414 214 V392"/></g>
            </g>
            <line x1="250" y1="0" x2="250" y2="78" stroke="#7A4A12" stroke-width="1.5"/>
            <ellipse cx="250" cy="86" rx="46" ry="8" fill="none" stroke="#467C12" stroke-width="2"/>
            <g fill="#FFC27A"><circle cx="208" cy="88" r="3"/><circle cx="229" cy="93" r="3"/><circle cx="250" cy="94" r="3"/><circle cx="271" cy="93" r="3"/><circle cx="292" cy="88" r="3"/></g>
            <rect x="0" y="390" width="500" height="10" fill="#CDBB94"/>
            <rect x="0" y="400" width="500" height="220" fill="url(#floor)"/>
            <ellipse cx="250" cy="410" rx="230" ry="26" fill="#FFC27A" opacity=".16"/>
            <g stroke="#8CC63E" stroke-opacity=".6" stroke-width="1.4"><line x1="0" y1="418" x2="500" y2="418"/><line x1="0" y1="440" x2="500" y2="440"/><line x1="0" y1="468" x2="500" y2="468"/><line x1="0" y1="504" x2="500" y2="504"/><line x1="0" y1="550" x2="500" y2="550"/><line x1="0" y1="606" x2="500" y2="606"/></g>
            <g fill="none" stroke="#8CC63E" stroke-opacity=".35" stroke-width="1"><path d="M10 550 v-24 q12 -14 24 0 v24 M58 550 v-24 q12 -14 24 0 v24 M106 550 v-24 q12 -14 24 0 v24 M154 550 v-24 q12 -14 24 0 v24 M202 550 v-24 q12 -14 24 0 v24 M250 550 v-24 q12 -14 24 0 v24 M298 550 v-24 q12 -14 24 0 v24 M346 550 v-24 q12 -14 24 0 v24 M394 550 v-24 q12 -14 24 0 v24 M442 550 v-24 q12 -14 24 0 v24"/></g>
          </g>
          <path d="M20 620 V270 C20 140 130 55 250 22 C370 55 480 140 480 270 V620" fill="none" stroke="#8CC63E" stroke-width="1.4"/>
        </svg>
        <div class="imam" data-about="imam"><div class="avatar" aria-hidden="true">Im</div><div><b>[Imam's name]</b><span>Head Imam · Hafiz &amp; Alim</span></div></div>
       </div>
      </div>

      <div class="about-copy col-lg-7">
        <!-- Text can be changed in the admin panel (Home Page > About Section); this is the built-in default -->
        <span class="kicker" data-about="kicker">About the mosque</span>
        <h2 id="about-title" data-about="heading">A place of worship, <em>learning</em> and belonging</h2>
        <p data-about="body">[Add your history here: who founded the mosque and how it has grown.] Stepney Shah Jalal Mosque was established in 1999 and has worked for humanity ever since, welcoming worshippers and serving families across East London every day of the week.</p>
        <blockquote class="quote" data-about="quote">“Our doors are open to everyone who seeks the remembrance of Allah, and to every neighbour who needs a hand.”</blockquote>
        <div class="values row site-row row-cols-2 row-cols-sm-4" aria-label="Our values" data-about="values">
          <div class="value col"><b>Ihsan</b><span>Excellence in worship and service</span></div>
          <div class="value col"><b>Knowledge</b><span>Learning for every age</span></div>
          <div class="value col"><b>Unity</b><span>One community, many backgrounds</span></div>
          <div class="value col"><b>Trust</b><span>Transparent with every pound</span></div>
        </div>
        <div class="facilities" data-about="facilities">
          <h4>Facilities</h4>
          <span><svg class="ico"><use href="#i-mosque"/></svg>Main prayer hall</span>
          <span><svg class="ico"><use href="#i-users"/></svg>Sisters' prayer hall</span>
          <span><svg class="ico"><use href="#i-drop"/></svg>Wudu facilities</span>
          <span><svg class="ico"><use href="#i-quran"/></svg>Classrooms &amp; library</span>
          <span><svg class="ico"><use href="#i-access"/></svg>Step-free access</span>
          <span><svg class="ico"><use href="#i-car"/></svg>On-site parking</span>
        </div>
        <a class="link-arrow" href="about" data-about="link"><span>Read our full story</span><svg class="ico"><use href="#i-arrow"/></svg></a>
      </div>
     </div>
    </div>
  </section>

  <!-- ============ Gallery (photos managed in the admin panel; hidden until there is at least one) ============ -->
  <section class="section wrap band" id="gallery" aria-labelledby="gallery-title" data-limit="5" hidden>
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">Gallery</span><h2 id="gallery-title">Moments from our <em>community</em></h2><p class="lede">Prayers, classes, events and the people who make our masjid a home.</p></div>
        <a class="btn site-btn btn-ind site-btn-lg" href="gallery">View All Pictures<svg class="ico arr"><use href="#i-arrow"/></svg></a>
      </div>
      <div class="gallery gallery-5" id="galleryGrid" aria-live="polite"></div>
    </div>
  </section>

  <!-- ============ Video gallery (YouTube links managed in the admin panel; hidden until there is at least one) ============ -->
  <section class="section wrap" id="videos" aria-labelledby="videos-title" data-limit="6" hidden>
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">Video gallery</span><h2 id="videos-title">Watch &amp; <em>listen</em></h2><p class="lede">Khutbahs, lectures, recitations and highlights from our events.</p></div>
        <a class="btn site-btn btn-ind site-btn-lg" href="videos">View All Videos<svg class="ico arr"><use href="#i-arrow"/></svg></a>
      </div>
      <div class="vgallery" id="videoGrid" aria-live="polite"></div>
    </div>
  </section>

  <!-- ============ Friday Giving (Sign Soft donation app, cause 438) ============ -->
  <section class="section wrap band fg-home" id="friday-giving" aria-labelledby="fg-home-title">
    <div class="pattern"></div>
    <div class="container site-container">
      <div class="row site-row align-items-center gy-5 gx-lg-5">
        <div class="col-lg-7">
          <div class="fg-home-copy">
            <span class="kicker">Friday Giving</span>
            <h2 id="fg-home-title">Donate every Friday <em>automatically</em></h2>
            <p>Multiply your blessings every Jumu'ah! Make sure you never miss charity on the best day of the week, a day of so many virtues.</p>
            <a class="link-arrow" href="friday-giving">Why give on Friday?<svg class="ico"><use href="#i-arrow"/></svg></a>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="fg-widget"><div class="donation-root" data-causes="438" data-columns="col-12" data-allow-quick="true"></div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ Ramadan Giving (Sign Soft donation app, causes 439-442) ============ -->
  <section class="section wrap gv-home" id="ramadan-giving" aria-labelledby="gv-ramadan-title">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">Ramadan Giving</span><h2 id="gv-ramadan-title">Give every night of <em>Ramadan</em></h2></div>
        <a class="btn site-btn btn-ind site-btn-lg" href="ramadan-giving">Learn more<svg class="ico arr"><use href="#i-arrow"/></svg></a>
      </div>
      <div class="gv-widget"><div class="donation-root" data-causes="439,440,441,442" data-columns="col-12 col-md-6 col-xl-3" data-allow-quick="true"></div></div>
    </div>
  </section>

  <!-- ============ Hajj Giving (Sign Soft donation app, causes 443-444) ============ -->
  <section class="section wrap band gv-home" id="hajj-giving" aria-labelledby="gv-hajj-title">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">Hajj Giving</span><h2 id="gv-hajj-title">Give through the days of <em>Dhul Hijjah</em></h2></div>
        <a class="btn site-btn btn-ind site-btn-lg" href="hajj-giving">Learn more<svg class="ico arr"><use href="#i-arrow"/></svg></a>
      </div>
      <div class="gv-widget gv-widget-2"><div class="donation-root" data-causes="443,444" data-columns="col-12 col-md-6" data-allow-quick="true"></div></div>
    </div>
  </section>

  <!-- ============ Zakat (Nisab from the admin panel's Zakat prices) ============ -->
  <section class="section wrap" id="zakat" aria-labelledby="zakat-title">
    <div class="container site-container">
      <div class="zk-home-card on-dark" id="zakatHome">
        <div class="pattern"></div>
        <div class="row site-row g-4 gx-lg-5 align-items-center">
          <div class="col-lg-6">
            <div class="zk-home-copy">
              <span class="kicker">Zakat</span>
              <h2 id="zakat-title">Calculate your <em>Zakat</em></h2>
              <p>Zakat is 2.5% of the wealth you have held for a full lunar year above the Nisab. Our calculator uses today's gold and silver prices and walks you through your savings, investments and debts in a few minutes.</p>
              <figure class="verse" style="margin:0">
                <div class="ar" lang="ar" dir="rtl">وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ</div>
                <figcaption><span class="en">“And establish prayer and give Zakat, and bow with those who bow.”</span><br><small>Al-Baqarah 2:43</small></figcaption>
              </figure>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="zk-home-nisab" aria-live="polite">
              <div class="zk-tile"><small>Gold Nisab</small><b data-zkh="gold-nisab">…</b><span data-zkh="gold-detail">87.48 g</span></div>
              <div class="zk-tile"><small>Silver Nisab</small><b data-zkh="silver-nisab">…</b><span data-zkh="silver-detail">612.36 g</span></div>
              <div class="zk-tile wide"><b>2.5%</b><span>of net zakatable wealth, once it has been above the Nisab for one lunar year (hawl).</span></div>
              <p class="zk-home-updated" data-zkh="updated"></p>
            </div>
            <div class="zk-home-ctas">
              <a class="btn site-btn btn-sun site-btn-lg" href="zakat"><svg class="ico"><use href="#i-coins"/></svg>Zakat Calculator</a>
              <a class="btn site-btn btn-glass site-btn-lg" href="donations">Pay Zakat<svg class="ico arr"><use href="#i-arrow"/></svg></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ Donate ============ -->
  <section class="section wrap" id="donate" aria-labelledby="don-title">
    <div class="container site-container">
     <div class="row site-row align-items-center gy-5 gx-lg-5">
      <div class="donate-copy col-lg-7">
        <span class="kicker">Donations</span>
        <h2 id="don-title">Support your <em>masjid</em></h2>
        <p class="lede">Your Sadaqah, Lillah and Zakat keep our doors open, our classes running and our food bank stocked. UK taxpayers can add 25% through Gift Aid at no extra cost.</p>
        <figure class="verse" style="margin:0">
          <div class="ar" lang="ar" dir="rtl">مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ ٱللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ</div>
          <figcaption><span class="en">“The example of those who spend their wealth in the way of Allah is like a seed which grows seven ears.”</span><br><small>Al-Baqarah 2:261</small></figcaption>
        </figure>
        <div class="ways d-flex flex-wrap">
          <span><svg class="ico"><use href="#i-check"/></svg>Registered charity 1079423</span>
          <span><svg class="ico"><use href="#i-check"/></svg>100% Zakat policy</span>
          <span><svg class="ico"><use href="#i-check"/></svg>Bank transfer &amp; standing order</span>
        </div>
      </div>

      <div class="col-lg-5"><div class="donation-root" data-causes="74" data-columns="col-12" data-allow-quick="true"></div></div>
     </div>
    </div>
  </section>

  <!-- ============ FAQs ============ -->
  <section class="section wrap" id="faq" aria-labelledby="faq-title">
    <div class="container site-container">
     <div class="row site-row gy-5 gx-lg-5 align-items-start">
      <div class="col-lg-5">
      <div class="faq-aside">
        <span class="kicker">Questions</span>
        <h2 id="faq-title">Frequently asked <em>questions</em></h2>
        <p class="lede">Quick answers about prayers, services, giving and visiting. Can't find what you need? We're glad to help.</p>
        <div class="faq-help">
          <b>Still have a question?</b>
          <p>Call us on 07878 561130 or send a message and a member of the team will get back to you.</p>
          <a class="btn site-btn btn-ind" href="contact">Contact us<svg class="ico arr"><use href="#i-arrow"/></svg></a>
        </div>
      </div>
      </div>
      <div class="col-lg-7"><div class="faq-list accordion" id="faqList"></div></div>
     </div>
    </div>
  </section>

</main>
<?php
require __DIR__ . '/includes/footer.php';
