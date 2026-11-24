# Stepney Shah Jalal Mosque app

A small web app (HTML, CSS, JavaScript; no build step, no server) that runs inside the Android and iOS apps as a local webview. Open `index.html` in a browser to try it.

## Folders

```
index.html                 Home: today's dates (Gregorian and Hijri), next prayer with countdown,
                           the day's timetable (arrows or swipe for other days), this week's Jumu'ah
time.html                  Full year calendar (side menu): the whole year's prayer times, month by month (opens at today)
donate.html                Donate tab: the website's donations page in app mode (see below)
give.html                  Donate in the side menu: why to give, the bank account (config.js bank, with copy buttons) and
                           a Donate Online button that does the same as the Donate tab
tasbih.html                Tasbih tab: dhikr counter with targets and a history of saved counts (see below)
settings.html              Settings tab: Adhan, Jama'ah and Qadha reminders, dark mode (see below)
qibla.html                 Qibla tab: the direction of the Kaaba, with a compass that turns with the phone (see below)
live.html                  Live stream (config.js liveVideoUrl -> { video_id }): the YouTube video through livePlayerUrl
                           (YouTube needs an https page), or "no live video"; checks again every minute while there is none.
                           Android: full screen video needs WebChromeClient onShowCustomView / onHideCustomView;
                           iOS: allowsInlineMediaPlayback = true
ramadan.html               Ramadhan timetable (config.js ramadanUrl): days until Ramadhan / today's Sehri and Iftar with a
                           countdown / Eid Mubarak; Eid salah, Sadaqah al-Fitr; all 30 days. Saved for offline use
names.html                 99 Names of Allah, with a search (the names are in js/names.js)
duas.html                  Daily duas: Arabic, transliteration, translation; Arabic text size (the duas are in js/duas.js)
web.html                   a website page in app mode, from the side menu: web.html#zakat, #events, #services, #about, #contact
assets/
  css/fonts.css            the app's fonts (files in assets/fonts, so it looks right offline)
  css/app.css              styles for every screen (light and dark)
  js/config.js             API addresses and how long saved data is kept
  js/app.js                shared by every screen: helpers, light/dark theme, messages, and the shell it builds once:
                           icons, bottom tabs (Home, Tasbih, Donate, Qibla, Settings), side menu, share
  js/nav.js                moving between screens with HTMX: swaps only the screen's content (see below)
  js/vendor/htmx.min.js    HTMX 2.0.4 (a local copy, so it works offline)
  js/data.js               prayer times and Hijri dates: from the APIs, saved on the phone, with a built-in fallback
  js/home.js               the home screen
  js/time.js, tasbih.js, qibla.js, settings.js   the Time, Tasbih, Qibla and Settings tabs
  js/frame.js              a website page in a frame (Donate tab and web.html)
  js/sky.js                the sun's path in the home header: an arc from sunrise to Maghrib with the sun where it is
                           now (the moon from Maghrib to the next sunrise, its phase from the Hijri day: a crescent
                           on the 1st, full on the 14th-15th, a crescent again at the month's end), from the prayer timetable; behind it the
                           sky of the time of day (night with stars, dawn, sunrise, noon with clouds, afternoon,
                           sunset, dusk), fading from one to the next
  js/makrooh.js            Makrooh times (config.js makroohUrl: minutes after sunrise, before Dhuhr and Maghrib): a
                           popup with a progress bar while one is on (home and Time screens, once per period), shown
                           again each time the app opens during one (never outside makrooh times), and the
                           "Makrooh times" card on the home screen. Saved for offline use
  js/pull.js               pull down to refresh on the home and Time screens: fetches the timetable, Hijri dates and
                           makrooh times again, redraws, and schedules the alerts again
  js/update.js             "Update available" popup: once per launch asks config.js updateCheckUrl
                           ?platform=android|ios&current=<?v= version>; "Update now" calls Android.updateApp() (Android
                           JavaScript interface named "Android") or posts { action: 'updateApp' } to the iOS script
                           message handler "actionMessageHandler". Not checked without either (e.g. in a browser)
  js/popup.js              the website's popup message (admin panel > Notices) on the home screen, with the same
                           start/end dates, delay and "how often"; its links open the app's own screens where there is one.
                           Its button opens the link's full address in the phone's browser: Android.openLink(url), or
                           { action: 'openLink', url } to the iOS script message handler "actionMessageHandler"
  js/alerts.js             prayer alerts: works out the times and hands them to the native app (see Settings tab)
  audio/                   Tasbih recitations (optional, see below)
  data/builtin-data.js     built-in copies of this year's timetable and Hijri calendar (for a first launch offline)
  fonts/                   Instrument Serif, Hanken Grotesk, Amiri, Reem Kufi (SIL Open Font License)
  images/                  logo and app icons
```

