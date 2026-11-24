<?php
require __DIR__ . '/includes/init.php';

$page = [
	'path' => 'donations',
	'donations' => true,
	'title' => 'Donations | Stepney Shah Jalal Mosque',
	'description' => 'Support Stepney Shah Jalal Mosque with Sadaqah, Lillah and Zakat. Your donations keep our doors open, our classes running and our food bank stocked.',
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
  <section class="pol-hero wrap on-dark">
    <div class="pattern"></div>
    <div class="container site-container">
      <span class="kicker">Donations</span>
      <h1>Support your <em>masjid</em></h1>
      <p>Your Sadaqah, Lillah and Zakat keep our doors open, our classes running and our food bank stocked. UK taxpayers can add 25% through Gift Aid at no extra cost.</p>
    </div>
  </section>

  <section class="section wrap donation-section">
    <div class="container site-container">
      <div class="donation-root" data-allow-quick="false"></div>
    </div>
  </section>

  <!-- ============ Other ways to donate (bank transfer, telephone, post, standing order) ============ -->
  <!-- Replace the [bracketed] details with the masjid's own before going live -->
  <section class="section wrap ways-section" aria-labelledby="ways-title">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap">
        <div class="intro">
          <span class="kicker">Other ways to give</span>
          <h2 id="ways-title">Other ways to <em>donate</em></h2>
          <p class="lede">Prefer not to give online? Send a bank transfer, call us, post a cheque or set up a standing order.</p>
        </div>
      </div>
      <div class="ways">
        <article class="way way-top">
          <h3>For UK donors</h3>
          <dl class="way-dl">
            <dt>Bank</dt><dd>Barclays</dd>
            <dt>Account name</dt><dd>HEFAZOTHE ISLAM UK</dd>
            <dt>Sort code</dt><dd class="tnum">20-67-90</dd>
            <dt>Account number</dt><dd class="tnum">63044785</dd>
          </dl>
          <p class="way-small">Please use your name and the cause (for example Zakat or Sadaqah) as the payment reference.</p>
        </article>
        <article class="way way-top">
          <h3>For international donors</h3>
          <dl class="way-dl">
            <dt>IBAN</dt><dd class="tnum">GB28 BUKB 2067 9063 0447 85</dd>
            <dt>SWIFT / BIC</dt><dd class="tnum">BUKBGB22</dd>
          </dl>
          <p class="way-small">Transfers from abroad may take a few working days to arrive.</p>
        </article>
        <article class="way way-bottom">
          <h3>By telephone</h3>
          <p>To give by debit or credit card, or for more information, please call us:</p>
          <dl class="way-dl">
            <dt>UK callers</dt><dd><a href="tel:+447878561130">07878 561130</a></dd>
            <dt>International</dt><dd><a href="tel:+447878561130">+44 7878 561130</a></dd>
          </dl>
        </article>
        <article class="way way-bottom">
          <h3>By post</h3>
          <p>Make your cheque or postal order payable to “[Payee name]” and include a note with your name and address.</p>
          <address class="way-address">Stepney Shah Jalal Mosque<br>534 Barking Road<br>London, E13 8QE<br>United Kingdom</address>
        </article>
        <article class="way way-bottom">
          <h3>By standing order</h3>
          <p>Give a regular amount automatically. Set it up with your bank using the UK account details above, or ask us for a standing order form.</p>
          <a class="btn site-btn btn-glass site-btn-sm" href="contact">Request a form<svg class="ico arr"><use href="#i-arrow"/></svg></a>
        </article>
      </div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/includes/footer.php';
