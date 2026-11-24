/* Hefazothe Islam UK: YouTube video gallery, managed in the admin panel (Videos).
   Used on the home page (a preview) and videos.php (all videos). Settings on the #videos section:
     data-limit   videos per load (default 6)
     data-empty   message when there are no videos; without it the section stays hidden instead
   A #videoMore button, if present, loads the next batch. The YouTube player (privacy-enhanced
   youtube-nocookie.com) is only loaded when a visitor clicks play. */
(function () {
  'use strict';
  const section = document.getElementById('videos');
  const grid = document.getElementById('videoGrid');
  const more = document.getElementById('videoMore');
  if (!section || !grid) return;

  const API = (window.HIUK_API || 'https://manage.stepneyshahjalalmosque.org.uk/api/public') + '/videos';
  const PAGE = Number(section.dataset.limit) || 6;
  const EMPTY = section.dataset.empty || '';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const PLAY = '<svg viewBox="0 0 68 48" aria-hidden="true"><path class="v-play-bg" d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.3.3 34 .3 34 .3s-21.3 0-26.5 1.4a8.5 8.5 0 0 0-6 6C.1 12.9.1 24 .1 24s0 11.1 1.4 16.3a8.5 8.5 0 0 0 6 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35.1 67.9 24 67.9 24s0-11.1-1.4-16.3z"/><path fill="#fff" d="M27 34V14l18 10z"/></svg>';
  let videos = [];
  let offset = 0;

  function render() {
    grid.innerHTML = videos.map((v, i) => `
      <button class="v-item" type="button" data-i="${i}" aria-label="${esc('Play video' + (v.title ? ': ' + v.title : ''))}">
        <span class="v-thumb"><img src="${esc(v.thumb)}" alt="" loading="lazy" width="480" height="360"><span class="v-play">${PLAY}</span></span>
        ${v.title ? `<span class="v-title">${esc(v.title)}</span>` : ''}
      </button>`).join('');
  }

  function load() {
    if (more) more.disabled = true;
    fetch(`${API}?limit=${PAGE}&offset=${offset}`, { headers: { Accept: 'application/json' } })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((data) => {
        const list = (data && data.videos) || [];
        videos = videos.concat(list);
        offset += list.length;
        if (!videos.length) {
          if (EMPTY) { section.hidden = false; grid.innerHTML = `<p class="empty">${esc(EMPTY)}</p>`; }
          return;
        }
        section.hidden = false;
        render();
        if (more) { more.hidden = !data.has_more; more.disabled = false; more.textContent = 'Show more videos'; }
      })
      .catch(() => {
        if (videos.length) { if (more) { more.disabled = false; more.textContent = 'Could not load more. Try again'; } return; }
        if (EMPTY) { section.hidden = false; grid.innerHTML = '<p class="empty">Videos could not be loaded right now. Please try again later.</p>'; }
      });
  }

  /* ---------- Player pop-up ---------- */
  let dlg = null;
  function player() {
    if (dlg) return dlg;
    dlg = document.createElement('div');
    dlg.className = 'modal fade v-modal';
    dlg.tabIndex = -1;
    dlg.setAttribute('aria-label', 'Video player');
    dlg.innerHTML = `<div class="modal-dialog modal-dialog-centered modal-xl"><div class="modal-content v-dialog">
      <button class="g-x" type="button" data-bs-dismiss="modal" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <div class="v-frame"></div>
      <div class="v-info"><span class="v-info-title"></span><a class="v-yt" target="_blank" rel="noopener">Watch on YouTube</a></div>
    </div></div>`;
    document.body.appendChild(dlg);
    // remove the player when closed so the video stops
    dlg.addEventListener('hidden.bs.modal', () => { dlg.querySelector('.v-frame').innerHTML = ''; });
    return dlg;
  }
  function play(v) {
    const d = player();
    const id = encodeURIComponent(v.youtube_id);
    d.querySelector('.v-frame').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1" title="${esc(v.title || 'YouTube video')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    d.querySelector('.v-info-title').textContent = v.title || '';
    d.querySelector('.v-yt').href = v.url;
    bootstrap.Modal.getOrCreateInstance(d).show();
  }

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.v-item');
    if (item && videos[item.dataset.i]) play(videos[item.dataset.i]);
  });
  if (more) more.addEventListener('click', load);

  load();
})();
