/* Hefazothe Islam UK app: the 99 Names of Allah, with a search (by name, meaning or number). */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const { esc } = HIUK.util;
    const $ = (id) => document.getElementById(id);

    // [number, name, meaning, Arabic]
    const ALLAH = ['Allah', 'Allah', 'اللّٰه'];
    const NAMES = [
      [1, 'AR-RAHMAAN', 'The Beneficent', 'الرَّحْمَنُ'],
      [2, 'AR-RAHEEM', 'The Merciful', 'الرَّحِيمُ'],
      [3, 'AL-MALIK', 'The King', 'الْمَلِكُ'],
      [4, 'AL-QUDDUS', 'The Most Sacred', 'الْقُدُّوسُ'],
      [5, 'AS-SALAM', 'The Source of Peace, The Flawless', 'السَّلاَمُ'],
      [6, 'AL-MU’MIN', 'The Infuser of Faith', 'الْمُؤْمِنُ'],
      [7, 'AL-MUHAYMIN', 'The Preserver of Safety', 'الْمُهَيْمِنُ'],
      [8, 'AL-AZIZ', 'All Mighty', 'الْعَزِيزُ'],
      [9, 'AL-JABBAR', 'The Compeller, The Restorer', 'الْجَبَّارُ'],
      [10, 'AL-MUTAKABBIR', 'The Supreme, The Majestic', 'ُالْمُتَكَبِّر'],
      [11, 'AL-KHAALIQ', 'The Creator, The Maker', 'الْخَالِقُ'],
      [12, 'AL-BAARI', 'The Evolver', 'الْبَارِئُ'],
      [13, 'AL-MUSAWWIR', 'The Fashioner', 'الْمُصَوِّرُ'],
      [14, 'AL-GHAFFAR', 'The Great Forgiver', 'الْغَفَّارُ'],
      [15, 'AL-QAHHAR', 'The All-Prevailing One', 'الْقَهَّارُ'],
      [16, 'AL-WAHHAAB', 'The Supreme Bestower', 'الْوَهَّابُ'],
      [17, 'AR-RAZZAAQ', 'The Provider', 'الرَّزَّاقُ'],
      [18, 'AL-FATTAAH', 'The Supreme Solver', 'الْفَتَّاحُ'],
      [19, 'AL-‘ALEEM', 'The All-Knowing', 'اَلْعَلِيْمُ'],
      [20, 'AL-QAABID', 'The Withholder', 'الْقَابِضُ'],
      [21, 'AL-BAASIT', 'The Extender', 'الْبَاسِطُ'],
      [22, 'AL-KHAAFIDH', 'The Reducer', 'الْخَافِضُ'],
      [23, 'AR-RAAFI’', 'The Exalter, The Elevator', 'الرَّافِعُ'],
      [24, 'AL-MU’IZZ', 'The Honourer, The Bestower', 'الْمُعِزُّ'],
      [25, 'AL-MUZIL', 'The Dishonourer, The Humiliator', 'ٱلْمُذِلُّ'],
      [26, 'AS-SAMEE’', 'The All-Hearing', 'السَّمِيعُ'],
      [27, 'AL-BASEER', 'The All-Seeing', 'الْبَصِيرُ'],
      [28, 'AL-HAKAM', 'The Impartial Judge', 'الْحَكَمُ'],
      [29, 'AL-‘ADL', 'The Utterly Just', 'الْعَدْلُ'],
      [30, 'AL-LATEEF', 'The Subtle One, The Most Gentle', 'اللَّطِيفُ'],
      [31, 'AL-KHABEER', 'The All-Aware', 'الْخَبِيرُ'],
      [32, 'AL-HALEEM', 'The Most Forbearing', 'الْحَلِيمُ'],
      [33, 'AL-‘AZEEM', 'The Magnificent, The Supreme', 'الْعَظِيمُ'],
      [34, 'AL-GHAFOOR', 'The Great Forgiver', 'الْغَفُور'],
      [35, 'ASH-SHAKOOR', 'The Most Appreciative', 'الشَّكُورُ'],
      [36, 'AL-‘ALEE', 'The Most High, The Exalted', 'الْعَلِيُّ'],
      [37, 'AL-KABEER', 'The Most Great', 'الْكَبِيرُ'],
      [38, 'AL-HAFEEDH', 'The Preserver', 'الْحَفِيظُ'],
      [39, 'AL-MUQEET', 'The Sustainer', 'المُقيِت'],
      [40, 'AL-HASEEB', 'The Reckoner', 'اﻟْﺣَسِيبُ'],
      [41, 'AL-JALEEL', 'The Majestic', 'الْجَلِيلُ'],
      [42, 'AL-KAREEM', 'The Most Generous, The Most Esteemed', 'الْكَرِيمُ'],
      [43, 'AR-RAQEEB', 'The Watchful', 'الرَّقِيبُ'],
      [44, 'AL-MUJEEB', 'The Responsive One', 'ٱلْمُجِيبُ'],
      [45, 'AL-WAASI’', 'The All-Encompassing, the Boundless', 'الْوَاسِعُ'],
      [46, 'AL-HAKEEM', 'The All-Wise', 'الْحَكِيمُ'],
      [47, 'AL-WADUD', 'The Most Loving', 'الْوَدُودُ'],
      [48, 'AL-MAJEED', 'The Glorious, The Most Honorable', 'الْمَجِيدُ'],
      [49, 'AL-BA’ITH', 'The Infuser of New Life', 'الْبَاعِثُ'],
      [50, 'ASH-SHAHEED', 'The All Observing Witnessing', 'الشَّهِيدُ'],
      [51, 'AL-HAQQ', 'The Absolute Truth', 'ٱلْحَقُّ'],
      [52, 'AL-WAKEEL', 'The Trustee, The Disposer of Affairs', 'الْوَكِيلُ'],
      [53, 'AL-QAWIYY', 'The All-Strong', 'ٱلْقَوِيُّ'],
      [54, 'AL-MATEEN', 'The Firm, The Steadfast', 'الْمَتِينُ'],
      [55, 'AL-WALIYY', 'The Protecting Associate', 'الْوَلِيُّ'],
      [56, 'AL-HAMEED', 'The Praiseworthy', 'الْحَمِيدُ'],
      [57, 'AL-MUHSEE', 'The All-Enumerating, The Counter', 'الْمُحْصِي'],
      [58, 'AL-MUBDI', 'The Originator, The Initiator', 'الْمُبْدِئُ'],
      [59, 'AL-MUEED', 'The Restorer, The Reinstater', 'ٱلْمُعِيدُ'],
      [60, 'AL-MUHYI', 'The Giver of Life', 'الْمُحْيِي'],
      [61, 'AL-MUMEET', 'The Creator of Death', 'اَلْمُمِيتُ'],
      [62, 'AL-HAYY', 'The Ever-Living', 'الْحَيُّ'],
      [63, 'AL-QAYYOOM', 'The Sustainer, The Self-Subsisting', 'الْقَيُّومُ'],
      [64, 'AL-WAAJID', 'The Perceiver', 'الْوَاجِدُ'],
      [65, 'AL-MAAJID', 'The Illustrious', 'الْمَاجِدُ'],
      [66, 'AL-WAAHID', 'The One', 'الْواحِدُ'],
      [67, 'AL-AHAD', 'The Unique, The Only One', 'اَلاَحَدُ'],
      [68, 'AS-SAMAD', 'The Eternal, Satisfier of Needs', 'الصَّمَدُ'],
      [69, 'AL-QADEER', 'The Omnipotent One', 'الْقَادِرُ'],
      [70, 'AL-MUQTADIR', 'The Powerful', 'الْمُقْتَدِرُ'],
      [71, 'AL-MUQADDIM', 'The Expediter, The Promoter', 'الْمُقَدِّمُ'],
      [72, 'AL-MU’AKHKHIR', 'The Delayer', 'الْمُؤَخِّرُ'],
      [73, 'AL-AWWAL', 'The First', 'الأوَّلُ'],
      [74, 'AL-AAKHIR', 'The Last', 'الآخِرُ'],
      [75, 'AZ-ZAAHIR', 'The Manifest', 'الظَّاهِرُ'],
      [76, 'AL-BAATIN', 'The Hidden One, Knower of the Hidden', 'الْبَاطِنُ'],
      [77, 'AL-WAALI', 'The Sole Governor', 'الْوَالِي'],
      [78, 'AL-MUTA’ALI', 'The Self Exalted', 'الْمُتَعَالِي'],
      [79, 'AL-BARR', 'The Source of All Goodness', 'الْبَرُّ'],
      [80, 'AT-TAWWAB', 'The Ever-Pardoning, The Relenting', 'التَّوَابُ'],
      [81, 'AL-MUNTAQIM', 'The Avenger', 'الْمُنْتَقِمُ'],
      [82, 'AL-‘AFUWW', 'The Pardoner', 'العَفُوُ'],
      [83, 'AR-RA’OOF', 'The Most Kind', 'الرَّؤُوفُ'],
      [84, 'MAALIK-UL-MULK', 'Master of the Kingdom, Owner of the Dominion', 'َمَالِكُ ٱلْمُلْكُ'],
      [85, 'DHUL-JALAALI WAL-IKRAAM', 'Lord of Glory and Honour, Lord of Majesty and Generosity', 'ذُوالْجَلاَلِ وَالإكْرَامِ'],
      [86, 'AL-MUQSIT', 'The Just One', 'الْمُقْسِطُ'],
      [87, 'AL-JAAMI’', 'The Gatherer, the Uniter', 'الْجَامِعُ'],
      [88, 'AL-GHANIYY', 'The Self-Sufficient, The Wealthy', 'ٱلْغَنيُّ'],
      [89, 'AL-MUGHNI', 'The Enricher', 'ٱلْمُغْنِيُّ'],
      [90, 'AL-MANI’', 'The Withholder', 'اَلْمَانِعُ'],
      [91, 'AD-DHARR', 'The Distresser', 'الضَّارَ'],
      [92, 'AN-NAFI’', 'The Propitious, the Benefactor', 'النَّافِعُ'],
      [93, 'AN-NUR', 'The Light, The Illuminator', 'النُّورُ'],
      [94, 'AL-HAADI', 'The Guide', 'الْهَادِي'],
      [95, 'AL-BADEE’', 'The Incomparable Originator', 'الْبَدِيعُ'],
      [96, 'AL-BAAQI', 'The Everlasting', 'اَلْبَاقِي'],
      [97, 'AL-WAARITH', 'The Inheritor, The Heir', 'الْوَارِثُ'],
      [98, 'AR-RASHEED', 'The Guide, Infallible Teacher', 'الرَّشِيدُ'],
      [99, 'AS-SABOOR', 'The Forbearing, The Patient', 'الصَّبُورُ']
    ];

    // "Ar-Rahmaan" from "AR-RAHMAAN" (easier to read than capitals)
    // ("AL-‘ALEEM" -> "Al-‘Aleem", "AL-MU’MIN" -> "Al-Mu’min")
    const nice = (s) => s.toLowerCase().replace(/(^|[\s-])([‘’]?)([a-z])/g, (m, a, q, c) => a + q + c.toUpperCase());
    // for searching: letters and digits only ("al-‘aleem" -> "alaleem")
    const plain = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

    $('nAllah').innerHTML = `<p class="n-allah-ar" lang="ar" dir="rtl">${esc(ALLAH[2])}</p><h2>${esc(ALLAH[0])}</h2>
      <p>The greatest name, followed by His 99 beautiful names (Al-Asma ul-Husna)</p>`;
    $('nList').innerHTML = NAMES.map(([n, name, en, ar]) => `<li data-find="${esc(n + ' ' + plain(name) + ' ' + plain(en) + ' ' + en.toLowerCase())}">
        <span class="n-num tnum" aria-label="Name ${n}">${n}</span>
        <span class="n-text"><b>${esc(nice(name))}</b><small>${esc(en)}</small></span>
        <span class="n-ar" lang="ar" dir="rtl">${esc(ar)}</span>
      </li>`).join('');

    /* ---- search ---- */
    const rows = [...document.querySelectorAll('#nList li')];
    $('nFind').addEventListener('input', () => {
      const q = $('nFind').value.trim().toLowerCase(), p = plain(q);
      let shown = 0;
      rows.forEach((li) => {
        const f = li.dataset.find;
        const hit = !q || (/^\d+$/.test(q) ? f.split(' ')[0] === q : f.includes(p) || f.includes(q));
        li.hidden = !hit;
        if (hit) shown++;
      });
      $('nAllah').hidden = !!q;
      $('nNone').hidden = shown > 0;
      $('nCount').textContent = q ? `${shown} of 99` : '';
    });
  });
})();
