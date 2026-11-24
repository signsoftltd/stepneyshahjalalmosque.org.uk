<?php
require __DIR__ . '/includes/init.php';

/* Donors are kept in includes/donors.json: one entry per plaque, in display order.
   "star": true shows the gold star badge on that plaque (as on the previous website). */
$donors = json_decode((string) @file_get_contents(__DIR__ . '/includes/donors.json'), true);
if (!is_array($donors)) $donors = [];
$donors = array_values(array_filter($donors, function ($d) { return trim((string) ($d['name'] ?? '')) !== ''; }));
$count = count($donors);

/* Each plaque gets a finish (like a wall of metal and enamel plaques). Starred donors are gold;
   the others take a finish picked from their name, so it stays the same when the list changes. */
function donor_finish($d)
{
	if (!empty($d['star'])) return 'gold';
	$finishes = ['navy', 'bronze', 'silver', 'charcoal', 'green'];
	return $finishes[abs(crc32((string) $d['name'])) % count($finishes)];
}
/* Smaller text for long names, so they fit inside the hexagon */
function donor_size($name)
{
	$len = mb_strlen($name);
	return $len > 46 ? ' xl' : ($len > 30 ? ' lg' : '');
}

/* Plaques load in batches as the visitor scrolls: the first batch is in the page,
   the full list goes to assets/js/donor-wall.js as data (n = name, a = street, c = classes, s = star). */
const DONOR_BATCH = 60;
$donor_data = array_map(function ($d) {
	$name = (string) $d['name'];
	$addr = trim((string) ($d['address'] ?? ''));
	if (stripos($addr, 'N/A') === 0) $addr = '';
	$row = ['n' => $name, 'a' => $addr, 'c' => 'f-' . donor_finish($d) . donor_size($name)];
	if (!empty($d['star'])) $row['s'] = 1;
	return $row;
}, $donors);

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
    <div class="dw-wood" aria-hidden="true"></div>
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
        <label class="dw-search">
          <span class="visually-hidden">Search donors by name or street</span>
          <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input type="search" id="dwSearch" placeholder="Search by name or street" autocomplete="off">
        </label>
        <p class="dw-status" id="dwStatus" aria-live="polite">Showing all <?= $count ?> donors</p>
      </div>

      <div class="dw-wall">
        <div class="dw-sign">
          <span class="dw-bolt" aria-hidden="true"></span><span class="dw-bolt" aria-hidden="true"></span>
          <svg class="ico dw-sign-leaf" aria-hidden="true"><use href="#i-sprout"/></svg>
          <h2 id="dw-title">Donor Recognition Wall</h2>
          <span class="dw-sign-sub">Stepney Shahjalal Mosque &amp; Cultural Centre</span>
        </div>

        <!-- Hexagon plaques in a honeycomb; assets/js/donor-wall.js centres the rows, loads more on scroll and searches -->
        <div class="dw-hive">
          <ul class="dw-grid" id="dwGrid">
<?php foreach (array_slice($donor_data, 0, DONOR_BATCH) as $d): ?>
            <li class="dw-plaque <?= e($d['c']) ?>"><span class="dw-hex"><span class="dw-face"><?php if (!empty($d['s'])): ?><span class="dw-star" aria-hidden="true">★</span><?php endif; ?><b><?= e($d['n']) ?></b><?php if ($d['a'] !== ''): ?><span class="dw-addr"><?= e($d['a']) ?></span><?php endif; ?></span></span></li>
<?php endforeach; ?>
          </ul>
        </div>
        <div class="dw-more" id="dwMore" role="status"<?= $count > DONOR_BATCH ? '' : ' hidden' ?>><span class="dw-spinner" aria-hidden="true"></span>Loading more donors…</div>
        <p class="dw-empty" id="dwEmpty" hidden>No donors found. Try a different name or street.</p>
        <script type="application/json" id="dwData" data-batch="<?= DONOR_BATCH ?>"><?= json_encode($donor_data, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?></script>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
