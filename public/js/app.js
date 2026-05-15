/* ====================================================================
   L'Isola di Pina — single-page app router.
   Hash-based routing, three-language i18n with localStorage persistence,
   markdown rendering, progress tracking, badge system. No build step.
   ==================================================================== */
'use strict';

const STORE_KEY = 'pina-progress-v1';
const LANG_KEY  = 'pina-lang-v1';

const App = {
  lang: 'it',
  i18n: null,
  manuale: null,
  appendice: null,
  tecniche: null,
  gallery: null,
  progress: loadProgress(),

  async init() {
    // 1) ?lang=xx URL override (useful for testing & shareable links).
    const urlLang = new URLSearchParams(location.search).get('lang');
    if (urlLang && ['it','en','fr'].includes(urlLang)) {
      this.lang = urlLang;
      localStorage.setItem(LANG_KEY, urlLang);
    } else {
      // 2) localStorage
      const stored = localStorage.getItem(LANG_KEY);
      if (stored && ['it','en','fr'].includes(stored)) this.lang = stored;
      else {
        // 3) document/browser default
        const docLang = (document.documentElement.lang || navigator.language || 'it').slice(0, 2);
        if (['it','en','fr'].includes(docLang)) this.lang = docLang;
      }
    }
    document.documentElement.lang = this.lang;

    // Preload UI translations + tecniche + gallery (small)
    await this.loadLang(this.lang);
    await Promise.all([
      this.loadTecniche(),
      this.loadGallery(),
    ]);

    this.renderShell();
    this.bindGlobalEvents();
    window.addEventListener('hashchange', () => this.route());

    // Cloud sync: if a code is linked, pull data and merge if cloud is newer
    if (window.Sync && window.Sync.isLinked()) {
      try {
        const cloud = await window.Sync.pullIfNewer();
        if (cloud && typeof cloud === 'object') {
          this.progress = {
            chapters:    Array.isArray(cloud.chapters)    ? cloud.chapters    : (this.progress.chapters || []),
            techniques:  Array.isArray(cloud.techniques)  ? cloud.techniques  : (this.progress.techniques || []),
            sections:    Array.isArray(cloud.sections)    ? cloud.sections    : (this.progress.sections || []),
            mathChapters:Array.isArray(cloud.mathChapters)? cloud.mathChapters: (this.progress.mathChapters || []),
          };
          localStorage.setItem(STORE_KEY, JSON.stringify(this.progress));
        }
      } catch {}
    }

    this.route();
  },

  async loadLang(lang) {
    const r = await fetch(`/i18n/${lang}.json`);
    this.i18n = await r.json();
    this.lang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
    // Pre-load manuale + appendice in the chosen language (cached after first)
    const [m, a, mm, am] = await Promise.all([
      fetch(`/data/manuale.${lang}.json`).then(r => r.json()),
      fetch(`/data/appendice.${lang}.json`).then(r => r.json()),
      fetch(`/data/manuale_math.${lang}.json`).then(r => r.json()),
      fetch(`/data/appendice_math.${lang}.json`).then(r => r.json()),
    ]);
    this.manuale = m;
    this.appendice = a;
    this.manualeMath = mm;
    this.appendiceMath = am;
  },

  async loadTecniche() {
    const r = await fetch('/data/tecniche.json');
    this.tecniche = await r.json();
  },
  async loadGallery() {
    const r = await fetch('/data/gallery.json');
    this.gallery = await r.json();
  },

  t(path) {
    return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : path), this.i18n);
  },

  /* --------------------------- Routing --------------------------- */
  route() {
    const hash = (location.hash || '#/').replace(/^#/, '') || '/';
    const parts = hash.split('/').filter(Boolean);
    const main = document.getElementById('main');
    main.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (parts.length === 0) return this.viewHome();
    if (parts[0] === 'math') {
      if (parts[1] === 'tecnica' && parts[2]) return this.viewTechnique(parts[2]);
      if (parts[1] === 'manuale') {
        if (parts[2] === 'cap' && parts[3]) return this.viewMathChapter(parseInt(parts[3], 10));
        return this.viewMathManuale();
      }
      if (parts[1] === 'appendice') {
        if (parts[2] === 'sezione' && parts[3]) return this.viewMathSection(parseInt(parts[3], 10));
        return this.viewMathAppendice();
      }
      return this.viewMath();
    }
    if (parts[0] === 'python') {
      if (parts[1] === 'cap' && parts[2]) return this.viewChapter(parseInt(parts[2], 10));
      return this.viewPython();
    }
    if (parts[0] === 'gallery') return this.viewGallery();
    if (parts[0] === 'exercises') {
      if (parts[1] === 'sezione' && parts[2]) return this.viewSection(parseInt(parts[2], 10));
      return this.viewExercises();
    }
    if (parts[0] === 'progress') return this.viewProgress();

    return this.viewHome();
  },

  /* --------------------------- Shell --------------------------- */
  renderShell() {
    const t = (k) => this.t(k);

    const shell = `
      <a href="#main" class="skip">${t('common.read')} →</a>
      <header class="topbar">
        <div class="container topbar-inner">
          <a class="brand" href="#/">
            <span class="brand-mark">🐢</span>
            <span class="brand-name">${t('site_title')}</span>
          </a>
          <button class="menu-toggle" id="menu-toggle" aria-label="Menu" aria-expanded="false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <nav>
            <ul class="navlist" id="navlist">
              <li><a href="#/" data-route="">${t('nav.home')}</a></li>
              <li><a href="#/math" data-route="math">${t('nav.math')}</a></li>
              <li><a href="#/python" data-route="python">${t('nav.python')}</a></li>
              <li><a href="#/gallery" data-route="gallery">${t('nav.gallery')}</a></li>
              <li><a href="#/exercises" data-route="exercises">${t('nav.exercises')}</a></li>
              <li><a href="#/progress" data-route="progress">${t('nav.progress')}</a></li>
            </ul>
          </nav>
          <button class="sync-btn" id="sync-btn" aria-label="${t('sync.title')}" title="${t('sync.title')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/></svg>
            <span class="sync-dot" id="sync-dot"></span>
          </button>
          <div class="lang-switcher" role="group" aria-label="${t('nav.language')}">
            ${['it','en','fr'].map(l => `<button data-lang="${l}" class="${this.lang === l ? 'active' : ''}">${l.toUpperCase()}</button>`).join('')}
          </div>
        </div>
      </header>
      <main id="main" tabindex="-1"></main>
      <footer class="footer">
        <div class="container">
          <div class="footer-inner">
            <div>${t('footer.made_with')}</div>
            <div>🐢 Pina · IT · EN · FR</div>
          </div>
          <div class="credits mt-2">${t('footer.open_source_note')} ${t('footer.credits_text')}</div>
        </div>
      </footer>
      <div class="sync-modal" id="sync-modal" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="sync-modal-card">
          <button class="sync-modal-close" id="sync-modal-close" aria-label="${t('common.close')}">×</button>
          <div class="sync-modal-icon">☁️</div>
          <h2>${t('sync.title')}</h2>
          <p class="sync-modal-intro">${t('sync.intro')}</p>

          <div class="sync-section sync-current" id="sync-current">
            <div class="sync-label">${t('sync.your_code')}</div>
            <div class="sync-code-row">
              <code class="sync-code" id="sync-code"></code>
              <button class="btn btn-ghost btn-sm" id="sync-copy">${t('sync.copy')}</button>
            </div>
            <p class="sync-help">${t('sync.help_share')}</p>
            <button class="btn btn-ghost btn-sm" id="sync-disconnect">${t('sync.disconnect')}</button>
          </div>

          <div class="sync-section sync-enable" id="sync-enable">
            <button class="btn btn-primary" id="sync-enable-btn">${t('sync.enable_btn')}</button>
            <p class="sync-help">${t('sync.enable_help')}</p>
          </div>

          <div class="sync-divider"><span>${t('sync.or')}</span></div>

          <div class="sync-section">
            <div class="sync-label">${t('sync.enter_code')}</div>
            <div class="sync-input-row">
              <input type="text" id="sync-input" placeholder="PINA-1234" autocapitalize="characters" autocorrect="off" spellcheck="false">
              <button class="btn btn-coral btn-sm" id="sync-apply">${t('sync.apply')}</button>
            </div>
            <p class="sync-help">${t('sync.enter_help')}</p>
            <p class="sync-error" id="sync-error" style="display:none;"></p>
          </div>
        </div>
      </div>
      <div class="lightbox" id="lightbox">
        <button class="lightbox-close" id="lightbox-close" aria-label="${t('common.close')}">×</button>
        <div>
          <img class="lightbox-img" id="lightbox-img" alt="">
          <div class="lightbox-caption" id="lightbox-caption"></div>
        </div>
      </div>
    `;
    document.getElementById('app').innerHTML = shell;
    // mark active nav
    this.updateActiveNav();
  },

  updateActiveNav() {
    const hash = (location.hash || '#/').replace(/^#/, '') || '/';
    const top = hash.split('/').filter(Boolean)[0] || '';
    document.querySelectorAll('#navlist a').forEach(a => {
      a.classList.toggle('active', a.dataset.route === top);
    });
  },

  bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      // Language buttons
      const langBtn = e.target.closest('.lang-switcher button[data-lang]');
      if (langBtn) {
        e.preventDefault();
        this.changeLang(langBtn.dataset.lang);
        return;
      }
      // Menu toggle
      if (e.target.closest('#menu-toggle')) {
        const list = document.getElementById('navlist');
        const exp = document.getElementById('menu-toggle');
        const open = list.classList.toggle('open');
        exp.setAttribute('aria-expanded', String(open));
        return;
      }
      // close mobile menu on nav click
      const navA = e.target.closest('#navlist a');
      if (navA) {
        document.getElementById('navlist').classList.remove('open');
      }
      // Gallery lightbox
      const lbItem = e.target.closest('[data-lightbox]');
      if (lbItem) {
        e.preventDefault();
        this.openLightbox(lbItem.dataset.lightbox, lbItem.dataset.caption || '');
        return;
      }
      const lbClose = e.target.closest('#lightbox-close, #lightbox');
      if (lbClose && (e.target.id === 'lightbox' || e.target.closest('#lightbox-close'))) {
        document.getElementById('lightbox').classList.remove('open');
      }
      // Sync modal
      if (e.target.closest('#sync-btn')) {
        e.preventDefault();
        this.openSyncModal();
        return;
      }
      const syncClose = e.target.closest('#sync-modal-close');
      if (syncClose) {
        document.getElementById('sync-modal').classList.remove('open');
        document.getElementById('sync-modal').setAttribute('aria-hidden','true');
      }
      if (e.target.id === 'sync-modal') {
        e.target.classList.remove('open');
        e.target.setAttribute('aria-hidden','true');
      }
      if (e.target.closest('#sync-enable-btn')) {
        e.preventDefault();
        if (!window.Sync) return;
        const code = window.Sync.ensureCode();
        // push current local progress so the new code starts populated
        window.Sync.pushNow(this.progress).catch(() => {});
        this.refreshSyncModal();
        this.refreshSyncDot();
      }
      if (e.target.closest('#sync-copy')) {
        e.preventDefault();
        const code = window.Sync && window.Sync.getCode();
        if (code) {
          navigator.clipboard?.writeText(code);
          const btn = document.getElementById('sync-copy');
          if (btn) { const old = btn.textContent; btn.textContent = '✓'; setTimeout(() => btn.textContent = old, 1200); }
        }
      }
      if (e.target.closest('#sync-disconnect')) {
        e.preventDefault();
        if (window.Sync) window.Sync.disconnect();
        this.refreshSyncModal();
        this.refreshSyncDot();
      }
      if (e.target.closest('#sync-apply')) {
        e.preventDefault();
        this.applySyncCode();
      }
    });
    window.addEventListener('hashchange', () => this.updateActiveNav());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('lightbox')?.classList.remove('open');
        document.getElementById('sync-modal')?.classList.remove('open');
        document.getElementById('navlist')?.classList.remove('open');
      }
      // submit code on Enter inside the input
      if (e.key === 'Enter' && e.target && e.target.id === 'sync-input') {
        e.preventDefault();
        this.applySyncCode();
      }
    });

    this.refreshSyncDot();
  },

  refreshSyncDot() {
    const dot = document.getElementById('sync-dot');
    if (!dot) return;
    dot.classList.toggle('linked', !!(window.Sync && window.Sync.isLinked()));
  },

  openSyncModal() {
    this.refreshSyncModal();
    const m = document.getElementById('sync-modal');
    m.classList.add('open');
    m.setAttribute('aria-hidden','false');
  },

  refreshSyncModal() {
    const linked = !!(window.Sync && window.Sync.isLinked());
    document.getElementById('sync-current').style.display = linked ? '' : 'none';
    document.getElementById('sync-enable').style.display  = linked ? 'none' : '';
    const codeEl = document.getElementById('sync-code');
    if (codeEl && linked) codeEl.textContent = window.Sync.getCode();
    const err = document.getElementById('sync-error');
    if (err) err.style.display = 'none';
  },

  async applySyncCode() {
    const t = (k) => this.t(k);
    const input = document.getElementById('sync-input');
    const err = document.getElementById('sync-error');
    const raw = (input.value || '').trim();
    if (!/^[A-Za-z0-9-]{3,20}$/.test(raw)) {
      err.textContent = t('sync.error_invalid');
      err.style.display = '';
      return;
    }
    try {
      const code = window.Sync.setCode(raw);
      const cloud = await window.Sync.pullIfNewer();
      if (cloud && typeof cloud === 'object') {
        this.progress = {
          chapters:    Array.isArray(cloud.chapters)    ? cloud.chapters    : (this.progress.chapters || []),
          techniques:  Array.isArray(cloud.techniques)  ? cloud.techniques  : (this.progress.techniques || []),
          sections:    Array.isArray(cloud.sections)    ? cloud.sections    : (this.progress.sections || []),
          mathChapters:Array.isArray(cloud.mathChapters)? cloud.mathChapters: (this.progress.mathChapters || []),
        };
        localStorage.setItem(STORE_KEY, JSON.stringify(this.progress));
      } else {
        // code is fresh or not newer — push local
        await window.Sync.pushNow(this.progress);
      }
      input.value = '';
      this.refreshSyncModal();
      this.refreshSyncDot();
      // Close modal and re-render current view
      document.getElementById('sync-modal').classList.remove('open');
      this.route();
    } catch (e) {
      err.textContent = t('sync.error_invalid');
      err.style.display = '';
    }
  },

  async changeLang(lang) {
    if (lang === this.lang) return;
    await this.loadLang(lang);
    this.renderShell();
    this.bindGlobalEvents();
    this.route();
  },

  openLightbox(src, caption) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-img').alt = caption;
    document.getElementById('lightbox-caption').textContent = caption;
    lb.classList.add('open');
  },

  /* --------------------------- Views --------------------------- */
  viewHome() {
    const t = (k) => this.t(k);
    const totalChapters = this.manuale.parts.reduce((s, p) => s + p.chapters.length, 0);
    const totalTechniques = this.tecniche.techniques.length;
    const totalChallenges = 50;
    const totalExamples = this.gallery.items.length;

    const html = `
      <section class="hero">
        <div class="container">
          <div class="hero-card">
            <div>
              <span class="eyebrow">🐢 ${t('site_tagline')}</span>
              <h1 class="hero-title">${t('home.hero_title').replace(/(Pina)/, '<em>$1</em>')}</h1>
              <p class="hero-subtitle">${t('home.hero_subtitle')}</p>
              <div class="hero-ctas">
                <a class="btn btn-coral" href="#/math">${t('home.hero_cta_math')}</a>
                <a class="btn btn-mint"  href="#/python">${t('home.hero_cta_python')}</a>
              </div>
            </div>
            <div class="hero-art">
              ${turtleSVG()}
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <div>
              <span class="eyebrow">${t('home.paths_title')}</span>
              <h2 class="section-title">${t('home.paths_title')}</h2>
            </div>
          </div>
          <div class="card-grid-2">
            <a class="card path-card coral" href="#/math">
              <span class="card-emoji">🧮</span>
              <h3 class="card-title">${t('home.path_math_title')}</h3>
              <p class="card-desc">${t('home.path_math_desc')}</p>
            </a>
            <a class="card path-card mint" href="#/python">
              <span class="card-emoji">🐢</span>
              <h3 class="card-title">${t('home.path_python_title')}</h3>
              <p class="card-desc">${t('home.path_python_desc')}</p>
            </a>
            <a class="card path-card sun" href="#/gallery">
              <span class="card-emoji">🎨</span>
              <h3 class="card-title">${t('home.path_gallery_title')}</h3>
              <p class="card-desc">${t('home.path_gallery_desc')}</p>
            </a>
            <a class="card path-card sky" href="#/exercises">
              <span class="card-emoji">🎯</span>
              <h3 class="card-title">${t('home.path_exercises_title')}</h3>
              <p class="card-desc">${t('home.path_exercises_desc')}</p>
            </a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <h2 class="section-title">${t('home.stats_title')}</h2>
          </div>
          <div class="card-grid-4">
            <div class="stat-tile"><p class="stat-value">${totalChapters}</p><div class="stat-label">${t('home.stat_chapters')}</div></div>
            <div class="stat-tile"><p class="stat-value">${totalTechniques}</p><div class="stat-label">${t('home.stat_techniques')}</div></div>
            <div class="stat-tile"><p class="stat-value">${totalChallenges}+</p><div class="stat-label">${t('home.stat_challenges')}</div></div>
            <div class="stat-tile"><p class="stat-value">${totalExamples}</p><div class="stat-label">${t('home.stat_examples')}</div></div>
          </div>
          <p class="muted mt-2" style="text-align:center; font-size:13px;">${t('home.kid_safe')}</p>
        </div>
      </section>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${this.t('site_title')} — ${this.t('site_tagline')}`;
  },

  viewMath() {
    const t = (k) => this.t(k);
    const techs = this.tecniche.techniques;
    const html = `
      <section class="hero" style="padding:36px 0 16px;">
        <div class="container">
          <span class="eyebrow">🧮 ${t('math.title')}</span>
          <h1 class="hero-title" style="font-size:clamp(26px,4vw,38px); margin-bottom:8px;">${t('math.title')}</h1>
          <p class="hero-subtitle">${t('math.subtitle')}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="trucco9-card">
            <div>
              <h2>${t('math.manuale_card_title')}</h2>
              <p>${t('math.manuale_card_desc')}</p>
              <a class="btn btn-primary" href="#/math/manuale">${t('math.manuale_card_cta')} →</a>
              <a class="btn btn-ghost" href="#/math/appendice" style="margin-left:8px;">${t('math.appendice_card_cta')} →</a>
            </div>
            <img src="/assets/tecniche/05_pitagorica_colorata.png" alt="Tavola pitagorica colorata" loading="lazy">
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="trucco9-card">
            <div>
              <h2>${t('math.trucco9_card_title')}</h2>
              <p>${t('math.trucco9_card_desc')}</p>
              <a class="btn btn-coral" href="/trucco9/?lang=${this.lang}" target="_blank" rel="noopener">${t('math.trucco9_card_cta')} →</a>
            </div>
            <img src="/trucco9/trucco9.gif" alt="Anteprima trucco del 9" loading="lazy">
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <h2 class="section-title">${t('math.techniques_title')}</h2>
          </div>
          <div class="card-grid">
            ${techs.map(tk => {
              const data = tk[this.lang] || tk.it;
              const visited = this.progress.techniques.includes(tk.id);
              return `
                <a class="card tech-card" href="#/math/tecnica/${tk.slug}">
                  <img class="card-thumb" src="/assets/tecniche/${tk.img}" alt="${esc(data.title)}" loading="lazy">
                  <span class="card-emoji">${tk.emoji || '✨'}</span>
                  <h3 class="card-title">${esc(data.title)}${visited ? ' ⭐' : ''}</h3>
                  <p class="card-desc">${esc(data.summary)}</p>
                </a>`;
            }).join('')}
          </div>
        </div>
      </section>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${this.t('math.title')} — ${this.t('site_title')}`;
  },

  viewTechnique(slug) {
    const t = (k) => this.t(k);
    const tech = this.tecniche.techniques.find(x => x.slug === slug);
    if (!tech) return this.viewMath();
    this.markTechnique(tech.id);
    const data = tech[this.lang] || tech.it;
    const html = `
      <div class="container">
        <nav class="breadcrumb"><a href="#/math">${t('math.title')}</a> · ${esc(data.title)}</nav>
        <article class="technique-hero">
          <img src="/assets/tecniche/${tech.img}" alt="${esc(data.title)}" data-lightbox="/assets/tecniche/${tech.img}" data-caption="${esc(data.title)}">
          <div>
            <span class="eyebrow">${tech.emoji || '✨'} ${(tech.tags || []).join(' · ')}</span>
            <h1>${esc(data.title)}</h1>
            <p class="summary">${esc(data.summary)}</p>
            ${tech.interactive_link ? `<p class="mt-2"><a class="btn btn-coral" href="${tech.interactive_link}?lang=${this.lang}" target="_blank" rel="noopener">${t('math.trucco9_card_cta')} →</a></p>` : ''}
          </div>
        </article>
        <article class="technique-body">${data.body}</article>
        <div class="chap-nav mt-2">
          <a class="btn btn-ghost" href="#/math">← ${t('math.back_to_math')}</a>
        </div>
      </div>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${data.title} — ${this.t('site_title')}`;
  },

  viewPython() {
    const t = (k) => this.t(k);
    const parts = this.manuale.parts;
    const partsHTML = parts.map(p => {
      const chapsHTML = p.chapters.map(ch => {
        const done = this.progress.chapters.includes(ch.number);
        return `
          <li>
            <a class="chapter-link ${done ? 'done' : ''}" href="#/python/cap/${ch.number}">
              <span class="chapter-num">${ch.number}</span>
              <span class="chapter-title">${esc(ch.title)}</span>
            </a>
          </li>`;
      }).join('');
      return `
        <section class="part-block">
          <header class="part-head">
            <span class="part-roman">${p.roman}</span>
            <div>
              <h3 class="part-title">${esc(p.title)}</h3>
              ${p.intro ? `<p class="part-intro">${esc(stripBlock(p.intro))}</p>` : ''}
            </div>
          </header>
          <ul class="chapter-list">${chapsHTML}</ul>
        </section>`;
    }).join('');
    const html = `
      <section class="hero" style="padding:36px 0 16px;">
        <div class="container">
          <span class="eyebrow">🐢 ${t('python.title')}</span>
          <h1 class="hero-title" style="font-size:clamp(26px,4vw,38px); margin-bottom:8px;">${t('python.title')}</h1>
          <p class="hero-subtitle">${t('python.subtitle')}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="parts-list">${partsHTML}</div>
        </div>
      </section>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${this.t('python.title')} — ${this.t('site_title')}`;
  },

  /* ====================== MATH MANUALE views ====================== */
  viewMathManuale() {
    const t = (k) => this.t(k);
    const parts = this.manualeMath.parts;
    const partsHTML = parts.map(p => {
      const chapsHTML = p.chapters.map(ch => {
        const done = (this.progress.mathChapters || []).includes(ch.number);
        return `
          <li>
            <a class="chapter-link ${done ? 'done' : ''}" href="#/math/manuale/cap/${ch.number}">
              <span class="chapter-num">${ch.number}</span>
              <span class="chapter-title">${esc(ch.title)}</span>
            </a>
          </li>`;
      }).join('');
      return `
        <section class="part-block">
          <header class="part-head">
            <span class="part-roman">${p.roman}</span>
            <div>
              <h3 class="part-title">${esc(p.title)}</h3>
              ${p.intro ? `<p class="part-intro">${esc(stripBlock(p.intro))}</p>` : ''}
            </div>
          </header>
          <ul class="chapter-list">${chapsHTML}</ul>
        </section>`;
    }).join('');
    const html = `
      <section class="hero" style="padding:36px 0 16px;">
        <div class="container">
          <span class="eyebrow">🧮 ${t('math_manuale.title')}</span>
          <h1 class="hero-title" style="font-size:clamp(26px,4vw,38px); margin-bottom:8px;">${t('math_manuale.title')}</h1>
          <p class="hero-subtitle">${t('math_manuale.subtitle')}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <nav class="breadcrumb"><a href="#/math">${t('math.title')}</a> · ${t('math_manuale.breadcrumb')}</nav>
          <div class="parts-list">${partsHTML}</div>
        </div>
      </section>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${t('math_manuale.title')} — ${this.t('site_title')}`;
  },

  viewMathChapter(num) {
    const t = (k) => this.t(k);
    let chapter = null, partOf = null, flat = [];
    for (const p of this.manualeMath.parts) {
      for (const c of p.chapters) {
        flat.push({ chapter: c, part: p });
        if (c.number === num) { chapter = c; partOf = p; }
      }
    }
    if (!chapter) return this.viewMathManuale();

    const idx = flat.findIndex(x => x.chapter.number === num);
    const prev = idx > 0 ? flat[idx - 1] : null;
    const next = idx < flat.length - 1 ? flat[idx + 1] : null;
    if (!this.progress.mathChapters) this.progress.mathChapters = [];
    const done = this.progress.mathChapters.includes(num);
    const isTranslated = this.lang !== 'it';

    const bodyHTML = window.renderMarkdown(chapter.content || '');

    const html = `
      <div class="container">
        <nav class="breadcrumb">
          <a href="#/math">${t('math.title')}</a> ·
          <a href="#/math/manuale">${t('math_manuale.title')}</a> ·
          ${t('python.part_label')} ${partOf.roman}: ${esc(partOf.title)} ·
          ${t('python.chapter_label')} ${chapter.number}
        </nav>
        <header class="chapter-hero">
          <div class="chapter-meta">
            <span class="badge">${t('python.part_label')} ${partOf.roman}</span>
            <span class="badge">${t('python.chapter_label')} ${chapter.number}</span>
          </div>
          <h1>${esc(chapter.title)}</h1>
          ${chapter.summary ? `<p class="chapter-summary">${esc(chapter.summary)}</p>` : ''}
          <div class="mark-row">
            <button class="btn ${done ? 'btn-mint' : 'btn-sun'}" id="mark-done" data-cap="${chapter.number}">
              ${done ? '⭐ ' + t('python.marked_done') : t('python.mark_done')}
            </button>
          </div>
        </header>
        ${isTranslated ? `<div class="translation-banner">💡 ${t('python.translation_note')}</div>` : ''}
        <article class="chapter-body">${bodyHTML}</article>
        <nav class="chap-nav">
          <a class="btn btn-ghost ${prev ? '' : 'disabled'}" ${prev ? `href="#/math/manuale/cap/${prev.chapter.number}"` : ''}>${t('python.previous')}</a>
          <a class="btn btn-ghost" href="#/math/manuale">${t('python.back_to_index')}</a>
          <a class="btn btn-primary ${next ? '' : 'disabled'}" ${next ? `href="#/math/manuale/cap/${next.chapter.number}"` : ''}>${t('python.next')}</a>
        </nav>
      </div>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${chapter.title} — ${this.t('site_title')}`;

    document.querySelectorAll('.chapter-body img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => this.openLightbox(img.src, img.alt));
    });

    document.getElementById('mark-done').addEventListener('click', () => {
      const arr = this.progress.mathChapters || (this.progress.mathChapters = []);
      const i = arr.indexOf(num);
      if (i >= 0) arr.splice(i, 1); else arr.push(num);
      saveProgress(this.progress);
      this.viewMathChapter(num);
    });
  },

  viewMathAppendice() {
    const t = (k) => this.t(k);
    const sections = this.appendiceMath.sections;
    const html = `
      <section class="hero" style="padding:36px 0 16px;">
        <div class="container">
          <span class="eyebrow">🧮 ${t('math_appendice.title')}</span>
          <h1 class="hero-title" style="font-size:clamp(26px,4vw,38px); margin-bottom:8px;">${t('math_appendice.title')}</h1>
          <p class="hero-subtitle">${t('math_appendice.subtitle')}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <nav class="breadcrumb"><a href="#/math">${t('math.title')}</a> · ${t('math_appendice.breadcrumb')}</nav>
          <div class="card-grid">
            ${sections.map(s => `
              <a class="card" href="#/math/appendice/sezione/${s.number}">
                <span class="card-emoji">📘</span>
                <h3 class="card-title">${s.letter ? '<small>' + esc(s.letter) + '</small> ' : ''}${esc(s.title)}</h3>
              </a>`).join('')}
          </div>
        </div>
      </section>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${t('math_appendice.title')} — ${this.t('site_title')}`;
  },

  viewMathSection(num) {
    const t = (k) => this.t(k);
    const sections = this.appendiceMath.sections;
    const section = sections.find(s => s.number === num);
    if (!section) return this.viewMathAppendice();
    const idx = sections.findIndex(s => s.number === num);
    const prev = idx > 0 ? sections[idx - 1] : null;
    const next = idx < sections.length - 1 ? sections[idx + 1] : null;
    const isTranslated = this.lang !== 'it';
    const bodyHTML = window.renderMarkdown(section.content || '');
    const html = `
      <div class="container">
        <nav class="breadcrumb">
          <a href="#/math">${t('math.title')}</a> ·
          <a href="#/math/appendice">${t('math_appendice.title')}</a> ·
          ${section.letter ? section.letter + ' · ' : ''}${esc(section.title)}
        </nav>
        <header class="chapter-hero">
          <h1>${section.letter ? '<small>' + esc(section.letter) + '</small> ' : ''}${esc(section.title)}</h1>
        </header>
        ${isTranslated ? `<div class="translation-banner">💡 ${t('python.translation_note')}</div>` : ''}
        <article class="chapter-body">${bodyHTML}</article>
        <nav class="chap-nav">
          <a class="btn btn-ghost ${prev ? '' : 'disabled'}" ${prev ? `href="#/math/appendice/sezione/${prev.number}"` : ''}>${t('python.previous')}</a>
          <a class="btn btn-ghost" href="#/math/appendice">${t('python.back_to_index')}</a>
          <a class="btn btn-primary ${next ? '' : 'disabled'}" ${next ? `href="#/math/appendice/sezione/${next.number}"` : ''}>${t('python.next')}</a>
        </nav>
      </div>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${section.title} — ${this.t('site_title')}`;
    document.querySelectorAll('.chapter-body img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => this.openLightbox(img.src, img.alt));
    });
  },

  viewChapter(num) {
    const t = (k) => this.t(k);
    let chapter = null, partOf = null, flat = [];
    for (const p of this.manuale.parts) {
      for (const c of p.chapters) {
        flat.push({ chapter: c, part: p });
        if (c.number === num) { chapter = c; partOf = p; }
      }
    }
    if (!chapter) return this.viewPython();

    const idx = flat.findIndex(x => x.chapter.number === num);
    const prev = idx > 0 ? flat[idx - 1] : null;
    const next = idx < flat.length - 1 ? flat[idx + 1] : null;
    const done = this.progress.chapters.includes(num);
    const isTranslated = this.lang !== 'it';

    // Render chapter body (markdown -> HTML)
    const bodyHTML = window.renderMarkdown(chapter.content || '');

    const html = `
      <div class="container">
        <nav class="breadcrumb">
          <a href="#/python">${t('python.title')}</a> ·
          ${t('python.part_label')} ${partOf.roman}: ${esc(partOf.title)} ·
          ${t('python.chapter_label')} ${chapter.number}
        </nav>
        <header class="chapter-hero">
          <div class="chapter-meta">
            <span class="badge">${t('python.part_label')} ${partOf.roman}</span>
            <span class="badge">${t('python.chapter_label')} ${chapter.number}</span>
            <span>${t('python.estimated_time')}</span>
          </div>
          <h1>${esc(chapter.title)}</h1>
          ${chapter.summary ? `<p class="chapter-summary">${esc(chapter.summary)}</p>` : ''}
          <div class="mark-row">
            <button class="btn ${done ? 'btn-mint' : 'btn-sun'}" id="mark-done" data-cap="${chapter.number}">
              ${done ? '⭐ ' + t('python.marked_done') : t('python.mark_done')}
            </button>
          </div>
        </header>
        ${isTranslated ? `<div class="translation-banner">💡 ${t('python.translation_note')}</div>` : ''}
        <article class="chapter-body">${bodyHTML}</article>
        <nav class="chap-nav">
          <a class="btn btn-ghost ${prev ? '' : 'disabled'}" ${prev ? `href="#/python/cap/${prev.chapter.number}"` : ''}>${t('python.previous')}</a>
          <a class="btn btn-ghost" href="#/python">${t('python.back_to_index')}</a>
          <a class="btn btn-primary ${next ? '' : 'disabled'}" ${next ? `href="#/python/cap/${next.chapter.number}"` : ''}>${t('python.next')}</a>
        </nav>
      </div>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${chapter.title} — ${this.t('site_title')}`;

    // Enable click-to-zoom on chapter images
    document.querySelectorAll('.chapter-body img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => this.openLightbox(img.src, img.alt));
    });

    document.getElementById('mark-done').addEventListener('click', () => {
      this.toggleChapter(num);
      this.viewChapter(num); // re-render to refresh state
    });
  },

  viewGallery() {
    const t = (k) => this.t(k);
    const items = this.gallery.items;
    const html = `
      <section class="hero" style="padding:36px 0 16px;">
        <div class="container">
          <span class="eyebrow">🎨 ${t('gallery.title')}</span>
          <h1 class="hero-title" style="font-size:clamp(26px,4vw,38px); margin-bottom:8px;">${t('gallery.title')}</h1>
          <p class="hero-subtitle">${t('gallery.subtitle')}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="gallery-grid">
            ${items.map(it => `
              <a class="gallery-item" href="#/python/cap/${it.chapter}">
                <img src="/assets/turtle/${it.file}"
                     alt="${esc(it[this.lang] || it.it)}"
                     loading="lazy"
                     data-lightbox="/assets/turtle/${it.file}"
                     data-caption="${esc(it[this.lang] || it.it)}">
                <div class="gallery-caption">${esc(it[this.lang] || it.it)}</div>
                <div class="gallery-chapter">${t('gallery.from_chapter')} ${it.chapter}</div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${this.t('gallery.title')} — ${this.t('site_title')}`;
  },

  viewExercises() {
    const t = (k) => this.t(k);
    const secs = this.appendice.sections;
    const html = `
      <section class="hero" style="padding:36px 0 16px;">
        <div class="container">
          <span class="eyebrow">🎯 ${t('exercises.title')}</span>
          <h1 class="hero-title" style="font-size:clamp(26px,4vw,38px); margin-bottom:8px;">${t('exercises.title')}</h1>
          <p class="hero-subtitle">${t('exercises.subtitle')}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="card-grid">
            ${secs.map(s => `
              <a class="card" href="#/exercises/sezione/${s.number}">
                <span class="card-emoji">${sectionEmoji(s.number)}</span>
                <h3 class="card-title">${esc(s.title)}</h3>
                <p class="card-desc">${t('exercises.open_section')} →</p>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${this.t('exercises.title')} — ${this.t('site_title')}`;
  },

  viewSection(num) {
    const t = (k) => this.t(k);
    const sec = this.appendice.sections.find(s => s.number === num);
    if (!sec) return this.viewExercises();
    this.markSection(num);
    const bodyHTML = window.renderMarkdown(sec.content || '');
    const html = `
      <div class="container">
        <nav class="breadcrumb"><a href="#/exercises">${t('exercises.title')}</a> · ${esc(sec.title)}</nav>
        <header class="chapter-hero">
          <div class="chapter-meta">
            <span class="badge">Sezione ${sec.number}</span>
          </div>
          <h1>${esc(sec.title)}</h1>
        </header>
        ${this.lang !== 'it' ? `<div class="translation-banner">💡 ${t('python.translation_note')}</div>` : ''}
        <article class="exercise-body chapter-body">${bodyHTML}</article>
        <div class="chap-nav mt-2">
          <a class="btn btn-ghost" href="#/exercises">← ${t('exercises.back_to_index')}</a>
        </div>
      </div>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${sec.title} — ${this.t('site_title')}`;

    document.querySelectorAll('.exercise-body img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => this.openLightbox(img.src, img.alt));
    });
  },

  viewProgress() {
    const t = (k) => this.t(k);
    const p = this.progress;
    const totalChapters = this.manuale.parts.reduce((s, x) => s + x.chapters.length, 0);
    const totalTechniques = this.tecniche.techniques.length;
    const totalSections = this.appendice.sections.length;

    const badges = this.computeBadges();
    const html = `
      <section class="hero" style="padding:36px 0 16px;">
        <div class="container">
          <span class="eyebrow">⭐ ${t('progress.title')}</span>
          <h1 class="hero-title" style="font-size:clamp(26px,4vw,38px); margin-bottom:8px;">${t('progress.title')}</h1>
          <p class="hero-subtitle">${t('progress.subtitle')}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="progress-summary">
            <div class="stat-tile">
              <p class="stat-value">${p.chapters.length} / ${totalChapters}</p>
              <div class="stat-label">${t('progress.chapters_read')}</div>
            </div>
            <div class="stat-tile">
              <p class="stat-value">${p.techniques.length} / ${totalTechniques}</p>
              <div class="stat-label">${t('progress.techniques_visited')}</div>
            </div>
            <div class="stat-tile">
              <p class="stat-value">${p.sections.length} / ${totalSections}</p>
              <div class="stat-label">${t('progress.exercises_visited')}</div>
            </div>
            <div class="stat-tile">
              <p class="stat-value">${badges.filter(b => b.earned).length} / ${badges.length}</p>
              <div class="stat-label">${t('progress.badges')}</div>
            </div>
          </div>

          <h2 class="section-title">${t('progress.badges')}</h2>
          <div class="badge-grid">
            ${badges.map(b => `
              <div class="badge-card ${b.earned ? 'earned' : ''}">
                <div class="badge-icon">${b.icon}</div>
                <div>
                  <p class="badge-name">${b.earned ? '' : '🔒 '}${b.name}</p>
                  <p class="badge-desc">${b.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>

          ${p.chapters.length + p.techniques.length + p.sections.length === 0
            ? `<p class="muted mt-2" style="text-align:center;">${t('progress.empty_state')}</p>`
            : ''}

          <div class="mark-row" style="margin-top:30px;">
            <button class="btn btn-ghost" id="reset-progress">${t('progress.reset_progress')}</button>
          </div>
        </div>
      </section>
    `;
    document.getElementById('main').innerHTML = html;
    document.title = `${this.t('progress.title')} — ${this.t('site_title')}`;

    document.getElementById('reset-progress').addEventListener('click', () => {
      if (confirm(t('progress.reset_confirm'))) {
        this.progress = { chapters: [], techniques: [], sections: [] };
        saveProgress(this.progress);
        this.viewProgress();
      }
    });
  },

  /* --------------------------- Progress mutations --------------------------- */
  toggleChapter(num) {
    const arr = this.progress.chapters;
    const i = arr.indexOf(num);
    if (i >= 0) arr.splice(i, 1); else arr.push(num);
    saveProgress(this.progress);
  },
  markTechnique(id) {
    if (!this.progress.techniques.includes(id)) {
      this.progress.techniques.push(id);
      saveProgress(this.progress);
    }
  },
  markSection(n) {
    if (!this.progress.sections.includes(n)) {
      this.progress.sections.push(n);
      saveProgress(this.progress);
    }
  },

  computeBadges() {
    const p = this.progress;
    const t = (k) => this.t(k);
    const totalChapters = this.manuale.parts.reduce((s, x) => s + x.chapters.length, 0);
    const totalTechniques = this.tecniche.techniques.length;
    const anyPartDone = this.manuale.parts.some(pt => pt.chapters.every(c => p.chapters.includes(c.number)));
    const trucco9 = ['trucco9_intro','trucco9_gallery','trucco9_tabella'].some(id => p.techniques.includes(id));

    return [
      { icon: '📖', name: t('progress.badge_first_chapter'),  desc: t('progress.badge_first_chapter_desc'),  earned: p.chapters.length >= 1 },
      { icon: '🌿', name: t('progress.badge_five_chapters'),  desc: t('progress.badge_five_chapters_desc'),  earned: p.chapters.length >= 5 },
      { icon: '🏅', name: t('progress.badge_part_complete'),  desc: t('progress.badge_part_complete_desc'),  earned: anyPartDone },
      { icon: '🧮', name: t('progress.badge_all_techniques'), desc: t('progress.badge_all_techniques_desc'), earned: p.techniques.length >= totalTechniques },
      { icon: '✋', name: t('progress.badge_trucco9'),         desc: t('progress.badge_trucco9_desc'),         earned: trucco9 },
      { icon: '👑', name: t('progress.badge_python_complete'),desc: t('progress.badge_python_complete_desc'),earned: p.chapters.length >= totalChapters },
    ];
  },
};

/* ============================ Helpers ============================ */
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { chapters: [], techniques: [], sections: [] };
    const obj = JSON.parse(raw);
    return {
      chapters: Array.isArray(obj.chapters) ? obj.chapters : [],
      techniques: Array.isArray(obj.techniques) ? obj.techniques : [],
      sections: Array.isArray(obj.sections) ? obj.sections : [],
    };
  } catch {
    return { chapters: [], techniques: [], sections: [] };
  }
}
function saveProgress(p) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch {}
  if (window.Sync && window.Sync.isLinked()) {
    window.Sync.schedulePush(() => p);
  }
}
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
function stripBlock(s) { return s.replace(/^>\s?/gm, '').replace(/\*([^*]+)\*/g, '$1'); }
function sectionEmoji(n) {
  return ['📖','⭐','💡','🐛','🖨️','📊','📕','🌍','👨‍👩‍👧','🗺️','🌐','🎨','📚','🗺️','💬'][n] || '✨';
}
function turtleSVG() {
  return `
    <svg class="turtle-svg" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="shellG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2ec4a3"/>
          <stop offset="1" stop-color="#1f9a80"/>
        </linearGradient>
        <radialGradient id="shellSpot" cx=".4" cy=".35" r=".7">
          <stop offset="0" stop-color="#9defd8"/>
          <stop offset="1" stop-color="#1f9a80" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Brushed-paper background dot -->
      <circle cx="160" cy="120" r="100" fill="#fff7eb" opacity=".7"/>

      <!-- Legs -->
      <ellipse cx="80" cy="180" rx="22" ry="14" fill="#1f9a80"/>
      <ellipse cx="240" cy="180" rx="22" ry="14" fill="#1f9a80"/>
      <ellipse cx="90" cy="95" rx="20" ry="12" fill="#1f9a80"/>
      <ellipse cx="230" cy="95" rx="20" ry="12" fill="#1f9a80"/>

      <!-- Tail -->
      <path d="M 260 140 Q 285 145 280 165 Q 270 158 258 152 Z" fill="#1f9a80"/>

      <!-- Shell -->
      <ellipse cx="160" cy="140" rx="100" ry="68" fill="url(#shellG)" stroke="#1a7a64" stroke-width="3"/>
      <ellipse cx="148" cy="124" rx="60" ry="38" fill="url(#shellSpot)"/>

      <!-- Shell pattern: cartesian grid -->
      <g stroke="#1a7a64" stroke-width="2" fill="none" opacity=".5">
        <line x1="80"  y1="140" x2="240" y2="140"/>
        <line x1="160" y1="80"  x2="160" y2="200"/>
        <circle cx="160" cy="140" r="36"/>
      </g>
      <text x="160" y="145" font-family="JetBrains Mono, monospace" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">(x,y)</text>

      <!-- Head -->
      <circle cx="50" cy="135" r="34" fill="#2ec4a3" stroke="#1a7a64" stroke-width="3"/>
      <!-- Hat -->
      <path d="M 22 116 Q 50 86 80 116 L 75 122 Q 50 100 27 122 Z" fill="#ff7a59"/>
      <rect x="20" y="117" width="62" height="6" rx="3" fill="#e8553b"/>
      <!-- Eye -->
      <circle cx="60" cy="130" r="6" fill="#1c1330"/>
      <circle cx="62" cy="128" r="2" fill="#fff"/>
      <!-- Smile -->
      <path d="M 38 144 Q 50 152 60 144" stroke="#1c1330" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <!-- Brush -->
      <line x1="20" y1="146" x2="-2" y2="160" stroke="#8a6bff" stroke-width="6" stroke-linecap="round"/>
      <circle cx="-3" cy="161" r="6" fill="#ffc857"/>
    </svg>
  `;
}

document.addEventListener('DOMContentLoaded', () => App.init());
