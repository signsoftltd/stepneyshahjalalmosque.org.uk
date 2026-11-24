<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'services',
	'title' => 'What We Do | Stepney Shah Jalal Mosque',
	'description' => 'What we do at Stepney Shah Jalal Mosque: the five daily prayers, Jummah, Eid and Tarawih prayers, the evening madrasah, facilities for women, and Islamic classes for children and adults.',
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
      <span class="kicker">Serving since 1985</span>
      <h1>What <em>we do</em></h1>
      <p>Prayer, learning and care for the community of Stepney Green, open 365 days a year and welcoming all Muslims, whatever their background.</p>
    </div>
  </section>

  <!-- Content below (up to the services list) is taken from the previous website's What We Do page -->

  <!-- ============ Current activities ============ -->
  <section class="section wrap" aria-labelledby="wd-activities">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">Current activities of the Mosque</span><h2 id="wd-activities">Prayer and <em>learning</em></h2></div>
        <a class="btn site-btn btn-ind site-btn-lg" href="timetable">Prayer timetable<svg class="ico arr"><use href="#i-arrow"/></svg></a>
      </div>
      <div class="ab-grid">
        <div class="ab-card"><span class="gem sm"><svg class="ico"><use href="#i-mosque"/></svg></span><h3>5 daily prayers</h3><p>The Mosque has been open 365 days a year for the five daily prayers. We have 100-200 people attend on average for each prayer through which they have been fulfilling their spiritual needs. Also the imam makes himself available for advice and consultation after each prayer.</p></div>
        <div class="ab-card"><span class="gem sm ind"><svg class="ico"><use href="#i-users"/></svg></span><h3>Jummah</h3><p>Every Friday the Mosque is open for the Jummah prayer. On average 1500-2000 people attend including children and women. A sermon is given to encourage people to be a responsible and caring Muslim and to participate locally to create social harmony; this is followed by a congregational prayer.</p></div>
        <div class="ab-card"><span class="gem sm grn"><svg class="ico"><use href="#i-lamp"/></svg></span><h3>Eid and Tarawih prayers</h3><p>The two Eid prayers are held in the Mosque, normally in 4 jama’ah, and approximately 4000 people attend each Eid prayer including children and women. During the month of Ramadan, approximately 800 people attend the Tarawih prayers each night.</p></div>
        <div class="ab-card"><span class="gem sm sun"><svg class="ico"><use href="#i-quran"/></svg></span><h3>Evening madrasah</h3><p>The Mosque has been a place of education and learning for the local community. Almost 200 pupils are taught a wide range of Islamic subjects from Monday to Friday for two hours each evening.</p></div>
      </div>
    </div>
  </section>

  <!-- ============ Facilities for women and classes ============ -->
  <section class="section wrap band" aria-labelledby="wd-women">
    <div class="container site-container">
      <div class="row site-row gy-4 gx-lg-5">
        <div class="col-lg-5">
          <div class="ab-copy">
            <span class="kicker">For sisters</span>
            <h2 id="wd-women">Facilities for <em>women</em></h2>
            <p>The Mosque provides prayer facilities for women for daily prayer, Jummah, Eid and Ramadan. The organisation provides counselling and education support services for women, including the Women’s Link Project, which works with isolated women to address social and welfare issues such as domestic violence, mental health and parental skills.</p>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="ab-copy">
            <span class="kicker">Classes and sessions</span>
            <h2>Islamic <em>education</em></h2>
            <div class="ab-story ev-rich">
              <p>The Mosque is open for five daily prayers, Jummah, 2 Eid prayers and Tarawih in Ramadan with a small separate prayer facility for women. Other activities include children’s (boys’ and girls’ classes) evening and weekend Islamic school for maktab, hifz and pre-alim and alim classes (currently 260 children, and 20 male and female teachers in both the evening and weekend Islamic school), regular Tafseer sessions, Qur’an learning sessions, Arabic language classes and sessions regarding health, Islamic and social activities for men and women.</p>
              <p>Sessions are also open to non-Muslims to raise awareness of Islam and to promote social harmony amongst different faiths.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ A mosque for everyone ============ -->
  <section class="section wrap ab-section" aria-labelledby="wd-everyone">
    <div class="container site-container">
      <div class="row site-row align-items-center gy-5 gx-lg-5">
        <div class="col-lg-5">
          <figure class="ab-photo"><img src="assets/images/dome.jpg" alt="The green dome and minarets of a mosque at sunset" loading="lazy"></figure>
        </div>
        <div class="col-lg-7">
          <div class="ab-copy">
            <span class="kicker">Our community</span>
            <h2 id="wd-everyone">A mosque for <em>everyone</em></h2>
            <div class="ab-story ev-rich">
              <p>The facilities for prayer and Islamic education for children and adults are arranged according to the Qur’an and teachings of Prophet Muhammad (S). Initially, worshippers were primarily of Asian descent, however as the local community became more diverse, so did worshippers. Now those who attend the mosque range from Asian, Arabian, African and European origin. The mosque has grown to be a place of worship which welcomes all Muslims, regardless of their background. The mosque aims to accommodate everyone within the needs of UK law.</p>
              <p>Though this organisation was originally set up by local people of Bangladeshi ethnic origin, responding to population growth and the local demographic profile, membership has been offered to Somali, Arab and other Muslim communities. Services accommodate the needs of all service users. Membership is also extended to women, young people and people with disabilities. Current services are for the wider community as well.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Services are managed in the admin panel (Home page > Services), the same as on the home page -->
<?php $svc_class = 'band'; require __DIR__ . '/includes/services-section.php'; ?>

  <!-- ============ How to ask for help ============ -->
  <section class="section wrap" aria-labelledby="svc-steps">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro"><span class="kicker">Getting started</span><h2 id="svc-steps">How to <em>ask for help</em></h2></div>
      </div>
      <div class="ab-grid ab-3">
        <div class="ab-card"><span class="gem sm"><svg class="ico"><use href="#i-phone"/></svg></span><h3>1. Get in touch</h3><p>Call, email or send us a message, or speak to us at the masjid after any prayer.</p><a class="link-arrow" href="contact">Contact us<svg class="ico"><use href="#i-arrow"/></svg></a></div>
        <div class="ab-card"><span class="gem sm ind"><svg class="ico"><use href="#i-chat"/></svg></span><h3>2. Tell us what you need</h3><p>We listen, answer your questions and put you in touch with the right person.</p></div>
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
          <p>81-83 Duckett Street, London E1 4TD</p>
          <div class="hero-ctas d-flex flex-wrap justify-content-center">
            <a class="btn site-btn btn-sun site-btn-lg" href="tel:+442072658603"><svg class="ico"><use href="#i-phone"/></svg>020 7265 8603</a>
            <a class="btn site-btn btn-glass site-btn-lg" href="contact">Send a message<svg class="ico arr"><use href="#i-arrow"/></svg></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
