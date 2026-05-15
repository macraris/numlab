# L'Isola di Pina — sito educativo trilingue

Sito statico responsive per bambine e bambini di 7-9 anni: manuale Python con la
Tartaruga Pina (42 capitoli), 17 tecniche visive di moltiplicazione, modulo
interattivo del "trucco del 9", appendice di esercizi (50 sfide + 30 debug +
schede stampabili), galleria dei disegni Turtle.

Tre lingue: **italiano (default)**, **inglese**, **francese**.

## Stack

- Sito statico **vanilla HTML / CSS / JS** (nessun framework, nessun bundler).
- Build step in **Node.js puro** (ESM) che converte `MANUALE.md` /
  `APPENDICE_ESERCIZI.md` in JSON e produce gli overlay i18n.
- **Hash-based SPA router** lato client, i18n con `localStorage`, switch lingua
  istantaneo.
- Renderer Markdown **scritto a mano** (`public/js/md.js`) — zero dipendenze,
  audit-friendly, ~150 righe.
- Modulo "Trucco del 9" copiato in `public/trucco9/` e linkato come pagina
  standalone (ha già il suo HTML/CSS/JS, funziona offline).
- Font: **Quicksand + Fredoka** (display) + **JetBrains Mono** (codice), via
  Google Fonts.
- Design system kid-friendly con palette warm-2026 (coral / mint / sun / sky /
  grape), gradienti soft, ombre morbide, animazione `float` sul personaggio.

Motivazione: per un sito statico di questa dimensione (3300 righe di markdown +
i18n a tre lingue + assets esistenti) un framework SSG sarebbe overkill. Una
soluzione vanilla:
- è **deployabile su Netlify senza build server** (`publish = public`, basta)
- ha **time-to-first-byte ottimo** (HTML 1 KB, JSON pre-parsato)
- **non dipende da node_modules** o aggiornamenti di pacchetti
- è **leggibile da chiunque** in futuro per modificare i contenuti

## Struttura

```
sito_bimba/
├── netlify.toml                # config Netlify
├── package.json                # scripts npm (build, start)
├── README.md
├── scripts/
│   ├── parse-manuale.mjs       # MANUALE.md → public/data/manuale.json
│   ├── translate.mjs           # overlay IT/EN/FR (titoli + sommari)
│   └── post-build.mjs          # verifica file richiesti
├── screenshots/                # 16 screenshot di Edge headless (1440×.. e 390×..)
└── public/                     # ← cartella da pubblicare su Netlify
    ├── index.html              # shell SPA
    ├── css/app.css             # design system completo
    ├── js/
    │   ├── app.js              # router, i18n, viste, progress
    │   └── md.js               # markdown renderer
    ├── i18n/
    │   ├── it.json             # UI in italiano
    │   ├── en.json             # UI in inglese
    │   └── fr.json             # UI in francese
    ├── data/
    │   ├── manuale.json        # raw parse del MANUALE.md
    │   ├── manuale.it.json     # titoli IT
    │   ├── manuale.en.json     # titoli + sommari EN
    │   ├── manuale.fr.json     # titoli + sommari FR
    │   ├── appendice.*.json
    │   ├── tecniche.json       # 18 schede (cover + 17) con testi IT/EN/FR
    │   └── gallery.json        # 38 disegni Turtle con didascalie IT/EN/FR
    ├── assets/
    │   ├── turtle/             # 38 PNG di output Turtle
    │   ├── tecniche/           # 18 PNG illustrate
    │   ├── tecniche_svg/       # 18 SVG vettoriali equivalenti
    │   └── code/               # 38 file .py degli esempi (scaricabili)
    └── trucco9/                # modulo interattivo standalone, integrale
```

## Come gira in locale

```bash
npm run build      # genera tutti i JSON in public/data/
npm run start      # server statico su http://localhost:4173
```

Poi apri `http://localhost:4173/`. Tutto funziona offline tranne i font Google.

## Deploy su Netlify

### Opzione A — git push (consigliato)

