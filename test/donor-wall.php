<?php
require __DIR__ . '/includes/init.php';

/* Donors are kept in includes/donors.json: one entry per plaque, in display order.
   "star": true shows the gold star badge on that plaque (as on the previous website). */
$donors = json_decode((string) @file_get_contents(__DIR__ . '/includes/donors.json'), true);
if (!is_array($donors)) $donors = [];
$count = count($donors);

$page = [
	'path' => 'donor-wall',
	'title' => 'Donor Wall | Stepney Shah Jalal Mosque',
	'description' => 'In eternal recognition of the ' . $count . ' donors who gave generously for the sake of Allah to Stepney Shahjalal Mosque & Cultural Centre.',
	'nav' => 'donor-wall',
	'scripts' => [
		'assets/js/donor-wall.js',
	],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero dw-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <div class="bismillah" lang="ar" dir="rtl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
      <span class="kicker">Stepney Shahjalal Mosque &amp; Cultural Centre</span>
      <h1>Donor <em>Wall</em></h1>
      <p>In eternal recognition of those who gave generously for the sake of Allah</p>
      <div class="dw-count"><b class="tnum"><?= $count ?></b><span>Honoured donors</span></div>
    </div>
  </section>

  <section class="section wrap" aria-labelledby="dw-title">
    <div class="container site-container">
      <figure class="verse dw-verse">
        <div class="ar" lang="ar" dir="rtl">مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ ٱللَّهِ كَمَثَلِ حَبَّةٍ أَنۢبَتَتْ سَبْعَ سَنَابِلَ فِى كُلِّ سُنۢبُلَةٍ مِّا۟ئَةُ حَبَّةٍ</div>
        <figcaption><span class="en">“The example of those who spend their wealth in the way of Allah is like a seed that grows seven ears, each bearing a hundred grains. And Allah multiplies for whom He wills.”</span><br><small>Al-Baqarah · 2:261</small></figcaption>
      </figure>

      <div class="dw-tools">
        <h2 id="dw-title" class="visually-hidden">Our donors</h2>
        <label class="dw-search">
          <span class="visually-hidden">Search donors by name or street</span>
          <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input type="search" id="dwSearch" placeholder="Search by name or street" autocomplete="off">
        </label>
        <p class="dw-status" id="dwStatus" aria-live="polite">Showing all <?= $count ?> donors</p>
      </div>

      <ul class="dw-grid" id="dwGrid">
<?php foreach ($donors as $d):
	$name = (string) ($d['name'] ?? '');
	$addr = (string) ($d['address'] ?? '');
	if ($name === '') continue;
?>
        <li class="dw-plaque" data-search="<?= e(mb_strtolower($name . ' ' . $addr)) ?>"><?php if (!empty($d['star'])): ?><span class="dw-star" aria-hidden="true">★</span><?php endif; ?><b><?= e($name) ?></b><span><?= e($addr) ?></span></li>
<?php endforeach; ?>
      </ul>
      <p class="dw-empty" id="dwEmpty" hidden>No donors found. Try a different name or street.</p>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
