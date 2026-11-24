<?php
/* The "How we can help" services section, on the home page and the Services page. Services are managed in the
   admin panel (Home page > Services): assets/js/services.js fills them in; this is the built-in default.
   Set $svc_class first for extra classes on the section (e.g. 'band'). */
defined('HIUK') or exit;
?>
  <section class="section wrap <?= e($svc_class ?? '') ?>" id="services" aria-labelledby="svc-title">
    <div class="container site-container">
      <div class="sec-head d-flex flex-wrap align-items-end justify-content-between">
        <div class="intro">
          <span class="kicker" data-svc="kicker">How we can help</span>
          <h2 id="svc-title" data-svc="heading">Services for <em>every stage</em> of life</h2>
        </div>
        <p class="lede" style="max-width:42ch" data-svc="lede">From a first Quran lesson to a Nikah, and from a food parcel to a Janazah, our team is here with care and confidentiality.</p>
      </div>
      <div class="row site-row g-4">
        <div class="col-lg-4"><div class="svc card h-100" data-svc-col="1">
          <div class="svc-head"><span class="num" lang="ar">الحياة</span><h3>Life milestones</h3><p>Guidance and ceremonies for life's most important moments.</p></div>
          <ul class="list-unstyled">
            <li><a href="contact"><span class="gem sm"><svg class="ico"><use href="#i-rings"/></svg></span><span><b>Nikah Services</b><span>Ceremonies officiated by our Imam</span></span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>
            <li><a href="contact"><span class="gem sm"><svg class="ico"><use href="#i-heart"/></svg></span><span><b>Marriage Services</b><span>Pre-marriage courses and guidance</span></span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>
            <li><a href="contact"><span class="gem sm"><svg class="ico"><use href="#i-leaf"/></svg></span><span><b>Funeral &amp; Janazah</b><span>Ghusl, Janazah prayer and burial support</span></span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>
          </ul>
        </div></div>
        <div class="col-lg-4"><div class="svc ind card h-100" data-svc-col="2">
          <div class="svc-head"><span class="num" lang="ar">الرعاية</span><h3>Care &amp; welfare</h3><p>Practical and pastoral support for anyone who needs it.</p></div>
          <ul class="list-unstyled">
            <li><a href="contact"><span class="gem sm"><svg class="ico"><use href="#i-chat"/></svg></span><span><b>Counselling</b><span>Confidential, faith-sensitive support</span></span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>
            <li><a href="<?= home_url('#donate') ?>" data-give="Zakat"><span class="gem sm gold"><svg class="ico"><use href="#i-coins"/></svg></span><span><b>Zakat Assistance</b><span>Help calculating, paying and applying</span></span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>
            <li><a href="contact"><span class="gem sm"><svg class="ico"><use href="#i-basket"/></svg></span><span><b>Food Bank</b><span>Weekly parcels, no questions asked</span></span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>
            <li><a href="contact"><span class="gem sm"><svg class="ico"><use href="#i-family"/></svg></span><span><b>Family Support</b><span>Parenting, elders and welfare advice</span></span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>
          </ul>
        </div></div>
        <div class="col-lg-4"><div class="svc grn card h-100" data-svc-col="3">
          <div class="svc-head"><span class="num" lang="ar">العلم</span><h3>Learning</h3><p>Structured teaching for children, youth and adults.</p></div>
          <ul class="list-unstyled">
            <li><a href="contact"><span class="gem sm"><svg class="ico"><use href="#i-cap"/></svg></span><span><b>Islamic Classes</b><span>Fiqh, Seerah and Arabic for adults</span></span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>
            <li><a href="contact"><span class="gem sm"><svg class="ico"><use href="#i-pencil"/></svg></span><span><b>Children's Madrasa</b><span>Weekday evenings, ages 5–14</span></span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>
            <li><a href="contact"><span class="gem sm"><svg class="ico"><use href="#i-quran"/></svg></span><span><b>Quran Classes</b><span>Tajweed and Hifz programmes</span></span><svg class="ico chev"><use href="#i-chev"/></svg></a></li>
          </ul>
        </div></div>
      </div>
      <div class="svc-help" data-svc="help">
        <p data-svc="help-text">Not sure where to start? Our office team will point you to the right person.</p>
        <a class="btn site-btn btn-em" href="contact" data-svc="help-btn"><span>Speak to our team</span><svg class="ico arr"><use href="#i-arrow"/></svg></a>
      </div>
    </div>
  </section>
