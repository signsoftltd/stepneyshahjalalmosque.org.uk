/* Hefazothe Islam UK app: Daily duas. Each dua: Arabic, transliteration and translation; the Arabic text size can be
   changed (kept on the phone). */
(function () {
  'use strict';
  // runs each time this screen is shown; v ends its timers and listeners when it goes (nav.js)
  HIUK.view(function (v) {
    const { esc } = HIUK.util;
    const $ = (id) => document.getElementById(id);

    // { title, parts: [[Arabic, transliteration, translation], ...] }
    const DUAS = [
      { title: 'Dua before sleeping', parts: [['بِسْمِكَ اللَّهُمَّ  أَمُوتُ وَأَحْيَا', 'Bismika Allahumma amootu wa-ahyaa.', 'In Your name O Allah, I live and die.']] },
      { title: 'Dua after waking', parts: [['الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', 'Alhamdu lillaahil-lathee ahyaanaa ba’da maa amaatanaa wa ilayhin-nushoor.', 'All praise is for Allah, who gave us life after having taken it from us, and unto Him is the Resurrection.']] },
      { title: 'Dua before eating', parts: [['بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ', 'Bismillaahi wa’la barakatillah', 'In the name of Allah and with the blessings of Allah I begin (eating)".']] },
      { title: 'Dua on forgetting the Dua before eating', parts: [['بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ', 'Bismillaahi fee aw-walihi wa aakhirihi.', 'In the name of Allah, in its beginning and end.']] },
      { title: 'Dua on finishing eating', parts: [['الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْر حَوْلٍ مِنِّي وَﻻﹶ قُوَّةٍ', 'Alhamdu lillaahil-lathee at’amanee hathaa wa razaqa-neehi min ghayri hawlin minnee wa laa quwwatin.', 'All praise is for Allah, who fed me this, and provided it for me without any might or power from myself.']] },
      { title: 'Before entering the bathroom', parts: [['بِسْمِ اللَّه) اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَاﺋِﺚِ)', 'Bismillaahi. Allahumma innee a’uuthubika minal khubthi wal khabaa’ith.', '(In the name of Allah).O Allah, I seek refuge in You from all evil, and evil doers.']] },
      { title: 'After leaving the bathroom', parts: [['غُفْرَانَكَ', 'Ghufraanaka.', 'I ask You (Allah) for forgiveness.']] },
      { title: 'Entering the home', parts: [['بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا', 'Bismillaahi walajnaa, wa bismillaahi kharajnaa, wa a’laa rab-binaa tawak-kalnaa.', 'In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we place our trust.']] },
      { title: 'Leaving the home', parts: [['بِسْمِ اللَّهِ ، تَوَكَّلْتُ عَلَى اللَّهِ وَﻻﹶحَوْلَ وَﻻﹶقُوَّةَ إِﻻﱠ بِاللَّهِ', 'Bismillaahi tawakkaltu ‘a-lal-laahi walaa hawla walaa quwwata illaa billaah.', 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.']] },
      { title: 'Before performing wudhu', parts: [['بِسْمِ اللَّهِ', 'Bismillah', 'In the name of Allah.']] },
      { title: 'Upon completion of wudhu', parts: [['أَشْهَدُ أَنْ ﻻﹶ إِلَٰهَ إِﻻﱠ اللَّهُ وَحْدَهُ ﻻﹶشَريكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ', 'Ash-hadu an laa ilaaha illAllaahu wahdahu laa shareekalahu wa ash-hadu anna Muhammadan ‘abduhu wa rasooluhu.', 'I bear witness that none has the right to be worshipped except Allah, alone, without partner, and I bear witness that Muhammad is His slave and Messenger.']] },
      { title: 'Visiting the sick', parts: [['ﻻﹶبَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ', 'Laa ba’sa tahoorun inshaa’Allah.', 'Never mind, may it (the sickness) be a purification, if Allah wills.']] },
      { title: 'Upon breaking fast', parts: [['ذَهَبَ الظَّمَأُ ، وابْتَلَّتِ الْعُرُوقُ ، وَثَبَتَ اْﻷﹶجْرُ إِنْ شَاءَ اللَّهُ', 'Thaha badh-dhama\'u wabtallatil-\'urooqu, wa thabatal-ajru inshaa-Allaahu.', 'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.']] },
      { title: 'Morning Dua', parts: [['اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا ، وَبِكَ نَحْيَا وَبِكَ  نَمُوتُ، وَإِلَيْكَ النُّشُورُ', 'Allaahum-ma bika asbahnaa wa bika amsaynaa, wa bika nahyaa wa bika namootu, wa ilaykan-nushoor.', 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.']] },
      { title: 'Evening Dua', parts: [['اللَّهُمَّ بِكَ أَمْسَيْنَا ، وَبِكَ أَصْبَحْنَا ، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ ، وَإِلَيْكَ الْمَصِيرُ', 'Allaahum-ma bika amsaynaa, wa bika asbahnaa, wa bika nahyaa wa bika namootu, wa ilaykal maser.', 'O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.']] },
      { title: 'Dua after prayer', parts: [
        ['أَسْتَغْفِر اللَّهَ', 'Astaghfirullah.', 'I ask Allah for forgiveness (three times).'],
        ['اللَّهُمَّ أَنْتَ اﻟﺴﳲﻼﹶمُ وَمِنْكَ اﻟﺴﳲﻼﹶمُ تَبَارَكْتَ يَاذَا الْجَلَالِ وَاﻹﹺكْرَامِ', 'Allaahum-ma anta as-salaamu wa minka as-salaamu tabaarakta yaa thal jalaali wal-ikraam.', 'O Allah, You are As-Salaam (The One free from all defects and deficiencies) and from You is all peace, blessed are You, O Possessor of majesty and honour.']
      ] }
    ];

    $('dList').innerHTML = DUAS.map((d, i) => `<li class="d-card" id="dua-${i + 1}">
        <h2><span class="d-no tnum">${i + 1}</span>${esc(d.title)}</h2>
        ${d.parts.map(([ar, tr, en]) => `<div class="d-part">
          <p class="d-ar" lang="ar" dir="rtl">${esc(ar)}</p>
          <p class="d-tr">${esc(tr)}</p>
          <p class="d-en">${esc(en)}</p>
        </div>`).join('')}
      </li>`).join('');

    // jump to a dua
    $('dJump').innerHTML = DUAS.map((d, i) => `<a class="d-chip" href="#dua-${i + 1}">${esc(d.title.replace(/^Dua (before|after|on|upon) /i, (m, w) => w.charAt(0).toUpperCase() + w.slice(1) + ' '))}</a>`).join('');
    $('dJump').addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#dua-"]');
      if (!a) return;
      e.preventDefault();
      const el = document.querySelector(a.getAttribute('href'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // opened at one dua (e.g. duas.html#dua-13 from the Ramadhan timetable)
    const hash = HIUK.route.hash ? '#' + HIUK.route.hash : '';
    const opened = hash && document.querySelector(hash.replace(/[^#\w-]/g, ''));
    if (opened) requestAnimationFrame(() => opened.scrollIntoView({ block: 'start' }));

    /* ---- Arabic text size ---- */
    const SIZES = [22, 26, 30, 35, 40], KEY = 'hiuk_app_dua_size';
    let size = SIZES.indexOf(HIUK.store.get(KEY));
    if (size < 0) size = 1;
    function showSize() {
      document.documentElement.style.setProperty('--dua-ar', SIZES[size] + 'px');
      $('dSmaller').disabled = size === 0;
      $('dBigger').disabled = size === SIZES.length - 1;
    }
    $('dSmaller').addEventListener('click', () => { size = Math.max(0, size - 1); HIUK.store.set(KEY, SIZES[size]); showSize(); });
    $('dBigger').addEventListener('click', () => { size = Math.min(SIZES.length - 1, size + 1); HIUK.store.set(KEY, SIZES[size]); showSize(); });
    showSize();
  });
})();