## Moving between screens (HTMX)

The side menu and the bottom tabs stay; only the screen's content changes. Each page is still a whole page (it works
when opened on its own), with its content in:

```
<div class="app">
  <div id="view">
  <div class="view" data-page="time" data-scripts="time.js makrooh.js"> header, main ... </div>
  </div>
</div>
<script> config.js, builtin-data.js, app.js, data.js, alerts.js, vendor/htmx.min.js, nav.js (the same on every page)
```

- `nav.js` puts `hx-boost` on `<body>`: tapping a link to another screen (tabs, side menu, links in a screen) fetches
  that page and swaps only its `.view` into `#view` (`hx-select`). No reload, so the shell, the alerts' timers and
  saved data stay as they are. A thin bar shows at the top while a screen takes a moment to load.
- A screen's own scripts (`data-scripts`) are loaded the first time and run each time it is shown. Each one is
  `HIUK.view(function (v) { ... })`; what it starts through `v` ends when the screen goes:
  `v.on(target, type, fn)` (document / window listeners), `v.every(fn, ms)`, `v.later(fn, ms)`,
  `v.observe(new ResizeObserver(...))`, `v.own(element)` (e.g. a popup added to `<body>`), `v.cleanup(fn)`.
  Listeners on elements inside the screen need nothing: they go with it. `v.el` is the screen's `.view`.
- `app.js` `HIUK.shell.view()` runs for each screen: marks the current tab and menu item, measures a sticky header. `HIUK.route` is `{ url, page, hash }` (e.g. `web.html#zakat` -> hash `zakat`).
- Back shows the previous screen: the screens are in the history (`history.pushState`; from `file://` the address
  can't change, so it is kept in the history's state). The Android app's back button runs `window.goBack()` in the
  webview: on Home that calls `Android.goBack()` (the app decides what to do, e.g. close), on any other screen it goes
  straight to Home, not through the screens visited.
- **Native setting.** Loaded from files, the webview must let the pages read the app's other files:
  Android `WebSettings.setAllowFileAccessFromFileURLs(true)`, or better, serve the folder over
  `https://appassets.androidplatform.net/` with `WebViewAssetLoader`; iOS (WKWebView with `loadFileURL`):
  `webView.configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")`, or serve it with a
  `WKURLSchemeHandler`. Without it, the first tap finds out and every link then opens the normal way (a full page
  load, as before), so the app still works.

New screens: copy a page (e.g. `tasbih.html`) and give its `.view` a `data-page` and its scripts in `data-scripts`
(each one wrapped in `HIUK.view(function (v) { ... })`). Then set its `href` in the `TABS` and `MENU` lists at the top
of `app.js` (screens without an `href` show "coming soon"). Header buttons: `data-menu-open` opens the side menu,
`data-share` shares the app.

