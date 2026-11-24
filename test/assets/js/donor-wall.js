/* Donor Wall: plaques load in batches as the visitor scrolls down the wall, the search
   looks through every donor, and the honeycomb is sized so whole rows sit centred.
   donor-wall.php puts the first batch in the page and its built-in list in #dwData;
   the list from the admin panel (Donor Wall) then replaces it, if it can be loaded. */
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
  const shiftStyle = document.head.appendChild(document.createElement('style'));
  let fittedTo = -1; // the wall width the honeycomb was last sized for
  function fit() {
    // measure a plaque (its size can follow the screen width on phones)
    const li = grid.querySelector('li');
    if (!li) return;
    const lcs = getComputedStyle(li);
    const s = parseFloat(lcs.width) || 170;
    const m = parseFloat(lcs.marginRight) || 0;
    const cell = s + 2 * m;
    const offset = s / 2 + m;
    const avail = hive.clientWidth;
    fittedTo = avail;
    let n = Math.max(1, Math.floor((avail - offset) / cell));
    if (list.length > 0 && list.length < n) n = list.length; // few matches: no wide empty row
    // n plaques on a row, and n on the next one shifted half a plaque across (+1px so rounding can't push one down)
    grid.style.width = Math.min(avail, Math.ceil(n * cell + offset) + 1) + 'px';
    // the first plaque of every second row (plaques n+1, 3n+1, 5n+1 ...) gets the extra half-plaque margin
    shiftStyle.textContent = `#dwGrid>li:nth-child(${2 * n}n+${n + 1}){margin-left:${m + offset}px}`;
  }

  function loadMore() {
    if (shown >= list.length) return;
    grid.insertAdjacentHTML('beforeend', list.slice(shown, shown + BATCH).map(plaque).join(''));
    shown = Math.min(list.length, shown + BATCH);
    if (hive.clientWidth !== fittedTo) fit(); // a longer page may have brought in the scrollbar
    update();
  }

  function update() {
    if (more) more.hidden = shown >= list.length;
  }

  // Load the next batch when the "Loading more" line comes within 600px of the bottom of the screen
  // (repeats until the screen is filled, e.g. on tall screens)
  function check() {
    // the wall's width can change without a resize event (e.g. when the page scrollbar appears)
    if (!hive.hidden && hive.clientWidth !== fittedTo) fit();
    let guard = 20;
    while (more && !more.hidden && guard-- > 0 && more.getBoundingClientRect().top < window.innerHeight + 600) loadMore();
  }
  let ticking = false;
  const onScroll = () => { // at most every 80ms while scrolling
    if (ticking) return;
    ticking = true;
    setTimeout(() => { ticking = false; check(); }, 80);
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
    loadMore();
    fit(); // after the plaques are in, so there is one to measure
    check();
  }

  if (input) {
    let timer;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(search, 150);
    });
  }

  // Replace the built-in list with the admin panel's, keeping as many plaques on the wall as there are now
  function useList(donors) {
    all = donors.filter((d) => d && d.n);
    all.forEach((d) => { d.q = (d.n + ' ' + (d.a || '')).toLowerCase(); });
    const q = input ? input.value.trim().toLowerCase() : '';
    list = q ? all.filter((d) => d.q.indexOf(q) !== -1) : all;
    const keep = Math.min(list.length, Math.max(shown, BATCH));
    grid.innerHTML = list.slice(0, keep).map(plaque).join('');
    shown = keep;
    document.querySelectorAll('[data-dw="count"]').forEach((el) => { el.textContent = all.length; });
    if (status) status.textContent = q ? 'Showing ' + list.length + ' of ' + all.length + ' donors' : 'Showing all ' + all.length + ' donors';
    if (empty) empty.hidden = list.length !== 0;
    hive.hidden = list.length === 0;
    fit();
    update();
    check();
  }

  const API = (window.HIUK_API || 'https://manage.stepneyshahjalalmosque.org.uk/api/public') + '/donors';
  fetch(API, { headers: { Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then((data) => { if (data && data.success && Array.isArray(data.donors)) useList(data.donors); })
    .catch(() => {}); // keep the built-in list

  fit();
  update();
  check();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(hive.parentElement);
  else window.addEventListener('resize', fit);
})();
