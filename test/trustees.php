<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'trustees',
	'title' => 'Trustees | Stepney Shah Jalal Mosque',
	'description' => 'The Board of Directors and Trustees of Stepney Shahjalal Mosque & Cultural Centre.',
	'nav' => 'trustees',
];

/* Board of Directors / Trustees: name and role, in the order they are listed.
   The first group are the officers; everyone with the role "Trustee" is listed under Trustees. */
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

/* Initials for the avatar, skipping titles such as Mr / Md / Muhammad */
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

$officers = array_filter($board, function ($t) { return $t[1] !== 'Trustee'; });
$trustees = array_filter($board, function ($t) { return $t[1] === 'Trustee'; });

require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Our people</span>
      <h1>Board of <em>Trustees</em></h1>
      <p>The Board of Directors and Trustees who oversee Stepney Shahjalal Mosque &amp; Cultural Centre on behalf of our community.</p>
    </div>
  </section>

  <section class="section wrap" aria-labelledby="officers-title">
    <div class="container site-container">
      <div class="sec-head">
        <div class="intro"><span class="kicker">Board of Directors</span><h2 id="officers-title">Our <em>officers</em></h2></div>
      </div>
      <ul class="tr-grid">
<?php foreach ($officers as $t): ?>
        <li class="tr-card"><span class="tr-avatar" aria-hidden="true"><?= e(trustee_initials($t[0])) ?></span><span class="tr-text"><b><?= e($t[0]) ?></b><span><?= e($t[1]) ?></span></span></li>
<?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section class="section wrap band" aria-labelledby="trustees-title">
    <div class="container site-container">
      <div class="sec-head">
        <div class="intro"><span class="kicker">Trustees</span><h2 id="trustees-title">Our <em>trustees</em></h2></div>
      </div>
      <ul class="tr-grid">
<?php foreach ($trustees as $t): ?>
        <li class="tr-card"><span class="tr-avatar" aria-hidden="true"><?= e(trustee_initials($t[0])) ?></span><span class="tr-text"><b><?= e($t[0]) ?></b><span><?= e($t[1]) ?></span></span></li>
<?php endforeach; ?>
      </ul>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
