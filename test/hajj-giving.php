<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'hajj-giving',
	'donations' => true,
	'title' => 'Hajj Giving | Stepney Shah Jalal Mosque',
	'description' => 'Hajj Giving at Stepney Shah Jalal Mosque: donate automatically every day of the blessed first ten days of Dhul Hijjah.',
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Hajj Giving</span>
      <h1>Give through the days of <em>Dhul Hijjah</em></h1>
      <p>Donate automatically every day of the blessed first ten days of Dhul Hijjah, the best days of the year for good deeds.</p>
    </div>
  </section>

  <!-- ============ Why Dhul Hijjah ============ -->
  <section class="section wrap fg-section" aria-labelledby="gv-why">
    <div class="container site-container">
      <div class="row site-row gy-5 gx-lg-5">
        <div class="col-lg-7">
          <div class="fg-copy">
            <span class="kicker">The blessed ten days</span>
            <h2 id="gv-why">Don't miss the <em>best days</em> for charity</h2>
            <p class="fg-lead">Give at least £1 on each of the first ten days of Dhul Hijjah. In these blessed days, don't miss your chance for charity.</p>
            <figure class="verse" style="margin:0">
              <div class="ar" lang="ar" dir="rtl">وَالْفَجْرِ ۝ وَلَيَالٍ عَشْرٍ</div>
              <figcaption><span class="en">“By the dawn, and by the ten nights.”</span><br><small>Surah Al-Fajr 89:1–2</small></figcaption>
            </figure>
            <p>Allah swears by these ten nights in the Quran, and the Prophet ﷺ taught that no good deed is more beloved to Allah than one done in these days, while the pilgrims stand at Arafah and the whole Ummah prepares for Eid al-Adha.</p>
            <figure class="verse" style="margin:0">
              <div class="ar" lang="ar" dir="rtl">مَا مِنْ أَيَّامٍ الْعَمَلُ الصَّالِحُ فِيهَا أَحَبُّ إِلَى اللَّهِ مِنْ هَذِهِ الْأَيَّامِ</div>
              <figcaption><span class="en">The Prophet ﷺ said: “There are no days in which righteous deeds are more beloved to Allah than these days”, meaning the first ten days of Dhul Hijjah.</span><br><small>Sunan Abi Dawud &amp; Jami' at-Tirmidhi</small></figcaption>
            </figure>
            <p>Make giving part of your worship in these days, as steady as your prayers. Get closer to Allah: your journey begins now.</p>
          </div>
        </div>
        <div class="col-lg-5">
          <aside class="fg-checklist" aria-labelledby="gv-list">
            <h3 id="gv-list">Your Dhul Hijjah checklist</h3>
            <ul>
              <li><span class="gem sm"><svg class="ico"><use href="#i-clock"/></svg></span><span><b>Fast the first nine days</b><small>Especially the Day of Arafah</small></span></li>
              <li><span class="gem sm ind"><svg class="ico"><use href="#i-chat"/></svg></span><span><b>Dhikr &amp; takbeer</b><small>Remember Allah often and say the takbeer</small></span></li>
              <li><span class="gem sm grn"><svg class="ico"><use href="#i-coins"/></svg></span><span><b>Give charity every day</b><small>Let Hajj Giving do it for you</small></span></li>
              <li><span class="gem sm sun"><svg class="ico"><use href="#i-heart"/></svg></span><span><b>Offer Qurbani</b><small>Make your sacrifice for Eid al-Adha</small></span></li>
              <li><span class="gem sm"><svg class="ico"><use href="#i-quran"/></svg></span><span><b>Recite the Quran</b><small>Read a portion every day</small></span></li>
              <li><span class="gem sm ind"><svg class="ico"><use href="#i-lamp"/></svg></span><span><b>Du'a &amp; istighfar</b><small>Ask Allah often for forgiveness and good</small></span></li>
            </ul>
            <a class="btn site-btn btn-sun site-btn-lg" href="#gv-give"><svg class="ico"><use href="#i-heart"/></svg>Start Hajj Giving</a>
          </aside>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ Give (Sign Soft donation app, causes 427-428) ============ -->
  <section class="section wrap band fg-give" id="gv-give" aria-labelledby="gv-give-title">
    <div class="container site-container">
      <div class="sec-head text-center d-grid justify-content-center">
        <div class="intro"><span class="kicker">Set up your gift</span><h2 id="gv-give-title">Select your preferred <em>regular giving</em></h2><p class="lede mx-auto">Choose a daily donation for the days of Dhul Hijjah. UK taxpayers can add 25% through Gift Aid at no extra cost.</p></div>
      </div>
      <div class="gv-widget gv-widget-2"><div class="donation-root" data-causes="427,428" data-columns="col-12 col-md-6" data-allow-quick="true"></div></div>
    </div>
  </section>

  <!-- ============ Closing du'a ============ -->
  <section class="section wrap" aria-label="Closing du'a">
    <div class="container site-container">
      <div class="fg-dua on-dark">
        <div class="pattern"></div>
        <p>May Allah accept the Hajj of the pilgrims, and our good deeds in these blessed days. <span>Ameen.</span></p>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
