/* Donor Wall: filter the plaques by name or street as the visitor types. */
(function () {
  'use strict';
  const input = document.getElementById('dwSearch');
  const grid = document.getElementById('dwGrid');
  if (!input || !grid) return;
  const items = Array.from(grid.children);
  const status = document.getElementById('dwStatus');
  const empty = document.getElementById('dwEmpty');
  const total = items.length;

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
  }
})();
