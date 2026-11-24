<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'zakat',
	'title' => 'Zakat Calculator | Stepney Shah Jalal Mosque',
	'description' => 'Work out your Zakat with Stepney Shah Jalal Mosque\'s free Zakat calculator, using today\'s gold and silver Nisab, then pay your Zakat online.',
	'scripts' => [
		'assets/js/zakat.js',
	],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <!-- Printed header (only shown when printing) -->
  <div class="zk-print-head" aria-hidden="true" style="display:none">
    <div>
      <b>Zakat Calculation</b>
      <span>Stepney Shah Jalal Mosque · 534 Barking Road, London E13 8QE · hefazotheislamuk.org</span>
      <span data-zk-print="date"></span>
    </div>
    <img src="assets/images/logo-full.png" alt="Stepney Shahjalal Mosque &amp; Cultural Centre" width="312" height="99" style="width:180px;height:auto;margin-left:auto;flex:none">
  </div>
  <section class="zk-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <div class="zk-ar" lang="ar" dir="rtl">الزكاة</div>
      <h1>Zakat <em>Calculator</em></h1>
      <p>Calculate your Zakat with ease.</p>
      <div class="zk-note"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>Zakat is generally calculated at <b>2.5%</b> of eligible wealth held above the <b>Nisab</b> threshold for one full lunar year (hawl).</span></div>
    </div>
  </section>

  <section class="section wrap zk-section">
    <div class="container site-container">
      <form class="row site-row g-4 zk" id="zakatCalc" novalidate autocomplete="off" aria-label="Zakat calculator">
        <div class="col-lg-7 zk-steps">

          <!-- Step 1: Nisab -->
          <div class="zk-card">
            <div class="zk-card-head">
              <div><span class="zk-step">Step 1</span><h2>Nisab standard</h2></div>
              <button class="zk-i" type="button" data-bs-toggle="tooltip" data-bs-title="Nisab is the minimum wealth you must have before Zakat is due. It equals the value of 87.48 g of gold or 612.36 g of silver. Many scholars recommend the silver Nisab because it is lower, so more people give Zakat." aria-label="About Nisab"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></button>
            </div>
            <div class="zk-seg zk-seg-lg" role="radiogroup" aria-label="Nisab standard">
              <label><input type="radio" name="standard" value="gold"><span><b>Gold</b><small>87.48 g</small></span></label>
              <label><input type="radio" name="standard" value="silver" checked><span><b>Silver</b><small>612.36 g</small></span></label>
            </div>
            <div class="zk-nisab">
              <div class="pattern"></div>
              <span class="zk-nisab-lbl">Current Nisab threshold · <span data-zk="std-name">Silver</span></span>
              <strong data-zk="nisab">£0.00</strong>
              <small data-zk="nisab-src">Loading today's prices…</small>
            </div>
            <p class="zk-label">How should Nisab be set?</p>
            <div class="zk-seg" role="radiogroup" aria-label="How Nisab is set">
              <label><input type="radio" name="mode" value="auto" checked><span><b>Automatic</b></span></label>
              <label><input type="radio" name="mode" value="manual"><span><b>Manual</b></span></label>
            </div>
            <div class="row site-row g-3 zk-fields">
              <div class="col-sm-6 zk-field">
                <label for="zk-gold-price"><span>Gold price / g</span><button class="zk-i" type="button" data-bs-toggle="tooltip" data-bs-title="Price of 1 gram of pure (24 carat) gold in pounds." aria-label="About gold price"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></button></label>
                <div class="zk-input"><span>£</span><input id="zk-gold-price" name="gold_price" inputmode="decimal" placeholder="0.00"></div>
              </div>
              <div class="col-sm-6 zk-field">
                <label for="zk-silver-price"><span>Silver price / g</span><button class="zk-i" type="button" data-bs-toggle="tooltip" data-bs-title="Price of 1 gram of pure silver in pounds." aria-label="About silver price"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></button></label>
                <div class="zk-input"><span>£</span><input id="zk-silver-price" name="silver_price" inputmode="decimal" placeholder="0.00"></div>
              </div>
            </div>
            <p class="zk-help" data-zk="price-help"></p>
            <div class="zk-field" data-zk="nisab-field" hidden>
              <label for="zk-nisab-value"><span>Nisab value</span><button class="zk-i" type="button" data-bs-toggle="tooltip" data-bs-title="Optional. If your mosque or Zakat organisation gives you a Nisab amount, enter it here. It is used instead of the metal price." aria-label="About Nisab value"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></button></label>
              <div class="zk-input"><span>£</span><input id="zk-nisab-value" name="nisab_value" inputmode="decimal" placeholder="0.00"></div>
            </div>
          </div>

          <!-- Step 2: assets (groups built by zakat.js) -->
          <div class="zk-step-head">
            <div><span class="zk-step">Step 2</span><h2>Your assets</h2></div>
            <div class="zk-total"><small>Total</small><b data-zk="assets">£0.00</b></div>
          </div>
          <div class="zk-groups" data-zk="asset-groups"></div>

          <!-- Step 3: liabilities -->
          <div class="zk-card">
            <div class="zk-card-head">
              <div class="zk-head-ico"><span class="zk-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></span><div><span class="zk-step">Step 3</span><h2>Deductible liabilities</h2></div></div>
              <b class="zk-minus" data-zk="debts-head">− £0.00</b>
            </div>
            <p class="zk-text">Only enter <b>eligible</b> short-term debts that are genuinely due. Do not enter the full balance of long-term loans such as a mortgage or student loan.</p>
            <p class="zk-label">Calculation method</p>
            <div class="zk-seg zk-seg-lg" role="radiogroup" aria-label="Which debts to deduct">
              <label><input type="radio" name="method" value="now"><span><b>Due now</b><small>Immediate debts only</small></span></label>
              <label><input type="radio" name="method" value="year" checked><span><b>Next 12 months</b><small>Incl. short-term</small></span></label>
            </div>
            <div class="row site-row g-3 zk-fields" data-zk="debt-fields"></div>
          </div>

          <p class="zk-disclaimer"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>This calculator provides an estimate based on the information you enter. Zakat rules can vary depending on your circumstances and scholarly opinion. For specific situations, consult a qualified Islamic scholar or <a href="contact">speak to our team</a>.</span></p>
        </div>

        <!-- Summary -->
        <div class="col-lg-5">
          <aside class="zk-aside" aria-label="Calculation summary">
            <div class="zk-summary on-dark" aria-live="polite">
              <div class="pattern"></div>
              <div class="zk-sum-head"><h2>Calculation summary</h2><span class="zk-live"><i></i>Live</span></div>
              <dl class="zk-rows">
                <div><dt>Total zakatable assets</dt><dd data-zk="sum-assets">£0.00</dd></div>
                <div><dt>Deductible liabilities</dt><dd data-zk="sum-debts">− £0.00</dd></div>
                <div class="zk-net"><dt>Net zakatable wealth</dt><dd data-zk="sum-net">£0.00</dd></div>
                <div><dt>Nisab threshold (<span data-zk="sum-std">Silver</span>)</dt><dd data-zk="sum-nisab">£0.00</dd></div>
              </dl>
              <div class="zk-bar" role="progressbar" aria-label="Net wealth compared with Nisab" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i data-zk="bar"></i></div>
              <p class="zk-status" data-zk="status">Nisab not set</p>
              <div class="zk-result">
                <span>Your estimated Zakat</span>
                <strong data-zk="zakat">£0.00</strong>
                <em>Zakat rate: 2.5%</em>
              </div>
              <p class="zk-hint" data-zk="hint"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span></span></p>
            </div>
            <a class="btn site-btn site-btn-lg zk-pay" href="donations" data-zk="pay"><svg class="ico"><use href="#i-heart"/></svg><span>Pay Your Zakat</span></a>
            <div class="zk-tools">
              <button type="button" data-zk-tool="print"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z"/></svg>Print</button>
              <button type="button" data-zk-tool="share"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>Share</button>
              <button type="button" data-zk-tool="copy"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>Copy</button>
              <button type="button" data-zk-tool="reset"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/></svg>Reset</button>
            </div>
            <p class="zk-toast" data-zk="toast" role="status" hidden></p>
          </aside>
        </div>
      </form>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
