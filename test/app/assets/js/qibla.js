/* Stepney Shah Jalal Mosque app: Qibla. The great-circle direction (bearing from true north) from where you are to the
   Kaaba, and a compass that turns with the phone where it has one. Without your location it uses the masjid's.
   Compass: iPhone (webkitCompassHeading, after a tap to allow motion access) and Android (deviceorientationabsolute).
   Phone compasses point to magnetic north; in the UK that is within about 1-2 degrees of true north. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const CFG = window.HIUK_CONFIG || {};
    const $ = (id) => document.getElementById(id);
    const KAABA = { lat: 21.422487, lon: 39.826206 };
    const MASJID = CFG.masjidLocation || { lat: 51.5299, lon: 0.0258, name: 'Stepney Shah Jalal Mosque, London' };
    const STORE_KEY = 'hiuk_app_location';
    const rad = (d) => d * Math.PI / 180, deg = (r) => r * 180 / Math.PI;
    const norm = (a) => ((a % 360) + 360) % 360;
    // shortest signed turn from a to b (-180..180)
    const diff = (a, b) => ((b - a + 540) % 360) - 180;

    function bearingTo(from, to) {
      const p1 = rad(from.lat), p2 = rad(to.lat), dl = rad(to.lon - from.lon);
      return norm(deg(Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl))));
    }
    function distanceKm(a, b) {
      const dp = rad(b.lat - a.lat), dl = rad(b.lon - a.lon);
      const h = Math.sin(dp / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dl / 2) ** 2;
      return 6371 * 2 * Math.asin(Math.sqrt(h));
    }
    const compassWord = (b) => ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'][Math.round(b / 45) % 8];

    /* ---- dial ticks (every 5 degrees, longer every 30) ---- */
    (function () {
      let t = '';
      for (let a = 0; a < 360; a += 5) {
        const long = a % 30 === 0;
        t += `<line class="${long ? 'q-tick-l' : 'q-tick'}" x1="150" y1="${long ? 14 : 16}" x2="150" y2="${long ? 28 : 22}" transform="rotate(${a} 150 150)"/>`;
      }
      $('qTicks').innerHTML = t;
    })();

    /* ---- location ---- */
    let place = HIUK.store.get(STORE_KEY) || { lat: MASJID.lat, lon: MASJID.lon, name: MASJID.name, mine: false };
    let qibla = 0;
    function useLocation(p) {
      place = p;
      qibla = bearingTo(p, KAABA);
      $('qPlace').textContent = p.mine ? 'From your location' : 'From ' + (p.name || 'the masjid');
      $('qBearing').textContent = Math.round(qibla) + '°';
      const km = distanceKm(p, KAABA);
      $('qDistance').textContent = Math.round(km).toLocaleString('en-GB') + ' km';
      $('qDistance').title = Math.round(km * 0.621371).toLocaleString('en-GB') + ' miles';
      $('qMark').setAttribute('transform', `rotate(${qibla.toFixed(1)} 150 150)`);
      update();
    }
    $('qLocate').addEventListener('click', () => {
      const fromApp = window.HIUKNative && typeof window.HIUKNative.getLocation === 'function';
      if (!fromApp && !navigator.geolocation) { HIUK.toast('Location is not available on this device'); return; }
      $('qLocate').disabled = true;
      HIUK.toast('Finding your location…');
      const done = (lat, lon) => {
        $('qLocate').disabled = false;
        const p = { lat, lon, mine: true };
        HIUK.store.set(STORE_KEY, p);
        useLocation(p);
        HIUK.toast('Qibla updated for your location');
      };
      const fail = (msg) => { $('qLocate').disabled = false; HIUK.toast(msg || 'Location not found. Using the masjid\'s.'); };
      if (fromApp) {
        // the native app can supply the location: HIUKNative.getLocation(callbackName) calls window[callbackName](lat, lon) or (null)
        window.__hiukLocation = (lat, lon) => (typeof lat === 'number' && typeof lon === 'number' ? done(lat, lon) : fail());
        window.HIUKNative.getLocation('__hiukLocation');
        return;
      }
      navigator.geolocation.getCurrentPosition((pos) => done(pos.coords.latitude, pos.coords.longitude),
        (err) => fail(err && err.code === 1 ? 'Location permission was refused. Using the masjid\'s location.' : null),
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 });
    });

    /* ---- compass ---- */
    let heading = null;      // smoothed direction the phone points to (degrees from north)
    let lastEvent = 0, aligned = false;
    function onHeading(raw) {
      const screenAngle = (screen.orientation && typeof screen.orientation.angle === 'number') ? screen.orientation.angle : (window.orientation || 0);
      const h = norm(raw + screenAngle);
      heading = heading === null ? h : norm(heading + diff(heading, h) * 0.25); // smooth out jitter
      lastEvent = Date.now();
      $('qStart').hidden = true;
      update();
    }
    function onIOS(e) { if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) onHeading(e.webkitCompassHeading); }
    function onAbsolute(e) { if (e.absolute !== false && typeof e.alpha === 'number') onHeading(360 - e.alpha); }

    // Listen straight away (Android sends readings without asking). If nothing arrives and the phone needs
    // permission first (iPhone), show "Start compass": the permission can only be asked after a tap.
    const needsTap = !!(window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function');
    function listen() {
      if ('ondeviceorientationabsolute' in window) v.on(window, 'deviceorientationabsolute', onAbsolute);
      v.on(window, 'deviceorientation', onIOS);
    }
    function waitForReadings(ms, then) { v.later(() => { if (!lastEvent) then(); }, ms); }
    $('qStart').addEventListener('click', () => {
      window.DeviceOrientationEvent.requestPermission().then((r) => {
        if (r !== 'granted') { noCompass('Motion access was refused, so the compass is off.'); return; }
        $('qStart').hidden = true;
        listen();
        waitForReadings(3000, () => noCompass());
      }).catch(() => noCompass());
    });

    let compassOff = false;
    function noCompass(msg) {
      compassOff = true;
      heading = null;
      update(msg);
    }

    function status(text) { $('qStatus').textContent = text; }
    // the dial's rotation, kept continuous so turning past north doesn't spin it the long way round
    let rotation = 0, rotatedFor = null;
    function update(msg) {
      const dial = $('qDial');
      if (heading === null) {
        rotation = 0; rotatedFor = null;
        dial.style.transform = 'rotate(0deg)';
        $('qHeading').textContent = '—';
        $('qCompass').classList.remove('is-aligned');
        status(msg || (compassOff
          ? `No compass on this device. The Qibla is ${Math.round(qibla)}° from north (${compassWord(qibla)}).`
          : `The Qibla is ${Math.round(qibla)}° from north (${compassWord(qibla)}).`));
        return;
      }
      rotation = rotatedFor === null ? -heading : rotation - diff(rotatedFor, heading);
      rotatedFor = heading;
      dial.style.transform = `rotate(${rotation.toFixed(1)}deg)`;
      $('qHeading').textContent = Math.round(heading) + '°';
      const turn = diff(heading, qibla);
      const isAligned = Math.abs(turn) <= 4;
      $('qCompass').classList.toggle('is-aligned', isAligned);
      if (isAligned && !aligned) HIUK.haptic(40);
      aligned = isAligned;
      status(isAligned ? 'You are facing the Qibla' : `Turn ${turn > 0 ? 'right' : 'left'} ${Math.abs(Math.round(turn))}°`);
    }

    useLocation(place);
    if (!window.DeviceOrientationEvent) noCompass();
    else {
      listen();
      waitForReadings(1500, () => {
        if (needsTap) { $('qStart').hidden = false; status('Tap “Start compass” to use the compass.'); }
        else noCompass(); // no compass (e.g. a computer)
      });
    }
  });
})();
