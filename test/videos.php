<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'videos',
	'title' => 'Videos | Hefazothe Islam UK',
	'description' => 'Videos from Hefazothe Islam UK: khutbahs, lectures, Quran recitations and highlights from events at our masjid in London.',
	'scripts' => [
		'assets/js/videos.js',
	],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Video gallery</span>
      <h1>Watch &amp; <em>listen</em></h1>
      <p>Khutbahs, lectures, recitations and highlights from our events.</p>
    </div>
  </section>

  <section class="section wrap videos-page" id="videos" aria-label="All videos" data-limit="12" data-empty="No videos have been added yet. Please check back soon.">
    <div class="container site-container">
      <div class="vgallery" id="videoGrid" aria-live="polite"><p class="empty">Loading videos…</p></div>
      <div class="ev-more-wrap"><button class="btn site-btn btn-line site-btn-lg" type="button" id="videoMore" hidden>Show more videos</button></div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
