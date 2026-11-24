<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'trustees',
	'title' => 'Trustees | Stepney Shah Jalal Mosque',
	'description' => 'The Board of Directors and Trustees of Stepney Shahjalal Mosque & Cultural Centre.',
	'nav' => 'trustees',
	'scripts' => [
		'assets/js/trustees.js',
	],
];

/* The board is managed in the admin panel (Trustees); assets/js/trustees.js loads it.
   This list is the built-in default, shown if the admin panel can't be reached.
   The first four are shown as the leadership; the other officers follow,
   and everyone with the role "Trustee" is listed under Trustees. */
$board = [
	['Mr Arzoo Miah', 'Chairman'],
	['Mr Nazmul Hasan', 'Vice Chair'],
	['Mr Abu Bokkor', 'Secretary'],
	['Md Rejaul Karim', 'Treasurer'],
	['Mr Nazrul Islam Ali', 'Education Secretary'],
	['Mr Abdus Samad', 'Assistant Secretary'],
	['Md Sofijur Rahman', 'Assistant Treasurer'],
	['Md Shamim Ahmed Chowdhury', 'Assistant Education'],
	['Mr Ali Hussain', 'Trustee'],
	['Mr Md Elias Miah', 'Trustee'],
	['Mr Mohammad Yusuf Choudhury', 'Trustee'],
	['Mr Mohammed Faruk Ahmed', 'Trustee'],
	['Mr Muhammad Abdul Latif', 'Trustee'],
	['Md Fuad Ahmed', 'Trustee'],
	['Muhammad Shafiq Islam', 'Trustee'],
];

/* Initials for the avatar, skipping titles such as Mr / Md */
function trustee_initials($name)
{
	$skip = ['mr', 'md', 'mrs', 'ms', 'dr'];
	$parts = array_values(array_filter(preg_split('/\s+/', $name), function ($w) use ($skip) {
		return !in_array(strtolower(rtrim($w, '.')), $skip, true);
	}));
	if (!$parts) return '';
	$first = mb_substr($parts[0], 0, 1);
	$last = count($parts) > 1 ? mb_substr(end($parts), 0, 1) : '';
	return mb_strtoupper($first . $last);
}

/* A small card: avatar, name and role */
function trustee_card($t, $tone = '')
{
	return '<li class="tr-card' . ($tone ? ' ' . $tone : '') . '"><span class="tr-avatar" aria-hidden="true">' . e(trustee_initials($t[0])) . '</span>'
		. '<span class="tr-text"><b>' . e($t[0]) . '</b><span>' . e($t[1]) . '</span></span></li>';
}

$officers = array_values(array_filter($board, function ($t) { return $t[1] !== 'Trustee'; }));
$leaders = array_slice($officers, 0, 4);
$other_officers = array_slice($officers, 4);
$trustees = array_values(array_filter($board, function ($t) { return $t[1] === 'Trustee'; }));
$leader_icons = ['mosque', 'users', 'pencil', 'coins'];

require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Our people</span>
      <h1>Board of <em>Trustees</em></h1>
      <p>The Board of Directors and Trustees who oversee Stepney Shahjalal Mosque &amp; Cultural Centre on behalf of our community.</p>
      <div class="pol-meta"><span data-tr="count"><?= count($board) ?> board members</span><span>Elected every two years</span></div>
    </div>
  </section>

  <!-- ============ Leadership ============ -->
  <section class="section wrap" aria-labelledby="leaders-title">
    <div class="container site-container">
      <div class="sec-head">
        <div class="intro"><span class="kicker">Board of Directors</span><h2 id="leaders-title">Our <em>leadership</em></h2></div>
      </div>
      <ul class="tr-leaders" data-tr-list="leaders">
<?php foreach ($leaders as $i => $t): ?>
        <li class="tr-leader">
          <span class="tr-leader-avatar" aria-hidden="true"><?= e(trustee_initials($t[0])) ?></span>
          <h3><?= e($t[0]) ?></h3>
          <span class="tr-role"><svg class="ico" aria-hidden="true"><use href="#i-<?= $leader_icons[$i] ?? 'check' ?>"/></svg><?= e($t[1]) ?></span>
        </li>
<?php endforeach; ?>
      </ul>

      <div data-tr-group="officers"<?= $other_officers ? '' : ' hidden' ?>>
        <h3 class="tr-subhead">Officers</h3>
        <ul class="tr-grid" data-tr-list="officers">
<?php foreach ($other_officers as $t): ?>
          <?= trustee_card($t, 'ind') ?>

<?php endforeach; ?>
        </ul>
      </div>
    </div>
  </section>

  <!-- ============ Trustees ============ -->
  <section class="section wrap band" aria-labelledby="trustees-title">
    <div class="container site-container">
      <div class="sec-head">
        <div class="intro"><span class="kicker">Trustees</span><h2 id="trustees-title">Our <em>trustees</em></h2></div>
      </div>
      <ul class="tr-grid" data-tr-list="trustees">
<?php foreach ($trustees as $t): ?>
        <?= trustee_card($t) ?>

<?php endforeach; ?>
      </ul>
    </div>
  </section>

  <!-- ============ How the board works (from the previous website's About Us page) ============ -->
  <section class="section wrap" aria-labelledby="gov-title">
    <div class="container site-container">
      <div class="sec-head">
        <div class="intro"><span class="kicker">Governance</span><h2 id="gov-title">How the <em>board works</em></h2></div>
      </div>
      <div class="ab-grid ab-3">
        <div class="ab-card"><span class="gem sm"><svg class="ico"><use href="#i-users"/></svg></span><h3>Elected by members</h3><p>The Mosque is managed by a board of trustees, who are elected every two years by members of the Mosque.</p></div>
        <div class="ab-card"><span class="gem sm ind"><svg class="ico"><use href="#i-check"/></svg></span><h3>Properly regulated</h3><p>The activities and financial matters are regulated by the Charity Commission and Company law in the UK.</p></div>
        <div class="ab-card"><span class="gem sm grn"><svg class="ico"><use href="#i-quran"/></svg></span><h3>Guided by scholars</h3><p>To support the running of the Mosque and its activities, there is an advisory board of Imams, Islamic scholars and community leaders.</p></div>
      </div>
    </div>
  </section>

  <!-- ============ Get in touch ============ -->
  <section class="section wrap" aria-labelledby="tr-cta">
    <div class="container site-container">
      <div class="ab-cta on-dark">
        <div class="pattern"></div>
        <div class="ab-cta-in">
          <span class="kicker">Get involved</span>
          <h2 id="tr-cta">Speak to <em>the board</em></h2>
          <p>Have a question for the trustees, or would you like to become a member of the Mosque? We would love to hear from you.</p>
          <div class="hero-ctas d-flex flex-wrap justify-content-center">
            <a class="btn site-btn btn-sun site-btn-lg" href="contact">Contact us<svg class="ico arr"><use href="#i-arrow"/></svg></a>
            <a class="btn site-btn btn-glass site-btn-lg" href="about">Our story<svg class="ico arr"><use href="#i-arrow"/></svg></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
