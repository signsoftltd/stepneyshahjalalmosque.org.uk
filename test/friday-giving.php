<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'friday-giving',
	'donations' => true,
	'title' => 'Friday Giving | Stepney Shah Jalal Mosque',
	'description' => 'Friday Giving at Stepney Shah Jalal Mosque: donate automatically every Jumu\'ah and never miss the reward of charity on the best day of the week.',
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Friday Giving</span>
      <h1>Give every <em>Jumu'ah</em></h1>
      <p>Donate every Friday automatically, and never miss the reward of charity on the best day of the week.</p>
    </div>
  </section>

  <!-- ============ Why Friday ============ -->
  <section class="section wrap fg-section" aria-labelledby="fg-why">
    <div class="container site-container">
      <div class="row site-row gy-5 gx-lg-5">
        <div class="col-lg-7">
          <div class="fg-copy">
            <span class="kicker">The blessed day</span>
            <h2 id="fg-why">Multiply your blessings <em>every Friday</em></h2>
            <p class="fg-lead">Set up Friday Giving once, and a donation of your choice goes to the masjid every Jumu'ah, even on the busiest weeks.</p>
            <figure class="verse" style="margin:0">
              <div class="ar" lang="ar" dir="rtl">خَيْرُ يَوْمٍ طَلَعَتْ عَلَيْهِ الشَّمْسُ يَوْمُ الْجُمُعَةِ</div>
              <figcaption><span class="en">The Messenger of Allah ﷺ said: “The best day on which the sun rises is Friday.”</span><br><small>Sahih Muslim</small></figcaption>
            </figure>
            <p>Friday is the day of congregation. Masjids fill for the khutbah and the Jumu'ah prayer, families come together and the whole community meets: a weekly Eid for the believers. Giving on this day joins your charity to the most blessed day of the week.</p>
            <p>Small, regular gifts add up. Your Friday Giving keeps our doors open, our classes running and our food bank stocked, week after week.</p>
          </div>
        </div>
        <div class="col-lg-5">
          <aside class="fg-checklist" aria-labelledby="fg-list">
            <h3 id="fg-list">Your Friday checklist</h3>
            <ul>
              <li><span class="gem sm"><svg class="ico"><use href="#i-drop"/></svg></span><span><b>Ghusl &amp; best clothes</b><small>Take a bath and wear your best, clean clothes</small></span></li>
              <li><span class="gem sm ind"><svg class="ico"><use href="#i-heart"/></svg></span><span><b>Send Salawat</b><small>Send abundant blessings upon the Prophet ﷺ</small></span></li>
              <li><span class="gem sm grn"><svg class="ico"><use href="#i-quran"/></svg></span><span><b>Recite Surah Al-Kahf</b><small>Read or listen to Surah Al-Kahf</small></span></li>
              <li><span class="gem sm sun"><svg class="ico"><use href="#i-mosque"/></svg></span><span><b>Pray Jumu'ah</b><small>Arrive early and listen to the khutbah</small></span></li>
              <li><span class="gem sm"><svg class="ico"><use href="#i-clock"/></svg></span><span><b>Make du'a before Maghrib</b><small>Seek the hour when du'a is answered</small></span></li>
              <li><span class="gem sm grn"><svg class="ico"><use href="#i-coins"/></svg></span><span><b>Never miss charity</b><small>Let Friday Giving do it for you</small></span></li>
            </ul>
            <a class="btn site-btn btn-sun site-btn-lg" href="#fg-give"><svg class="ico"><use href="#i-heart"/></svg>Start Friday Giving</a>
          </aside>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ Give ============ -->
  <section class="section wrap band fg-give" id="fg-give" aria-labelledby="fg-give-title">
    <div class="container site-container">
      <div class="sec-head text-center d-grid justify-content-center">
        <div class="intro justify-items-center"><span class="kicker">Set up your gift</span><h2 id="fg-give-title">Start your <em>Friday Giving</em></h2><p class="lede mx-auto">Choose how much you would like to give each Friday. UK taxpayers can add 25% through Gift Aid at no extra cost.</p></div>
      </div>
      <div class="fg-widget"><div class="donation-root" data-causes="438" data-columns="col-12" data-allow-quick="true"></div></div>
    </div>
  </section>

  <!-- ============ Closing du'a ============ -->
  <section class="section wrap" aria-label="Closing du'a">
    <div class="container site-container">
      <div class="fg-dua on-dark">
        <div class="pattern"></div>
        <p>May Allah enable us all to realise the blessings of Jumu'ah, and accept our charity. <span>Ameen.</span></p>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
