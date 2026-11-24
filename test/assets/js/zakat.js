/* Hefazothe Islam UK: Zakat calculator (zakat.php) and the home page Zakat section.
   Gold and silver prices per gram come from the admin panel (Zakat); visitors can also enter
   their own (Manual). Nothing typed here is sent anywhere or stored. */
(function () {
  'use strict';
  const API = (window.HIUK_API || 'https://admin.hefazotheislamuk.org/api/public') + '/zakat';
  const GRAMS = { gold: 87.48, silver: 612.36 };
  const RATE = 0.025;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const gbp = (n) => '£' + (Math.round(n * 100) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
  const INFO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';

  let prices = null; // response from the API, or null if unavailable
  let loaded = false; // true once the request has finished (successfully or not)
  const pricesReady = fetch(API, { headers: { Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then((data) => {
      if (data && data.success) {
        prices = data;
        if (data.nisab_grams) { GRAMS.gold = data.nisab_grams.gold; GRAMS.silver = data.nisab_grams.silver; }
      }
    })
    .catch(() => {})
    .then(() => { loaded = true; });

  /* ================= Home page section ================= */
  const home = document.getElementById('zakatHome');
  if (home) {
    pricesReady.then(() => {
      const set = (k, v) => home.querySelectorAll(`[data-zkh="${k}"]`).forEach((el) => { el.textContent = v; });
      ['gold', 'silver'].forEach((m) => {
        const price = prices && prices[m + '_price'];
        set(m + '-nisab', price ? gbp(price * GRAMS[m]) : '—');
        set(m + '-detail', price ? `${GRAMS[m]} g × ${gbp(price)}/g` : `${GRAMS[m]} g`);
      });
      set('updated', prices && prices.updated_at ? 'Prices updated ' + fmtDate(prices.updated_at) : 'Today\'s prices will appear here soon');
    });
  }

  /* ================= Calculator ================= */
  const form = document.getElementById('zakatCalc');
  if (!form) return;

  const ICONS = {
    cash: '<path d="M3 7h18v10H3z"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/>',
    gold: '<path d="M4 18h16M6 18l2-6h8l2 6M9 12l1.5-5h3L15 12"/>',
    invest: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    business: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    other: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'
  };
  // Step 2 asset groups. Field names must be unique.
  const GROUPS = [
    { key: 'cash', title: 'Cash & Bank', sub: 'Money you can access today', open: true, fields: [
      ['cash_hand', 'Cash in hand', 'Cash you hold at home or with you, in any currency (converted to pounds).'],
      ['bank_savings', 'Bank savings', 'Balances in savings accounts and ISAs. Only include interest you will not keep: interest should be given away, not counted.'],
      ['current_accounts', 'Current accounts', 'Balances in your current accounts on the day you calculate.'],
      ['digital_wallets', 'Digital wallets', 'PayPal, Revolut, prepaid cards and similar balances.']
    ] },
    { key: 'gold', title: 'Gold & Silver', sub: 'Metals valued at today\'s price', open: true, fields: [
      ['gold_value', 'Gold value', 'Value of gold bars, coins and other gold you own as savings.'],
      ['silver_value', 'Silver value', 'Value of silver bars, coins and other silver you own as savings.'],
      ['gold_jewellery', 'Gold jewellery', 'Opinions differ on jewellery worn regularly. If unsure, include it, or ask a scholar.'],
      ['silver_jewellery', 'Silver jewellery', 'Opinions differ on jewellery worn regularly. If unsure, include it, or ask a scholar.']
    ] },
    { key: 'invest', title: 'Investments', sub: 'Shares, funds and other holdings', open: true, fields: [
      ['shares', 'Shares', 'Current market value of shares held for trading or resale.'],
      ['stocks', 'Stocks', 'Other stock holdings at today\'s value.'],
      ['funds', 'Investment funds', 'Unit trusts, ETFs and similar funds at today\'s value.'],
      ['other_investments', 'Other investments', 'Crypto-assets, P2P lending and any other investments held for gain.']
    ] },
    { key: 'business', title: 'Business Assets', sub: 'If you own or share in a business', open: false, fields: [
      ['business_cash', 'Business cash', 'Your share of cash in the business bank account and till.'],
      ['business_stock', 'Stock for sale', 'Your share of goods held for sale, valued at today\'s selling price.'],
      ['business_receivables', 'Money owed to the business', 'Customer invoices you expect to be paid.'],
      ['business_other', 'Other business assets', 'Other zakatable business assets. Not equipment, premises or vehicles used to run the business.']
    ] },
    { key: 'other', title: 'Other Assets', sub: 'Loans given and anything else', open: false, fields: [
      ['loans_given', 'Money lent to others', 'Loans you expect to be repaid.'],
      ['pension', 'Accessible pension', 'The zakatable part of a pension you can access now, if applicable. Ask a scholar if unsure.'],
      ['property_sale', 'Property for resale', 'Property bought to sell on, at today\'s value. Not your home or rental property itself.'],
      ['other_assets', 'Anything else', 'Any other zakatable wealth, e.g. rental income you still hold.']
    ] }
  ];
  // Step 3. "now" debts count in both methods; the rest only with "Next 12 months".
  const DEBTS = [
    ['debt_immediate', 'Immediate debts', 'Debts you must pay now, such as money borrowed from family that is due.', 'now'],
    ['debt_bills', 'Due bills', 'Bills that are due and unpaid: rent, utilities, council tax, tax owed.', 'now'],
    ['debt_short', 'Short-term liabilities', 'The next 12 months of repayments on loans, credit cards or finance agreements, not the full balance.', 'year'],
    ['debt_other', 'Other deductible amounts', 'Other genuine short-term debts, e.g. business bills or wages due.', 'year']
  ];

  const field = (name, label, tip, extra) => `
    <div class="col-sm-6 zk-field"${extra || ''}>
      <label for="zk-${name}"><span>${esc(label)}</span><button class="zk-i" type="button" data-bs-toggle="tooltip" data-bs-title="${esc(tip)}" aria-label="${esc('About ' + label)}">${INFO}</button></label>
      <div class="zk-input"><span>£</span><input id="zk-${name}" name="${name}" inputmode="decimal" placeholder="0.00"></div>
    </div>`;

  form.querySelector('[data-zk="asset-groups"]').innerHTML = GROUPS.map((g) => `
    <details class="zk-group" data-group="${g.key}"${g.open ? ' open' : ''}>
      <summary>
        <span class="zk-ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[g.key]}</svg></span>
        <span class="zk-g-txt"><b>${esc(g.title)}</b><small>${esc(g.sub)}</small></span>
        <span class="zk-g-total" data-zk="group-${g.key}">£0.00</span>
        <svg class="zk-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </summary>
      <div class="row site-row g-3 zk-fields">${g.fields.map((f) => field(f[0], f[1], f[2])).join('')}</div>
    </details>`).join('');
  form.querySelector('[data-zk="debt-fields"]').innerHTML = DEBTS.map((d) => field(d[0], d[1], d[2], ` data-when="${d[3]}"`)).join('');

  if (window.bootstrap) form.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el, { trigger: 'hover focus' }));

  const $ = (sel) => form.querySelector(sel);
  const out = (key) => form.querySelectorAll(`[data-zk="${key}"]`);
  const setText = (key, v) => out(key).forEach((el) => { el.textContent = v; });
  const radio = (name) => (form.querySelector(`input[name="${name}"]:checked`) || {}).value;
  const num = (name) => {
    const el = form.elements[name];
    if (!el) return 0;
    const v = parseFloat(String(el.value).replace(/[£,\s]/g, ''));
    const ok = el.value.trim() === '' || (isFinite(v) && v >= 0);
    el.classList.toggle('zk-invalid', !ok);
    return ok && isFinite(v) ? v : 0;
  };
  const priceInputs = { gold: form.elements.gold_price, silver: form.elements.silver_price };
  let last = null; // latest result, used by Copy / Share

  function adminPrice(metal) { return prices && prices[metal + '_price'] ? Number(prices[metal + '_price']) : null; }
  const haveAdminPrices = () => adminPrice('gold') !== null || adminPrice('silver') !== null;

  function applyMode() {
    const auto = radio('mode') === 'auto';
    ['gold', 'silver'].forEach((m) => {
      const input = priceInputs[m];
      input.readOnly = auto;
      input.closest('.zk-field').classList.toggle('is-readonly', auto);
      if (auto) input.value = adminPrice(m) !== null ? adminPrice(m).toFixed(2) : '';
    });
    $('[data-zk="nisab-field"]').hidden = auto;
    const help = $('[data-zk="price-help"]');
    if (auto) help.textContent = prices && prices.updated_at ? `Today's prices set by Hefazothe Islam UK, updated ${fmtDate(prices.updated_at)}. Choose Manual to use your own.` : '';
    else help.textContent = 'Price per gram. Enter today\'s price from your dealer or Zakat organisation, or enter a Nisab value below.';
  }

  function calculate() {
    const std = radio('standard');
    const auto = radio('mode') === 'auto';
    const stdName = std === 'gold' ? 'Gold' : 'Silver';

    // Nisab
    let nisab = null, src = '';
    const manualNisab = num('nisab_value');
    const price = auto ? adminPrice(std) : num(std + '_price');
    if (!auto) num(std === 'gold' ? 'silver_price' : 'gold_price'); // validate the other field too
    if (!auto && manualNisab > 0) { nisab = manualNisab; src = 'Set manually'; }
    else if (price > 0) { nisab = price * GRAMS[std]; src = auto ? `${GRAMS[std]} g at today's price` : `${GRAMS[std]} g × ${gbp(price)}/g`; }
    else if (auto && !loaded) src = 'Loading today\'s prices…';
    else src = auto ? 'Today\'s price isn\'t available. Choose Manual to enter one.' : 'Enter a price or Nisab value';

    // Assets
    let assets = 0;
    GROUPS.forEach((g) => {
      const t = g.fields.reduce((s, f) => s + num(f[0]), 0);
      setText('group-' + g.key, gbp(t));
      assets += t;
    });

    // Liabilities
    const method = radio('method');
    let debts = 0;
    DEBTS.forEach((d) => {
      const wrap = $(`#zk-${d[0]}`).closest('.zk-field');
      const counts = d[3] === 'now' || method === 'year';
      wrap.hidden = !counts;
      if (counts) debts += num(d[0]);
    });

    const net = Math.max(0, assets - debts);
    const due = nisab !== null && net > 0 && net >= nisab;
    const zakat = due ? net * RATE : 0;

    setText('std-name', stdName);
    setText('sum-std', stdName);
    setText('nisab', nisab !== null ? gbp(nisab) : '£0.00');
    setText('nisab-src', src);
    setText('assets', gbp(assets));
    setText('debts-head', '− ' + gbp(debts));
    setText('sum-assets', gbp(assets));
    setText('sum-debts', '− ' + gbp(debts));
    setText('sum-net', gbp(net));
    setText('sum-nisab', nisab !== null ? gbp(nisab) : 'Not set');
    setText('zakat', gbp(zakat));
    document.querySelectorAll('.zk-mbar-amt b').forEach((el) => { el.textContent = gbp(zakat); });

    const pct = nisab ? Math.min(100, (net / nisab) * 100) : 0;
    const bar = $('[data-zk="bar"]');
    bar.style.width = pct + '%';
    bar.parentElement.setAttribute('aria-valuenow', String(Math.round(pct)));
    bar.parentElement.classList.toggle('is-due', due);

    let status, hint;
    if (nisab === null) { status = 'Nisab not set'; hint = 'Enter a metal price or Nisab value to complete the calculation.'; }
    else if (assets === 0) { status = `${Math.round(pct)}% of Nisab`; hint = 'Enter your assets in Step 2 to see your Zakat.'; }
    else if (due) { status = 'Above Nisab: Zakat is due'; hint = 'If you have held this wealth for a full lunar year, this is the Zakat you owe.'; }
    else { status = `Below Nisab (${Math.round(pct)}%)`; hint = `Your net wealth is ${gbp(nisab - net)} below the Nisab, so no Zakat is due. You may still give Sadaqah.`; }
    setText('status', status);
    $('[data-zk="hint"] span').textContent = hint;
    $('[data-zk="hint"]').classList.toggle('is-due', due);

    const pay = $('[data-zk="pay"]');
    pay.querySelector('span').textContent = due ? `Pay ${gbp(zakat)} Zakat` : 'Pay Your Zakat';

    last = { std: stdName, nisab, assets, debts, net, zakat, due };
  }

  function summaryText() {
    if (!last) return '';
    return [
      'Zakat calculation (Hefazothe Islam UK)',
      `Total zakatable assets: ${gbp(last.assets)}`,
      `Deductible liabilities: ${gbp(last.debts)}`,
      `Net zakatable wealth: ${gbp(last.net)}`,
      `Nisab (${last.std}): ${last.nisab !== null ? gbp(last.nisab) : 'not set'}`,
      `Estimated Zakat (2.5%): ${gbp(last.zakat)}`,
      'This is an estimate. Please consult a scholar for your situation.'
    ].join('\n');
  }

  /* Share panel for browsers without a built-in share menu (e.g. Firefox on desktop) */
  let shareDlg = null;
  function openSharePanel(data) {
    const text = data.text + '\n' + data.url;
    const enc = encodeURIComponent;
    const targets = [
      ['WhatsApp', `https://wa.me/?text=${enc(text)}`, '<path d="M21 12a9 9 0 0 1-13.2 8L3 21l1-4.6A9 9 0 1 1 21 12z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>'],
      ['Email', `mailto:?subject=${enc(data.title)}&body=${enc(text)}`, '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'],
      ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${enc(data.url)}`, '<path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/>'],
      ['X', `https://twitter.com/intent/tweet?text=${enc('Work out your Zakat with the Hefazothe Islam UK calculator')}&url=${enc(data.url)}`, '<path d="M4 4l16 16M20 4 4 20"/>'],
      ['Telegram', `https://t.me/share/url?url=${enc(data.url)}&text=${enc(data.text)}`, '<path d="m21 4-18 7 6 2 2 6 3-4 5 4z"/><path d="m9 13 12-9"/>']
    ];
    if (!shareDlg) {
      shareDlg = document.createElement('div');
      shareDlg.className = 'modal fade ck-modal zk-share';
      shareDlg.tabIndex = -1;
      shareDlg.setAttribute('aria-labelledby', 'zkShareTitle');
      shareDlg.innerHTML = `<div class="modal-dialog modal-dialog-centered"><div class="modal-content ck-dialog">
        <div class="ck-head"><h2 id="zkShareTitle">Share</h2><button class="ck-x" type="button" data-bs-dismiss="modal" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
        <p class="ck-intro">Share the calculator and your totals. Individual amounts you entered are not included.</p>
        <div class="zk-share-grid"></div>
        <div class="ck-foot"><button class="btn site-btn btn-ind zk-share-copy" type="button">Copy summary &amp; link</button></div>
      </div></div>`;
      document.body.appendChild(shareDlg);
      shareDlg.addEventListener('click', (e) => { if (e.target.closest('.zk-share-grid a')) bootstrap.Modal.getOrCreateInstance(shareDlg).hide(); });
    }
    shareDlg.querySelector('.zk-share-grid').innerHTML = targets.map(([name, href, icon]) =>
      `<a href="${esc(href)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${name}</span></a>`).join('');
    shareDlg.querySelector('.zk-share-copy').onclick = () => {
      copy(text).then(() => { bootstrap.Modal.getOrCreateInstance(shareDlg).hide(); toast('Summary and link copied'); }, () => toast('Could not copy. Please copy the page address yourself.'));
    };
    bootstrap.Modal.getOrCreateInstance(shareDlg).show();
  }

  let toastTimer = null;
  function toast(msg) {
    const t = form.querySelector('[data-zk="toast"]');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  }
  function copyOld(text) {
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); } finally { ta.remove(); }
    });
  }
  // the clipboard is refused to a page in another site's frame (inside the mobile app): then the older way
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(() => copyOld(text));
    return copyOld(text);
  }

  /* The mobile app's webview can't print: the app prints this page's HTML, with what was entered, if it provides
     printHtml (Android interface) or the iOS script message handler. Otherwise there is no Print button in the app. */
  const iosApp = () => window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.actionMessageHandler;
  const androidPrint = () => window.Android && typeof window.Android.printHtml === 'function';
  const canPrintHtml = () => androidPrint() || !!iosApp();
  if (document.documentElement.classList.contains('in-app') && !canPrintHtml()) form.querySelector('[data-zk-tool="print"]').hidden = true;
  function printHtml() {
    form.querySelectorAll('input').forEach((i) => {
      if (i.type === 'radio' || i.type === 'checkbox') i.toggleAttribute('checked', i.checked);
      else i.setAttribute('value', i.value);
    });
    const page = document.documentElement.cloneNode(true);
    page.querySelectorAll('script').forEach((s) => s.remove());
    page.setAttribute('data-theme', 'light');
    const base = document.createElement('base');
    base.href = document.baseURI;
    page.querySelector('head').prepend(base);
    const html = '<!doctype html>' + page.outerHTML;
    if (androidPrint()) window.Android.printHtml('Zakat Calculator', html);
    else iosApp().postMessage({ action: 'printHtml', title: 'Zakat Calculator', html: html });
  }

  form.addEventListener('click', (e) => {
    const b = e.target.closest('[data-zk-tool]');
    if (!b) return;
    const tool = b.dataset.zkTool;
    if (tool === 'print') {
      // closed sections wouldn't print their fields
      form.querySelectorAll('details.zk-group').forEach((d) => { d.open = true; });
      if (canPrintHtml()) printHtml();
      else window.print();
    }
    else if (tool === 'copy') copy(summaryText()).then(() => toast('Summary copied'), () => toast('Could not copy. Please select and copy it yourself.'));
    else if (tool === 'share') {
      // only the page link and totals are shared, never the individual amounts
      const data = { title: 'Zakat Calculator | Hefazothe Islam UK', text: summaryText(), url: location.origin + location.pathname };
      // the mobile app's own share sheet, where the app provides it (Android interface, iOS script message handler)
      const ios = iosApp();
      if (window.Android && typeof window.Android.shareText === 'function') {
        window.Android.shareText(data.title, data.text + '\n' + data.url);
        return;
      }
      if (ios) {
        ios.postMessage({ action: 'shareText', title: data.title, text: data.text + '\n' + data.url });
        return;
      }
      // the device's own share menu (phones, Windows, macOS Safari/Chrome); otherwise our share panel
      if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
        navigator.share(data).catch((err) => { if (!err || err.name !== 'AbortError') openSharePanel(data); });
      } else {
        openSharePanel(data);
      }
    } else if (tool === 'reset') {
      form.querySelectorAll('.zk-input input').forEach((i) => { if (!i.readOnly) i.value = ''; i.classList.remove('zk-invalid'); });
      calculate();
      toast('Calculator cleared');
    }
  });
  /* ---------- Phones and tablets: sticky "Estimated Zakat" bar ----------
     Below 992px the summary sits under the whole form, so a small bar shows the running total
     while the form is on screen, with a button to jump to the summary. It hides once the
     summary itself is visible, and sits above the donation app's bar if that is shown. */
  const summaryBox = form.querySelector('.zk-aside');
  if (summaryBox) {
    summaryBox.id = summaryBox.id || 'zkSummary';
    const mbar = document.createElement('div');
    mbar.className = 'zk-mbar';
    mbar.hidden = true;
    mbar.innerHTML = `<div class="zk-mbar-in">
        <span class="zk-mbar-amt"><small>Estimated Zakat</small><b>${gbp(last ? last.zakat : 0)}</b></span>
        <a class="zk-mbar-btn" href="#${summaryBox.id}">Summary<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg></a>
      </div>`;
    document.body.appendChild(mbar);
    mbar.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      summaryBox.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });

    const narrow = window.matchMedia('(max-width: 991.98px)');
    const steps = form.querySelector('.zk-steps');
    let stepsOn = false, summaryOn = false;
    const update = () => { mbar.hidden = !(narrow.matches && stepsOn && !summaryOn); place(); };
    if ('IntersectionObserver' in window && steps) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.target === summaryBox) summaryOn = en.isIntersecting && en.intersectionRatio > 0.15;
          else stepsOn = en.isIntersecting;
        });
        update();
      }, { threshold: [0, 0.15, 0.3] }).observe(summaryBox);
      new IntersectionObserver((entries) => { stepsOn = entries[0].isIntersecting; update(); }).observe(steps);
    }
    if (narrow.addEventListener) narrow.addEventListener('change', update);

    // sit above any other bar at the bottom (the donation app's), measured by ui.js
    let lastLift = -1;
    function place() {
      if (mbar.hidden || !window.HIUK_bottomBars) return;
      const lift = window.HIUK_bottomBars(mbar);
      if (lift === lastLift) return;
      lastLift = lift;
      mbar.style.bottom = lift ? lift + 'px' : '';
    }
    let ticking = false;
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; place(); }); } }, { passive: true });
    window.addEventListener('resize', () => { lastLift = -1; place(); });
    [800, 2000, 4500].forEach((ms) => setTimeout(() => { lastLift = -1; place(); }, ms));
  }

  // printing (Print button or Ctrl+P): date the printed header and open every section
  window.addEventListener('beforeprint', () => {
    form.querySelectorAll('details.zk-group').forEach((d) => { d.open = true; });
    document.querySelectorAll('[data-zk-print="date"]').forEach((el) => {
      el.textContent = 'Calculated on ' + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    });
  });

  form.addEventListener('input', calculate);
  form.addEventListener('change', (e) => { if (e.target.name === 'mode') applyMode(); calculate(); });
  form.addEventListener('submit', (e) => e.preventDefault());

  calculate();
  pricesReady.then(() => {
    if (prices && isFinite(GRAMS.gold)) {
      form.querySelectorAll('.zk-seg input[name="standard"]').forEach((r) => { r.nextElementSibling.querySelector('small').textContent = GRAMS[r.value] + ' g'; });
    }
    if (prices && prices.default_standard) {
      const r = form.querySelector(`input[name="standard"][value="${prices.default_standard}"]`);
      if (r) r.checked = true;
    }
    if (!haveAdminPrices()) {
      // no prices from the admin panel: automatic mode can't work
      const autoRadio = form.querySelector('input[name="mode"][value="auto"]');
      autoRadio.disabled = true;
      form.querySelector('input[name="mode"][value="manual"]').checked = true;
    }
    applyMode();
    calculate();
  });
})();
