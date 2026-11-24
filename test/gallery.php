<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'gallery',
	'title' => 'Gallery | Hefazothe Islam UK',
	'description' => 'Photos from Hefazothe Islam UK: prayers, classes, events and community life at our masjid on Barking Road, London.',
	'scripts' => [
		'assets/js/gallery.js',
	],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Gallery</span>
      <h1>Moments from our <em>community</em></h1>
      <p>Prayers, classes, events and the people who make our masjid a home.</p>
    </div>
  </section>

  <section class="section wrap gallery-page" id="gallery" aria-label="All photos" data-limit="24" data-empty="No photos have been added yet. Please check back soon.">
    <div class="container site-container">
      <div class="gallery gallery-all" id="galleryGrid" aria-live="polite"><p class="empty">Loading photos…</p></div>
      <div class="ev-more-wrap"><button class="btn site-btn btn-line site-btn-lg" type="button" id="galleryMore" hidden>Show more photos</button></div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
