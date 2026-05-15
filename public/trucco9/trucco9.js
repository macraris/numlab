// Trucco del 9 — multilingue (IT/EN/FR), 2026 design
(() => {
  const TOTAL_STEPS = 10;
  let currentStep = 1;
  let playing = false;
  let timer = null;
  let speedMs = 3000;
  let LANG = 'it';

  const FINGER_CX = {
    1: 106, 2: 155, 3: 205, 4: 255, 5: 365,
    6: 635, 7: 745, 8: 795, 9: 845, 10: 894
  };

  // ============================================================
  // i18n DICTIONARY
  // ============================================================
  const I18N = {
    it: {
      title: 'Il trucco del 9',
      brand: 'Trucco del 9',
      help_title: 'Come funziona',
      tens: 'Decine',
      ones: 'Unità',
      rewind: 'Inizio',
      prev: 'Precedente',
      playpause: 'Play / Pausa',
      next: 'Successivo',
      end: 'Fine',
      help_h2: 'Come funziona il trucco',
      help_steps: [
        'Apri le due mani: hai <strong>10 dita</strong> numerate da 1 (mignolo sinistro) a 10 (mignolo destro).',
        'Per <strong>9 × n</strong>, piega il dito numero n.',
        'Le dita a <span class="hl-blue">sinistra</span> del dito piegato sono le <strong>decine</strong>.',
        'Le dita a <span class="hl-green">destra</span> sono le <strong>unità</strong>.',
      ],
      help_example: '<strong>Esempio</strong>: 9 × 3 → piego il 3° dito → 2 dita a sx (= 20) + 7 dita a dx (= 7) → <strong>27</strong>.',
      help_magic: '✨ <strong>Verifica magica</strong>: la somma delle cifre del risultato è sempre 9.',
      help_kbd: 'Tastiera: <kbd>Spazio</kbd> play · <kbd>←</kbd> <kbd>→</kbd> step · <kbd>Home</kbd> <kbd>End</kbd>',
      verify_label: 'Verifica magica',
      no_bent: 'nessun dito piegato',
      finger_short_names: ['', 'mignolo', 'anulare', 'medio', 'indice', 'pollice', 'pollice', 'indice', 'medio', 'anulare', 'mignolo'],
      finger_full_names: ['',
        'mignolo sinistro', 'anulare sinistro', 'medio sinistro', 'indice sinistro',
        'pollice sinistro', 'pollice destro',
        'indice destro', 'medio destro', 'anulare destro', 'mignolo destro'],
      bracket_all: 'tutte le 10 dita = 9 decine = 90',
      bracket_tens: (n) => `${n} ${n === 1 ? 'dito' : 'dita'} = ${n * 10}`,
      bracket_ones: (n) => `${n} ${n === 1 ? 'dito' : 'dita'} = ${n}`,
    },
    en: {
      title: 'The trick of 9',
      brand: 'Trick of 9',
      help_title: 'How it works',
      tens: 'Tens',
      ones: 'Ones',
      rewind: 'Start',
      prev: 'Previous',
      playpause: 'Play / Pause',
      next: 'Next',
      end: 'End',
      help_h2: 'How the trick works',
      help_steps: [
        'Open both hands: you have <strong>10 fingers</strong> numbered from 1 (left pinky) to 10 (right pinky).',
        'For <strong>9 × n</strong>, fold finger number n.',
        'The fingers to the <span class="hl-blue">left</span> of the folded one are the <strong>tens</strong>.',
        'The fingers to the <span class="hl-green">right</span> are the <strong>ones</strong>.',
      ],
      help_example: '<strong>Example</strong>: 9 × 3 → fold the 3rd finger → 2 fingers on the left (= 20) + 7 fingers on the right (= 7) → <strong>27</strong>.',
      help_magic: '✨ <strong>Magic check</strong>: the digits of the result always sum to 9.',
      help_kbd: 'Keyboard: <kbd>Space</kbd> play · <kbd>←</kbd> <kbd>→</kbd> step · <kbd>Home</kbd> <kbd>End</kbd>',
      verify_label: 'Magic check',
      no_bent: 'no finger folded',
      finger_short_names: ['', 'pinky', 'ring', 'middle', 'index', 'thumb', 'thumb', 'index', 'middle', 'ring', 'pinky'],
      finger_full_names: ['',
        'left pinky', 'left ring', 'left middle', 'left index',
        'left thumb', 'right thumb',
        'right index', 'right middle', 'right ring', 'right pinky'],
      bracket_all: 'all 10 fingers = 9 tens = 90',
      bracket_tens: (n) => `${n} ${n === 1 ? 'finger' : 'fingers'} = ${n * 10}`,
      bracket_ones: (n) => `${n} ${n === 1 ? 'finger' : 'fingers'} = ${n}`,
    },
    fr: {
      title: "L'astuce du 9",
      brand: 'Astuce du 9',
      help_title: 'Comment ça marche',
      tens: 'Dizaines',
      ones: 'Unités',
      rewind: 'Début',
      prev: 'Précédent',
      playpause: 'Lecture / Pause',
      next: 'Suivant',
      end: 'Fin',
      help_h2: "Comment fonctionne l'astuce",
      help_steps: [
        'Ouvre les deux mains : tu as <strong>10 doigts</strong> numérotés de 1 (auriculaire gauche) à 10 (auriculaire droit).',
        'Pour <strong>9 × n</strong>, plie le doigt numéro n.',
        'Les doigts à <span class="hl-blue">gauche</span> du doigt plié sont les <strong>dizaines</strong>.',
        'Les doigts à <span class="hl-green">droite</span> sont les <strong>unités</strong>.',
      ],
      help_example: '<strong>Exemple</strong> : 9 × 3 → je plie le 3e doigt → 2 doigts à gauche (= 20) + 7 doigts à droite (= 7) → <strong>27</strong>.',
      help_magic: '✨ <strong>Vérification magique</strong> : la somme des chiffres du résultat est toujours 9.',
      help_kbd: 'Clavier : <kbd>Espace</kbd> lecture · <kbd>←</kbd> <kbd>→</kbd> étape · <kbd>Début</kbd> <kbd>Fin</kbd>',
      verify_label: 'Vérification magique',
      no_bent: 'aucun doigt plié',
      finger_short_names: ['', 'auriculaire', 'annulaire', 'majeur', 'index', 'pouce', 'pouce', 'index', 'majeur', 'annulaire', 'auriculaire'],
      finger_full_names: ['',
        'auriculaire gauche', 'annulaire gauche', 'majeur gauche', 'index gauche',
        'pouce gauche', 'pouce droit',
        'index droit', 'majeur droit', 'annulaire droit', 'auriculaire droit'],
      bracket_all: 'les 10 doigts = 9 dizaines = 90',
      bracket_tens: (n) => `${n} ${n === 1 ? 'doigt' : 'doigts'} = ${n * 10}`,
      bracket_ones: (n) => `${n} ${n === 1 ? 'doigt' : 'doigts'} = ${n}`,
    },
  };

  function t() { return I18N[LANG] || I18N.it; }

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const stepLabel = $('#step-label');
  const speedInput = $('#speed');
  const speedLabel = $('#speed-label');
  const playBtn = $('#btn-playpause');
  const playSvg = $('#play-svg');
  const pauseSvg = $('#pause-svg');
  const bracketsLayer = $('#brackets');
  const eqLeft = document.querySelector('.eq-left');
  const eqResult = $('#eq-result');
  const eqMini = $('#equation-mini');
  const bdTens = $('#bd-tens');
  const bdOnes = $('#bd-ones');
  const checkEl = $('#check');
  const pillRow = $('#pill-row');
  const bentTag = $('#bent-tag');
  const bentTagText = $('#bent-tag-text');
  const helpBtn = $('#help-btn');
  const helpModal = $('#help-modal');
  const helpClose = $('#help-close');

  // ============================================================
  // Apply translations
  // ============================================================
  function applyI18n() {
    const d = t();
    document.title = d.title;
    document.documentElement.lang = LANG;

    $$('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (d[k]) el.textContent = d[k];
    });
    $$('[data-i18n-title]').forEach(el => {
      const k = el.getAttribute('data-i18n-title');
      if (d[k]) {
        el.setAttribute('title', d[k]);
        el.setAttribute('aria-label', d[k]);
      }
    });

    for (let i = 1; i <= 10; i++) {
      const el = document.querySelector(`.finger-name[data-for="${i}"]`);
      if (el) el.textContent = d.finger_short_names[i] || '';
    }

    const list = $('#help-list');
    if (list) list.innerHTML = d.help_steps.map(s => `<li>${s}</li>`).join('');
    $('#help-example').innerHTML = d.help_example;
    $('#help-magic').innerHTML = d.help_magic;
    $('#help-kbd').innerHTML = d.help_kbd;

    $$('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === LANG));

    setStep(currentStep);
  }

  function clearBrackets() { bracketsLayer.innerHTML = ''; }

  function makeBracket(x1, x2, y, color, label, side) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const capH = 14;
    const d = `M ${x1},${y - capH} L ${x1},${y} L ${x2},${y} L ${x2},${y - capH}`;
    path.setAttribute('d', d);
    path.setAttribute('class', 'bracket');
    path.setAttribute('stroke', color);
    bracketsLayer.appendChild(path);

    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('class', `bracket-label ${side}`);
    txt.setAttribute('x', (x1 + x2) / 2);
    txt.setAttribute('y', y + 36);
    txt.textContent = label;
    bracketsLayer.appendChild(txt);

    requestAnimationFrame(() => {
      path.classList.add('show');
      txt.classList.add('show');
    });
  }

  function updatePills() {
    $$('.pill').forEach((p) => {
      const n = +p.dataset.step;
      p.classList.toggle('active', n === currentStep);
      p.classList.toggle('done', n < currentStep);
    });
  }

  function setStep(n) {
    currentStep = n;
    stepLabel.textContent = n;
    updatePills();
    const d = t();

    for (let i = 1; i <= 10; i++) {
      document.getElementById(`finger-${i}`)?.classList.remove('bent');
      document.querySelector(`.finger-num[data-for="${i}"]`)?.classList.remove('bent');
      document.querySelector(`.finger-name[data-for="${i}"]`)?.classList.remove('bent');
    }
    if (n >= 1 && n <= 9) {
      document.getElementById(`finger-${n}`)?.classList.add('bent');
      document.querySelector(`.finger-num[data-for="${n}"]`)?.classList.add('bent');
      document.querySelector(`.finger-name[data-for="${n}"]`)?.classList.add('bent');
    }

    if (n === 10) {
      bentTag.classList.add('hidden');
      bentTag.querySelector('.bent-tag-icon').textContent = '✓';
      bentTagText.textContent = d.no_bent;
    } else {
      bentTag.classList.remove('hidden');
      bentTag.querySelector('.bent-tag-icon').textContent = '✕';
      bentTagText.textContent = d.finger_full_names[n];
    }

    clearBrackets();
    const BRACKET_Y = 635;

    let tens, ones, result;
    if (n === 10) {
      tens = 9; ones = 0; result = 90;
      const x1 = FINGER_CX[1] - 30;
      const x2 = FINGER_CX[10] + 30;
      makeBracket(x1, x2, BRACKET_Y, '#2563eb', d.bracket_all, 'left');
    } else {
      tens = n - 1;
      ones = 10 - n;
      result = tens * 10 + ones;
      if (tens > 0) {
        const x1 = FINGER_CX[1] - 30;
        const x2 = FINGER_CX[tens] + 30;
        makeBracket(x1, x2, BRACKET_Y, '#2563eb', d.bracket_tens(tens), 'left');
      }
      if (ones > 0) {
        const firstRight = n + 1;
        const x1 = FINGER_CX[firstRight] - 30;
        const x2 = FINGER_CX[10] + 30;
        makeBracket(x1, x2, BRACKET_Y, '#059669', d.bracket_ones(ones), 'right');
      }
    }

    eqLeft.textContent = `9 × ${n}`;
    eqResult.textContent = result;
    if (n === 1) eqMini.textContent = `0 + 9`;
    else if (n === 10) eqMini.textContent = `90 + 0`;
    else eqMini.textContent = `${tens * 10} + ${ones}`;

    bdTens.textContent = tens === 0 ? '0' : `${tens} → ${tens * 10}`;
    bdOnes.textContent = ones === 0 ? '0' : `${ones}`;

    const sumDigits = String(result).split('').reduce((a, b) => a + (+b), 0);
    checkEl.innerHTML = `✨ ${d.verify_label} · ${String(result).split('').join(' + ')} = <strong>${sumDigits}</strong>`;
  }

  function nextStep() { if (currentStep >= TOTAL_STEPS) { pause(); return; } setStep(currentStep + 1); }
  function prevStep() { if (currentStep > 1) setStep(currentStep - 1); }
  function play() {
    if (currentStep >= TOTAL_STEPS) setStep(1);
    playing = true;
    playSvg.style.display = 'none';
    pauseSvg.style.display = 'block';
    scheduleNext();
  }
  function pause() {
    playing = false;
    playSvg.style.display = 'block';
    pauseSvg.style.display = 'none';
    if (timer) { clearTimeout(timer); timer = null; }
  }
  function scheduleNext() {
    if (!playing) return;
    timer = setTimeout(() => {
      if (currentStep < TOTAL_STEPS) { setStep(currentStep + 1); scheduleNext(); }
      else pause();
    }, speedMs);
  }

  playBtn.addEventListener('click', () => playing ? pause() : play());
  $('#btn-next').addEventListener('click', () => { pause(); nextStep(); });
  $('#btn-prev').addEventListener('click', () => { pause(); prevStep(); });
  $('#btn-rewind').addEventListener('click', () => { pause(); setStep(1); });
  $('#btn-end').addEventListener('click', () => { pause(); setStep(TOTAL_STEPS); });
  pillRow.addEventListener('click', (e) => {
    const p = e.target.closest('.pill');
    if (!p) return;
    pause();
    setStep(+p.dataset.step);
  });
  speedInput.addEventListener('input', (e) => {
    speedMs = +e.target.value;
    speedLabel.textContent = (speedMs / 1000).toFixed(1) + ' s';
  });
  helpBtn.addEventListener('click', () => helpModal.classList.add('open'));
  helpClose.addEventListener('click', () => helpModal.classList.remove('open'));
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) helpModal.classList.remove('open');
  });
  $('#lang-switch').addEventListener('click', (e) => {
    const b = e.target.closest('.lang-btn');
    if (!b) return;
    LANG = b.dataset.lang;
    try { localStorage.setItem('lang', LANG); } catch(_) {}
    applyI18n();
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); }
    if (e.code === 'ArrowRight') { pause(); nextStep(); }
    if (e.code === 'ArrowLeft') { pause(); prevStep(); }
    if (e.code === 'Home') { pause(); setStep(1); }
    if (e.code === 'End') { pause(); setStep(TOTAL_STEPS); }
    if (e.code === 'Escape') helpModal.classList.remove('open');
  });

  // Init: lang from URL ?lang= or localStorage or 'it'
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const stored = (() => { try { return localStorage.getItem('lang'); } catch(_) { return null; } })();
  if (urlLang && I18N[urlLang]) LANG = urlLang;
  else if (stored && I18N[stored]) LANG = stored;
  else LANG = 'it';

  const startStep = Math.max(1, Math.min(10, parseInt(urlParams.get('step') || '1', 10)));
  speedLabel.textContent = (speedMs / 1000).toFixed(1) + ' s';
  applyI18n();
  setStep(startStep);
})();
