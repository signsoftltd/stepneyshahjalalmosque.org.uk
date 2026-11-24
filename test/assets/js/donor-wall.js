/* Donor Wall: filter the plaques by name or street as the visitor types,
   and size the honeycomb so whole rows of hexagons sit centred on the wall. */
(function () {
  'use strict';
  const input = document.getElementById('dwSearch');
  const grid = document.getElementById('dwGrid');
  if (!input || !grid) return;
  const hive = grid.parentElement;
  const items = Array.from(grid.children);
  const status = document.getElementById('dwStatus');
  const empty = document.getElementById('dwEmpty');
  const total = items.length;

  // Every other row is pushed half a plaque across, so the width is n plaques plus that half.
  function fit() {
    const cs = getComputedStyle(hive);
    const s = parseFloat(cs.getPropertyValue('--s')) || 170;
    const m = parseFloat(cs.getPropertyValue('--m')) || 3;
    const cell = s + 2 * m;
    const offset = s / 2 + m;
    const avail = hive.clientWidth;
    let n = Math.max(1, Math.floor((avail - offset) / cell));
    // with only a few plaques showing, don't leave a wide empty row
    const shown = items.filter((li) => !li.hidden).length;
    if (shown > 0 && shown < n) n = shown;
    grid.style.width = Math.min(avail, Math.ceil(n * cell + offset)) + 'px';
  }

  let timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(apply, 120);
  });

  function apply() {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    items.forEach(function (li) {
      const match = !q || (li.dataset.search || '').indexOf(q) !== -1;
      li.hidden = !match;
      if (match) shown++;
    });
    if (status) status.textContent = q ? 'Showing ' + shown + ' of ' + total + ' donors' : 'Showing all ' + total + ' donors';
    if (empty) empty.hidden = shown !== 0;
    hive.hidden = shown === 0;
    fit();
  }

  fit();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(hive.parentElement);
  else window.addEventListener('resize', fit);
})();
