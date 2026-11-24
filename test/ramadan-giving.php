<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'ramadan-giving',
	'donations' => true,
	'title' => 'Ramadan Giving | Stepney Shah Jalal Mosque',
	'description' => 'Ramadan Giving at Stepney Shah Jalal Mosque: donate automatically on every night of Ramadan and never miss the reward of Laylatul Qadr.',
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Ramadan Giving</span>
      <h1>Give every night of <em>Ramadan</em></h1>
      <p>Donate automatically on each of the 30 nights of Ramadan, so you never miss the reward of Laylatul Qadr.</p>
    </div>
  </section>

  <!-- ============ Why Ramadan ============ -->
  <section class="section wrap fg-section" aria-labelledby="gv-why">
    <div class="container site-container">
      <div class="row site-row gy-5 gx-lg-5">
        <div class="col-lg-7">
          <div class="fg-copy">
            <span class="kicker">The month of mercy</span>
            <h2 id="gv-why">Multiply your reward this <em>Ramadan</em></h2>
            <p class="fg-lead">Give at least £1 on every night of Ramadan. If one of those nights is Laylatul Qadr, it is as if you had given every day for more than 83 years.</p>
            <figure class="verse" style="margin:0">
              <div class="ar" lang="ar" dir="rtl">لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ</div>
              <figcaption><span class="en">“The Night of Decree is better than a thousand months.”</span><br><small>Surah Al-Qadr 97:3</small></figcaption>
            </figure>
            <p>No one knows for certain which night is Laylatul Qadr. By setting up a daily donation for all 30 nights, your charity is there on every one of them, including the night that is better than a thousand months.</p>
            <figure class="verse" style="margin:0">
              <div class="ar" lang="ar" dir="rtl">أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ</div>
              <figcaption><span class="en">The Prophet ﷺ said: “The most beloved deeds to Allah are those done consistently, even if they are small.”</span><br><small>Sahih al-Bukhari &amp; Sahih Muslim</small></figcaption>
            </figure>
            <p>Make giving part of your Ramadan worship, as steady as your fasting and your prayers. Get closer to Allah: your journey begins now.</p>
          </div>
        </div>
        <div class="col-lg-5">
          <aside class="fg-checklist" aria-labelledby="gv-list">
            <h3 id="gv-list">Your Ramadan checklist</h3>
            <ul>
              <li><span class="gem sm"><svg class="ico"><use href="#i-clock"/></svg></span><span><b>Fast with sincerity</b><small>Make your intention and guard your tongue and actions</small></span></li>
              <li><span class="gem sm ind"><svg class="ico"><use href="#i-mosque"/></svg></span><span><b>Pray Taraweeh</b><small>Join the night prayers at the masjid</small></span></li>
              <li><span class="gem sm grn"><svg class="ico"><use href="#i-quran"/></svg></span><span><b>Recite the Quran daily</b><small>Ramadan is the month the Quran was revealed</small></span></li>
              <li><span class="gem sm sun"><svg class="ico"><use href="#i-lamp"/></svg></span><span><b>Seek Laylatul Qadr</b><small>Strive in worship in the last ten nights</small></span></li>
              <li><span class="gem sm"><svg class="ico"><use href="#i-heart"/></svg></span><span><b>Make du'a at iftar</b><small>Ask Allah for good at the moment of breaking your fast</small></span></li>
              <li><span class="gem sm grn"><svg class="ico"><use href="#i-coins"/></svg></span><span><b>Give every night</b><small>Let Ramadan Giving do it for you</small></span></li>
            </ul>
            <a class="btn site-btn btn-sun site-btn-lg" href="#gv-give"><svg class="ico"><use href="#i-heart"/></svg>Start Ramadan Giving</a>
          </aside>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ Give (Sign Soft donation app, causes 423-426) ============ -->
  <section class="section wrap band fg-give" id="gv-give" aria-labelledby="gv-give-title">
    <div class="container site-container">
      <div class="sec-head text-center d-grid justify-content-center">
        <div class="intro"><span class="kicker">Set up your gift</span><h2 id="gv-give-title">Select your preferred <em>regular giving</em></h2><p class="lede mx-auto">Choose a daily donation for the nights of Ramadan. UK taxpayers can add 25% through Gift Aid at no extra cost.</p></div>
      </div>
      <div class="gv-widget"><div class="donation-root" data-causes="423,424,425,426" data-columns="col-12 col-md-6 col-xl-3" data-allow-quick="true"></div></div>
    </div>
  </section>

  <!-- ============ Closing du'a ============ -->
  <section class="section wrap" aria-label="Closing du'a">
    <div class="container site-container">
      <div class="fg-dua on-dark">
        <div class="pattern"></div>
        <p>May Allah accept our fasting, prayers and charity, and grant us Laylatul Qadr. <span>Ameen.</span></p>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