Like an app, the pages can't be zoomed (pinch, double-tap) and their text can't be selected or copied; typing boxes
(e.g. the 99 Names search) still work. The viewport meta (`user-scalable=no`), CSS (`user-select:none`,
`touch-action`) and `app.js` (copy / long-press / pinch events) do this. Native apps can make sure too: Android
`WebSettings.setSupportZoom(false)`, `setBuiltInZoomControls(false)`; iOS `scrollView.pinchGestureRecognizer?.isEnabled =
false` (WKWebView). Website pages shown in a frame (Donate, Zakat, About...) follow the website's own rules.

Side menu: opens with the menu button or a swipe right that starts on the left side of the screen (the left 90px; not on
rows that scroll sideways or the home timetable's own day swipe), and a swipe left closes it. It follows the finger and, let go, slides open if pulled past a third (or
flicked), otherwise back. The browser's own
swipe back/forward is off (`overscroll-behavior-x`); iOS: leave `allowsBackForwardNavigationGestures` off. Popups have
no close button: a tap outside the card closes them. The menu: the logo (not a link); under it Facebook, YouTube and website buttons (`facebookUrl`,
`youtubeUrl`, `website` in `config.js`). The list is `MENU` in `app.js`; still "coming soon": Services. At the
bottom: the app version
and the developer (`developer`). The app version comes from the address the native app opens: `index.html?v=1.0`
(letters, numbers, `.`, `-`, `+`, up to 20 characters). It is remembered for the other screens and for the next
launch; `appVersion` in `config.js` is only used until a version has been passed.

## Data

- Prayer times: the yearly timetable API (one entry per day; on Fridays Dhuhr is Jumu'ah with two Jama'ahs).
- Hijri dates: the Hijri calendar API; the Hijri day changes at Maghrib.
- Both are saved on the phone (timetable for 6 hours, Hijri calendar for a day) and fetched again when the app is opened
  or comes back to the front. Without internet the app uses the saved copy, or the built-in copy.
- Each new year, refresh `assets/data/builtin-data.js` with that year's data so a first launch offline still works.

## Donate tab

`donate.html` shows the website's donations page (`donateUrl` in `config.js`) in a frame, with `?app=1&theme=light|dark`.
In that mode the website leaves out its header, menus, footer, cookie banner, notices and visit counting, and shows a
basket button for the donation app; links to other website pages open outside the app. Payment is taken on that page
by the Sign Soft donation app (Stripe card form, Apple Pay, Google Pay, PayPal); the frame allows payments
(`allow="payment"`).

The same way, `web.html#zakat`, `#events`, `#services`, `#about` and `#contact` show the website's Zakat calculator,
News & events, Services, About and Contact pages (`webPages` and `webBase` in `config.js`). Add a page there and
point a `MENU` item at it with `web: 'name'`.

## Tasbih tab

