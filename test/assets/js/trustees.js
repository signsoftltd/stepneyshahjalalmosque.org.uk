/* Stepney Shah Jalal Mosque: Trustees page board from the admin panel (Trustees).
   trustees.php holds the built-in default; this replaces it once the list loads,
   and leaves it as it is if it can't be loaded. */
(function () {
  'use strict';
  const API = (window.HIUK_API || 'https://manage.stepneyshahjalalmosque.org.uk/api/public') + '/trustees';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name) => (/^[a-z-]+$/.test(name || '') ? name : 'check');
  const initials = (name) => {
    // skip titles (Mr, Md, Dr...) and use the first and last name: "Mr Arzoo Miah" -> "AM"
    const words = String(name).replace(/[^\p{L}\s'-]/gu, ' ').trim().split(/\s+/).filter((w) => w && !/^(mr|mrs|ms|md|dr)$/i.test(w));
    if (!words.length) return '•';
    return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
  };
  const one = (sel) => document.querySelector(sel);

  const leader = (p) => `<li class="tr-leader"><span class="tr-leader-avatar" aria-hidden="true">${esc(initials(p.name))}</span><h3>${esc(p.name)}</h3>${p.role ? `<span class="tr-role"><svg class="ico" aria-hidden="true"><use href="#i-${icon(p.icon)}"/></svg>${esc(p.role)}</span>` : ''}</li>`;
  const card = (tone) => (p) => `<li class="tr-card${tone ? ' ' + tone : ''}"><span class="tr-avatar" aria-hidden="true">${esc(initials(p.name))}</span><span class="tr-text"><b>${esc(p.name)}</b>${p.role ? `<span>${esc(p.role)}</span>` : ''}</span></li>`;

  function fill(list, people, render) {
    const box = one(`[data-tr-list="${list}"]`);
    if (box) { box.innerHTML = people.map(render).join(''); box.hidden = !people.length; }
  }

  function apply(d) {
    const leaders = Array.isArray(d.leaders) ? d.leaders : [];
    const officers = Array.isArray(d.officers) ? d.officers : [];
    const trustees = Array.isArray(d.trustees) ? d.trustees : [];

    fill('leaders', leaders, leader);
    fill('officers', officers, card('ind'));
    fill('trustees', trustees, card(''));

    const officersBox = one('[data-tr-group="officers"]');
    if (officersBox) officersBox.hidden = !officers.length;
    // the "Officers" divider only makes sense under the leadership cards
    const subhead = officersBox && officersBox.querySelector('.tr-subhead');
    if (subhead) subhead.hidden = !leaders.length;

    // hide a section when nobody is in it
    const leadersSection = one('[data-tr-list="leaders"]');
    if (leadersSection) leadersSection.closest('section').hidden = !leaders.length && !officers.length;
    const trusteesSection = one('[data-tr-list="trustees"]');
    if (trusteesSection) trusteesSection.closest('section').hidden = !trustees.length;

    const total = leaders.length + officers.length + trustees.length;
    const count = one('[data-tr="count"]');
    if (count) { count.textContent = `${total} board member${total === 1 ? '' : 's'}`; count.hidden = !total; }
  }

  fetch(API, { headers: { Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then((data) => { if (data && data.success) apply(data); })
    .catch(() => {}); // keep the built-in list
})();
