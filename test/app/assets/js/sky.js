/* Stepney Shah Jalal Mosque app: the sky behind the home screen's header, and the sun's path across it.
   The sky follows the day from the prayer timetable (data.js): night with stars (Isha to Fajr), the dawn glow (Fajr),
   sunrise, morning, noon (Dhuhr), afternoon (Asr), sunset (Maghrib) and dusk, each colour fading into the next.
   An arc from sunrise (left) to sunset (Maghrib, right): by day the sun sits where it is now and the part of the
   arc it has crossed is drawn in gold; at night the moon crosses it from Maghrib to the next sunrise.
   Redrawn every minute and when the screen changes size. */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const { at, addDays, pad, fmt12 } = HIUK.util;
    const top = document.querySelector('.top');
    if (!top) return;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'sky');
    svg.setAttribute('aria-hidden', 'true');
    top.insertBefore(svg, top.firstChild);

    const timeOf = (day, key) => { const p = (HIUK.times.forDate(day) || []).find((x) => x.key === key); return p && p.begins ? at(day, p.begins) : null; };
    const short = (d) => fmt12(pad(d.getHours()) + ':' + pad(d.getMinutes())).replace(' ', '');
    const MIN = 60000;

    /* ---- the sky's colours through the day ----
       sky: top, middle and horizon colours; glow: the light low on the horizon (colour, strength);
       stars and clouds: how much they show (0 to 1). Kept deep enough for the white text on top. */
    const LOOK = {
      night:   { sky: ['#070B22', '#11173A', '#241A3F'], glow: ['#6A5ACD', 0],   stars: 1,   clouds: 0 },
      fajr:    { sky: ['#0D1433', '#1E2350', '#3A2550'], glow: ['#C86A7A', .3],  stars: .85, clouds: 0 },
      dawn:    { sky: ['#1A2453', '#4A3267', '#A4475A'], glow: ['#F58A5B', .65], stars: .3,  clouds: .1 },
      sunrise: { sky: ['#27396B', '#7A4A6E', '#CB603F'], glow: ['#FFB066', .9],  stars: 0,   clouds: .3 },
      morning: { sky: ['#1E4C80', '#3A6898', '#A8744F'], glow: ['#FFC98A', .45], stars: 0,   clouds: .45 },
      noon:    { sky: ['#144A80', '#24649C', '#3E7FB2'], glow: ['#FFF0C8', .3],  stars: 0,   clouds: .55 },
      after:   { sky: ['#1C4C7E', '#376894', '#94805E'], glow: ['#FFD08A', .4],  stars: 0,   clouds: .45 },
      sunset:  { sky: ['#2A3D72', '#6E4F70', '#CF7440'], glow: ['#FF9C4A', .85], stars: 0,   clouds: .35 },
      maghrib: { sky: ['#232A5E', '#6A3762', '#BE4A3A'], glow: ['#FF7438', .85], stars: .1,  clouds: .2 },
      dusk:    { sky: ['#141A44', '#2C2152', '#5A2D52'], glow: ['#B84A5A', .3],  stars: .6,  clouds: 0 }
    };
    // [time, look] through today, in order
    function keys(day) {
      const t = (k) => timeOf(day, k), plus = (d, m) => d && new Date(d.getTime() + m * MIN);
      const fajr = t('Fajr'), rise = t('Sunrise'), dhuhr = t('Dhuhr'), asr = t('Asr'), set = t('Maghrib'), isha = t('Isha');
      const midnight = day, end = addDays(day, 1);
      const list = [
        [midnight, 'night'], [fajr, 'night'], [plus(fajr, 20), 'fajr'], [plus(rise, -25), 'dawn'], [rise, 'sunrise'],
        [plus(rise, 50), 'morning'], [plus(dhuhr, -60), 'noon'], [plus(dhuhr, 30), 'noon'], [asr, 'after'],
        [plus(set, -40), 'sunset'], [set, 'maghrib'], [plus(set, 35), 'dusk'], [isha && isha < end ? isha : plus(set, 90), 'night'], [end, 'night']
      ].filter((k) => k[0]);
      return list.filter((k, i) => i === 0 || k[0] >= list[i - 1][0]);
    }
    const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const mixHex = (a, b, f) => '#' + rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * f).toString(16).padStart(2, '0')).join('');
    const mixNum = (a, b, f) => a + (b - a) * f;
    // the look now: between the two keys either side of it, smoothly
    function lookAt(now, day) {
      const k = keys(day);
      let i = k.findIndex((x) => x[0] > now);
      if (i <= 0) i = i === 0 ? 1 : k.length - 1;
      const [ta, na] = k[i - 1], [tb, nb] = k[i], A = LOOK[na], B = LOOK[nb];
      let f = tb - ta > 0 ? Math.min(1, Math.max(0, (now - ta) / (tb - ta))) : 1;
      f = f * f * (3 - 2 * f); // ease
      return {
        sky: A.sky.map((c, j) => mixHex(c, B.sky[j], f)),
        glow: [mixHex(A.glow[0], B.glow[0], f), mixNum(A.glow[1], B.glow[1], f)],
        stars: mixNum(A.stars, B.stars, f), clouds: mixNum(A.clouds, B.clouds, f)
      };
    }

    // the same stars every time for a screen size
    function stars(W, horizon) {
      let seed = 7;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      let out = '';
      const n = Math.round(W / 9);
      for (let i = 0; i < n; i++) {
        const x = rnd() * W, y = rnd() * (horizon - 8), r = .5 + rnd() * rnd() * 1.3;
        out += `<circle class="sky-star${rnd() < .35 ? ' tw' : ''}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" style="animation-delay:-${(rnd() * 4).toFixed(2)}s"/>`;
      }
      return out;
    }
    const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="34" ry="9"/><ellipse cx="-12" cy="-6" rx="16" ry="10"/><ellipse cx="10" cy="-8" rx="18" ry="12"/></g>`;

    /* the moon as it is tonight, from the Hijri day (the Hijri day begins at Maghrib): a thin crescent on the 1st,
       growing on the right, full on the 14th-15th, then shrinking from the right until the month ends */
    function moon(x, y, now) {
      const h = HIUK.hijri && HIUK.hijri.get(HIUK.hijri.today(now));
      const p = h ? Math.min(.98, Math.max(.02, (h.day + .5) / 30)) : .25;   // 0 new, .5 full, 1 new again
      const lit = (1 - Math.cos(2 * Math.PI * p)) / 2, r = 10;
      // the lit part: half the disc on the lit side, closed by the shadow's edge (half an ellipse)
      let t = r * Math.abs(Math.cos(2 * Math.PI * p));
      const crescent = lit < .5, waxing = p < .5;
      if (crescent) t = Math.min(t, r - 2);   // never thinner than 2px, so the 1st still shows
      const edge = waxing ? 1 : 0, back = waxing === crescent ? 0 : 1;
      const shape = lit > .985 ? `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF3DC"/>`
        : `<path fill="#FFF3DC" d="M${x} ${y - r}A${r} ${r} 0 0 ${edge} ${x} ${y + r}A${t.toFixed(2)} ${r} 0 0 ${back} ${x} ${y - r}Z"/>`;
      return `<circle cx="${x}" cy="${y}" r="${(18 + lit * 14).toFixed(1)}" fill="url(#skyMoonGlow)" opacity="${(.45 + lit * .55).toFixed(2)}"/>
        <circle cx="${x}" cy="${y}" r="${r}" fill="#FFF3DC" opacity=".12"/>${shape}`;
    }

    function draw() {
      const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const rise = timeOf(today, 'Sunrise'), set = timeOf(today, 'Maghrib');
      if (!rise || !set) { svg.innerHTML = ''; return; }
      // day: sunrise -> Maghrib; night: Maghrib -> the next sunrise
      let night = false, from = rise, to = set;
      if (now >= set) { night = true; from = set; to = timeOf(addDays(today, 1), 'Sunrise') || addDays(rise, 1); }
      else if (now < rise) { night = true; from = timeOf(addDays(today, -1), 'Maghrib') || addDays(set, -1); to = rise; }
      const f = Math.min(1, Math.max(0, (now - from) / (to - from)));
      const look = lookAt(now, today);

      // the arc: half an ellipse standing on the horizon, just above where the next-prayer card covers the header
      const W = top.clientWidth, H = top.clientHeight;
      // under the logo: the header's top padding is the logo's room plus the notch's (iPhone), so all is measured from it
      const below = parseFloat(getComputedStyle(top).paddingTop) || 54, notch = Math.max(0, below - 54);
      // (the times under the horizon stay clear of the card, which covers the bottom 46px)
      const horizon = Math.min(H - 66, below + 87), cx = W / 2, rx = Math.min(W * 0.43, 230), ry = Math.max(56, horizon - below - 8);
      const a = Math.PI * (1 - f), x = cx + rx * Math.cos(a), y = horizon - ry * Math.sin(a);
      const arc = `M${cx - rx} ${horizon} A${rx} ${ry} 0 0 1 ${cx + rx} ${horizon}`;
      // the horizon's glow: under the sun by day, where the sun rises before sunrise, where it set after Maghrib
      const gx = night ? (now < rise ? cx - rx : cx + rx) : x;
      const body = night ? moon(x, y, now)
        : `<circle cx="${x}" cy="${y}" r="30" fill="url(#skySunGlow)"/><circle class="sky-sun" cx="${x}" cy="${y}" r="8.5"/>`;
      // the clouds sit under the status bar (iPhone), not behind it
      const cy = (k) => notch + (horizon - notch) * k;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      // kept to the top; if the webview sizes the header differently from what was measured (iOS), the sky's colours
      // reach past the drawing on every side, so the header's own colour never shows at its edges
      svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
      svg.innerHTML = `<defs>
          <linearGradient id="skyFill" x1="0" y1="0" x2="0" y2="${horizon}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${look.sky[0]}"/><stop offset=".55" stop-color="${look.sky[1]}"/><stop offset="1" stop-color="${look.sky[2]}"/></linearGradient>
          <radialGradient id="skyHaze" cx="${gx}" cy="${horizon}" r="${Math.max(W * .62, 200)}" gradientTransform="translate(0 ${horizon}) scale(1 .55) translate(0 -${horizon})" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${look.glow[0]}" stop-opacity="${look.glow[1].toFixed(2)}"/><stop offset=".5" stop-color="${look.glow[0]}" stop-opacity="${(look.glow[1] * .3).toFixed(2)}"/><stop offset="1" stop-color="${look.glow[0]}" stop-opacity="0"/></radialGradient>
          <radialGradient id="skySunGlow"><stop offset="0" stop-color="#FFD58A" stop-opacity=".75"/><stop offset=".45" stop-color="#F8A662" stop-opacity=".28"/><stop offset="1" stop-color="#F47A1E" stop-opacity="0"/></radialGradient>
          <radialGradient id="skyMoonGlow"><stop offset="0" stop-color="#FFF3DC" stop-opacity=".5"/><stop offset="1" stop-color="#F3E6D0" stop-opacity="0"/></radialGradient>
          <filter id="skySoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>
        <rect class="sky-fill" x="${-W}" y="${-H}" width="${3 * W}" height="${3 * H}" fill="url(#skyFill)"/>
        <rect x="${-W}" y="${-H}" width="${3 * W}" height="${3 * H}" fill="url(#skyHaze)"/>
        <rect class="sky-dim" x="${-W}" y="${-H}" width="${3 * W}" height="${3 * H}"/>
        ${look.stars > .02 ? `<g class="sky-stars" opacity="${look.stars.toFixed(2)}">${stars(W, horizon)}</g>` : ''}
        ${look.clouds > .02 ? `<g class="sky-clouds" opacity="${look.clouds.toFixed(2)}" filter="url(#skySoft)">${cloud(W * .16, cy(.42), .9)}${cloud(W * .8, cy(.3), .7)}${cloud(W * .58, cy(.78), .55)}</g>` : ''}
        <line class="sky-horizon" x1="${cx - rx - 14}" y1="${horizon}" x2="${cx + rx + 14}" y2="${horizon}"/>
        <path class="sky-path" d="${arc}"/>
        <path class="sky-done${night ? ' is-night' : ''}" d="${arc}" pathLength="100" stroke-dasharray="${(f * 100).toFixed(2)} 100"/>
        ${body}
        <text class="sky-time" x="${cx - rx}" y="${horizon + 12}" text-anchor="middle">${night ? short(from) : short(rise)}</text>
        <text class="sky-time" x="${cx + rx}" y="${horizon + 12}" text-anchor="middle">${night ? short(to) : short(set)}</text>`;
      svg.setAttribute('data-night', String(night));
    }

    HIUK.times.ready.then(() => {
      draw();
      v.every(draw, 60000);
      // the header's size changes when the fonts arrive or the phone turns
      let size = top.clientWidth + 'x' + top.clientHeight;
      const resized = () => { const s = top.clientWidth + 'x' + top.clientHeight; if (s !== size) { size = s; draw(); } };
      if (window.ResizeObserver) v.observe(new ResizeObserver(resized)).observe(top); else v.on(window, 'resize', resized);
      v.on(document, 'visibilitychange', () => { if (!document.hidden) draw(); });
      v.on(document, 'hiuk:times', draw);
    });
  });
})();