1. `git init && git add . && git commit -m "Sito Pina"`
2. Crea un nuovo sito su [app.netlify.com](https://app.netlify.com).
3. Collega il repo.
4. Netlify legge automaticamente `netlify.toml`:
   - `command = npm run build`
   - `publish = public`
5. Build attivo. Sito disponibile in pochi secondi.

### Opzione B — drag & drop

1. Esegui `npm run build` in locale.
2. Vai su [app.netlify.com/drop](https://app.netlify.com/drop).
3. Trascina la cartella **`public/`** (non la root!).
4. Sito disponibile immediatamente.

## i18n strategy (onestà didattica)

Il manuale Python sorgente è di ~2350 righe in italiano denso (storia,
metodologie pedagogiche internazionali, dialoghi Pilota/Navigatrice).
Tradurre tutto a mano in EN/FR in un'unica sessione produrrebbe traduzioni
google-translate-quality non degne dell'opera. Scelta fatta:

- **UI**: tradotta integralmente e con cura nei tre file `i18n/*.json`.
- **Titoli e nomi**: tradotti integralmente nei file `manuale.{en,fr}.json` e
  `appendice.{en,fr}.json` (titoli di tutte le 10 Parti, 42 capitoli, 14
  sezioni dell'appendice).
- **Sommari di ogni capitolo**: scritti a mano in EN/FR (un riassunto onesto
  di 1-2 frasi per capitolo, visibile in cima a ogni pagina-capitolo).
- **Tecniche di moltiplicazione**: testo completo, scritto a mano e nativo in
  tutte e tre le lingue (sono brevi, era fattibile farle bene).
- **Corpo lungo dei capitoli del manuale**: rimane in italiano originale; le
  pagine EN/FR mostrano un banner trasparente che lo spiega ("the long text is
  in original Italian"). Soluzione fra l'onesto e il pragmatico.

Cosa fare per arrivare a un EN/FR full-body in futuro:
1. Si può integrare DeepL/Anthropic via uno script `scripts/translate-bodies.mjs`
   che generi `public/data/manuale-bodies.{en,fr}.json` partendo dal markdown
   raw e usando i chunk per capitolo. L'app `app.js` è già pronta a leggere
   `chapter.content_<lang>` se valorizzato. (~ 2-3 ore di lavoro di un singolo
   passaggio API.)

## Accessibilità

- Contrasti testati AAA su `--c-ink`/`--c-bg`.
- Focus visibile con outline `#8a6bff` su tutti gli elementi interattivi.
- `:focus-visible` per non disturbare il mouse user.
- `alt` text su tutte le immagini (dalla gallery + dai capitoli + dalle tecniche).
- `aria-label` su tutti i pulsanti icona-only.
- Skip-link al main content.
- `prefers-reduced-motion` rispettato (disattiva float, transition).
- Lang attribute aggiornato dinamicamente.

## Responsive (testato)

| viewport | risultato |
|---|---|
| 360 px (mobile S) | menu hamburger; cards full-width; turtle SVG sopra |
| 768 px (tablet) | nav inline; card-grid a 2 colonne; hero a 1 colonna |
| 1024 px (laptop) | nav inline; card-grid a 3-4 colonne |
| 1440 px (desktop) | layout completo, container 1180 px |
| 1920 px (large) | container resta a 1180 px (no overflow su monitor 4K) |

Screenshot in `screenshots/`.

## Gamification

LocalStorage key: `pina-progress-v1`. Struttura:

```json
{
  "chapters":   [6, 9, 10],        // capitoli letti
  "techniques": ["trucco9_intro"], // tecniche visitate
  "sections":   [1, 3]             // sezioni dell'appendice aperte
}
```

6 badge sbloccabili:
- Prima Lettura (1 capitolo letto)
- Esploratrice (5 capitoli letti)
- Parte Completa (tutti i capitoli di una Parte)
- Mago dei Numeri (tutte le 17 tecniche viste)
- Trucco del 9 (la card del trucco del 9 visitata)
- Pina Maestra (tutti i 42 capitoli letti)

Pulsante "Azzera i miei progressi" sulla pagina `#/progress`.

## Privacy

- Zero tracking, zero analytics, zero cookie di terze parti.
- Google Fonts caricati via CDN (HTTP cache friendly, niente tracker).
- Nessun localStorage usato fuori da `pina-progress-v1` e `pina-lang-v1`.

## Crediti

Tutti i contenuti pedagogici sorgente sono stati prodotti dall'autore.
Le metodologie citate (Constructionism MIT, CPA Singapore, PRIMM NCCE-UK,
Hello Ruby di Linda Liukas, Magic Makers Francia, CS Unplugged Nuova Zelanda,
Pensar Argentina, Tangible Africa) sono attribuite nei capitoli relativi.

🐢 Fatto con cura per chi sta crescendo.
