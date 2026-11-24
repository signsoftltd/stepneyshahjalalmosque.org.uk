<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'timetable',
	'title' => 'Prayer Timetable | Stepney Shah Jalal Mosque',
	'description' => 'Prayer timetable for Stepney Shah Jalal Mosque, London: begins and Jama\'ah times for Fajr, Dhuhr, Asr, Maghrib and Isha, and Jumu\'ah, for every day of the month.',
	'nav' => 'timetable',
	'scripts' => [
		'assets/js/hijri.js',
		'assets/js/timetable-page.js',
	],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Salah</span>
      <h1>Prayer <em>timetable</em></h1>
      <p>Begins and Jama'ah times for every day of the month at our masjid on Barking Road, London.</p>
    </div>
  </section>

  <section class="section wrap tt-page" id="timetable" aria-labelledby="ttMonth">
    <div class="container site-container">
      <div class="tt-bar">
        <div class="tt-nav">
          <button class="tt-arrow tt-prev" type="button" id="ttPrev" aria-label="Previous month"><svg class="ico"><use href="#i-chev"/></svg></button>
          <div class="tt-title"><h2 id="ttMonth" aria-live="polite">Prayer timetable</h2><span id="ttHijri"></span></div>
          <button class="tt-arrow" type="button" id="ttNext" aria-label="Next month"><svg class="ico"><use href="#i-chev"/></svg></button>
        </div>
        <div class="tt-actions">
          <label class="visually-hidden" for="ttSelect">Choose a month</label>
          <select class="form-select tt-select" id="ttSelect"></select>
          <button class="btn site-btn btn-line site-btn-sm" type="button" id="ttToday" hidden><svg class="ico"><use href="#i-cal"/></svg>Today</button>
          <button class="btn site-btn btn-ind site-btn-sm" type="button" id="ttPrint"><svg class="ico" viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z"/></svg>Print</button>
        </div>
      </div>
      <p class="tt-key"><span><b>5:20 am</b> Begins</span><span><small>5:45 am</small> Jama'ah</span><span><i class="tt-key-fri"></i> Friday: Dhuhr is Jumu'ah (two Jama'ahs)</span><span><i class="tt-key-today"></i> Today</span></p>
      <div class="tt-wrap">
        <table class="table tt-table">
          <caption class="visually-hidden">Prayer times for the month: the begins time of each prayer, with the Jama'ah time below it</caption>
          <thead><tr><th scope="col">Date</th><th scope="col">Fajr</th><th scope="col">Sunrise</th><th scope="col">Dhuhr</th><th scope="col">Asr</th><th scope="col">Maghrib</th><th scope="col">Isha</th></tr></thead>
          <tbody id="ttBody"><tr><td colspan="7" class="tt-msg">Loading the timetable…</td></tr></tbody>
        </table>
      </div>
      <p class="tt-note">Prayer times are for Stepney Shah Jalal Mosque and the surrounding area and follow UK local time, including British Summer Time (BST) when applicable. Hijri dates follow our Islamic calendar and may be adjusted following the sighting of the moon.</p>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
