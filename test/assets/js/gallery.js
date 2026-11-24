/* Hefazothe Islam UK: photo gallery, managed in the admin panel (Gallery).
   Used on the home page (a preview) and gallery.php (all photos). Settings on the #gallery section:
     data-limit   photos per load (default 8)
     data-empty   message when there are no photos; without it the section stays hidden instead
   A #galleryMore button, if present, loads the next batch. Clicking a photo opens it full size,
   with previous / next buttons, arrow keys and swipe. */
(function () {
  'use strict';
  const section = document.getElementById('gallery');
  const grid = document.getElementById('galleryGrid');
  const more = document.getElementById('galleryMore');
  if (!section || !grid) return;

  const API = (window.HIUK_API || 'https://admin.hefazotheislamuk.org/api/public') + '/gallery';
  const PAGE = Number(section.dataset.limit) || 8;
  const EMPTY = section.dataset.empty || '';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let images = [];
  let offset = 0;

  function render() {
    grid.innerHTML = images.map((img, i) => `
      <button class="g-item" type="button" data-i="${i}" aria-label="${esc(img.caption ? 'Open photo: ' + img.caption : 'Open photo ' + (i + 1))}">
        <img src="${esc(img.thumb)}" alt="${esc(img.caption)}" loading="lazy"${img.width ? ` width="${img.width}" height="${img.height}"` : ''}>
        ${img.caption ? `<span class="g-cap">${esc(img.caption)}</span>` : ''}
      </button>`).join('');
  }

  function load() {
    if (more) more.disabled = true;
    fetch(`${API}?limit=${PAGE}&offset=${offset}`, { headers: { Accept: 'application/json' } })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((data) => {
        const list = (data && data.images) || [];
        images = images.concat(list);
        offset += list.length;
        if (!images.length) {
          // nothing to show: the home page keeps the section hidden, the gallery page says so
          if (EMPTY) { section.hidden = false; grid.innerHTML = `<p class="empty">${esc(EMPTY)}</p>`; }
          return;
        }
        section.hidden = false;
        render();
        if (more) { more.hidden = !data.has_more; more.disabled = false; more.textContent = 'Show more photos'; }
      })
      .catch(() => {
        if (images.length) { if (more) { more.disabled = false; more.textContent = 'Could not load more. Try again'; } return; }
        if (EMPTY) { section.hidden = false; grid.innerHTML = '<p class="empty">Photos could not be loaded right now. Please try again later.</p>'; }
      });
  }

  /* ---------- Full-size viewer ---------- */
  let dlg = null, current = 0, touchX = null;
  function viewer() {
    if (dlg) return dlg;
    dlg = document.createElement('div');
    dlg.className = 'modal fade g-modal';
    dlg.dataset.backdropClass = 'bd-gallery'; // darker backdrop behind photos (ui.js)
    dlg.tabIndex = -1;
    dlg.setAttribute('aria-label', 'Photo viewer');
    dlg.innerHTML = `<div class="modal-dialog modal-dialog-centered modal-xl"><div class="modal-content g-dialog">
      <button class="g-x" type="button" data-bs-dismiss="modal" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <figure class="g-fig"><img alt=""><figcaption></figcaption></figure>
      <button class="g-nav g-prev" type="button" aria-label="Previous photo"><svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg></button>
      <button class="g-nav g-next" type="button" aria-label="Next photo"><svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button>
      <span class="g-count"></span>
    </div></div>`;
    document.body.appendChild(dlg);
    dlg.querySelector('.g-prev').addEventListener('click', () => show(current - 1));
    dlg.querySelector('.g-next').addEventListener('click', () => show(current + 1));
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    dlg.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });
    return dlg;
  }
  function show(i) {
    if (!images.length) return;
    current = (i + images.length) % images.length;
    const img = images[current], d = viewer();
    const el = d.querySelector('.g-fig img');
    el.src = img.src;
    el.alt = img.caption || '';
    d.querySelector('figcaption').textContent = img.caption || '';
    d.querySelector('.g-count').textContent = (current + 1) + ' / ' + images.length;
    const single = images.length < 2;
    d.querySelectorAll('.g-nav').forEach((b) => { b.hidden = single; });
  }

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.g-item');
    if (!item) return;
    show(Number(item.dataset.i));
    bootstrap.Modal.getOrCreateInstance(viewer()).show();
  });
  if (more) more.addEventListener('click', load);

  load();
})();
