<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'donations',
	'donations' => true,
	'title' => 'Donations | Stepney Shah Jalal Mosque',
	'description' => 'Donate to Stepney Shahjalal Mosque & Cultural Centre online, by bank transfer or by standing order, and help build our new Mosque.',
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Donations</span>
      <h1>Support your <em>masjid</em></h1>
      <p>Your Sadaqah, Lillah and Zakat keep our doors open, our classes running and help build our new Mosque. UK taxpayers can add 25% through Gift Aid at no extra cost.</p>
    </div>
  </section>

  <section class="section wrap donation-section">
    <div class="container site-container">
      <div class="donation-root" data-allow-quick="false"></div>
    </div>
  </section>

  <!-- ============ Other ways to donate (bank transfer, standing order, telephone), as on the previous website's Donate page ============ -->
  <section class="section wrap ways-section" aria-labelledby="ways-title">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap">
        <div class="intro">
          <span class="kicker">Other ways to give</span>
          <h2 id="ways-title">Other ways to <em>donate</em></h2>
          <p class="lede">To transfer money directly into the Mosque account, use the account details below, or give regularly by standing order.</p>
        </div>
      </div>
      <div class="ways">
        <article class="way way-top">
          <h3>Mosque bank account</h3>
          <dl class="way-dl">
            <dt>Bank name</dt><dd>Lloyds Bank</dd>
            <dt>Account name</dt><dd>Stepney Shahjalal Mosque &amp; Cultural Centre</dd>
            <dt>Sort code</dt><dd class="tnum">30-92-21</dd>
            <dt>Account number</dt><dd class="tnum">00616603</dd>
          </dl>
          <p class="way-small">Please use your name as the payment reference.</p>
        </article>
        <article class="way way-top">
          <h3>For international donors</h3>
          <dl class="way-dl">
            <dt>IBAN</dt><dd class="tnum">GB78 LOYD 3092 2100 6166 03</dd>
            <dt>BIC</dt><dd class="tnum">LOYDGB21357</dd>
          </dl>
          <p class="way-small">Transfers from abroad may take a few working days to arrive.</p>
        </article>
        <article class="way way-bottom">
          <h3>By standing order</h3>
          <p>Donate £1 a day or £5 a week as a regular standing order until the building of this Mosque is complete.</p>
          <a class="btn site-btn btn-glass site-btn-sm" href="assets/docs/standing-order-form.pdf" download="Stepney-Shahjalal-Mosque-standing-order-form.pdf">Download the form (PDF)<svg class="ico arr"><use href="#i-arrow"/></svg></a>
        </article>
        <article class="way way-bottom">
          <h3>Build Allah’s House</h3>
          <p>Make a one-off donation of £1,000 towards the building of this Mosque, which can also be given in instalments. UK taxpayers can add Gift Aid to increase their donation.</p>
        </article>
        <article class="way way-bottom">
          <h3>Any questions?</h3>
          <p>Should you need any further information, please contact us:</p>
          <dl class="way-dl">
            <dt>Phone</dt><dd><a href="tel:+447442490694">07442 490694</a><br><a href="tel:+442072658603">020 7265 8603</a></dd>
            <dt>Email</dt><dd><a href="mailto:info@stepneyshahjalalmosque.org.uk">info@<wbr>stepneyshahjalalmosque.org.uk</a></dd>
          </dl>
        </article>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
