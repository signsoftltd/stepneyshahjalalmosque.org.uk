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
  // { has_update, new_version, ... }
  updateCheckUrl: 'https://apps.signsoft.co.uk/api/clients/stepneyshahjalalmosque/update-check.php',
  // Live stream: { video_id } (a YouTube video, '' when there is none), played through the player page below
  // (YouTube only plays inside pages served over https, which the app's local files are not)
  liveVideoUrl: 'https://apps.signsoft.co.uk/api/clients/stepneyshahjalalmosque/live-video.php',
  livePlayerUrl: 'https://apps.signsoft.co.uk/web-apps/youtube/iframe.php',
  // Ramadhan timetable: { title, eid, saf (Sadaqah al-Fitr), times: [{ sl, date: "DD-MM-YY", day, sehri, iftar }] }
  ramadanUrl: 'https://apps.signsoft.co.uk/api/clients/stepneyshahjalalmosque/ramadan-timetable.php',
  // admin panel public API (events, notices, ...) for later pages
  apiUrl: 'https://manage.stepneyshahjalalmosque.org.uk/api/public',
  // The new website is at /test/ for now (stepneyshahjalalmosque.org.uk itself is still the previous website).
  // When it moves to the main address, change '/test/' to '/' in website, donateUrl, shareUrl and webBase.
  website: 'https://stepneyshahjalalmosque.org.uk/test/',
  // the website's donations page, shown in the Donate tab without the website's header and footer (?app=1).
  donateUrl: 'https://stepneyshahjalalmosque.org.uk/test/donations',
  // "Share this app": change shareUrl to the app's store page (or a page linking to both stores) once published
  // Donate (side menu): the masjid's bank account (empty = shows "coming soon" until filled in; IBAN and SWIFT are optional)
  bank: { name: 'Lloyds Bank', accountName: 'Stepney Shahjalal Mosque & Cultural Centre', sortCode: '30-92-21', accountNumber: '00616603', iban: 'GB78 LOYD 3092 2100 6166 03', swift: 'LOYDGB21357' },
  shareUrl: 'https://stepneyshahjalalmosque.org.uk/test/',
  shareText: 'Prayer times, Jumu\'ah and more from Stepney Shah Jalal Mosque',
  phone: '+442072658603',
  // side menu: social links (empty = shows "coming soon" until filled in)
  facebookUrl: 'https://www.facebook.com/stepneyshahjalalmosque',
  youtubeUrl: 'https://www.youtube.com/@stepneyshahjalalmosquecult5709',
  // website pages shown inside the app (web.html#zakat), without the website's header and footer.
  webBase: 'https://stepneyshahjalalmosque.org.uk/test/',
  webPages: {
    zakat: { title: 'Zakat calculator', sub: 'Work out the Zakat you owe', path: 'zakat' },
    events: { title: 'News', sub: 'What\'s on at the masjid', path: 'events' },
    services: { title: 'What we do', sub: 'Prayer, learning and care', path: 'services' },
    trustees: { title: 'Trustees', sub: 'Our Board of Trustees', path: 'trustees' },
    donorwall: { title: 'Donor Wall', sub: 'In recognition of our donors', path: 'donor-wall' },
    about: { title: 'About us', sub: 'Stepney Shah Jalal Mosque', path: 'about' },
    contact: { title: 'Contact us', sub: 'Get in touch with us', path: 'contact' }
  },
  // shown at the bottom of the side menu until the app passes its own: index.html?v=1.0
  appVersion: '1.0.0',
  developer: { name: 'Sign Soft Ltd', url: 'https://signsoft.co.uk' },
  // Qibla: used until the user shares their location (81-83 Duckett Street, London E1 4TD; from the website's map)
  masjidLocation: { lat: 51.5200, lon: -0.0434, name: 'Stepney Shah Jalal Mosque, London' },
  // how long saved data is used before it is fetched again (milliseconds)
  timetableMaxAge: 6 * 3600 * 1000,
  hijriMaxAge: 24 * 3600 * 1000,
  ramadanMaxAge: 6 * 3600 * 1000,
  makroohMaxAge: 24 * 3600 * 1000
};
