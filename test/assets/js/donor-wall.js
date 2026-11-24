/* Donor Wall: plaques load in batches as the visitor scrolls down the wall, the search
   looks through every donor, and the honeycomb is sized so whole rows sit centred.
   donor-wall.php puts the first batch in the page and the full list in #dwData. */
(function () {
  'use strict';
  const input = document.getElementById('dwSearch');
  const grid = document.getElementById('dwGrid');
  const dataEl = document.getElementById('dwData');
  if (!grid || !dataEl) return;
  const hive = grid.parentElement;
  const status = document.getElementById('dwStatus');
  const empty = document.getElementById('dwEmpty');
  const more = document.getElementById('dwMore');

  let all = [];
  try { all = JSON.parse(dataEl.textContent) || []; } catch (e) { return; } // keep the plaques already in the page
  const BATCH = parseInt(dataEl.dataset.batch, 10) || 60;
  all.forEach((d) => { d.q = (d.n + ' ' + (d.a || '')).toLowerCase(); });

  let list = all;                          // donors matching the search
  let shown = grid.children.length;        // how many of them are on the wall

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plaque = (d) => `<li class="dw-plaque ${esc(d.c || 'f-navy')}"><span class="dw-hex"><span class="dw-face">${d.s ? '<span class="dw-star" aria-hidden="true">★</span>' : ''}<b>${esc(d.n)}</b>${d.a ? `<span class="dw-addr">${esc(d.a)}</span>` : ''}</span></span></li>`;

  // Every other row is pushed half a plaque across, so the width is n plaques plus that half.
  function fit() {
    const cs = getComputedStyle(hive);
    const s = parseFloat(cs.getPropertyValue('--s')) || 170;
    const m = parseFloat(cs.getPropertyValue('--m')) || 3;
    const cell = s + 2 * m;
    const offset = s / 2 + m;
    const avail = hive.clientWidth;
    let n = Math.max(1, Math.floor((avail - offset) / cell));
    if (list.length > 0 && list.length < n) n = list.length; // few matches: no wide empty row
    grid.style.width = Math.min(avail, Math.ceil(n * cell + offset)) + 'px';
  }

  function loadMore() {
    if (shown >= list.length) return;
    grid.insertAdjacentHTML('beforeend', list.slice(shown, shown + BATCH).map(plaque).join(''));
    shown = Math.min(list.length, shown + BATCH);
    update();
  }

  function update() {
    if (more) more.hidden = shown >= list.length;
  }

  // Load the next batch when the "Loading more" line comes within 600px of the bottom of the screen
  // (repeats until the screen is filled, e.g. on tall screens)
  function check() {
    let guard = 20;
    while (more && !more.hidden && guard-- > 0 && more.getBoundingClientRect().top < window.innerHeight + 600) loadMore();
  }
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; check(); });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  function search() {
    const q = input.value.trim().toLowerCase();
    list = q ? all.filter((d) => d.q.indexOf(q) !== -1) : all;
    grid.innerHTML = '';
    shown = 0;
    if (status) status.textContent = q ? 'Showing ' + list.length + ' of ' + all.length + ' donors' : 'Showing all ' + all.length + ' donors';
    if (empty) empty.hidden = list.length !== 0;
    hive.hidden = list.length === 0;
    fit();
    loadMore();
    check();
  }

  if (input) {
    let timer;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(search, 150);
    });
  }

  fit();
  update();
  check();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(hive.parentElement);
  else window.addEventListener('resize', fit);
})();
