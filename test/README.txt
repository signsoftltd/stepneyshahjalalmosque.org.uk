Hefazothe Islam UK website (PHP 8, Bootstrap 5.3)

Pages
  index.php, about.php, events.php, ...   one file per page: its settings ($page) and its main content
  Addresses have no extension: /events opens events.php (see .htaccess). Old /events.html and
  /events.php addresses redirect permanently to /events.

Shared parts (includes/, not reachable from the web)
  includes/init.php     site address (SITE_URL), helpers, and the list of $page settings
  includes/header.php   <head>, prayer bar (home page only), header and mobile menu
  includes/footer.php   footer and the scripts every page loads
  includes/services-section.php   the services section, on the home page and the Services page

Files
  .htaccess             clean addresses and redirects (Apache; the rules don't name the site's folder)
  assets/css/theme.css  brand theme, loads after Bootstrap
  assets/js/            page behaviour; config.js holds the admin panel and timetable API addresses
  assets/images/        logo, photos and icons
  Browsers load changed CSS and JS automatically: each file's address ends with its last-changed time.

Content comes from the admin panel (events, FAQs, banner, gallery, videos, notices...), prayer times from
the yearly timetable API and Hijri dates from the Hijri calendar API (addresses in assets/js/config.js).