`tasbih.html` counts five dhikr (SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha illallah, Astaghfirullah), each
shown in Arabic with its pronunciation and meaning. Each dhikr keeps its own count and target (33, 34, 99, 100, 500,
1,000 or the user's own number), saved on the phone. Reaching the target turns the ring green and vibrates.
Vibration: Android uses `navigator.vibrate`; the iOS webview has none, so the page posts `{ action: 'haptic' }` to the
script message handler `actionMessageHandler` (on each count, on reaching the target, and when the Qibla compass lines up).
"Undo" takes one off, "Reset" clears the count after asking, and "Save" adds it to the history and starts again.
The history (up to 1,000 entries, on the phone only) shows the all-time total and streak, and can be viewed by Day,
Month or Year (arrows for earlier periods), each with statistics (recited, sessions, targets met, days active,
average a day, best day or month) and a split by dhikr. Month and Year show a bar chart (tap a bar, then "View" to
open that day or month); Day lists the sessions, which can be deleted one by one, or all with "Clear all".
The list of dhikr is at the top of `tasbih.js`; the name of Allah is written plainly (الله) so the font draws it as one word.

Audio: "Listen" plays `assets/audio/<id>.mp3` (`subhanallah`, `alhamdulillah`, `allahuakbar`, `lailahaillallah`,
`astaghfirullah`). Until those files are added it uses the phone's Arabic text-to-speech voice where there is one
(usually iPhone), otherwise it says no Arabic voice is available. Short recordings (e.g. by the imam) are best.
Android WebView: `setMediaPlaybackRequiresUserGesture` can stay at its default; playback starts from a tap.

## Settings tab: prayer alerts

`settings.html` (with `settings.js`) sets three kinds of alert; `alerts.js` saves them and works out the times from the
prayer timetable:

- **Automatic Adhan** (off by default): at the start of each prayer, per prayer the full Adhan, a short Alert, or Off.
- **Jama'ah reminder**: for each ticked prayer, its own number of minutes (5-60, in 5s) before the Jama'ah; both
  Jama'ahs on Fridays.
- **Qadha reminder**: for each ticked prayer, its own number of minutes (5-120) before its time ends. Fajr ends at sunrise,
  Dhuhr (also on Fridays) at Asr, Asr at Maghrib, Maghrib at Isha, Isha at the next day's Fajr.
  Change these rules in `plan()` in `alerts.js` if the masjid follows different ones.
- **Auto silent mode** (off by default): for each ticked prayer its own times: the phone goes silent a number of
  minutes before the Jama'ah (0-30, default 5) and the sound comes back on a number of minutes after it starts (5-60,
  default 20).
  Both Jumu'ah Jama'ahs on Fridays (one silent time if they overlap). Needs the native app (below).
- A "Next alerts" list shows what is coming, and the dark mode switch is here too.
- **Time format**: 12-hour (1:30 pm, the default) or 24-hour (13:30) for every time in the app and in the alerts'
  texts (`hiuk_app_clock`; `HIUK.clock24()` and `HIUK.util.fmt12` / `fmtTime` in `app.js`).
- **Text size**: Small, Normal, Large or Extra large (90%, 100%, 112%, 125%) for the whole app, saved on the phone
  (`hiuk_app_text`; `HIUK.textSize()` in `app.js`, CSS `zoom` on `<html>`, so every screen reflows to fit).

**Donate tab in the apps:** if the app provides `window.Android.donateOnline(theme)` (Android) or the script message handler
`actionMessageHandler` (iOS, sent `{ action: 'donateOnline', theme }`), the bottom Donate tab and the Donate Online button on
`give.html` call it instead of opening `donate.html`. `theme` is the app's theme at that moment, `'dark'` or `'light'`.

