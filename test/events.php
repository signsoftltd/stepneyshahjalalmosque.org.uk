<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'events',
	'title' => 'Events | Stepney Shah Jalal Mosque',
	'description' => 'Upcoming and past events at Stepney Shah Jalal Mosque: lectures, classes, children\'s and youth activities, sisters\' circles and community gatherings.',
	'nav' => 'events',
	'scripts' => [
		'assets/js/events.js',
	],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark app-no-hero">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">What's on</span>
      <h1>All <em>Events</em></h1>
      <p>Lectures, classes, children's and youth activities, sisters' circles and community gatherings. Everyone is welcome.</p>
    </div>
  </section>

  <section class="section wrap" aria-labelledby="ev-list-title" style="padding-top:clamp(40px,5vw,72px)">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-center justify-content-between">
        <h2 id="ev-list-title" class="visually-hidden">Events</h2>
        <div class="seg" role="group" aria-label="Show events">
          <button class="nav-link seg-btn" type="button" data-show="upcoming" aria-pressed="true">Upcoming</button>
          <button class="nav-link seg-btn" type="button" data-show="past" aria-pressed="false">Past events</button>
        </div>
        <a class="link-arrow" href="contact">Planning a visit or booking? Contact us<svg class="ico"><use href="#i-arrow"/></svg></a>
      </div>
      <div class="events events-all" id="events-grid" aria-live="polite"></div>
      <div class="ev-more-wrap"><button class="btn site-btn btn-line site-btn-lg" type="button" id="evMore" hidden>Load more events</button></div>
    </div>
  </section>
</main>
<?php
$page['after'] = <<<'HTML'
<script>
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- Events: upcoming / past, with "Load more" ---------- */
  const VIEWS = {
    upcoming: { query: 'upcoming=1', empty: 'No upcoming events yet. Check back soon.' },
    past: { query: 'past=1', empty: 'No past events to show.' }
  };
  const start = location.hash === '#past' ? 'past' : 'upcoming';
  const events = HIUKEvents.mount($('#events-grid'), {
    query: VIEWS[start].query, empty: VIEWS[start].empty, limit: 9,
    more: $('#evMore'), contactHref: 'contact', withYear: true
  });
  const tabs = document.querySelectorAll('[data-show]');
  function select(view) {
    tabs.forEach((t) => { const on = t.dataset.show === view; t.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  }
  select(start);
  tabs.forEach((t) => t.addEventListener('click', () => {
    if (t.getAttribute('aria-pressed') === 'true') return;
    select(t.dataset.show);
    history.replaceState(null, '', t.dataset.show === 'past' ? '#past' : location.pathname);
    events.show(VIEWS[t.dataset.show].query, VIEWS[t.dataset.show].empty);
  }));
})();
</script>
HTML;
require __DIR__ . '/includes/footer.php';
