/* Hefazothe Islam UK app: Donate (side menu). The bank account from config.js (bank), each with a copy button, as
   text in the app can't be selected. Until the details are filled in, a message says they are coming soon. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const { esc } = HIUK.util;
    const $ = (id) => document.getElementById(id);
    const bank = (window.HIUK_CONFIG || {}).bank || {};
    const given = (rows) => rows.filter(([, k]) => bank[k]);
    const ROWS = given([['Bank', 'name'], ['Account name', 'accountName'], ['Sort code', 'sortCode'], ['Account number', 'accountNumber']]);
    const INTL = given([['IBAN', 'iban'], ['SWIFT / BIC', 'swift']]);
    const rows = (list) => list.map(([label, k]) => `<div class="g-row">
        <div><dt>${esc(label)}</dt><dd class="tnum">${esc(bank[k])}</dd></div>
        <button class="round-btn" type="button" data-copy="${esc(k)}" aria-label="Copy ${esc(label)}">${HIUK.icon('copy')}</button>
      </div>`).join('');

    // only the phone's own wallet: no Apple Pay on Android, no Google Pay on iPhone and iPad (both elsewhere)
    const android = !!window.Android || /Android/i.test(navigator.userAgent);
    const ios = !android && (!!(window.webkit && window.webkit.messageHandlers) || /iPhone|iPad|iPod/i.test(navigator.userAgent));
    const hide = android ? 'apple' : ios ? 'google' : '';
    if (hide) {
      document.querySelector(`.g-pay [data-pay="${hide}"]`).hidden = true;
      $('gWays').textContent = 'debit card, credit card, or ' + (android ? 'Google Pay' : 'Apple Pay');
    }

    // a bank's name alone isn't enough to pay into: only shown with the account's own details
    if (!bank.accountNumber && !bank.iban) {
      $('gBank').hidden = true;
      $('gBankNote').textContent = 'Our bank account details are coming soon. In the meantime, please use the Donate Online button below.';
      return;
    }
    $('gBank').innerHTML = rows(ROWS);
    $('gIntl').innerHTML = rows(INTL);
    $('gIntlT').hidden = $('gIntl').hidden = !INTL.length;
    $('gBankNote').textContent = 'Please use your name and the cause (for example Zakat or Sadaqah) as the payment reference.';
    $('gAccount').addEventListener('click', (e) => {
      const b = e.target.closest('[data-copy]');
      if (!b) return;
      const label = ROWS.concat(INTL).find(([, k]) => k === b.dataset.copy)[0];
      HIUK.copy(bank[b.dataset.copy]).then((ok) => HIUK.toast(ok ? `${label} copied` : bank[b.dataset.copy]));
    });
  });
})();