**The native apps must deliver the alerts** (a webview can't wake the phone when the app is closed). Every time a
screen with `alerts.js` opens (home, Time, Settings) or a setting changes, the page hands over the next 7 days.

Android (`window.Android`, used when it has `setAzan` and `setReminder`; `setSilent` for silent mode): the page first
cancels everything (`cancelAzan('all')`, `cancelReminder('allJamaah')`, `cancelReminder('allQazaa')`, `cancelSilent` per
prayer), then sets each alarm still to come, all arguments as strings. Ids, for prayer n (Fajr 1, Zuhr 2, Asr 3,
Maghrib 4, Isha 5) and day d (0 = today .. 6):

| Alarm | Id |
| --- | --- |
| Adhan, or the short alert when a prayer is set to Alert (`setAzan`) | `10n + d` |
| Jama'ah (`setReminder`) | `100n + d`; the 2nd Jumu'ah Jama'ah `100n + 7` |
| Qadha (`setReminder`) | `1000 + 100n + d`; last night's Isha, due before Fajr today, `1000 + 500 + 7` |
| Silent on / off (`setSilent`) | `10n + d` / `100 + 10n + d`; the 2nd Jumu'ah Jama'ah with slot 7 |

`setAzan` has a last argument `alertOnly`, `'true'` or `'false'` (a string): `'true'` when the prayer is set to Alert,
so the app plays a short alert, not the Adhan:
`setAzan(id, year, month, day, hour, minute, title, body, alertOnly)`. A silent time already running is
set again with its start at the current minute, so `setSilent` must turn silent on straight away for a start just
passed, not move it to tomorrow. `setSilent` has one date, so a silent time past midnight ends at 23:59.

Otherwise, `window.HIUKNative.scheduleNotifications(json)` if the app provides it (the iPhone app), with:

```
{ "version": 1, "items": [ { "id": "adhan-20261028-Dhuhr", "kind": "adhan" | "alert" | "jamaah" | "qadha",
    "prayer": "Dhuhr", "time": 1793188140000 (ms since 1970, UTC), "title": "...", "body": "...",
    "sound": "adhan" | "adhan-fajr" | "alert" } ] }
```

Otherwise, in the iOS app (script message handler `actionMessageHandler`), the same alarms as on Android, as
messages: first `{ action: 'cancelAzan', wakto: 'all' }`, `{ action: 'cancelReminder', wakto: 'allJamaah' }` and
`{ action: 'cancelReminder', wakto: 'allQazaa' }`, then for each alarm still to come `{ action: 'setAzan' | 'setReminder',
id, year, month, day, hour, minute, title, body, sound }` (the ids in the table above, all strings; `sound`: `adhan`,
`adhan-fajr` or `alert`). `setAzan` also has `alertOnly`, here a boolean (`true` when the prayer is set to Alert). Only
the soonest 60 are sent, for iOS's limit of 64.

The app should cancel the notifications it scheduled before and schedule these (the next 7 days, at most 60, so it
fits iOS's limit of 64). Android: `AlarmManager.setExactAndAllowWhileIdle` (+ `SCHEDULE_EXACT_ALARM` /
`USE_EXACT_ALARM`), `POST_NOTIFICATIONS` on Android 13+, a notification channel per sound, and reschedule after a
reboot (`RECEIVE_BOOT_COMPLETED`, from the last list saved by the app). iOS: `UNUserNotificationCenter` with
`UNCalendarNotificationTrigger`; ask permission first. iOS notification sounds play for at most 30 seconds, so the
full Adhan only plays in full on Android (or while the app is open).

**Auto silent mode is done by the native app too.** At the same moments, if the app provides it, the page calls
`window.HIUKNative.scheduleSilent(json)` with the next 7 days (an empty list when the setting is off: cancel all):

```
{ "version": 1, "items": [ { "id": "silent-20261030-Dhuhr-0", "prayer": "Dhuhr",
    "start": 1793357700000, "end": 1793359500000 } ] }   (ms since 1970, UTC)
```

The app should cancel what it scheduled before, then at each `start` silence the phone and at `end` put it back as it
was (only if it is still the app's silent mode, so a change the user made in between is kept). Android: Do Not
Disturb with `NotificationManager.setInterruptionFilter` (ask for access with
`ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS`, permission `ACCESS_NOTIFICATION_POLICY`) or `AudioManager` ringer mode
silent/vibrate; exact alarms as above, and reschedule after a reboot. iOS does not let apps change the silent switch or
Focus, so on iPhone leave `scheduleSilent` out: the Settings screen then says so and suggests a Focus.

Sounds: put the Adhan recordings in `assets/audio/adhan.mp3` and `assets/audio/adhan-fajr.mp3` (the Fajr Adhan; if it
is missing `adhan.mp3` is used) and the same files in the native projects for the notifications. Until they are added,
a short tone plays instead. Without `HIUKNative.scheduleNotifications` (e.g. in a browser), alerts show and play only
while the app is open (Android WebView: `setMediaPlaybackRequiresUserGesture(false)` so the Adhan can start by itself).

## Qibla tab

`qibla.html` works out the great-circle direction (degrees from true north) and distance to the Kaaba. It starts from
the masjid (`masjidLocation` in `config.js`); "Use my location" switches to the phone's location, which is remembered.
Where the phone has a compass, the dial turns with it, says "Turn left/right N°", and turns green (with a short
vibration) within 4° of the Qibla. Without a compass it shows the direction as a number on a fixed dial.

- Compass: Android sends readings straight away (`deviceorientationabsolute`). iPhone needs a tap first, so a
  "Start compass" button appears there (`DeviceOrientationEvent.requestPermission`).
- Phone compasses point to magnetic north; in the UK that is within about 1-2° of true north.
- Android: add `ACCESS_COARSE_LOCATION` (and `ACCESS_FINE_LOCATION` if wanted), request it at run time, enable
  `setGeolocationEnabled(true)` and answer `WebChromeClient.onGeolocationPermissionsShowPrompt` (callback `invoke(origin, true, false)`).
- iOS: add `NSLocationWhenInUseUsageDescription` and `NSMotionUsageDescription` to Info.plist.
- Optional: if the app provides `window.HIUKNative.getLocation(callbackName)`, the page uses it instead of the webview's
  geolocation; the app then calls `window[callbackName](lat, lon)`, or `window[callbackName](null)` when it can't.

## Putting it in the apps

- Copy the whole folder into the app (Android: `app/src/main/assets/www/`, iOS: a folder reference in the Xcode project)
  and load `index.html` from it.
- Android WebView: enable JavaScript and DOM storage (`setJavaScriptEnabled(true)`, `setDomStorageEnabled(true)`);
  loading from `file:///android_asset/` works (with `setAllowFileAccessFromFileURLs(true)` for moving between
  screens without reloading, see "Moving between screens"), or use `WebViewAssetLoader` for an https address.
  Allow internet access (`android.permission.INTERNET`).
- No scrollbars: the page's CSS hides its own, but a webview draws one of its own that CSS can't reach. Turn it off in the
  app. Android: `webView.isVerticalScrollBarEnabled = false; webView.isHorizontalScrollBarEnabled = false`. iOS:
  `webView.scrollView.showsVerticalScrollIndicator = false; webView.scrollView.showsHorizontalScrollIndicator = false`.
- iOS WKWebView: load with `loadFileURL(_:allowingReadAccessTo:)` giving the folder, so the CSS, fonts and scripts load.
- The pages use plain scripts (not JavaScript modules) and relative paths, so they work from local files.
- The layout leaves room for the notch (`viewport-fit=cover` with safe-area insets). The tab bar reaches the screen's
  bottom edge, over the home bar, so nothing else leaves room for it there (`--tabs-h` is the bar's height).
- The APIs allow requests from any origin, so they work from a local page.
- Sharing the app: if the Android app provides `window.Android.shareApp()`, the share button calls it; in the iOS app it
  posts `{ action: 'shareApp' }` to the script message handler `actionMessageHandler`. Otherwise, if the
  app provides `window.HIUKNative.share(json)`, the phone's
  share sheet opens with `{ title, text, url }`. Otherwise
  the webview's own share sheet is used where it has one (iOS), or the link is copied. Set `shareUrl` in `config.js`
  to the app's store page once it is published. The Zakat calculator's Share button shares its summary and link instead: it calls
  `window.Android.shareText(title, text)` if the Android app provides it, or posts `{ action: 'shareText', title, text }` to the
  iOS script message handler `actionMessageHandler`; otherwise it uses the website's own share menu or panel.
- Printing the Zakat calculator: a webview can't print on its own, so the page calls `window.Android.printHtml(title, html)`
  if the Android app provides it, or posts `{ action: 'printHtml', title, html }` to the iOS script message handler
  `actionMessageHandler`. Otherwise the Print button is hidden in the app.
- Links to websites (`target="_blank"`, e.g. "Visit our website") and `tel:` links should be opened by the phone, not
  inside the webview: handle them in `shouldOverrideUrlLoading` (Android) / `decidePolicyFor` (iOS).
