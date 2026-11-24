/* Stepney Shah Jalal Mosque app: settings. Change addresses here only. */
window.HIUK_CONFIG = {
  name: 'Stepney Shah Jalal Mosque',
  // yearly prayer timetable: { times: [ one entry per day, 1 January first ], version }
  timetableUrl: 'https://apps.signsoft.co.uk/api/clients/stepneyshahjalalmosque/yearly-timetable.php',
  // Hijri calendar: ?year=2026 -> { "DD-MM-YYYY": "DD-MM-YYYY" (Hijri) }
  hijriUrl: 'https://apps.signsoft.co.uk/api/hijri-calendar.php',
  // Makrooh times (minutes): sunrise = after sunrise begins; zuhr, sunset = before Dhuhr and Maghrib begin
  makroohUrl: 'https://apps.signsoft.co.uk/api/clients/stepneyshahjalalmosque/makrooh-times.php',
  // App update check, once per launch: ?platform=android|ios&current=<app version> ->
  // { has_update, new_version, ... }. (The address given was for masjidenimra; this app's client is hefazotheislamuk.)
  updateCheckUrl: 'https://apps.signsoft.co.uk/api/clients/stepneyshahjalalmosque/update-check.php',
  // Live stream: { video_id } (a YouTube video, '' when there is none), played through the player page below
  // (YouTube only plays inside pages served over https, which the app's local files are not)
  liveVideoUrl: 'https://apps.signsoft.co.uk/api/clients/stepneyshahjalalmosque/live-video.php',
  livePlayerUrl: 'https://apps.signsoft.co.uk/web-apps/youtube/iframe.php',
  // Ramadhan timetable: { title, eid, saf (Sadaqah al-Fitr), times: [{ sl, date: "DD-MM-YY", day, sehri, iftar }] }
  ramadanUrl: 'https://apps.signsoft.co.uk/api/clients/stepneyshahjalalmosque/ramadan-timetable.php',
  // admin panel public API (events, notices, ...) for later pages
  apiUrl: 'https://manage.stepneyshahjalalmosque.org.uk/api/public',
  website: 'https://hefazotheislamuk.org',
  // the website's donations page, shown in the Donate tab without the website's header and footer (?app=1).
  donateUrl: 'https://hefazotheislamuk.org/donations',
  // "Share this app": change shareUrl to the app's store page (or a page linking to both stores) once published
  // Donate (side menu): the masjid's bank account (empty = shows "coming soon" until filled in; IBAN and SWIFT are optional)
  bank: { name: 'Barclays', accountName: 'HEFAZOTHE ISLAM UK', sortCode: '20-67-90', accountNumber: '63044785', iban: 'GB28 BUKB 2067 9063 0447 85', swift: 'BUKBGB22' },
  shareUrl: 'https://hefazotheislamuk.org',
  shareText: 'Prayer times, Jumu\'ah and more from Stepney Shah Jalal Mosque',
  phone: '+447878561130',
  // side menu: social links (empty = shows "coming soon" until filled in)
  facebookUrl: '',
  youtubeUrl: '',
  // website pages shown inside the app (web.html#zakat), without the website's header and footer.
  webBase: 'https://hefazotheislamuk.org/',
  webPages: {
    zakat: { title: 'Zakat calculator', sub: 'Work out the Zakat you owe', path: 'zakat' },
    events: { title: 'News & events', sub: 'What\'s on at the masjid', path: 'events' },
    services: { title: 'Services', sub: 'How we can help', path: 'services' },
    about: { title: 'About us', sub: 'Stepney Shah Jalal Mosque', path: 'about' },
    contact: { title: 'Contact us', sub: 'Get in touch with us', path: 'contact' }
  },
  // shown at the bottom of the side menu until the app passes its own: index.html?v=1.0
  appVersion: '1.0.0',
  developer: { name: 'Sign Soft Ltd', url: 'https://signsoft.co.uk' },
  // Qibla: used until the user shares their location (534 Barking Road, London E13 8QE; approximate)
  masjidLocation: { lat: 51.5299, lon: 0.0258, name: 'Stepney Shah Jalal Mosque, London' },
  // how long saved data is used before it is fetched again (milliseconds)
  timetableMaxAge: 6 * 3600 * 1000,
  hijriMaxAge: 24 * 3600 * 1000,
  ramadanMaxAge: 6 * 3600 * 1000,
  makroohMaxAge: 24 * 3600 * 1000
};
